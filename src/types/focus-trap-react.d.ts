declare module 'focus-trap-react' {
  import * as React from 'react';

  export interface FocusTrapOptions {
    onActivate?: () => void;
    onDeactivate?: () => void;
    initialFocus?: string | HTMLElement | (() => HTMLElement);
    fallbackFocus?: string | HTMLElement | (() => HTMLElement);
    escapeDeactivates?: boolean;
    clickOutsideDeactivates?: boolean;
    returnFocusOnDeactivate?: boolean;
    setReturnFocus?: HTMLElement | string | (() => HTMLElement);
    allowOutsideClick?: boolean | ((e: MouseEvent) => boolean);
    preventScroll?: boolean;
    delayInitialFocus?: boolean;
    document?: Document;
  }

  export interface FocusTrapProps {
    active?: boolean;
    paused?: boolean;
    focusTrapOptions?: FocusTrapOptions;
    children: React.ReactNode;
  }

  const FocusTrap: React.FC<FocusTrapProps>;

  export default FocusTrap;
}
