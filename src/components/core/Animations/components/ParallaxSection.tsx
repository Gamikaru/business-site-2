// src/components/core/Animations/components/ParallaxSection.tsx
"use client"

import React, { ReactNode, forwardRef } from "react"
import { HTMLMotionProps } from "framer-motion"
import { useParallax } from "../hooks/useParallax"
import { Motion } from "../providers/MotionProvider"

interface ParallaxSectionProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  children: ReactNode
  className?: string
  offset?: number
  direction?: "up" | "down" | "left" | "right"
  speed?: number
  easing?: [number, number, number, number]
  zIndex?: number
  container?: React.RefObject<HTMLElement>
  smooth?: boolean
  perspective?: number // Add 3D perspective for more realistic parallax
}

const ParallaxSection = forwardRef<HTMLDivElement, ParallaxSectionProps>(
  (
    {
      children,
      className = "",
      offset = 100,
      direction = "up",
      speed = 1,
      easing = [0.42, 0, 0.58, 1],
      zIndex,
      container,
      smooth = false,
      perspective = 0, // Default to 0 (no perspective)
      ...motionProps
    },
    forwardedRef
  ) => {
    const {
      ref,
      transformValue,
      direction: finalDirection,
      usingFramer
    } = useParallax({
      offset,
      direction,
      speed,
      easing,
      containerRef: container,
      smooth
    })

    // Set the ref using both the forwarded ref and the hook ref
    const setRefs = (element: HTMLDivElement) => {
      // Set the ref from useParallax
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = element

      // Forward the ref if it exists
      if (forwardedRef) {
        if (typeof forwardedRef === "function") {
          forwardedRef(element)
        } else {
          (
            forwardedRef as React.MutableRefObject<HTMLDivElement | null>
          ).current = element
        }
      }
    }

    // Determine the appropriate transform property based on direction
    const isHorizontal = finalDirection === "left" || finalDirection === "right"

    // Style with perspective if specified
    const perspectiveStyle = perspective > 0
      ? { perspective: `${perspective}px` }
      : undefined

    return (
      <Motion.div
        ref={setRefs}
        className={className}
        style={{
          ...(isHorizontal
            ? { x: transformValue }
            : { y: transformValue }),
          zIndex,
          willChange: "transform", // Performance optimization
          ...perspectiveStyle
        }}
        transition={{
          type: smooth ? "spring" : "tween",
          duration: smooth ? undefined : 0.1 // Small duration for tween fallback
        }}
        {...motionProps}
      >
        {children}
      </Motion.div>
    )
  }
)

ParallaxSection.displayName = "ParallaxSection"

export default ParallaxSection