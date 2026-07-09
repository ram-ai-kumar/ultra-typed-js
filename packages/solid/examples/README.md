# UltraTyped.js Solid Examples

This directory contains examples demonstrating UltraTyped.js integration with Solid.js, showing reactive primitives and proper cleanup.

## Basic Example

The Solid example showcases Solid.js integration patterns:

### Features Demonstrated

- **Solid reactive primitives** with createEffect and createRef
- **Custom hook usage** from `@ultratyped/solid`
- **Multiple instances** management
- **Signal-driven configuration** updates
- **Proper cleanup patterns** to prevent memory leaks
- **TypeScript support** with full type safety

### Running the Example

1. **From the project root**:

   ```bash
   # Build the core and Solid packages first
   pnpm --filter packages/core build
   pnpm --filter packages/solid build

   # Navigate to the Solid example directory
   cd packages/solid/examples

   # Install dependencies
   pnpm install

   # Start the development server
   pnpm dev
   ```

2. **Build for production**:
   ```bash
   pnpm build
   pnpm preview
   ```

### Solid Integration Patterns

#### Using the Official Hook

```tsx
import { useUltraTyped } from "@ultratyped/solid";
import { createSignal } from "solid-js";

function MyComponent() {
  const [ref, setRef] = createSignal<HTMLElement | null>(null);

  const instance = useUltraTyped(ref, {
    strings: ["Hello", "World", "Solid"],
    typeSpeed: 50,
    loop: true,
  });

  return <div ref={setRef} />;
}
```

#### Manual Integration with Cleanup

```tsx
import { createEffect, onCleanup, createRef } from "solid-js";
import UltraTyped from "ultratyped";

function TypingComponent() {
  let element: HTMLDivElement | undefined;
  let instance: any = null;

  createEffect(() => {
    if (element && !instance) {
      instance = UltraTyped(element, {
        strings: ["Hello", "World"],
        typeSpeed: 50,
        loop: true,
        onComplete: () => console.log("Completed"),
      });
    }
  });

  onCleanup(() => {
    if (instance) {
      instance.destroy();
      instance = null;
    }
  });

  return <div ref={element} />;
}
```

#### Signal-Driven Configuration

```tsx
import { createSignal, createEffect, onCleanup } from "solid-js";
import UltraTyped from "ultratyped";

function DynamicTypingComponent() {
  const [strings, setStrings] = createSignal(["Hello", "World"]);
  const [speed, setSpeed] = createSignal(50);
  let element: HTMLDivElement | undefined;
  let instance: any = null;

  createEffect(() => {
    if (element && !instance) {
      instance = UltraTyped(element, {
        strings: strings(),
        typeSpeed: speed(),
        loop: true,
      });
    }
  });

  createEffect(() => {
    if (instance) {
      instance.strings = strings();
      instance.typeSpeed = speed();
      instance.reset();
    }
  });

  onCleanup(() => {
    if (instance) {
      instance.destroy();
      instance = null;
    }
  });

  return (
    <div>
      <div ref={element} />
      <textarea
        value={strings().join("\n")}
        onInput={(e) => setStrings(e.target.value.split("\n"))}
      />
      <input
        type="number"
        value={speed()}
        onInput={(e) => setSpeed(Number(e.target.value))}
      />
    </div>
  );
}
```

#### Multiple Instances Component

```tsx
import { createSignal, createEffect, onCleanup } from "solid-js";
import UltraTyped from "ultratyped";

function MultipleInstances() {
  let refs = [null, null, null].map(() => ({
    current: null as HTMLDivElement | null,
  }));
  const [instances, setInstances] = createSignal<any[]>([]);
  const [allRunning, setAllRunning] = createSignal(false);

  createEffect(() => {
    const newInstances = refs
      .map((ref, index) => {
        if (ref.current) {
          return UltraTyped(ref.current, {
            strings: [`Instance ${index + 1}A`, `Instance ${index + 1}B`],
            typeSpeed: 50 + index * 20,
            loop: true,
            showCursor: index === 0,
          });
        }
        return null;
      })
      .filter(Boolean);

    setInstances(newInstances);

    onCleanup(() => {
      newInstances.forEach((instance) => {
        if (instance) instance.destroy();
      });
    });
  });

  const startAll = () => {
    instances().forEach((instance) => instance?.start());
    setAllRunning(true);
  };

  const pauseAll = () => {
    instances().forEach((instance) => instance?.pause());
    setAllRunning(false);
  };

  const stopAll = () => {
    instances().forEach((instance) => instance?.stop());
    setAllRunning(false);
  };

  return (
    <div>
      {refs.map((ref, index) => (
        <div ref={ref} style={{ margin: "10px 0", "font-size": "20px" }} />
      ))}
      <div>
        <button onClick={startAll} disabled={allRunning()}>
          Start All
        </button>
        <button onClick={pauseAll}>Pause All</button>
        <button onClick={stopAll}>Stop All</button>
      </div>
    </div>
  );
}
```

#### Advanced Component with Controls

