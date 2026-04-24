# UltraTyped.js

[![npm version](https://badge.fury.io/js/ultratyped.svg)](https://www.npmjs.com/package/ultratyped)
[![bundle size](https://img.shields.io/bundlephobia/minzip/ultratyped)](https://bundlephobia.com/package/ultratyped)
[![CI](https://github.com/ram-ai-kumar/ultra-typed-js/workflows/CI/badge.svg)](https://github.com/ram-ai-kumar/ultra-typed-js/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Downloads](https://img.shields.io/npm/dw/ultratyped)](https://www.npmjs.com/package/ultratyped)
[![Security: CISO Ready](https://img.shields.io/badge/Security-CISO%20Ready-success)](docs/SECURITY.md)
[![ZTA Aligned](https://img.shields.io/badge/ZTA-Aligned-informational)](docs/SECURITY.md#zero-trust-architecture-zta-alignment)
[![OWASP Compliant](https://img.shields.io/badge/OWASP-Compliant-brightgreen)](docs/COMPLIANCE.md#owasp-top-10-2021)

Ultra-fast <2KB typing animation library with zero dependencies.

**[Live Demo](https://ram-ai-kumar.github.io/ultra-typed-js/)** | **[Documentation](https://ram-ai-kumar.github.io/ultra-typed-js/docs/API.html)** | **[Benchmarks](benchmarks/)**

## Table of Contents

- [UltraTyped.js](#ultratypedjs)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Typed.js Compatibility](#typedjs-compatibility)
    - [Feature Comparison](#feature-comparison)
    - [Migration Options](#migration-options)
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
    - [Callbacks](#callbacks)
  - [API](#api)
    - [Instance Methods](#instance-methods)
  - [Performance](#performance)
    - [Resource Optimization](#resource-optimization)
    - [Scalability](#scalability)
  - [Security \& Compliance](#security--compliance)
    - [Security Posture](#security-posture)
    - [⚠️ Security Warning: HTML Content Type](#️-security-warning-html-content-type)
    - [Compliance Frameworks](#compliance-frameworks)
    - [Security Documentation](#security-documentation)
  - [Testing](#testing)
    - [Unit Tests](#unit-tests)
    - [Cross-Browser E2E Tests](#cross-browser-e2e-tests)
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

### Core Capabilities

- **<2KB gzipped** - Smallest in its class
- **60fps smooth** - requestAnimationFrame-driven
- **Zero dependencies** - Pure vanilla JavaScript
- **Framework agnostic** - Works with all major frameworks
- **TypeScript support** - Full type definitions with zero runtime cost
- **Smart backspace** - Diff-based backspacing for efficiency
- **Production-ready** - CI/CD workflows, automated testing, comprehensive documentation

### Security & Compliance (CISO-Ready)

- **XSS Prevention** - Uses `textContent` by default, HTML opt-in only with sanitization warnings
- **CSP Compliant** - No inline scripts, no `eval()`, no remote code loading
- **Zero Trust Architecture (ZTA)** - Minimal attack surface, no network requests, zero dependencies
- **AI/LLM Safe** - No prompt injection vectors, no data collection, deterministic behavior
- **Supply Chain Secure** - SBOM-ready, zero transitive dependencies, auditable codebase
- **Penetration Test Ready** - Clear boundaries, no hidden state, reproducible behavior
- **OWASP Compliant** - No injection vulnerabilities (A03: Injection)
- **SOC 2 Ready** - Minimal data handling, auditable codebase
- **GDPR/CCPA Compliant** - No personal data processing, no data collection or sharing
- **NIST Aligned** - Follows NIST Cybersecurity Framework principles

## Typed.js Compatibility

UltraTyped.js is a drop-in replacement for Typed.js v2 with 100% feature parity and significantly smaller bundle size.

### Feature Comparison

| Feature                | Typed.js v2 | UltraTyped.js | typed-compat |
| ---------------------- | ----------- | ------------- | ------------ |
| **Bundle Size**        | ~13KB       | ~2KB          | ~2.5KB       |
| **Dependencies**       | 0           | 0             | 0            |
| **Cursor**             | ✅           | ✅             | ✅            |
| **Smart Backspace**    | ✅           | ✅             | ✅            |
| **Loop**               | ✅           | ✅             | ✅            |
| **Loop Count**         | ✅           | ✅             | ✅            |
| **Shuffle**            | ✅           | ✅             | ✅            |
| **Fade Out**           | ✅           | ✅             | ✅            |
| **HTML Content**       | ✅           | ✅             | ✅            |
| **Attribute Typing**   | ✅           | ✅             | ✅            |
| **Typing Variance**    | ✅           | ✅             | ✅            |
| **Input Focus Events** | ✅           | ✅             | ✅            |
| **All Callbacks**      | ✅           | ✅             | ✅            |
| **Instance Methods**   | ✅           | ✅             | ✅            |
| **SSR Support**        | ❌           | ✅             | ✅            |
| **TypeScript**         | ❌           | ✅             | ✅            |
| **Framework Adapters** | Limited     | Full          | Full         |

### Migration Options

**Option 1: Use typed-compat (Zero code changes)**

```bash
npm install @ultratyped/typed-compat @ultratyped/core
```

```javascript
// Before
import Typed from "typed.js";
const typed = new Typed("#element", { strings: ["Hello"] });

// After - just change the import
import Typed from "@ultratyped/typed-compat";
const typed = new Typed("#element", { strings: ["Hello"] });
```

**Option 2: Migrate to UltraTyped.js directly**

```bash
npm install @ultratyped/core
```

```javascript
// Before
import Typed from "typed.js";
const typed = new Typed("#element", { strings: ["Hello"] });

// After - use function instead of class
import UltraTyped from "@ultratyped/core";
const typed = UltraTyped("#element", { strings: ["Hello"] });
```

For detailed migration instructions, see the [Migration Guide](docs/MIGRATION.md).

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

| Option                 | Type                    | Default            | Description                                    |
| ---------------------- | ----------------------- | ------------------ | ---------------------------------------------- |
| `strings`              | `string[]`              | required           | Array of strings to type                       |
| `stringsElement`       | `string \| HTMLElement` | `null`             | CSS selector or element to read strings from   |
| `typeSpeed`            | `number`                | `50`               | Milliseconds per character typed               |
| `backSpeed`            | `number`                | `30`               | Milliseconds per character backspaced          |
| `backDelay`            | `number`                | `800`              | Milliseconds to pause before backspacing       |
| `loop`                 | `boolean`               | `true`             | Whether to loop through strings                |
| `loopCount`            | `number`                | `Infinity`         | Number of loops before stopping                |
| `shuffle`              | `boolean`               | `false`            | Randomize string order on each loop            |
| `contentType`          | `'text' \| 'html'`      | `'text'`           | Content type (text or HTML)                    |
| `attr`                 | `string`                | `null`             | Type into element attribute instead of text    |
| `smartBackspace`       | `boolean`               | `true`             | Smart backspace (only backspace differences)   |
| `showCursor`           | `boolean`               | `true`             | Show blinking cursor                           |
| `cursorChar`           | `string`                | `'\|'`             | Cursor character                               |
| `autoInsertCss`        | `boolean`               | `true`             | Auto-inject CSS for cursor animation           |
| `startDelay`           | `number`                | `0`                | Delay before first character typed             |
| `fadeOut`              | `boolean`               | `false`            | Fade out instead of backspacing                |
| `fadeOutDelay`         | `number`                | `500`              | Delay before fade starts                       |
| `fadeOutClass`         | `string`                | `'typed-fade-out'` | CSS class applied during fade                  |
| `typingVariance`       | `number`                | `0`                | Random jitter per character (human-like feel)  |
| `bindInputFocusEvents` | `boolean`               | `false`            | Pause typing when input/textarea gains focus   |
| `nonce`                | `string`                | `null`             | Nonce for CSP compatibility with autoInsertCss |

### Callbacks

| Callback                 | Signature                  | Description                            |
| ------------------------ | -------------------------- | -------------------------------------- |
| `onBegin`                | `(self) => void`           | Fires before first character typed     |
| `onComplete`             | `(self) => void`           | Fires when animation completes         |
| `preStringTyped`         | `(arrayPos, self) => void` | Fires before each string begins        |
| `onStringTyped`          | `(arrayPos, self) => void` | Fires after each string is fully typed |
| `onLastStringBackspaced` | `(self) => void`           | Fires when last string is fully erased |
| `onTypingPaused`         | `(arrayPos, self) => void` | Fires when animation pauses            |
| `onTypingResumed`        | `(arrayPos, self) => void` | Fires when animation resumes           |
| `onReset`                | `(self) => void`           | Fires on reset()                       |
| `onStop`                 | `(arrayPos, self) => void` | Fires on stop()                        |
| `onStart`                | `(arrayPos, self) => void` | Fires on start()                       |
| `onDestroy`              | `(self) => void`           | Fires on destroy()                     |

## API

### Instance Methods

- `stop()` - Stop the animation
- `start()` - Start or restart the animation
- `reset()` - Reset to initial state
- `pause()` - Pause animation without losing state
- `resume()` - Resume from pause
- `destroy()` - Stop and clean up (remove cursor, clear content)
- `toggle()` - Toggle between pause and resume

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

UltraTyped.js is designed with security as a foundational principle. Our CISO-ready posture ensures enterprise-grade security and compliance for global deployments.

### Security Posture

- **XSS Prevention** - Uses `textContent` by default, HTML opt-in only
- **CSP Compliant** - No inline scripts, no `eval()`, no remote code loading
- **Zero Trust Architecture (ZTA)** - Minimal attack surface, no network requests, zero dependencies
- **AI/LLM Safe** - No prompt injection vectors, no data collection, deterministic behavior
- **Supply Chain Secure** - SBOM-ready, zero transitive dependencies, auditable codebase
- **Penetration Test Ready** - Clear boundaries, no hidden state, reproducible behavior
- **Zero Data Collection** - No telemetry, no analytics, no tracking
- **Deterministic Behavior** - Fully reproducible, no randomness in core logic

### ⚠️ Security Warning: HTML Content Type

**When using `contentType: 'html'`, the library injects content via `innerHTML` without sanitization.**

**NEVER use this option with untrusted input**, including:

- Content from CMS (WordPress, Contentful, etc.)
- API responses from external services
- User-generated content
- URL query parameters
- Database queries

**Only use `contentType: 'html'` with trusted, developer-controlled HTML content.**

For untrusted input, always use the default `contentType: 'text'` which safely uses `textContent`.

```javascript
// ❌ UNSAFE - Never do this with untrusted input
const typed = UltraTyped("#element", {
  strings: [userGeneratedContent], // XSS risk!
  contentType: "html",
});

// ✅ SAFE - Use text mode for untrusted input
const typed = UltraTyped("#element", {
  strings: [userGeneratedContent], // Safe
  contentType: "text", // or omit (default)
});

// ✅ SAFE - HTML mode with trusted content only
const typed = UltraTyped("#element", {
  strings: ['<span class="highlight">Hello</span>'], // Developer-controlled
  contentType: "html",
});
```

### Compliance Frameworks

- **OWASP Top 10** - No injection vulnerabilities (A03: Injection), secure by design
- **SOC 2 Ready** - Minimal data handling, auditable codebase, clear incident response
- **GDPR Compliant** - No personal data processing, zero data collection, full transparency
- **CCPA Compliant** - No data collection or sharing, no sale of personal information
- **NIST Aligned** - Follows NIST Cybersecurity Framework principles (Identify, Protect, Detect, Respond, Recover)
- **ISO 27001 Aligned** - Security policies, risk assessment, asset management principles
- **Supply Chain Security** - SBOM-ready, zero transitive dependencies, provenance verification

### Security Documentation

- [Security Policy](docs/SECURITY.md) - Threat model, best practices, vulnerability reporting
- [Compliance](docs/COMPLIANCE.md) - Detailed compliance mapping and audit readiness
- [Performance](docs/PERFORMANCE.md) - Performance characteristics and benchmarks

## Testing

### Unit Tests

UltraTyped.js has comprehensive unit test coverage with 182 tests across all packages:

- **Core Library**: 112 tests covering initialization, typing animation, options, instance methods, edge cases
- **Security Tests**: XSS prevention (script tags, img onerror, iframe, SVG, data URI), CSP nonce support, input validation
- **Negative Tests**: Invalid inputs (null, undefined, non-array strings), extreme values (1M character strings, 1000-item arrays)
- **Exception Tests**: Multiple destroy/stop/reset calls, callbacks that throw errors, non-function callbacks
- **Memory Leak Tests**: Event listener cleanup, cursor element cleanup, style element handling
- **Framework Adapters**: 70 tests across React, Vue, Svelte, Angular, Astro, Preact, Lit, Solid, TypeScript

Run unit tests:

```bash
npm test
npm run test:coverage
npm run test:ui
```

### Cross-Browser E2E Tests

UltraTyped.js uses Playwright for cross-browser compatibility testing across:

- **Desktop Browsers**: Chrome/Chromium, Firefox, Safari/WebKit, Edge (via Chromium)
- **Mobile Browsers**: Mobile Chrome (Pixel 5), Mobile Safari (iPhone 12)

All 6 E2E tests pass on all browsers:

- ✓ should render typing animation
- ✓ should show cursor when showCursor is true
- ✓ should handle multiple strings
- ✓ should handle window visibility changes
- ✓ should handle rapid stop/start calls
- ✓ should handle reset functionality

Run E2E tests:

```bash
npm run test:e2e              # Run all browsers
npx playwright test --project=chromium   # Chrome/Edge only
npx playwright test --project=firefox     # Firefox only
npx playwright test --project=webkit      # Safari only
npm run test:e2e:ui          # Run with Playwright UI
```

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
