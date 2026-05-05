# UltraTyped.js Lit Examples

This directory contains examples demonstrating UltraTyped.js integration with Lit, showing LitElement web components and reactive properties.

## Basic Example

The Lit example showcases LitElement integration patterns:

### Features Demonstrated

- **LitElement web component** integration
- **Reactive properties** with Lit decorators
- **Lifecycle callbacks** for initialization and cleanup
- **Multiple instances** management
- **TypeScript support** with full type safety
- **Shadow DOM** encapsulation

### Running the Example

1. **From the project root**:
   ```bash
   # Build the core and Lit packages first
   npm run build:core
   npm run build:lit

   # Navigate to the Lit example directory
   cd packages/lit/examples

   # Install dependencies
   npm install

   # Start the development server
   npm run dev
   ```

2. **Build for production**:
   ```bash
   npm run build
   npm run preview
   ```

### Lit Integration Patterns

#### Basic LitElement Component
```typescript
import { LitElement, html, css, property } from 'lit';
import { customElement } from 'lit/decorators.js';
import UltraTyped from 'ultratyped';

@customElement('ultra-typed-element')
class UltraTypedElement extends LitElement {
  @property() strings: string[] = ['Hello', 'World'];
  @property({ type: Number }) typeSpeed = 50;
  @property({ type: Boolean }) loop = true;

  private instance: any = null;

  static styles = css`
    :host {
      display: inline-block;
      font-family: 'Courier New', monospace;
      color: #2563eb;
    }
  `;

  render() {
    return html`<span class="typed-element"></span>`;
  }

  firstUpdated() {
    const element = this.shadowRoot?.querySelector('.typed-element');
    if (element) {
      this.instance = UltraTyped(element, {
        strings: this.strings,
        typeSpeed: this.typeSpeed,
        loop: this.loop,
        onComplete: () => console.log('Completed')
      });
    }
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('strings') && this.instance) {
      this.instance.strings = this.strings;
      this.instance.reset();
    }
    if (changedProperties.has('typeSpeed') && this.instance) {
      this.instance.typeSpeed = this.typeSpeed;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.instance) {
      this.instance.destroy();
      this.instance = null;
    }
  }
}
```

#### Using @ultratyped/lit Directive
```typescript
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ultraTyped } from '@ultratyped/lit';

@customElement('my-typing-component')
class MyTypingComponent extends LitElement {
  static styles = css`
    .typed-container {
      font-size: 24px;
      min-height: 40px;
    }
  `;

  render() {
    return html`
      <div class="typed-container">
        ${ultraTyped({
          strings: ['Hello', 'World', 'Lit'],
          typeSpeed: 50,
          loop: true,
          onBegin: () => console.log('Started'),
          onComplete: () => console.log('Completed')
        })}
      </div>
    `;
  }
}
```

