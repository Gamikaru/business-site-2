declare module 'react-remove-scroll' {
  import * as React from 'react';

  interface RemoveScrollProps {
    children: React.ReactNode;
    enabled?: boolean;
    forwardProps?: boolean;
    shards?: Array<React.RefObject<HTMLElement> | HTMLElement>;
    noIsolation?: boolean;
    allowPinchZoom?: boolean;
    inert?: boolean;
    removeScrollBar?: boolean;
  }

  export const RemoveScroll: React.FC<RemoveScrollProps>;

  export interface RemoveScrollClassNameProps {
    children: (className: string) => React.ReactNode;
    enabled?: boolean;
    shards?: Array<React.RefObject<HTMLElement> | HTMLElement>;
    noIsolation?: boolean;
    allowPinchZoom?: boolean;
    inert?: boolean;
    removeScrollBar?: boolean;
  }

  export const RemoveScrollClassName: React.FC<RemoveScrollClassNameProps>;
}
