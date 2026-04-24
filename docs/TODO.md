# UltraTyped.js - Professional Package Roadmap

This document outlines the comprehensive requirements to make UltraTyped.js a professional, production-ready package/library/framework for global use.

---

## Documentation

### API Documentation

### User Guides

- [ ] **Migration guide from Typed.js** (highest SEO and conversion value — target "typed.js alternative" searches)
- [ ] Migration guide from typewriter-effect
- [ ] Troubleshooting guide
- [ ] Best practices guide
- [ ] Performance optimization guide
- [ ] Security best practices guide

### Examples Gallery

- [ ] Create examples for each framework
- [ ] Interactive examples playground
- [ ] Code snippets for common use cases
- [ ] Advanced usage examples
- [ ] Integration examples with popular tools
- [ ] **StackBlitz live examples** embedded in README for every framework (lowers friction for first-time evaluators)
- [ ] **CodeSandbox templates** for React, Vue, Svelte
- [ ] Typed.js vs UltraTyped side-by-side benchmark page (fps, bundle size, memory)
- [ ] `ARCHITECTURE.md` explaining the rAF loop, tokenizer, and diff algorithm (required for first-time contributors)

### Video Tutorials

- [ ] Quick start video (5-10 min)
- [ ] Framework-specific tutorials
- [ ] Advanced configuration tutorial
- [ ] Performance optimization tutorial

### Internationalization (i18n)

- [ ] Translate README to major languages
  - Spanish
  - French
  - German
  - Japanese
  - Chinese (Simplified)
  - Portuguese
  - Russian
- [ ] Translate API documentation
- [ ] Translate guides and tutorials

---

## Developer Experience

### Code Quality Tools

- [ ] Set up ESLint with comprehensive rules
  - JavaScript/TypeScript rules
  - Framework-specific rules (React, Vue, etc.)
  - Security rules (eslint-plugin-security)
- [ ] Set up Prettier for code formatting
- [ ] Configure ESLint + Prettier integration
- [ ] Add pre-commit hooks (Husky)
- [ ] Add lint-staged for staged file linting
- [ ] Configure commitlint for commit message linting

### Contribution Guidelines

- [ ] Create CONTRIBUTING.md
  - Development setup instructions
  - Code style guidelines
  - Pull request process
  - Testing requirements
  - Documentation requirements
- [ ] Create CODE_OF_CONDUCT.md
- [ ] Create ISSUE_TEMPLATE
  - Bug report template
  - Feature request template
  - Documentation issue template
- [ ] Create PULL_REQUEST_TEMPLATE
- [ ] Add GitHub issue forms
- [ ] Add GitHub PR templates

### Development Tools

- [ ] Configure VS Code workspace settings
- [ ] Add recommended VS Code extensions
- [ ] Create .editorconfig
- [ ] Add debug configurations for VS Code
- [ ] Set up local development scripts

### Release Automation

- [ ] Set up semantic-release
- [ ] Automate CHANGELOG generation
- [ ] Automate version bumping
- [ ] Automate GitHub releases
- [ ] Configure release notes generation

---

## Build Infrastructure

These gaps block key distribution scenarios (CDN users, package consumers) and are prerequisites for a v1.1 release.

### IIFE/UMD Bundle

- [ ] **Add IIFE build output** to core Rollup config — required for `<script src="...">` CDN usage; without it, non-bundler users (WordPress, plain HTML sites) cannot use the library
- [ ] Expose `window.UltraTyped` global in IIFE build
- [ ] Add CDN `<script>` usage examples to README once IIFE build exists

### Package Quality Checks

- [ ] **Add `publint`** to CI — validates that `package.json` `exports`, `main`, `module`, and `types` fields actually resolve to the declared files before publish
- [ ] **Add `are-the-types-wrong`** check — validates TypeScript declaration files are correct for all module formats (ESM/CJS)
- [ ] **Add `size-limit`** — enforce hard bundle-size ceiling in CI (fail if core exceeds 2KB gzipped); currently only a badge claim with no enforcement

### Monorepo Versioning

- [ ] **Migrate to Changesets** — replaces single semantic-release with per-package independent versioning; adapters can release at different cadences than core
- [ ] Configure `@changesets/action` in CI for automated publish on merge

