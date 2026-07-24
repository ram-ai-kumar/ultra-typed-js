import UltraTyped, {
  type UltraTypedOptions,
  type UltraTypedInstance,
} from "ultratyped";

// TypeScript example demonstrating type safety and IntelliSense support

// 1. Basic typed configuration
const basicOptions: UltraTypedOptions = {
  strings: [
    "TypeScript-powered typing animation",
    "Full IntelliSense support",
    "Type-safe configuration",
    "Compile-time error checking",
  ],
  typeSpeed: 50,
  backSpeed: 30,
  backDelay: 1000,
  loop: true,
  contentType: "text",
};

// 2. HTML content configuration
const htmlOptions: UltraTypedOptions = {
  strings: [
    "HTML content with <strong>bold</strong> text",
    "And <em>italic</em> styling",
    'Even <span style="color: red;">colors</span>',
    'And <a href="#">links</a> work too',
  ],
  typeSpeed: 45,
  backSpeed: 25,
  loop: true,
  contentType: "html",
};

// 3. Custom typed configuration interface
interface CustomTypingConfig extends UltraTypedOptions {
  customProperty?: string;
  metadata?: {
    author: string;
    version: string;
    created: Date;
  };
}

const customConfig: CustomTypingConfig = {
  strings: [
    "Custom configuration",
    "Extended interface",
    "Type-safe extensions",
  ],
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

// 4. Generic wrapper class with typing
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

  updateOptions(newOptions: Partial<T>): void {
    this.options = { ...this.options, ...newOptions };
    // Note: Instance properties are not directly accessible in current type definition
    // This would need to be handled differently in a real implementation
  }

  getInstance(): UltraTypedInstance | null {
    return this.instance;
  }

  destroy(): void {
    if (this.instance) {
      // Note: destroy method not available in current type definition
      // this.instance.destroy()
      this.instance = null;
    }
  }
}

// 5. Type-safe factory functions
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

function createHTMLTypingAnimation(
  element: HTMLElement,
  htmlStrings: string[],
  options: Partial<UltraTypedOptions> = {},
): UltraTypedInstance {
  const fullOptions: UltraTypedOptions = {
    strings: htmlStrings,
    typeSpeed: 40,
    backSpeed: 20,
    loop: true,
    contentType: "html",
    ...options,
  };

  return UltraTyped(element, fullOptions);
}

// 6. Type-safe configuration builder
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

  delay(backDelay: number): this {
    this.config.backDelay = backDelay;
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

// 7. Usage examples with full type safety
function demonstrateTypeSafety(): void {
  // Create element
  const element = document.createElement("div");
  document.body.appendChild(element);

  // Using the builder pattern
  const config = new TypedConfigBuilder()
    .strings(["Builder pattern", "Type-safe configuration", "Fluent API"])
    .speed(45, 25)
    .looping(true)
    .delay(1000)
    .build();

  const instance = UltraTyped(element, config);

  // Type-safe method calls
  instance.start();
  instance.stop();
  instance.reset();

  console.log("✅ Type-safe UltraTyped instance created");
}

// 8. Generic typing utilities
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

  getMetadata(id: string): TypedAnimationMetadata | undefined {
    return this.metadata.get(id);
  }

  updateState(id: string, state: TypedAnimationState): void {
    const metadata = this.metadata.get(id);
    if (metadata) {
      metadata.state = state;
      metadata.lastActivity = new Date();
    }
  }

  stop(id: string): void {
    const instance = this.animations.get(id);
    if (instance) {
      instance.stop();
      this.updateState(id, "stopped");
    }
  }

  start(id: string): void {
    const instance = this.animations.get(id);
    if (instance) {
      instance.start();
      this.updateState(id, "running");
    }
  }

  list(): Array<{
    id: string;
    instance: UltraTypedInstance;
    metadata: TypedAnimationMetadata;
  }> {
    return Array.from(this.animations.entries()).map(([id, instance]) => ({
      id,
      instance,
      metadata: this.metadata.get(id)!,
    }));
  }
}

// 9. Type-safe event handler wrapper
class TypedEventHandler {
  private static handleStringTyped(index: number, total: number): void {
    console.log(`✨ Typed string ${index + 1} of ${total}`);
  }

  private static handleComplete(): void {
    console.log("🎉 Animation completed");
  }

  static createLogger(): {
    onStringTyped: (index: number, total: number) => void;
    onComplete: () => void;
  } {
    return {
      onStringTyped: this.handleStringTyped,
      onComplete: this.handleComplete,
    };
  }
}

// 10. Export types for external use
export type {
  UltraTypedOptions,
  UltraTypedInstance,
  CustomTypingConfig,
  TypedAnimationState,
  TypedAnimationMetadata,
};

export {
  TypedManager,
  TypedConfigBuilder,
  TypedAnimationRegistry,
  TypedEventHandler,
  createTypingAnimation,
  createHTMLTypingAnimation,
  demonstrateTypeSafety,
  basicOptions,
  htmlOptions,
  customConfig,
};

// Auto-run demonstration if in browser environment
if (typeof window !== "undefined") {
  // Demonstrate type safety when loaded
  console.log("🚀 UltraTyped.js TypeScript Example Loaded");
  console.log("✅ All types are properly checked at compile time");
  console.log("🔍 Full IntelliSense support available");
  console.log("📝 Type-safe configuration and method calls");

  // Uncomment to run demonstration
  // demonstrateTypeSafety()
}
