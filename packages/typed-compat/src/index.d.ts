import type { UltraTypedOptions } from 'ultratyped';

export default class Typed {
  constructor(element: HTMLElement | string, options: UltraTypedOptions);
  stop(): void;
  start(): void;
  reset(): void;
  destroy(): void;
  pause(): void;
  resume(): void;
  toggle(): void;
}
