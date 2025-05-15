# Animation System Documentation

This document provides guidance on how to use the animation system in your components effectively. The animation system is built on Framer Motion and provides a suite of reusable components, hooks, and utilities to create consistent animations throughout the application.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Animation Components](#animation-components)
3. [Animation Hooks](#animation-hooks)
4. [Animation Variants](#animation-variants)
5. [Utility Functions](#utility-functions)
6. [Examples](#examples)
7. [Best Practices](#best-practices)

## Getting Started

### Setup

First, wrap your application (or the part that needs animations) with the `AnimationProvider`:

```tsx
import { AnimationProvider } from '@/components/core/Animations';

function App() {
  return (
    <AnimationProvider>
      <YourApp />
    </AnimationProvider>
  );
}
```

This provider ensures that animations respect user preferences like reduced motion and provides consistent animation timing across components.

## Animation Components

### ScrollReveal

Reveals elements as they scroll into view.

```tsx
import { ScrollReveal } from '@/components/core/Animations';

function MyComponent() {
  return (
    <ScrollReveal
      direction="up"
      distance={50}
      delay={0.2}
      once={true}
    >
      <h2>This will animate in when scrolled into view</h2>
    </ScrollReveal>
  );
}
```

**Props:**
- `direction`: "up" | "down" | "left" | "right" | "scale" | "opacity" (default: "up")
- `distance`: number - pixels to move during animation (default: 50)
- `delay`: seconds to wait before animation starts (default: 0)
- `duration`: seconds the animation lasts (uses system defaults if not provided)
- `once`: boolean - whether to animate only once or every time element enters viewport (default: true)
- `threshold`: number between 0-1 - how much of element must be visible to trigger (default: 0.2)

### StaggerContainer

Creates staggered animations for multiple child elements.

```tsx
import { StaggerContainer } from '@/components/core/Animations';

function MyComponent() {
  return (
    <StaggerContainer delay={0.3} staggerDelay={0.1}>
      <motion.div>First item</motion.div>
      <motion.div>Second item</motion.div>
      <motion.div>Third item</motion.div>
    </StaggerContainer>
  );
}
```

**Props:**
- `delay`: seconds before animation sequence starts (default: 0)
- `staggerDelay`: seconds between each child animation (default: 0.1)
- `direction`: "forward" | "reverse" | "center" - animation order (default: "forward")
- `childVariants`: custom variants for children (uses default if not provided)

### TextReveal

Creates animated text reveals with optional character/word staggering.

```tsx
import { TextReveal } from '@/components/core/Animations';

function MyComponent() {
  return (
    <TextReveal
      splitBy="words"
      staggerChildren={true}
      as="h1"
    >
      This text will animate in word by word
    </TextReveal>
  );
}
```

**Props:**
- `splitBy`: "words" | "chars" | "none" - how to split the text (default: "none")
- `staggerChildren`: boolean - whether to stagger the animation of words/chars (default: false)
- `staggerDelay`: seconds between each staggered element (default: 0.02)
- `direction`: "up" | "down" - direction of animation (default: "up")
- `as`: React component type for the wrapper element (default: "div")

### ParallaxSection

Creates a parallax scrolling effect for elements.

```tsx
import { ParallaxSection } from '@/components/core/Animations';

function MyComponent() {
  return (
    <ParallaxSection
      direction="up"
      speed={1.2}
      offset={100}
    >
      <div>This content will move with a parallax effect</div>
    </ParallaxSection>
  );
}
```

**Props:**
- `direction`: "up" | "down" | "left" | "right" - direction of movement (default: "up")
- `speed`: number - speed multiplier for the effect (default: 1)
- `offset`: number - maximum pixels to move (default: 100)

### GestureElement

Creates interactive elements with gesture animations (hover, tap, drag, tilt).

```tsx
import { GestureElement } from '@/components/core/Animations';

function MyComponent() {
  return (
    <GestureElement
      tiltEnabled={true}
      scaleOnHover={true}
      dragEnabled={false}
    >
      <div>Interactive element</div>
    </GestureElement>
  );
}
```

**Props:**
- `tiltEnabled`: boolean - enables 3D tilt effect on hover (default: true)
- `tiltFactor`: number - intensity of tilt (default: 15)
- `scaleOnHover`: boolean - whether element scales on hover (default: true)
- `scaleAmount`: number - scale factor on hover (default: 1.03)
- `dragEnabled`: boolean - whether element can be dragged (default: false)
- `dragConstraints`: object or ref - limits of drag movement

### AnimatedPath

Animates SVG paths with drawing effects.

```tsx
import { AnimatedPath } from '@/components/core/Animations';

function MyComponent() {
  return (
    <svg>
      <AnimatedPath
        d="M10,10 L90,90"
        delay={0.2}
        duration={2}
        stroke="black"
      />
    </svg>
  );
}
```

**Props:**
- `d`: string - SVG path data
- `delay`: seconds before animation starts (default: 0)
- `duration`: seconds the animation lasts (default: 2)
- `repeat`: boolean or number - whether to repeat animation (default: false)

### AnimationSequence

Runs a sequence of animations with precise timing control.

```tsx
import { AnimationSequence } from '@/components/core/Animations';

function MyComponent() {
  const steps = [
    { id: "fade-in", duration: 0.5 },
    { id: "move", duration: 0.8, delayAfter: 0.2 },
    { id: "scale", duration: 0.5 }
  ];

  return (
    <AnimationSequence steps={steps} loop={false}>
      {(props) => (
        <div>
          Current step: {props.currentStep}
          Progress: {props.animationProgress}
        </div>
      )}
    </AnimationSequence>
  );
}
```

**Props:**
- `steps`: Array of animation step objects with id, duration, and optional delayAfter
- `startDelay`: seconds before sequence begins (default: 0)
- `loop`: boolean - whether to loop the sequence (default: false)
- `onComplete`: callback function run when sequence completes

### ScrollLinkedAnimation

Creates animations that progress based on scroll position.

```tsx
import { ScrollLinkedAnimation } from '@/components/core/Animations';

function MyComponent() {
  return (
    <ScrollLinkedAnimation
      scrubRange={[0.2, 0.8]}
      opacityRange={[0, 1]}
      translateYRange={[100, 0]}
    >
      <div>This animates as you scroll</div>
    </ScrollLinkedAnimation>
  );
}
```

**Props:**
- `scrubRange`: [number, number] - start and end points of animation as viewport percentage (default: [0, 1])
- `opacityRange`: [number, number] - opacity values to animate between
- `translateYRange`: [number, number] - Y translation values in pixels
- `scaleRange`: [number, number] - scale values to animate between
- `rotateRange`: [number, number] - rotation values in degrees

## Animation Hooks

### useAnimationPreferences

Access and utilize animation preferences.

```tsx
import { useAnimationPreferences } from '@/components/core/Animations';

function MyComponent() {
  const {
    shouldAnimate,
    getTransitionSettings,
    getIntensity,
    reducedMotion
  } = useAnimationPreferences();

  if (!shouldAnimate()) {
    return <StaticComponent />;
  }

  const { duration, ease } = getTransitionSettings('default', 0.5);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      transition={{ duration, ease }}
    >
      Animated content
    </motion.div>
  );
}
```

**Returns:**
- `shouldAnimate()`: function that returns boolean whether animations should run
- `getTransitionSettings(type, customDuration)`: function that returns appropriate duration and easing
- `getIntensity(defaultValue)`: function that returns appropriate animation intensity
- `reducedMotion`: boolean indicating if user prefers reduced motion
- `performance`: string indicating system's performance level ("low" | "medium" | "high")

### useParallax

Create customized parallax effects.

```tsx
import { useParallax } from '@/components/core/Animations';

function MyComponent() {
  const { ref, transformValue } = useParallax({
    direction: "up",
    speed: 1.5,
    offset: 200
  });

  return (
    <motion.div
      ref={ref}
      style={{ y: transformValue }}
    >
      Parallax content
    </motion.div>
  );
}
```

**Parameters:**
- `options`: object with direction, speed, offset, and easing settings

**Returns:**
- `ref`: ref to attach to your element
- `transformValue`: motion value for the transform property
- `direction`: final direction used for the effect

## Animation Variants

Pre-defined animation configurations that can be used with Framer Motion components.

### Basic Variants

```tsx
import { fadeVariants, slideUpVariants, popUpVariants } from '@/components/core/Animations';
import { motion } from 'framer-motion';

function MyComponent() {
  return (
    <>
      <motion.div
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        This fades in and out
      </motion.div>

      <motion.div variants={slideUpVariants} initial="hidden" animate="visible">
        This slides up into view
      </motion.div>

      <motion.div variants={popUpVariants} initial="hidden" animate="visible">
        This pops into view with a spring effect
      </motion.div>
    </>
  );
}
```

**Available basic variants:**
- `fadeVariants`: Simple opacity transition
- `slideUpVariants`, `slideDownVariants`, `slideLeftVariants`, `slideRightVariants`: Slide from direction
- `scaleVariants`: Scale in/out animation
- `hoverScaleVariants`: Interactive hover/tap scale effects
- `popUpVariants`: Combined scale and slide animation

### Text Variants

```tsx
import { textRevealVariants, wordStaggerVariants, wordVariants } from '@/components/core/Animations';
import { motion } from 'framer-motion';

function MyComponent() {
  return (
    <motion.div
      variants={wordStaggerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.span variants={wordVariants}>Each</motion.span>
      <motion.span variants={wordVariants}>word</motion.span>
      <motion.span variants={wordVariants}>animates</motion.span>
      <motion.span variants={wordVariants}>separately</motion.span>
    </motion.div>
  );
}
```

**Available text variants:**
- `textRevealVariants`: General text reveal animation
- `charStaggerVariants` & `charVariants`: For character-by-character animation
- `wordStaggerVariants` & `wordVariants`: For word-by-word animation
- `lineRevealVariants`: For paragraph-line reveals
- `cursorVariants`: For typewriter cursor effects

### Container Variants

```tsx
import {
  staggerContainerVariants,
  staggerItemVariants,
  cardVariants
} from '@/components/core/Animations';
import { motion } from 'framer-motion';

function MyComponent() {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {items.map(item => (
        <motion.div key={item.id} variants={staggerItemVariants}>
          {item.content}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

**Available container variants:**
- `staggerContainerVariants` & `staggerItemVariants`: For staggered animations
- `gridContainerVariants` & `gridItemVariants`: For grid layouts
- `cardVariants`: For interactive card elements
- `heroContainerVariants` & `heroItemVariants`: For hero section layouts

### Page Transition Variants

```tsx
import { fadeUpPageVariants } from '@/components/core/Animations';
import { motion } from 'framer-motion';

function Page() {
  return (
    <motion.div
      variants={fadeUpPageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      Page content
    </motion.div>
  );
}
```

**Available page variants:**
- `pageTransitionVariants`: Basic page transitions
- `fadeUpPageVariants`: Page transitions with upward movement
- `slidePageVariants`: Page transitions with horizontal movement
- `contentAfterPageLoadVariants`: For content that loads after page transition
- `mobilePageTransitionVariants`: Optimized for mobile devices

### Complex Animation Variants

```tsx
import { pathFollowVariants, elasticVariants } from '@/components/core/Animations';
import { motion } from 'framer-motion';

function MyComponent() {
  return (
    <>
      <motion.path
        d="M10,10 L90,90"
        variants={pathFollowVariants}
        initial="hidden"
        animate="visible"
      />

      <motion.div variants={elasticVariants} initial="hidden" animate="visible">
        Bouncy element
      </motion.div>
    </>
  );
}
```

**Available complex variants:**
- `pathFollowVariants` & `drawSVGVariants`: For SVG animations
- `elasticVariants`: For bouncy animations
- `counterVariants`: For number counter animations
- `rotateVariants` & `flipVariants`: For rotation effects
- `tiltVariants`: For 3D tilt effects

## Utility Functions

### Device-Specific Animations

```tsx
import {
  useDeviceVariants,
  useDeviceAnimation,
  useShouldEnableEffect
} from '@/components/core/Animations';

function MyComponent() {
  // Switch variants based on device
  const variants = useDeviceVariants(
    desktopVariants,
    mobileVariants
  );

  // Get adjusted animation values for current device
  const distance = useDeviceAnimation('distance', {
    desktopValue: 100,
    mobileValue: 50
  });

  // Check if we should enable a complex effect
  const shouldEnableParallax = useShouldEnableEffect('parallax');

  return (
    <motion.div
      variants={variants}
      animate={shouldEnableParallax ? "animate" : "static"}
      style={{ y: distance }}
    >
      Device-optimized animation
    </motion.div>
  );
}
```

### Animation Helpers

```tsx
import {
  createDelaySequence,
  adaptVariantsForDevice,
  createTransition,
  shouldEnableAnimations,
  isInViewport
} from '@/components/core/Animations';
import { useDevice } from '@/context/DeviceContext';

function MyComponent() {
  const { isMobile } = useDevice();

  // Create a sequence of delays for multiple elements
  const delays = createDelaySequence(5, 0.2, 0.1);

  // Adapt variants for current device
  const adaptedVariants = adaptVariantsForDevice(myVariants, isMobile);

  // Create a custom transition
  const transition = createTransition('spring', 0.7);

  // Check if animation should run
  const shouldAnimate = shouldEnableAnimations(isMobile, false, 'medium');

  return (
    <div>
      {shouldAnimate && (
        <motion.div transition={transition}>
          Animated content
        </motion.div>
      )}
    </div>
  );
}
```

## Examples

### Basic Reveal on Scroll

```tsx
import { ScrollReveal } from '@/components/core/Animations';

function Section() {
  return (
    <div className="space-y-8">
      <ScrollReveal>
        <h2 className="text-2xl font-bold">Section Title</h2>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <p>First paragraph of content that reveals on scroll.</p>
      </ScrollReveal>

      <ScrollReveal delay={0.4}>
        <button className="btn">Call to Action</button>
      </ScrollReveal>
    </div>
  );
}
```

### Staggered Card Grid

```tsx
import { StaggerContainer } from '@/components/core/Animations';
import { motion } from 'framer-motion';

function CardGrid({ items }) {
  return (
    <StaggerContainer className="grid grid-cols-3 gap-4">
      {items.map(item => (
        <motion.div
          key={item.id}
          className="card"
          whileHover={{ scale: 1.05 }}
        >
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </motion.div>
      ))}
    </StaggerContainer>
  );
}
```

### Animated Hero Section

```tsx
import {
  TextReveal,
  ScrollReveal,
  heroContainerVariants,
  heroItemVariants
} from '@/components/core/Animations';
import { motion } from 'framer-motion';

function HeroSection() {
  return (
    <motion.section
      className="hero-section"
      variants={heroContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={heroItemVariants}>
        <TextReveal
          as="h1"
          splitBy="words"
          staggerChildren={true}
        >
          Welcome to our amazing platform
        </TextReveal>
      </motion.div>

      <motion.div variants={heroItemVariants} className="mt-6">
        <ScrollReveal direction="up">
          <p className="lead-text">
            Discover how our solutions can transform your business
          </p>
        </ScrollReveal>
      </motion.div>

      <motion.div variants={heroItemVariants} className="mt-8">
        <button className="primary-button">Get Started</button>
      </motion.div>
    </motion.section>
  );
}
```

## Best Practices

1. **Consider Performance**: Limit animations on mobile devices and lower-end hardware. Use the `useAnimationPreferences` hook to check device capabilities.

2. **Respect User Preferences**: Always respect user's reduced motion settings. The animation system does this automatically when using provided components and hooks.

3. **Group Related Animations**: Use container variants with staggered children for related elements to create visual cohesion.

4. **Keep It Purposeful**: Animations should enhance UX, not distract. Use subtle animations for most UI elements and save elaborate animations for key interactions.

5. **Maintain Consistency**: Use the provided animation components and variants to ensure consistent timing and motion throughout the application.

6. **Test on Multiple Devices**: Animations can perform differently across devices. Test on both high and low-end devices.

7. **Use Once Prop**: For scroll animations, typically set `once={true}` to prevent animations from repeating when scrolling up and down.

8. **Manage Exit Animations**: Always include exit animations for elements that unmount to create smooth transitions.

9. **Avoid Animation Overload**: Too many animations on a single page can be overwhelming. Prioritize which elements need animation.

10. **Provide Static Fallbacks**: For complex animations, provide static fallbacks for when animations are disabled or not supported.
