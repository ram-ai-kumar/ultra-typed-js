# UltraTyped.js Troubleshooting Guide

This comprehensive guide helps you diagnose and resolve common issues with UltraTyped.js, from basic setup problems to advanced debugging scenarios.

## Table of Contents

- [Quick Diagnosis](#quick-diagnosis)
- [Installation & Setup Issues](#installation--setup-issues)
- [Basic Functionality Problems](#basic-functionality-problems)
- [Framework-Specific Issues](#framework-specific-issues)
- [Performance Issues](#performance-issues)
- [Styling & Visual Issues](#styling--visual-issues)
- [Migration Issues](#migration-issues)
- [Advanced Debugging](#advanced-debugging)
- [Common Error Messages](#common-error-messages)
- [Getting Help](#getting-help)

---

## Quick Diagnosis

Start here for rapid problem identification:

### Symptom → Solution Matrix

| Symptom                      | Likely Cause       | Quick Fix                   |
| ---------------------------- | ------------------ | --------------------------- |
| **No typing animation**      | Element not found  | Check DOM readiness         |
| **Cursor not blinking**      | CSS not injected   | Enable `autoInsertCss`      |
| **Animation stops abruptly** | Memory leak        | Call `destroy()` on cleanup |
| **Text appears instantly**   | Speed too high     | Increase `typeSpeed`        |
| **No backspacing**           | `backSpeed` is 0   | Set positive `backSpeed`    |
| **Loop not working**         | `loop: false`      | Set `loop: true`            |
| **HTML not rendering**       | Wrong content type | Set `contentType: 'html'`   |

### Diagnostic Checklist

Run this checklist first:

```javascript
// 1. Element exists?
const el = document.querySelector("#my-element");
console.log("Element found:", !!el);

// 2. UltraTyped loaded?
console.log("UltraTyped loaded:", typeof UltraTyped !== "undefined");

// 3. Instance created?
const instance = UltraTyped(el, { strings: ["test"] });
console.log("Instance created:", !!instance);

// 4. Animation running?
console.log("Animation methods:", typeof instance.start, typeof instance.stop);
```

---

## Installation & Setup Issues

### Issue: Module not found / Cannot resolve import

**Error Messages:**

- `Cannot resolve module 'ultratyped'`
- `Module not found: Error: Can't resolve 'ultratyped'`
- `ultratyped is not defined`

**Causes & Solutions:**

1. **Package not installed**

   ```bash
   npm install ultratyped
   # or
   yarn add ultratyped
   ```

2. **Wrong import path**

   ```javascript
   // ❌ Wrong
   import UltraTyped from "ultratyped/core";

   // ✅ Correct
   import UltraTyped from "ultratyped";
   ```

3. **TypeScript configuration**

   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "moduleResolution": "node",
       "esModuleInterop": true
     }
   }
   ```

4. **Framework-specific imports**

   ```javascript
   // React
   import { useUltraTyped } from "@ultratyped/react";

   // Vue
   import { useUltraTyped } from "@ultratyped/vue";

   // Svelte
   import { ultratyped } from "@ultratyped/svelte";
   ```

### Issue: Bundle size unexpectedly large

**Symptoms:**

- Bundle analyzer shows >10KB for UltraTyped
- Multiple copies of UltraTyped in bundle

**Solutions:**

1. **Check for multiple imports**

   ```javascript
   // ❌ Importing multiple packages
   import UltraTyped from "ultratyped";
   import { useUltraTyped } from "@ultratyped/react";

   // ✅ Use framework package only
   import { useUltraTyped } from "@ultratyped/react";
   ```

2. **Verify bundle configuration**

   ```javascript
   // webpack.config.js
   module.exports = {
     optimization: {
       splitChunks: {
         chunks: "all",
       },
     },
   };
   ```

3. **Check for tree-shaking issues**

   ```javascript
   // ✅ Use default export
   import UltraTyped from "ultratyped";

   // ❌ Don't use named exports (they don't exist)
   import { UltraTyped } from "ultratyped";
   ```

---

## Basic Functionality Problems

### Issue: Animation not starting

**Symptoms:**

- Text appears instantly without typing
- Nothing happens
- Cursor shows but no typing

**Diagnostic Steps:**

1. **Check element existence**

   ```javascript
   const el = document.querySelector("#my-element");
   if (!el) {
     console.error("Element not found!");
     return;
   }
   ```

2. **Verify strings array**

   ```javascript
   const instance = UltraTyped(el, {
     strings: ["Hello", "World"], // Must be array
   });
   ```

3. **Check for auto-start**

   ```javascript
   // UltraTyped.js auto-starts by default
   // If using manual start:
   const instance = UltraTyped(el, { strings: ["Hello"] });
   // instance.start(); // Not needed for auto-start
   ```

**Common Solutions:**

```javascript
// ✅ Working example
document.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector("#typed");
  if (el) {
    UltraTyped(el, {
      strings: ["Hello World"],
      typeSpeed: 50,
    });
  }
});
```

### Issue: Cursor not appearing or not blinking

**Symptoms:**

- No cursor visible
- Cursor appears but doesn't blink
- Cursor appears in wrong position

**Solutions:**

1. **Enable cursor and CSS injection**

   ```javascript
   const instance = UltraTyped("#element", {
     strings: ["Hello"],
     showCursor: true, // Show cursor
     autoInsertCss: true, // Inject blinking CSS
     cursorChar: "|", // Custom cursor character
   });
   ```

2. **Manual CSS (if autoInsertCss disabled)**

   ```css
   .typed-cursor {
     opacity: 1;
     animation: typedjsBlink 0.7s infinite;
   }

   @keyframes typedjsBlink {
     0% {
       opacity: 1;
     }
     50% {
       opacity: 0;
     }
     100% {
       opacity: 1;
     }
   }
   ```

3. **CSP (Content Security Policy) issues**
   ```javascript
   // Add nonce for CSP
   const instance = UltraTyped("#element", {
     strings: ["Hello"],
     autoInsertCss: true,
     nonce: "your-csp-nonce", // If using CSP
   });
   ```

### Issue: Text appears instantly (no typing effect)

**Symptoms:**

- All text appears at once
- No typing animation
- Instant completion

**Causes & Solutions:**

1. **Type speed too high**

   ```javascript
   // ❌ Too fast
   UltraTyped("#element", {
     strings: ["Hello"],
     typeSpeed: 0, // Instant
   });

   // ✅ Reasonable speed
   UltraTyped("#element", {
     strings: ["Hello"],
     typeSpeed: 50, // 50ms per character
   });
   ```

2. **Start delay interfering**

   ```javascript
   UltraTyped("#element", {
     strings: ["Hello"],
     startDelay: 0, // Remove delay
     typeSpeed: 50,
   });
   ```

3. **Browser throttling**
   ```javascript
   // Check if tab is visible
   if (!document.hidden) {
     UltraTyped("#element", {
       strings: ["Hello"],
       typeSpeed: 50,
     });
   }
   ```

---

## Framework-Specific Issues

### React Issues

#### Issue: Hook not working in strict mode

**Symptoms:**

- Animation doesn't start
- Multiple instances created
- Memory warnings

**Solution:**

```jsx
import { useUltraTyped } from "@ultratyped/react";
import { useEffect, useRef } from "react";

function TypingComponent() {
  const { ref, instance } = useUltraTyped({
    strings: ["Hello", "World"],
    typeSpeed: 50,
  });

  // Handle strict mode
  useEffect(() => {
    return () => {
      instance?.destroy();
    };
  }, [instance]);

  return <span ref={ref} />;
}
```

#### Issue: TypeScript errors with hook

**Error:** `Property 'ref' does not exist on type`

**Solution:**

```tsx
import { useUltraTyped } from "@ultratyped/react";
import type { UltraTypedOptions } from "@ultratyped/react";

function Component() {
  const options: UltraTypedOptions = {
    strings: ["Hello"],
    typeSpeed: 50,
  };

  const { ref } = useUltraTyped(options);
  return <span ref={ref} />;
}
```

### Vue Issues

#### Issue: Ref not working in composition API

**Symptoms:**

- `ref.value` is null
- Animation doesn't start

**Solution:**

```vue
<template>
  <span ref="typedElement"></span>
</template>

<script setup>
import { useUltraTyped } from "@ultratyped/vue";
import { ref, onMounted } from "vue";

const typedElement = ref(null);

// Wait for mount
onMounted(() => {
  useUltraTyped(typedElement.value, {
    strings: ["Hello", "World"],
    typeSpeed: 50,
  });
});
</script>
```

#### Issue: SSR hydration mismatch

**Symptoms:**

- Hydration warnings
- Content flickering

**Solution:**

```vue
<template>
  <span ref="typedElement" v-if="isClient"></span>
</template>

<script setup>
import { useUltraTyped } from "@ultratyped/vue";
import { ref, onMounted } from "vue";

const typedElement = ref(null);
const isClient = ref(false);

onMounted(() => {
  isClient.value = true;
  useUltraTyped(typedElement.value, {
    strings: ["Hello", "World"],
  });
});
</script>
```

### Svelte Issues

#### Issue: Action not working

**Symptoms:**

- `use:ultratyped` not recognized
- No animation

**Solution:**

```svelte
<script>
  import { ultratyped } from '@ultratyped/svelte';

  let el;

  // Ensure element exists
  $: if (el) {
    ultratyped(el, {
      strings: ['Hello', 'World'],
      typeSpeed: 50,
    });
  }
</script>

<span bind:this={el}></span>
```

### Angular Issues

#### Issue: Directive not working

**Symptoms:**

- `[ultratyped]` not recognized
- No typing effect

**Solution:**

```typescript
import { Component } from "@angular/core";
import { UltraTypedDirective } from "@ultratyped/angular";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [UltraTypedDirective], // Import directive
  template: ` <span [ultratyped]="options"></span> `,
})
export class AppComponent {
  options = {
    strings: ["Hello", "World"],
    typeSpeed: 50,
  };
}
```

---

## Performance Issues

### Issue: Animation stuttering or lag

**Symptoms:**

- Typing not smooth
- Frame drops
- Janky cursor movement

**Solutions:**

1. **Reduce typing variance**

   ```javascript
   // ❌ High variance causes stutter
   UltraTyped("#element", {
     strings: ["Long text here..."],
     typingVariance: 100, // Too high
   });

   // ✅ Lower variance
   UltraTyped("#element", {
     strings: ["Long text here..."],
     typingVariance: 10, // Reasonable
   });
   ```

2. **Optimize for mobile**

   ```javascript
   // Detect mobile and adjust speed
   const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

   UltraTyped("#element", {
     strings: ["Hello"],
     typeSpeed: isMobile ? 30 : 50, // Slower on mobile
   });
   ```

3. **Use visibility API**

   ```javascript
   const instance = UltraTyped("#element", {
     strings: ["Hello"],
     typeSpeed: 50,
   });

   // Pause when tab not visible
   document.addEventListener("visibilitychange", () => {
     if (document.hidden) {
       instance.pause();
     } else {
       instance.resume();
     }
   });
   ```

### Issue: Memory leaks

**Symptoms:**

- Memory usage increases over time
- Browser becomes slow
- Multiple instances running

**Solutions:**

1. **Always destroy instances**

   ```javascript
   // React
   useEffect(() => {
     const instance = UltraTyped("#element", { strings: ["Hello"] });

     return () => {
       instance.destroy(); // Cleanup
     };
   }, []);
   ```

2. **Check for duplicate instances**

   ```javascript
   let instance = null;

   function initTyping() {
     if (instance) {
       instance.destroy(); // Destroy existing
     }
     instance = UltraTyped("#element", { strings: ["Hello"] });
   }
   ```

3. **Monitor memory usage**

   ```javascript
   // Development debugging
   if (process.env.NODE_ENV === "development") {
     const instance = UltraTyped("#element", { strings: ["Hello"] });

     // Monitor instance count
     console.log(
       "Active instances:",
       document.querySelectorAll(".typed-cursor").length,
     );
   }
   ```

---

## Styling & Visual Issues

### Issue: Cursor positioning problems

**Symptoms:**

- Cursor appears in wrong location
- Cursor overlaps text
- Cursor disappears after typing

**Solutions:**

1. **CSS positioning fixes**

   ```css
   .typed-cursor {
     display: inline-block;
     vertical-align: text-bottom;
     margin-left: 2px;
   }
   ```

2. **Font and line-height issues**

   ```css
   .typed-element {
     font-family: "Courier New", monospace;
     line-height: 1.4;
   }

   .typed-cursor {
     font-size: inherit;
     line-height: inherit;
   }
   ```

3. **Container styling**
   ```css
   .typing-container {
     display: inline-block;
     white-space: nowrap;
     overflow: hidden;
   }
   ```

### Issue: HTML content not rendering

**Symptoms:**

- HTML tags appear as text
- No styling applied to HTML content

**Solutions:**

1. **Enable HTML content type**

   ```javascript
   // ❌ Default text mode
   UltraTyped("#element", {
     strings: ['<span style="color: red">Hello</span>'],
   });

   // ✅ HTML mode
   UltraTyped("#element", {
     strings: ['<span style="color: red">Hello</span>'],
     contentType: "html",
   });
   ```

2. **Security considerations**

   ```javascript
   // Only use HTML with trusted content
   const trustedHTML = '<span class="highlight">Safe content</span>';

   UltraTyped("#element", {
     strings: [trustedHTML],
     contentType: "html",
   });
   ```

### Issue: Responsive design problems

**Symptoms:**

- Text breaks on small screens
- Cursor misaligned on mobile

**Solutions:**

1. **Responsive typography**

   ```css
   .typed-element {
     font-size: clamp(1rem, 2.5vw, 2rem);
   }
   ```

2. **Mobile-specific adjustments**

   ```javascript
   const isMobile = window.innerWidth < 768;

   UltraTyped("#element", {
     strings: ["Hello World"],
     typeSpeed: isMobile ? 30 : 50,
     cursorChar: isMobile ? "|" : "▊",
   });
   ```

---

## Migration Issues

### Issue: Coming from typewriter-effect

**Symptoms:**

- Method chaining doesn't work
- Different API structure

**Solutions:**

1. **Convert chaining to options**

   ```javascript
   // ❌ typewriter-effect style
   const writer = new Typewriter("#element");
   writer.typeString("Hello").pauseFor(1000).start();

   // ✅ UltraTyped.js style
   UltraTyped("#element", {
     strings: ["Hello"],
     typeSpeed: 50,
     backDelay: 1000,
   });
   ```

2. **Dynamic string addition**
   ```javascript
   // Instead of chaining, recreate with new strings
   function updateTyping(newStrings) {
     const el = document.querySelector("#element");
     if (el._ultratyped) {
       el._ultratyped.destroy();
     }
     el._ultratyped = UltraTyped(el, { strings: newStrings });
   }
   ```

### Issue: Coming from Typed.js

**Symptoms:**

- Class constructor doesn't work
- Different method signatures

**Solutions:**

1. **Use compatibility layer**

   ```javascript
   // For zero-code migration
   import Typed from "@ultratyped/typed-compat";

   const typed = new Typed("#element", {
     strings: ["Hello World"],
     typeSpeed: 50,
   });
   ```

2. **Direct migration**

   ```javascript
   // ❌ Typed.js
   import Typed from "typed.js";
   const typed = new Typed("#element", { strings: ["Hello"] });

   // ✅ UltraTyped.js
   import UltraTyped from "ultratyped";
   const typed = UltraTyped("#element", { strings: ["Hello"] });
   ```

---

## Advanced Debugging

### Debug Mode

Enable detailed logging:

```javascript
const instance = UltraTyped("#element", {
  strings: ["Hello", "World"],
  typeSpeed: 50,
  debug: true, // Enable debug mode (if available)
});

// Manual debugging
console.log("Instance:", instance);
console.log("Options:", instance.options);
console.log("State:", instance.state);
```

### Performance Monitoring

Monitor animation performance:

```javascript
const instance = UltraTyped("#element", {
  strings: ["Long text for testing..."],
  typeSpeed: 50,
});

// Performance monitoring
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.name.includes("ultratyped")) {
      console.log("Performance:", entry);
    }
  });
});

