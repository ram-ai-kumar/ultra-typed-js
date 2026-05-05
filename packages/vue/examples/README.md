# UltraTyped.js Vue Examples

This directory contains examples demonstrating UltraTyped.js integration with Vue 3, showing Composition API patterns and proper cleanup.

## Basic Example

The Vue example showcases modern Vue 3 integration patterns:

### Features Demonstrated

- **Composition API integration** with `setup()` and lifecycle hooks
- **Official composable usage** from `@ultratyped/vue`
- **Custom composable implementation** for advanced patterns
- **Multiple instances** management
- **Reactive props** with child components
- **Proper cleanup patterns** using `onBeforeUnmount`
- **TypeScript support** with full type safety

### Running the Example

1. **From the project root**:
   ```bash
   # Build the core and Vue packages first
   npm run build:core
   npm run build:vue
   
   # Navigate to the Vue example directory
   cd packages/vue/examples
   
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

### Vue Integration Patterns

#### Using the Official Composable
```vue
<script setup lang="ts">
import { useUltraTyped } from '@ultratyped/vue'

const typedElement = useUltraTyped({
  strings: ['Hello', 'World'],
  typeSpeed: 50,
  loop: true
})
</script>

<template>
  <div ref="typedElement"></div>
</template>
```

#### Manual Integration with Cleanup
```vue
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import UltraTyped from 'ultratyped'

const typedElement = ref<HTMLElement | null>(null)
const instance = ref<any>(null)

onMounted(() => {
  if (typedElement.value) {
    instance.value = UltraTyped(typedElement.value, {
      strings: ['Hello', 'World'],
      typeSpeed: 50,
      loop: true,
      onComplete: () => console.log('Completed')
    })
  }
})

onBeforeUnmount(() => {
  if (instance.value) {
    instance.value.destroy()
    instance.value = null
  }
})
</script>

<template>
  <div ref="typedElement"></div>
</template>
```

#### Custom Composable Implementation
```typescript
import { ref, onMounted, onBeforeUnmount } from 'vue'
import UltraTyped from 'ultratyped'

export function useUltraTypedCustom(element: Ref<HTMLElement | null>, options: any) {
  const instance = ref<any>(null)
  const status = ref('idle')

  onMounted(() => {
    if (element.value && !instance.value) {
      instance.value = UltraTyped(element.value, options)
    }
  })

  onBeforeUnmount(() => {
    if (instance.value) {
      instance.value.destroy()
    }
  })

  const controls = reactive({
    start: () => instance.value?.start(),
    pause: () => instance.value?.pause(),
    resume: () => instance.value?.resume(),
    reset: () => instance.value?.reset(),
    stop: () => instance.value?.stop()
  })

  return { status, controls }
}
```

#### Reactive Props Component
```vue
<script setup lang="ts">
const props = defineProps<{
  strings: string[]
  typeSpeed: number
  loop: boolean
}>()

const emit = defineEmits<{
  'string-typed': [arrayPos: number]
  'animation-complete': []
}>()

const element = ref<HTMLElement | null>(null)
const instance = ref<any>(null)

onMounted(() => {
  if (element.value) {
    instance.value = UltraTyped(element.value, {
      strings: props.strings,
      typeSpeed: props.typeSpeed,
      loop: props.loop,
      onStringTyped: (arrayPos: number) => {
        emit('string-typed', arrayPos)
      },
      onComplete: () => {
        emit('animation-complete')
      }
    })
  }
})

onBeforeUnmount(() => {
  if (instance.value) {
    instance.value.destroy()
  }
})

// Watch for prop changes
watch(() => props.strings, (newStrings) => {
  if (instance.value) {
    instance.value.strings = newStrings
    instance.value.reset()
  }
}, { deep: true })
</script>

<template>
  <div ref="element"></div>
</template>
```

### Example Components

#### 1. Basic Vue Component
- Shows fundamental Vue 3 integration
- Manual instance management with proper cleanup
- Event callback handling with Vue reactivity
- Interactive controls for configuration
- Reactive state management

#### 2. Composable-based Component
- Uses custom composable for encapsulated logic
- Cleaner component code with reusable patterns
- Automatic cleanup handled by composable
- Status tracking and control methods
- Dynamic string management

#### 3. Multiple Instances Component
- Manages multiple UltraTyped instances
- Coordinated control across all instances
- Different styling and speeds for visual variety
- Proper cleanup for all instances

#### 4. Reactive Props Component
- Demonstrates parent-child communication
- Props-based configuration
- Event emission for callbacks
- Reactive updates on prop changes

### Key Vue Concepts

#### Composition API Lifecycle
```typescript
onMounted(() => {
  // Initialize UltraTyped after DOM is ready
  if (element.value) {
    instance.value = UltraTyped(element.value, options)
  }
})

onBeforeUnmount(() => {
  // Cleanup before component unmounts
  if (instance.value) {
    instance.value.destroy()
  }
})
```

#### Template Refs
```vue
<template>
  <div ref="typedElement"></div>
</template>

<script setup lang="ts">
const typedElement = ref<HTMLElement | null>(null)
</script>
```

#### Reactive Updates
```typescript
// Watch for reactive changes
watch(
  () => configuration.value,
  (newConfig) => {
    if (instance.value) {
      instance.value.strings = newConfig.strings
      instance.value.typeSpeed = newConfig.typeSpeed
      instance.value.reset()
    }
  },
  { deep: true }
)
```

#### Component Communication
```typescript
// Parent component
<TypingComponent
  :strings="strings"
  :type-speed="speed"
  @string-typed="onStringTyped"
  @animation-complete="onComplete"
/>

// Child component
const emit = defineEmits<{
  'string-typed': [arrayPos: number]
  'animation-complete': []
}>()
```

### Best Practices

1. **Always cleanup**: Destroy instances in `onBeforeUnmount`
2. **Use refs**: Store DOM elements and instances in refs
3. **Reactive updates**: Watch for configuration changes and update UltraTyped
4. **TypeScript**: Use proper typing for better development experience
5. **Composables**: Encapsulate reusable logic in composables
6. **Props and events**: Use props for configuration and events for callbacks

### Dependencies

- **Vue**: ^3.3.0
- **@ultratyped/vue**: ^1.0.0
- **ultratyped**: ^1.0.0 (core package)
- **TypeScript**: ^5.0.0
- **Vite**: ^4.4.0 (development server)

### Project Structure

```
packages/vue/examples/
├── App.vue              # Main application component
├── main.ts              # Application entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite development server config
└── README.md            # This file
```

### Development Notes

- Uses Vite for fast development and building
- TypeScript support with strict mode enabled
- Hot module replacement for rapid development
- Proper type checking and IntelliSense support
- Vue 3 Composition API throughout

### Browser Compatibility

Works in all modern browsers that support:
- ES6 modules
- Vue 3+ features
- RequestAnimationFrame

### Next Steps

After exploring this example, check out other framework examples:

- [React Example](../../../react/examples/)
- [Angular Example](../../../angular/examples/)
- [Svelte Example](../../../svelte/examples/)
- [Alpine.js Example](../../../alpine/examples/)
- And more...

Each framework example demonstrates best practices and integration patterns specific to that framework.
