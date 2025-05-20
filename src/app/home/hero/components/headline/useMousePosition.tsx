// src/app/home/components/headline/useMousePosition.ts
import { useState, useEffect } from 'react'
import { animationManager } from '@/components/core/Animations/utils/AnimationManager'

interface MousePosition {
  x: number
  y: number
}

export function useMousePosition() {
  const [position, setPosition] = useState<MousePosition>({ x: 0.5, y: 0.5 })

  useEffect(() => {
    // Track mouse movement through the animation manager for performance
    const uniqueId = `mouse-position-${Math.random().toString(36).substring(2, 9)}`

    const handleMouseMove = (e: MouseEvent) => {
      // Get normalized position (0-1)
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight

      setPosition({ x, y })
    }

    // Throttled event listener via animation manager
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Center mouse on mobile devices
    if ('ontouchstart' in window) {
      setPosition({ x: 0.5, y: 0.5 })
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return position
}