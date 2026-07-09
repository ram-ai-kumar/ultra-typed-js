# UltraTyped.js TypeScript Examples

This directory contains examples demonstrating UltraTyped.js with full TypeScript support, showing type safety, IntelliSense, and advanced typing patterns.

## TypeScript Example

The `index.ts` file showcases comprehensive TypeScript integration:

### Features Demonstrated

- **Type-safe configuration** with `UltraTypedOptions` interface
- **Full IntelliSense support** for all methods and properties
- **Generic wrapper classes** for reusable patterns
- **Custom interface extensions** for enhanced configurations
- **Factory functions** with proper typing
- **Builder pattern** implementation
- **Type-safe event handling**
- **Generic utilities** for animation management

### Running the Example

1. **From the project root**:

   ```bash
   # Build the core package first
   pnpm --filter packages/core build

   # Compile and run the TypeScript example
   npx tsc packages/typescript/examples/index.ts --target es2020 --module esnext --moduleResolution node --outDir packages/typescript/examples/dist

   # Run with Node.js
   node packages/typescript/examples/dist/index.js
   ```

2. **In a browser**:

   ```bash
   # Compile for browser
   npx tsc packages/typescript/examples/index.ts --target es2020 --module esnext --moduleResolution node --outDir packages/typescript/examples/dist --globalName UltraTypedTSExample

   # Include in HTML
   # <script src="dist/index.js"></script>
   ```

### TypeScript Integration Patterns

#### Basic Typed Configuration

```typescript
import UltraTyped, { type UltraTypedOptions } from "ultratyped";

const options: UltraTypedOptions = {
  strings: ["Type-safe typing animation", "Full IntelliSense"],
  typeSpeed: 50,
  backSpeed: 30,
  loop: true,
  contentType: "text",
};

const instance = UltraTyped(element, options);
```

#### Custom Interface Extension

```typescript
interface CustomTypingConfig extends UltraTypedOptions {
  customProperty?: string;
  metadata?: {
    author: string;
    version: string;
    created: Date;
  };
}

const customConfig: CustomTypingConfig = {
  strings: ["Extended configuration"],
  typeSpeed: 40,
  loop: true,
  contentType: "text",
  customProperty: "custom-value",
  metadata: {
    author: "Developer",
    version: "1.0.0",
    created: new Date(),
  },
};
```

#### Generic Wrapper Class

```typescript
class TypedManager<T extends UltraTypedOptions = UltraTypedOptions> {
  private instance: UltraTypedInstance | null = null;
  private element: HTMLElement;
  private options: T;

  constructor(element: HTMLElement, options: T) {
    this.element = element;
    this.options = options;
  }

  initialize(): UltraTypedInstance {
    this.instance = UltraTyped(this.element, this.options);
    return this.instance;
  }

  getInstance(): UltraTypedInstance | null {
    return this.instance;
  }
}

// Usage
const manager = new TypedManager(element, options);
const instance = manager.initialize();
```

#### Type-safe Factory Functions

```typescript
function createTypingAnimation(
  element: HTMLElement,
  strings: string[],
  options: Partial<UltraTypedOptions> = {},
): UltraTypedInstance {
  const fullOptions: UltraTypedOptions = {
    strings,
    typeSpeed: 50,
    backSpeed: 30,
    loop: true,
    contentType: "text",
    ...options,
  };

  return UltraTyped(element, fullOptions);
}

// Usage
const instance = createTypingAnimation(element, ["Hello", "World"], {
  typeSpeed: 45,
  loop: false,
});
```

#### Builder Pattern Implementation

```typescript
class TypedConfigBuilder {
  private config: Partial<UltraTypedOptions> = {};

  strings(strings: string[]): this {
    this.config.strings = strings;
    return this;
  }

  speed(typeSpeed: number, backSpeed?: number): this {
    this.config.typeSpeed = typeSpeed;
    if (backSpeed !== undefined) {
      this.config.backSpeed = backSpeed;
    }
    return this;
  }

  looping(loop: boolean): this {
    this.config.loop = loop;
    return this;
  }

  html(enabled: boolean): this {
    this.config.contentType = enabled ? "html" : "text";
    return this;
  }

  build(): UltraTypedOptions {
    const defaults: UltraTypedOptions = {
      strings: [],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 800,
      loop: true,
      contentType: "text",
    };

    return { ...defaults, ...this.config };
  }
}

// Usage
const config = new TypedConfigBuilder()
  .strings(["Builder pattern", "Type-safe configuration"])
  .speed(45, 25)
  .looping(true)
  .html(false)
  .build();

const instance = UltraTyped(element, config);
```

#### Generic Animation Registry

