import UltraTyped from "../packages/core/dist/index.mjs";

const el = document.getElementById("typed");
let instance;

function startDemo() {
  instance = UltraTyped(el, {
    strings: [
      "Ultra-fast typing animation",
      "Zero dependencies",
      "< 2KB gzipped",
      "60fps smooth performance",
      "Framework agnostic",
    ],
    typeSpeed: 80,
    backSpeed: 40,
    backDelay: 1000,
    loop: true,
    showCursor: true,
  });
}

function resetDemo() {
  if (instance) {
    instance.stop();
    instance.reset();
    startDemo();
  }
}

startDemo();

window.resetDemo = resetDemo;
window.ultratypedInstance = instance;
