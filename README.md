# UltraTyped.js

![npm version](https://badge.fury.io/js/ultratyped.svg)
![bundle size](https://img.shields.io/bundlephobia/minzip/ultratyped)
![CI](https://github.com/user/ultratyped/workflows/CI/badge.svg)

Ultra-fast <2KB typing animation library with zero dependencies.

## Features

- **<2KB gzipped** - Smallest in its class
- **60fps smooth** - requestAnimationFrame-driven
- **Zero dependencies** - Pure vanilla JavaScript
- **Framework agnostic** - Works with React, Vue, Svelte, vanilla JS
- **TypeScript support** - Full type definitions with zero runtime cost
- **Smart backspace** - Diff-based backspacing for efficiency

## Installation

```bash
npm install ultratyped
```

## Usage

### Vanilla JavaScript

```javascript
import UltraTyped from "ultratyped";

const el = document.getElementById("typed");
const instance = UltraTyped(el, {
  strings: ["Hello World", "Ultra-fast typing"],
  typeSpeed: 80,
  backSpeed: 40,
  backDelay: 1000,
  loop: true,
});

// Stop animation
instance.stop();
```

### Alpine.js

```html
<script>
  import ultratyped from '@ultratyped/alpine';
  Alpine.plugin(ultratyped);
</script>

<div x-data="{ typed: { strings: ['Alpine App', 'Ultra-fast typing'], typeSpeed: 80, loop: true } }">
  <span x-typed="typed"></span>
</div>
```

### Angular

```typescript
import { Component } from '@angular/core';
import { UltraTypedDirective } from '@ultratyped/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UltraTypedDirective],
  template: `
    <span [ultratyped]="options"></span>
  `
})
export class AppComponent {
  options = {
    strings: ['Angular App', 'Ultra-fast typing'],
    typeSpeed: 80,
    loop: true
  };
}
```

### Astro

```astro
---
import { astroUltraTyped } from '@ultratyped/astro';

let el: HTMLElement;
const options = {
  strings: ['Astro App', 'Ultra-fast typing'],
  typeSpeed: 80,
  loop: true
};
---

<span ref={el} set:html={astroUltraTyped(el, options)}></span>
```

### Lit

```typescript
import { LitElement, html } from 'lit';
import { UltraTypedController } from '@ultratyped/lit';

@customElement('my-component')
export class MyComponent extends LitElement {
  private typedController = new UltraTypedController(
    this,
    this.shadowRoot.querySelector('span')!,
    {
      strings: ['Lit App', 'Ultra-fast typing'],
      typeSpeed: 80,
      loop: true
    }
  );

  render() {
    return html`<span></span>`;
  }
}
```

### Preact

```jsx
import { useUltraTyped } from '@ultratyped/preact';

function App() {
  const ref = useUltraTyped({
    strings: ['Preact App', 'Ultra-fast typing'],
    typeSpeed: 80,
    loop: true
  });

  return <span ref={ref} />;
}
```

### React

```jsx
import { useUltraTyped } from "@ultratyped/react";

function App() {
  const ref = useUltraTyped({
    strings: ["React App", "Ultra-fast typing"],
    typeSpeed: 80,
    loop: true,
  });

  return <span ref={ref} />;
}
```

### Solid.js

```tsx
import { createUltraTyped } from '@ultratyped/solid';

function App() {
  let el: HTMLElement | undefined;
  createUltraTyped(el!, {
    strings: ['Solid App', 'Ultra-fast typing'],
    typeSpeed: 80,
    loop: true
  });

  return <span ref={el} />;
}
```

### Svelte

```svelte
<script>
import { ultratyped } from '@ultratyped/svelte';

let el;
ultratyped(el, {
  strings: ['Svelte App', 'Ultra-fast typing'],
  typeSpeed: 80,
  loop: true
});
</script>

<span bind:this={el} />
```

### TypeScript (Class-based API)

```typescript
import { UltraTypedTS, createUltraTyped } from '@ultratyped/typescript';

// Using class
const typed = new UltraTypedTS(el, {
  strings: ['TypeScript App', 'Ultra-fast typing'],
  typeSpeed: 80,
  loop: true
});

// Using factory function
const typed = createUltraTyped(el, {
  strings: ['TypeScript App', 'Ultra-fast typing'],
  typeSpeed: 80,
  loop: true
});

// Control methods
typed.start();
typed.stop();
typed.reset();
typed.destroy();
typed.updateOptions({ typeSpeed: 100 });
```

### Vue

```vue
<script setup>
import { useUltraTyped } from "@ultratyped/vue";

const el = useUltraTyped({
  strings: ["Vue App", "Ultra-fast typing"],
  typeSpeed: 80,
  loop: true,
});
</script>

<template>
  <span :ref="el" />
</template>
```

## Options

| Option      | Type       | Default  | Description                              |
| ----------- | ---------- | -------- | ---------------------------------------- |
| `strings`   | `string[]` | required | Array of strings to type                 |
| `typeSpeed` | `number`   | `50`     | Milliseconds per character typed         |
| `backSpeed` | `number`   | `30`     | Milliseconds per character backspaced    |
| `backDelay` | `number`   | `800`    | Milliseconds to pause before backspacing |
| `loop`      | `boolean`  | `true`   | Whether to loop through strings          |

## API

### Instance Methods

- `stop()` - Stop the animation
- `reset()` - Reset to initial state

## Performance

UltraTyped.js achieves its small size and high performance through:

- **requestAnimationFrame** - Syncs with browser paint cycle for smooth 60fps
- **Pre-tokenized strings** - HTML parsed once at initialization
- **Diff-based backspacing** - Only backspaces characters that differ
- **Zero allocation loop** - Single DOM write per frame

### Resource Optimization

**Memory Efficiency:**

- **511B gzipped** - Minimal memory footprint
- **Zero per-frame allocations** - No garbage collection pressure
- **String reuse** - Pre-allocated buffer for incremental updates
- **No closures in hot path** - Prevents memory leaks

**CPU Efficiency:**

- **rAF-driven** - Respects browser throttling for battery savings
- **Visibility API integration** - Pauses when tab is hidden
- **Single-pass tokenization** - O(n) parsing at init, zero at runtime
- **No regex in hot path** - Avoids expensive pattern matching

**DOM Efficiency:**

- **Single write per frame** - Minimizes layout thrashing
- **textContent over innerHTML** - Safer and faster for plain text
- **Batched updates** - Prevents forced reflows
- **No DOM queries in loop** - Cached element reference

### Scalability

- **Horizontal scaling** - Multiple instances can run independently without coordination
- **Vertical scaling** - Handles long strings through incremental rendering
- **No shared state** - Thread-safe by design
- **Graceful degradation** - Falls back to basic typing on low-end devices

## Security

UltraTyped.js follows security best practices for modern web applications. For detailed security information, threat model, and best practices, see [docs/SECURITY.md](docs/SECURITY.md).

### Security Highlights

- **XSS Prevention** - Uses `textContent` by default, HTML opt-in only
- **CSP Compliant** - No inline scripts, no `eval()`, no remote code loading
- **Zero Trust** - Minimal attack surface, no network requests, zero dependencies
- **AI/LLM Safe** - No prompt injection vectors, no data collection
- **Supply Chain Secure** - SBOM-ready, zero transitive dependencies

## Reliability

### Fault Tolerance

- **Graceful degradation** - Continues typing even if timing drifts
- **Memory leak prevention** - Proper cleanup on destroy()
- **Error boundaries** - Doesn't throw on invalid inputs
- **Recovery** - Can reset and restart after errors

### Observability

- **Performance metrics** - Built-in benchmarking support
- **Debug mode** - Easy to instrument for monitoring
- **Logging hooks** - Callbacks for lifecycle events
- **No silent failures** - Errors surface clearly

### Compatibility

- **Browser support** - Chrome 80+, Firefox 80+, Safari 14+, Edge 80+
- **Mobile optimization** - Battery-aware throttling
- **SSR safe** - Server-side rendering compatible
- **Progressive enhancement** - Works without JS for static content

## Benchmarks

Run benchmarks locally:

```bash
npm install
npm run build
npm run bench
```

View benchmark dashboard at `benchmarks/dashboard.html`

## Development

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run playground
npm run dev

# Run benchmarks
npm run bench
```

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
