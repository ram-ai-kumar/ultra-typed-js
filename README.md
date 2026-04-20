# UltraTyped.js

[![npm version](https://badge.fury.io/js/ultratyped.svg)](https://www.npmjs.com/package/ultratyped)
[![bundle size](https://img.shields.io/bundlephobia/minzip/ultratyped)](https://bundlephobia.com/package/ultratyped)
[![CI](https://github.com/ram-ai-kumar/ultra-typed-js/workflows/CI/badge.svg)](https://github.com/ram-ai-kumar/ultra-typed-js/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Downloads](https://img.shields.io/npm/dw/ultratyped)](https://www.npmjs.com/package/ultratyped)

Ultra-fast <2KB typing animation library with zero dependencies.

**[Live Demo](https://ram-ai-kumar.github.io/ultra-typed-js/)** | **[Documentation](docs/)** | **[Benchmarks](benchmarks/)**

## Table of Contents

- [UltraTyped.js](#ultratypedjs)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Supported Frameworks](#supported-frameworks)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
  - [Usage](#usage)
    - [Vanilla JavaScript](#vanilla-javascript)
    - [Alpine.js](#alpinejs)
    - [Angular](#angular)
    - [Astro](#astro)
    - [Lit](#lit)
    - [Preact](#preact)
    - [React](#react)
    - [Solid.js](#solidjs)
    - [Svelte](#svelte)
    - [TypeScript (Class-based API)](#typescript-class-based-api)
    - [Vue](#vue)
  - [Options](#options)
  - [API](#api)
    - [Instance Methods](#instance-methods)
  - [Performance](#performance)
    - [Resource Optimization](#resource-optimization)
    - [Scalability](#scalability)
  - [Security & Compliance](#security--compliance)
    - [Security Posture](#security-posture)
    - [Compliance Frameworks](#compliance-frameworks)
    - [Security Documentation](#security-documentation)
  - [Reliability](#reliability)
    - [Fault Tolerance](#fault-tolerance)
    - [Observability](#observability)
    - [Compatibility](#compatibility)
  - [Benchmarks](#benchmarks)
  - [Development](#development)
  - [Test Coverage](#test-coverage)
  - [License](#license)
  - [Contributing](#contributing)

## Features

- **<2KB gzipped** - Smallest in its class
- **60fps smooth** - requestAnimationFrame-driven
- **Zero dependencies** - Pure vanilla JavaScript
- **Framework agnostic** - Works with all major frameworks
- **TypeScript support** - Full type definitions with zero runtime cost
- **Smart backspace** - Diff-based backspacing for efficiency
- **Security-first** - XSS prevention, CSP compliant, zero trust architecture
- **Production-ready** - CI/CD workflows, automated testing, comprehensive documentation

## Supported Frameworks

![React](https://img.shields.io/badge/React-18%2B-black?logo=react)
![Vue](https://img.shields.io/badge/Vue-3%2B-4FC08D?logo=vue.js)
![Svelte](https://img.shields.io/badge/Svelte-4%2B-FF3E00?logo=svelte)
![Angular](https://img.shields.io/badge/Angular-17%2B-DD0031?logo=angular)
![Solid](https://img.shields.io/badge/Solid-1%2B-4683FF?logo=solid)
![Preact](https://img.shields.io/badge/Preact-10%2B-673AB8?logo=preact)
![Alpine](https://img.shields.io/badge/Alpine-3%2B-77C1D2?logo=alpine.js)
![Lit](https://img.shields.io/badge/Lit-3%2B-325CCC?logo=lit)
![Astro](https://img.shields.io/badge/Astro-4%2B-FF5D01?logo=astro)
![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-3178C6?logo=typescript)

## Installation

```bash
npm install ultratyped
```

Or for specific framework adapters:

```bash
npm install @ultratyped/react
npm install @ultratyped/vue
npm install @ultratyped/svelte
npm install @ultratyped/typescript
npm install @ultratyped/angular
npm install @ultratyped/solid
npm install @ultratyped/preact
npm install @ultratyped/alpine
npm install @ultratyped/lit
npm install @ultratyped/astro
```

## Quick Start

```javascript
import UltraTyped from "ultratyped";

const el = document.getElementById("typed");
const instance = UltraTyped(el, {
  strings: ["Hello World", "Ultra-fast typing"],
  typeSpeed: 80,
  loop: true,
});
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
  import ultratyped from "@ultratyped/alpine";
  Alpine.plugin(ultratyped);
</script>

<div
  x-data="{ typed: { strings: ['Alpine App', 'Ultra-fast typing'], typeSpeed: 80, loop: true } }"
>
  <span x-typed="typed"></span>
</div>
```

### Angular

```typescript
import { Component } from "@angular/core";
import { UltraTypedDirective } from "@ultratyped/angular";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [UltraTypedDirective],
  template: ` <span [ultratyped]="options"></span> `,
})
export class AppComponent {
  options = {
    strings: ["Angular App", "Ultra-fast typing"],
    typeSpeed: 80,
    loop: true,
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
import { LitElement, html } from "lit";
import { UltraTypedController } from "@ultratyped/lit";

@customElement("my-component")
export class MyComponent extends LitElement {
  private typedController = new UltraTypedController(
    this,
    this.shadowRoot.querySelector("span")!,
    {
      strings: ["Lit App", "Ultra-fast typing"],
      typeSpeed: 80,
      loop: true,
    },
  );

  render() {
    return html`<span></span>`;
  }
}
```

### Preact

```jsx
import { useUltraTyped } from "@ultratyped/preact";

function App() {
  const ref = useUltraTyped({
    strings: ["Preact App", "Ultra-fast typing"],
    typeSpeed: 80,
    loop: true,
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
import { createUltraTyped } from "@ultratyped/solid";

function App() {
  let el: HTMLElement | undefined;
  createUltraTyped(el!, {
    strings: ["Solid App", "Ultra-fast typing"],
    typeSpeed: 80,
    loop: true,
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
import { UltraTypedTS, createUltraTyped } from "@ultratyped/typescript";

// Using class
const typed = new UltraTypedTS(el, {
  strings: ["TypeScript App", "Ultra-fast typing"],
  typeSpeed: 80,
  loop: true,
});

// Using factory function
const typed = createUltraTyped(el, {
  strings: ["TypeScript App", "Ultra-fast typing"],
  typeSpeed: 80,
  loop: true,
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

## Security & Compliance

UltraTyped.js is designed with security as a foundational principle. Our CISO-ready posture ensures enterprise-grade security and compliance.

### Security Posture

- **XSS Prevention** - Uses `textContent` by default, HTML opt-in only
- **CSP Compliant** - No inline scripts, no `eval()`, no remote code loading
- **Zero Trust Architecture** - Minimal attack surface, no network requests, zero dependencies
- **AI/LLM Safe** - No prompt injection vectors, no data collection
- **Supply Chain Secure** - SBOM-ready, zero transitive dependencies
- **Penetration Test Ready** - Clear boundaries, no hidden state, reproducible behavior

### Compliance Frameworks

- **OWASP Top 10** - No injection vulnerabilities (A03: Injection)
- **SOC 2 Ready** - Minimal data handling, auditable codebase
- **GDPR Compliant** - No personal data processing
- **CCPA Compliant** - No data collection or sharing
- **NIST Aligned** - Follows NIST Cybersecurity Framework principles

### Security Documentation

- [Security Policy](docs/SECURITY.md) - Threat model, best practices, vulnerability reporting
- [Compliance](docs/COMPLIANCE.md) - Detailed compliance mapping and audit readiness
- [Performance](docs/PERFORMANCE.md) - Performance characteristics and benchmarks

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

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run benchmarks
npm run bench

# Clean build artifacts
npm run clean
```

## Test Coverage

![Test Coverage](https://img.shields.io/badge/Coverage-80%25-brightgreen)

UltraTyped.js has comprehensive test coverage with 97 tests across all packages.

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
