/**
 * UltraTyped.js - Ultra-fast <2KB typing animation library
 * TypeScript definitions (zero runtime cost)
 */

export interface UltraTypedOptions {
  /** Array of strings to type */
  strings?: string[];
  /** DOM element or selector to read strings from */
  stringsElement?: string | HTMLElement | null;
  /** Milliseconds per character typed (default: 50) */
  typeSpeed?: number;
  /** Milliseconds per character backspaced (default: 30) */
  backSpeed?: number;
  /** Milliseconds to pause before backspacing (default: 800) */
  backDelay?: number;
  /** Whether to loop through strings (default: true) */
  loop?: boolean;
  /** Number of loops before stopping (default: Infinity) */
  loopCount?: number;
  /** Whether to shuffle strings on each loop (default: false) */
  shuffle?: boolean;
  /** Content type: 'text' (default) or 'html' */
  contentType?: 'text' | 'html';
  /** Attribute to type into, e.g. 'placeholder' */
  attr?: string | null;
  /** Only backspace characters that differ between strings (default: true) */
  smartBackspace?: boolean;
  /** Whether to show a blinking cursor (default: true) */
  showCursor?: boolean;
  /** Character to use for the cursor (default: '|') */
  cursorChar?: string;
  /** Whether to auto-insert cursor CSS (default: true) */
  autoInsertCss?: boolean;
  /** Delay before typing starts (default: 0) */
  startDelay?: number;
  /** CSP nonce for inline styles */
  nonce?: string | null;
  /** Whether to fade out on completion (default: false) */
  fadeOut?: boolean;
  /** Delay before fade out starts (default: 500) */
  fadeOutDelay?: number;
  /** CSS class for fade out animation */
  fadeOutClass?: string;
  /** Random variance in typing speed for human-like effect */
  typingVariance?: number;
  /** Pause animation when nearby input/textarea gains focus */
  bindInputFocusEvents?: boolean;
  /** Callback when animation begins */
  onBegin?: (self: { el: HTMLElement; strings: string[] }) => void;
  /** Callback when all strings are completed */
  onComplete?: (self: { el: HTMLElement; strings: string[] }) => void;
  /** Callback before each string is typed */
  preStringTyped?: (
    arrayPos: number,
    self: { el: HTMLElement; strings: string[] },
  ) => void;
  /** Callback after each string is typed */
  onStringTyped?: (
    arrayPos: number,
    self: { el: HTMLElement; strings: string[] },
  ) => void;
  /** Callback when last string is fully backspaced */
  onLastStringBackspaced?: (self: {
    el: HTMLElement;
    strings: string[];
  }) => void;
  /** Callback when typing pauses */
  onTypingPaused?: (
    arrayPos: number,
    self: { el: HTMLElement; strings: string[] },
  ) => void;
  /** Callback when typing resumes */
  onTypingResumed?: (
    arrayPos: number,
    self: { el: HTMLElement; strings: string[] },
  ) => void;
  /** Callback when animation is reset */
  onReset?: (self: { el: HTMLElement; strings: string[] }) => void;
  /** Callback when animation is stopped */
  onStop?: (
    arrayPos: number,
    self: { el: HTMLElement; strings: string[] },
  ) => void;
  /** Callback when animation is started */
  onStart?: (
    arrayPos: number,
    self: { el: HTMLElement; strings: string[] },
  ) => void;
  /** Callback when animation is destroyed */
  onDestroy?: (self: { el: HTMLElement; strings: string[] }) => void;
}

export interface UltraTypedInstance {
  /** Stop the animation */
  stop(): void;
  /** Start or restart the animation */
  start(): void;
  /** Reset to initial state */
  reset(): void;
  /** Pause the animation */
  pause(): void;
  /** Resume the animation */
  resume(): void;
  /** Toggle between pause and resume */
  toggle(): void;
  /** Clean up and destroy the instance */
  destroy(): void;
}

/**
 * UltraTyped core function
 * @param el - Target element
 * @param options - Configuration options
 * @returns Instance with control methods
 */
export default function UltraTyped(
  el: HTMLElement,
  options?: UltraTypedOptions,
): UltraTypedInstance;
