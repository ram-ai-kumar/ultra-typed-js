# UltraTyped.js Best Practices Guide

This guide covers recommended patterns, performance optimizations, and professional development practices for using UltraTyped.js in production applications.

## Table of Contents

- [Core Principles](#core-principles)
- [Performance Best Practices](#performance-best-practices)
- [Accessibility Guidelines](#accessibility-guidelines)
- [Security Best Practices](#security-best-practices)
- [Framework-Specific Best Practices](#framework-specific-best-practices)
- [Bundle Optimization](#bundle-optimization)
- [Testing Strategies](#testing-strategies)
- [Error Handling](#error-handling)
- [Code Organization](#code-organization)
- [Common Patterns](#common-patterns)
- [Anti-Patterns to Avoid](#anti-patterns-to-avoid)

---

## Core Principles

### 1. Progressive Enhancement

Always ensure your content is accessible without JavaScript:

```html
<!-- Good: Content visible without JS -->
<span class="typing-text">
  Welcome to our platform
  <span class="typed-element" aria-hidden="true"></span>
</span>

<script>
  // Enhance with typing effect
  UltraTyped(".typed-element", {
    strings: ["Welcome to our platform", "Explore our features"],
    typeSpeed: 50,
  });
</script>
```

### 2. Performance-First Design

Prioritize smooth 60fps animations over complex effects:

```javascript
// ✅ Good: Optimized for performance
UltraTyped("#element", {
  strings: ["Fast", "Smooth", "Efficient"],
  typeSpeed: 50, // Reasonable speed
  typingVariance: 5, // Low variance for consistency
  backSpeed: 30, // Smooth deletion
});

// ❌ Avoid: Too complex for smooth animation
UltraTyped("#element", {
  strings: ["Complex text with many variations..."],
  typingVariance: 100, // Too high variance
  typeSpeed: 10, // Too fast
});
```

### 3. Mobile-First Approach

Design for mobile devices and enhance for desktop:

```javascript
const isMobile = window.innerWidth < 768;
const isLowEnd = navigator.hardwareConcurrency <= 2;

UltraTyped("#element", {
  strings: ["Mobile-friendly text"],
  typeSpeed: isMobile ? 30 : 50,
  typingVariance: isLowEnd ? 0 : 10,
  showCursor: !isMobile, // Hide cursor on small screens
});
```

---

## Performance Best Practices

### 1. Optimize Animation Parameters

```javascript
// ✅ Optimized settings for smooth performance
const optimizedConfig = {
  typeSpeed: 50, // 50ms per character (good balance)
  backSpeed: 30, // 30ms for deletion
  backDelay: 800, // 800ms pause before deletion
  typingVariance: 5, // Minimal variance for consistency
  startDelay: 0, // No unnecessary delay
  showCursor: true, // Keep cursor for UX
  autoInsertCss: true, // Let UltraTyped handle CSS
};

UltraTyped("#element", optimizedConfig);
```

### 2. Use Visibility API for Battery Savings

```javascript
const instance = UltraTyped("#element", {
  strings: ["Battery-friendly typing"],
  typeSpeed: 50,
});

// Pause when tab is not visible
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    instance.pause();
  } else {
    instance.resume();
  }
});

// Alternative: Use Intersection Observer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        instance.resume();
      } else {
        instance.pause();
      }
    });
  },
  { threshold: 0.1 },
);

observer.observe(document.querySelector("#element"));
```

### 3. Memory Management

Always clean up instances to prevent memory leaks:

```javascript
// React Example
function TypingComponent() {
  const elementRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (elementRef.current) {
      instanceRef.current = UltraTyped(elementRef.current, {
        strings: ["Clean", "Efficient", "Memory-safe"],
      });
    }

    return () => {
      // Critical: Clean up on unmount
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, []);

  return <span ref={elementRef} />;
}
```

### 4. Batch DOM Updates

```javascript
// ✅ Good: Single instance with multiple strings
UltraTyped("#element", {
  strings: ["First message", "Second message", "Third message"],
  loop: true,
});

// ❌ Avoid: Multiple instances for same effect
// This creates multiple DOM elements and event listeners
```

---

## Accessibility Guidelines

### 1. Screen Reader Support

Provide alternative content for screen readers:

```html
<!-- Accessible typing effect -->
<div class="typing-container">
  <span class="sr-only" id="typing-status"> Welcome to our platform </span>
  <span
    class="typed-element"
    aria-hidden="true"
    aria-live="polite"
    aria-atomic="true"
  ></span>
</div>

<script>
  UltraTyped(".typed-element", {
    strings: ["Welcome to our platform", "Explore our features"],
    onStringTyped: (i, self) => {
      // Update screen reader content
      const status = document.getElementById("typing-status");
      status.textContent = self.strings[i];
    },
  });
</script>

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
```

### 2. Keyboard Navigation

Ensure typing effects don't interfere with keyboard users:

```javascript
// Pause typing when user interacts with keyboard
const instance = UltraTyped("#element", {
  strings: ["Keyboard accessible"],
  typeSpeed: 50,
});

document.addEventListener("keydown", (e) => {
  // Pause typing if user starts typing or navigating
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
    instance.pause();
  }
});

document.addEventListener("keyup", (e) => {
  // Resume when user stops typing
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
    setTimeout(() => instance.resume(), 2000);
  }
});
```

### 3. Motion Preferences

Respect user's motion preferences:

```javascript
// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const config = {
  strings: ["Accessible", "Inclusive", "User-friendly"],
  typeSpeed: prefersReducedMotion ? 0 : 50, // Instant if reduced motion
  showCursor: !prefersReducedMotion, // Hide cursor if reduced motion
  typingVariance: prefersReducedMotion ? 0 : 5,
};

UltraTyped("#element", config);

// Listen for changes in preference
window
  .matchMedia("(prefers-reduced-motion: reduce)")
  .addEventListener("change", (e) => {
    if (e.matches) {
      instance.destroy();
      UltraTyped("#element", { ...config, typeSpeed: 0, showCursor: false });
    }
  });
```

### 4. Color Contrast and Visual Accessibility

```css
/* Ensure sufficient contrast for typing text */
.typed-element {
  color: #333333; /* High contrast against light backgrounds */
  font-size: 16px; /* Minimum readable size */
  line-height: 1.5;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .typed-element {
    color: #ffffff; /* High contrast against dark backgrounds */
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .typed-element {
    color: WindowText;
    background: Window;
  }

  .typed-cursor {
    color: WindowText;
    background: Window;
  }
}
```

---

## Security Best Practices

### 1. HTML Content Sanitization

Never use HTML content type with untrusted input:

```javascript
// ❌ DANGEROUS: Never do this with user input
const userInput = getUserInput(); // Could be malicious
UltraTyped("#element", {
  strings: [userInput],
  contentType: "html", // XSS risk!
});

// ✅ SAFE: Use text mode for untrusted input
UltraTyped("#element", {
  strings: [userInput],
  contentType: "text", // Default, safe
});

// ✅ SAFE: HTML mode with trusted content only
const trustedHTML = '<span class="highlight">Safe content</span>';
UltraTyped("#element", {
  strings: [trustedHTML],
  contentType: "html",
});
```

### 2. Content Security Policy (CSP)

Configure CSP for secure deployments:

```javascript
// For CSP environments, provide nonce
const instance = UltraTyped("#element", {
  strings: ["CSP compliant"],
  autoInsertCss: true,
  nonce: "your-csp-nonce", // Must match your CSP header
});

// Alternative: Disable auto CSS and provide your own
UltraTyped("#element", {
  strings: ["Manual CSS"],
  autoInsertCss: false,
});
```

```html
<!-- CSP Header Example -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self';
               style-src 'self' 'nonce-your-csp-nonce';
               script-src 'self'"
/>
```

### 3. Input Validation

Validate all inputs before processing:

```javascript
function validateTypingStrings(strings) {
  if (!Array.isArray(strings)) {
    throw new Error("Strings must be an array");
  }

  return strings.filter((str) => {
    if (typeof str !== "string") return false;
    if (str.length > 1000) return false; // Prevent DoS
    if (/<script|javascript:|on\w+=/i.test(str)) return false; // Basic XSS check
    return true;
  });
}

// Usage
const userInputStrings = getUserStrings();
const safeStrings = validateTypingStrings(userInputStrings);

UltraTyped("#element", {
  strings: safeStrings,
});
```

---

## Framework-Specific Best Practices

### React Best Practices

#### 1. Use the Official Hook

```tsx
// ✅ Best: Use the official React hook
import { useUltraTyped } from "@ultratyped/react";

function HeroSection() {
  const { ref, instance } = useUltraTyped({
    strings: ["React", "TypeScript", "UltraTyped"],
    typeSpeed: 50,
    loop: true,
  });

  // Handle cleanup automatically
  useEffect(() => {
    return () => instance?.destroy();
  }, [instance]);

  return (
    <h1>
      Built with <span ref={ref} />
    </h1>
  );
}
```

#### 2. Memoize Configuration

```tsx
// ✅ Good: Memoize configuration to prevent re-renders
import { useMemo } from "react";

function TypingComponent({ strings }) {
  const config = useMemo(
    () => ({
      strings,
      typeSpeed: 50,
      loop: true,
    }),
    [strings],
  );

  const { ref } = useUltraTyped(config);

  return <span ref={ref} />;
}
```

#### 3. Server-Side Rendering

```tsx
// ✅ SSR-safe implementation
import { useState, useEffect } from "react";

function TypingComponent({ strings }) {
  const [isClient, setIsClient] = useState(false);
  const { ref } = useUltraTyped({
    strings,
    typeSpeed: 50,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <span>{strings[0]}</span>; // Fallback for SSR
  }

  return <span ref={ref} />;
}
```

### Vue Best Practices

#### 1. Composition API Pattern

```vue
<template>
  <span ref="typedElement"></span>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useUltraTyped } from "@ultratyped/vue";

const props = defineProps({
  strings: {
    type: Array,
    required: true,
  },
});

const typedElement = ref(null);
const { instance } = useUltraTyped(typedElement, {
  strings: props.strings,
  typeSpeed: 50,
});

onUnmounted(() => {
  instance?.destroy();
});
</script>
```

#### 2. Reactive Configuration

```vue
<script setup>
import { ref, watch } from "vue";
import { useUltraTyped } from "@ultratyped/vue";

const strings = ref(["Initial", "Text"]);
const typedElement = ref(null);

const { instance } = useUltraTyped(typedElement, {
  strings: strings.value,
  typeSpeed: 50,
});

// React to configuration changes
watch(strings, (newStrings) => {
  instance?.destroy();
  useUltraTyped(typedElement, {
    strings: newStrings,
    typeSpeed: 50,
  });
});
</script>
```

### Svelte Best Practices

#### 1. Action Pattern

```svelte
<script>
  import { ultratyped } from '@ultratyped/svelte';

  export let strings = ['Svelte', 'Reactive', 'Typing'];

  let element;

  // Use action for automatic cleanup
  const typingAction = ultratyped(element, {
    strings,
    typeSpeed: 50,
    loop: true,
  });
</script>

<span bind:this={element} use:typingAction></span>
```

#### 2. Reactive Updates

```svelte
<script>
  import { ultratyped } from '@ultratyped/svelte';

  let strings = ['Dynamic', 'Content'];
  let element;

  $: if (element && strings) {
    // Recreate when strings change
    ultratyped(element, {
      strings,
      typeSpeed: 50,
    });
  }
</script>

<span bind:this={element}></span>
```

---

## Bundle Optimization

### 1. Tree Shaking

```javascript
// ✅ Good: Use default export for optimal tree shaking
import UltraTyped from "ultratyped";

// ❌ Avoid: Named exports (don't exist, would break tree shaking)
// import { UltraTyped } from 'ultratyped';
```

### 2. Framework-Specific Packages

```javascript
// ✅ Best: Use framework-specific package
import { useUltraTyped } from "@ultratyped/react";

// ❌ Avoid: Importing both core and framework packages
import UltraTyped from "ultratyped";
import { useUltraTyped } from "@ultratyped/react";
```

### 3. Dynamic Imports

```javascript
// ✅ Good: Code split typing effects
const loadTypingEffect = async () => {
  const { default: UltraTyped } = await import("ultratyped");

  UltraTyped("#element", {
    strings: ["Lazy", "Loaded"],
    typeSpeed: 50,
  });
};

// Load only when needed
if (intersectionObserver.isIntersecting) {
  loadTypingEffect();
}
```

### 4. Bundle Analysis

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
        ultratyped: {
          test: /[\\/]node_modules[\\/]ultratyped[\\/]/,
          name: "ultratyped",
          chunks: "all",
        },
      },
    },
  },
};
```

---

## Testing Strategies

### 1. Unit Testing

```javascript
// typing.test.js
import { render, screen } from "@testing-library/react";
import { useUltraTyped } from "@ultratyped/react";

// Mock UltraTyped for testing
jest.mock("@ultratyped/react", () => ({
  useUltraTyped: jest.fn(() => ({
    ref: { current: document.createElement("span") },
    instance: { destroy: jest.fn() },
  })),
}));

test("typing effect initializes correctly", () => {
  const TestComponent = () => {
    const { ref } = useUltraTyped({
      strings: ["Test"],
      typeSpeed: 50,
    });
    return <span ref={ref} />;
  };

  render(<TestComponent />);
  expect(screen.getByRole("generic")).toBeInTheDocument();
});
```

### 2. Integration Testing

```javascript
// typing.integration.test.js
import UltraTyped from "ultratyped";

describe("UltraTyped Integration", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="test-element"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("typing animation completes", (done) => {
    const instance = UltraTyped("#test-element", {
      strings: ["Hello", "World"],
      typeSpeed: 10,
      onComplete: () => {
        expect(document.querySelector("#test-element").textContent).toBe(
          "World",
        );
        done();
      },
    });
  });
});
```

### 3. Performance Testing

```javascript
// typing.performance.test.js
import UltraTyped from "ultratyped";

describe("Performance Tests", () => {
  test("maintains 60fps with long strings", () => {
    const longString = "A".repeat(1000);
    const startTime = performance.now();

    const instance = UltraTyped("#element", {
      strings: [longString],
      typeSpeed: 10,
    });

    const endTime = performance.now();
    const initTime = endTime - startTime;

    // Should initialize quickly
    expect(initTime).toBeLessThan(100);

    instance.destroy();
  });
});
```

---

## Error Handling

### 1. Graceful Degradation

```javascript
function safeTyping(selector, config) {
  try {
    const element = document.querySelector(selector);

    if (!element) {
      console.warn(`Element not found: ${selector}`);
      return null;
    }

    return UltraTyped(element, config);
  } catch (error) {
    console.error("Failed to initialize typing effect:", error);

    // Fallback: display first string immediately
    const element = document.querySelector(selector);
    if (element && config.strings?.length > 0) {
      element.textContent = config.strings[0];
    }

    return null;
  }
}

// Usage
const instance = safeTyping("#element", {
  strings: ["Safe", "Typing"],
  typeSpeed: 50,
});
```

### 2. Configuration Validation

```javascript
function validateConfig(config) {
  const errors = [];

  if (!config.strings || !Array.isArray(config.strings)) {
    errors.push("strings must be a non-empty array");
  }

  if (
    config.typeSpeed &&
    (typeof config.typeSpeed !== "number" || config.typeSpeed < 0)
  ) {
    errors.push("typeSpeed must be a positive number");
  }

  if (config.contentType && !["text", "html"].includes(config.contentType)) {
    errors.push('contentType must be "text" or "html"');
  }

  return errors;
}

function createTypingEffect(selector, config) {
  const errors = validateConfig(config);

  if (errors.length > 0) {
    throw new Error(`Invalid configuration: ${errors.join(", ")}`);
  }

  return UltraTyped(selector, config);
}
```

### 3. Network Error Handling

```javascript
async function loadTypingContent(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return UltraTyped("#element", {
      strings: data.strings,
      typeSpeed: 50,
    });
  } catch (error) {
    console.error("Failed to load typing content:", error);

    // Fallback content
    return UltraTyped("#element", {
      strings: ["Content unavailable"],
      typeSpeed: 50,
    });
  }
}
```

---

## Code Organization

### 1. Configuration Management

```javascript
// config/typing.js
export const typingConfigs = {
  hero: {
    typeSpeed: 50,
    backSpeed: 30,
    loop: true,
    showCursor: true,
    autoInsertCss: true,
  },

  subtle: {
    typeSpeed: 80,
    backSpeed: 40,
    loop: false,
    showCursor: false,
    typingVariance: 5,
  },

  fast: {
    typeSpeed: 30,
    backSpeed: 20,
    loop: true,
    typingVariance: 10,
  },
};

export function createTypingEffect(selector, strings, preset = "hero") {
  return UltraTyped(selector, {
    ...typingConfigs[preset],
    strings,
  });
}
```

### 2. Hook Abstraction

```javascript
// hooks/useTypingEffect.js
import { useEffect, useRef } from "react";
import UltraTyped from "ultratyped";

export function useTypingEffect(selector, config, dependencies = []) {
  const instanceRef = useRef(null);

  useEffect(() => {
    const element = document.querySelector(selector);

    if (element) {
      instanceRef.current = UltraTyped(element, config);
    }

    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, dependencies);

  return instanceRef.current;
}

// Usage
const instance = useTypingEffect(
  "#hero",
  {
    strings: ["React", "TypeScript"],
    typeSpeed: 50,
  },
  [strings],
);
```

### 3. Service Layer

```javascript
// services/typingService.js
class TypingService {
  constructor() {
    this.instances = new Map();
  }

  create(id, selector, config) {
    this.destroy(id); // Clean up existing instance

    const instance = UltraTyped(selector, config);
    this.instances.set(id, instance);

    return instance;
  }

  destroy(id) {
    const instance = this.instances.get(id);
    if (instance) {
      instance.destroy();
      this.instances.delete(id);
    }
  }

  pause(id) {
    this.instances.get(id)?.pause();
  }

  resume(id) {
    this.instances.get(id)?.resume();
  }

  destroyAll() {
    this.instances.forEach((instance) => instance.destroy());
    this.instances.clear();
  }
}

export const typingService = new TypingService();
```

---

## Common Patterns

### 1. Progressive Loading

```javascript
// Load typing effects as they come into view
const typingObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.dataset.typingLoaded) {
        const strings = JSON.parse(entry.target.dataset.strings);

        UltraTyped(entry.target, {
          strings,
          typeSpeed: 50,
        });

        entry.target.dataset.typingLoaded = "true";
      }
    });
  },
  { threshold: 0.1 },
);

// Observe all typing elements
document.querySelectorAll("[data-strings]").forEach((el) => {
  typingObserver.observe(el);
});
```

### 2. Dynamic Content Loading

```javascript
async function loadDynamicTyping(selector, apiUrl) {
  try {
    const response = await fetch(apiUrl);
    const { strings, config } = await response.json();

    return UltraTyped(selector, {
      strings,
      typeSpeed: 50,
      ...config,
    });
  } catch (error) {
    console.error("Failed to load dynamic content:", error);

    // Fallback to static content
    return UltraTyped(selector, {
      strings: ["Loading failed"],
      typeSpeed: 50,
    });
  }
}
```

### 3. Responsive Typing

```javascript
function createResponsiveTyping(selector, configs) {
  const getActiveConfig = () => {
    const width = window.innerWidth;

    if (width < 768) return configs.mobile;
    if (width < 1024) return configs.tablet;
    return configs.desktop;
  };

  let instance = UltraTyped(selector, getActiveConfig());

  // Recreate on resize with debouncing
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      instance.destroy();
      instance = UltraTyped(selector, getActiveConfig());
    }, 250);
  });

  return instance;
}
```

---

## Anti-Patterns to Avoid

### 1. Don't Create Multiple Instances for Same Element

```javascript
// ❌ Bad: Multiple instances on same element
UltraTyped("#element", { strings: ["First"] });
UltraTyped("#element", { strings: ["Second"] }); // Conflicts!