### Build Tooling

- [ ] **Evaluate `tsup` or `pkgroll`** as a simpler alternative to 10 separate Rollup configs — each adapter currently has its own `rollup.config.js`; a shared config or zero-config tool reduces maintenance surface significantly

### npm Discoverability

- [ ] **Expand keywords** in `packages/core/package.json` to include: `"typed.js"`, `"typewriter-effect"`, `"text animation"`, `"cursor"`, `"animated text"`, `"hero text"`, `"typing effect"`, `"landing page"`, `"react"`, `"vue"`, `"svelte"`, `"angular"` — these mirror search terms users actually type on npm
- [ ] Add `"repository"`, `"homepage"`, and `"bugs"` fields to all `package.json` files
- [ ] Update core `description` to mention "drop-in replacement for Typed.js" and "smallest in class"
- [ ] Add `"funding"` field to `package.json` (GitHub Sponsors) once sponsorship is set up

---

## Security

### Dependency Management

- [ ] Add `.github/dependabot.yml` config to enable Dependabot for npm and GitHub Actions updates
  - Security alerts
  - Version updates with grouped PRs
  - Pull request automation
- [ ] Set up Renovate as alternative/complement to Dependabot
- [ ] Configure automated security updates
- [ ] Add `npm audit --audit-level=high` gate to CI (fail build on high/critical vulns)
- [ ] Schedule weekly dependency audits in CI
- [ ] **Remove `legacy-peer-deps=true` from `.npmrc`** — silently ignores peer-dep conflicts, masking real version mismatches; resolve peer deps explicitly instead

### Security Scanning

- [ ] **Add `.github/workflows/codeql.yml`** — CodeQL static analysis for JavaScript/TypeScript (free via GitHub Advanced Security)
- [ ] Set up Snyk for security scanning and integrate with CI/CD
- [ ] Add OWASP dependency check
- [ ] **Add `eslint-plugin-security`** to ESLint config (catches unsafe regex, `innerHTML` misuse, `eval`)
- [ ] **Pin all GitHub Actions to full SHA hashes** instead of mutable `@v4`/`@v3` tags to prevent supply chain attacks via tag hijacking
  - `actions/checkout@<sha>`
  - `actions/setup-node@<sha>`
  - `actions/upload-artifact@<sha>`
  - `peaceiris/actions-gh-pages@<sha>`

### Security Audits

- [ ] Conduct external security audit (third-party pentest)
- [ ] Penetration testing scoped to XSS, DOM manipulation, resource exhaustion
- [ ] Vulnerability assessment
- [ ] **Fix `security@example.com` placeholder** in `SECURITY.md` and `COMPLIANCE.md` — replace with real contact or GitHub private vulnerability reporting URL
- [ ] **Fix incorrect CSP recommendation** in `SECURITY.md` and `COMPLIANCE.md` — currently recommends `script-src 'unsafe-inline'` which defeats CSP; correct recommendation is `script-src 'self'` with nonce for inline styles only

### Supply Chain Security

- [ ] **Add `--provenance` flag to all `npm publish` steps** in `release.yml` — generates SLSA provenance attestation, verifiable on npm registry
- [ ] Add `engines` field to all `package.json` files (declare minimum Node/npm version)
- [ ] Generate and publish SBOM (CycloneDX format) as a GitHub Release asset
- [ ] **Run tests before publish in `release.yml`** — current pipeline publishes immediately after build with no test gate
- [ ] Add `--access public` to npm publish commands to prevent accidental private publish
- [ ] Add package integrity verification (checksum in release notes)
- [ ] Add `"sideEffects": false` correctly to core — current absence means bundlers may not tree-shake properly

### Security Documentation

- [ ] Move `SECURITY.md` to repo root (GitHub natively surfaces `SECURITY.md` at root for the "Report a vulnerability" button)
- [ ] Add `.github/SECURITY.md` to enable GitHub's private vulnerability reporting
- [ ] Document vulnerability disclosure process with actual contact info
- [ ] Document CSP integration guide with correct header examples
- [ ] Document DOMPurify integration pattern for `contentType: 'html'` users
- [ ] Add security changelog section to `CHANGELOG.md`

---