observer.observe({ entryTypes: ["measure"] });
```

### Event Debugging

Track all lifecycle events:

```javascript
const instance = UltraTyped("#element", {
  strings: ["Hello", "World"],
  onBegin: (self) => console.log("Animation began:", self),
  preStringTyped: (i, self) => console.log("String", i, "starting"),
  onStringTyped: (i, self) => console.log("String", i, "completed"),
  onComplete: (self) => console.log("Animation completed"),
  onDestroy: (self) => console.log("Instance destroyed"),
});
```

### State Inspection

Check internal state:

```javascript
function debugState(instance) {
  return {
    isTyping: instance.isTyping,
    isPaused: instance.isPaused,
    currentString: instance.currentString,
    arrayPosition: instance.arrayPosition,
    charPosition: instance.charPosition,
    elapsedTime: instance.elapsedTime,
  };
}

// Usage
setInterval(() => {
  console.log("State:", debugState(instance));
}, 1000);
```

---

## Common Error Messages

### `TypeError: Cannot read property 'strings' of undefined`

**Cause:** Invalid options passed

**Solution:**

```javascript
// ❌ Undefined options
UltraTyped("#element", undefined);

// ✅ Valid options
UltraTyped("#element", { strings: ["Hello"] });
```

### `TypeError: el.querySelector is not a function`

**Cause:** Invalid element selector

**Solution:**

```javascript
// ❌ Wrong element type
UltraTyped(document.body, { strings: ["Hello"] });

