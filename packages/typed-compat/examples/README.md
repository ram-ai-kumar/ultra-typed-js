# UltraTyped.js Typed.js Compatibility Examples

This directory contains examples demonstrating the Typed.js compatibility layer, showing how UltraTyped.js serves as a drop-in replacement for Typed.js.

## Compatibility Example

The `index.html` file showcases complete Typed.js v2 API compatibility:

### Features Demonstrated

- **Drop-in replacement** - Same API as Typed.js v2
- **Zero code changes** - Just replace the import
- **Full method compatibility** - All Typed.js methods work
- **Complete option support** - All Typed.js options mapped
- **Event callback compatibility** - Same callback signatures
- **String selector support** - Read strings from DOM elements
- **HTML content support** - Same as Typed.js
- **Performance benefits** - Better performance, smaller size

### Running the Example

1. **From the project root**:
   ```bash
   # Build the core and typed-compat packages first
   npm run build:core
   npm run build:typed-compat
   
   # Open the example in your browser
   open packages/typed-compat/examples/index.html
   ```

2. **Using a local server** (recommended):
   ```bash
   # Navigate to the examples directory
   cd packages/typed-compat/examples
   
   # Start a simple HTTP server
   python3 -m http.server 8000
   # or with Node.js
   npx serve .
   
   # Open http://localhost:8000/index.html
   ```

### Migration Guide

#### Step 1: Replace Import

```javascript
// Before: Typed.js
import Typed from 'typed.js'

// After: UltraTyped.js Compat
import Typed from '@ultratyped/typed-compat'
```

#### Step 2: No Code Changes Needed

```javascript
// This code works exactly the same with both libraries
const typed = new Typed('#element', {
  strings: ['Hello', 'World'],
  typeSpeed: 50,
  backSpeed: 30,
  loop: true,
  showCursor: true,
  cursorChar: '|',
  onComplete: () => {
    console.log('Animation completed!')
  }
})

// All methods work the same
typed.start()
typed.stop()
typed.pause()
typed.resume()
typed.reset()
typed.toggle()
typed.destroy()
```

#### Step 3: Enjoy Performance Benefits

- **Size**: <2KB vs ~7KB (71% smaller)
- **Performance**: rAF-driven animation, 60fps smooth typing
- **Memory**: Pre-tokenized strings, no runtime regex
- **Modern**: ES6 modules, TypeScript support
- **Maintained**: Active development and bug fixes

### API Compatibility

#### Constructor

```javascript
// Both libraries support the same constructor
new Typed(element, options)
new Typed(selector, options) // String selector support
```

#### Options

All Typed.js v2 options are supported:

```javascript
{
  // Content options
  strings: ['Hello', 'World'],
  stringsElement: '#strings-container',
  
  // Speed options
  typeSpeed: 50,
  backSpeed: 30,
  backDelay: 800,
  startDelay: 500,
  
  // Loop options
  loop: true,
  loopCount: Infinity,
  shuffle: false,
  
  // Cursor options
  showCursor: true,
  cursorChar: '|',
  autoInsertCss: true,
  
  // Content type
  contentType: 'text', // 'text' | 'html'
  
  // Advanced options
  smartBackspace: true,
  typingVariance: 0,
  bindInputFocusEvents: false,
  fadeOut: false,
  fadeOutDelay: 500,
  fadeOutClass: 'typed-fade-out',
  
  // Event callbacks
  onBegin: () => {},
  onComplete: () => {},
  preStringTyped: (arrayPos, self) => {},
  onStringTyped: (arrayPos, self) => {},
  onLastStringBackspaced: () => {},
  onTypingPaused: (arrayPos, self) => {},
  onTypingResumed: (arrayPos, self) => {},
  onReset: () => {},
  onStop: () => {},
  onStart: () => {},
  onDestroy: () => {}
}
```

#### Methods

All Typed.js methods are available:

```javascript
const typed = new Typed(element, options)

// Control methods
typed.start()      // Start or restart animation
typed.stop()       // Stop the animation
typed.pause()      // Pause the animation
typed.resume()     // Resume from pause
typed.reset()      // Reset to initial state
typed.toggle()     // Toggle between pause and resume
typed.destroy()    // Clean up and destroy instance
```

### Example Migrations

#### Basic Migration

```javascript
// Original Typed.js code
import Typed from 'typed.js'

const typed = new Typed('.typed', {
  strings: ['Welcome to my website'],
  typeSpeed: 50
})

// Migrated to UltraTyped.js
import Typed from '@ultratyped/typed-compat'

const typed = new Typed('.typed', {
  strings: ['Welcome to my website'],
  typeSpeed: 50
})

// No other changes needed!
```

