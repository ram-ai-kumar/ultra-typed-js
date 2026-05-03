# Code Examples

This section contains code examples and demonstrations for UltraTyped.js across different frameworks and use cases.

## Available Examples

### Framework Examples
- **React Examples** - React hooks and components
- **Vue Examples** - Vue 3 Composition API
- **Svelte Examples** - Svelte actions and components
- **Angular Examples** - Angular directives and services

### Use Case Examples
- **Hero Sections** - Landing page typing effects
- **Loading States** - Dynamic loading indicators
- **Terminal UI** - Command-line style animations
- **Interactive Forms** - Form field typing effects

## Quick Start Examples

### Basic Usage

```javascript
import UltraTyped from 'ultratyped';

UltraTyped('#hero-text', {
  strings: ['Welcome', 'to UltraTyped.js'],
  typeSpeed: 50,
  loop: true,
});
```

### React Hook

```jsx
import { useUltraTyped } from '@ultratyped/react';

function HeroSection() {
  const { ref } = useUltraTyped({
    strings: ['React', 'TypeScript', 'UltraTyped'],
    typeSpeed: 50,
  });
  
  return <h1>Built with <span ref={ref} /></h1>;
}
```

### Vue Composition API

```vue
<script setup>
import { useUltraTyped } from '@ultratyped/vue';

const element = ref(null);

useUltraTyped(element, {
  strings: ['Vue', 'Reactive', 'Typing'],
  typeSpeed: 50,
});
</script>

<template>
  <span ref="element"></span>
</template>
```

## Live Demos

Coming soon: Interactive playground and live examples.

## Need More Help?

- **[User Guides](../guides/)** - Comprehensive usage guides
- **[API Reference](../reference/api.md)** - Complete API documentation
- **[Migration Guides](../guides/migration/)** - Coming from other libraries
