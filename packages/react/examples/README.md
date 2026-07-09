# UltraTyped.js React Examples

This directory contains examples demonstrating UltraTyped.js integration with React, showing hooks-based patterns and proper cleanup.

## Basic Example

The React example showcases modern React integration patterns:

### Features Demonstrated

- **Basic React component** with useEffect cleanup
- **Custom hook usage** from `@ultratyped/react`
- **Multiple instances** management
- **State-driven configuration** updates
- **Proper cleanup patterns** to prevent memory leaks
- **TypeScript support** with full type safety

### Running the Example

1. **From the project root**:

   ```bash
   # Build the core and React packages first
   pnpm --filter packages/core build
   pnpm --filter packages/react build

   # Navigate to the React example directory
   cd packages/react/examples

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

### React Integration Patterns

#### Using the Official Hook

```typescript
import { useUltraTyped } from '@ultratyped/react';

function MyComponent() {
  const ref = useUltraTyped({
    strings: ['Hello', 'World'],
    typeSpeed: 50,
    loop: true
  });

  return <div ref={ref} />;
}
```

#### Manual Integration with Cleanup

```typescript
import { useEffect, useRef } from 'react';
import UltraTyped from 'ultratyped';

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

```typescript
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
      <input
        value={strings.join('\n')}
        onChange={(e) => setStrings(e.target.value.split('\n'))}
      />
      <input
        type="number"
        value={speed}
        onChange={(e) => setSpeed(Number(e.target.value))}
      />
    </div>
  );
}
```

### Example Components

#### 1. Basic Typing Component

- Shows fundamental React integration
- Manual instance management with proper cleanup
- Event callback handling with React state
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

### Key React Concepts

#### useEffect Cleanup

```typescript
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

```typescript
const typedRef = useRef<HTMLDivElement>(null);

// In JSX
<div ref={typedRef} />

// In useEffect
if (typedRef.current) {
  UltraTyped(typedRef.current, options);
}
```

#### useCallback for Stable References

```typescript
const startTyping = useCallback(() => {
  if (instanceRef.current) {
    instanceRef.current.start();
  }
}, []);
```

### Best Practices

1. **Always cleanup**: Destroy instances in useEffect cleanup functions
2. **Use refs**: Store DOM elements and instances in refs
3. **State synchronization**: Update UltraTyped config when React state changes
4. **TypeScript**: Use proper typing for better development experience
5. **Performance**: Use useCallback for event handlers to prevent unnecessary re-renders

### Dependencies

- **React**: ^18.2.0
- **@ultratyped/react**: ^1.0.0
- **ultratyped**: ^1.0.0 (core package)
- **TypeScript**: ^5.0.0
- **Vite**: ^4.4.0 (development server)

### Project Structure

```
packages/react/examples/
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite development server config
└── README.md            # This file
```

### Development Notes

- Uses Vite for fast development and building
- TypeScript support with strict mode enabled
- Hot module replacement for rapid development
- Proper type checking and IntelliSense support

### Browser Compatibility

Works in all modern browsers that support:

- ES6 modules
- React 18+ features
- RequestAnimationFrame

### Next Steps

After exploring this example, check out other framework examples:

- [Vue Example](../../../vue/examples/)
- [Angular Example](../../../angular/examples/)
- [Svelte Example](../../../svelte/examples/)
- [Alpine.js Example](../../../alpine/examples/)
- And more...

Each framework example demonstrates best practices and integration patterns specific to that framework.