## Distribution

### CDN Distribution

- [ ] Set up jsDelivr CDN
  - Configure jsDelivr for all packages
  - Test CDN endpoints
  - Add CDN documentation
- [ ] Set up unpkg CDN
- [ ] Set up cdnjs CDN (requires application)
- [ ] Add CDN usage examples in docs
- [ ] Configure CDN caching headers

### Package Verification

- [ ] Add package integrity verification
- [ ] Configure npm provenance
- [ ] Add package signing
- [ ] Document verification process

### Multiple Registry Support

- [ ] Test with npm
- [ ] Test with yarn
- [ ] Test with pnpm
- [ ] Test with bun
- [ ] Add installation docs for each

### Package Optimization

- [ ] Optimize bundle sizes further
- [ ] Add tree-shaking support
- [ ] Add sideEffects configuration
- [ ] Optimize TypeScript declarations
- [ ] Minimize peer dependencies

---

## Performance & Reliability

### Performance Monitoring

- [ ] Set up Bundlephobia integration
- [ ] Add bundle size badges
- [ ] Monitor bundle size in CI
- [ ] Add size limit checks
- [ ] Configure size limits in CI

### Performance Benchmarks

- [ ] Create automated benchmark dashboard
- [ ] Compare with competitors
- [ ] Track performance over time
- [ ] Add performance regression tests
- [ ] Publish benchmark results

### Error Tracking

- [ ] Integrate Sentry for error tracking
  - Set up Sentry project
  - Add error boundaries
  - Track production errors
  - Configure alerts
- [ ] Add error reporting in adapters
- [ ] Document error handling

### Reliability

- [ ] Add graceful degradation
- [ ] Add fallback mechanisms
- [ ] Test for memory leaks
- [ ] Add performance monitoring
- [ ] Add uptime monitoring

### Performance Roadmap

#### Planned Optimizations

- [ ] Web Worker support for off-main-thread typing
- [ ] GPU acceleration for complex animations
- [ ] Intersection Observer for lazy loading
- [ ] RequestIdleCallback for background processing
- [ ] Automated performance benchmarks in CI

#### Research Areas

- [ ] WASM implementation for critical paths
- [ ] Adaptive quality based on device capabilities
- [ ] Predictive pre-rendering
- [ ] Streaming string processing

---

## Accessibility

### ARIA Support

- [ ] **Auto-add `role="status"` and `aria-live="polite"`** to the typed element at init — enables screen readers to announce each completed string without requiring manual markup from the caller
- [ ] **Auto-add `role="presentation"` to cursor `<span>`** so screen readers skip the blinking cursor character
- [ ] Add configurable `ariaLabel` option for a persistent accessible label (e.g. `"Animated headline"`) that screen readers read instead of the live animation
- [ ] Add ARIA labels
- [ ] Add ARIA descriptions
- [ ] Test with screen readers
  - NVDA
  - JAWS
  - VoiceOver
  - TalkBack

### Keyboard Navigation

- [ ] Ensure keyboard accessibility
- [ ] Add keyboard shortcuts
- [ ] Test keyboard navigation
- [ ] Document keyboard controls

### Screen Reader Compatibility

- [ ] Test with all major screen readers
- [ ] Add screen reader announcements
- [ ] Optimize for screen reader performance
- [ ] Document screen reader behavior

### WCAG Compliance

- [ ] WCAG 2.1 Level AA compliance
- [ ] **WCAG 2.2 Level AA compliance** (published 2023, now the current standard — not "when available")
- [ ] Accessibility audit
- [ ] Accessibility statement
- [ ] VPAT documentation

### Visual Accessibility

- [ ] Support for reduced motion preferences
- [ ] High contrast mode support
- [ ] Color blindness considerations
- [ ] Font size scaling support

---

## Internationalization (i18n)

### RTL Support

- [ ] Add right-to-left (RTL) language support
- [ ] Test RTL layout
- [ ] Add RTL documentation
- [ ] Add RTL examples

### Localization

- [ ] Support for international characters
- [ ] Unicode support
- [ ] Emoji support
- [ ] Multi-byte character handling

### Time Zone Support

- [ ] Time zone aware typing (if applicable)
- [ ] Date/time localization
- [ ] Number formatting

