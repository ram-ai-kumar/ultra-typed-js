# UltraTyped.js Astro Examples

This directory contains examples demonstrating UltraTyped.js integration with Astro, showing island architecture and client directives.

## Basic Example

The Astro example showcases Astro integration patterns:

### Features Demonstrated

- **Astro component integration** with client directives
- **Multiple islands** with different configurations
- **Proper cleanup** using Lifecycle hooks
- **Reactive configuration** with Astro's reactivity
- **TypeScript support** with full type safety
- **Server-side rendering** compatibility

### Running the Example

1. **From the project root**:
   ```bash
   # Build the core and Astro packages first
   npm run build:core
   npm run build:astro

   # Navigate to the Astro example directory
   cd packages/astro/examples

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

### Astro Integration Patterns

#### Basic Astro Component with Client Directive
```astro
---
import UltraTyped from 'ultratyped';
---

<div class="typing-container">
  <span id="typed-element"></span>
</div>

<script>
  import UltraTyped from 'ultratyped';

  document.addEventListener('DOMContentLoaded', () => {
    const element = document.getElementById('typed-element');
    if (element) {
      UltraTyped(element, {
        strings: ['Hello', 'World', 'Astro'],
        typeSpeed: 50,
        loop: true,
        onComplete: () => console.log('Completed')
      });
    }
  });
</script>
```

#### Using @ultratyped/astro Integration
```astro
---
import { UltraTypedComponent } from '@ultratyped/astro';
---

<UtraTypedComponent
  client:load
  strings={['Hello', 'World', 'Astro']}
  typeSpeed={50}
  loop={true}
/>

<!-- Or with JSX-style usage -->
<div>
  <UtraTypedComponent
    client:visible
    strings={['Revealed', 'When', 'Visible']}
    typeSpeed={80}
  />
</div>
```

#### Multiple Islands Example
```astro
---
import Layout from '../layouts/Main.astro';
---

<Layout title="UltraTyped Astro Examples">
  <main>
    <h1>UltraTyped.js Astro Examples</h1>

    <!-- Island 1: Loads immediately -->
    <section>
      <h2>Immediate Load</h2>
      <div id="typed-1"></div>
      <script>
        import UltraTyped from 'ultratyped';
        const el = document.getElementById('typed-1');
        if (el) {
          UltraTyped(el, {
            strings: ['Immediate', 'Loading'],
            typeSpeed: 50,
            loop: true
          });
        }
      </script>
    </section>

    <!-- Island 2: Loads when visible -->
    <section>
      <h2>Load on Visible</h2>
      <div id="typed-2"></div>
      <script>
        import UltraTyped from 'ultratyped';
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const el = entry.target;
              UltraTyped(el, {
                strings: ['Visible', 'Now'],
                typeSpeed: 80,
                loop: true
              });
              observer.unobserve(el);
            }
          });
        });
        const el = document.getElementById('typed-2');
        if (el) observer.observe(el);
      </script>
    </section>
  </main>
</Layout>
```

#### Reactive Configuration with Astro
```astro
---
const strings = ['Dynamic', 'Reactive', 'Astro'];
const typeSpeed = 50;
---

<div>
  <span id="reactive-typed"></span>

  <script define:vars={{ strings, typeSpeed }}>
    import UltraTyped from 'ultratyped';

    document.addEventListener('DOMContentLoaded', () => {
      const element = document.getElementById('reactive-typed');
      if (element) {
        const instance = UltraTyped(element, {
          strings,
          typeSpeed,
          loop: true
        });

        // Cleanup on page navigation (Astro View Transitions)
        document.addEventListener('astro:before-swap', () => {
          if (instance) instance.destroy();
        });
      }
    });
  </script>
</div>
```

### Example Components

#### 1. Basic Astro Component
- Shows fundamental Astro integration
- Uses client directives for hydration
- Manual instance management with cleanup
- Event callback handling

#### 2. Multiple Islands
- Demonstrates Astro's island architecture
- Different client directives (load, visible, idle)
- Independent typing instances
- Proper cleanup for each island

#### 3. View Transitions Support
- Handles Astro's View Transitions API
- Cleans up instances before page swap
- Re-initializes after navigation
- Smooth page transitions

#### 4. Component Wrapper
- Creates reusable Astro components
- Encapsulates UltraTyped logic
- Props-based configuration
- TypeScript support

### Key Astro Concepts

#### Client Directives
```astro
<!-- Load immediately -->
<MyComponent client:load />

<!-- Load when visible -->
<MyComponent client:visible />

<!-- Load when idle -->
<MyComponent client:idle />

<!-- Load on interaction -->
<MyComponent client:media="(max-width: 768px)" />
```

#### Script Tag Usage
```astro
<script>
  // This script runs on the client
  import UltraTyped from 'ultratyped';

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const element = document.getElementById('typed');
    if (element) {
      UltraTyped(element, options);
    }
  });
</script>
```

#### View Transitions Cleanup
```astro
<script>
  let instance;

  document.addEventListener('DOMContentLoaded', () => {
    instance = UltraTyped(element, options);
  });

  // Cleanup before page transition
  document.addEventListener('astro:before-swap', () => {
    if (instance) instance.destroy();
  });
</script>
```

#### Define Variables
```astro
---
const strings = ['Hello', 'World'];
---

<script define:vars={{ strings }}>
  // strings is available here as a JavaScript variable
  console.log(strings);
</script>
```

### Best Practices

1. **Client directives**: Use appropriate client directives for hydration timing
2. **Cleanup**: Handle Astro's View Transitions with `astro:before-swap`
3. **Islands**: Create independent islands for different typing effects
4. **TypeScript**: Use proper typing for better development experience
5. **Performance**: Use `client:visible` for below-fold content
6. ** SSR**: Ensure compatibility with server-side rendering

### Dependencies

- **Astro**: ^2.0.0 || ^3.0.0 || ^4.0.0
- **@ultratyped/astro**: ^1.0.0
- **ultratyped**: ^1.0.0 (core package)
- **TypeScript**: ^5.0.0 (optional)

### Project Structure

```
packages/astro/examples/
├── src/
│   ├── components/
│   │   ├── TypingComponent.astro
│   │   └── MultipleIslands.astro
│   ├── layouts/
│   │   └── Main.astro
│   └── pages/
│       └── index.astro
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

### Development Notes

- Uses Astro's built-in development server
- TypeScript support with strict mode
- Hot module replacement for rapid development
- Island architecture for optimal performance

### Browser Compatibility

Works in all modern browsers that support:
- ES6 modules
- Astro requirements
- RequestAnimationFrame
- Intersection Observer (for `client:visible`)

### Next Steps

After exploring this example, check out other framework examples:

- [React Example](../../../react/examples/)
- [Vue Example](../../../vue/examples/)
- [Angular Example](../../../angular/examples/)
- [Svelte Example](../../../svelte/examples/)
- And more...

Each framework example demonstrates best practices and integration patterns specific to that framework.