// ✅ Good: Single instance with multiple strings
UltraTyped("#element", {
  strings: ["First", "Second"],
  loop: true,
});
```

### 2. Don't Ignore Cleanup

```javascript
// ❌ Bad: No cleanup
function Component() {
  useEffect(() => {
    UltraTyped("#element", { strings: ["Memory leak"] });
  });
}

// ✅ Good: Proper cleanup
function Component() {
  useEffect(() => {
    const instance = UltraTyped("#element", { strings: ["Clean"] });
    return () => instance.destroy();
  }, []);
}
```

### 3. Don't Use HTML Mode with Untrusted Content

```javascript
// ❌ Dangerous: XSS vulnerability
const userInput = '<script>alert("xss")</script>';
UltraTyped("#element", {
  strings: [userInput],
  contentType: "html",
});

// ✅ Safe: Text mode for untrusted content
UltraTyped("#element", {
  strings: [userInput],
  contentType: "text",
});
```

### 4. Don't Block the Main Thread

```javascript
// ❌ Bad: Synchronous processing
const hugeStrings = generateHugeStrings(); // Blocks UI
UltraTyped("#element", { strings: hugeStrings });

// ✅ Good: Async processing
async function loadStrings() {
  const hugeStrings = await generateHugeStringsAsync(); // Non-blocking
  UltraTyped("#element", { strings: hugeStrings });
}
```

### 5. Don't Hardcode Configuration

```javascript
// ❌ Bad: Hardcoded values
UltraTyped("#element", {
  strings: ["Fixed", "Content"],
  typeSpeed: 50, // Magic number
  backSpeed: 30, // Magic number
});

// ✅ Good: Configurable
const config = getConfigForContext("hero");
UltraTyped("#element", {
  strings: config.strings,
  typeSpeed: config.typeSpeed,
  backSpeed: config.backSpeed,
});
```

---

## Summary

Following these best practices will help you:

- **Ensure smooth 60fps performance** across all devices
- **Maintain accessibility** for all users
- **Prevent security vulnerabilities** and XSS attacks
- **Optimize bundle size** and loading performance
- **Write maintainable, testable code**
- **Handle errors gracefully** with proper fallbacks

Remember to always prioritize user experience, performance, and accessibility when implementing typing effects in production applications.