// ✅ Correct element
UltraTyped("#element", { strings: ["Hello"] });
```

### `ReferenceError: UltraTyped is not defined`

**Cause:** Module not loaded

**Solution:**

```javascript
// Check import
import UltraTyped from "ultratyped";
console.log(typeof UltraTyped); // Should be 'function'
```

### `DOMException: Failed to execute 'querySelector'`

**Cause:** Element not in DOM

**Solution:**

```javascript
// Wait for DOM
document.addEventListener("DOMContentLoaded", () => {
  UltraTyped("#element", { strings: ["Hello"] });
});
```

---

## Getting Help

### Self-Service Resources

1. **Documentation**: [https://ram-ai-kumar.github.io/ultra-typed-js/](https://ram-ai-kumar.github.io/ultra-typed-js/)
2. **Live Demo**: [https://ram-ai-kumar.github.io/ultra-typed-js/](https://ram-ai-kumar.github.io/ultra-typed-js/)
3. **API Reference**: Check the API documentation for detailed option descriptions

### Community Support

1. **GitHub Issues**: [https://github.com/ram-ai-kumar/ultra-typed-js/issues](https://github.com/ram-ai-kumar/ultra-typed-js/issues)
2. **GitHub Discussions**: [https://github.com/ram-ai-kumar/ultra-typed-js/discussions](https://github.com/ram-ai-kumar/ultra-typed-js/discussions)

### Reporting Issues

When reporting issues, include:

1. **Minimal reproduction**: Code snippet that demonstrates the problem
2. **Environment**: Browser, OS, UltraTyped.js version
3. **Error messages**: Full error stack traces
4. **Expected vs actual**: What you expected vs what happened

**Issue Template:**

```markdown
## Issue Description

