import UltraTyped from "../packages/core/dist/index.mjs";

const output = document.getElementById("typed-output");
const controls = document.getElementById("tag-controls");
const buttons = controls.querySelectorAll("button[data-tag]");

let instance;
let currentTag = "h1";

const options = {
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
};

const tagStyles = {
  h1: "text-3xl font-bold",
  h2: "text-2xl font-semibold",
  h3: "text-xl font-medium",
  p: "text-base",
};

function createTypedElement(tag) {
  output.innerHTML = "";
  const el = document.createElement(tag);
  el.id = "typed";
  el.className = `typed-text ${tagStyles[tag]}`;
  output.appendChild(el);
  return el;
}

function setActiveTag(tag) {
  currentTag = tag;
  buttons.forEach((btn) => {
    const active = btn.dataset.tag === tag;
    btn.setAttribute("aria-pressed", active ? "true" : "false");
    if (active) {
      btn.classList.remove(
        "bg-transparent",
        "text-gray-600",
        "hover:bg-white",
        "hover:shadow-sm",
      );
      btn.classList.add("bg-gray-900", "text-white", "shadow-sm");
    } else {
      btn.classList.remove("bg-gray-900", "text-white", "shadow-sm");
      btn.classList.add(
        "bg-transparent",
        "text-gray-600",
        "hover:bg-white",
        "hover:shadow-sm",
      );
    }
  });
}

function startDemo(tag = "h1") {
  if (instance) {
    instance.destroy();
  }
  setActiveTag(tag);
  const el = createTypedElement(tag);
  instance = UltraTyped(el, options);
  window.ultratypedInstance = instance;
}

function resetDemo() {
  startDemo(currentTag);
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => startDemo(btn.dataset.tag));
});

startDemo("h1");

window.resetDemo = resetDemo;
