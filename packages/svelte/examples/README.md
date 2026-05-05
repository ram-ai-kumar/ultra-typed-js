# UltraTyped.js Svelte Examples

This directory contains examples demonstrating UltraTyped.js integration with Svelte, showing both component-based and action-based patterns.

## Svelte Example

The Svelte example showcases modern Svelte integration patterns:

### Features Demonstrated

- **Component-based integration** with manual lifecycle management
- **Svelte action integration** with automatic cleanup
- **Reactive prop updates** using Svelte's reactivity system
- **Event callback handling** with Svelte patterns
- **Dynamic string management** with reactive updates
- **TypeScript support** with full type safety

### Running the Example

1. **From the project root**:
   ```bash
   # Build the core and Svelte packages first
   npm run build:core
   npm run build:svelte
   
   # Navigate to the Svelte example directory
   cd packages/svelte/examples
   
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

### Svelte Integration Patterns

#### Component-based Integration

```svelte
<script>
  import { onMount, onDestroy } from 'svelte'
  import UltraTyped from 'ultratyped'

  export let strings = ['Hello', 'World']
  export let typeSpeed = 50

  let element
  let instance = null

  onMount(() => {
    if (element) {
      instance = UltraTyped(element, {
        strings,
        typeSpeed,
        loop: true,
        onComplete: () => console.log('Completed!')
      })
    }
  })

  onDestroy(() => {
    if (instance) {
      instance.destroy()
    }
  })

  // Reactive updates
  $: if (instance && strings) {
    instance.strings = strings
    instance.reset()
  }
</script>

<div bind:this={element}></div>
```

#### Svelte Action Integration

```svelte
<script>
  import { ultratyped } from '@ultratyped/svelte'
  
  export let strings = ['Hello', 'World']
  export let typeSpeed = 50
</script>

<div use:ultratyped={{
  strings,
  typeSpeed,
  loop: true,
  onComplete: () => console.log('Completed!')
}}></div>
```

#### Advanced Component with Full Control

```svelte
<script>
  import { onMount, onDestroy } from 'svelte'
  import UltraTyped from 'ultratyped'

  export let strings = ['Advanced Svelte', 'Full control', 'Event handling']
  export let typeSpeed = 50
  export let loop = true
  export let showCursor = true

  let element
  let instance = null
  let status = 'Ready'
  let isRunning = false

  onMount(() => {
    if (element) {
      instance = UltraTyped(element, {
        strings,
        typeSpeed,
        backSpeed: 30,
        loop,
        showCursor,
        
        onBegin: () => {
          isRunning = true
          status = 'Animation began'
        },
        onComplete: () => {
          status = 'All strings completed!'
        },
        onStringTyped: (arrayPos) => {
          status = `Finished string ${arrayPos + 1}`
        },
        onStop: () => {
          isRunning = false
          status = 'Animation stopped'
        }
      })
    }
  })

  onDestroy(() => {
    if (instance) {
      instance.destroy()
    }
  })

  // Reactive prop updates
  $: if (instance && strings) {
    instance.strings = strings
    instance.reset()
  }

  $: if (instance && typeSpeed !== undefined) {
    instance.typeSpeed = typeSpeed
  }

  // Control methods
  function start() {
    if (instance) instance.start()
  }

  function pause() {
    if (instance) instance.pause()
  }

  function stop() {
    if (instance) instance.stop()
  }

  function reset() {
    if (instance) instance.reset()
  }

  // Dynamic string management
  function addString() {
    strings = [...strings, `New string #${strings.length + 1}`]
  }

  function removeString() {
    if (strings.length > 1) {
      strings = strings.slice(0, -1)
    }
  }
</script>