---

## Community & Support

### Communication Channels

- [ ] Set up Discord server
  - General discussion
  - Help channels
  - Announcements
  - Framework-specific channels
- [ ] Set up Slack workspace (alternative)
- [ ] Create GitHub Discussions
- [ ] Configure GitHub Discussions categories
- [ ] Set up mailing list

### Support Channels

- [ ] Create Stack Overflow tag (ultratyped)
- [ ] Add Stack Overflow link to docs
- [ ] Configure issue triage
- [ ] Set up response time SLAs
- [ ] Create support guidelines

### Community Building

- [ ] Create contributor recognition program
- [ ] Set up contributor leaderboard
- [ ] Add Hall of Fame
- [ ] Organize community events
- [ ] Create community showcase

### Roadmap

- [ ] Create public roadmap
- [ ] Use GitHub Projects for roadmap
- [ ] Add roadmap to website
- [ ] Regular roadmap updates
- [ ] Community voting on features

### Changelog Automation

- [ ] Set up automated changelog
- [ ] Configure conventional commits
- [ ] Add release notes automation
- [ ] Publish release notes to GitHub
- [ ] Add changelog to website

---

## Ecosystem

### Plugin System

- [ ] Design plugin architecture
- [ ] Create plugin API
- [ ] Document plugin development
- [ ] Create example plugins
- [ ] Set up plugin registry

### Theme Support

- [ ] Add theming support
- [ ] Create default themes
- [ ] Document theme creation
- [ ] Theme marketplace (future)
- [ ] Community themes

### Presets & Templates

- [ ] Create common presets
- [ ] Add starter templates
- [ ] Framework-specific templates
- [ ] Use case-specific templates
- [ ] Template gallery

### Integrations

- [ ] **Next.js `<UltraTyped>` component** — `'use client'` directive, SSR-safe (no `window` access on server), exported from `@ultratyped/react/next`; the hook alone doesn't work in Next.js App Router without this wrapper
- [ ] **Nuxt composable** — `useUltraTyped` with auto `onBeforeUnmount` cleanup exported from `@ultratyped/vue/nuxt`
- [ ] SvelteKit integration
- [ ] Remix integration
- [ ] Gatsby integration
- [ ] Webpack plugin
- [ ] Vite plugin
- [ ] Rollup plugin
- [ ] esbuild plugin

### Tools

- [ ] CLI tool for scaffolding
- [ ] Code generators
- [ ] Migration tools
- [ ] Configuration validators
- [ ] Performance profilers

---

## Marketing & Promotion

### Website

- [ ] Professional landing page
- [ ] Interactive demos
- [ ] Feature showcase
- [ ] Case studies
- [ ] Testimonials
- [ ] Blog section
- [ ] Newsletter signup

### Social Media

- [ ] Twitter/X account
- [ ] LinkedIn page
- [ ] GitHub Stars promotion
- [ ] Reddit promotion
- [ ] Hacker News posts
- [ ] Dev.to articles

### Content Marketing

- [ ] Technical blog posts
- [ ] Tutorial videos
- [ ] Conference talks
- [ ] Podcast appearances
- [ ] Guest articles

### SEO

- [ ] SEO optimization for website
- [ ] Open Graph tags
- [ ] Twitter cards
- [ ] Schema markup
- [ ] Sitemap.xml
- [ ] Robots.txt

---

## Legal & Compliance

### Licensing

- [ ] Review license choice (MIT)
- [ ] Add LICENSE file to all packages
- [ ] Document license usage
- [ ] Add third-party licenses
- [ ] License compliance check

### Privacy

- [ ] Privacy policy
- [ ] Data handling documentation
- [ ] GDPR compliance
- [ ] CCPA compliance
- [ ] Cookie policy

### Terms of Service

- [ ] Terms of service for website
- [ ] Terms for API usage
- [ ] Terms for community guidelines
- [ ] Terms for contribution

### Trademarks

- [ ] Trademark registration
- [ ] Trademark usage guidelines
- [ ] Logo usage guidelines
- [ ] Brand guidelines

---

## Infrastructure

### Hosting

