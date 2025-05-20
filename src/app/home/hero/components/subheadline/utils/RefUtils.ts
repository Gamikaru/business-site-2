import { RefObject, MutableRefObject } from 'react';

/**
 * Utility to combine multiple refs (functions or objects) into one handler
 *
 * @param refs Array of refs to be combined
 * @returns A function that sets all refs to the provided node
 */
export const combineRefs = <T extends HTMLElement>(
  ...refs: Array<RefObject<T> | ((node: T | null) => void) | null | undefined>
) => {
  return (node: T | null) => {
    refs.forEach(ref => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && 'current' in ref) {
        (ref as MutableRefObject<T | null>).current = node;
      }
    });
  };
};

/**
 * Create a ref callback that updates both a ref object and calls an update function
 *
 * @param elementRef Ref to store the DOM element
 * @param updateFunction Function to call when the element reference changes
 * @returns Ref callback function
 */
export const createRefCallback = <T extends HTMLElement>(
  elementRef: MutableRefObject<T | null>,
  updateFunction?: (element: T | null) => void
) => {
  return (node: T | null) => {
    elementRef.current = node;
    if (updateFunction && node) {
      updateFunction(node);
    }
  };
};
