import { onCleanup, onMount } from 'solid-js';
import UltraTyped from 'ultratyped';

export interface UltraTypedOptions {
  strings: string[];
  typeSpeed?: number;
  backSpeed?: number;
  backDelay?: number;
  loop?: boolean;
}

export function createUltraTyped(el: HTMLElement, options: UltraTypedOptions) {
  let instance: ReturnType<typeof UltraTyped> | null = null;

  onMount(() => {
    instance = UltraTyped(el, options);
  });

  onCleanup(() => {
    instance?.stop();
  });

  return el;
}
