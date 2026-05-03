# Changelog

All notable changes to UltraTyped.js will be documented in this file.

## [Unreleased]

### Testing & Quality Assurance

**Implemented comprehensive test infrastructure for ZTA/CISO compliance**

- **Setup**: Configured Vitest with jsdom environment and 80% coverage thresholds (lines, functions, branches, statements)
- **Core Library Tests**: 112 unit tests covering initialization, typing animation, options, instance methods, edge cases
- **Security Tests**: XSS prevention (script tags, img onerror, iframe, SVG, data URI), CSP nonce support, input validation
- **Negative Tests**: Invalid inputs (null, undefined, non-array strings, numbers/objects in arrays), extreme values (1M character strings, 1000-item arrays)
- **Exception Tests**: Multiple destroy/stop/reset calls, callbacks that throw errors, non-function callbacks, missing callbacks
- **Memory Leak Tests**: Event listener cleanup, cursor element cleanup, style element handling
- **Framework Adapter Tests**: React, Vue, Svelte, Angular, Astro, Preact, Lit, Solid, TypeScript adapters (70 tests)
- **Cross-Browser E2E Tests**: Playwright setup with Chromium, Firefox, WebKit (Safari), Mobile Chrome, Mobile Safari support
- **Browser Verification**: All 6 E2E tests passing on Chrome/Chromium (6/6), Firefox (6/6), Safari/WebKit (6/6), Edge/Chromium (6/6)
- **Files**: `vitest.config.ts`, `test/setup.ts`, `packages/core/src/index.test.js`, `playwright.config.ts`, `e2e/basic.spec.ts`
- **Impact**: 182 total tests passing, comprehensive security and stability validation for production use

**Enhanced core library for security and stability**

- **Input Validation**: Added `Array.isArray()` check for strings parameter to prevent crashes with non-array inputs
- **Callback Safety**: Wrapped all callback invocations in try-catch blocks to prevent animation crashes from bad callbacks
- **Files**: `packages/core/src/index.js`
- **Impact**: Library handles malformed inputs and bad callbacks gracefully without crashing

### Priority 0: ZTA, Security, Performance & CISO

#### Correctness Fixes

**Fixed `backDelay` timer — expires quadratically fast at 60 fps**

- **Issue**: In pause mode (`m=1`), `next -= dt` is called every frame but `last` is never reset, causing `dt` to grow linearly (16ms, 32ms, 48ms…). This makes `next` decrease quadratically, so an 800ms `backDelay` expires in ~160ms (10 frames) instead of the configured value.
- **Fix**: Record `pauseStart = t` when entering `m=1` and replace the countdown with `if (t - pauseStart >= bd)` to ensure accurate timing.
- **File**: `packages/core/src/index.js`
- **Impact**: Users now get accurate backDelay timing regardless of frame rate.

**Fixed memory leak — `visibilitychange` listener never removed on `destroy()`**

- **Issue**: Every call to `U(el, opts)` permanently attaches a `document.addEventListener('visibilitychange', handler)` that is never cleaned up. In SPAs (React, Vue, Svelte) where components mount/unmount on navigation, each page visit accumulates another listener holding the entire instance closure in memory.
- **Fix**: Store the handler reference and call `document.removeEventListener` inside both `stop()` and `destroy()`.
- **File**: `packages/core/src/index.js`
- **Impact**: Prevents memory leaks in SPA applications with multiple UltraTyped instances.

**Fixed crash on detached DOM — `el.parentNode` null dereference**

- **Issue**: `el.parentNode.insertBefore(cursorEl, el.nextSibling)` throws `TypeError` when `showCursor: true` and `el` has no parent node. This occurs during SSR hydration, testing with JSDOM, or elements created but not yet attached to the document.
- **Fix**: Add null guard: `if (el && el.parentNode)` before cursor insertion.
- **File**: `packages/core/src/index.js`
- **Impact**: Prevents crashes in SSR environments and testing frameworks.

**Fixed React adapter stale options closure — prop changes silently ignored**

- **Issue**: `useEffect(fn, [])` with an empty dependency array captures `options` at mount time forever. Changing `strings`, `typeSpeed`, or any other prop after mount has zero effect on the running animation.
- **Fix**: Add `options` to the dependency array and change cleanup from `stop()` to `destroy()` for proper re-initialization.
- **File**: `packages/react/src/index.ts`
- **Impact**: React components now properly respond to prop changes.

**Fixed TypeScript `UltraTypedOptions` interface — 80% of the API surface is untyped**

- **Issue**: The interface declares only 5 options (`strings`, `typeSpeed`, `backSpeed`, `backDelay`, `loop`) and the instance type is missing `start()` and `destroy()`. All new options fall through as untyped, causing TypeScript users to lose type safety and IDE autocomplete.
- **Fix**: Added all missing options (loopCount, shuffle, showCursor, cursorChar, autoInsertCss, startDelay, contentType, attr, stringsElement, all callbacks) and all instance methods to the interface.
- **File**: `packages/typescript/src/index.ts`
- **Impact**: TypeScript users now have full type coverage and IDE autocomplete support.

#### Security Fixes

**Fixed XSS sink — `el.innerHTML = buf` with `contentType: 'html'` has no sanitization and no warning**

- **Issue**: When `contentType: 'html'` is set, the full `strings` content is injected via `innerHTML` with zero sanitization. If strings originate from untrusted sources (CMS, API response, URL query params), this is a stored XSS vector.
- **Fix**: Added prominent JSDoc `@warning` in the file header and a detailed security warning section in README with examples of safe vs unsafe usage.
- **Files**: `packages/core/src/index.js`, `README.md`
- **Impact**: Developers are now warned about XSS risks and provided with safe usage patterns.

