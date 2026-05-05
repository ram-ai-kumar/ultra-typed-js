# UltraTyped.js Preact Examples

This directory contains examples demonstrating UltraTyped.js integration with Preact, showing hooks-based patterns and proper cleanup.

## Basic Example

The Preact example showcases Preact integration patterns:

### Features Demonstrated

- **Preact hooks integration** with useEffect and useRef
- **Custom hook usage** from `@ultratyped/preact`
- **Multiple instances** management
- **State-driven configuration** updates
- **Proper cleanup patterns** to prevent memory leaks
- **TypeScript support** with full type safety

### Running the Example

1. **From the project root**:
   ```bash
   # Build the core and Preact packages first
   npm run build:core
   npm run build:preact

   # Navigate to the Preact example directory
   cd packages/preact/examples

   # Install dependencies
   npm install

   # Start the development server
   npm run dev
   ```

2. **Build for production**:
   ```bash
   npm run build
   npm run preview
   ```

### Preact Integration Patterns

#### Using the Official Hook
```tsx
import { useUltraTyped } from '@ultratyped/preact';
import { h } from 'preact';

function MyComponent() {
  const ref = useUltraTyped({
    strings: ['Hello', 'World', 'Preact'],
    typeSpeed: 50,
    loop: true
  });

  return <div ref={ref} />;
}
```

#### Manual Integration with Cleanup
```tsx
import { useEffect, useRef } from 'preact/hooks';
import UltraTyped from 'ultratyped';
import { h } from 'preact';

function TypingComponent() {
  const typedRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    if (typedRef.current && !instanceRef.current) {
      instanceRef.current = UltraTyped(typedRef.current, {
        strings: ['Hello', 'World'],
        typeSpeed: 50,
        loop: true,
        onComplete: () => console.log('Completed')
      });
    }

    // Cleanup function - crucial for preventing memory leaks
    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, []);

  return <div ref={typedRef} />;
}
```

#### State-Driven Configuration
```tsx
import { useState, useEffect, useRef } from 'preact/hooks';
import UltraTyped from 'ultratyped';
import { h } from 'preact';

function DynamicTypingComponent() {
  const [strings, setStrings] = useState(['Hello', 'World']);
  const [speed, setSpeed] = useState(50);
  const typedRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    if (typedRef.current && !instanceRef.current) {
      instanceRef.current = UltraTyped(typedRef.current, {
        strings,
        typeSpeed: speed,
        loop: true
      });
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, []);

  // Update configuration when state changes
  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.strings = strings;
      instanceRef.current.typeSpeed = speed;
      instanceRef.current.reset();
    }
  }, [strings, speed]);

  return (
    <div>
      <div ref={typedRef} />
      <textarea
        value={strings.join('\n')}
        onChange={(e) => setStrings((e.target as HTMLTextAreaElement).value.split('\n'))}
      />
      <input
        type="number"
        value={speed}
        onChange={(e) => setSpeed(Number((e.target as HTMLInputElement).value))}
      />
    </div>
  );
}
```

#### Multiple Instances Component
```tsx
import { useEffect, useRef, useState } from 'preact/hooks';
import UltraTyped from 'ultratyped';
import { h } from 'preact';

function MultipleInstances() {
  const refs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const [instances, setInstances] = useState<any[]>([]);
  const [allRunning, setAllRunning] = useState(false);

  useEffect(() => {
    const newInstances = refs.map((ref, index) => {
      if (ref.current) {
        return UltraTyped(ref.current, {
          strings: [`Instance ${index + 1}A`, `Instance ${index + 1}B`],
          typeSpeed: 50 + index * 20,
          loop: true,
          showCursor: index === 0
        });
      }
      return null;
    }).filter(Boolean);

    setInstances(newInstances);

    return () => {
      newInstances.forEach(instance => {
        if (instance) instance.destroy();
      });
    };
  }, []);

  const startAll = () => {
    instances.forEach(instance => instance?.start());
    setAllRunning(true);
  };

  const pauseAll = () => {
    instances.forEach(instance => instance?.pause());
    setAllRunning(false);
  };

  const stopAll = () => {
    instances.forEach(instance => instance?.stop());
    setAllRunning(false);
  };

  return (
    <div>
      {refs.map((ref, index) => (
        <div key={index} ref={ref} style={{ margin: '10px 0', fontSize: '20px' }} />
      ))}
      <div>
        <button onClick={startAll} disabled={allRunning}>Start All</button>
        <button onClick={pauseAll}>Pause All</button>
        <button onClick={stopAll}>Stop All</button>
      </div>
    </div>
  );
}
```

### Example Components

#### 1. Basic Typing Component
- Shows fundamental Preact integration
- Manual instance management with proper cleanup
- Event callback handling with Preact state
- Interactive controls for configuration

#### 2. Hook-Based Component
- Uses the official `useUltraTyped` hook
- Cleaner component code with encapsulated logic
- Automatic cleanup handled by the hook
- Status tracking and control methods

#### 3. Multiple Instances Component
- Manages multiple UltraTyped instances
- Coordinated control across all instances
- Different styling and speeds for visual variety
- Proper cleanup for all instances

#### 4. Dynamic Configuration Component
- Demonstrates state-driven configuration
- Updates UltraTyped when Preact state changes
- Textarea and input for dynamic updates
- Reset behavior on configuration change

### Key Preact Concepts

#### useEffect Cleanup
```tsx
useEffect(() => {
  // Initialize UltraTyped
  const instance = UltraTyped(element, options);

  // Cleanup function - called on unmount
  return () => {
    instance.destroy();
  };
}, []);
```

#### useRef for DOM Elements
```tsx
const typedRef = useRef<HTMLDivElement>(null);

// In JSX
<div ref={typedRef} />

// In useEffect
if (typedRef.current) {
  UltraTyped(typedRef.current, options);
}
```

#### useState for State Management
```tsx
const [strings, setStrings] = useState(['Hello', 'World']);
const [speed, setSpeed] = useState(50);

// Update state
setStrings(['New', 'Strings']);
setSpeed(80);
```

#### useCallback for Stable References
```tsx
import { useCallback } from 'preact/hooks';

const startTyping = useCallback(() => {
  if (instanceRef.current) {
    instanceRef.current.start();
  }
}, []);
```

### Best Practices

1. **Always cleanup**: Destroy instances in useEffect cleanup functions
2. **Use refs**: Store DOM elements and instances in refs
3. **State synchronization**: Update UltraTyped config when Preact state changes
4. **TypeScript**: Use proper typing for better development experience
5. **Performance**: Use useCallback for event handlers to prevent unnecessary re-renders
6. **Hooks**: Prefer the official hook for simpler integration

### Dependencies

- **Preact**: ^10.0.0
- **@ultratyped/preact**: ^1.0.0
- **ultratyped**: ^1.0.0 (core package)
- **TypeScript**: ^5.0.0
- **Vite**: ^4.4.0 (development server)

### Project Structure

```
packages/preact/examples/
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

- Uses Vite for fast development and building
- TypeScript support with strict mode enabled
- Hot module replacement for rapid development
- Proper type checking and IntelliSense support

### Browser Compatibility

Works in all modern browsers that support:
- ES6 modules
- Preact requirements
- RequestAnimationFrame

### Next Steps

After exploring this example, check out other framework examples:

- [React Example](../../../react/examples/)
- [Vue Example](../../../vue/examples/)
- [Svelte Example](../../../svelte/examples/)
- [Solid Example](../../../solid/examples/)
- And more...

Each framework example demonstrates best practices and integration patterns specific to that framework.
