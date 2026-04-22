import UltraTyped from "ultratyped";

/**
 * TypeScript adapter for UltraTyped with enhanced type safety
 * Provides a class-based API with better TypeScript support
 */

export interface UltraTypedOptions {
  strings?: string[];
  stringsElement?: string | HTMLElement;
  typeSpeed?: number;
  backSpeed?: number;
  backDelay?: number;
  loop?: boolean;
  loopCount?: number;
  shuffle?: boolean;
  contentType?: "text" | "html";
  attr?: string;
  smartBackspace?: boolean;
  showCursor?: boolean;
  cursorChar?: string;
  autoInsertCss?: boolean;
  startDelay?: number;
  fadeOut?: boolean;
  fadeOutDelay?: number;
  fadeOutClass?: string;
  typingVariance?: number;
  bindInputFocusEvents?: boolean;
  onBegin?: (self: { el: HTMLElement; strings: string[] }) => void;
  onComplete?: (self: { el: HTMLElement; strings: string[] }) => void;
  preStringTyped?: (
    arrayPos: number,
    self: { el: HTMLElement; strings: string[] },
  ) => void;
  onStringTyped?: (
    arrayPos: number,
    self: { el: HTMLElement; strings: string[] },
  ) => void;
  onLastStringBackspaced?: (self: {
    el: HTMLElement;
    strings: string[];
  }) => void;
  onTypingPaused?: (
    arrayPos: number,
    self: { el: HTMLElement; strings: string[] },
  ) => void;
  onTypingResumed?: (
    arrayPos: number,
    self: { el: HTMLElement; strings: string[] },
  ) => void;
  onReset?: (self: { el: HTMLElement; strings: string[] }) => void;
  onStop?: (
    arrayPos: number,
    self: { el: HTMLElement; strings: string[] },
  ) => void;
  onStart?: (
    arrayPos: number,
    self: { el: HTMLElement; strings: string[] },
  ) => void;
  onDestroy?: (self: { el: HTMLElement; strings: string[] }) => void;
}

export interface UltraTypedInstance {
  stop(): void;
  start(): void;
  reset(): void;
  destroy(): void;
  pause(): void;
  resume(): void;
  toggle(): void;
}

export class UltraTypedTS {
  private instance: UltraTypedInstance | null = null;
  private el: HTMLElement;
  private options: UltraTypedOptions;

  constructor(el: HTMLElement, options: UltraTypedOptions) {
    this.el = el;
    this.options = options;
    this.start();
  }

  start(): void {
    if (this.instance) {
      this.instance.stop();
    }
    this.instance = UltraTyped(this.el, this.options);
  }

  stop(): void {
    if (this.instance) {
      this.instance.stop();
      this.instance = null;
    }
  }

  reset(): void {
    if (this.instance) {
      this.instance.reset();
    }
  }

  destroy(): void {
    this.stop();
    this.el.textContent = "";
  }

  updateOptions(options: Partial<UltraTypedOptions>): void {
    this.options = { ...this.options, ...options };
    this.start();
  }
}

/**
 * Factory function for creating UltraTypedTS instances
 */
export function createUltraTyped(
  el: HTMLElement,
  options: UltraTypedOptions,
): UltraTypedTS {
  return new UltraTypedTS(el, options);
}
