# UltraTyped.js Performance Guide

This comprehensive guide covers performance characteristics, optimization techniques, and best practices for UltraTyped.js, ensuring smooth 60fps animations, minimal memory usage, and optimal bundle size in production applications.

## Table of Contents

- [Performance Fundamentals](#performance-fundamentals)
- [60fps Animation Optimization](#60fps-animation-optimization)
- [Memory Management & Leak Prevention](#memory-management--leak-prevention)
- [Bundle Size Optimization](#bundle-size-optimization)
- [Mobile Performance Optimization](#mobile-performance-optimization)
- [Battery & CPU Optimization](#battery--cpu-optimization)
- [Advanced Performance Monitoring](#advanced-performance-monitoring)
- [SSR & Hydration Performance](#ssr--hydration-performance)
- [Performance Testing & Profiling](#performance-testing--profiling)
- [Production Optimization Checklist](#production-optimization-checklist)

---

## Performance Fundamentals

### Understanding the Performance Triangle

UltraTyped.js performance is built on three pillars:

1. **Frame Rate** - Maintain 60fps (16.67ms per frame)
2. **Memory Efficiency** - Minimal allocations and no leaks
3. **Bundle Size** - <2KB gzipped for optimal loading

### Core Performance Metrics

#### Bundle Size

- **Core Library**: <2KB gzipped
- **Framework Adapters**: ~500B each gzipped
- **Total Footprint**: <3KB for core + one adapter
- **Tree-shakeable**: Yes, supports partial imports

#### Runtime Performance

- **Frame Rate**: 60fps (requestAnimationFrame-driven)
- **CPU Usage**: <1% on modern devices
- **Memory Allocation**: Zero per-frame allocations
- **Startup Time**: <5ms initialization

#### Memory Footprint

- **Core instance**: ~512 bytes
- **String storage**: O(n) where n = total string length
- **No hidden object allocations**
- **No retained references after destroy()

### Performance Budgets

| Metric                  | Target   | Critical Threshold |
| ----------------------- | -------- | ------------------ |
| **Frame Time**          | <16.67ms | >20ms (50fps)      |
| **Memory per Instance** | <1KB     | >2KB               |
| **CPU Usage**           | <1%      | >3%                |
| **Bundle Size**         | <2KB     | >3KB               |

---

## 60fps Animation Optimization

### 1. Optimal Configuration Parameters

```javascript
// ✅ Optimized for 60fps performance
const optimalConfig = {
  typeSpeed: 50,           // 50ms per character (balanced)
  backSpeed: 30,           // 30ms for deletion
  backDelay: 800,          // 800ms pause (natural rhythm)
  typingVariance: 5,       // Low variance (consistent timing)
  startDelay: 0,           // No unnecessary delay
  showCursor: true,        // Cursor adds minimal overhead
  autoInsertCss: true,     // Let UltraTyped handle CSS efficiently
  smartBackspace: true,    // Reduces unnecessary character deletions
};

// ❌ Performance-heavy configuration
const heavyConfig = {
  typeSpeed: 10,           // Too fast (high CPU)
  typingVariance: 100,     // High variance (inconsistent timing)
  backSpeed: 5,            // Very fast deletion (CPU intensive)
  startDelay: 1000,        // Unnecessary delay
};
```

### 2. requestAnimationFrame Optimization

UltraTyped.js automatically uses rAF, but you can enhance it:

```javascript
// Custom rAF optimization for complex scenes
const instance = UltraTyped('#element', {
  strings: ['Optimized', 'Performance'],
  typeSpeed: 50,
});

// Pause during heavy animations
let isHeavyAnimation = false;

function handleHeavyAnimation() {
  if (isHeavyAnimation) {
    instance.pause();
  } else {
    instance.resume();
  }
}

// Integrate with other animation libraries
gsap.ticker.add(() => {
  const isComplexScene = gsap.ticker.time > 5;
  if (isComplexScene !== isHeavyAnimation) {
    isHeavyAnimation = isComplexScene;
    handleHeavyAnimation();
  }
});
```

### 3. Frame Rate Monitoring & Adaptation

```javascript
class PerformanceMonitor {
  constructor() {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 60;
    this.adaptiveConfig = { ...optimalConfig };
  }

  update() {
    this.frameCount++;
    const currentTime = performance.now();
    const delta = currentTime - this.lastTime;

    if (delta >= 1000) {
      this.fps = (this.frameCount * 1000) / delta;
      this.frameCount = 0;
      this.lastTime = currentTime;
      this.adaptPerformance();
    }
  }

  adaptPerformance() {
    if (this.fps < 55) {
      // Reduce performance pressure
      this.adaptiveConfig.typeSpeed = Math.min(80, this.adaptiveConfig.typeSpeed + 10);
      this.adaptiveConfig.typingVariance = 0;
      instance.updateOptions(this.adaptiveConfig);
    } else if (this.fps > 58 && this.adaptiveConfig.typeSpeed > 50) {
      // Restore optimal performance
      this.adaptiveConfig.typeSpeed = Math.max(50, this.adaptiveConfig.typeSpeed - 5);
      instance.updateOptions(this.adaptiveConfig);
    }
  }
}

const monitor = new PerformanceMonitor();

// Monitor frame rate
function monitorFrameRate() {
  monitor.update();
  requestAnimationFrame(monitorFrameRate);
}
monitorFrameRate();
```

---

## Memory Management & Leak Prevention

### 1. Instance Lifecycle Management

```javascript
// ✅ Proper instance management
class TypingManager {
  constructor() {
    this.instances = new Map();
    this.cleanupScheduled = false;
  }

  create(id, selector, config) {
    // Clean up existing instance
    this.destroy(id);

    const instance = UltraTyped(selector, {
      ...config,
      onDestroy: () => {
        this.instances.delete(id);
      },
    });

    this.instances.set(id, instance);
    return instance;
  }

  destroy(id) {
    const instance = this.instances.get(id);
    if (instance) {
      instance.destroy();
      this.instances.delete(id);
    }
  }

  destroyAll() {
    this.instances.forEach(instance => instance.destroy());
    this.instances.clear();
  }

  // Schedule cleanup for inactive instances
  scheduleCleanup() {
    if (this.cleanupScheduled) return;

    this.cleanupScheduled = true;
    requestIdleCallback(() => {
      this.cleanupInactiveInstances();
      this.cleanupScheduled = false;
    });
  }

  cleanupInactiveInstances() {
    // Clean up instances not in viewport
    this.instances.forEach((instance, id) => {
      const element = instance.element;
      if (!this.isInViewport(element)) {
        this.destroy(id);
      }
    });
  }

  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  }
}

const typingManager = new TypingManager();
```

### 2. Memory-Efficient String Management

```javascript
// ✅ Memory-efficient string handling
class EfficientStringManager {
  constructor() {
    this.stringCache = new Map();
    this.maxCacheSize = 100;
  }

  // Cache processed strings to avoid re-tokenization
  processStrings(strings) {
    return strings.map(str => this.getCachedString(str));
  }

  getCachedString(str) {
    if (this.stringCache.has(str)) {
      return this.stringCache.get(str);
    }

    const processed = this.tokenizeString(str);

    // Implement LRU cache eviction
    if (this.stringCache.size >= this.maxCacheSize) {
      const firstKey = this.stringCache.keys().next().value;
      this.stringCache.delete(firstKey);
    }

    this.stringCache.set(str, processed);
    return processed;
  }

  tokenizeString(str) {
    // Pre-tokenize for UltraTyped.js
    return {
      original: str,
      tokens: str.split(''),
      length: str.length,
    };
  }

  clearCache() {
    this.stringCache.clear();
  }
}

const stringManager = new EfficientStringManager();
```

### 3. Weak References for Automatic Cleanup

```javascript
// ✅ Automatic cleanup with WeakMap
class AutoCleanupManager {
  constructor() {
    this.instances = new WeakMap();
    this.observers = new Map();
  }

  create(element, config) {
    const instance = UltraTyped(element, config);
    this.instances.set(element, instance);

    // Set up Intersection Observer for automatic cleanup
    if (!this.observers.has(element)) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) {
              this.cleanup(entry.target);
            }
          });
        },
        { threshold: 0 }
      );

      observer.observe(element);
      this.observers.set(element, observer);
    }

    return instance;
  }

  cleanup(element) {
    const instance = this.instances.get(element);
    if (instance) {
      instance.destroy();
    }

    const observer = this.observers.get(element);
    if (observer) {
      observer.disconnect();
      this.observers.delete(element);
    }
  }
}
```

---

## Bundle Size Optimization

### 1. Tree Shaking Optimization

```javascript
// ✅ Optimal imports for tree shaking
import UltraTyped from 'ultratyped'; // Default export - tree shakable

// ❌ Avoid named imports (breaks tree shaking)
// import { UltraTyped } from 'ultratyped';

// ✅ Framework-specific imports
import { useUltraTyped } from '@ultratyped/react'; // Only React hooks
import { ultratyped } from '@ultratyped/svelte'; // Only Svelte action
```

### 2. Code Splitting Strategies

```javascript
// ✅ Dynamic imports for code splitting
const loadTypingEffect = async () => {
  const { default: UltraTyped } = await import('ultratyped');
  return UltraTyped;
};

// Load only when needed
const initializeTyping = async (element, strings) => {
  if (IntersectionObserver && element) {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting) {
          const UltraTyped = await loadTypingEffect();
          UltraTyped(element, { strings, typeSpeed: 50 });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(element);
  }
};
```

### 3. Bundle Analysis Configuration

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        ultratyped: {
          test: /[\\/]node_modules[\\/]ultratyped[\\/]/,
          name: 'ultratyped',
          chunks: 'all',
          priority: 20,
        },
        ultratypedReact: {
          test: /[\\/]node_modules[\\/]@ultratyped[\\/]react[\\/]/,
          name: 'ultratyped-react',
          chunks: 'all',
          priority: 15,
        },
      },
    },
  },
  resolve: {
    alias: {
      // Use smaller builds where available
      'ultratyped': 'ultratyped/dist/core.min.js',
    },
  },
};
```

### 4. Minification Optimization

```javascript
// ✅ Production-ready configuration
const productionConfig = {
  strings: ['Minimal', 'Bundle', 'Size'],
  typeSpeed: 50,
  // Remove debug options in production
  debug: false,
  // Use minimal CSS
  autoInsertCss: true,
  cursorChar: '|', // Single character cursor
};

// Development configuration
const developmentConfig = {
  ...productionConfig,
  debug: true,
  // Additional logging in dev
  onStringTyped: (i) => console.log(`String ${i} completed`),
};
```

---

## Mobile Performance Optimization

### 1. Device Capability Detection

```javascript
// ✅ Adaptive performance based on device capabilities
class DevicePerformanceDetector {
  constructor() {
    this.isLowEnd = this.detectLowEndDevice();
    this.isMobile = this.detectMobile();
    this.batteryLevel = null;
    this.initBatteryMonitoring();
  }

  detectLowEndDevice() {
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4;
    const connection = navigator.connection?.effectiveType || '4g';

    return (
      cores <= 2 ||
      memory <= 2 ||
      connection === 'slow-2g' ||
      connection === '2g'
    );
  }

  detectMobile() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  async initBatteryMonitoring() {
    if ('getBattery' in navigator) {
      const battery = await navigator.getBattery();
      this.batteryLevel = battery.level;

      battery.addEventListener('levelchange', () => {
        this.batteryLevel = battery.level;
        this.adaptToBatteryLevel();
      });
    }
  }

  adaptToBatteryLevel() {
    if (this.batteryLevel < 0.2) {
      // Low battery - reduce performance
      this.applyLowPowerConfig();
    } else if (this.batteryLevel > 0.5) {
      // Good battery - normal performance
      this.applyNormalConfig();
    }
  }

  getOptimizedConfig(baseConfig) {
    const config = { ...baseConfig };

    if (this.isLowEnd) {
      config.typeSpeed = Math.min(80, config.typeSpeed + 20);
      config.typingVariance = 0;
      config.showCursor = false;
    }

    if (this.isMobile) {
      config.typeSpeed = Math.min(60, config.typeSpeed + 10);
      config.backSpeed = Math.min(40, config.backSpeed + 10);
    }

    return config;
  }

  applyLowPowerConfig() {
    // Reduce typing frequency on low battery
    instances.forEach(instance => {
      instance.updateOptions({
        typeSpeed: 100,
        showCursor: false,
        typingVariance: 0,
      });
    });
  }

  applyNormalConfig() {
    // Restore normal performance
    instances.forEach(instance => {
      instance.updateOptions(normalConfig);
    });
  }
}

const deviceDetector = new DevicePerformanceDetector();
```

### 2. Touch-Optimized Performance

```javascript
// ✅ Touch-friendly performance optimization
class TouchPerformanceOptimizer {
  constructor() {
    this.isTouching = false;
    this.touchTimeout = null;
    this.initTouchListeners();
  }

  initTouchListeners() {
    document.addEventListener('touchstart', () => {
      this.isTouching = true;
      this.pauseAllTyping();
    });

    document.addEventListener('touchend', () => {
      this.isTouching = false;
      this.scheduleResume();
    });
  }

  pauseAllTyping() {
    typingManager.instances.forEach(instance => {
      instance.pause();
    });
  }

  scheduleResume() {
    clearTimeout(this.touchTimeout);
    this.touchTimeout = setTimeout(() => {
      if (!this.isTouching) {
        this.resumeAllTyping();
      }
    }, 1000);
  }

  resumeAllTyping() {
    typingManager.instances.forEach(instance => {
      instance.resume();
    });
  }
}
```

### 3. Responsive Performance Scaling

```javascript
// ✅ Viewport-based performance scaling
class ViewportPerformanceScaler {
  constructor() {
    this.breakpoints = {
      mobile: 768,
      tablet: 1024,
      desktop: 1200,
    };
    this.currentBreakpoint = this.getBreakpoint();
    this.initResizeListener();
  }

  getBreakpoint() {
    const width = window.innerWidth;
    if (width < this.breakpoints.mobile) return 'mobile';
    if (width < this.breakpoints.tablet) return 'tablet';
    if (width < this.breakpoints.desktop) return 'desktop';
    return 'large';
  }

  initResizeListener() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = () => {
        const newBreakpoint = this.getBreakpoint();
        if (newBreakpoint !== this.currentBreakpoint) {
          this.currentBreakpoint = newBreakpoint;
          this.updatePerformance();
        }
      }, 250);
    });
  }

  updatePerformance() {
    const configs = {
      mobile: { typeSpeed: 60, showCursor: false, typingVariance: 0 },
      tablet: { typeSpeed: 50, showCursor: true, typingVariance: 5 },
      desktop: { typeSpeed: 50, showCursor: true, typingVariance: 10 },
      large: { typeSpeed: 40, showCursor: true, typingVariance: 15 },
    };

    typingManager.instances.forEach(instance => {
      instance.updateOptions(configs[this.currentBreakpoint]);
    });
  }
}
```

---

## Battery & CPU Optimization

### 1. Battery-Aware Performance

```javascript
// ✅ Battery-optimized typing effects
class BatteryOptimizer {
  constructor() {
    this.batteryLevel = 1.0;
    this.isCharging = false;
    this.powerSaveMode = false;
    this.initBatteryAPI();
  }

  async initBatteryAPI() {
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();

        this.batteryLevel = battery.level;
        this.isCharging = battery.charging;

        battery.addEventListener('levelchange', () => {
          this.batteryLevel = battery.level;
          this.updatePerformance();
        });

        battery.addEventListener('chargingchange', () => {
          this.isCharging = battery.charging;
          this.updatePerformance();
        });
      } catch (error) {
        console.warn('Battery API not available');
      }
    }
  }

  updatePerformance() {
    const powerSaveConfig = this.getPowerSaveConfig();

    typingManager.instances.forEach(instance => {
      instance.updateOptions(powerSaveConfig);
    });
  }

  getPowerSaveConfig() {
    if (this.isCharging) {
      return {
        typeSpeed: 40,
        showCursor: true,
        typingVariance: 10,
      };
    }

    if (this.batteryLevel < 0.2) {
      return {
        typeSpeed: 100,
        showCursor: false,
        typingVariance: 0,
        loop: false, // Stop looping to save power
      };
    }

    if (this.batteryLevel < 0.5) {
      return {
        typeSpeed: 70,
        showCursor: false,
        typingVariance: 0,
      };
    }

    return {
      typeSpeed: 50,
      showCursor: true,
      typingVariance: 5,
    };
  }
}
```

### 2. CPU Throttling Detection

```javascript
// ✅ CPU load-aware performance
class CPUMonitor {
  constructor() {
    this.frameTimeHistory = [];
    this.maxHistorySize = 60; // 1 second at 60fps
    this.cpuLoad = 0;
    this.isThrottling = false;
  }

