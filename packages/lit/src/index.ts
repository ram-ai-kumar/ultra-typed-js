import { ReactiveController, ReactiveControllerHost } from 'lit';
import UltraTyped from 'ultratyped';

export interface UltraTypedOptions {
  strings: string[];
  typeSpeed?: number;
  backSpeed?: number;
  backDelay?: number;
  loop?: boolean;
}

export class UltraTypedController implements ReactiveController {
  private instance: ReturnType<typeof UltraTyped> | null = null;
  private el: HTMLElement;

  constructor(host: ReactiveControllerHost, el: HTMLElement, private options: UltraTypedOptions) {
    this.el = el;
    host.addController(this);
  }

  hostConnected() {
    this.init();
  }

  hostDisconnected() {
    this.destroy();
  }

  private init() {
    this.destroy();
    if (this.options.strings.length > 0) {
      this.instance = UltraTyped(this.el, this.options);
    }
  }

  private destroy() {
    if (this.instance) {
      this.instance.stop();
      this.instance = null;
    }
  }

  updateOptions(options: Partial<UltraTypedOptions>) {
    this.options = { ...this.options, ...options };
    this.init();
  }
}
