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
    buf = "",
    toks = S.map(T),
    next = 0,
    raf,
    last = 0,
    diff = 0;

  function step(t) {
    let dt = t - last;
    last = t;

    if (m == 0) {
      // typing
      if (dt >= ts) {
        buf += toks[i][j++] || "";
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
          buf = buf.slice(0, -1);
          j--;
        } else {
          i = (i + 1) % toks.length;
          if (!L && i == 0) return;
          m = 0;
        }
      }
    }

    if (ct === "html") {
      el.innerHTML = buf;
    } else {
      el.textContent = buf;
    }
    raf = requestAnimationFrame(step);
  }

  raf = requestAnimationFrame((t) => {
    last = t;
    step(t);
  });

  return {
    stop() {
      cancelAnimationFrame(raf);
    },
    reset() {
      i = j = 0;
      buf = "";
      m = 0;
    },
  };
}
