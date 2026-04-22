/**
 * UltraTyped.js - Ultra-fast <2KB typing animation library
 * Zero dependencies, rAF-driven, pre-tokenized strings
 *
 * @warning XSS Risk: When using `contentType: 'html'`, the library injects content via `innerHTML`
 * without sanitization. NEVER use this option with untrusted input (CMS, API, user input, URL params).
 * Only use with trusted, developer-controlled HTML content. For untrusted input, use `contentType: 'text'` (default).
 */

/**
 * HTML Tokenizer - parses HTML once, no runtime regex
 * @param {string} s - Input string with HTML
 * @returns {string[]} - Array of tokens (chars and tags)
 */
function T(s) {
  let r = [],
    i = 0,
    l = s.length,
    c,
    t;
  for (; i < l; i++) {
    c = s[i];
    if (c == "<") {
      t = c;
      while (++i < l && (c = s[i]) != ">") t += c;
      r.push(t + ">");
    } else {
      r.push(c);
    }
  }
  return r;
}

/**
 * Diff function for smart backspace
 * @param {string[]} a - Previous tokens
 * @param {string[]} b - Next tokens
 * @returns {number} - Common prefix length
 */
function D(a, b) {
  let i = 0,
    l = Math.min(a.length, b.length);
  for (; i < l && a[i] === b[i]; i++);
  return i;
}

/**
 * UltraTyped core function
 * @param {HTMLElement} el - Target element
 * @param {Object} o - Options
 * @returns {Object} - Instance with stop/reset methods
 */