- [ ] Professional domain name
- [ ] SSL/TLS configuration
- [ ] CDN configuration
- [ ] DDoS protection
- [ ] Backup strategy
- [ ] Disaster recovery plan

### Monitoring

- [ ] Uptime monitoring
- [ ] Performance monitoring
- [ ] Error monitoring
- [ ] User analytics
- [ ] SEO monitoring
- [ ] Security monitoring

### Analytics

- [ ] Set up Google Analytics
- [ ] Set up privacy-friendly analytics (Plausible)
- [ ] Track usage metrics
- [ ] Track error rates
- [ ] Track performance metrics
- [ ] Document analytics privacy policy

---

## Quality Metrics

### Code Quality

- [ ] Maintainability Index
- [ ] Code complexity metrics
- [ ] Technical debt tracking
- [ ] Code review coverage
- [ ] Test coverage metrics
- [ ] **Set coverage thresholds to 90%** (currently 80% in `vitest.config.ts`) for lines, branches, functions, statements
- [ ] **Add mutation testing** (Stryker) — current tests assert `not.toThrow()` but rarely assert DOM state; mutation testing will surface false-green tests
- [ ] **Add static analysis** (SonarQube/SonarCloud free tier) to CI — track complexity, duplication, and technical debt score
- [ ] **Add `no-floating-promises` and `strict-boolean-expressions` ESLint rules** once ESLint is configured
- [ ] **Audit and delete phantom API docs** — `PERFORMANCE.md` documents `onFrame` and `debug` options that don't exist in `src/index.js`; either implement or remove

### Test Quality Improvements

- [ ] **Replace `expect(instance).toBeDefined()` smoke tests** with behavioral assertions (check `el.textContent` content after advancing fake timers)
- [ ] **Add timer-based integration tests** using `vi.useFakeTimers()` + `vi.advanceTimersByTime()` to test actual typing output, not just no-throw
- [ ] **Add React adapter re-render test** — verify that passing a new options object doesn't cause destroy/recreate on every render
- [ ] **Add test: global cursor style element removed on last instance destroy**
- [ ] **Add test: `destroy()` writes correct content type** (no double write)
- [ ] **Add test: TypeScript types compile cleanly** using `tsd` or `dtslint` in CI
- [ ] Expand E2E coverage beyond `e2e/basic.spec.ts` — test loop completion, callbacks, cursor behavior

### User Satisfaction

- [ ] NPS (Net Promoter Score)
- [ ] User surveys
- [ ] Feedback collection
- [ ] Issue response time
- [ ] Issue resolution time

### Adoption Metrics

- [ ] npm download counts
- [ ] GitHub stars
- [ ] GitHub forks
- [ ] Website traffic
- [ ] Community members
- [ ] Contributors count

---

## Advanced Features

### Animation Enhancements

- [ ] Custom easing functions
- [ ] Animation presets
- [ ] Pause/resume functionality
- [ ] Speed control during animation
- [ ] Cursor customization
- [ ] Blinking cursor support
- [ ] Multiple cursor styles

### Advanced Typing Effects

- [ ] Typing sounds
- [ ] Typing delays between words
- [ ] Smart punctuation handling
- [ ] HTML content typing
- [ ] Markdown support
- [ ] Syntax highlighting support
- [ ] **Per-string configuration** — allow strings array to accept objects `{text, typeSpeed, backSpeed, delay}` so each string can have its own timing
- [ ] **Reveal mode** — word-by-word or line-by-line reveal as an alternative to character-by-character typing; useful for subtitle-style animations
- [ ] **Teletype / append-only mode** — no backspacing; each string appends on a new line; common for terminal/log UIs

### New Distribution Formats

- [ ] **`<ultra-typed>` Web Component** — zero-framework custom element usable in plain HTML: `<ultra-typed strings="Hello,World" speed="80"></ultra-typed>`; broadens the audience to non-framework users significantly
- [ ] **`<UltraTyped>` React component** (not just a hook) — enables declarative JSX: `<UltraTyped strings={[...]} speed={80} />`; the hook-only API requires users to manage refs manually

### Performance Enhancements

- [ ] Web Worker support
- [ ] Offscreen canvas
- [ ] GPU acceleration
- [ ] **Intersection Observer mode** — `startWhenVisible: true` option delays animation until the element scrolls into view; prevents wasted cycles on hero sections that are below the fold on mobile
- [ ] Lazy loading
- [ ] RequestIdleCallback support

