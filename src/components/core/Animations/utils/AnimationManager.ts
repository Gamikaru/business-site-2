// src/components/core/Animations/utils/AnimationManager.ts
/**
 * AnimationManager
 *
 * A singleton service that centralizes animation-related operations:
 * - Shares scroll/resize listeners across components
 * - Integrates with Framer Motion's hooks when available
 * - Provides optimized access to scroll/viewport metrics
 * - Tracks active animations for performance monitoring
 */
import { useScroll as useFramerScroll, useTransform as useFramerTransform, useMotionValueEvent } from 'framer-motion'

type ScrollHandler = (scrollY: number) => void
type ResizeHandler = (width: number, height: number) => void
type VisibilityHandler = (entry: IntersectionObserverEntry) => void
type AnimationTracker = { id: string; type: string; startTime: number }
type AnimationTickHandler = (time: number) => void

interface AnimationMetrics {
  activeDOMAnimations: number
  scrollListenerCount: number
  resizeListenerCount: number
  intersectionObserverCount: number
  averageFrameTime: number
  lastFrameTime: number
}

// Internal debounce function
function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
      timer = null
    }, delay)
  }
}

class AnimationManager {
  private static instance: AnimationManager

  private scrollHandlers: Map<string, ScrollHandler> = new Map()
  private resizeHandlers: Map<string, ResizeHandler> = new Map()
  private visibilityObservers: Map<string, IntersectionObserver> = new Map()
  private visibilityElements: Map<HTMLElement, Set<string>> = new Map()
  private activeAnimations: Map<string, AnimationTracker> = new Map()
  private tickHandlers: Map<string, AnimationTickHandler> = new Map()
  private frameListeners: Set<(time: number) => void> = new Set()

  private isScrolling: boolean = false
  private lastScrollY: number = 0
  private lastFrameTime: number = 0
  private frameTimes: number[] = []
  private frameTimesMaxLength: number = 20
  private ticking: boolean = false
  private enabled: boolean = true
  private debugMode: boolean = false
  private useFramerMotion: boolean = false

  // Options that can be configured
  private throttleScrollMs: number = 16 // ~60fps
  private throttleResizeMs: number = 100
  private defaultRootMargin: string = '0px'
  private defaultThreshold: number[] = [0, 0.1, 0.2, 0.5, 1.0]

  // IntersectionObserver root element (default: viewport)
  private observerRoot: HTMLElement | null = null

