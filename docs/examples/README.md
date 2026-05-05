# Code Examples

This section contains code examples and demonstrations for UltraTyped.js across different frameworks and use cases.

## Available Examples

### Framework Examples

#### Completed Examples ✅

- **Core Examples** - Vanilla JavaScript with full API demonstration
  - [Basic Example](../../packages/core/examples/) - Complete feature showcase
- **React Examples** - React hooks and components
  - [React Example](../../packages/react/examples/) - Functional components with hooks
- **Vue Examples** - Vue 3 Composition API
  - [Vue Example](../../packages/vue/examples/) - Composition API with reactivity
- **Svelte Examples** - Svelte actions and components
  - [Svelte Example](../../packages/svelte/examples/) - Component and action patterns
- **Alpine.js Examples** - Alpine.js directives and reactivity
  - [Alpine.js Example](../../packages/alpine/examples/) - x-data and x-init integration
- **TypeScript Examples** - TypeScript with full type safety
  - [TypeScript Example](../../packages/typescript/examples/) - Type-safe patterns and IntelliSense
- **Typed.js Compatibility** - Drop-in replacement for Typed.js
  - [Typed Compat Example](../../packages/typed-compat/examples/) - Migration and compatibility
- **Angular Examples** - Angular services and components
  - [Angular Example](../../packages/angular/examples/) - Services with dependency injection
- **Astro Examples** - Astro islands and client directives
  - [Astro Example](../../packages/astro/examples/) - Island architecture patterns
- **Lit Examples** - LitElement web components
  - [Lit Example](../../packages/lit/examples/) - Web components with reactive properties
- **Preact Examples** - Preact hooks and components
  - [Preact Example](../../packages/preact/examples/) - Hooks with state-driven configuration
- **Solid Examples** - Solid reactive framework
  - [Solid Example](../../packages/solid/examples/) - Signals and reactive primitives

### Use Case Examples

- **Hero Sections** - Landing page typing effects
- **Loading States** - Dynamic loading indicators
- **Terminal UI** - Command-line style animations
- **Interactive Forms** - Form field typing effects

## Quick Start Examples

### Basic Usage

```javascript
import UltraTyped from "ultratyped";

UltraTyped("#hero-text", {
  strings: ["Welcome", "to UltraTyped.js"],
  typeSpeed: 50,
  loop: true,
});
```

### React Hook

```jsx
import { useUltraTyped } from "@ultratyped/react";

function HeroSection() {
  const { ref } = useUltraTyped({
    strings: ["React", "TypeScript", "UltraTyped"],
    typeSpeed: 50,
  });

  return (
    <h1>
      Built with <span ref={ref} />
    </h1>
  );
}
```

### Vue Composition API

```vue
<script setup>
import { useUltraTyped } from "@ultratyped/vue";

const element = ref(null);

useUltraTyped(element, {
  strings: ["Vue", "Reactive", "Typing"],
  typeSpeed: 50,
});
</script>

<template>
  <span ref="element"></span>
</template>
```

## Running Examples

Each framework example includes its own README with detailed setup instructions:

### Quick Setup for Any Example

```bash
# From project root
cd packages/[framework]/examples

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build Requirements

```bash
# Build required packages first
npm run build:core
npm run build:[framework]

# Then run the example
cd packages/[framework]/examples
npm run dev
```

## Example Features

### Core Features Demonstrated

- **Basic typing animation** with multiple strings
- **Control methods** (start, stop, pause, resume, reset)
- **Event callbacks** for animation lifecycle
- **HTML content support** with rich formatting
- **Reactive configuration** updates
- **Multiple instances** management
- **Proper cleanup** and memory management

### Framework-Specific Patterns

- **React**: useEffect cleanup, custom hooks, TypeScript
- **Vue**: Composition API, onBeforeUnmount, reactivity
- **Svelte**: Actions, onMount/destroy, reactive statements
- **Alpine.js**: x-data, x-init, component communication
- **TypeScript**: Type safety, IntelliSense, generic patterns
- **Typed.js Compat**: Drop-in replacement, migration guide

## Live Demos

Coming soon: Interactive playground and live examples.

## Need More Help?

- **[User Guides](../guides/)** - Comprehensive usage guides
- **[API Reference](../reference/api.md)** - Complete API documentation
- **[Migration Guides](../guides/migration/)** - Coming from other libraries

## Contributing Examples

To contribute a new framework example:

1. Create the example directory structure
2. Follow the established patterns from existing examples
3. Include comprehensive README documentation
4. Ensure proper cleanup and error handling
5. Test the example builds and runs correctly
6. Update this documentation

See the [Contributing Guide](../../CONTRIBUTING.md) for more details.
