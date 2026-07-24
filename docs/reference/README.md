# Technical Reference

This section contains technical documentation for UltraTyped.js, including API reference, performance characteristics, and security information.

## Available Reference

### Core Documentation
- **[API Reference](api.md)** - Complete API documentation with examples
- **[Performance Characteristics](performance.md)** - Performance metrics, benchmarks, and optimization techniques
- **[Security Policy](security.md)** - Security posture, threat model, and vulnerability reporting

## Quick Reference

### Basic Usage

```javascript
import UltraTyped from 'ultratyped';

const instance = UltraTyped('#element', {
  strings: ['Hello', 'World'],
  typeSpeed: 50,
  loop: true,
});
```

### Performance Metrics

- **Bundle Size**: <2KB gzipped
- **Frame Rate**: 60fps
- **Memory Usage**: ~512 bytes per instance
- **CPU Usage**: <1% on modern devices

### Security Features

- **Zero dependencies** - No supply chain risks
- **XSS protection** - Safe HTML content handling
- **CSP compliant** - Works with Content Security Policy
- **TypeScript support** - Full type safety

## Need More Help?

- **[User Guides](../guides/)** - Usage patterns and best practices
- **[Migration Guides](../guides/migration/)** - Coming from other libraries
- **[Project Documentation](../project/)** - Version history and compliance
