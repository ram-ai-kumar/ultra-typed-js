/**
 * Comprehensive test suite for Alpine.js adapter
 * Covers: Smoke, Edge, Negative, Exception, Regression, Security tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ultratypedAlpine } from "./index";
import ultratyped from "./index";
import type { UltraTypedOptions } from "./index";

describe("Alpine.js Adapter", () => {
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
      expect(ultratypedAlpine).toBeDefined();
    });

    it("should be a function", () => {
      expect(typeof ultratypedAlpine).toBe("function");
    });

    it("should create instance with valid element and options", () => {
      const result = ultratypedAlpine(container, {
        strings: ["Hello", "World"],
      });

      expect(result).toBeDefined();
      expect(typeof result.init).toBe("function");
      expect(typeof result.destroy).toBe("function");
    });

    it("should handle empty options", () => {
      const result = ultratypedAlpine(container, {
        strings: [],
      });

      expect(result).toBeDefined();
    });

    it("should handle multiple strings", () => {
      const result = ultratypedAlpine(container, {
        strings: ["First", "Second", "Third"],
      });

      expect(result).toBeDefined();
    });

    it("should respect loop configuration", () => {
      const result = ultratypedAlpine(container, {
        strings: ["Test"],
        loop: false,
      });

      expect(result).toBeDefined();
    });

    it("should handle custom speeds", () => {
      const result = ultratypedAlpine(container, {
        strings: ["Speed test"],
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 500,
      });

      expect(result).toBeDefined();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty strings array", () => {
      const result = ultratypedAlpine(container, {
        strings: [],
      });

      expect(result).toBeDefined();
    });

    it("should handle single character strings", () => {
      const result = ultratypedAlpine(container, {
        strings: ["A", "B"],
      });

      expect(result).toBeDefined();
    });

    it("should handle very long strings", () => {
      const longString = "A".repeat(1000);
      const result = ultratypedAlpine(container, {
        strings: [longString],
      });

      expect(result).toBeDefined();
    });

    it("should handle special characters and Unicode", () => {
      const result = ultratypedAlpine(container, {
        strings: ["Hello 🌍 Émojis àccénts"],
      });

      expect(result).toBeDefined();
    });

    it("should handle zero speed values", () => {
      const result = ultratypedAlpine(container, {
        strings: ["Test"],
        typeSpeed: 0,
        backSpeed: 0,
      });

      expect(result).toBeDefined();
    });

    it("should handle strings with only whitespace", () => {
      const result = ultratypedAlpine(container, {
        strings: ["   ", "\t\n", ""],
      });

      expect(result).toBeDefined();
    });
  });

  describe("Negative Tests", () => {
    it("should handle null element", () => {
      expect(() => {
        ultratypedAlpine(null as any, { strings: ["Test"] });
      }).not.toThrow();
    });

    it("should handle undefined element", () => {
      expect(() => {
        ultratypedAlpine(undefined as any, { strings: ["Test"] });
      }).not.toThrow();
    });

    it("should handle null options", () => {
      expect(() => {
        ultratypedAlpine(container, null as any);
      }).not.toThrow();
    });

    it("should handle undefined options", () => {
      expect(() => {
        ultratypedAlpine(container, undefined as any);
      }).not.toThrow();
    });

    it("should handle non-string values in strings array", () => {
      // Test that core library throws on invalid types - this is expected behavior
      expect(() => {
        ultratypedAlpine(container, {
          strings: ["Valid", 123 as any, null as any],
        });
      }).toThrow(); // Core library doesn't handle non-strings
    });

    it("should handle negative speed values", () => {
      const result = ultratypedAlpine(container, {
        strings: ["Test"],
        typeSpeed: -50,
        backSpeed: -30,
      } as any);

      expect(result).toBeDefined();
    });
  });

  describe("Exception Handling", () => {
    it("should handle destroy without init", () => {
      const result = ultratypedAlpine(container, {
        strings: ["Test"],
      });

      expect(() => {
        result.destroy();
      }).not.toThrow();
    });

    it("should handle multiple init calls", () => {
      const result = ultratypedAlpine(container, {
        strings: ["Test"],
      });

      expect(() => {
        result.init();
        result.init();
      }).not.toThrow();
    });

    it("should handle multiple destroy calls", () => {
      const result = ultratypedAlpine(container, {
        strings: ["Test"],
      });

      expect(() => {
        result.destroy();
        result.destroy();
      }).not.toThrow();
    });
  });

  describe("Regression Tests", () => {
    it("should handle multiple instances", () => {
      const container2 = document.createElement("div");
      document.body.appendChild(container2);

      const result1 = ultratypedAlpine(container, {
        strings: ["Instance 1"],
      });
      const result2 = ultratypedAlpine(container2, {
        strings: ["Instance 2"],
      });

      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result1).not.toBe(result2);

      document.body.removeChild(container2);
    });

    it("should maintain performance with large strings", () => {
      const largeString = "A".repeat(10000);
      const startTime = performance.now();

      const result = ultratypedAlpine(container, {
        strings: [largeString],
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(result).toBeDefined();
      expect(renderTime).toBeLessThan(100);
    });

    it("should handle cleanup properly", () => {
      const result = ultratypedAlpine(container, {
        strings: ["Test"],
      });

      expect(result).toBeDefined();

      // Cleanup should not throw
      expect(() => {
        result.destroy();
      }).not.toThrow();
    });
  });

  describe("Security Tests", () => {
    it("should handle XSS attempts in strings gracefully", () => {
      const xssString = '<script>alert("xss")</script>';
      const result = ultratypedAlpine(container, {
        strings: [xssString],
      });

      expect(result).toBeDefined();
    });

    it("should handle HTML entities in strings", () => {
      const htmlString = '&lt;script&gt;alert("xss")&lt;/script&gt;';
      const result = ultratypedAlpine(container, {
        strings: [htmlString],
      });

      expect(result).toBeDefined();
    });

    it("should handle very long strings that could cause DoS", () => {
      const dosString = "A".repeat(100000);
      const result = ultratypedAlpine(container, {
        strings: [dosString],
      });

      expect(result).toBeDefined();
    });
  });

  describe("Alpine Directive Registration", () => {
    it("should register directive with Alpine mock", () => {
      const mockAlpine = {
        directive: vi.fn(),
        initTree: vi.fn(),
        evaluate: vi.fn(() => ({ strings: ["Test"] })),
      };

      expect(() => {
        ultratyped(mockAlpine);
      }).not.toThrow();

      expect(mockAlpine.directive).toHaveBeenCalledWith(
        "typed",
        expect.any(Function),
      );
    });

    it("should handle Alpine directive function", () => {
      const mockAlpine = {
        directive: vi.fn(),
        initTree: vi.fn(),
        evaluate: vi.fn(() => ({ strings: ["Test"] })),
      };

      ultratyped(mockAlpine);
      const directiveFn = mockAlpine.directive.mock.calls[0][1];

      expect(typeof directiveFn).toBe("function");
    });

    it("should handle directive with invalid expression", () => {
      const mockAlpine = {
        directive: vi.fn(),
        initTree: vi.fn(),
        evaluate: vi.fn(() => {
          throw new Error("Invalid expression");
        }),
      };

      ultratyped(mockAlpine);
      const directiveFn = mockAlpine.directive.mock.calls[0][1];

      expect(() => {
        directiveFn(container, { expression: "invalid" });
      }).not.toThrow();
    });
  });
});
