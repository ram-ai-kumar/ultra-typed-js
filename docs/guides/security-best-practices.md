# Security Best Practices Guide

This guide covers security best practices for using UltraTyped.js in production applications, ensuring safe implementation and protection against common web security threats.

## Table of Contents

- [Security Overview](#security-overview)
- [Content Security Policy (CSP)](#content-security-policy-csp)
- [HTML Content Handling](#html-content-handling)
- [Input Validation](#input-validation)
- [Dependency Security](#dependency-security)
- [Server-Side Rendering](#server-side-rendering)
- [Framework-Specific Security](#framework-specific-security)
- [Security Monitoring](#security-monitoring)
- [Compliance Considerations](#compliance-considerations)

---

## Security Overview

UltraTyped.js is designed with security as a foundational principle:

- **Zero dependencies** - No supply chain vulnerabilities
- **Zero-trust architecture** - Minimal attack surface
- **XSS protection** - Safe content handling by default
- **CSP compliant** - Works with strict security policies

### Core Security Features

```javascript
// ✅ Secure by default
UltraTyped("#element", {
  strings: ["Safe", "Content"],
  contentType: "text", // Default: safe text mode
});

// ❌ Requires caution
UltraTyped("#element", {
  strings: ['<script>alert("xss")</script>'],
  contentType: "html", // HTML mode - validate input!
});
```

---

## Content Security Policy (CSP)

### Basic CSP Configuration

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; 
               script-src 'self'; 
               style-src 'self' 'nonce-ultratyped-css'; 
               font-src 'self';"
/>
```

### UltraTyped.js CSP Integration

UltraTyped.js automatically supports CSP through the `nonce` option:

```javascript
// ✅ CSP-compliant configuration
const instance = UltraTyped("#element", {
  strings: ["CSP", "Compliant"],
  autoInsertCss: true,
  nonce: "ultratyped-css", // Must match your CSP nonce
});
```

### CSP Best Practices

1. **Use nonces for inline styles** - Required for cursor CSS
2. **Avoid 'unsafe-inline'** - Never use in production CSP
3. **Specify exact sources** - Don't use wildcards
4. **Report CSP violations** - Monitor for security issues

```javascript
// ✅ Production-ready CSP setup
function setupCSPNonce() {
  // Generate or retrieve nonce from server
  const nonce = generateSecureNonce();

  UltraTyped("#element", {
    strings: ["Secure", "Typing"],
    autoInsertCss: true,
    nonce: nonce,
  });

  // Add nonce to CSP header
  updateCSPHeader(`style-src 'self' 'nonce-${nonce}'`);
}
```

---

## HTML Content Handling

### Safe HTML Usage

UltraTyped.js supports HTML content but requires careful validation:

```javascript
// ✅ Safe HTML with trusted content
const trustedHTML = '<span class="highlight">Safe content</span>';

UltraTyped("#element", {
  strings: [trustedHTML],
  contentType: "html",
});
```

### HTML Security Risks

```javascript
// ❌ DANGEROUS - Never do this with user input
const userInput = getUserInput(); // Could be malicious

UltraTyped("#element", {
  strings: [userInput],
  contentType: "html", // XSS vulnerability!
});
```

### HTML Sanitization

For dynamic content, always sanitize HTML:

```javascript
import DOMPurify from "dompurify";

function safeTyping(strings) {
  const sanitizedStrings = strings.map((str) =>
    DOMPurify.sanitize(str, {
      ALLOWED_TAGS: ["span", "strong", "em", "br"],
      ALLOWED_ATTR: ["class"],
    }),
  );

  return UltraTyped("#element", {
    strings: sanitizedStrings,
    contentType: "html",
  });
}
```

### HTML Content Guidelines

- **Never use untrusted input** in HTML mode
- **Always sanitize** dynamic HTML content
- **Prefer text mode** for user-generated content
- **Use allowlists** for HTML tags and attributes

---

## Input Validation

### String Validation

Always validate typing strings before processing:

```javascript
function validateTypingStrings(strings) {
  if (!Array.isArray(strings)) {
    throw new Error("Strings must be an array");
  }

  return strings.filter((str) => {
    // Basic validation
    if (typeof str !== "string") return false;
    if (str.length > 10000) return false; // Prevent DoS

    // Security validation
    if (/<script|javascript:|on\w+=/i.test(str)) {
      console.warn("Potentially unsafe content detected");
      return false;
    }

    return true;
  });
}

// Usage
const userInput = getUserStrings();
const safeStrings = validateTypingStrings(userInput);

UltraTyped("#element", {
  strings: safeStrings,
  typeSpeed: 50,
});
```

### Configuration Validation

Validate UltraTyped.js configuration:

```javascript
function validateConfig(config) {
  const safeConfig = { ...config };

  // Validate strings
  if (config.strings) {
    safeConfig.strings = validateTypingStrings(config.strings);
  }

  // Validate contentType
  if (config.contentType === "html") {
    console.warn("HTML content type detected - ensure input is sanitized");
  }

  // Validate numeric options
  ["typeSpeed", "backSpeed", "startDelay"].forEach((key) => {
    if (config[key] && (typeof config[key] !== "number" || config[key] < 0)) {
      safeConfig[key] = 50; // Safe default
    }
  });

  return safeConfig;
}
```

---

## Dependency Security

### Zero Dependency Architecture

UltraTyped.js has zero runtime dependencies, eliminating supply chain risks:

```bash
# ✅ Clean dependency tree
pnpm install ultratyped

# No transitive dependencies
pnpm ls ultratyped
# ultratyped@1.0.0
```

### Framework Adapter Security

Framework adapters inherit the same security principles:

```javascript
// ✅ Secure React integration
import { useUltraTyped } from "@ultratyped/react";

function SecureComponent() {
  const { ref } = useUltraTyped({
    strings: ["Secure", "React"],
    typeSpeed: 50,
  });

  return <span ref={ref} />;
}
```

### Dependency Monitoring

Monitor dependencies for security issues:

```json
{
  "scripts": {
    "audit": "pnpm audit --audit-level=high",
    "audit-fix": "pnpm audit fix",
    "check-deps": "pnpm ls --depth=0"
  }
}
```

---

## Server-Side Rendering

### SSR Security Considerations

When using UltraTyped.js with SSR:

```javascript
// ✅ SSR-safe implementation
function TypingComponent({ strings }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Server: render static content
  if (!isClient) {
    return <span>{strings[0]}</span>;
  }

  // Client: initialize typing effect
  return <TypingEffect strings={strings} />;
}
```

### Hydration Security

Ensure secure hydration patterns:

```javascript
// ✅ Secure hydration
function secureHydration(element, data) {
  // Validate data before hydration
  const validatedData = validateTypingStrings(data.strings);

  if (isClient && element) {
    UltraTyped(element, {
      strings: validatedData,
      typeSpeed: 50,
    });
  }
}
```

---

## Framework-Specific Security

### React Security Patterns

```jsx
// ✅ Secure React component
import { useUltraTyped } from "@ultratyped/react";

function SecureTyping({ content }) {
  const { ref } = useUltraTyped({
    strings: validateTypingStrings(content),
    typeSpeed: 50,
  });

  return <span ref={ref} />;
}
```

### Vue Security Patterns

```vue
<script setup>
import { useUltraTyped } from "@ultratyped/vue";

const props = defineProps({
  strings: {
    type: Array,
    required: true,
    validator: validateTypingStrings,
  },
});

const element = ref(null);

onMounted(() => {
  if (element.value) {
    useUltraTyped(element.value, {
      strings: props.strings,
      typeSpeed: 50,
    });
  }
});
</script>
```

### Svelte Security Patterns

```svelte
<script>
  import { ultratyped } from '@ultratyped/svelte';

  export let strings;

  $: validatedStrings = validateTypingStrings(strings);

  function typingAction(element) {
    ultratyped(element, {
      strings: validatedStrings,
      typeSpeed: 50,
    });
  }
</script>

<span use:typingAction></span>
```

---

## Security Monitoring

### Runtime Security Monitoring

```javascript
class SecurityMonitor {
  constructor() {
    this.violations = [];
    this.setupMonitoring();
  }

  setupMonitoring() {
    // Monitor for XSS attempts
    const originalCreateElement = document.createElement;
    document.createElement = function (tagName) {
      if (tagName === "script") {
        console.warn("Script element creation detected");
        SecurityMonitor.logViolation("script_creation", tagName);
      }
      return originalCreateElement.call(this, tagName);
    };
  }

  static logViolation(type, details) {
    const violation = {
      type,
      details,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    };

    this.violations.push(violation);

    // Send to security monitoring
    if (typeof window !== "undefined" && window.securityLogger) {
      window.securityLogger.log(violation);
    }
  }

  getReport() {
    return {
      totalViolations: this.violations.length,
      violations: this.violations,
      summary: this.generateSummary(),
    };
  }
}
```

### Content Security Monitoring

```javascript
// Monitor CSP violations
document.addEventListener("securitypolicyviolation", (e) => {
  console.error("CSP Violation:", {
    blockedURI: e.blockedURI,
    violatedDirective: e.violatedDirective,
    originalPolicy: e.originalPolicy,
  });

  // Log security event
  SecurityMonitor.logViolation("csp_violation", {
    directive: e.violatedDirective,
    uri: e.blockedURI,
  });
});
```

---

## Compliance Considerations

### GDPR Compliance

```javascript
// ✅ GDPR-compliant implementation
class GDPRCompliantTyping {
  constructor(element, options) {
    this.element = element;
    this.options = this.validateForGDPR(options);
    this.consentManager = new ConsentManager();
  }

  validateForGDPR(options) {
    // Check for personal data
    const hasPersonalData = options.strings.some((str) =>
      this.containsPersonalData(str),
    );

    if (hasPersonalData && !this.consentManager.hasConsent()) {
      // Remove or anonymize personal data
      return {
        ...options,
        strings: options.strings.map((str) => this.anonymizePersonalData(str)),
      };
    }

    return options;
  }

  containsPersonalData(text) {
    // Implement personal data detection
    const patterns = [
      /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/, // Credit cards
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Emails
      /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/, // SSN
    ];

    return patterns.some((pattern) => pattern.test(text));
  }
}
```

### Accessibility Compliance

```javascript
// ✅ WCAG-compliant typing effect
const accessibleTyping = UltraTyped("#element", {
  strings: ["Accessible", "Content"],
  typeSpeed: 50,
  // Accessibility features
  onStart: (self) => {
    // Announce to screen readers
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = "Typing animation started";
    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },
});
```

---

## Security Checklist

### Development Checklist

- [ ] **Input Validation** - All user inputs validated
- [ ] **HTML Sanitization** - HTML content sanitized when used
- [ ] **CSP Compliance** - Proper nonce usage and CSP headers
- [ ] **Dependency Security** - No vulnerable dependencies
- [ ] **Error Handling** - Secure error handling without information leakage

### Deployment Checklist

- [ ] **CSP Headers** - Proper Content Security Policy configured
- [ ] **HTTPS Only** - Serve over HTTPS in production
- [ ] **Security Headers** - X-Frame-Options, X-Content-Type-Options, etc.
- [ ] **Monitoring** - Security monitoring and logging enabled
- [ ] **Compliance** - GDPR, CCPA, accessibility compliance verified

### Runtime Security

- [ ] **XSS Prevention** - No unsafe HTML rendering
- [ ] **Content Validation** - All content validated before rendering
- [ ] **Error Boundaries** - Secure error handling
- [ ] **Memory Safety** - No memory leaks or unsafe operations
- [ ] **CSP Violations** - Monitor and log violations

---

## Common Security Pitfalls

### ❌ Common Mistakes

1. **Using untrusted input in HTML mode**

   ```javascript
   // Dangerous
   UltraTyped("#el", { strings: [userInput], contentType: "html" });
   ```

2. **Ignoring CSP requirements**

   ```javascript
   // Missing nonce for CSP
   UltraTyped("#el", { autoInsertCss: true }); // CSP violation
   ```

3. **Not validating configuration**
   ```javascript
   // Unsafe configuration
   UltraTyped("#el", { typeSpeed: -1000, strings: maliciousInput });
   ```

### ✅ Secure Alternatives

1. **Validate all inputs**

   ```javascript
   const safeStrings = validateTypingStrings(userInput);
   UltraTyped("#el", { strings: safeStrings, contentType: "text" });
   ```

2. **Respect CSP requirements**

   ```javascript
   UltraTyped("#el", {
     autoInsertCss: true,
     nonce: getSecureNonce(),
   });
   ```

3. **Validate configuration**
   ```javascript
   const safeConfig = validateConfig(userConfig);
   UltraTyped("#el", safeConfig);
   ```

---

## Security Resources

- **[Security Policy](../reference/security.md)** - Detailed security documentation
- **[Compliance Guide](../project/compliance.md)** - Enterprise compliance information
- **[OWASP Guidelines](https://owasp.org/)** - Web security best practices
- **[MDN Security](https://developer.mozilla.org/en-US/docs/Web/Security)** - Browser security features

This security guide ensures that UltraTyped.js implementations remain secure across all use cases while maintaining the library's performance and usability benefits.