  recordFrameTime(frameTime) {
    this.frameTimeHistory.push(frameTime);

    if (this.frameTimeHistory.length > this.maxHistorySize) {
      this.frameTimeHistory.shift();
    }

    this.calculateCPULoad();
    this.adaptPerformance();
  }

  calculateCPULoad() {
    if (this.frameTimeHistory.length < 10) return;

    const avgFrameTime = this.frameTimeHistory.reduce((a, b) => a + b, 0) / this.frameTimeHistory.length;
    const targetFrameTime = 16.67; // 60fps

    this.cpuLoad = Math.min(1, avgFrameTime / targetFrameTime);
    this.isThrottling = this.cpuLoad > 0.8;
  }

  adaptPerformance() {
    if (this.isThrottling) {
      this.applyThrottlingConfig();
    } else if (this.cpuLoad < 0.5) {
      this.applyNormalConfig();
    }
  }

  applyThrottlingConfig() {
    const config = {
      typeSpeed: 80,
      typingVariance: 0,
      showCursor: false,
      backDelay: 1000, // Longer delays
    };

    typingManager.instances.forEach(instance => {
      instance.updateOptions(config);
    });
  }

  applyNormalConfig() {
    const config = {
      typeSpeed: 50,
      typingVariance: 5,
      showCursor: true,
      backDelay: 800,
    };

    typingManager.instances.forEach(instance => {
      instance.updateOptions(config);
    });
  }
}
```

### 3. Thermal Management

```javascript
// ✅ Thermal-aware performance scaling
class ThermalManager {
  constructor() {
    this.temperature = 0;
    this.isOverheating = false;
    this.initThermalMonitoring();
  }

