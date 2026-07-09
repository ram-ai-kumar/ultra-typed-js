<template>
  <div class="container">
    <h1>UltraTyped.js - Vue Example</h1>

    <!-- Basic Vue Component -->
    <div class="example-section">
      <h3>Basic Vue Component</h3>
      <div ref="typedElement" class="typed-element">{{ currentText }}</div>
      <div class="controls">
        <button @click="start" :disabled="isRunning">Start</button>
        <button @click="pause" :disabled="!isRunning || isPaused">Pause</button>
        <button @click="resume" :disabled="!isRunning || !isPaused">
          Resume
        </button>
        <button @click="reset">Reset</button>
        <button @click="stop">Stop</button>
        <button @click="destroy">Destroy</button>
      </div>
      <div class="status">{{ status }}</div>

      <div class="input-group">
        <label for="strings">Strings (one per line):</label>
        <textarea
          id="strings"
          v-model="stringsText"
          @input="updateStrings"
          placeholder="Enter strings to type, one per line..."
        ></textarea>
      </div>

      <div class="input-group">
        <label for="typeSpeed">Type Speed (ms):</label>
        <input
          type="number"
          id="typeSpeed"
          v-model.number="typeSpeed"
          @input="updateConfig"
          min="10"
          max="200"
        />
      </div>

      <div class="input-group">
        <label for="loop">Loop:</label>
        <select id="loop" v-model="loop" @change="updateConfig">
          <option :value="true">Yes</option>
          <option :value="false">No</option>
        </select>
      </div>
    </div>

    <!-- Composable-based Component -->
    <div class="example-section">
      <h3>Composable-based Component</h3>
      <div ref="composableElement" class="typed-element">
        {{ composableText }}
      </div>
      <div class="controls">
        <button @click="composableControls.start">Start</button>
        <button @click="composableControls.pause">Pause</button>
        <button @click="composableControls.resume">Resume</button>
        <button @click="composableControls.reset">Reset</button>
        <button @click="composableControls.stop">Stop</button>
      </div>
      <div class="status">Status: {{ composableStatus }}</div>

      <div class="controls">
        <button @click="addComposableString">Add String</button>
        <button @click="removeComposableString">Remove Last</button>
        <button @click="shuffleComposableStrings">Shuffle</button>
      </div>

      <div class="status">
        <p>Current strings: {{ composableStrings.length }}</p>
        <ul>
          <li v-for="(str, index) in composableStrings" :key="index">
            {{ str }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Multiple Instances Component -->
    <div class="example-section">
      <h3>Multiple Instances</h3>
      <div ref="element1" class="typed-element"></div>
      <div ref="element2" class="typed-element"></div>
      <div ref="element3" class="typed-element"></div>
      <div class="controls">
        <button @click="startAll">Start All</button>
        <button @click="pauseAll">Pause All</button>
        <button @click="resumeAll">Resume All</button>
        <button @click="stopAll">Stop All</button>
      </div>
      <div class="status">{{ multipleStatus }}</div>
    </div>

    <!-- Reactive Props Component -->
    <div class="example-section">
      <h3>Reactive Props Component</h3>
      <TypingComponent
        :strings="propsStrings"
        :type-speed="propsSpeed"
        :loop="propsLoop"
        @string-typed="onStringTyped"
        @animation-complete="onAnimationComplete"
      />

      <div class="controls">
        <button @click="updateProps">Update Props</button>
        <button @click="randomizeProps">Randomize</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
  h,
} from "vue";
import { useUltraTyped } from "@ultratyped/vue";
import UltraTyped from "ultratyped";

// Basic component state
const typedElement = ref<HTMLElement | null>(null);
const instance = ref<any>(null);
const isRunning = ref(false);
const isPaused = ref(false);
const status = ref("Ready to start");
const currentText = ref("");

// Reactive configuration
const stringsText = ref(
  "Welcome to UltraTyped.js Vue!\nComposition API integration\nReactive and responsive\nModern Vue 3 development",
);
const typeSpeed = ref(50);
const loop = ref(true);

// Computed strings array
const strings = computed(() => {
  return stringsText.value.split("\n").filter((s) => s.trim());
});

