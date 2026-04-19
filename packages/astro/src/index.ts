import UltraTyped from 'ultratyped';

export interface UltraTypedOptions {
  strings: string[];
  typeSpeed?: number;
  backSpeed?: number;
  backDelay?: number;
  loop?: boolean;
}

export function astroUltraTyped(el: HTMLElement, options: UltraTypedOptions) {
  const instance = UltraTyped(el, options);
  return instance;
}