#### Advanced Component with Controls
```typescript
import { LitElement, html, css, property } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import UltraTyped from 'ultratyped';

@customElement('advanced-typing')
class AdvancedTyping extends LitElement {
  @property() strings: string[] = ['Advanced', 'Lit', 'Full control'];
  @property({ type: Number }) typeSpeed = 50;
  @property({ type: Boolean }) loop = true;
  @property() showCursor = true;

  @state() private status = 'Ready';
  @state() private isRunning = false;

  private instance: any = null;

  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    .typed-element {
      font-size: 24px;
      color: #2563eb;
      min-height: 40px;
      margin: 20px 0;
      font-family: 'Courier New', monospace;
    }

    .controls {
      display: flex;
      gap: 10px;
      margin: 20px 0;
      flex-wrap: wrap;
    }

    button {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      background-color: #2563eb;
      color: white;
      cursor: pointer;
      font-size: 14px;
    }

    button:hover {
      background-color: #1d4ed8;
    }

    button:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }

    .status {
      padding: 10px;
      background-color: #f3f4f6;
      border-radius: 5px;
      margin: 10px 0;
    }
  `;

  render() {
    return html`
      <div class="typed-element"></div>

      <div class="controls">
        <button @click=${this.start} ?disabled=${this.isRunning}>Start</button>
        <button @click=${this.pause} ?disabled=${!this.isRunning}>Pause</button>
        <button @click=${this.stop}>Stop</button>
        <button @click=${this.reset}>Reset</button>
      </div>

      <div class="status">${this.status}</div>
    `;
  }

  firstUpdated() {
    const element = this.shadowRoot?.querySelector('.typed-element');
    if (element) {
      this.instance = UltraTyped(element, {
        strings: this.strings,
        typeSpeed: this.typeSpeed,
        backSpeed: 30,
        loop: this.loop,
        showCursor: this.showCursor,

        onBegin: () => {
          this.isRunning = true;
          this.status = 'Animation began';
        },
        onComplete: () => {
          this.status = 'All strings completed!';
        },
        onStringTyped: (arrayPos: number) => {
          this.status = `Finished string ${arrayPos + 1}`;
        },
        onStop: () => {
          this.isRunning = false;
          this.status = 'Animation stopped';
        }
      });
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.instance) {
      this.instance.destroy();
      this.instance = null;
    }
  }

  private start() {
    if (this.instance) this.instance.start();
  }

  private pause() {
    if (this.instance) this.instance.pause();
  }

  private stop() {
    if (this.instance) this.instance.stop();
  }

  private reset() {
    if (this.instance) this.instance.reset();
  }
}
```

### Example Components

#### 1. Basic LitElement Component
- Shows fundamental Lit integration
- Uses firstUpdated lifecycle
- Manual instance management with cleanup
- Event callback handling

#### 2. Directive-Based Component
- Uses Lit directives for cleaner syntax
- Automatic cleanup through directive lifecycle
- Simpler component code
- Declarative usage

#### 3. Advanced Component with Controls
- Full control over UltraTyped instance
- Interactive buttons for control
- Status tracking with Lit state
- Reactive property updates

#### 4. Multiple Instances
- Manages multiple UltraTyped instances
- Coordinated control across instances
- Different configurations per instance
- Proper cleanup for all instances

### Key Lit Concepts

#### Lifecycle Callbacks
```typescript
firstUpdated() {
  // Called after the element's DOM has been updated the first time
  const element = this.shadowRoot?.querySelector('.typed-element');
  this.instance = UltraTyped(element, options);
}

disconnectedCallback() {
  // Called when the element is removed from the DOM
  super.disconnectedCallback();
  if (this.instance) {
    this.instance.destroy();
  }
}
```

#### Reactive Properties
```typescript
@property() strings: string[] = ['Hello', 'World'];

updated(changedProperties: Map<string, any>) {
  if (changedProperties.has('strings') && this.instance) {
    this.instance.strings = this.strings;
    this.instance.reset();
  }
}
```

#### Event Handling
```typescript
render() {
  return html`
    <button @click=${this.start}>Start</button>
  `;
}

private start() {
  if (this.instance) this.instance.start();
}
```

#### Shadow DOM Styles
```typescript
static styles = css`
  :host {
    display: inline-block;
  }

  .typed-element {
    font-family: 'Courier New', monospace;
  }
`;
```

### Best Practices

1. **Always cleanup**: Destroy instances in `disconnectedCallback`
2. **Use firstUpdated**: Initialize UltraTyped after DOM is ready
3. **Reactive updates**: Handle property changes in `updated` method
4. **TypeScript**: Use proper typing for better development experience
5. **Shadow DOM**: Encapsulate styles within the component
6. **Directives**: Use directives for simpler integration patterns

### Dependencies

- **Lit**: ^2.0.0 || ^3.0.0
- **@ultratyped/lit**: ^1.0.0
- **ultratyped**: ^1.0.0 (core package)
- **TypeScript**: ^5.0.0

### Project Structure

```
packages/lit/examples/
├── src/
│   ├── components/
│   │   ├── ultra-typed-element.ts
│   │   ├── advanced-typing.ts
│   │   └── multiple-instances.ts
│   ├── index.html
│   └── main.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Development Notes

- Uses Vite for fast development and building
- TypeScript support with Lit decorators
- Hot module replacement for rapid development
- Shadow DOM for style encapsulation

### Browser Compatibility

Works in all modern browsers that support:
- Web Components (Custom Elements, Shadow DOM)
- Lit requirements
- RequestAnimationFrame

### Next Steps

After exploring this example, check out other framework examples:

- [React Example](../../../react/examples/)
- [Vue Example](../../../vue/examples/)
- [Angular Example](../../../angular/examples/)
- [Svelte Example](../../../svelte/examples/)
- And more...

Each framework example demonstrates best practices and integration patterns specific to that framework.
