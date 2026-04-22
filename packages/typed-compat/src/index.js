/**
 * @ultratyped/typed-compat - Compatibility shim for Typed.js v2 API
 * This package provides a drop-in replacement for Typed.js using UltraTyped core
 */

import UltraTyped from "@ultratyped/core";

/**
 * Typed class - mirrors Typed.js v2 constructor API
 * @param {HTMLElement|string} element - Target element or CSS selector
 * @param {Object} options - Configuration options (Typed.js compatible)
 */
class Typed {
  constructor(element, options) {
    // Handle string selector
    if (typeof element === "string") {
      element = document.querySelector(element);
    }

    if (!element) {
      throw new Error("Typed: Element not found");
    }

    // Map Typed.js options to UltraTyped options
    const ultraTypedOptions = {
      strings: options.strings,
      stringsElement: options.stringsElement,
      typeSpeed: options.typeSpeed,
      backSpeed: options.backSpeed,
      backDelay: options.backDelay,
      loop: options.loop,
      loopCount: options.loopCount,
      contentType: options.contentType,
      showCursor: options.showCursor,
      cursorChar: options.cursorChar,
      autoInsertCss: options.autoInsertCss,
      startDelay: options.startDelay,
      shuffle: options.shuffle,
      fadeOut: options.fadeOut,
      fadeOutDelay: options.fadeOutDelay,
      fadeOutClass: options.fadeOutClass,
      attr: options.attr,
      smartBackspace: options.smartBackspace,
      typingVariance: options.typingVariance,
      bindInputFocusEvents: options.bindInputFocusEvents,
      onBegin: options.onBegin,
      onComplete: options.onComplete,
      preStringTyped: options.preStringTyped,
      onStringTyped: options.onStringTyped,
      onLastStringBackspaced: options.onLastStringBackspaced,
      onTypingPaused: options.onTypingPaused,
      onTypingResumed: options.onTypingResumed,
      onReset: options.onReset,
      onStop: options.onStop,
      onStart: options.onStart,
      onDestroy: options.onDestroy,
    };

    // Initialize UltraTyped instance
    this.instance = UltraTyped(element, ultraTypedOptions);

    // Store element and options for compatibility
    this.el = element;
    this.options = ultraTypedOptions;
  }

  // Typed.js compatible instance methods
  stop() {
    this.instance.stop();
  }

  start() {
    this.instance.start();
  }

  reset() {
    this.instance.reset();
  }

  destroy() {
    this.instance.destroy();
  }

  pause() {
    this.instance.pause();
  }

  resume() {
    this.instance.resume();
  }

  toggle() {
    this.instance.toggle();
  }
}

// Export for CommonJS and ES Module
if (typeof module !== "undefined" && module.exports) {
  module.exports = Typed;
}

export default Typed;
