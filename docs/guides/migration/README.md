# Migration Guides

This section contains comprehensive migration guides for moving from other typing animation libraries to UltraTyped.js.

## Available Migrations

### From Typed.js v2
**[Typed.js Migration Guide](typed-js.md)** - Complete guide for migrating from Typed.js v2 to UltraTyped.js

UltraTyped.js is a drop-in replacement for Typed.js v2 with 100% feature parity and significantly smaller bundle size.

**Key Benefits:**
- **85% smaller bundle** (13KB → 2KB)
- **100% feature parity** with Typed.js v2
- **Zero-code migration** available with `@ultratyped/typed-compat`
- **Better TypeScript support**
- **Framework-specific adapters**

### From typewriter-effect
**[typewriter-effect Migration Guide](typewriter-effect.md)** - Migrate from typewriter-effect to UltraTyped.js

**Key Benefits:**
- **85% smaller bundle** (13KB → 2KB)
- **Better performance** (60fps optimized)
- **Cleaner API** (options-based instead of chaining)
- **Framework adapters** for better integration

## Quick Migration

### For Typed.js Users

```bash
# Option 1: Zero-code migration
npm install @ultratyped/typed-compat @ultratyped/core

# Option 2: Direct migration
npm install @ultratyped/core
```

### For typewriter-effect Users

```bash
# Direct migration
npm install ultratyped
```

## Migration Support

- **[Troubleshooting Guide](../troubleshooting.md)** - Common migration issues
- **[Best Practices Guide](../best-practices.md)** - Recommended patterns
- **[API Reference](../../reference/api.md)** - Complete API documentation

## Need Help?

If you encounter issues during migration:

1. Check the **[Troubleshooting Guide](../troubleshooting.md)**
2. Review **[Best Practices](../best-practices.md)**
3. Open an issue on [GitHub](https://github.com/ram-ai-kumar/ultra-typed-js/issues)
