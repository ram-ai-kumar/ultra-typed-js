/**
 * UltraTyped.js - Ultra-fast <2KB typing animation library
 * TypeScript definitions (zero runtime cost)
 */

export interface UltraTypedOptions {
  /** Array of strings to type */
  strings: string[];
  /** Milliseconds per character typed (default: 50) */
  typeSpeed?: number;
  /** Milliseconds per character backspaced (default: 30) */
  backSpeed?: number;
  /** Milliseconds to pause before backspacing (default: 800) */
  backDelay?: number;
  /** Whether to loop through strings (default: true) */
  loop?: boolean;
}

export interface UltraTypedInstance {
  /** Stop the animation */
  stop(): void;
  /** Reset to initial state */
  reset(): void;
}

/**
 * UltraTyped core function
 * @param el - Target element
 * @param options - Configuration options
 * @returns Instance with control methods
 */
export default function UltraTyped(
  el: HTMLElement,
  options?: UltraTypedOptions
): UltraTypedInstance;
