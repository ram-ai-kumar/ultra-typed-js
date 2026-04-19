import { Directive, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import UltraTyped from 'ultratyped';

export interface UltraTypedOptions {
  strings: string[];
  typeSpeed?: number;
  backSpeed?: number;
  backDelay?: number;
  loop?: boolean;
}

@Directive({
  selector: '[ultratyped]',
  standalone: true
})
export class UltraTypedDirective implements OnChanges, OnDestroy {
  private instance: ReturnType<typeof UltraTyped> | null = null;

  @Input() ultratyped: UltraTypedOptions = { strings: [] };

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ultratyped']) {
      this.init();
    }
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  private init(): void {
    this.destroy();
    if (this.ultratyped.strings.length > 0) {
      this.instance = UltraTyped(this.el.nativeElement, this.ultratyped);
    }
  }

  private destroy(): void {
    if (this.instance) {
      this.instance.stop();
      this.instance = null;
    }
  }
}