### Accessibility Enhancements

- [ ] Reduced motion support
- [ ] High contrast mode
- [ ] Screen reader optimizations
- [ ] Keyboard shortcuts
- [ ] Focus management

---

## Maintenance & Sustainability

### Maintenance Plan

- [ ] Regular dependency updates
- [ ] Monthly security audits
- [ ] Quarterly performance reviews
- [ ] Annual security audits
- [ ] Deprecation policy
- [ ] Support policy (version support timeline)

### Funding

- [ ] Sponsorship setup (GitHub Sponsors)
- [ ] Open Collective setup
- [ ] Patreon setup
- [ ] Enterprise support options
- [ ] Consulting services
- [ ] Training and workshops

### Governance

- [ ] Steering committee
- [ ] Governance model
- [ ] Decision-making process
- [ ] Conflict resolution
- [ ] Community governance

---

## CISO & Zero Trust Architecture (ZTA)

### ZTA Posture — Current Gaps

> These items close the delta between the *claimed* ZTA posture in `SECURITY.md`/`COMPLIANCE.md` and the *actual* implementation.

- [ ] **Verify Explicitly — CI pipeline has no test gate before publish** (`release.yml` builds then publishes with no `npm test` step)
- [ ] **Verify Explicitly — GitHub Actions use mutable version tags** (`@v4`, `@v3`) instead of SHA-pinned refs; a compromised action tag can exfiltrate `NPM_TOKEN`
- [ ] **Least Privilege — `GITHUB_TOKEN` permissions not scoped** in workflows; add explicit `permissions:` blocks (e.g., `contents: read`, `id-token: write` for provenance)
- [ ] **Least Privilege — npm publish has no 2FA enforcement** in automation; enable `npm token create --type=automation` tokens bound to the publishing scope
- [ ] **Assume Breach — No SLSA provenance** on published packages; consumers cannot verify the package was built from the declared source commit
- [ ] **Assume Breach — `security@example.com` placeholder** in disclosure docs means there is no active incident response channel
- [ ] **Micro-segmentation — `legacy-peer-deps=true`** suppresses npm's dependency conflict detection, widening the blast radius of transitive version conflicts

### ZTA Controls — Implementation Tasks

- [ ] Add `permissions:` blocks to all GitHub Actions workflow jobs (principle of least privilege)
  ```yaml
  permissions:
    contents: read
    id-token: write   # required for npm provenance
  ```
- [ ] Enable branch protection rules on `main`: require PR reviews, require status checks (CI + bundle-size), block force-push
- [ ] Enable GitHub repository security settings: secret scanning, push protection, private vulnerability reporting
- [ ] Add `CODEOWNERS` file to require security-team review on changes to `src/`, `rollup.config.js`, and workflow files
- [ ] Configure npm `publishConfig` to use `--provenance` and scope to public registry
- [ ] Add `npm audit` as a required CI gate (currently not in `ci.yml`)
- [ ] Create GitHub Environment `npm-publish` with required reviewers for manual approval before release
- [ ] Rotate `NPM_TOKEN` quarterly; document rotation procedure in runbook

### CISO Posture — Documentation Gaps

- [ ] **Fix CSP recommendation in `SECURITY.md` line 88** — recommends `unsafe-inline` which negates CSP protections; correct to use nonce-based inline style allowance
- [ ] **Fix CSP recommendation in `COMPLIANCE.md` line 402** — same issue
- [ ] Add **SLSA Level 2** compliance statement once provenance is enabled
- [ ] Add **CycloneDX SBOM** generation step to release workflow; attach SBOM to GitHub Release
- [ ] Add Trusted Types policy documentation for environments with `require-trusted-types-for 'script'` CSP directive
- [ ] Publish a **Vendor Security Questionnaire (VSQ)** template that enterprise customers can use to pre-approve the library
- [ ] Add **FedRAMP-ready checklist** noting client-side-only scope
- [ ] Document `onFrame` and `debug` options accurately — `PERFORMANCE.md` documents them but they don't exist in the implementation

### CISO Posture — Runtime Security Controls

