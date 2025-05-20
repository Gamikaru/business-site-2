// src/components/core/Animations/components/GlitchEffect.tsx
'use client'

import React, { memo, useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAnimationPreferences } from '../hooks/useAnimationPreferences'
import { animationManager } from '../utils/AnimationManager'

interface GlitchEffectProps {
  children: React.ReactNode
  isActive?: boolean
  intensity?: 'low' | 'medium' | 'high'
  frequency?: number
  className?: string
  id?: string
}

const GlitchEffect: React.FC<GlitchEffectProps> = ({
  children,
  isActive = false,
  intensity = 'medium',
  frequency = 3000,
  className = '',
  id: providedId
}) => {
  const { shouldAnimate, reducedMotion } = useAnimationPreferences()
  const uniqueId = useRef(`glitch-effect-${providedId || Math.random().toString(36).substring(2, 9)}`)
  const [glitchState, setGlitchState] = useState({
    active: isActive,
    intensityLevel: intensity === 'high' ? 2 : intensity === 'medium' ? 1 : 0,
    offsets: [0, 0, 0]
  })

  // Auto glitch effect
  useEffect(() => {
    if (!shouldAnimate() || reducedMotion) return

    const intervalTime = typeof frequency === 'number' ? frequency : 3000

    const glitchInterval = setInterval(() => {
      // Random chance of glitching
      if (Math.random() > 0.6) {
        const intensityVal = intensity === 'high' ? 2 : intensity === 'medium' ? 1 : 0

        // Set glitch active with random offsets
        setGlitchState({
          active: true,
          intensityLevel: intensityVal,
          offsets: [
            (Math.random() - 0.5) * (intensityVal + 1) * 10,
            (Math.random() - 0.5) * (intensityVal + 1) * 10,
            (Math.random() - 0.5) * (intensityVal + 1) * 10,
          ]
        })

        // Track the glitch animation
        animationManager.trackAnimation(uniqueId.current, 'glitch-effect')

        // Reset after a short time
        setTimeout(() => {
          setGlitchState(prev => ({
            ...prev,
            active: false
          }))

          animationManager.untrackAnimation(uniqueId.current)
        }, 150 + Math.random() * 100)
      }
    }, intervalTime)

    return () => {
      clearInterval(glitchInterval)
      animationManager.untrackAnimation(uniqueId.current)
    }
  }, [shouldAnimate, reducedMotion, intensity, frequency])

  // Manual trigger from props
  useEffect(() => {
    if (isActive && shouldAnimate() && !reducedMotion) {
      setGlitchState(prev => ({
        ...prev,
        active: true
      }))

      animationManager.trackAnimation(uniqueId.current, 'glitch-effect-manual')
    } else if (!isActive) {
      setGlitchState(prev => ({
        ...prev,
        active: false
      }))

      animationManager.untrackAnimation(uniqueId.current)
    }
  }, [isActive, shouldAnimate, reducedMotion])

  // If animations disabled or reduced motion, just render children
  if (reducedMotion || !shouldAnimate()) {
    return <>{children}</>
  }

  // Intensity class based on level
  const intensityClass = glitchState.intensityLevel === 2
    ? 'intensive-glitch'
    : glitchState.intensityLevel === 1
      ? 'medium-glitch'
      : 'subtle-glitch'

  return (
    <div
      className={`${className} ${glitchState.active ? 'glitch-active' : ''} ${glitchState.active ? intensityClass : ''}`}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Main content */}
      {children}

      {/* Glitch layers - only rendered when active */}
      {glitchState.active && (
        <>
          <div
            className="glitch-layer glitch-red"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              transform: `translate3d(${glitchState.offsets[0]}px, 0, 0)`,
              mixBlendMode: 'multiply',
              opacity: 0.5,
              zIndex: 2,
              pointerEvents: 'none'
            }}
          >
            {children}
          </div>

          <div
            className="glitch-layer glitch-blue"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              transform: `translate3d(${glitchState.offsets[1]}px, 0, 0)`,
              mixBlendMode: 'screen',
              opacity: 0.5,
              zIndex: 3,
              pointerEvents: 'none'
            }}
          >
            {children}
          </div>
        </>
      )}

      <style jsx>{`
        .glitch-active {
          animation: ${glitchState.active ? 'glitch-anim 300ms infinite' : 'none'};
        }

        .glitch-red {
          filter: url(#glitch-red);
        }

        .glitch-blue {
          filter: url(#glitch-blue);
        }

        .intensive-glitch .glitch-layer {
          clip-path: polygon(0 ${glitchState.offsets[2]}%, 100% ${glitchState.offsets[0]}%, 100% ${100 - glitchState.offsets[1]}%, 0 ${100 - glitchState.offsets[2]}%);
        }

        @keyframes glitch-anim {
          0% { transform: skew(0.5deg); }
          20% { transform: skew(-0.5deg); }
          40% { transform: skew(0.25deg); }
          60% { transform: skew(-0.25deg); }
          80% { transform: skew(0.1deg); }
          100% { transform: skew(0); }
        }
      `}</style>
    </div>
  )
}

export default memo(GlitchEffect)