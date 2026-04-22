/**
 * UltraTyped.js - Ultra-fast <2KB typing animation library
 * Zero dependencies, rAF-driven, pre-tokenized strings
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
    ts = o.typeSpeed || 50,
    bs = o.backSpeed || 30,
    bd = o.backDelay || 800,
    L = o.loop !== false,
    ct = o.contentType || "text",
    i = 0,
    j = 0,
    m = 0, // string index, char index, mode
    bufTokens = [], // track buffer as tokens instead of string
    toks = S.map(T),
    next = 0,
    raf,
    last = 0,
    diff = 0;

  function rebuildBuf() {
    return bufTokens.join("");
  }

  function start() {
    raf = requestAnimationFrame((t) => {
      last = t;
      step(t);
    });
  }

  // Visibility API - pause when tab hidden, resume when visible
  let isPaused = false;
  let stopped = false;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      isPaused = true;
      cancelAnimationFrame(raf);
    } else {
      isPaused = false;
      last = performance.now();
      if (!stopped) start();
    }
  });

  // prefers-reduced-motion support - skip animation and render final string immediately
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReducedMotion && S.length > 0) {
    const finalString = S[S.length - 1];
    if (ct === "html") {
      el.innerHTML = finalString;
    } else {
      el.textContent = finalString;
    }
    return {
      stop() {},
      start() {},
      reset() {},
    };
  }

  function step(t) {
    if (isPaused) return;
    let dt = t - last;

    if (m == 0) {
      // typing
      if (dt >= ts) {
        bufTokens.push(toks[i][j++] || "");
        last = t;
        if (j >= toks[i].length) {
          m = 1;
          next = bd;
        }
      }
    } else if (m == 1) {
      // pause
      next -= dt;
      if (next <= 0) {
        let ni = (i + 1) % toks.length;
        diff = D(toks[i], toks[ni]);
        m = 2;
      }
    } else if (m == 2) {
      // backspace
      if (dt >= bs) {
        if (j > diff) {
          bufTokens.pop(); // pop full token instead of byte
          j--;
          last = t;
        } else {
          i = (i + 1) % toks.length;
          if (!L && i == 0) return;
          m = 0;
        }
      }
    }

    const buf = rebuildBuf();
    if (ct === "html") {
      el.innerHTML = buf;
    } else {
      el.textContent = buf;
    }
    raf = requestAnimationFrame(step);
  }

  start();

  return {
    stop() {
      stopped = true;
      cancelAnimationFrame(raf);
    },
    start() {
      stopped = false;
      cancelAnimationFrame(raf);
      start();
    },
    reset() {
      stopped = false;
      i = j = 0;
      bufTokens = [];
      m = 0;
      cancelAnimationFrame(raf);
      start();
    },
  };
}
