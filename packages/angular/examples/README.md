# UltraTyped.js Angular Examples

This directory contains examples demonstrating UltraTyped.js integration with Angular, showing service-based patterns and proper cleanup.

## Basic Example

The Angular example showcases Angular integration patterns:

### Features Demonstrated

- **Angular service integration** with dependency injection
- **Component integration** with ViewChild and ElementRef
- **Multiple instances** management
- **Lifecycle hooks** for proper initialization and cleanup
- **TypeScript support** with full type safety
- **Reactive configuration** updates

### Running the Example

1. **From the project root**:
   ```bash
   # Build the core and Angular packages first
   npm run build:core
   npm run build:angular

   # Navigate to the Angular example directory
   cd packages/angular/examples

   # Install dependencies
   npm install

   # Start the development server
   npm start
   ```

2. **Build for production**:
   ```bash
   npm run build
   ```

### Angular Integration Patterns

#### Using the UltraTyped Service
```typescript
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { UltraTypedService } from '@ultratyped/angular';

@Component({
  selector: 'app-typing',
  template: '<span #typedElement></span>'
})
export class TypingComponent implements OnInit, OnDestroy {
  @ViewChild('typedElement', { static: true }) element!: ElementRef;
  private instance: any;

  constructor(private ultraTypedService: UltraTypedService) {}

  ngOnInit() {
    this.instance = this.ultraTypedService.create(this.element.nativeElement, {
      strings: ['Hello', 'World'],
      typeSpeed: 50,
      loop: true,
      onComplete: () => console.log('Completed')
    });
  }

  ngOnDestroy() {
    if (this.instance) {
      this.instance.destroy();
    }
  }
}
```

#### Manual Integration with Cleanup
```typescript
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import UltraTyped from 'ultratyped';

@Component({
  selector: 'app-manual-typing',
  template: `
    <div #typedElement></div>
    <button (click)="start()">Start</button>
    <button (click)="pause()">Pause</button>
    <button (click)="stop()">Stop</button>
  `
})
export class ManualTypingComponent implements OnInit, OnDestroy {
  @ViewChild('typedElement', { static: true }) element!: ElementRef;
  private instance: any;
  status = 'Ready';

  ngOnInit() {
    if (this.element) {
      this.instance = UltraTyped(this.element.nativeElement, {
        strings: ['Hello', 'World'],
        typeSpeed: 50,
        loop: true,
        onBegin: () => {
          this.status = 'Animation began';
        },
        onComplete: () => {
          this.status = 'All strings completed!';
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.instance) {
      this.instance.destroy();
      this.instance = null;
    }
  }

  start() {
    if (this.instance) this.instance.start();
  }

  pause() {
    if (this.instance) this.instance.pause();
  }

  stop() {
    if (this.instance) this.instance.stop();
  }
}
```

#### Dynamic Configuration Component
```typescript
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
import UltraTyped from 'ultratyped';

@Component({
  selector: 'app-dynamic-typing',
  template: `
    <div #typedElement></div>
    <div>
      <label>Strings (one per line):</label>
      <textarea [value]="strings.join('\n')" (input)="updateStrings($event)"></textarea>
    </div>
    <div>
      <label>Type Speed:</label>
      <input type="number" [value]="typeSpeed" (input)="updateSpeed($event)">
    </div>
  `
})
export class DynamicTypingComponent implements OnInit, OnDestroy {
  @ViewChild('typedElement', { static: true }) element!: ElementRef;
  @Input() strings: string[] = ['Hello', 'World'];
  @Input() typeSpeed = 50;

  private instance: any;

  ngOnInit() {
    this.initializeTyping();
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private initializeTyping() {
    if (this.element && !this.instance) {
      this.instance = UltraTyped(this.element.nativeElement, {
        strings: this.strings,
        typeSpeed: this.typeSpeed,
        loop: true
      });
    }
  }

  private cleanup() {
    if (this.instance) {
      this.instance.destroy();
      this.instance = null;
    }
  }

  updateStrings(event: any) {
    const newStrings = event.target.value.split('\n').filter((s: string) => s.trim());
    this.strings = newStrings;
    if (this.instance) {
      this.instance.strings = newStrings;
      this.instance.reset();
    }
  }

  updateSpeed(event: any) {
    this.typeSpeed = Number(event.target.value);
    if (this.instance) {
      this.instance.typeSpeed = this.typeSpeed;
    }
  }
}
```

### Example Components

#### 1. Basic Typing Component
- Shows fundamental Angular integration
- Uses ViewChild for DOM access
- Manual instance management with proper cleanup
- Event callback handling

#### 2. Service-Based Component
- Uses Angular service for encapsulation
- Cleaner component code
- Automatic cleanup handled by service
- Dependency injection patterns

#### 3. Multiple Instances Component
- Manages multiple UltraTyped instances
- Coordinated control across all instances
- Different styling and speeds
- Proper cleanup for all instances

#### 4. Dynamic Configuration Component
- Demonstrates Input() properties
- Reactive updates on configuration changes
- Event emitters for callbacks

### Key Angular Concepts

#### ViewChild and ElementRef
```typescript
@ViewChild('typedElement', { static: true }) element!: ElementRef;

ngOnInit() {
  // Initialize UltraTyped after view is ready
  if (this.element) {
    this.instance = UltraTyped(this.element.nativeElement, options);
  }
}
```

#### Lifecycle Hooks
```typescript
ngOnInit() {
  // Initialize component
  this.instance = UltraTyped(element, options);
}

ngOnDestroy() {
  // Cleanup when component is destroyed
  if (this.instance) {
    this.instance.destroy();
  }
}
```

#### Service Injection
```typescript
constructor(private ultraTypedService: UltraTypedService) {}

ngOnInit() {
  this.instance = this.ultraTypedService.create(element, options);
}
```

### Best Practices

1. **Always cleanup**: Destroy instances in `ngOnDestroy`
2. **Use ViewChild**: Access DOM elements with ViewChild and ElementRef
3. **Services**: Encapsulate logic in services for reusability
4. **TypeScript**: Use proper typing for better development experience
5. **Input properties**: Use @Input() for configurable components
6. **Event emitters**: Use @Output() for event callbacks

### Dependencies

- **Angular**: ^14.0.0 || ^15.0.0 || ^16.0.0 || ^17.0.0 || ^18.0.0 || ^19.0.0
- **@ultratyped/angular**: ^1.0.0
- **ultratyped**: ^1.0.0 (core package)
- **TypeScript**: ^5.0.0

### Project Structure

```
packages/angular/examples/
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── typing.component.ts
│   │   └── dynamic-typing.component.ts
│   ├── app.module.ts
│   └── main.ts
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

### Development Notes

- Uses Angular CLI for development and building
- TypeScript support with strict mode enabled
- Hot module replacement for rapid development
- Proper type checking and IntelliSense support

### Browser Compatibility

Works in all modern browsers that support:
- ES6 modules
- Angular requirements
- RequestAnimationFrame

### Next Steps

After exploring this example, check out other framework examples:

- [React Example](../../../react/examples/)
- [Vue Example](../../../vue/examples/)
- [Svelte Example](../../../svelte/examples/)
- [Alpine.js Example](../../../alpine/examples/)
- And more...

Each framework example demonstrates best practices and integration patterns specific to that framework.
