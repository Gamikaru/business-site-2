// src/components/core/Animations/index.ts
// Components
import ScrollReveal from './components/ScrollReveal';
import StaggerContainer, { staggerContainerVariants as containerVariants, staggerItemVariants as itemVariants } from './components/StaggerContainer';
import TextReveal from './components/TextReveal';
import ParallaxSection from './components/ParallaxSection';
import GestureElement from './components/GestureElements';
import AnimatedPath from './components/AnimatedPath';
import AnimationSequence from './components/AnimationSequence';
import ScrollLinkedAnimation from './components/ScrollLinkedAnimation';

// Export components using named exports
export {
  ScrollReveal,
  StaggerContainer,
  TextReveal,
  ParallaxSection,
  GestureElement,
  AnimatedPath,
  AnimationSequence,
  ScrollLinkedAnimation,
  // Also export the variants from StaggerContainer
  containerVariants as staggerContainerVariants,
  itemVariants as staggerItemVariants
};

// Context
export { AnimationProvider, useAnimationContext } from './context/AnimationContext';

// Hooks
export { useAnimationPreferences } from './hooks/useAnimationPreferences';
export { useParallax } from './hooks/useParallax';

// Variants
// Basic variants
export {
  fadeVariants,
  slideUpVariants,
  slideDownVariants,
  slideLeftVariants,
  slideRightVariants,
  scaleVariants,
  hoverScaleVariants,
  popUpVariants
} from './variants/basics';

// Text variants
export {
  textRevealVariants,
  charStaggerVariants,
  charVariants,
  wordStaggerVariants,
  wordVariants,
  lineRevealVariants,
  cursorVariants
} from './variants/text';

// Container variants
export {
  staggerContainerVariants as containerStaggerVariants,
  staggerItemVariants as containerStaggerItemVariants,
  gridContainerVariants,
  gridItemVariants,
  cardVariants,
  heroContainerVariants,
  heroItemVariants
} from './variants/containers';

// Page transition variants
export {
  pageTransitionVariants,
  fadeUpPageVariants,
  slidePageVariants,
  contentAfterPageLoadVariants,
  mobilePageTransitionVariants
} from './variants/page';

// Complex animation variants
export {
  pathFollowVariants,
  drawSVGVariants,
  elasticVariants,
  counterVariants,
  rotateVariants,
  flipVariants,
  tiltVariants
} from './variants/complex';

// Utilities
export {
  createDelaySequence,
  adaptVariantsForDevice,
  createTransition,
  shouldEnableAnimations,
  isInViewport
} from './utils/animationHelpers';

export {
  useDeviceVariants,
  useDeviceAnimation,
  useShouldEnableEffect
} from './utils/deviceAnimations';