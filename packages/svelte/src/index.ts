import UltraTyped from 'ultratyped';
import type { UltraTypedOptions } from 'ultratyped';

export function ultratyped(node: HTMLElement, options: UltraTypedOptions) {
  const instance = UltraTyped(node, options);
  return {
    destroy() {
      instance.stop();
    }
  };
}
