# UltraTyped.js Core Examples

This directory contains examples demonstrating the core UltraTyped.js functionality using vanilla JavaScript.

## Basic Example

The `basic-example.html` file showcases all the key features of UltraTyped.js:

### Features Demonstrated

- **Basic typing animation** with multiple strings
- **HTML content support** with styling and links
- **Placeholder animation** for input elements
- **Strings from DOM element** reading
- **Complete control methods** (start, pause, resume, reset, stop, destroy)
- **Event callbacks** for monitoring animation state
- **Configuration options** (speed, loop, cursor, etc.)

### Running the Example

1. **From the project root**:

   ```bash
   # Build the core package first
   pnpm --filter packages/core build

   # Open the example in your browser
   open packages/core/examples/basic-example.html
   ```

2. **Using a local server** (recommended):

   ```bash
   # Navigate to the examples directory
   cd packages/core/examples

   # Start a simple HTTP server
   python3 -m http.server 8000
   # or with Node.js
   npx serve .

   # Open http://localhost:8000/basic-example.html
   ```

### Example Structure

The example is divided into four sections:

1. **Basic Typing Animation**: Shows standard text typing with full controls
2. **HTML Content Example**: Demonstrates HTML content support with styling
3. **Placeholder Animation**: Animates input placeholder text
4. **Strings from Element**: Reads strings from a hidden DOM element

### Key Concepts

#### Initialization

```javascript
import UltraTyped from "../../dist/index.mjs";

const instance = UltraTyped(element, {
  strings: ["Hello", "World"],
  typeSpeed: 50,
  loop: true,
});
```

#### Control Methods

- `instance.start()` - Start the animation
- `instance.pause()` - Pause the animation
- `instance.resume()` - Resume from pause
- `instance.reset()` - Reset to initial state
- `instance.stop()` - Stop the animation
- `instance.destroy()` - Clean up and destroy

#### Event Callbacks

```javascript
{
    onBegin: () => console.log('Animation began'),
    onComplete: () => console.log('Animation completed'),
    onStringTyped: (arrayPos, self) => console.log(`String ${arrayPos} typed`),
    // ... more callbacks
}
```

#### Configuration Options

- `strings` - Array of strings to type
- `typeSpeed` - Typing speed in milliseconds
- `backSpeed` - Backspacing speed
- `loop` - Whether to loop infinitely
- `showCursor` - Show blinking cursor
- `contentType` - 'text' or 'html'
- `attr` - Attribute to type into (e.g., 'placeholder')

### Browser Compatibility

The example works in all modern browsers that support:

- ES6 modules
- RequestAnimationFrame
- DOM manipulation

### Development Notes

- The example imports UltraTyped from the local build (`../../dist/index.mjs`)
- Make sure to build the core package before running the example
- For development, you can use `pnpm link` to test with the local package

### Next Steps

After exploring this example, check out the framework-specific examples:

- [Alpine.js Example](../../../alpine/examples/)
- [React Example](../../../react/examples/)
- [Vue Example](../../../vue/examples/)
- [Angular Example](../../../angular/examples/)
- And more...

Each framework example demonstrates best practices and integration patterns for that specific framework.
