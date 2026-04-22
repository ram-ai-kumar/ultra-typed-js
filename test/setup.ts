import { beforeEach, afterEach, vi } from "vitest";

// Global test setup
beforeEach(() => {
  // Reset DOM before each test
  document.body.innerHTML = "";
});

afterEach(() => {
  // Clean up after each test
  document.body.innerHTML = "";
});

// Mock performance.now for consistent timing
const originalNow = performance.now.bind(performance);
global.performance.now = () => Date.now();

// Mock window.matchMedia for Svelte adapter tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
