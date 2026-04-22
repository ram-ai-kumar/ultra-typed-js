import { useEffect, useRef } from "react";
import UltraTyped from "ultratyped";
import type { UltraTypedOptions } from "ultratyped";

export function useUltraTyped(options: UltraTypedOptions) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const instance = UltraTyped(ref.current, options);
    return () => instance.destroy();
  }, [options]);

  return ref;
}
