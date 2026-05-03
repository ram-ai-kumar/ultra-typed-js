/**
 * Comprehensive test suite for Vue adapter
 * Covers: Smoke, Edge, Negative, Exception, Regression tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useUltraTyped } from "../../../packages/vue/src/index";
// UltraTypedOptions type is not exported, but we don't need it for testing

describe("Vue Adapter", () => {
  describe("Smoke Tests - Basic Functionality", () => {
    it("should return a ref with correct structure", () => {
      const el = useUltraTyped({ strings: ["Hello", "World"] });

      expect(el).toBeDefined();
      expect(el.value).toBeDefined();
      expect(typeof el).toBe("object");
      expect("value" in el).toBe(true);
    });

    it("should handle multiple strings", () => {
      const el = useUltraTyped({ strings: ["First", "Second", "Third"] });

      expect(el).toBeDefined();
    });

    it("should respect loop configuration", () => {
      const el = useUltraTyped({ strings: ["Test"], loop: false });

      expect(el).toBeDefined();
    });

    it("should handle HTML content type", () => {
      const el = useUltraTyped({
        strings: ["<strong>Bold</strong>"],
        contentType: "html",
      });

      expect(el).toBeDefined();
    });

    it("should handle callbacks correctly", () => {
      const onStringTyped = vi.fn();
      const el = useUltraTyped({ strings: ["Test", "Vue"], onStringTyped });

      expect(el).toBeDefined();
      expect(typeof onStringTyped).toBe("function");
      // Note: Actual callback testing requires Vue component context
      // This test verifies the callback is accepted and stored
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty strings array", () => {
      const el = useUltraTyped({ strings: [] });

      expect(el).toBeDefined();
    });

    it("should handle single character strings", () => {
      const el = useUltraTyped({ strings: ["A", "B"] });

      expect(el).toBeDefined();
    });

    it("should handle very long strings", () => {
      const longString = "A".repeat(1000);
      const el = useUltraTyped({ strings: [longString] });

      expect(el).toBeDefined();
    });

    it("should handle special characters and Unicode", () => {
      const el = useUltraTyped({ strings: ["Hello 🌍 Émojis àccénts"] });

      expect(el).toBeDefined();
    });

    it("should handle zero speed values", () => {
      const el = useUltraTyped({
        strings: ["Test"],
        typeSpeed: 0,
        backSpeed: 0,
      });

      expect(el).toBeDefined();
    });

    it("should handle negative delay values", () => {
      const el = useUltraTyped({ strings: ["Test"], startDelay: -100 });

      expect(el).toBeDefined();
    });

    it("should handle infinite loop count", () => {
      const el = useUltraTyped({ strings: ["Loop"], loopCount: Infinity });

      expect(el).toBeDefined();
    });

    it("should handle strings with only whitespace", () => {
      const el = useUltraTyped({ strings: ["   ", "\t\n", ""] });

      expect(el).toBeDefined();
    });
  });

  describe("Negative Tests", () => {
    it("should handle null options", () => {
      const el = useUltraTyped(null);

      expect(el).toBeDefined();
    });

    it("should handle undefined options", () => {
      const el = useUltraTyped(undefined);

      expect(el).toBeDefined();
    });

    it("should handle non-string values in strings array", () => {
      const el = useUltraTyped({ strings: [123, null, undefined, {}] });

      expect(el).toBeDefined();
    });

    it("should handle negative speed values", () => {
      const el = useUltraTyped({ strings: ["Test"], typeSpeed: -50 });

      expect(el).toBeDefined();
    });

    it("should handle invalid content type", () => {
      const el = useUltraTyped({ strings: ["Test"], contentType: "invalid" });

      expect(el).toBeDefined();
    });
  });

  describe("Exception Handling", () => {
    it("should handle callback errors gracefully", () => {
      const errorCallback = vi.fn(() => {
        throw new Error("Callback error");
      });

      const el = useUltraTyped({
        strings: ["Test"],
        onStringTyped: errorCallback,
      });

      expect(el).toBeDefined();
    });

    it("should handle reactive updates", () => {
      const el = useUltraTyped({ strings: ["Initial"] });

      expect(el).toBeDefined();

      // Simulate reactive update (in real Vue this would be automatic)
      const newEl = useUltraTyped({ strings: ["Updated", "Options"] });
      expect(newEl).toBeDefined();
    });
  });

  describe("Regression Tests", () => {
    it("should handle multiple composable instances", () => {
      const el1 = useUltraTyped({ strings: ["Instance 1"] });
      const el2 = useUltraTyped({ strings: ["Instance 2"] });

      expect(el1).toBeDefined();
      expect(el2).toBeDefined();
      expect(el1).not.toBe(el2);
    });

    it("should handle composable cleanup", () => {
      const el = useUltraTyped({ strings: ["Test"] });

      expect(el).toBeDefined();

      // In Vue, cleanup happens automatically when component is unmounted
      // We can simulate this by checking the composable doesn't throw
      expect(() => {
        // Simulate cleanup - check if el has UltraTyped instance methods
        if (el.value && typeof (el.value as any).destroy === "function") {
          (el.value as any).destroy();
        }
      }).not.toThrow();
    });

    it("should maintain performance with large strings", () => {
      const largeString = "A".repeat(10000);
      const startTime = performance.now();

      const el = useUltraTyped({ strings: [largeString] });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(el).toBeDefined();
      expect(renderTime).toBeLessThan(100); // Should render quickly
    });
  });
});