export default function U(el, o) {
  o = o || {};
  let S = o.strings || [],
    stringsElement = o.stringsElement || null,
    ts = o.typeSpeed || 50,
    bs = o.backSpeed || 30,
    bd = o.backDelay || 800,
    L = o.loop !== false,
    loopCount = o.loopCount === undefined ? Infinity : o.loopCount,
    shuffle = o.shuffle || false,
    ct = o.contentType || "text",
    attr = o.attr || null,
    smartBackspace = o.smartBackspace !== false,
    showCursor = o.showCursor !== false,
    cursorChar = o.cursorChar || "|",
    autoInsertCss = o.autoInsertCss !== false,
    startDelay = o.startDelay || 0,
    nonce = o.nonce || null,
    fadeOut = o.fadeOut || false,
    fadeOutDelay = o.fadeOutDelay || 500,
    fadeOutClass = o.fadeOutClass || "typed-fade-out",
    typingVariance = o.typingVariance || 0,
    bindInputFocusEvents = o.bindInputFocusEvents || false,
    onBegin = o.onBegin,
    onComplete = o.onComplete,
    preStringTyped = o.preStringTyped,
    onStringTyped = o.onStringTyped,
    onLastStringBackspaced = o.onLastStringBackspaced,
    onTypingPaused = o.onTypingPaused,
    onTypingResumed = o.onTypingResumed,
    onReset = o.onReset,
    onStop = o.onStop,
    onStart = o.onStart,
    onDestroy = o.onDestroy,
    i = 0,
    j = 0,
    m = 0, // string index, char index, mode
    bufTokens = [], // track buffer as tokens instead of string
    toks = Array.isArray(S) ? S.map(T) : [],
    next = 0,
    raf,
    last = 0,
    diff = 0,
    cursorEl = null,
    initialDelay = true,
    loopCounter = 0,
    hasBegun = false,
    originalStrings = Array.isArray(S) ? [...S] : [],
    isFadingOut = false,
    focusHandler = null,
    pauseStart = 0,
    prevBuf = "";

  // Read strings from DOM element if stringsElement is provided
  if (stringsElement && S.length === 0) {
    const element =
      typeof stringsElement === "string"
        ? document.querySelector(stringsElement)
        : stringsElement;
    if (element) {
      S = Array.from(element.children).map((child) => child.textContent.trim());
      originalStrings = [...S];
      toks = S.map(T);
    }
  }

  function rebuildBuf() {
    return bufTokens.join("");
  }

  // Fisher-Yates shuffle
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Apply typing variance for human-like jitter
  function applyVariance(baseSpeed) {
    if (typingVariance <= 0) return baseSpeed;
    const variance = Math.random() * typingVariance * 2 - typingVariance;
    return baseSpeed + variance;
  }

  // Auto-insert CSS for blinking cursor
  if (autoInsertCss && showCursor) {
    const styleId = "ultratyped-cursor-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      if (nonce) {
        style.setAttribute("nonce", nonce);
      }
      style.textContent = `
        .ultratyped-cursor {
          display: inline-block;
          animation: ultratyped-blink 0.7s infinite;
        }
        @keyframes ultratyped-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Create cursor element
  if (showCursor) {
    if (el && el.parentNode) {
      cursorEl = document.createElement("span");
      cursorEl.className = "ultratyped-cursor";
      cursorEl.textContent = cursorChar;
      cursorEl.setAttribute("role", "presentation");
      el.parentNode.insertBefore(cursorEl, el.nextSibling);
    }
  }

  function startAnimation() {
    raf = requestAnimationFrame((t) => {
      last = t;
      step(t);
    });
  }

  // Visibility API - pause when tab hidden, resume when visible
  let isPaused = false;
  let manuallyPaused = false;
  let stopped = false;
  let visibilityHandler = () => {
    if (document.hidden) {
      isPaused = true;
      cancelAnimationFrame(raf);
    } else {
      isPaused = false;
      last = performance.now();
      if (!stopped && !manuallyPaused) startAnimation();
    }
  };
  document.addEventListener("visibilitychange", visibilityHandler);

  // bindInputFocusEvents - pause when nearby input/textarea gains focus
  if (bindInputFocusEvents) {
    focusHandler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        manuallyPaused = true;
        cancelAnimationFrame(raf);
      }
    };
    document.addEventListener("focus", focusHandler, true);
  }

  // prefers-reduced-motion support - skip animation and render final string immediately
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReducedMotion && S.length > 0) {
    const finalString = S[S.length - 1];
    if (attr) {
      el.setAttribute(attr, finalString);
    } else if (ct === "html") {
      el.innerHTML = finalString;
    } else {
      el.textContent = finalString;
    }
    return {
      stop() {
        if (cursorEl && cursorEl.parentNode) {
          cursorEl.parentNode.removeChild(cursorEl);
        }
      },
      start() {},
      reset() {},
    };
  }

  function step(t) {
    if (isPaused || manuallyPaused) return;
    let dt = t - last;

    // Handle initial start delay
    if (initialDelay) {
      if (dt >= startDelay) {
        initialDelay = false;
        last = t;
        if (onBegin && !hasBegun) {
          hasBegun = true;
          try {
            onBegin({ el, strings: S });
          } catch (e) {
            // Ignore callback errors to prevent animation crashes
          }
        }
        if (preStringTyped) {
          try {
            preStringTyped(i, { el, strings: S });
          } catch (e) {
            // Ignore callback errors to prevent animation crashes
          }
        }
      }
      raf = requestAnimationFrame(step);
      return;
    }

    if (m == 0) {
      // typing
      if (dt >= applyVariance(ts)) {
        bufTokens.push(toks[i][j++] || "");
        last = t;
        if (j >= toks[i].length) {
          m = 1;
          pauseStart = t;
          if (onStringTyped) {
            try {
              onStringTyped(i, { el, strings: S });
            } catch (e) {
              // Ignore callback errors to prevent animation crashes
            }
          }
        }
      }
    } else if (m == 1) {
      // pause
      const pauseElapsed = t - pauseStart;
      if (pauseElapsed >= bd && onTypingPaused && pauseElapsed < bd + 16) {
        try {
          onTypingPaused(i, { el, strings: S });
        } catch (e) {
          // Ignore callback errors to prevent animation crashes
        }
      }
      if (pauseElapsed >= bd) {
        // Check if fadeOut is enabled and this is the last string
        if (
          fadeOut &&
          (!L || loopCounter + 1 >= loopCount) &&
          i === toks.length - 1
        ) {
          isFadingOut = true;
          el.classList.add(fadeOutClass);
          setTimeout(() => {
            if (onComplete) {
              try {
                onComplete({ el, strings: S });
              } catch (e) {
                // Ignore callback errors to prevent animation crashes
              }
            }
            return;
          }, fadeOutDelay);
          return;
        }
        let ni = (i + 1) % toks.length;
        diff = smartBackspace ? D(toks[i], toks[ni]) : 0;
        m = 2;
        last = t;
        if (onTypingResumed) {
          try {
            onTypingResumed(i, { el, strings: S });
          } catch (e) {
            // Ignore callback errors to prevent animation crashes
          }
        }
      }
    } else if (m == 2) {
      // backspace
      if (dt >= applyVariance(bs)) {
        if (j > diff) {
          bufTokens.pop(); // pop full token instead of byte
          j--;
          last = t;
        } else {
          // Fire onLastStringBackspaced when last string is fully erased
          if (
            onLastStringBackspaced &&
            j === 0 &&
            (!L || loopCounter >= loopCount)
          ) {
            try {
              onLastStringBackspaced({ el, strings: S });
            } catch (e) {
              // Ignore callback errors to prevent animation crashes
            }
          }
          i = (i + 1) % toks.length;
          // Check if we've completed a full loop
          if (i == 0) {
            loopCounter++;
            if (!L || loopCounter >= loopCount) {
              if (onComplete) {
                try {
                  onComplete({ el, strings: S });
                } catch (e) {
                  // Ignore callback errors to prevent animation crashes
                }
              }
              return;
            }
            // Shuffle strings on each loop if shuffle is enabled
            if (shuffle) {
              S = shuffleArray([...originalStrings]);
              toks = S.map(T);
            }
          }
          if (preStringTyped) {
            preStringTyped(i, { el, strings: S });
          }
          m = 0;
        }
      }
    }

    const buf = rebuildBuf();
    // Only update DOM if buffer has changed (prevents unnecessary layout recalculations during pause)
    if (buf !== prevBuf) {
      if (attr) {
        el.setAttribute(attr, buf);
      } else if (ct === "html") {
        el.innerHTML = buf;
      } else {
        el.textContent = buf;
      }
      prevBuf = buf;
    }
    raf = requestAnimationFrame(step);
  }

  startAnimation();

  return {
    stop() {
      stopped = true;
      cancelAnimationFrame(raf);
      if (onStop) {
        try {
          onStop(i, { el, strings: S });
        } catch (e) {
          // Ignore callback errors to prevent animation crashes
        }
      }
    },
    start() {
      stopped = false;
      cancelAnimationFrame(raf);
      if (onStart) {
        try {
          onStart(i, { el, strings: S });
        } catch (e) {
          // Ignore callback errors to prevent animation crashes
        }
      }
      startAnimation();
    },
    reset() {
      stopped = false;
      manuallyPaused = false;
      i = j = 0;
      bufTokens = [];
      m = 0;
      loopCounter = 0;
      initialDelay = true;
      hasBegun = false;
      cancelAnimationFrame(raf);
      if (onReset) {
        try {
          onReset({ el, strings: S });
        } catch (e) {
          // Ignore callback errors to prevent animation crashes
        }
      }
      startAnimation();
    },
    pause() {
      manuallyPaused = true;
      cancelAnimationFrame(raf);
    },
    resume() {
      manuallyPaused = false;
      last = performance.now();
      if (!stopped) startAnimation();
    },
    toggle() {
      if (manuallyPaused) {
        this.resume();
      } else {
        this.pause();
      }
    },
    destroy() {
      stopped = true;
      manuallyPaused = false;
      cancelAnimationFrame(raf);
      if (cursorEl && cursorEl.parentNode) {
        cursorEl.parentNode.removeChild(cursorEl);
      }
      if (visibilityHandler) {
        document.removeEventListener("visibilitychange", visibilityHandler);
      }
      if (focusHandler) {
        document.removeEventListener("focus", focusHandler, true);
      }
      if (attr) {
        el.removeAttribute(attr);
      } else {
        el.textContent = "";
        el.innerHTML = "";
      }
      if (isFadingOut) {
        el.classList.remove(fadeOutClass);
      }
      if (onDestroy) {
        try {
          onDestroy({ el, strings: S });
        } catch (e) {
          // Ignore callback errors to prevent animation crashes
        }
      }
    },
  };
}