Brief description of the problem

## Reproduction Steps

1. Install UltraTyped.js version X.X.X
2. Use this code: [code snippet]
3. See error: [error message]

## Environment

- Browser: [Chrome/Firefox/Safari version]
- OS: [Windows/macOS/Linux]
- UltraTyped.js version: [version]
- Framework: [React/Vue/etc. version if applicable]

## Expected Behavior

What should happen

## Actual Behavior

What actually happens
```

### Professional Support

For enterprise support and custom implementations, check the project documentation for support options.

---

## Quick Reference

### Essential Debugging Commands

```javascript
// 1. Check if UltraTyped is loaded
console.log("UltraTyped available:", typeof UltraTyped !== "undefined");

// 2. Verify element exists
const el = document.querySelector("#my-element");
console.log("Element exists:", !!el);

// 3. Create instance with error handling
try {
  const instance = UltraTyped(el, {
    strings: ["Test"],
    typeSpeed: 50,
  });
  console.log("Instance created:", !!instance);
} catch (error) {
  console.error("Failed to create instance:", error);
}

// 4. Monitor animation state
const instance = UltraTyped("#element", { strings: ["Test"] });
setInterval(() => {
  console.log("Animation state:", {
    typing: instance.isTyping,
    paused: instance.isPaused,
  });
}, 1000);
```

### Common Fixes Summary

| Problem            | Quick Fix                                      |
| ------------------ | ---------------------------------------------- |
| No animation       | Check element exists and wait for DOM          |
| No cursor          | Enable `showCursor: true, autoInsertCss: true` |
| Instant text       | Increase `typeSpeed` from 0                    |
| No looping         | Set `loop: true`                               |
| HTML not rendering | Set `contentType: 'html'`                      |
| Memory leak        | Call `destroy()` on cleanup                    |
| TypeScript errors  | Check import paths and types                   |

This troubleshooting guide should help you resolve most common issues with UltraTyped.js. For problems not covered here, please check the GitHub issues or create a new one with detailed information.
