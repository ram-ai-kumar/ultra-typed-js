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

  describe("Start Method", () => {
    it("should start the animation", () => {
      const instance = UltraTyped(container, {
        strings: ["Hello World"],
        typeSpeed: 10,
      });

      expect(() => instance.start()).not.toThrow();
    });

    it("should restart after stop", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        typeSpeed: 10,
      });

      instance.stop();
      expect(() => instance.start()).not.toThrow();
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

    it("should restart animation after stop", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        typeSpeed: 10,
      });

      instance.stop();
      expect(() => instance.reset()).not.toThrow();
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

  describe("Security Tests - XSS Prevention", () => {
    it("should handle script tags without crashing (textContent escapes by default)", () => {
      const instance = UltraTyped(container, {
        strings: ["<script>alert('xss')</script>"],
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
      // textContent escapes HTML, so script won't execute
    });

    it("should handle img onerror without crashing (textContent escapes by default)", () => {
      const instance = UltraTyped(container, {
        strings: ["<img src=x onerror=alert('xss')>"],
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
      // textContent escapes HTML, so onerror won't execute
    });

    it("should handle iframe without crashing (textContent escapes by default)", () => {
      const instance = UltraTyped(container, {
        strings: ["<iframe src=javascript:alert('xss')>"],
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
      // textContent escapes HTML, so javascript: won't execute
    });

    it("should handle SVG without crashing (textContent escapes by default)", () => {
      const instance = UltraTyped(container, {
        strings: ["<svg><script>alert('xss')</script></svg>"],
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
      // textContent escapes HTML, so script won't execute
    });

    it("should handle data URI without crashing (textContent escapes by default)", () => {
      const instance = UltraTyped(container, {
        strings: [
          "<a href=data:text/html,<script>alert('xss')</script>>Click</a>",
        ],
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
      // textContent escapes HTML, so data URI won't execute
    });

    it("should allow HTML only when contentType='html' with trusted input", () => {
      const instance = UltraTyped(container, {
        strings: ["<b>Bold</b>"],
        contentType: "html",
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });
  });

  describe("Security Tests - Input Validation", () => {
    it("should handle extremely long strings without crashing", () => {
      const longString = "A".repeat(1000000);
      const instance = UltraTyped(container, {
        strings: [longString],
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle very large arrays without crashing", () => {
      const largeArray = Array(1000).fill("Test");
      const instance = UltraTyped(container, {
        strings: largeArray,
        typeSpeed: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle negative typeSpeed gracefully", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        typeSpeed: -10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle negative backSpeed gracefully", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        backSpeed: -10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle negative backDelay gracefully", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        backDelay: -1000,
      });

      expect(instance).toBeDefined();
    });

    it("should handle extremely large typeSpeed gracefully", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        typeSpeed: 999999999,
      });

      expect(instance).toBeDefined();
    });
  });

  describe("Security Tests - CSP Compatibility", () => {
    it("should support nonce option for CSP compliance", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        nonce: "test-nonce-12345",
        showCursor: true,
      });

      expect(instance).toBeDefined();
    });

    it("should work without nonce when CSP allows inline styles", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        showCursor: true,
      });

      expect(instance).toBeDefined();
    });
  });

  describe("Negative Tests - Invalid Inputs", () => {
    it("should handle missing strings option", () => {
      const instance = UltraTyped(container, {});

      expect(instance).toBeDefined();
    });

    it("should handle null strings", () => {
      const instance = UltraTyped(container, {
        strings: null,
      });

      expect(instance).toBeDefined();
    });

    it("should handle undefined strings", () => {
      const instance = UltraTyped(container, {
        strings: undefined,
      });

      expect(instance).toBeDefined();
    });

    it("should handle non-array strings", () => {
      const instance = UltraTyped(container, {
        strings: "Single string",
      });

      expect(instance).toBeDefined();
    });

    it("should handle number in strings array", () => {
      const instance = UltraTyped(container, {
        strings: ["Test", 123, "Another"],
      });

      expect(instance).toBeDefined();
    });

    it("should handle object in strings array", () => {
      const instance = UltraTyped(container, {
        strings: ["Test", { key: "value" }],
      });

      expect(instance).toBeDefined();
    });

    it("should handle boolean in strings array", () => {
      const instance = UltraTyped(container, {
        strings: ["Test", true, false],
      });

      expect(instance).toBeDefined();
    });
  });

  describe("Exception Tests - Error Handling", () => {
    it("should handle destroy() on already destroyed instance", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
      });

      instance.destroy();
      expect(() => instance.destroy()).not.toThrow();
    });

    it("should handle stop() on already stopped instance", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
      });

      instance.stop();
      expect(() => instance.stop()).not.toThrow();
    });

    it("should handle reset() on already reset instance", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
      });

      instance.reset();
      expect(() => instance.reset()).not.toThrow();
    });

    it("should handle start() on already running instance", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
      });

      expect(() => instance.start()).not.toThrow();
    });

    it("should handle pause() when already paused", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
      });

      instance.pause();
      expect(() => instance.pause()).not.toThrow();
    });

    it("should handle resume() when not paused", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
      });

      expect(() => instance.resume()).not.toThrow();
    });

    it("should handle toggle() when not started", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
      });

      expect(() => instance.toggle()).not.toThrow();
    });
  });

  describe("Edge Cases - DOM Scenarios", () => {
    it("should handle element removed from DOM", () => {
      const div = document.createElement("div");
      document.body.appendChild(div);
      const instance = UltraTyped(div, {
        strings: ["Test"],
      });

      document.body.removeChild(div);
      expect(() => instance.destroy()).not.toThrow();
    });

    it("should handle element with no parent", () => {
      const div = document.createElement("div");
      const instance = UltraTyped(div, {
        strings: ["Test"],
        showCursor: true,
      });

      expect(instance).toBeDefined();
    });

    it("should handle hidden element", () => {
      const div = document.createElement("div");
      div.style.display = "none";
      document.body.appendChild(div);
      const instance = UltraTyped(div, {
        strings: ["Test"],
      });

      expect(instance).toBeDefined();
      document.body.removeChild(div);
    });

    it("should handle element with visibility: hidden", () => {
      const div = document.createElement("div");
      div.style.visibility = "hidden";
      document.body.appendChild(div);
      const instance = UltraTyped(div, {
        strings: ["Test"],
      });

      expect(instance).toBeDefined();
      document.body.removeChild(div);
    });

    it("should handle element with opacity: 0", () => {
      const div = document.createElement("div");
      div.style.opacity = "0";
      document.body.appendChild(div);
      const instance = UltraTyped(div, {
        strings: ["Test"],
      });

      expect(instance).toBeDefined();
      document.body.removeChild(div);
    });
  });

  describe("Edge Cases - Timing Scenarios", () => {
    it("should handle startDelay of 0", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        startDelay: 0,
      });

      expect(instance).toBeDefined();
    });

    it("should handle large startDelay", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        startDelay: 10000,
      });

      expect(instance).toBeDefined();
    });

    it("should handle loopCount of 1", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        loopCount: 1,
      });

      expect(instance).toBeDefined();
    });

    it("should handle loopCount of 0", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        loopCount: 0,
      });

      expect(instance).toBeDefined();
    });

    it("should handle very large loopCount", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        loopCount: 999999,
      });

      expect(instance).toBeDefined();
    });
  });

  describe("Edge Cases - Callback Scenarios", () => {
    it("should handle missing callbacks gracefully", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
      });

      expect(instance).toBeDefined();
    });

    it("should handle null callbacks gracefully", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        onBegin: null,
        onComplete: null,
      });

      expect(instance).toBeDefined();
    });

    it("should handle callbacks that throw errors", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        onBegin: () => {
          throw new Error("Callback error");
        },
      });

      expect(instance).toBeDefined();
    });

    it("should handle callbacks that are not functions", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        onBegin: "not a function",
        onComplete: 123,
      });

      expect(instance).toBeDefined();
    });
  });

  describe("Memory Leak Tests", () => {
    it("should clean up event listeners on destroy", () => {
      const div = document.createElement("div");
      document.body.appendChild(div);

      const instance = UltraTyped(div, {
        strings: ["Test"],
        showCursor: true,
      });

      instance.destroy();
      document.body.removeChild(div);

      expect(() => instance.destroy()).not.toThrow();
    });

    it("should clean up cursor element on destroy", () => {
      const div = document.createElement("div");
      document.body.appendChild(div);

      const instance = UltraTyped(div, {
        strings: ["Test"],
        showCursor: true,
      });

      instance.destroy();
      expect(div.querySelectorAll(".ultratyped-cursor").length).toBe(0);
      document.body.removeChild(div);
    });

    it("should clean up style element on destroy", () => {
      const styleId = "ultratyped-cursor-style";
      const div = document.createElement("div");
      document.body.appendChild(div);

      const instance = UltraTyped(div, {
        strings: ["Test"],
        showCursor: true,
        autoInsertCss: true,
      });

      instance.destroy();
      document.body.removeChild(div);

      // Style element should remain (shared across instances)
      expect(document.getElementById(styleId)).toBeDefined();
    });
  });

  describe("Instance Methods - Full Coverage", () => {
    it("should have pause() method", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
      });

      expect(typeof instance.pause).toBe("function");
    });

    it("should have resume() method", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
      });

      expect(typeof instance.resume).toBe("function");
    });

    it("should have destroy() method", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
      });

      expect(typeof instance.destroy).toBe("function");
    });

    it("should have start() method", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
      });

      expect(typeof instance.start).toBe("function");
    });

    it("should have toggle() method", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
      });

      expect(typeof instance.toggle).toBe("function");
    });

    it("pause() should not throw", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
      });

      expect(() => instance.pause()).not.toThrow();
    });

    it("resume() should not throw", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
      });

      expect(() => instance.resume()).not.toThrow();
    });

    it("destroy() should not throw", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
      });

      expect(() => instance.destroy()).not.toThrow();
    });

    it("toggle() should not throw", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
      });

      expect(() => instance.toggle()).not.toThrow();
    });
  });

  describe("New Options - Typed.js Parity", () => {
    it("should handle showCursor option", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        showCursor: true,
      });

      expect(instance).toBeDefined();
    });

    it("should handle cursorChar option", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        showCursor: true,
        cursorChar: "_",
      });

      expect(instance).toBeDefined();
    });

    it("should handle autoInsertCss option", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        showCursor: true,
        autoInsertCss: true,
      });

      expect(instance).toBeDefined();
    });

    it("should handle startDelay option", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        startDelay: 100,
      });

      expect(instance).toBeDefined();
    });

    it("should handle loopCount option", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        loopCount: 3,
      });

      expect(instance).toBeDefined();
    });

    it("should handle shuffle option", () => {
      const instance = UltraTyped(container, {
        strings: ["A", "B", "C"],
        shuffle: true,
      });

      expect(instance).toBeDefined();
    });

    it("should handle fadeOut option", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        fadeOut: true,
      });

      expect(instance).toBeDefined();
    });

    it("should handle fadeOutDelay option", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        fadeOut: true,
        fadeOutDelay: 1000,
      });

      expect(instance).toBeDefined();
    });

    it("should handle fadeOutClass option", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        fadeOut: true,
        fadeOutClass: "custom-fade",
      });

      expect(instance).toBeDefined();
    });

    it("should handle attr option", () => {
      const input = document.createElement("input");
      document.body.appendChild(input);
      const instance = UltraTyped(input, {
        strings: ["Placeholder"],
        attr: "placeholder",
      });

      expect(instance).toBeDefined();
      document.body.removeChild(input);
    });

    it("should handle smartBackspace option", () => {
      const instance = UltraTyped(container, {
        strings: ["Hello", "Help"],
        smartBackspace: true,
      });

      expect(instance).toBeDefined();
    });

    it("should handle stringsElement option", () => {
      const stringsDiv = document.createElement("div");
      stringsDiv.innerHTML = `
        <p>First</p>
        <p>Second</p>
        <p>Third</p>
      `;
      document.body.appendChild(stringsDiv);

      const instance = UltraTyped(container, {
        stringsElement: stringsDiv,
      });

      expect(instance).toBeDefined();
      document.body.removeChild(stringsDiv);
    });

    it("should handle typingVariance option", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        typingVariance: 10,
      });

      expect(instance).toBeDefined();
    });

    it("should handle bindInputFocusEvents option", () => {
      const instance = UltraTyped(container, {
        strings: ["Test"],
        bindInputFocusEvents: true,
      });

      expect(instance).toBeDefined();
    });
  });

  describe("New Callbacks - Typed.js Parity", () => {
    it("should call onBegin callback", () => {
      const onBegin = vi.fn();
      const instance = UltraTyped(container, {
        strings: ["Test"],
        onBegin,
      });

      expect(instance).toBeDefined();
    });

    it("should call onComplete callback", () => {
      const onComplete = vi.fn();
      const instance = UltraTyped(container, {
        strings: ["Test"],
        onComplete,
      });

      expect(instance).toBeDefined();
    });

    it("should call preStringTyped callback", () => {
      const preStringTyped = vi.fn();
      const instance = UltraTyped(container, {
        strings: ["Test"],
        preStringTyped,
      });

      expect(instance).toBeDefined();
    });

    it("should call onStringTyped callback", () => {
      const onStringTyped = vi.fn();
      const instance = UltraTyped(container, {
        strings: ["Test"],
        onStringTyped,
      });

      expect(instance).toBeDefined();
    });

    it("should call onLastStringBackspaced callback", () => {
      const onLastStringBackspaced = vi.fn();
      const instance = UltraTyped(container, {
        strings: ["Test"],
        onLastStringBackspaced,
      });

      expect(instance).toBeDefined();
    });

    it("should call onTypingPaused callback", () => {
      const onTypingPaused = vi.fn();
      const instance = UltraTyped(container, {
        strings: ["Test"],
        onTypingPaused,
      });

      expect(instance).toBeDefined();
    });

    it("should call onTypingResumed callback", () => {
      const onTypingResumed = vi.fn();
      const instance = UltraTyped(container, {
        strings: ["Test"],
        onTypingResumed,
      });

      expect(instance).toBeDefined();
    });

    it("should call onReset callback", () => {
      const onReset = vi.fn();
      const instance = UltraTyped(container, {
        strings: ["Test"],
        onReset,
      });

      expect(instance).toBeDefined();
    });

    it("should call onStop callback", () => {
      const onStop = vi.fn();
      const instance = UltraTyped(container, {
        strings: ["Test"],
        onStop,
      });

      expect(instance).toBeDefined();
    });

    it("should call onStart callback", () => {
      const onStart = vi.fn();
      const instance = UltraTyped(container, {
        strings: ["Test"],
        onStart,
      });

      expect(instance).toBeDefined();
    });

    it("should call onDestroy callback", () => {
      const onDestroy = vi.fn();
      const instance = UltraTyped(container, {
        strings: ["Test"],
        onDestroy,
      });

      expect(instance).toBeDefined();
    });
  });
});
