# @ultratyped/typed-compat

A drop-in compatibility shim for [Typed.js v2](https://github.com/mattboldt/typed.js) that uses UltraTyped.js under the hood. Zero behavior changes for existing Typed.js users - just swap the import and get instant performance improvements.

## Why Use This?

- **Drop-in replacement**: Same API, same options, same behavior
- **Instant performance boost**: UltraTyped.js is <2KB vs Typed.js ~13KB
- **No migration required**: Keep your existing code unchanged
- **All Typed.js features**: 100% feature parity with Typed.js v2

## Installation

```bash
npm install @ultratyped/typed-compat @ultratyped/core
```

## Usage

### From Typed.js to typed-compat

**Before (Typed.js):**
```javascript
import Typed from 'typed.js';

const typed = new Typed('#element', {
  strings: ['Hello, world!', 'Welcome to Typed.js'],
  typeSpeed: 50,
  backSpeed: 30,
  loop: true
});
```

**After (typed-compat):**
```javascript
import Typed from '@ultratyped/typed-compat';

const typed = new Typed('#element', {
  strings: ['Hello, world!', 'Welcome to UltraTyped'],
  typeSpeed: 50,
  backSpeed: 30,
  loop: true
});
```

That's it! Everything else stays exactly the same.

## Supported Options

All Typed.js v2 options are supported:

- `strings` - Array of strings to type
- `stringsElement` - CSS selector or element to read strings from
- `typeSpeed` - Typing speed in ms
- `backSpeed` - Backspacing speed in ms
- `backDelay` - Delay before backspacing in ms
- `loop` - Loop the animation
- `loopCount` - Number of loops (Infinity support)
- `contentType` - 'text' or 'html'
- `showCursor` - Show blinking cursor
- `cursorChar` - Cursor character
- `autoInsertCss` - Auto-insert CSS for cursor
- `startDelay` - Delay before starting animation
- `shuffle` - Shuffle string order on each loop
- `fadeOut` - Fade out instead of backspace
- `fadeOutDelay` - Delay before fade
- `fadeOutClass` - CSS class for fade effect
- `attr` - Type into element attribute
- `smartBackspace` - Smart backspace (default: true)
- `typingVariance` - Human-like jitter
- `bindInputFocusEvents` - Pause on input focus

## Instance Methods

All Typed.js instance methods are supported:

- `typed.stop()` - Stop animation
- `typed.start()` - Start animation
- `typed.reset()` - Reset to initial state
- `typed.destroy()` - Destroy instance
- `typed.pause()` - Pause animation
- `typed.resume()` - Resume animation
- `typed.toggle()` - Toggle pause/resume

## Callbacks

All Typed.js callbacks are supported:

- `onBegin(self)` - Fires before first character
- `onComplete(self)` - Fires when animation completes
- `preStringTyped(arrayPos, self)` - Fires before each string
- `onStringTyped(arrayPos, self)` - Fires after each string
- `onLastStringBackspaced(self)` - Fires when last string erased
- `onTypingPaused(arrayPos, self)` - Fires on pause
- `onTypingResumed(arrayPos, self)` - Fires on resume
- `onReset(self)` - Fires on reset
- `onStop(arrayPos, self)` - Fires on stop
- `onStart(arrayPos, self)` - Fires on start
- `onDestroy(self)` - Fires on destroy

## Migration Guide

For a detailed migration guide from Typed.js v2 to UltraTyped.js, see the main [migration guide](../../docs/MIGRATION.md).

## License

MIT
