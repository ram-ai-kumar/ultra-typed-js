import UltraTyped from 'ultratyped';

export interface UltraTypedOptions {
  strings: string[];
  typeSpeed?: number;
  backSpeed?: number;
  backDelay?: number;
  loop?: boolean;
}

export function ultratypedAlpine(el: HTMLElement, options: UltraTypedOptions) {
  let instance: ReturnType<typeof UltraTyped> | null = null;
  
  const init = () => {
    instance = UltraTyped(el, options);
  };
  
  const destroy = () => {
    instance?.stop();
  };
  
  init();
  
  return { init, destroy };
}

// Alpine.js directive registration
export default function ultratyped(Alpine: any) {
  Alpine.directive('typed', (el: HTMLElement, { expression }: any) => {
    let instance: ReturnType<typeof UltraTyped> | null = null;
    
    const init = () => {
      const options = Alpine.evaluate(el, expression);
      instance = UltraTyped(el, options);
    };
    
    const destroy = () => {
      instance?.stop();
    };
    
    Alpine.initTree(el, init);
    
    return { init, destroy };
  });
}