#### Advanced Migration

```javascript
// Original Typed.js code
import Typed from 'typed.js'

const typed = new Typed('#hero', {
  stringsElement: '#hero-strings',
  typeSpeed: 40,
  backSpeed: 20,
  loop: true,
  shuffle: true,
  showCursor: true,
  cursorChar: '_',
  onComplete: () => {
    console.log('Hero animation complete')
  }
})

// Migrated to UltraTyped.js
import Typed from '@ultratyped/typed-compat'

const typed = new Typed('#hero', {
  stringsElement: '#hero-strings',
  typeSpeed: 40,
  backSpeed: 20,
  loop: true,
  shuffle: true,
  showCursor: true,
  cursorChar: '_',
  onComplete: () => {
    console.log('Hero animation complete')
  }
})

// Exactly the same code!
```

#### React Migration

```javascript
// Original Typed.js in React
import Typed from 'typed.js'
import { useEffect, useRef } from 'react'

function TypedComponent() {
  const el = useRef(null)
  
  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ['React component'],
      typeSpeed: 50
    })
    
    return () => typed.destroy()
  }, [])
  
  return <span ref={el}></span>
}

// Migrated to UltraTyped.js
import Typed from '@ultratyped/typed-compat'
import { useEffect, useRef } from 'react'

function TypedComponent() {
  const el = useRef(null)
  
  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ['React component'],
      typeSpeed: 50
    })
    
    return () => typed.destroy()
  }, [])
  
  return <span ref={el}></span>
}

// Same component, just different import!
```

### Performance Comparison

| Feature | Typed.js | UltraTyped.js | Improvement |
|---------|----------|---------------|-------------|
| Bundle Size | ~7KB | <2KB | 71% smaller |
| Animation Engine | setTimeout | requestAnimationFrame | 60fps smooth |
| String Processing | Runtime regex | Pre-tokenized | Faster execution |
| Memory Usage | Higher | Lower | Better efficiency |
| Modern Support | Limited | Full | ES6 modules, TS |
| Maintenance | Stale | Active | Ongoing updates |

### Browser Compatibility

UltraTyped.js typed-compat supports all browsers that Typed.js supports, plus modern browsers:

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+
- **IE**: 11+ (with polyfills)

### Common Use Cases

#### Hero Sections

```javascript
// Perfect for landing page hero sections
const hero = new Typed('#hero-title', {
  strings: ['Build Faster', 'Ship Better', 'Grow Together'],
  typeSpeed: 60,
  backSpeed: 40,
  loop: true,
  showCursor: true
})
```

#### Code Examples

```javascript
// Great for code typing effects
const code = new Typed('#code-example', {
  strings: [
    'const greeting = "Hello, World!";',
    'console.log(greeting);',
    'return greeting;'
  ],
  typeSpeed: 30,
  backSpeed: 20,
  contentType: 'text',
  showCursor: false
})
```

#### Interactive Elements

```javascript
// Works with form inputs too
const placeholder = new Typed('#search-input', {
  strings: ['Search for anything...', 'Type your query...'],
  typeSpeed: 40,
  backSpeed: 30,
  loop: true,
  attr: 'placeholder',
  showCursor: false
})
```

### Troubleshooting

#### Common Issues

1. **Import errors**: Make sure you're importing from `@ultratyped/typed-compat`
2. **Element not found**: Ensure the element exists before creating Typed instance
3. **Options not working**: Check that option names match Typed.js v2 API
4. **Performance issues**: UltraTyped.js should be faster, not slower

#### Debug Mode

```javascript
// Enable debug logging
const typed = new Typed(element, {
  strings: ['Debug mode'],
  typeSpeed: 50,
  onBegin: () => console.log('Animation began'),
  onComplete: () => console.log('Animation completed'),
  onStringTyped: (arrayPos) => console.log(`String ${arrayPos} typed`)
})
```

### Dependencies

- **@ultratyped/typed-compat**: ^1.0.0
- **@ultratyped/core**: ^1.0.0 (transitive dependency)

### Project Structure

```
packages/typed-compat/examples/
├── index.html              # Main compatibility example
└── README.md               # This file
```

### Next Steps

After exploring this compatibility example, check out the modern UltraTyped.js examples:

- [Core Example](../../../core/examples/)
- [React Example](../../../react/examples/)
- [Vue Example](../../../vue/examples/)
- [TypeScript Example](../../../typescript/examples/)
- And more...

Each example demonstrates modern integration patterns while this example shows how easy it is to migrate from Typed.js.