- [ ] **Add runtime input sanitization guard for `contentType: 'html'`** — when HTML mode is detected, emit a `console.warn` in development builds and document the required DOMPurify integration
- [ ] **Add Trusted Types compatible output path** — expose `setInnerHTMLFromTrustedType(el, TrustedHTML)` for environments enforcing Trusted Types policies
- [ ] Add `crossorigin="anonymous"` documentation for CDN usage (prevents credential leakage via CORS)
- [ ] Add Subresource Integrity (SRI) hash generation to release workflow for CDN consumers

---

## Priority Matrix

### Priority 0 — Do Before Any Release or Promotion

- **Correctness**: `backDelay` expires quadratically fast (quadratic countdown bug in `m=1`); `visibilitychange` listener never removed on `destroy()` (memory leak in SPAs); `el.parentNode` null crash with detached DOM; React adapter `[options]` dep causes destroy/recreate on every render since object identity changes each call; TypeScript `index.d.ts` covers only 5 of 23 documented options (missing `stringsElement`, `showCursor`, `cursorChar`, `nonce`, `loopCount`, `shuffle`, `fadeOut`, `attr`, `typingVariance`, all callbacks, `pause`, `resume`, `toggle`, `destroy`)
- **Security**: `contentType: 'html'` is an unsanitized XSS sink with no runtime warning; `autoInsertCss` global `<style>` element is never removed by `destroy()` even when the last instance is torn down; `"sideEffects"` field missing from core `package.json` (not just incorrect — absent); `SECURITY.md` and `COMPLIANCE.md` both recommend `unsafe-inline` CSP which defeats XSS protection; `security@example.com` is a placeholder with no real incident channel
- **CI/CD Security**: GitHub Actions use mutable version tags — a compromised `@v4` tag can steal `NPM_TOKEN`; `release.yml` publishes with no test gate; no `permissions:` scoping on any workflow job
- **Performance**: `destroy()` always writes both `el.textContent = ""` then `el.innerHTML = ""` regardless of `contentType` — causes two unnecessary DOM mutations; multiple `cancelAnimationFrame` calls don't guard against `undefined` raf handle on very first frame

### High Priority (Do First)

- **Typed.js Parity**: cursor, all callbacks, all missing options, `@ultratyped/typed-compat` shim, migration guide — this is the primary download driver
- **Build Infrastructure**: IIFE bundle (blocks CDN users), `publint`, `size-limit`, npm keywords, `repository`/`homepage` fields
- Testing & Quality Assurance
- Security (Dependabot, Snyk, CodeQL)
- Documentation (API docs, Typed.js migration guide, StackBlitz examples)
- Developer Experience (ESLint, Prettier, Husky)
- Distribution (CDN, package verification)

### Medium Priority (Do Next)

- Accessibility (ARIA auto-injection, keyboard navigation, WCAG 2.2)
- Next.js / Nuxt.js SSR-safe components
- `<ultra-typed>` Web Component + `<UltraTyped>` React component
- Performance Monitoring (Bundlephobia, benchmarks, Typed.js comparison page)
- Community (Discord, Discussions)
- Internationalization (RTL, i18n)
- Ecosystem (plugins, themes)

### Low Priority (Do Later)

- Marketing & Promotion
- Advanced Features (per-string config, reveal mode, teletype, Intersection Observer)
- Video Tutorials
- Multi-language documentation
- Funding & Governance

---

## Estimated Timeline

### Phase 0: Critical Fixes (1-2 weeks — non-negotiable before any other work ships)

