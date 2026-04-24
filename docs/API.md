# UltraTyped.js API Documentation

Complete API reference for UltraTyped.js - an ultra-fast <2KB typing animation library.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Constructor](#constructor)
- [Instance Methods](#instance-methods)
- [Configuration Options](#configuration-options)
- [Callbacks](#callbacks)
- [Examples](#examples)

## Installation

```bash
npm install @ultratyped/core
```

```javascript
import UltraTyped from "@ultratyped/core";
```

Or use via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@ultratyped/core/dist/index.umd.js"></script>
```

## Basic Usage

```javascript
import UltraTyped from "@ultratyped/core";

const element = document.getElementById("typed");
const instance = UltraTyped(element, {
  strings: ["Hello", "World"],
  typeSpeed: 50,
  loop: true,
});
```

## Constructor

### `UltraTyped(element, options)`

Creates a new typing animation instance.

**Parameters:**

- `element` (HTMLElement) - The DOM element to animate
- `options` (UltraTypedOptions) - Configuration options (see below)

**Returns:** UltraTypedInstance - An instance with control methods

**Example:**

```javascript
const instance = UltraTyped(document.getElementById("typed"), {
  strings: ["Hello", "World"],
  typeSpeed: 50,
});
```

## Instance Methods

### `stop()`

Stops the animation. The animation can be restarted with `start()`.

**Example:**

```javascript
instance.stop();
```

### `start()`

Starts or restarts the animation.

**Example:**

```javascript
instance.start();
```

### `reset()`

Resets the animation to its initial state and starts over.

**Example:**

```javascript
instance.reset();
```

### `pause()`

Pauses the animation at its current position.

**Example:**

```javascript
instance.pause();
```

### `resume()`

Resumes the animation from where it was paused.

**Example:**

```javascript
instance.resume();
```

### `toggle()`

Toggles between pause and resume states.

**Example:**

```javascript
instance.toggle();
```

### `destroy()`

Completely destroys the instance, removing all event listeners, the cursor element, and clearing the element content. This should be called when the animation is no longer needed to prevent memory leaks.

**Example:**

```javascript
instance.destroy();
```

## Configuration Options

All options are optional and have sensible defaults.

### Content Options

#### `strings` (string[], default: [])

Array of strings to type in sequence.

```javascript
UltraTyped(element, {
  strings: ["Hello", "World", "Welcome"],
});
```

#### `stringsElement` (string | HTMLElement, default: null)

DOM element or CSS selector to read strings from. If provided, strings are extracted from child elements.

```javascript
// Using selector
UltraTyped(element, {
  stringsElement: "#strings-container",
});

// Using element
const container = document.getElementById("strings-container");
UltraTyped(element, {
  stringsElement: container,
});
```

#### `contentType` ('text' | 'html', default: 'text')

Content type to render. Use 'text' for safe text rendering (default) or 'html' for HTML content.

**⚠️ Security Warning:** Using 'html' with untrusted input (CMS, API, user input) creates an XSS vulnerability. Only use with trusted, developer-controlled HTML.

```javascript
// Safe text rendering (default)
UltraTyped(element, {
  strings: ['<script>alert("xss")</script>'], // Escaped as text
  contentType: "text",
});

// HTML rendering (use with caution)
UltraTyped(element, {
  strings: ["<b>Bold</b> text"],
  contentType: "html",
});
```

#### `attr` (string | null, default: null)

Attribute to type into instead of element content. Useful for placeholders, titles, etc.

```javascript
// Type into placeholder attribute
const input = document.getElementById("search-input");
UltraTyped(input, {
  strings: ["Search...", "Find..."],
  attr: "placeholder",
});
```

### Timing Options

#### `typeSpeed` (number, default: 50)

Typing speed in milliseconds per character. Lower values = faster typing.

```javascript
UltraTyped(element, {
  strings: ["Hello"],
  typeSpeed: 30, // Faster typing
});
```

#### `backSpeed` (number, default: 30)

Backspacing speed in milliseconds per character. Lower values = faster backspacing.

```javascript
UltraTyped(element, {
  strings: ["Hello"],
  backSpeed: 20, // Faster backspacing
});
```

#### `backDelay` (number, default: 800)

Delay in milliseconds after typing a string before backspacing begins.

```javascript
UltraTyped(element, {
  strings: ["Hello"],
  backDelay: 1500, // Longer pause before backspacing
});
```

#### `startDelay` (number, default: 0)

Delay in milliseconds before typing begins.

```javascript
UltraTyped(element, {
  strings: ["Hello"],
  startDelay: 1000, // Wait 1 second before typing
});
```

#### `typingVariance` (number, default: 0)

Random variance in typing speed for human-like effect. The actual speed will vary by ±typingVariance milliseconds.

```javascript
UltraTyped(element, {
  strings: ["Hello"],
  typeSpeed: 50,
  typingVariance: 10, // Speed varies between 40-60ms per character
});
```

### Loop Options

#### `loop` (boolean, default: true)

Whether to loop through strings infinitely.

```javascript
UltraTyped(element, {
  strings: ["Hello", "World"],
  loop: true, // Keep looping
});

UltraTyped(element, {
  strings: ["Hello", "World"],
  loop: false, // Stop after all strings are typed
});
```

#### `loopCount` (number, default: Infinity)

Number of loops before stopping. Set to Infinity for infinite looping.

```javascript
UltraTyped(element, {
  strings: ["Hello", "World"],
  loopCount: 3, // Loop 3 times then stop
});
```

#### `shuffle` (boolean, default: false)

Whether to shuffle strings randomly on each loop.

```javascript
UltraTyped(element, {
  strings: ["A", "B", "C"],
  shuffle: true, // Randomize order on each loop
});
```

### Cursor Options

#### `showCursor` (boolean, default: true)

Whether to show a blinking cursor after the typed text.

```javascript
UltraTyped(element, {
  strings: ["Hello"],
  showCursor: true, // Show cursor
});

UltraTyped(element, {
  strings: ["Hello"],
  showCursor: false, // Hide cursor
});
```

#### `cursorChar` (string, default: '|')

Character to use for the cursor.

```javascript
UltraTyped(element, {
  strings: ["Hello"],
  cursorChar: "_", // Use underscore as cursor
});
```

#### `autoInsertCss` (boolean, default: true)

Whether to automatically insert CSS for the blinking cursor animation.

```javascript
UltraTyped(element, {
  strings: ["Hello"],
  autoInsertCss: true, // Auto-insert cursor CSS
});
```

### Fade Out Options

#### `fadeOut` (boolean, default: false)

Whether to fade out the text on completion.

```javascript
UltraTyped(element, {
  strings: ["Hello"],
  loop: false,
  fadeOut: true, // Fade out when done
});
```

#### `fadeOutDelay` (number, default: 500)

Delay in milliseconds before fade out begins.

```javascript
UltraTyped(element, {
  strings: ["Hello"],
  loop: false,
  fadeOut: true,
  fadeOutDelay: 1000, // Wait 1 second before fading
});
```

#### `fadeOutClass` (string, default: 'typed-fade-out')

CSS class to apply for fade out animation. You need to define this class in your CSS.

```javascript
UltraTyped(element, {
  strings: ["Hello"],
  loop: false,
  fadeOut: true,
  fadeOutClass: "my-fade-class",
});
```

### Smart Backspace Options

#### `smartBackspace` (boolean, default: true)

Only backspace characters that differ between the current and next string. This creates a more natural effect when strings share common prefixes.

```javascript
UltraTyped(element, {
  strings: ["Hello World", "Hello There"],
  smartBackspace: true, // Only backspace "World" before typing "There"
});
```

### CSP Options

#### `nonce` (string | null, default: null)

CSP nonce for inline styles. Required when using Content Security Policy with strict inline style restrictions.

```javascript
UltraTyped(element, {
  strings: ["Hello"],
  showCursor: true,
  nonce: "your-csp-nonce-here",
});
```

### Accessibility Options

#### `bindInputFocusEvents` (boolean, default: false)

Pause animation when an input or textarea element gains focus. Useful for improving accessibility and user experience.

```javascript
UltraTyped(element, {
  strings: ["Hello"],
  bindInputFocusEvents: true, // Pause when user focuses on inputs
});
```

## Callbacks

Callbacks allow you to react to animation events. All callbacks receive context information about the animation state.

### `onBegin`

Called when the animation begins (after startDelay).

**Parameters:**

- `context` (Object) - Context object containing:
  - `el` (HTMLElement) - The target element

  - `strings` (string[]) - The strings being typed

```javascript
UltraTyped(element, {
  strings: ["Hello"],
  onBegin: (context) => {
    console.log("Animation started", context);
  },
});
```

### `onComplete`

Called when all strings are completed (when loop is false or loopCount is reached).

**Parameters:**

- `context` (Object) - Context object containing:
  - `el` (HTMLElement) - The target element

  - `strings` (string[]) - The strings being typed

```javascript
UltraTyped(element, {
  strings: ["Hello", "World"],
  loop: false,
  onComplete: (context) => {
    console.log("Animation completed", context);
  },
});
```

### `preStringTyped`

Called before each string begins typing.

**Parameters:**

- `stringIndex` (number) - Index of the string about to be typed

- `context` (Object) - Context object containing:
  - `el` (HTMLElement) - The target element

  - `strings` (string[]) - The strings being typed

```javascript
UltraTyped(element, {
  strings: ["Hello", "World"],
  preStringTyped: (stringIndex, context) => {
    console.log(
      `About to type string ${stringIndex}: ${context.strings[stringIndex]}`,
    );
  },
});
```

### `onStringTyped`

Called after each string is fully typed.

**Parameters:**

- `stringIndex` (number) - Index of the string that was just typed
- `context` (Object) - Context object containing:
  - `el` (HTMLElement) - The target element

  - `strings` (string[]) - The strings being typed

```javascript
UltraTyped(element, {
  strings: ["Hello", "World"],
  onStringTyped: (stringIndex, context) => {
    console.log(`Typed string ${stringIndex}: ${context.strings[stringIndex]}`);
  },
});
```

### `onLastStringBackspaced`

Called when the last string is fully backspaced (only when loop is false or loopCount is reached).

**Parameters:**

- `context` (Object) - Context object containing:
  - `el` (HTMLElement) - The target element

  - `strings` (string[]) - The strings being typed

```javascript
UltraTyped(element, {
  strings: ["Hello", "World"],
  loop: false,
  onLastStringBackspaced: (context) => {
    console.log("Last string fully backspaced", context);
  },
});
```

### `onTypingPaused`

Called when typing pauses (after a string is typed, before backspacing begins).

**Parameters:**

- `stringIndex` (number) - Index of the string that was just typed
- `context` (Object) - Context object containing:
  - `el` (HTMLElement) - The target element

  - `strings` (string[]) - The strings being typed

```javascript
UltraTyped(element, {
  strings: ["Hello", "World"],
  onTypingPaused: (stringIndex, context) => {
    console.log(`Paused after typing string ${stringIndex}`);
  },
});
```

### `onTypingResumed`

Called when typing resumes (after backspacing, before typing next string).

**Parameters:**

- `stringIndex` (number) - Index of the string that was just backspaced

- `context` (Object) - Context object containing:
  - `el` (HTMLElement) - The target element

  - `strings` (string[]) - The strings being typed

```javascript
UltraTyped(element, {
  strings: ["Hello", "World"],
  onTypingResumed: (stringIndex, context) => {
    console.log(`Resumed typing after string ${stringIndex}`);
  },
});
```

### `onReset`

Called when the animation is reset via `reset()`.

**Parameters:**

- `context` (Object) - Context object containing:
  - `el` (HTMLElement) - The target element

  - `strings` (string[]) - The strings being typed

```javascript
UltraTyped(element, {
  strings: ["Hello", "World"],
  onReset: (context) => {
    console.log("Animation reset", context);
  },
});
```

### `onStop`

Called when the animation is stopped via `stop()`.

**Parameters:**

- `stringIndex` (number) - Index of the current string when stopped

- `context` (Object) - Context object containing:
  - `el` (HTMLElement) - The target element

  - `strings` (string[]) - The strings being typed

```javascript
UltraTyped(element, {
  strings: ["Hello", "World"],
  onStop: (stringIndex, context) => {
    console.log(`Animation stopped at string ${stringIndex}`);
  },
});
```

### `onStart`

Called when the animation is started via `start()`.

**Parameters:**

- `stringIndex` (number) - Index of the current string when started

- `context` (Object) - Context object containing:
  - `el` (HTMLElement) - The target element

  - `strings` (string[]) - The strings being typed

```javascript
UltraTyped(element, {
  strings: ["Hello", "World"],
  onStart: (stringIndex, context) => {
    console.log(`Animation started at string ${stringIndex}`);
  },
});
```

### `onDestroy`

Called when the animation is destroyed via `destroy()`.

**Parameters:**

- `context` (Object) - Context object containing:
  - `el` (HTMLElement) - The target element

  - `strings` (string[]) - The strings being typed

```javascript
UltraTyped(element, {
  strings: ["Hello", "World"],
  onDestroy: (context) => {
    console.log("Animation destroyed", context);
  },
});
```

## Examples

### Basic Typing Animation

```javascript
import UltraTyped from "@ultratyped/core";

const element = document.getElementById("typed");
const instance = UltraTyped(element, {
  strings: ["Hello, World!", "Welcome to UltraTyped.js"],
  typeSpeed: 50,
  loop: true,
});
```

### Typing into Input Placeholder

```javascript
const input = document.getElementById("search-input");
const instance = UltraTyped(input, {
  strings: ["Search...", "Find anything...", "Type to search..."],
  attr: "placeholder",
  typeSpeed: 80,
  backDelay: 2000,
  loop: true,
});
```

### Custom Cursor Styling

```javascript
const instance = UltraTyped(element, {
  strings: ["Hello"],
  showCursor: true,
  cursorChar: "▋",
  autoInsertCss: false, // Disable auto-insert, use your own CSS
});
```

Add your own CSS:

```css
.ultratyped-cursor {
  display: inline-block;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
```

### One-Time Animation with Fade Out

```javascript
const instance = UltraTyped(element, {
  strings: ["Welcome to our website"],
  loop: false,
  fadeOut: true,
  fadeOutDelay: 2000,
  fadeOutClass: "fade-out",
});
```

CSS:

```css
.fade-out {
  opacity: 0;
  transition: opacity 1s ease-out;
}
```

### Human-Like Typing with Variance

```javascript
const instance = UltraTyped(element, {
  strings: ["This looks like a human typing..."],
  typeSpeed: 60,
  typingVariance: 15, // Varies between 45-75ms per character
  backSpeed: 40,
  backDelay: 1200,
});
```

### Reading Strings from DOM

```html
<div id="strings-container" style="display: none;">
  <p>First string</p>
  <p>Second string</p>
  <p>Third string</p>
</div>
<div id="typed"></div>
```

```javascript
const instance = UltraTyped(document.getElementById("typed"), {
  stringsElement: "#strings-container",
  typeSpeed: 50,
});
```

### Using All Callbacks

```javascript
const instance = UltraTyped(element, {
  strings: ["Hello", "World"],
  loop: false,
  onBegin: (ctx) => console.log("Animation began"),
  preStringTyped: (idx, ctx) =>
    console.log(`About to type: ${ctx.strings[idx]}`),
  onStringTyped: (idx, ctx) => console.log(`Typed: ${ctx.strings[idx]}`),
  onTypingPaused: (idx, ctx) => console.log("Paused"),
  onTypingResumed: (idx, ctx) => console.log("Resumed"),
  onComplete: (ctx) => console.log("Animation complete"),
  onDestroy: (ctx) => console.log("Animation destroyed"),
});
```

### Pause/Resume on Button Click

```javascript
const instance = UltraTyped(element, {
  strings: ["Hello", "World"],
  loop: true,
});

const pauseBtn = document.getElementById("pause-btn");
const resumeBtn = document.getElementById("resume-btn");

pauseBtn.addEventListener("click", () => instance.pause());
resumeBtn.addEventListener("click", () => instance.resume());
```

### Clean Up on Component Unmount (React)

```javascript
import { useEffect } from "react";
import UltraTyped from "@ultratyped/core";

function MyComponent() {
  useEffect(() => {
    const element = document.getElementById("typed");
    const instance = UltraTyped(element, {
      strings: ["Hello", "World"],
      loop: true,
    });

    return () => {
      instance.destroy(); // Clean up on unmount
    };
  }, []);

  return <div id="typed"></div>;
}
```

## TypeScript Support

UltraTyped.js includes TypeScript type definitions. The types are automatically inferred when using TypeScript.

```typescript
import UltraTyped from "@ultratyped/core";

const element: HTMLElement = document.getElementById("typed")!;
const instance = UltraTyped(element, {
  strings: ["Hello", "World"],
  typeSpeed: 50,
  loop: true,
  onBegin: (context) => {
    console.log(context.el); // TypeScript knows this is HTMLElement
  },
});

// Type-safe method calls
instance.stop();
instance.start();
instance.reset();
instance.pause();
instance.resume();
instance.toggle();
instance.destroy();
```

## Browser Support

UltraTyped.js works in all modern browsers that support:

- ES6 (ECMAScript 2015)
- `requestAnimationFrame`
- `performance.now()`

Supported browsers:

- Chrome/Edge 60+

- Firefox 55+

- Safari 11+

- Opera 47+

## License

MIT