// Initialize UltraTyped instance
onMounted(async () => {
  await nextTick();
  if (typedElement.value) {
    instance.value = UltraTyped(typedElement.value, {
      strings: strings.value,
      typeSpeed: typeSpeed.value,
      backSpeed: 30,
      backDelay: 1000,
      loop: loop.value,
      showCursor: true,
      cursorChar: "|",

      onBegin: () => {
        isRunning.value = true;
        isPaused.value = false;
        status.value = "Animation began";
      },
      onComplete: () => {
        status.value = "All strings completed!";
      },
      preStringTyped: (arrayPos: number, self: any) => {
        currentText.value = self.strings[arrayPos];
      },
      onStringTyped: (arrayPos: number) => {
        status.value = `Finished typing string ${arrayPos + 1}`;
      },
      onTypingPaused: () => {
        isPaused.value = true;
        status.value = "Animation paused";
      },
      onTypingResumed: () => {
        isPaused.value = false;
        status.value = "Animation resumed";
      },
      onStop: () => {
        isRunning.value = false;
        isPaused.value = false;
        status.value = "Animation stopped";
      },
      onDestroy: () => {
        isRunning.value = false;
        isPaused.value = false;
        status.value = "Animation destroyed";
      },
    });
  }
});

// Cleanup on unmount
onBeforeUnmount(() => {
  if (instance.value) {
    instance.value.destroy();
    instance.value = null;
  }
});

// Control methods
const start = () => {
  if (instance.value) {
    instance.value.start();
  }
};

const pause = () => {
  if (instance.value) {
    instance.value.pause();
  }
};

const resume = () => {
  if (instance.value) {
    instance.value.resume();
  }
};

const reset = () => {
  if (instance.value) {
    instance.value.reset();
  }
};

const stop = () => {
  if (instance.value) {
    instance.value.stop();
  }
};

const destroy = () => {
  if (instance.value) {
    instance.value.destroy();
    instance.value = null;
  }
};

// Update configuration
const updateStrings = () => {
  if (instance.value) {
    instance.value.strings = strings.value;
    instance.value.reset();
  }
};

const updateConfig = () => {
  if (instance.value) {
    instance.value.typeSpeed = typeSpeed.value;
    instance.value.loop = loop.value;
  }
};

// Composable-based component
const composableElement = ref<HTMLElement | null>(null);
const composableText = ref("");
const composableStatus = ref("idle");
const composableStrings = ref([
  "Composable approach",
  "Cleaner component code",
  "Reusable logic",
  "TypeScript support",
]);

// Custom composable for UltraTyped
function useUltraTypedCustom(element: Ref<HTMLElement | null>, options: any) {
  const instance = ref<any>(null);
  const status = ref("idle");

  onMounted(async () => {
    await nextTick();
    if (element.value && !instance.value) {
      instance.value = UltraTyped(element.value, {
        ...options,
        onBegin: () => {
          status.value = "running";
          options.onBegin?.();
        },
        onComplete: () => {
          status.value = "completed";
          options.onComplete?.();
        },
        onStop: () => {
          status.value = "stopped";
          options.onStop?.();
        },
        onDestroy: () => {
          status.value = "destroyed";
          options.onDestroy?.();
        },
        preStringTyped: (arrayPos: number, self: any) => {
          composableText.value = self.strings[arrayPos];
        },
      });
    }
  });

  onBeforeUnmount(() => {
    if (instance.value) {
      instance.value.destroy();
      instance.value = null;
    }
  });

  const controls = reactive({
    start: () => instance.value?.start(),
    pause: () => instance.value?.pause(),
    resume: () => instance.value?.resume(),
    reset: () => instance.value?.reset(),
    stop: () => instance.value?.stop(),
  });

  return { status, controls };
}

// Use the composable
const { status: composableStatus, controls: composableControls } =
  useUltraTypedCustom(composableElement, {
    strings: composableStrings,
    typeSpeed: 45,
    backSpeed: 25,
    loop: true,
    showCursor: true,
    cursorChar: "▋",
  });

// Update composable when strings change
watch(
  composableStrings,
  () => {
    if (composableElement.value) {
      const instance = (composableElement.value as any)._ultraTyped;
      if (instance) {
        instance.strings = composableStrings.value;
        instance.reset();
      }
    }
  },
  { deep: true },
);

// Composable control methods
const addComposableString = () => {
  composableStrings.value.push(
    `Composable string #${composableStrings.value.length + 1}`,
  );
};

const removeComposableString = () => {
  if (composableStrings.value.length > 1) {
    composableStrings.value.pop();
  }
};

const shuffleComposableStrings = () => {
  composableStrings.value = [...composableStrings.value].sort(
    () => Math.random() - 0.5,
  );
};

// Multiple instances
const element1 = ref<HTMLElement | null>(null);
const element2 = ref<HTMLElement | null>(null);
const element3 = ref<HTMLElement | null>(null);
const instances = ref<any[]>([]);
const multipleStatus = ref("Ready to start");

