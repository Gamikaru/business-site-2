declare module "typewriter-effect" {
  import * as React from "react";
  interface TypewriterOptions {
    strings?: string[];
    autoStart?: boolean;
    loop?: boolean;
    delay?: number;
    cursor?: string;
    skipAddStyles?: boolean;
    [key: string]: unknown;
  }
  interface TypewriterProps {
    options?: TypewriterOptions;
    onInit?: (typewriter: import("typewriter-effect/dist/core").default) => void;
  }
  const Typewriter: React.FC<TypewriterProps>;
  export default Typewriter;
}

declare module "typewriter-effect/dist/core" {
  export default class TypewriterCore {
    typeString(str: string): this;
    pauseFor(ms: number): this;
    changeDelay(delay: number): this;
    callFunction(fn: () => void): this;
    start(): this;
    // Add other methods as needed
  }
}
