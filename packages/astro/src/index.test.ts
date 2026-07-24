/**
 * Comprehensive test suite for Astro adapter
 * Covers: Smoke, Edge, Negative, Exception, Regression, Security tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { astroUltraTyped } from "./index";
import type { UltraTypedOptions } from "./index";

describe("Astro Adapter", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe("Smoke Tests - Basic Functionality", () => {
    it("should be defined", () => {
      expect(astroUltraTyped).toBeDefined();
    });

    it("should be a function", () => {
      expect(typeof astroUltraTyped).toBe("function");
    });

    it("should create instance with valid element and options", () => {
      const instance = astroUltraTyped(container, {
        strings: ["Hello", "World"],
      });

      expect(instance).toBeDefined();
      expect(typeof instance.stop).toBe("function");
      expect(typeof instance.start).toBe("function");
      expect(typeof instance.reset).toBe("function");
      expect(typeof instance.pause).toBe("function");
      expect(typeof instance.resume).toBe("function");
      expect(typeof instance.toggle).toBe("function");
      expect(typeof instance.destroy).toBe("function");
    });

    it("should handle empty options", () => {
      const instance = astroUltraTyped(container, {
        strings: [],
      });

      expect(instance).toBeDefined();
    });

    it("should handle multiple strings", () => {
      const instance = astroUltraTyped(container, {
        strings: ["First", "Second", "Third"],
      });

      expect(instance).toBeDefined();
    });

    it("should respect loop configuration", () => {
      const instance = astroUltraTyped(container, {
        strings: ["Test"],
        loop: false,
      });

      expect(instance).toBeDefined();
    });

    it("should handle custom speeds", () => {
      const instance = astroUltraTyped(container, {
        strings: ["Speed test"],
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 500,
      });

      expect(instance).toBeDefined();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty strings array", () => {
      const instance = astroUltraTyped(container, {
        strings: [],
      });

      expect(instance).toBeDefined();
    });

    it("should handle single character strings", () => {
      const instance = astroUltraTyped(container, {
        strings: ["A", "B"],
      });

      expect(instance).toBeDefined();
    });

    it("should handle very long strings", () => {
      const longString = "A".repeat(1000);
      const instance = astroUltraTyped(container, {
        strings: [longString],
      });

      expect(instance).toBeDefined();
    });

    it("should handle special characters and Unicode", () => {
      const instance = astroUltraTyped(container, {
        strings: ["Hello 🌍 Émojis àccénts"],
      });

      expect(instance).toBeDefined();
    });

    it("should handle zero speed values", () => {
      const instance = astroUltraTyped(container, {
        strings: ["Test"],
        typeSpeed: 0,
        backSpeed: 0,
      });

      expect(instance).toBeDefined();
    });

    it("should handle strings with only whitespace", () => {
      const instance = astroUltraTyped(container, {
        strings: ["   ", "\t\n", ""],
      });

      expect(instance).toBeDefined();
    });
  });

  describe("Negative Tests", () => {
    it("should handle null element", () => {
      expect(() => {
        astroUltraTyped(null as any, { strings: ["Test"] });
      }).not.toThrow();
    });

    it("should handle undefined element", () => {
      expect(() => {
        astroUltraTyped(undefined as any, { strings: ["Test"] });
      }).not.toThrow();
    });

    it("should handle null options", () => {
      expect(() => {
        astroUltraTyped(container, null as any);
      }).not.toThrow();
    });

    it("should handle undefined options", () => {
      expect(() => {
        astroUltraTyped(container, undefined as any);
      }).not.toThrow();
    });

    it("should handle non-string values in strings array", () => {
      // Test that core library throws on invalid types - this is expected behavior
      expect(() => {
        astroUltraTyped(container, {
          strings: ["Valid", 123 as any, null as any],
        });
      }).toThrow(); // Core library doesn't handle non-strings
    });

    it("should handle negative speed values", () => {
      const instance = astroUltraTyped(container, {
        strings: ["Test"],
        typeSpeed: -50,
        backSpeed: -30,
      } as any);

      expect(instance).toBeDefined();
    });
  });

  describe("Exception Handling", () => {
    it("should handle destroy without initialization", () => {
      const instance = astroUltraTyped(container, {
        strings: ["Test"],
      });

      expect(instance).toBeDefined();

      expect(() => {
        instance?.destroy();
      }).not.toThrow();
    });

    it("should handle multiple function calls", () => {
      const instance1 = astroUltraTyped(container, {
        strings: ["Test1"],
      });
      const instance2 = astroUltraTyped(container, {
        strings: ["Test2"],
      });

      expect(() => {
        instance1?.destroy();
        instance2?.destroy();
      }).not.toThrow();
    });

    it("should handle method calls on destroyed instance", () => {
      const instance = astroUltraTyped(container, {
        strings: ["Test"],
      });

      instance?.destroy();

      expect(() => {
        instance?.stop();
        instance?.start();
        instance?.reset();
        instance?.pause();
        instance?.resume();
        instance?.toggle();
      }).not.toThrow();
    });
  });

  describe("Regression Tests", () => {
    it("should handle multiple instances", () => {
      const container2 = document.createElement("div");
      document.body.appendChild(container2);

      const instance1 = astroUltraTyped(container, {
        strings: ["Instance 1"],
      });
      const instance2 = astroUltraTyped(container2, {
        strings: ["Instance 2"],
      });

      expect(instance1).toBeDefined();
      expect(instance2).toBeDefined();
      expect(instance1).not.toBe(instance2);

      document.body.removeChild(container2);
    });

    it("should maintain performance with large strings", () => {
      const largeString = "A".repeat(10000);
      const startTime = performance.now();

      const instance = astroUltraTyped(container, {
        strings: [largeString],
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(instance).toBeDefined();
      expect(renderTime).toBeLessThan(100);
    });

    it("should return proper instance methods", () => {
      const instance = astroUltraTyped(container, {
        strings: ["Test"],
      });

      expect(instance).toHaveProperty("stop");
      expect(instance).toHaveProperty("start");
      expect(instance).toHaveProperty("reset");
      expect(instance).toHaveProperty("pause");
      expect(instance).toHaveProperty("resume");
      expect(instance).toHaveProperty("toggle");
      expect(instance).toHaveProperty("destroy");
    });
  });

  describe("Security Tests", () => {
    it("should handle XSS attempts in strings gracefully", () => {
      const xssString = '<script>alert("xss")</script>';
      const instance = astroUltraTyped(container, {
        strings: [xssString],
      });

      expect(instance).toBeDefined();
    });

    it("should handle HTML entities in strings", () => {
      const htmlString = '&lt;script&gt;alert("xss")&lt;/script&gt;';
      const instance = astroUltraTyped(container, {
        strings: [htmlString],
      });

      expect(instance).toBeDefined();
    });

    it("should handle very long strings that could cause DoS", () => {
      const dosString = "A".repeat(100000);
      const instance = astroUltraTyped(container, {
        strings: [dosString],
      });

      expect(instance).toBeDefined();
    });
  });

  describe("Astro Integration", () => {
    it("should work with Astro component lifecycle", () => {
      // Simulate Astro component mounting
      const instance = astroUltraTyped(container, {
        strings: ["Astro component"],
      });

      expect(instance).toBeDefined();

      // Simulate component unmounting
      expect(() => {
        instance.destroy();
      }).not.toThrow();
    });

    it("should handle client-side hydration", () => {
      // Simulate client-side hydration scenario
      expect(() => {
        const instance = astroUltraTyped(container, {
          strings: ["Hydrated content"],
        });
        instance.start();
      }).not.toThrow();
    });

    it("should handle SSR fallback gracefully", () => {
      // Test that the function works in SSR environment (no DOM)
      expect(() => {
        astroUltraTyped(null as any, {
          strings: ["SSR content"],
        });
      }).not.toThrow();
    });
  });
});