**Fixed CSP incompatibility — `autoInsertCss` injects `<style>` without a nonce**

- **Issue**: Dynamic `<style>` injection is silently blocked by any `Content-Security-Policy: style-src 'self'` (no `unsafe-inline`) policy, which is standard in security-hardened web apps. Without a nonce, the cursor animation CSS never loads.
- **Fix**: Expose a `nonce` option and apply it to the created style element when provided.
- **File**: `packages/core/src/index.js`
- **Impact**: UltraTyped now works with strict CSP policies when nonce is provided.

**Fixed `sideEffects: false` in core `package.json` — silently incorrect, risk of tree-shaking erasure**

- **Issue**: The library has real side effects (appends `<style>` to `document.head`, inserts cursor `<span>` into the DOM, registers `visibilitychange` on `document`). Declaring `"sideEffects": false` tells bundlers it is safe to eliminate the import entirely during aggressive tree-shaking, which can cause the animation to never initialize.
- **Fix**: Removed the incorrect `"sideEffects": false` field from package.json.
- **File**: `packages/core/package.json`
- **Impact**: Prevents bundlers from incorrectly tree-shaking away the import.

#### Performance Fixes

**Fixed unnecessary DOM writes every rAF frame during back-delay pause**

- **Issue**: `el.textContent = buf` or `el.innerHTML = buf` is called unconditionally at the end of every `step()` invocation, including during `m=1` (pause phase) where the buffer content does not change. Each write triggers a layout/style recalculation. At 60fps during an 800ms pause this causes ~50 redundant DOM mutations.
- **Fix**: Cache the last written value and skip the DOM write when `buf === prevBuf`.
- **File**: `packages/core/src/index.js`
- **Impact**: Reduces DOM mutations by ~50 per 800ms pause, improving performance and battery life.

## [Typed.js Parity & Migration]

### Compatibility Shim

**Published `@ultratyped/typed-compat` package**

- Created a drop-in compatibility shim that mirrors the Typed.js v2 constructor API (`new Typed(el, opts)`) exactly.
- Delegates to the UltraTyped core with zero behavior changes for existing Typed.js users.
- **Package**: `@ultratyped/typed-compat`
- **Impact**: Enables instant migration from Typed.js with zero code changes.

**Mapped all Typed.js option names to UltraTyped equivalents**

- All Typed.js options are mapped: typeSpeed, backSpeed, backDelay, loop, loopCount, showCursor, cursorChar, attr, smartBackspace, shuffle, fadeOut, fadeOutDelay, fadeOutClass, strings, stringsElement, startDelay, onBegin, onComplete, onStringTyped, preStringTyped, onLastStringBackspaced, onTypingPaused, onTypingResumed, onReset, onStop, onStart, onDestroy.
- **Impact**: 100% API compatibility with Typed.js v2.

### Core Options (14 New Options)

**Cursor Options**

- `showCursor: true` — render a blinking cursor `<span>` adjacent to the typed element
- `cursorChar: '|'` — customizable cursor character
- `autoInsertCss: true` — auto-inject `@keyframes blink` CSS once per page

**Timing Options**

- `startDelay: 0` — milliseconds to wait before the very first character is typed
- `loopCount: Infinity` — loop N times then stop (previously only boolean `loop`)
- `typingVariance: 0` — add ±N ms random jitter per character for a human-like feel

**String Options**

- `shuffle: false` — randomize string order on each loop
- `stringsElement: null` — read strings from a DOM element's children instead of `strings` array
- `smartBackspace: true` — expose as a toggleable option (previously always on, undocumented)

**Visual Options**

- `fadeOut: false` — fade the element out instead of backspacing
- `fadeOutDelay: 500` — delay in ms before fade starts
- `fadeOutClass: 'typed-fade-out'` — CSS class applied during fade

**Interaction Options**

- `attr: null` — type into an element attribute (e.g. `placeholder`, `value`, `title`) instead of text content
- `bindInputFocusEvents: false` — pause typing when a nearby `<input>` or `<textarea>` gains focus

### Callbacks (11 New Callbacks)

**Lifecycle Callbacks**

- `onBegin(self)` — fires once before the first character is typed
- `onComplete(self)` — fires when all strings have been typed (end of final loop)
- `onDestroy(self)` — fires on `destroy()`

**String Callbacks**

- `preStringTyped(arrayPos, self)` — fires before each string begins typing
- `onStringTyped(arrayPos, self)` — fires after each string is fully typed
- `onLastStringBackspaced(self)` — fires when the last string has been fully erased

**State Callbacks**

- `onTypingPaused(arrayPos, self)` — fires when animation pauses (back-delay period)
- `onTypingResumed(arrayPos, self)` — fires when animation resumes from pause
- `onReset(self)` — fires on `reset()`
- `onStop(arrayPos, self)` — fires on `stop()`
- `onStart(arrayPos, self)` — fires on `start()`

### Instance Methods (5 New Methods)

**Control Methods**

- `pause()` — pause animation without losing current state
- `resume()` — resume from exactly where `pause()` stopped
- `destroy()` — stop, remove cursor element, clear text content, null all refs
- `start()` — (re)start animation after a manual `stop()`; `reset()` should not be required to restart
- `toggle()` — convenience: pause if running, resume if paused

### Documentation

**Migration Guide**

- Wrote comprehensive migration guide from Typed.js v2 → UltraTyped with side-by-side code comparison and bundle size savings.
- **File**: `docs/MIGRATION.md`

**Feature Comparison Table**

- Added Typed.js feature comparison table to README (size, fps, deps, cursor, callbacks, SSR, accessibility).
- **File**: `README.md`