- ~~Fix animation timing~~ ✓ (`last` only updates when a token is consumed)
- ~~Fix Visibility API resume guard~~ ✓ (`stopped` flag guards the resume path)
- Fix `backDelay` quadratic countdown bug (`pauseStart` timestamp approach)
- Fix `visibilitychange` memory leak (store handler ref, remove in `destroy()`)
- Fix `el.parentNode` null crash (guard before cursor insertion)
- **Fix React adapter infinite re-render** — `useEffect([options])` recreates instance every render because object literal identity changes; fix by destructuring stable primitive deps or using `useRef` to hold the options
- **Fix TypeScript `index.d.ts`** — currently exposes only 5 of 23 options; add all missing fields and extend `UltraTypedInstance` with `pause()`, `resume()`, `toggle()`, `destroy()`
- Fix `contentType: 'html'` XSS — add `console.warn` in dev + DOMPurify integration guide
- ~~Fix `autoInsertCss` CSP incompatibility~~ ✓ (`nonce` option implemented in source)
- **Add `"sideEffects": false` to core `package.json`** — field is currently absent
- ~~Fix redundant DOM writes during pause phase~~ ✓ (`prevBuf` cache implemented)
- **Fix `destroy()` double DOM write** — currently always sets both `textContent` and `innerHTML` to `""` regardless of `contentType`; use a single conditional write
- **Fix global cursor `<style>` leak** — `autoInsertCss` injects a shared `#ultratyped-cursor-style` element that is never removed; track instance count and remove on last `destroy()` call
- **Pin GitHub Actions to SHA hashes** in all three workflow files — security fix for supply chain attacks
- **Add `npm test` step before publish** in `release.yml`
- **Add `permissions:` scoping** to all workflow jobs
- **Fix `security@example.com` placeholder** in `SECURITY.md` and `COMPLIANCE.md`
- **Fix `unsafe-inline` CSP recommendation** in `SECURITY.md` line 88 and `COMPLIANCE.md` line 402

### Phase 1: Typed.js Parity + Build Infrastructure + CI Security (3-4 weeks)

- Cursor feature (`showCursor`, `cursorChar`, `autoInsertCss`)
- All missing options (`startDelay`, `loopCount`, `shuffle`, `fadeOut`, `attr`, `typingVariance`, `bindInputFocusEvents`)
- All lifecycle callbacks
- `pause()` / `resume()` / `destroy()` / `start()` on core instance
- `@ultratyped/typed-compat` shim + migration guide
- IIFE/UMD build
- `publint` + `size-limit` + `are-the-types-wrong` in CI
- npm keywords + `repository`/`homepage` fields
- **Add Dependabot config** (`.github/dependabot.yml`) for npm + Actions
- **Add CodeQL workflow** (`.github/workflows/codeql.yml`)
- **Add `npm audit` gate to `ci.yml`**
- **Enable `--provenance` on all npm publish steps**
- **Add `CODEOWNERS` file** for security-sensitive paths
- **Add GitHub Environment with required reviewers** for `npm-publish`

### Phase 2: Foundation (2-3 weeks)

- Testing setup (Playwright E2E)
- Security scanning (Snyk, CodeQL)
- Developer experience tools (ESLint, Prettier, Husky, commitlint)
- Basic documentation improvements
- Changesets monorepo versioning

### Phase 3: Distribution & Performance (1-2 weeks)

- CDN setup (jsDelivr, unpkg)
- Performance monitoring
- Package verification
- Bundle optimization

### Phase 3: Accessibility & i18n (2-3 weeks)

- ARIA support
- Keyboard navigation
- RTL support
- Screen reader testing

### Phase 4: Community & Ecosystem (3-4 weeks)

- Discord setup
- Plugin system design
- Theme support
- Integration examples

### Phase 5: Marketing & Advanced Features (4-6 weeks)

- Website development
- Social media setup
- Advanced animation features
- Content marketing

**Total Estimated Time: 12-18 weeks**

---

## Resources & References

### Best Practices

- [Open Source Guides](https://opensource.guide/)
- [npm Documentation](https://docs.npmjs.com/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Web.dev Best Practices](https://web.dev/)

### Security References

- [OWASP Guidelines](https://owasp.org/)
- [npm Security](https://docs.npmjs.com/about-auditing-packages)
- [GitHub Security Documentation](https://docs.github.com/en/security)

### Accessibility

- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Guidelines](https://webaim.org/)

### Performance References

- [Web.dev Performance](https://web.dev/performance/)
- [MDN Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)
- [Bundlephobia](https://bundlephobia.com/)

---

## Conclusion

This roadmap provides a comprehensive path to making UltraTyped.js a professional, production-ready package for global use. The tasks are prioritized by importance and impact on users. Regular reviews and updates to this roadmap are recommended as the project evolves.

For questions or suggestions, please open an issue or discussion on GitHub.