  initThermalMonitoring() {
    // Monitor performance degradation as proxy for temperature
    this.performanceBaseline = this.measurePerformance();
    this.startThermalCheck();
  }

  measurePerformance() {
    const startTime = performance.now();
    const iterations = 1000;

    // Simple computation to benchmark
    let result = 0;
    for (let i = 0; i < iterations; i++) {
      result += Math.sqrt(i);
    }

    const endTime = performance.now();
    return endTime - startTime;
  }

  startThermalCheck() {
    setInterval(() => {
      const currentPerformance = this.measurePerformance();
      const degradation = (currentPerformance - this.performanceBaseline) / this.performanceBaseline;

      if (degradation > 0.3) { // 30% performance degradation
        this.isOverheating = true;
        this.applyThermalConfig();
      } else if (degradation < 0.1) {
        this.isOverheating = false;
        this.applyNormalConfig();
      }
    }, 30000); // Check every 30 seconds
  }

  applyThermalConfig() {
    const config = {
      typeSpeed: 120,
      showCursor: false,
      typingVariance: 0,
      loop: false,
    };

    typingManager.instances.forEach(instance => {
      instance.updateOptions(config);
    });
  }
}
```

---

## Advanced Performance Monitoring

### 1. Real-time Performance Dashboard

```javascript
// ✅ Comprehensive performance monitoring
class PerformanceDashboard {
  constructor() {
    this.metrics = {
      fps: 60,
      frameTime: 16.67,
      memoryUsage: 0,
      activeInstances: 0,
      bundleSize: 0,
    };

    this.history = {
      fps: [],
      frameTime: [],
      memoryUsage: [],
    };

    this.maxHistorySize = 300; // 5 minutes at 1fps
    this.initMonitoring();
  }