onMounted(async () => {
  await nextTick();
  instances.value = [
    element1.value
      ? UltraTyped(element1.value, {
          strings: [
            "Instance 1 - String 1",
            "Instance 1 - String 2",
            "Instance 1 - String 3",
          ],
          typeSpeed: 40,
          backSpeed: 20,
          loop: true,
          showCursor: true,
          cursorChar: "▋",
        })
      : null,
    element2.value
      ? UltraTyped(element2.value, {
          strings: [
            "Instance 2 - String 1",
            "Instance 2 - String 2",
            "Instance 2 - String 3",
          ],
          typeSpeed: 50,
          backSpeed: 25,
          loop: true,
          showCursor: true,
          cursorChar: "▌",
        })
      : null,
    element3.value
      ? UltraTyped(element3.value, {
          strings: [
            "Instance 3 - String 1",
            "Instance 3 - String 2",
            "Instance 3 - String 3",
          ],
          typeSpeed: 60,
          backSpeed: 30,
          loop: true,
          showCursor: true,
          cursorChar: "▐",
        })
      : null,
  ].filter(Boolean);
});

onBeforeUnmount(() => {
  instances.value.forEach((instance) => {
    if (instance) {
      instance.destroy();
    }
  });
  instances.value = [];
});

// Multiple instances control
const startAll = () => {
  instances.value.forEach((instance) => instance?.start());
  multipleStatus.value = "All instances started";
};

const pauseAll = () => {
  instances.value.forEach((instance) => instance?.pause());
  multipleStatus.value = "All instances paused";
};

const resumeAll = () => {
  instances.value.forEach((instance) => instance?.resume());
  multipleStatus.value = "All instances resumed";
};

const stopAll = () => {
  instances.value.forEach((instance) => instance?.stop());
  multipleStatus.value = "All instances stopped";
};

// Reactive props component
const propsStrings = ref([
  "Props string 1",
  "Props string 2",
  "Props string 3",
]);
const propsSpeed = ref(55);
const propsLoop = ref(true);

const onStringTyped = (arrayPos: number) => {
  console.log(`String ${arrayPos + 1} typed in props component`);
};

const onAnimationComplete = () => {
  console.log("Animation completed in props component");
};

const updateProps = () => {
  propsStrings.value = [
    `Updated string 1`,
    `Updated string 2`,
    `Updated string 3`,
  ];
  propsSpeed.value = 65;
  propsLoop.value = false;
};

const randomizeProps = () => {
  propsStrings.value = [
    `Random string ${Math.floor(Math.random() * 100)}`,
    `Random string ${Math.floor(Math.random() * 100)}`,
    `Random string ${Math.floor(Math.random() * 100)}`,
  ];
  propsSpeed.value = Math.floor(Math.random() * 100) + 20;
  propsLoop.value = Math.random() > 0.5;
};

// Child component for props demonstration
const TypingComponent = {
  props: {
    strings: Array,
    typeSpeed: Number,
    loop: Boolean,
  },
  emits: ["string-typed", "animation-complete"],
  setup(props: any, { emit }: any) {
    const element = ref<HTMLElement | null>(null);
    const instance = ref<any>(null);

    onMounted(async () => {
      await nextTick();
      if (element.value) {
        instance.value = UltraTyped(element.value, {
          strings: props.strings,
          typeSpeed: props.typeSpeed,
          loop: props.loop,
          showCursor: true,
          cursorChar: "◉",
          onStringTyped: (arrayPos: number) => {
            emit("string-typed", arrayPos);
          },
          onComplete: () => {
            emit("animation-complete");
          },
        });
      }
    });

    onBeforeUnmount(() => {
      if (instance.value) {
        instance.value.destroy();
      }
    });

    watch(
      () => props.strings,
      (newStrings) => {
        if (instance.value) {
          instance.value.strings = newStrings;
          instance.value.reset();
        }
      },
      { deep: true },
    );

    watch(
      () => props.typeSpeed,
      (newSpeed) => {
        if (instance.value) {
          instance.value.typeSpeed = newSpeed;
        }
      },
    );

    watch(
      () => props.loop,
      (newLoop) => {
        if (instance.value) {
          instance.value.loop = newLoop;
        }
      },
    );

    return () => h("div", { ref: element, class: "typed-element" });
  },
};
</script>

<style scoped>
.container {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.example-section {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

h3 {
  margin-bottom: 15px;
}

.typed-element {
  min-height: 40px;
  margin: 20px 0;
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
}

.input-group {
  margin: 15px 0;
}

label {
  display: block;
  margin-bottom: 5px;
}

input,
select,
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

textarea {
  height: 80px;
  resize: vertical;
}

ul {
  margin: 10px 0;
  padding-left: 20px;
}

li {
  margin: 5px 0;
}
</style>