  // Singleton pattern
  public static getInstance(): AnimationManager {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager()
    }
    return AnimationManager.instance
  }

  private constructor() {
    // Initialize the manager
    this.initialize()
  }

  /**
   * Initialize the animation manager and set up global listeners
   */
  private initialize(): void {
    if (typeof window === 'undefined') return

    // Set initial values
    this.lastScrollY = window.scrollY

    // Set up the scroll listener (single instance for all components)
    window.addEventListener(
      'scroll',
      this.handleScroll,
      { passive: true } // Performance optimization
    )

    // Set up the resize listener (single instance for all components)
    window.addEventListener(
      'resize',
      debounce(this.handleResize, this.throttleResizeMs),
      { passive: true }
    )

    // Setup animation frame handler
    this.tick()

    // Try to detect Framer Motion
    try {
      // This is a lightweight check to see if Framer Motion might be available
      this.useFramerMotion = typeof useFramerScroll === 'function'
      if (this.debugMode && this.useFramerMotion) {
        console.log('[AnimationManager] Framer Motion hooks detected and will be used when possible')
      }
    } catch (e) {
      this.useFramerMotion = false
    }
  }

  /**
   * Handle scroll events and notify subscribers
   */
  private handleScroll = (): void => {
    this.lastScrollY = window.scrollY
    this.isScrolling = true

    // Request a tick if we're not already ticking
    if (!this.ticking) {
      this.ticking = true
      requestAnimationFrame(this.processTick)
    }
  }

  /**
   * Handle resize events and notify subscribers
   */
  private handleResize = (): void => {
    const width = window.innerWidth
    const height = window.innerHeight

    // Notify all resize handlers
    this.resizeHandlers.forEach(handler => {
      try {
        handler(width, height)
      } catch (err) {
        console.error('Error in resize handler:', err)
      }
    })
  }

  /**
   * Process animation frame updates
   */
  private processTick = (time: number): void => {
    // Calculate frame time for performance monitoring
    const delta = this.lastFrameTime ? time - this.lastFrameTime : 0
    this.lastFrameTime = time

    if (delta > 0) {
      this.frameTimes.push(delta)
      if (this.frameTimes.length > this.frameTimesMaxLength) {
        this.frameTimes.shift()
      }
    }

    // Process scroll updates if we're scrolling
    if (this.isScrolling) {
      this.scrollHandlers.forEach(handler => {
        try {
          handler(this.lastScrollY)
        } catch (err) {
          console.error('Error in scroll handler:', err)
        }
      })
      this.isScrolling = false
    }

    // Call all registered tick handlers
    this.tickHandlers.forEach(handler => {
      try {
        handler(time)
      } catch (err) {
        console.error('Error in animation tick handler:', err)
      }
    })

    // Call frame listeners (for Framer Motion integration)
    this.frameListeners.forEach(listener => {
      try {
        listener(time)
      } catch (err) {
        console.error('Error in frame listener:', err)
      }
    })

    this.ticking = false

    // Schedule next tick if we have animations or scroll
    if (this.enabled && (this.tickHandlers.size > 0 || this.isScrolling || this.frameListeners.size > 0)) {
      this.ticking = true
      requestAnimationFrame(this.processTick)
    }
  }

  /**
   * Schedule the animation frame loop
   */
  private tick(): void {
    if (!this.ticking && this.enabled) {
      this.ticking = true
      requestAnimationFrame(this.processTick)
    }
  }

  /**
   * Add a listener to be called on each animation frame
   * @param listener Function to call on each frame
   * @returns Function to remove the listener
   */
  public addFrameListener(listener: (time: number) => void): () => void {
    this.frameListeners.add(listener)
    this.tick()

    return () => {
      this.frameListeners.delete(listener)
    }
  }

  /**
   * Check if Framer Motion hooks are available
   */
  public canUseFramerMotion(): boolean {
    return this.useFramerMotion
  }

  /**
   * Register a scroll handler
   * @param id Unique identifier for the handler
   * @param handler Function to call on scroll
   */
  public subscribeToScroll(id: string, handler: ScrollHandler): void {
    this.scrollHandlers.set(id, handler)

    // Immediately provide current scroll position
    handler(this.lastScrollY)

    // Ensure the animation loop is running
    this.tick()

    if (this.debugMode) {
      console.log(`[AnimationManager] Scroll handler registered: ${id}`)
    }
  }

  /**
   * Unregister a scroll handler
   * @param id Identifier of the handler to remove
   */
  public unsubscribeFromScroll(id: string): void {
    this.scrollHandlers.delete(id)

    if (this.debugMode) {
      console.log(`[AnimationManager] Scroll handler unregistered: ${id}`)
    }
  }

  /**
   * Register a resize handler
   * @param id Unique identifier for the handler
   * @param handler Function to call on resize
   */
  public subscribeToResize(id: string, handler: ResizeHandler): void {
    this.resizeHandlers.set(id, handler)

    // Immediately provide current dimensions
    handler(window.innerWidth, window.innerHeight)

    if (this.debugMode) {
      console.log(`[AnimationManager] Resize handler registered: ${id}`)
    }
  }

  /**
   * Unregister a resize handler
   * @param id Identifier of the handler to remove
   */
  public unsubscribeFromResize(id: string): void {
    this.resizeHandlers.delete(id)

    if (this.debugMode) {
      console.log(`[AnimationManager] Resize handler unregistered: ${id}`)
    }
  }

  /**
   * Register an element to be observed for visibility changes
   * @param id Unique identifier for the handler
   * @param element DOM element to observe
   * @param handler Function to call when visibility changes
   * @param options IntersectionObserver options
   */
  public observeElementVisibility(
    id: string,
    element: HTMLElement,
    handler: VisibilityHandler,
    options?: IntersectionObserverInit
  ): void {
    if (!element) return

    const rootMargin = options?.rootMargin || this.defaultRootMargin
    const threshold = options?.threshold || this.defaultThreshold
    const root = options?.root || this.observerRoot

    // Create a unique key for this observer configuration
    const observerKey = `${rootMargin}|${threshold}|${root ? 'custom' : 'viewport'}`

    // Create or reuse an IntersectionObserver
    if (!this.visibilityObservers.has(observerKey)) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            // Find all handlers for this element
            const elementMap = this.visibilityElements.get(entry.target as HTMLElement)
            if (elementMap) {
              elementMap.forEach(handlerId => {
                // Find the handler with this ID
                const elementHandler = this.scrollHandlers.get(handlerId)
                if (elementHandler && typeof elementHandler === 'function') {
                  try {
                    // Actually it's a visibility handler masquerading as a scroll handler
                    (elementHandler as unknown as VisibilityHandler)(entry)
                  } catch (err) {
                    console.error('Error in visibility handler:', err)
                  }
                }
              })
            }
          })
        },
        { root, rootMargin, threshold }
      )

      this.visibilityObservers.set(observerKey, observer)
    }

    // Get the observer
    const observer = this.visibilityObservers.get(observerKey)!

    // Track this element and its handler ID
    if (!this.visibilityElements.has(element)) {
      this.visibilityElements.set(element, new Set())
    }
    this.visibilityElements.get(element)!.add(id)

    // Store the handler
    this.scrollHandlers.set(id, handler as unknown as ScrollHandler)

    // Start observing
    observer.observe(element)

    if (this.debugMode) {
      console.log(`[AnimationManager] Element observation started: ${id}`)
    }
  }

  /**
   * Stop observing an element for visibility changes
   * @param id Handler identifier to remove
   * @param element Element being observed
   */
  public unobserveElementVisibility(id: string, element: HTMLElement): void {
    if (!element) return

    // Remove the handler
    this.scrollHandlers.delete(id)

    // Update the element's handler set
    const elementHandlers = this.visibilityElements.get(element)
    if (elementHandlers) {
      elementHandlers.delete(id)

      // If no more handlers for this element, stop observing it
      if (elementHandlers.size === 0) {
        this.visibilityElements.delete(element)

        // Unobserve the element from all observers
        this.visibilityObservers.forEach(observer => {
          observer.unobserve(element)
        })
      }
    }

    // Clean up observers with no elements
    this.visibilityObservers.forEach((observer, key) => {
      let hasElements = false

      // Check if any elements are still being observed
      this.visibilityElements.forEach(handlers => {
        if (handlers.size > 0) {
          hasElements = true
        }
      })

      if (!hasElements) {
        observer.disconnect()
        this.visibilityObservers.delete(key)
      }
    })

    if (this.debugMode) {
      console.log(`[AnimationManager] Element observation stopped: ${id}`)
    }
  }

  /**
   * Register an animation for tracking
   * @param id Unique identifier for the animation
   * @param type Type of animation (useful for debugging)
   */
  public trackAnimation(id: string, type: string): void {
    this.activeAnimations.set(id, {
      id,
      type,
      startTime: performance.now()
    })

    if (this.debugMode) {
      console.log(`[AnimationManager] Animation tracked: ${id} (${type})`)
    }
  }

  /**
   * Unregister an animation from tracking
   * @param id Identifier of the animation
   */
  public untrackAnimation(id: string): void {
    this.activeAnimations.delete(id)

    if (this.debugMode) {
      console.log(`[AnimationManager] Animation untracked: ${id}`)
    }
  }

  /**
   * Register a handler for animation frame updates
   * @param id Unique identifier for the handler
   * @param handler Function to call on each animation frame
   */
  public subscribeToAnimationTick(id: string, handler: AnimationTickHandler): void {
    this.tickHandlers.set(id, handler)

    // Ensure the animation loop is running
    this.tick()

    if (this.debugMode) {
      console.log(`[AnimationManager] Animation tick handler registered: ${id}`)
    }
  }

  /**
   * Unregister a handler for animation frame updates
   * @param id Identifier of the handler to remove
   */
  public unsubscribeFromAnimationTick(id: string): void {
    this.tickHandlers.delete(id)

    if (this.debugMode) {
      console.log(`[AnimationManager] Animation tick handler unregistered: ${id}`)
    }
  }

  /**
   * Get the current animation metrics for performance monitoring
   */
  public getMetrics(): AnimationMetrics {
    const averageFrameTime = this.frameTimes.length
      ? this.frameTimes.reduce((sum, time) => sum + time, 0) / this.frameTimes.length
      : 0

    return {
      activeDOMAnimations: this.activeAnimations.size,
      scrollListenerCount: this.scrollHandlers.size,
      resizeListenerCount: this.resizeHandlers.size,
      intersectionObserverCount: this.visibilityObservers.size,
      averageFrameTime,
      lastFrameTime: this.lastFrameTime
    }
  }

  /**
   * Enable or disable all animations system-wide
   * @param enabled Whether animations should be enabled
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled

    if (enabled && !this.ticking) {
      this.tick()
    }

    if (this.debugMode) {
      console.log(`[AnimationManager] Animations ${enabled ? 'enabled' : 'disabled'}`)
    }
  }

  /**
   * Set debug mode for verbose logging
   * @param enabled Whether debug mode should be enabled
   */
  public setDebugMode(enabled: boolean): void {
    this.debugMode = enabled
    console.log(`[AnimationManager] Debug mode ${enabled ? 'enabled' : 'disabled'}`)
  }

  /**
   * Configure the animation manager settings
   * @param options Configuration options
   */
  public configure(options: {
    throttleScrollMs?: number
    throttleResizeMs?: number
    defaultRootMargin?: string
    defaultThreshold?: number[]
    observerRoot?: HTMLElement | null
    useFramerMotion?: boolean
  }): void {
    if (options.throttleScrollMs !== undefined) {
      this.throttleScrollMs = options.throttleScrollMs
    }

    if (options.throttleResizeMs !== undefined) {
      this.throttleResizeMs = options.throttleResizeMs
    }

    if (options.defaultRootMargin !== undefined) {
      this.defaultRootMargin = options.defaultRootMargin
    }

    if (options.defaultThreshold !== undefined) {
      this.defaultThreshold = options.defaultThreshold
    }

    if (options.observerRoot !== undefined) {
      this.observerRoot = options.observerRoot
    }

    if (options.useFramerMotion !== undefined) {
      this.useFramerMotion = options.useFramerMotion
    }

    if (this.debugMode) {
      console.log('[AnimationManager] Configuration updated:', {
        throttleScrollMs: this.throttleScrollMs,
        throttleResizeMs: this.throttleResizeMs,
        defaultRootMargin: this.defaultRootMargin,
        defaultThreshold: this.defaultThreshold,
        observerRoot: this.observerRoot ? 'custom' : 'viewport',
        useFramerMotion: this.useFramerMotion
      })
    }
  }

  /**
   * Clean up all resources when the manager is no longer needed
   * Usually only needed for testing or hot reloading
   */
  public destroy(): void {
    if (typeof window === 'undefined') return

    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', this.handleResize)

    this.visibilityObservers.forEach(observer => {
      observer.disconnect()
    })

    this.scrollHandlers.clear()
    this.resizeHandlers.clear()
    this.visibilityObservers.clear()
    this.visibilityElements.clear()
    this.activeAnimations.clear()
    this.tickHandlers.clear()
    this.frameListeners.clear()

    this.isScrolling = false
    this.ticking = false

    if (this.debugMode) {
      console.log('[AnimationManager] Destroyed')
    }
  }
}

// Export a singleton instance
export const animationManager = AnimationManager.getInstance()

// Also export the class for testing or special use cases
export { AnimationManager }