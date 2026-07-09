# UltraTyped.js Alpine.js Examples

This directory contains examples demonstrating UltraTyped.js integration with Alpine.js, showing reactive patterns and component communication.

## Basic Example

The `basic-example.html` file showcases Alpine.js integration patterns:

### Features Demonstrated

- **Basic Alpine.js integration** using `x-data` and `x-init`
- **Reactive configuration** with `x-model` bindings
- **Multiple instances** management
- **Component communication** between parent and child components
- **Dynamic string management** with reactive arrays
- **Event-driven updates** using Alpine.js event system

### Running the Example

1. **From the project root**:

```bash
# Build the core package first
pnpm --filter packages/core build

# Open the example in your browser
open packages/alpine/examples/basic-example.html
```

2. **Using a local server** (recommended):

```bash
# Navigate to the examples directory
cd packages/alpine/examples

# Start a simple HTTP server
python3 -m http.server 8000
# or with Node.js
npx serve .

# Open http://localhost:8000/basic-example.html
```

### Alpine.js Integration Patterns

#### Basic Integration

```javascript
function typingExample() {
  return {
    instance: null,
    isRunning: false,
    status: "Ready to start",

    init() {
      this.$nextTick(() => {
        this.instance = UltraTyped(this.$refs.typedElement, {
          strings: ["Hello", "World"],
          typeSpeed: 50,
          loop: true,

          onBegin: () => {
            this.isRunning = true;
            this.status = "Animation began";
          },
        });
      });
    },

    start() {
      if (this.instance) {
        this.instance.start();
      }
    },
  };
}
```

#### Reactive Configuration

```html
<div x-data="typingExample()">
  <div x-ref="typedElement"></div>

  <input type="number" x-model="typeSpeed" @input="updateConfig()" />

  <select x-model="loop" @change="updateConfig()">
    <option :value="true">Yes</option>
    <option :value="false">No</option>
  </select>
</div>
```

#### Multiple Instances

```javascript
function multipleTypingExample() {
  return {
    instances: [],

    init() {
      this.instances = [
        UltraTyped(this.$refs.element1, {
          /* config */
        }),
        UltraTyped(this.$refs.element2, {
          /* config */
        }),
        UltraTyped(this.$refs.element3, {
          /* config */
        }),
      ];
    },

    startAll() {
      this.instances.forEach((instance) => instance.start());
    },
  };
}
```

#### Component Communication

```javascript
// Parent component
function parentComponent() {
  return {
    triggerChildAction() {
      this.$dispatch("trigger-child", { message: "Hello from parent!" });
    },
  };
}

// Child component
function childComponent() {
  return {
    init() {
      this.$el.addEventListener("trigger-child", (event) => {
        this.handleParentMessage(event.detail.message);
      });
    },
  };
}
```

### Example Sections

#### 1. Basic Alpine.js Integration

- Shows fundamental integration with `x-data` and `x-init`
- Reactive controls for configuration
- Real-time status updates

#### 2. Multiple Instances

- Manages multiple UltraTyped instances
- Coordinated control across all instances
- Different styling and speeds for each instance

#### 3. Reactive Data Example

- Dynamic string management
- Add/remove strings on the fly
- Shuffle and clear operations

#### 4. Component Communication

- Parent-child component interaction
- Event-driven updates
- Cross-component state synchronization

### Key Alpine.js Concepts

#### `$refs` for DOM References

```html
<div x-ref="typedElement"></div>
<!-- In JavaScript: -->
this.instance = UltraTyped(this.$refs.typedElement, config);
```

#### `$nextTick` for DOM Readiness

```javascript
init() {
    this.$nextTick(() => {
        // DOM is ready, initialize UltraTyped
        this.instance = UltraTyped(this.$refs.typedElement, config);
    });
}
```

#### `$dispatch` for Events

```javascript
// Dispatch event
this.$dispatch("trigger-child", { message: "Hello!" });

// Listen for event
this.$el.addEventListener("trigger-child", (event) => {
  console.log(event.detail.message);
});
```

#### Reactive Properties

```javascript
return {
  strings: ["Hello", "World"],

  addString() {
    this.strings.push("New string"); // Automatically updates UI
    this.updateInstance();
  },
};
```

### Best Practices

1. **Use `$nextTick`**: Always initialize UltraTyped in `$nextTick` to ensure DOM is ready
2. **Cleanup instances**: Destroy instances in `destroy()` method or when component unmounts
3. **Reactive updates**: Update UltraTyped configuration when Alpine.js reactive data changes
4. **Event handling**: Use Alpine.js event system for component communication
5. **Multiple instances**: Store instances in arrays for batch operations

### Dependencies

- **Alpine.js**: Loaded from CDN (v3.x.x)
- **UltraTyped.js**: Imported from local build (`../../core/dist/index.mjs`)

### Browser Compatibility

Works in all modern browsers that support:

- ES6 modules
- Alpine.js requirements
- RequestAnimationFrame

### Development Notes

- Alpine.js provides reactive data binding out of the box
- Use `x-model` for two-way binding of configuration
- Leverage Alpine.js magic methods (`$refs`, `$nextTick`, `$dispatch`)
- Component communication works through custom events

### Next Steps

After exploring this example, check out other framework examples:

- [React Example](../../../react/examples/)
- [Vue Example](../../../vue/examples/)
- [Angular Example](../../../angular/examples/)
- [Svelte Example](../../../svelte/examples/)
- And more...

Each framework example demonstrates best practices and integration patterns specific to that framework.