```typescript
type TypedAnimationState = "idle" | "running" | "paused" | "stopped";

interface TypedAnimationMetadata {
  id: string;
  element: HTMLElement;
  state: TypedAnimationState;
  createdAt: Date;
  lastActivity?: Date;
}

class TypedAnimationRegistry {
  private animations = new Map<string, UltraTypedInstance>();
  private metadata = new Map<string, TypedAnimationMetadata>();

  register(
    id: string,
    instance: UltraTypedInstance,
    element: HTMLElement,
  ): void {
    this.animations.set(id, instance);
    this.metadata.set(id, {
      id,
      element,
      state: "idle",
      createdAt: new Date(),
    });
  }

  get(id: string): UltraTypedInstance | undefined {
    return this.animations.get(id);
  }

  start(id: string): void {
    const instance = this.animations.get(id);
    if (instance) {
      instance.start();
      this.updateState(id, "running");
    }
  }

  stop(id: string): void {
    const instance = this.animations.get(id);
    if (instance) {
      instance.stop();
      this.updateState(id, "stopped");
    }
  }

  updateState(id: string, state: TypedAnimationState): void {
    const metadata = this.metadata.get(id);
    if (metadata) {
      metadata.state = state;
      metadata.lastActivity = new Date();
    }
  }
}

// Usage
const registry = new TypedAnimationRegistry();
const instance = UltraTyped(element, options);
registry.register("main-animation", instance, element);
registry.start("main-animation");
```

### Key TypeScript Concepts

#### Type Safety

All UltraTyped.js APIs are fully typed:

```typescript
// ✅ Type-safe - compiler will catch errors
const options: UltraTypedOptions = {
  strings: ["Hello", "World"],
  typeSpeed: 50, // Must be number
  loop: true, // Must be boolean
  contentType: "text", // Must be 'text' | 'html'
};

// ❌ Type error - contentType must be 'text' or 'html'
const badOptions: UltraTypedOptions = {
  strings: ["Hello"],
  contentType: "invalid", // Error!
};
```

#### IntelliSense Support

Full autocomplete and documentation:

```typescript
const instance = UltraTyped(element, options);

// ✅ Full IntelliSense for methods
instance.start(); // ✅ Available
instance.stop(); // ✅ Available
instance.reset(); // ✅ Available

// ❌ Compiler error - method doesn't exist
instance.destroy(); // Error: Property 'destroy' does not exist
```

#### Generic Types

Create reusable, type-safe components:

```typescript
// Generic manager that works with any UltraTypedOptions extension
class TypedManager<T extends UltraTypedOptions = UltraTypedOptions> {
  constructor(element: HTMLElement, options: T) {
    /* ... */
  }
}

// Usage with custom config
interface MyConfig extends UltraTypedOptions {
  customProp: string;
}

const manager = new TypedManager<MyConfig>(element, myConfig);
```

### Available Types

#### Core Types

```typescript
interface UltraTypedOptions {
  strings: string[];
  typeSpeed?: number;
  backSpeed?: number;
  backDelay?: number;
  loop?: boolean;
  contentType?: "text" | "html";
}

interface UltraTypedInstance {
  start(): void;
  stop(): void;
  reset(): void;
}
```

#### Custom Types (from example)

```typescript
type TypedAnimationState = "idle" | "running" | "paused" | "stopped";

interface TypedAnimationMetadata {
  id: string;
  element: HTMLElement;
  state: TypedAnimationState;
  createdAt: Date;
  lastActivity?: Date;
}

interface CustomTypingConfig extends UltraTypedOptions {
  customProperty?: string;
  metadata?: {
    author: string;
    version: string;
    created: Date;
  };
}
```

### Best Practices

1. **Use type imports**: `import { type UltraTypedOptions } from 'ultratyped'`
2. **Prefer interfaces**: Define custom configuration interfaces
3. **Leverage generics**: Create reusable, type-safe utilities
4. **Builder pattern**: Use for complex configurations
5. **Factory functions**: Create type-safe instance creators
6. **Type guards**: Validate runtime data when needed

### Development Benefits

- **Compile-time error checking**: Catch mistakes before runtime
- **Full IntelliSense**: Autocomplete and parameter documentation
- **Refactoring safety**: Rename and refactor with confidence
- **Code documentation**: Types serve as documentation
- **Better IDE support**: Enhanced navigation and analysis

### Dependencies

- **TypeScript**: ^5.0.0
- **ultratyped**: ^1.0.0 (core package)

### Project Structure

```
packages/typescript/examples/
├── index.ts              # Main TypeScript example
├── README.md              # This file
└── dist/                  # Compiled JavaScript output
    └── index.js
```

### Browser Compatibility

Works in all modern browsers that support:

- ES6 modules
- TypeScript compilation target
- RequestAnimationFrame

### Next Steps

After exploring this example, check out other framework examples:

- [React Example](../../../react/examples/)
- [Vue Example](../../../vue/examples/)
- [Angular Example](../../../angular/examples/)
- [Svelte Example](../../../svelte/examples/)
- [Alpine.js Example](../../../alpine/examples/)
- And more...

Each framework example demonstrates best practices and integration patterns specific to that framework.
