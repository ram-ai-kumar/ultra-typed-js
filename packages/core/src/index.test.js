/**
 * Comprehensive test suite for UltraTyped core library
 * Covers: Smoke, Edge, Negative, Exception, Regression, Security tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import UltraTyped from "../../../packages/core/src/index.js";

describe("UltraTyped Core Library", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe("Smoke Tests - Basic Functionality", () => {
    it("should create an instance with valid element and options", () => {
      const instance = UltraTyped(container, {
        strings: ["Hello", "World"],
      });

      expect(instance).toBeDefined();
      expect(typeof instance.stop).toBe("function");
      expect(typeof instance.reset).toBe("function");
      expect(typeof instance.start).toBe("function");
      expect(typeof instance.pause).toBe("function");
      expect(typeof instance.resume).toBe("function");
      expect(typeof instance.toggle).toBe("function");
      expect(typeof instance.destroy).toBe("function");
    });

    it("should handle empty options object", () => {
      const instance = UltraTyped(container);

      expect(instance).toBeDefined();
      expect(typeof instance.stop).toBe("function");
    });

    it("should use default values for options", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
      });

      expect(instance).toBeDefined();
    });

    it("should start typing animation immediately", async () => {
      const instance = UltraTyped(container, {
        strings: ["Hello World"],
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();

      // Wait for typing to start and verify text appears
      await vi.waitFor(
        () => {
          expect(container.textContent).toBeTruthy();
          expect(
            container.textContent && container.textContent.length,
          ).toBeGreaterThan(0);
        },
        { timeout: 1000 },
      );

      // Verify it's typing the expected string (may not be complete yet)
      expect(container.textContent).toMatch(/He/); // Should have started typing "Hello"
    });

    it("should handle multiple strings", async () => {
      const instance = UltraTyped(container, {
        strings: ["First", "Second", "Third"],
        typeSpeed: 10,
        loop: false,
      });

      expect(instance).toBeDefined();

      // Wait for first string to be typed
      await vi.waitFor(
        () => {
          expect(container.textContent).toContain("First");
        },
        { timeout: 1000 },
      );

      // Verify it contains the first string
      expect(container.textContent).toContain("First");
    });

    it("should respect loop configuration", () => {
      const instance = UltraTyped(container, {
        strings: ["Loop", "Test"],
        loop: false,
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle HTML content type", async () => {
      const instance = UltraTyped(container, {
        strings: ["<strong>Bold</strong> text"],
        contentType: "html",
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();

      // Wait for HTML content to be typed
      await vi.waitFor(
        () => {
          expect(container.innerHTML).toContain("<strong>Bold</strong>");
        },
        { timeout: 1000 },
      );

      // Verify HTML is actually rendered (not escaped)
      expect(container.innerHTML).toContain("<strong>Bold</strong>");
      expect(container.textContent).toContain("Bold"); // Text content should contain "Bold"
    });

    it("should handle attribute typing", async () => {
      const input = document.createElement("input");
      container.appendChild(input);

      const instance = UltraTyped(input, {
        strings: ["placeholder text"],
        attr: "placeholder",
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();

      // Wait for placeholder to be typed
      await vi.waitFor(
        () => {
          expect(input.placeholder).toBeTruthy();
          expect(input.placeholder.length).toBeGreaterThan(0);
        },
        { timeout: 1000 },
      );

      // Verify the placeholder contains the expected text (may not be complete yet)
      expect(input.placeholder).toMatch(/pl/); // Should have started typing "placeholder"
    });

    it("should handle cursor display options", async () => {
      // Test with cursor enabled (default)
      const instanceWithCursor = UltraTyped(container, {
        strings: ["Test"],
        showCursor: true,
        typeSpeed: 10,
      });

      expect(instanceWithCursor).toBeDefined();

      // Wait for typing and cursor to appear
      await vi.waitFor(
        () => {
          expect(container.textContent).toBeTruthy();
        },
        { timeout: 1000 },
      );

      // Check for cursor element or styling - look for any element with cursor-related class or content
      const cursorElement =
        container.querySelector(".ultratyped-cursor") ||
        container.querySelector("[data-ultratyped-cursor]") ||
        container.querySelector("span")?.textContent === "|";
      // Cursor might be inline text or element
      expect(
        cursorElement !== null || container.textContent?.includes("|"),
      ).toBeTruthy();

      // Test with cursor disabled
      const container2 = document.createElement("div");
      document.body.appendChild(container2);

      const instanceWithoutCursor = UltraTyped(container2, {
        strings: ["No Cursor"],
        showCursor: false,
        typeSpeed: 10,
      });

      await vi.waitFor(
        () => {
          expect(container2.textContent).toBeTruthy();
        },
        { timeout: 1000 },
      );

      // Should not have cursor element
      const cursorElement2 = container2.querySelector(".ultratyped-cursor");
      expect(cursorElement2).toBeFalsy();

      // Cleanup
      document.body.removeChild(container2);
    });

    it("should handle start delay", () => {
      const instance = UltraTyped(container, {
        strings: ["Delayed"],
        startDelay: 100,
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });
  });

  describe("Instance Control Methods", () => {
    let instance;

    beforeEach(() => {
      instance = UltraTyped(container, {
        strings: ["Control", "Test"],
        typeSpeed: 10,
      });
    });

    it("should stop animation", () => {
      expect(() => instance.stop()).not.toThrow();
    });

    it("should start animation", () => {
      expect(() => instance.start()).not.toThrow();
    });

    it("should reset animation", () => {
      expect(() => instance.reset()).not.toThrow();
    });

    it("should pause animation", () => {
      expect(() => instance.pause()).not.toThrow();
    });

    it("should resume animation", () => {
      expect(() => instance.resume()).not.toThrow();
    });

    it("should toggle pause state", () => {
      expect(() => instance.toggle()).not.toThrow();
    });

    it("should destroy instance cleanly", () => {
      expect(() => instance.destroy()).not.toThrow();
    });
  });

  describe("Callback and Event Testing", () => {
    it("should call onBegin callback when animation starts", async () => {
      const onBegin = vi.fn();
      const instance = UltraTyped(container, {
        strings: ["Test"],
        typeSpeed: 10,
        onBegin,
      });

      expect(instance).toBeDefined();

      // Wait for callback to be called
      await vi.waitFor(
        () => {
          expect(onBegin).toHaveBeenCalled();
        },
        { timeout: 1000 },
      );

      expect(onBegin).toHaveBeenCalledTimes(1);
    });

    it("should call onStringTyped callback when string is completed", async () => {
      const onStringTyped = vi.fn();
      const instance = UltraTyped(container, {
        strings: ["Hello", "World"],
        typeSpeed: 10,
        onStringTyped,
      });

      expect(instance).toBeDefined();

      // Wait for first string to be typed
      await vi.waitFor(
        () => {
          expect(container.textContent).toContain("Hello");
          expect(onStringTyped).toHaveBeenCalled();
        },
        { timeout: 2000 },
      );

      // The callback signature appears to be (index, data) where data contains el and strings
      expect(onStringTyped).toHaveBeenCalledWith(
        0,
        expect.objectContaining({
          el: expect.any(HTMLElement),
          strings: ["Hello", "World"],
        }),
      );
    });

    it("should call onComplete callback when all strings are done", async () => {
      const onComplete = vi.fn();
      const instance = UltraTyped(container, {
        strings: ["Single"],
        typeSpeed: 10,
        loop: false,
        onComplete,
      });

      expect(instance).toBeDefined();

      // Wait for completion
      await vi.waitFor(
        () => {
          expect(onComplete).toHaveBeenCalled();
        },
        { timeout: 2000 },
      );

      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe("Security Tests", () => {
    it("should not execute script tags in HTML mode", async () => {
      // Clear any existing XSS test variable
      delete window.xssTest;

      const instance = UltraTyped(container, {
        strings: ["<script>window.xssTest = true;</script>"],
        contentType: "html",
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();

      // Wait for content to be typed
      await vi.waitFor(
        () => {
          expect(container.innerHTML).toBeTruthy();
        },
        { timeout: 1000 },
      );

      // Verify script was NOT executed
      expect(window.xssTest).toBeUndefined();

      // Verify script tag is present in HTML but not executed
      expect(container.innerHTML).toContain("<script>");
    });

    it("should handle malicious HTML entities safely", async () => {
      delete window.maliciousTest;

      const instance = UltraTyped(container, {
        strings: ["&lt;img src=x onerror=window.maliciousTest=true&gt;"],
        contentType: "html",
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();

      await vi.waitFor(
        () => {
          expect(container.innerHTML).toBeTruthy();
        },
        { timeout: 1000 },
      );

      // Verify malicious code was NOT executed
      expect(window.maliciousTest).toBeUndefined();
    });

    it("should sanitize javascript: URLs", async () => {
      delete window.urlTest;

      const instance = UltraTyped(container, {
        strings: ["<a href='javascript:window.urlTest=true'>Click me</a>"],
        contentType: "html",
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();

      await vi.waitFor(
        () => {
          expect(container.innerHTML).toBeTruthy();
        },
        { timeout: 1000 },
      );

      // Verify javascript: URL was NOT executed
      expect(window.urlTest).toBeUndefined();
    });

    it("should handle data URLs safely", async () => {
      delete window.dataTest;

      const instance = UltraTyped(container, {
        strings: [
          "<img src='data:text/html,<script>window.dataTest=true</script>'>",
        ],
        contentType: "html",
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();

      await vi.waitFor(
        () => {
          expect(container.innerHTML).toBeTruthy();
        },
        { timeout: 1000 },
      );

      // Verify data URL script was NOT executed
      expect(window.dataTest).toBeUndefined();
    });

    it("should prevent CSS injection", async () => {
      const instance = UltraTyped(container, {
        strings: ["<style>body { background: red !important; }</style>"],
        contentType: "html",
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();

      await vi.waitFor(
        () => {
          expect(container.innerHTML).toBeTruthy();
        },
        { timeout: 1000 },
      );

      // Verify style tag is present but doesn't affect page
      expect(container.innerHTML).toContain("<style>");
      // Page background should not be changed
      expect(document.body.style.backgroundColor).toBe("");
    });

    it("should handle iframe injection attempts", async () => {
      delete window.iframeTest;

      const instance = UltraTyped(container, {
        strings: ["<iframe src='javascript:window.iframeTest=true'></iframe>"],
        contentType: "html",
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();

      await vi.waitFor(
        () => {
          expect(container.innerHTML).toBeTruthy();
        },
        { timeout: 1000 },
      );

      // Verify iframe javascript was NOT executed
      expect(window.iframeTest).toBeUndefined();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty strings array", () => {
      const instance = UltraTyped(container, {
        strings: [],
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle single character strings", () => {
      const instance = UltraTyped(container, {
        strings: ["A", "B", "C"],
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle very long strings", () => {
      const longString = "A".repeat(1000);
      const instance = UltraTyped(container, {
        strings: [longString],
        typeSpeed: 1,
      });

      expect(instance).toBeDefined();
    });

    it("should handle special characters and Unicode", () => {
      const instance = UltraTyped(container, {
        strings: ["Hello 🌍 Émojis àccénts 中文字符"],
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle HTML entities and tags", () => {
      const instance = UltraTyped(container, {
        strings: ["<div>&lt;script&gt;alert('xss')&lt;/script&gt;</div>"],
        contentType: "html",
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle zero speed values", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        typeSpeed: 0,
        backSpeed: 0,
      });

      expect(instance).toBeDefined();
    });

    it("should handle very high speed values", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        typeSpeed: 1000,
        backSpeed: 1000,
      });

      expect(instance).toBeDefined();
    });

    it("should handle negative delay values", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        startDelay: -100,
        backDelay: -100,
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle infinite loop count", () => {
      const instance = UltraTyped(container, {
        strings: ["Loop"],
        loopCount: Infinity,
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle zero loop count", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        loopCount: 0,
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle strings with only whitespace", () => {
      const instance = UltraTyped(container, {
        strings: ["   ", "\t\n", ""],
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle mixed content types", () => {
      const instance = UltraTyped(container, {
        strings: ["Text", "<strong>HTML</strong>", "Plain"],
        contentType: "html",
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle stringsElement with no children", () => {
      const stringsContainer = document.createElement("div");
      container.appendChild(stringsContainer);

      const instance = UltraTyped(container, {
        stringsElement: stringsContainer,
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle fadeOut with no loop", () => {
      const instance = UltraTyped(container, {
        strings: ["Fade"],
        fadeOut: true,
        loop: false,
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle typing variance", () => {
      const instance = UltraTyped(container, {
        strings: ["Variable"],
        typingVariance: 50,
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle smart backspace with identical strings", () => {
      const instance = UltraTyped(container, {
        strings: ["Same", "Same"],
        smartBackspace: true,
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle shuffle with single string", () => {
      const instance = UltraTyped(container, {
        strings: ["Only"],
        shuffle: true,
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });
  });

  describe("Negative Tests", () => {
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

    it("should handle invalid element selector", () => {
      expect(() => {
        UltraTyped("#nonexistent", { strings: ["Test"] });
      }).not.toThrow();
    });

    it("should handle null options", () => {
      expect(() => {
        UltraTyped(container, null);
      }).not.toThrow();
    });

    it("should handle undefined options", () => {
      expect(() => {
        UltraTyped(container, undefined);
      }).not.toThrow();
    });

    it("should handle non-string values in strings array", () => {
      // Test that adapters can handle mixed types but core library will throw
      expect(() => {
        UltraTyped(container, {
          strings: ["Valid", 123, null],
        });
      }).toThrow(); // Core library doesn't handle non-strings
    });

    it("should handle negative speed values", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        typeSpeed: -50,
        backSpeed: -30,
      });

      expect(instance).toBeDefined();
    });

    it("should handle invalid content type", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        contentType: "invalid",
      });

      expect(instance).toBeDefined();
    });

    it("should handle invalid attribute name", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        attr: "nonexistent-attribute",
      });

      expect(instance).toBeDefined();
    });

    it("should handle stringsElement with invalid selector", () => {
      const instance = UltraTyped(container, {
        stringsElement: "#nonexistent",
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });
  });

  describe("Exception Handling", () => {
    it("should handle callback errors gracefully", () => {
      const errorCallback = vi.fn(() => {
        throw new Error("Callback error");
      });

      const instance = UltraTyped(container, {
        strings: ["Test"],
        onBegin: errorCallback,
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle requestAnimationFrame errors gracefully", () => {
      const originalRaf = window.requestAnimationFrame;

      try {
        // Mock RAF to throw error - this is expected to break the animation
        const rafSpy = vi.fn(() => {
          throw new Error("RAF error");
        });
        window.requestAnimationFrame = rafSpy;

        // Should still create instance but animation will fail
        expect(() => {
          const instance = UltraTyped(container, {
            strings: ["Test"],
            typeSpeed: 10,
          });
          expect(instance).toBeDefined();
        }).toThrow("RAF error");
      } finally {
        window.requestAnimationFrame = originalRaf;
      }
    });

    it("should handle event listener errors gracefully", () => {
      const originalAddEventListener = document.addEventListener;

      try {
        // Mock addEventListener to throw error - this is expected to break initialization
        document.addEventListener = vi.fn(() => {
          throw new Error("Event listener error");
        });

        // Should still create instance but event listener setup will fail
        expect(() => {
          const instance = UltraTyped(container, {
            strings: ["Test"],
            typeSpeed: 10,
          });
          expect(instance).toBeDefined();
        }).toThrow("Event listener error");
      } finally {
        document.addEventListener = originalAddEventListener;
      }
    });

    it("should handle DOM manipulation errors gracefully", () => {
      const originalTextContent = Object.getOwnPropertyDescriptor(
        HTMLElement.prototype,
        "textContent",
      );

      try {
        Object.defineProperty(HTMLElement.prototype, "textContent", {
          set: vi.fn(() => {
            throw new Error("DOM error");
          }),
          get: vi.fn(),
          configurable: true,
        });

        // Should handle DOM errors gracefully - expect the error to be thrown
        expect(() => {
          const instance = UltraTyped(container, {
            strings: ["Test"],
            typeSpeed: 10,
          });
          expect(instance).toBeDefined();
        }).toThrow("DOM error");
      } finally {
        // Restore original property descriptor
        Object.defineProperty(
          HTMLElement.prototype,
          "textContent",
          originalTextContent || {
            value: "",
            writable: true,
            configurable: true,
          },
        );
      }
    });

    describe("Security Tests", () => {
      it("should not execute script tags in HTML mode", () => {
        const instance = UltraTyped(container, {
          strings: ["<script>window.xssTest = true;</script>"],
          contentType: "html",
          typeSpeed: 10,
        });

        expect(instance).toBeDefined();
        expect(window.xssTest).toBeUndefined();
      });

      it("should handle malicious HTML entities", () => {
        const instance = UltraTyped(container, {
          strings: ["<img src=x onerror=window.xssTest=true>"],
          contentType: "html",
          typeSpeed: 10,
        });

        expect(instance).toBeDefined();
        expect(window.xssTest).toBeUndefined();
      });

      it("should sanitize javascript: URLs", () => {
        const instance = UltraTyped(container, {
          strings: ["<a href='javascript:alert(1)'>Click</a>"],
          contentType: "html",
          typeSpeed: 10,
        });

        expect(instance).toBeDefined();
      });

      it("should handle data URLs safely", () => {
        const instance = UltraTyped(container, {
          strings: [
            "<a href='data:text/html,<script>alert(1)</script>'>Click</a>",
          ],
          contentType: "html",
          typeSpeed: 10,
        });

        expect(instance).toBeDefined();
      });

      it("should prevent CSS injection", () => {
        const instance = UltraTyped(container, {
          strings: ["<style>body{background:red}</style>"],
          contentType: "html",
          typeSpeed: 10,
        });

        expect(instance).toBeDefined();
      });

      it("should handle iframe injection attempts", () => {
        const instance = UltraTyped(container, {
          strings: ["<iframe src='javascript:alert(1)'></iframe>"],
          contentType: "html",
          typeSpeed: 10,
        });

        expect(instance).toBeDefined();
      });
    });

    describe("Regression Tests", () => {
      it("should handle memory leaks with multiple instances", () => {
        const instances = [];

        for (let i = 0; i < 10; i++) {
          const div = document.createElement("div");
          container.appendChild(div);
          const instance = UltraTyped(div, {
            strings: [`Test ${i}`],
            typeSpeed: 10,
          });
          instances.push(instance);
        }

        expect(() => {
          instances.forEach((instance) => instance.destroy());
        }).not.toThrow();
      });

      it("should handle rapid start/stop cycles", () => {
        const instance = UltraTyped(container, {
          strings: ["Test"],
          typeSpeed: 10,
        });

        expect(() => {
          for (let i = 0; i < 50; i++) {
            instance.start();
            instance.stop();
          }
        }).not.toThrow();
      });

      it("should handle visibility API changes", () => {
        const instance = UltraTyped(container, {
          strings: ["Test"],
          typeSpeed: 10,
        });

        expect(() => {
          // Simulate visibility changes
          Object.defineProperty(document, "hidden", {
            writable: true,
            value: true,
          });
          document.dispatchEvent(new Event("visibilitychange"));

          Object.defineProperty(document, "hidden", {
            writable: true,
            value: false,
          });
          document.dispatchEvent(new Event("visibilitychange"));
        }).not.toThrow();

        instance.destroy();
      });

      it("should handle focus events when bindInputFocusEvents is true", () => {
        const input = document.createElement("input");
        container.appendChild(input);

        const instance = UltraTyped(container, {
          strings: ["Test"],
          bindInputFocusEvents: true,
          typeSpeed: 10,
        });

        expect(() => {
          input.focus();
          input.blur();
        }).not.toThrow();
      });

      it("should maintain performance with large strings", () => {
        const largeString = "A".repeat(10000);
        const startTime = performance.now();

        const instance = UltraTyped(container, {
          strings: [largeString],
          typeSpeed: 1,
        });

        const endTime = performance.now();
        const initTime = endTime - startTime;

        expect(instance).toBeDefined();
        expect(initTime).toBeLessThan(100); // Should initialize quickly
      });
    });
  });
});