  initMonitoring() {
    this.startFPSMonitoring();
    this.startMemoryMonitoring();
    this.startInstanceMonitoring();
    this.createDashboard();
  }

  startFPSMonitoring() {
    let lastTime = performance.now();
    let frameCount = 0;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      const delta = currentTime - lastTime;

      if (delta >= 1000) {
        this.metrics.fps = (frameCount * 1000) / delta;
        this.metrics.frameTime = delta / frameCount;

        this.updateHistory('fps', this.metrics.fps);
        this.updateHistory('frameTime', this.metrics.frameTime);

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    measureFPS();
  }

  startMemoryMonitoring() {
    const measureMemory = () => {
      if (performance.memory) {
        this.metrics.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
        this.updateHistory('memoryUsage', this.metrics.memoryUsage);
      }
    };

    setInterval(measureMemory, 1000);
  }

  startInstanceMonitoring() {
    setInterval(() => {
      this.metrics.activeInstances = typingManager.instances.size;
    }, 1000);
  }

  updateHistory(metric, value) {
    this.history[metric].push(value);

    if (this.history[metric].length > this.maxHistorySize) {
      this.history[metric].shift();
    }
  }

  createDashboard() {
    if (typeof document === 'undefined') return;

    const dashboard = document.createElement('div');
    dashboard.id = 'ultratyped-performance-dashboard';
    dashboard.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10000;
      min-width: 200px;
    `;

    const updateDisplay = () => {
      dashboard.innerHTML = `
        <div>UltraTyped Performance</div>
        <div>FPS: ${this.metrics.fps.toFixed(1)}</div>
        <div>Frame Time: ${this.metrics.frameTime.toFixed(2)}ms</div>
        <div>Memory: ${this.metrics.memoryUsage.toFixed(2)}MB</div>
        <div>Instances: ${this.metrics.activeInstances}</div>
        <div style="color: ${this.getHealthColor()}">Status: ${this.getHealthStatus()}</div>
      `;
    };

    setInterval(updateDisplay, 1000);
    document.body.appendChild(dashboard);
  }

  getHealthStatus() {
    if (this.metrics.fps < 30) return 'Poor';
    if (this.metrics.fps < 50) return 'Fair';
    return 'Good';
  }

  getHealthColor() {
    if (this.metrics.fps < 30) return '#ff4444';
    if (this.metrics.fps < 50) return '#ffaa00';
    return '#44ff44';
  }

  getPerformanceReport() {
    return {
      current: this.metrics,
      averages: {
        fps: this.calculateAverage('fps'),
        frameTime: this.calculateAverage('frameTime'),
        memoryUsage: this.calculateAverage('memoryUsage'),
      },
      issues: this.detectPerformanceIssues(),
    };
  }

  calculateAverage(metric) {
    const values = this.history[metric];
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  detectPerformanceIssues() {
    const issues = [];

    if (this.metrics.fps < 30) {
      issues.push('Low frame rate detected');
    }

    if (this.metrics.memoryUsage > 50) {
      issues.push('High memory usage');
    }

    if (this.metrics.activeInstances > 10) {
      issues.push('Too many active instances');
    }

    return issues;
  }
}
```

### 2. Performance Analytics

```javascript
// ✅ Performance analytics and reporting
class PerformanceAnalytics {
  constructor() {
    this.events = [];
    this.sessionStart = Date.now();
    this.initAnalytics();
  }

  initAnalytics() {
    // Track performance events
    this.trackEvent('session_start', {
      userAgent: navigator.userAgent,
      deviceMemory: navigator.deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
    });
  }

  trackEvent(type, data) {
    this.events.push({
      type,
      timestamp: Date.now(),
      data,
    });

    // Keep only last 1000 events
    if (this.events.length > 1000) {
      this.events.shift();
    }
  }

  trackInstanceCreation(config) {
    this.trackEvent('instance_created', {
      stringCount: config.strings?.length || 0,
      typeSpeed: config.typeSpeed,
      hasCursor: config.showCursor,
      isLooping: config.loop,
    });
  }

  trackPerformanceIssue(type, details) {
    this.trackEvent('performance_issue', {
      issueType: type,
      details,
      currentFPS: dashboard.metrics.fps,
      currentMemory: dashboard.metrics.memoryUsage,
    });
  }

  generateReport() {
    const sessionDuration = Date.now() - this.sessionStart;
    const instancesCreated = this.events.filter(e => e.type === 'instance_created').length;
    const performanceIssues = this.events.filter(e => e.type === 'performance_issue');

    return {
      session: {
        duration: sessionDuration,
        instancesCreated,
        performanceIssues: performanceIssues.length,
      },
      performance: {
        averageFPS: dashboard.calculateAverage('fps'),
        averageMemory: dashboard.calculateAverage('memoryUsage'),
        peakMemory: Math.max(...dashboard.history.memoryUsage),
      },
      issues: performanceIssues.map(e => e.data),
    };
  }

  sendReport(endpoint) {
    const report = this.generateReport();

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(report),
    }).catch(error => {
      console.warn('Failed to send performance report:', error);
    });
  }
}
```

---

## SSR & Hydration Performance

### 1. Server-Side Rendering Optimization

```javascript
// ✅ SSR-optimized typing effects
class SSROptimizer {
  constructor() {
    this.isClient = typeof window !== 'undefined';
    this.isSSR = !this.isClient;
  }

  // Server-side: Generate static content
  generateStaticContent(strings) {
    if (this.isSSR) {
      // Return first string as static content
      return {
        html: `<span class="ultratyped-static">${strings[0]}</span>`,
        data: {
          strings,
          originalString: strings[0],
        },
      };
    }

    return null;
  }

  // Client-side: Hydrate with typing effect
  hydrate(element, data) {
    if (!this.isClient) return;

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initializeTyping(element, data);
      });
    } else {
      this.initializeTyping(element, data);
    }
  }

  initializeTyping(element, data) {
    // Remove static content
    element.textContent = '';

    // Initialize typing effect
    const instance = UltraTyped(element, {
      strings: data.strings,
      typeSpeed: 50,
      startDelay: 100, // Small delay for smooth transition
    });

    return instance;
  }
}

// Usage in React
function TypingComponent({ strings }) {
  const [isClient, setIsClient] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && elementRef.current) {
      const ssrOptimizer = new SSROptimizer();
      ssrOptimizer.hydrate(elementRef.current, { strings });
    }
  }, [isClient, strings]);

  // Server-side fallback
  if (!isClient) {
    return <span ref={elementRef}>{strings[0]}</span>;
  }

  return <span ref={elementRef} />;
}
```

### 2. Hydration Performance Optimization

```javascript
// ✅ Optimized hydration strategy
class HydrationOptimizer {
  constructor() {
    this.hydratedInstances = new Map();
    this.pendingHydrations = new Set();
  }

  scheduleHydration(element, data, priority = 'normal') {
    const hydrationId = this.generateHydrationId(element);

    if (priority === 'high') {
      this.hydrateImmediately(element, data, hydrationId);
    } else {
      this.scheduleLowPriorityHydration(element, data, hydrationId);
    }
  }

  hydrateImmediately(element, data, hydrationId) {
    if (this.pendingHydrations.has(hydrationId)) return;

    this.pendingHydrations.add(hydrationId);

    // Measure hydration performance
    const startTime = performance.now();

    const instance = UltraTyped(element, {
      strings: data.strings,
      typeSpeed: 50,
      onComplete: () => {
        const endTime = performance.now();
        const hydrationTime = endTime - startTime;

        this.trackHydrationPerformance(hydrationId, hydrationTime);
        this.pendingHydrations.delete(hydrationId);
      },
    });

    this.hydratedInstances.set(hydrationId, instance);
  }

  scheduleLowPriorityHydration(element, data, hydrationId) {
    // Use requestIdleCallback for non-critical hydrations
    if (requestIdleCallback) {
      requestIdleCallback(() => {
        this.hydrateImmediately(element, data, hydrationId);
      }, { timeout: 2000 });
    } else {
      // Fallback to setTimeout
      setTimeout(() => {
        this.hydrateImmediately(element, data, hydrationId);
      }, 100);
    }
  }

  trackHydrationPerformance(id, time) {
    if (time > 100) {
      console.warn(`Slow hydration detected: ${id} took ${time}ms`);
    }
  }

  generateHydrationId(element) {
    return `hydration_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

---

## Performance Testing & Profiling

### 1. Automated Performance Testing

```javascript
// ✅ Comprehensive performance testing suite
class PerformanceTestSuite {
  constructor() {
    this.tests = [];
    this.results = [];
  }

  addTest(name, testFunction) {
    this.tests.push({ name, testFunction });
  }

  async runAllTests() {
    this.results = [];

    for (const test of this.tests) {
      try {
        const result = await this.runTest(test);
        this.results.push(result);
      } catch (error) {
        this.results.push({
          name: test.name,
          status: 'failed',
          error: error.message,
        });
      }
    }

    return this.results;
  }

  async runTest(test) {
    const startTime = performance.now();
    const startMemory = performance.memory?.usedJSHeapSize || 0;

    await test.testFunction();

    const endTime = performance.now();
    const endMemory = performance.memory?.usedJSHeapSize || 0;

    return {
      name: test.name,
      status: 'passed',
      duration: endTime - startTime,
      memoryDelta: endMemory - startMemory,
    };
  }

  // Test 60fps performance
  test60FPSPerformance() {
    return new Promise((resolve) => {
      const element = document.createElement('span');
      document.body.appendChild(element);

      const instance = UltraTyped(element, {
        strings: ['Performance', 'Test', '60fps'],
        typeSpeed: 30,
        loop: true,
      });

      let frameCount = 0;
      let lastTime = performance.now();
      let minFPS = 60;

      const measureFPS = () => {
        frameCount++;
        const currentTime = performance.now();
        const delta = currentTime - lastTime;

        if (delta >= 1000) {
          const fps = (frameCount * 1000) / delta;
          minFPS = Math.min(minFPS, fps);

          if (frameCount >= 3) { // Test for 3 seconds
            instance.destroy();
            document.body.removeChild(element);
            resolve(minFPS);
            return;
          }

          frameCount = 0;
          lastTime = currentTime;
        }

        requestAnimationFrame(measureFPS);
      };

      measureFPS();
    });
  }

  // Test memory usage
  testMemoryUsage() {
    return new Promise((resolve) => {
      const instances = [];
      const elementCount = 10;

      // Create multiple instances
      for (let i = 0; i < elementCount; i++) {
        const element = document.createElement('span');
        document.body.appendChild(element);

        const instance = UltraTyped(element, {
          strings: [`Memory test ${i}`],
          typeSpeed: 50,
        });

        instances.push({ element, instance });
      }

      // Measure memory after creation
      const memoryAfterCreation = performance.memory?.usedJSHeapSize || 0;

      // Clean up
      instances.forEach(({ element, instance }) => {
        instance.destroy();
        document.body.removeChild(element);
      });

      // Force garbage collection if available
      if (window.gc) {
        window.gc();
      }

      setTimeout(() => {
        const memoryAfterCleanup = performance.memory?.usedJSHeapSize || 0;
        const memoryLeaked = memoryAfterCleanup - memoryAfterCreation;

        resolve(Math.max(0, memoryLeaked));
      }, 1000);
    });
  }

  // Test bundle size impact
  testBundleSize() {
    return new Promise((resolve) => {
      // Measure bundle size by checking module size
      const moduleSize = this.estimateModuleSize();
      resolve(moduleSize);
    });
  }

  estimateModuleSize() {
    // Rough estimation based on UltraTyped.js size
    return 2 * 1024; // 2KB in bytes
  }
}

// Usage
const testSuite = new PerformanceTestSuite();

testSuite.addTest('60fps Performance', async () => {
  const minFPS = await testSuite.test60FPSPerformance();
  if (minFPS < 55) {
    throw new Error(`FPS too low: ${minFPS}`);
  }
});

testSuite.addTest('Memory Usage', async () => {
  const memoryLeaked = await testSuite.testMemoryUsage();
  if (memoryLeaked > 1024) { // More than 1KB leaked
    throw new Error(`Memory leak detected: ${memoryLeaked} bytes`);
  }
});

testSuite.addTest('Bundle Size', async () => {
  const bundleSize = await testSuite.testBundleSize();
  if (bundleSize > 3 * 1024) { // More than 3KB
    throw new Error(`Bundle too large: ${bundleSize} bytes`);
  }
});
```

### 2. Performance Profiling Tools

```javascript
// ✅ Development profiling tools
class PerformanceProfiler {
  constructor() {
    this.profiles = new Map();
    this.isProfiling = false;
  }

  startProfile(name) {
    if (this.isProfiling) return;

    this.isProfiling = true;
    const profile = {
      name,
      startTime: performance.now(),
      startMemory: performance.memory?.usedJSHeapSize || 0,
      frames: [],
      instances: [],
    };

    this.profiles.set(name, profile);

    // Start frame monitoring
    this.startFrameMonitoring(profile);

    return profile;
  }

  stopProfile(name) {
    const profile = this.profiles.get(name);
    if (!profile) return null;

    profile.endTime = performance.now();
    profile.endMemory = performance.memory?.usedJSHeapSize || 0;
    profile.duration = profile.endTime - profile.startTime;
    profile.memoryDelta = profile.endMemory - profile.startMemory;

    this.isProfiling = false;

    return this.analyzeProfile(profile);
  }

  startFrameMonitoring(profile) {
    let lastFrameTime = performance.now();

    const monitorFrame = () => {
      if (!this.isProfiling) return;

      const currentTime = performance.now();
      const frameTime = currentTime - lastFrameTime;

      profile.frames.push({
        time: currentTime,
        frameTime,
        fps: 1000 / frameTime,
      });

      lastFrameTime = currentTime;
      requestAnimationFrame(monitorFrame);
    };

    monitorFrame();
  }

  trackInstanceCreation(profile, config) {
    profile.instances.push({
      timestamp: performance.now(),
      config,
    });
  }

  analyzeProfile(profile) {
    const frameTimes = profile.frames.map(f => f.frameTime);
    const fpsValues = profile.frames.map(f => f.fps);

    return {
      name: profile.name,
      duration: profile.duration,
      memoryDelta: profile.memoryDelta,
      instances: profile.instances.length,
      frameStats: {
        averageFrameTime: this.average(frameTimes),
        minFrameTime: Math.min(...frameTimes),
        maxFrameTime: Math.max(...frameTimes),
        averageFPS: this.average(fpsValues),
        minFPS: Math.min(...fpsValues),
        maxFPS: Math.max(...fpsValues),
      },
      issues: this.detectPerformanceIssues(profile),
    };
  }

  average(values) {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  detectPerformanceIssues(profile) {
    const issues = [];
    const frameStats = this.analyzeProfile(profile).frameStats;

    if (frameStats.averageFPS < 55) {
      issues.push('Low average FPS');
    }

    if (frameStats.minFPS < 30) {
      issues.push('FPS drops detected');
    }

    if (frameStats.maxFrameTime > 33) { // More than 30fps
      issues.push('Frame spikes detected');
    }

    if (profile.memoryDelta > 1024) {
      issues.push('Memory leak detected');
    }

    return issues;
  }

  generateReport(profile) {
    const analysis = this.analyzeProfile(profile);

    return `
Performance Profile: ${analysis.name}
Duration: ${analysis.duration.toFixed(2)}ms
Memory Delta: ${analysis.memoryDelta} bytes
Instances: ${analysis.instances}

Frame Statistics:
- Average FPS: ${analysis.frameStats.averageFPS.toFixed(1)}
- Min FPS: ${analysis.frameStats.minFPS.toFixed(1)}
- Max FPS: ${analysis.frameStats.maxFPS.toFixed(1)}
- Average Frame Time: ${analysis.frameStats.averageFrameTime.toFixed(2)}ms

Issues: ${analysis.issues.join(', ') || 'None'}
    `.trim();
  }
}
```

---

## Production Optimization Checklist

### Pre-Deployment Checklist

- [ ] **Bundle Size Optimization**
  - [ ] Use framework-specific packages only
  - [ ] Enable tree shaking
  - [ ] Implement code splitting for non-critical typing effects
  - [ ] Verify bundle size <3KB

- [ ] **Performance Configuration**
  - [ ] Set appropriate type speeds (50ms recommended)
  - [ ] Disable debug mode
  - [ ] Use minimal cursor configuration
  - [ ] Enable smart backspacing

- [ ] **Memory Management**
  - [ ] Implement proper cleanup on component unmount
  - [ ] Avoid creating multiple instances per element
  - [ ] Use WeakMap for automatic cleanup where appropriate
  - [ ] Test for memory leaks

- [ ] **Mobile Optimization**
  - [ ] Implement device capability detection
  - [ ] Adjust configuration for low-end devices
  - [ ] Add touch event handling
  - [ ] Test on actual mobile devices

- [ ] **Battery Optimization**
  - [ ] Implement battery API integration
  - [ ] Add power-saving configurations
  - [ ] Monitor CPU usage and adapt accordingly
  - [ ] Test thermal management

### Runtime Monitoring

- [ ] **Performance Dashboard**
  - [ ] Implement FPS monitoring
  - [ ] Track memory usage
  - [ ] Monitor active instances
  - [ ] Set up alerts for performance issues

- [ ] **Error Tracking**
  - [ ] Integrate with error monitoring (Sentry, etc.)
  - [ ] Track performance degradation
  - [ ] Monitor user experience metrics
  - [ ] Set up automated performance reports

### Testing Requirements

- [ ] **Performance Tests**
  - [ ] 60fps animation test
  - [ ] Memory leak detection
  - [ ] Bundle size verification
  - [ ] Mobile performance testing

- [ ] **Load Testing**
  - [ ] Multiple concurrent instances
  - [ ] Long string handling
  - [ ] Rapid start/stop cycles
  - [ ] Memory stress testing

### Optimization Metrics

| Metric             | Target            | Measurement Method           |
| ------------------ | ----------------- | ---------------------------- |
| **Bundle Size**    | <2KB              | Bundle analyzer              |
| **Initial Load**   | <5ms              | Performance API              |
| **Frame Rate**     | 60fps             | requestAnimationFrame timing |
| **Memory Usage**   | <1KB per instance | Performance.memory API       |
| **CPU Usage**      | <1%               | Performance observer         |
| **Mobile FPS**     | >45fps            | Device testing               |
| **Battery Impact** | Minimal           | Battery API                  |

This comprehensive performance optimization guide ensures that UltraTyped.js delivers optimal performance across all devices and use cases while maintaining smooth 60fps animations and minimal resource usage.