```tsx
import { createSignal, createEffect, onCleanup } from "solid-js";
import UltraTyped from "ultratyped";

function AdvancedTyping() {
  let element: HTMLDivElement | undefined;
  let instance: any = null;
  const [status, setStatus] = createSignal("Ready");
  const [isRunning, setIsRunning] = createSignal(false);
  const [strings, setStrings] = createSignal([
    "Advanced",
    "Solid",
    "Full control",
  ]);
  const [typeSpeed, setTypeSpeed] = createSignal(50);

  createEffect(() => {
    if (element && !instance) {
      instance = UltraTyped(element, {
        strings: strings(),
        typeSpeed: typeSpeed(),
        backSpeed: 30,
        loop: true,
        showCursor: true,

        onBegin: () => {
          setIsRunning(true);
          setStatus("Animation began");
        },
        onComplete: () => {
          setStatus("All strings completed!");
        },
        onStringTyped: (arrayPos: number) => {
          setStatus(`Finished string ${arrayPos + 1}`);
        },
        onStop: () => {
          setIsRunning(false);
          setStatus("Animation stopped");
        },
      });
    }
  });

  onCleanup(() => {
    if (instance) {
      instance.destroy();
      instance = null;
    }
  });

  const start = () => instance?.start();
  const pause = () => instance?.pause();
  const stop = () => instance?.stop();
  const reset = () => instance?.reset();

  const addString = () => {
    setStrings([...strings(), `New string #${strings().length + 1}`]);
  };

  const removeString = () => {
    if (strings().length > 1) {
      setStrings(strings().slice(0, -1));
    }
  };

  return (
    <div
      style={{
        "font-family": "Arial, sans-serif",
        "max-width": "600px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <div
        ref={element}
        style={{
          "font-size": "24px",
          color: "#2563eb",
          "min-height": "40px",
          margin: "20px 0",
          "font-family": "'Courier New', monospace",
        }}
      ></div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          margin: "20px 0",
          "flex-wrap": "wrap",
        }}
      >
        <button onClick={start} disabled={isRunning()}>
          Start
        </button>
        <button onClick={pause} disabled={!isRunning()}>
          Pause
        </button>
        <button onClick={stop}>Stop</button>
        <button onClick={reset}>Reset</button>
      </div>

      <div
        style={{
          padding: "10px",
          "background-color": "#f3f4f6",
          "border-radius": "5px",
          margin: "10px 0",
        }}
      >
        {status()}
      </div>

      <div style={{ display: "flex", gap: "10px", margin: "15px 0" }}>
        <button onClick={addString}>Add String</button>
        <button onClick={removeString}>Remove Last</button>
      </div>

      <div
        style={{
          margin: "15px 0",
          padding: "15px",
          "background-color": "#f9fafb",
          "border-radius": "5px",
        }}
      >
        <p>Current strings ({strings().length}):</p>
        <ul>
          {strings().map((str, index) => (
            <li>
              {index + 1}. {str}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

### Example Components

#### 1. Basic Typing Component

- Shows fundamental Solid integration
- Manual instance management with proper cleanup
- Event callback handling with Solid signals
- Interactive controls for configuration

#### 2. Hook-Based Component

- Uses the official `useUltraTyped` hook
- Cleaner component code with encapsulated logic
- Automatic cleanup handled by the hook
- Signal tracking and control methods

#### 3. Multiple Instances Component

- Manages multiple UltraTyped instances
- Coordinated control across all instances
- Different styling and speeds for visual variety
- Proper cleanup for all instances

#### 4. Dynamic Configuration Component

- Demonstrates signal-driven configuration
- Updates UltraTyped when Solid signals change
- Textarea and input for dynamic updates
- Reset behavior on configuration change

#### 5. Advanced Component with Controls

- Full control over UltraTyped instance
- Interactive buttons for control
- Status tracking with Solid signals
- Dynamic string management

### Key Solid Concepts

#### createEffect and onCleanup

```tsx
createEffect(() => {
  // Initialize UltraTyped
  if (element) {
    instance = UltraTyped(element, options);
  }
});

onCleanup(() => {
  // Cleanup when component is destroyed
  if (instance) {
    instance.destroy();
  }
});
```

#### Refs and Signals

```tsx
import { createSignal } from "solid-js";

const [ref, setRef] = createSignal<HTMLElement | null>(null);

// In JSX
<div ref={setRef} />;

// Access value
if (ref()) {
  UltraTyped(ref()!, options);
}
```

#### Signals for State

```tsx
const [strings, setStrings] = createSignal(["Hello", "World"]);
const [speed, setSpeed] = createSignal(50);

// Read signal
console.log(strings());

// Update signal
setStrings(["New", "Strings"]);
```

#### Effects for Reactive Updates

```tsx
createEffect(() => {
  if (instance) {
    instance.strings = strings();
    instance.typeSpeed = speed();
    instance.reset();
  }
});
```

### Best Practices

1. **Always cleanup**: Use `onCleanup` to destroy instances
2. **Use signals**: Store DOM elements and configuration in signals
3. **Reactive updates**: Use `createEffect` to respond to signal changes
4. **TypeScript**: Use proper typing for better development experience
5. **Hooks**: Prefer the official hook for simpler integration
6. **Performance**: Solid's fine-grained reactivity ensures efficient updates

### Dependencies

- **Solid.js**: ^1.0.0
- **@ultratyped/solid**: ^1.0.0
- **ultratyped**: ^1.0.0 (core package)
- **TypeScript**: ^5.0.0
- **Vite**: ^4.4.0 (development server with Solid plugin)

### Project Structure

```
packages/solid/examples/
├── src/
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite development server config
└── README.md             # This file
```

### Development Notes

- Uses Vite with Solid plugin for fast development and building
- TypeScript support with strict mode enabled
- Hot module replacement for rapid development
- Solid's fine-grained reactivity for optimal performance

### Browser Compatibility

Works in all modern browsers that support:

- ES6 modules
- Solid.js requirements
- RequestAnimationFrame

### Next Steps

After exploring this example, check out other framework examples:

- [React Example](../../../react/examples/)
- [Vue Example](../../../vue/examples/)
- [Preact Example](../../../preact/examples/)
- [Svelte Example](../../../svelte/examples/)
- And more...

Each framework example demonstrates best practices and integration patterns specific to that framework.