<div class="typing-component">
  <div bind:this={element} class="typed-element"></div>
  
  <div class="controls">
    <button on:click={start} disabled={isRunning}>Start</button>
    <button on:click={pause} disabled={!isRunning}>Pause</button>
    <button on:click={stop}>Stop</button>
    <button on:click={reset}>Reset</button>
  </div>
  
  <div class="status">{status}</div>
  
  <div class="string-controls">
    <button on:click={addString}>Add String</button>
    <button on:click={removeString}>Remove Last</button>
  </div>
  
  <div class="string-list">
    <p>Current strings ({strings.length}):</p>
    <ul>
      {#each strings as str, index}
        <li>{index + 1}. {str}</li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .typing-component {
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .typed-element {
    font-size: 24px;
    color: #2563eb;
    min-height: 40px;
    margin: 20px 0;
    font-family: 'Courier New', monospace;
  }

  .controls {
    display: flex;
    gap: 10px;
    margin: 20px 0;
    flex-wrap: wrap;
  }

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #2563eb;
    color: white;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
  }

  button:hover {
    background-color: #1d4ed8;
  }

  button:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }

  .status {
    padding: 10px;
    background-color: #f3f4f6;
    border-radius: 5px;
    margin: 10px 0;
    font-size: 14px;
  }

  .string-controls {
    display: flex;
    gap: 10px;
    margin: 15px 0;
  }

  .string-list {
    margin: 15px 0;
    padding: 15px;
    background-color: #f9fafb;
    border-radius: 5px;
  }

  .string-list ul {
    margin: 10px 0;
    padding-left: 20px;
  }

  .string-list li {
    margin: 5px 0;
    font-family: 'Courier New', monospace;
  }
</style>
```

### Key Svelte Concepts

#### Lifecycle Functions

```svelte
<script>
  import { onMount, onDestroy } from 'svelte'
  import UltraTyped from 'ultratyped'

  let element
  let instance

  onMount(() => {
    // Initialize when component mounts
    instance = UltraTyped(element, options)
  })

  onDestroy(() => {
    // Cleanup when component unmounts
    if (instance) {
      instance.destroy()
    }
  })
</script>

<div bind:this={element}></div>
```

#### Reactive Updates

```svelte
<script>
  export let strings = ['Hello', 'World']
  export let typeSpeed = 50

  let instance

  // Reactive statement - runs when dependencies change
  $: if (instance && strings) {
    instance.strings = strings
    instance.reset()
  }

  $: if (instance && typeSpeed !== undefined) {
    instance.typeSpeed = typeSpeed
  }
</script>
```

#### Event Handling

```svelte
<script>
  function start() {
    if (instance) instance.start()
  }

  function pause() {
    if (instance) instance.pause()
  }
</script>

<button on:click={start}>Start</button>
<button on:click={pause}>Pause</button>
```

#### Svelte Actions

```svelte
<script>
  import { ultratyped } from '@ultratyped/svelte'
  
  export let strings = ['Action-based', 'Automatic cleanup']
</script>

<!-- Action handles cleanup automatically -->
<div use:ultratyped={{
  strings,
  typeSpeed: 50,
  loop: true
}}></div>
```

### Integration Patterns Comparison

#### Component Pattern
- **Pros**: Full control, complex state, event callbacks
- **Cons**: Manual cleanup, more code
- **Use case**: Complex components with custom logic

#### Action Pattern
- **Pros**: Automatic cleanup, simple syntax, idiomatic
- **Cons**: Less control, limited to basic usage
- **Use case**: Simple typing effects, automatic cleanup

### Best Practices

1. **Always cleanup**: Use `onDestroy` for component pattern
2. **Use actions**: For simple use cases with automatic cleanup
3. **Reactive updates**: Use `$:` statements for prop changes
4. **Type safety**: Use TypeScript for better development experience
5. **Event handlers**: Use Svelte's `on:click` syntax
6. **Props**: Export props for reusable components

### Dependencies

- **Svelte**: ^4.0.0
- **@ultratyped/svelte**: ^1.0.0
- **ultratyped**: ^1.0.0 (transitive dependency)

### Project Structure

```
packages/svelte/examples/
├── TypingComponent.svelte    # Advanced component example
├── App.svelte                 # Main application
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

### Development Notes

- Uses Vite for fast development and building
- TypeScript support with Svelte
- Hot module replacement for rapid development
- Proper cleanup patterns for memory management

### Browser Compatibility

Works in all modern browsers that support:
- ES6 modules
- Svelte 4+ features
- RequestAnimationFrame

### Next Steps

After exploring this example, check out other framework examples:

- [React Example](../../../react/examples/)
- [Vue Example](../../../vue/examples/)
- [Angular Example](../../../angular/examples/)
- [Alpine.js Example](../../../alpine/examples/)
- [TypeScript Example](../../../typescript/examples/)
- And more...

Each framework example demonstrates best practices and integration patterns specific to that framework.
