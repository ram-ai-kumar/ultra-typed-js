import { useEffect, useRef } from 'preact/hooks';
import UltraTyped from 'ultratyped';

export interface UltraTypedOptions {
  strings: string[];
  typeSpeed?: number;
  backSpeed?: number;
  backDelay?: number;
  loop?: boolean;
}

export function useUltraTyped(options: UltraTypedOptions) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const instance = UltraTyped(ref.current, options);
    return () => instance.stop();
  }, []);

  return ref;
}
