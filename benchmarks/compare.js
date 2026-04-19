import UltraTyped from '../packages/core/dist/index.mjs';

// Mock element for benchmarking
const el = { innerHTML: '' };

const strings = Array.from({ length: 10 }, (_, i) =>
  `String ${i} with some length and content to type`
);

const start = performance.now();
let frames = 0;

const instance = UltraTyped(el, { strings });

function loop(t) {
  frames++;
  if (t - start < 5000) {
    requestAnimationFrame(loop);
  } else {
    const fps = frames / 5;
    const result = {
      fps,
      timestamp: new Date().toISOString()
    };
    console.log(JSON.stringify(result, null, 2));
    
    // Write results
    import('fs').then(fs => {
      fs.writeFileSync(
        './benchmarks/results.json',
        JSON.stringify(result, null, 2)
      );
    });
    
    instance.stop();
  }
}

requestAnimationFrame(loop);
