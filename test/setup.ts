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

// Mock Vue lifecycle hooks to prevent warnings when testing composables outside component context
const mockOnMounted = vi.fn((callback) => {
  // Execute callback immediately for testing purposes
  callback();
});

const mockOnBeforeUnmount = vi.fn((callback) => {
  // Store cleanup function for potential manual cleanup in tests
  // In real component lifecycle, this would be called on unmount
});

// Mock Vue's lifecycle hooks
vi.mock("vue", async () => {
  const actual = await vi.importActual("vue");
  return {
    ...actual,
    onMounted: mockOnMounted,
    onBeforeUnmount: mockOnBeforeUnmount,
  };
});
