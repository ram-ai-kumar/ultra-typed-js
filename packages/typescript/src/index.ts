import UltraTyped from "ultratyped";
import type { UltraTypedOptions, UltraTypedInstance } from "ultratyped";
export type { UltraTypedOptions, UltraTypedInstance } from "ultratyped";

/**
 * TypeScript adapter for UltraTyped with enhanced type safety
 * Provides a class-based API with better TypeScript support
 */

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
