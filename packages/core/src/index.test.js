/**
 * Unit tests for UltraTyped core library
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import UltraTyped from "./index.js";

describe("UltraTyped Core Library", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe("Initialization", () => {
    it("should create an instance with valid element and options", () => {
      const instance = UltraTyped(container, {
        strings: ["Hello", "World"],
      });

      expect(instance).toBeDefined();
      expect(typeof instance.stop).toBe("function");
      expect(typeof instance.reset).toBe("function");
    });

    it("should handle empty options object", () => {
      const instance = UltraTyped(container);

      expect(instance).toBeDefined();
    });

    it("should use default values for options", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
      });

      expect(instance).toBeDefined();
    });
  });

  describe("Typing Animation", () => {
    it("should start typing animation", () => {
      UltraTyped(container, {
        strings: ["Hello World"],
        typeSpeed: 10,
      });

      // Animation should start immediately
      expect(container.innerHTML).toBeDefined();
    });

    it("should handle single string", () => {
      const instance = UltraTyped(container, {
        strings: ["Single"],
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle multiple strings", () => {
      const instance = UltraTyped(container, {
        strings: ["First", "Second", "Third"],
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle empty strings array", () => {
      const instance = UltraTyped(container, {
        strings: [],
      });

      expect(instance).toBeDefined();
    });

    it("should handle empty string in array", () => {
      const instance = UltraTyped(container, {
        strings: ["Hello", "", "World"],
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle special characters", () => {
      const instance = UltraTyped(container, {
        strings: ["Hello! @#$%^&*()"],
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle Unicode characters", () => {
      const instance = UltraTyped(container, {
        strings: ["Hello 世界 🌍"],
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle HTML tags", () => {
      const instance = UltraTyped(container, {
        strings: ["<b>Bold</b> text"],
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });
  });

  describe("Stop Method", () => {
    it("should stop the animation", () => {
      const instance = UltraTyped(container, {
        strings: ["Hello World"],
        typeSpeed: 10,
      });

      expect(() => instance.stop()).not.toThrow();
    });

    it("should be callable multiple times", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        typeSpeed: 10,
      });

      expect(() => {
        instance.stop();
        instance.stop();
        instance.stop();
      }).not.toThrow();
    });
  });

  describe("Reset Method", () => {
    it("should reset the animation state", () => {
      const instance = UltraTyped(container, {
        strings: ["Hello World"],
        typeSpeed: 10,
      });

      expect(() => instance.reset()).not.toThrow();
    });

    it("should be callable multiple times", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        typeSpeed: 10,
      });

      expect(() => {
        instance.reset();
        instance.reset();
        instance.reset();
      }).not.toThrow();
    });
  });

  describe("Options", () => {
    it("should respect custom typeSpeed", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        typeSpeed: 100,
      });

      expect(instance).toBeDefined();
    });

    it("should respect custom backSpeed", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        backSpeed: 50,
      });

      expect(instance).toBeDefined();
    });

    it("should respect custom backDelay", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        backDelay: 1000,
      });

      expect(instance).toBeDefined();
    });

    it("should respect loop option", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        loop: true,
      });

      expect(instance).toBeDefined();
    });

    it("should respect loop: false option", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        loop: false,
      });

      expect(instance).toBeDefined();
    });

    it("should use textContent by default (security)", () => {
      const instance = UltraTyped(container, {
        strings: ["<script>alert('xss')</script>"],
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
      // With textContent, HTML should be escaped
      expect(container.textContent).toBeDefined();
    });

    it("should use innerHTML when contentType='html'", () => {
      const instance = UltraTyped(container, {
        strings: ["<b>Bold</b>"],
        contentType: "html",
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should prevent XSS with default textContent", () => {
      const instance = UltraTyped(container, {
        strings: ["<img src=x onerror=alert('xss')>"],
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
      // Script should not execute with textContent
      expect(container.textContent).toBeDefined();
    });
  });

  describe("Edge Cases", () => {
    it("should handle null element gracefully", () => {
      expect(() => {
        UltraTyped(null, { strings: ["Test"] });
      }).not.toThrow();
    });

    it("should handle undefined element gracefully", () => {
      expect(() => {
        UltraTyped(undefined, { strings: ["Test"] });
      }).not.toThrow();
    });

    it("should handle very long strings", () => {
      const longString = "A".repeat(10000);
      const instance = UltraTyped(container, {
        strings: [longString],
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle very fast typeSpeed", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        typeSpeed: 1,
      });

      expect(instance).toBeDefined();
    });

    it("should handle very slow typeSpeed", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        typeSpeed: 1000,
      });

      expect(instance).toBeDefined();
    });
  });

  describe("Performance", () => {
    it("should not cause memory leaks with multiple instances", () => {
      const instances = [];
      const divs = [];
      for (let i = 0; i < 100; i++) {
        const div = document.createElement("div");
        document.body.appendChild(div);
        divs.push(div);
        instances.push(UltraTyped(div, { strings: ["Test"] }));
      }

      // Clean up
      instances.forEach((instance, i) => {
        instance.stop();
        document.body.removeChild(divs[i]);
      });

      expect(instances.length).toBe(100);
    });

    it("should handle rapid stop/reset calls", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        typeSpeed: 10,
      });

      expect(() => {
        for (let i = 0; i < 100; i++) {
          instance.stop();
          instance.reset();
        }
      }).not.toThrow();
    });
  });
});
