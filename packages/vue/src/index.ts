import { onMounted, onBeforeUnmount, ref } from "vue";
import UltraTyped from "ultratyped";
import type { UltraTypedOptions } from "ultratyped";

export function useUltraTyped(options: UltraTypedOptions) {
  const el = ref<HTMLElement | null>(null);
  let instance: ReturnType<typeof UltraTyped> | null = null;

  onMounted(() => {
    if (el.value) {
      instance = UltraTyped(el.value, options);
    }
  });

  onBeforeUnmount(() => {
    instance?.stop();
  });

  return el;
}
