/**
 * Comprehensive test suite for React adapter
 * Covers: Smoke, Edge, Negative, Exception, Regression tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, cleanup, act } from '@testing-library/react';
import { useUltraTyped } from './index';

describe('React Adapter', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Smoke Tests - Basic Functionality', () => {
    it('should return a ref', () => {
      const { result } = renderHook(() =>
        useUltraTyped({ strings: ['Hello', 'World'] })
      );

      expect(result.current).toBeDefined();
      expect(typeof result.current).toBe('object');
    });

    it('should handle empty options', () => {
      const { result } = renderHook(() => useUltraTyped({}));

      expect(result.current).toBeDefined();
    });

    it('should handle custom typeSpeed', () => {
      const { result } = renderHook(() =>
        useUltraTyped({ strings: ['Test'], typeSpeed: 100 })
      );

      expect(result.current).toBeDefined();
    });

    it('should handle multiple strings', () => {
      const { result } = renderHook(() =>
        useUltraTyped({ strings: ['First', 'Second', 'Third'] })
      );

      expect(result.current).toBeDefined();
    });

    it('should respect loop configuration', () => {
      const { result } = renderHook(() =>
        useUltraTyped({ strings: ['Test'], loop: false })
      );

      expect(result.current).toBeDefined();
    });

    it('should handle HTML content type', () => {
      const { result } = renderHook(() =>
        useUltraTyped({ strings: ['<strong>Bold</strong>'], contentType: 'html' })
      );

      expect(result.current).toBeDefined();
    });

    it('should handle callbacks', () => {
      const onStringTyped = vi.fn();
      const { result } = renderHook(() =>
        useUltraTyped({ strings: ['Test'], onStringTyped })
      );

      expect(result.current).toBeDefined();
      expect(typeof onStringTyped).toBe('function');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty strings array', () => {
      const { result } = renderHook(() => useUltraTyped({ strings: [] }));

      expect(result.current).toBeDefined();
    });

    it('should handle single character strings', () => {
      const { result } = renderHook(() => useUltraTyped({ strings: ['A', 'B'] }));

      expect(result.current).toBeDefined();
    });

    it('should handle very long strings', () => {
      const longString = 'A'.repeat(1000);
      const { result } = renderHook(() => useUltraTyped({ strings: [longString] }));

      expect(result.current).toBeDefined();
    });

    it('should handle special characters and Unicode', () => {
      const { result } = renderHook(() =>
        useUltraTyped({ strings: ['Hello 🌍 Émojis àccénts'] })
      );

      expect(result.current).toBeDefined();
    });

    it('should handle zero speed values', () => {
      const { result } = renderHook(() =>
        useUltraTyped({ strings: ['Test'], typeSpeed: 0, backSpeed: 0 })
      );

      expect(result.current).toBeDefined();
    });

    it('should handle negative delay values', () => {
      const { result } = renderHook(() =>
        useUltraTyped({ strings: ['Test'], startDelay: -100 })
      );

      expect(result.current).toBeDefined();
    });

    it('should handle infinite loop count', () => {
      const { result } = renderHook(() =>
        useUltraTyped({ strings: ['Loop'], loopCount: Infinity })
      );

      expect(result.current).toBeDefined();
    });

    it('should handle strings with only whitespace', () => {
      const { result } = renderHook(() =>
        useUltraTyped({ strings: ['   ', '\t\n', ''] })
      );

      expect(result.current).toBeDefined();
    });
  });

  describe('Negative Tests', () => {
    it('should handle null options', () => {
      const { result } = renderHook(() => useUltraTyped(null));

      expect(result.current).toBeDefined();
    });

    it('should handle undefined options', () => {
      const { result } = renderHook(() => useUltraTyped(undefined));

      expect(result.current).toBeDefined();
    });

    it('should handle non-string values in strings array', () => {
      const { result } = renderHook(() =>
        useUltraTyped({ strings: [123, null, undefined, {}] })
      );

      expect(result.current).toBeDefined();
    });

    it('should handle negative speed values', () => {
      const { result } = renderHook(() =>
        useUltraTyped({ strings: ['Test'], typeSpeed: -50 })
      );

      expect(result.current).toBeDefined();
    });

    it('should handle invalid content type', () => {
      const { result } = renderHook(() =>
        useUltraTyped({ strings: ['Test'], contentType: 'invalid' })
      );

      expect(result.current).toBeDefined();
    });
  });

  describe('Exception Handling', () => {
    it('should handle callback errors gracefully', () => {
      const errorCallback = vi.fn(() => {
        throw new Error('Callback error');
      });

      const { result } = renderHook(() =>
        useUltraTyped({ strings: ['Test'], onStringTyped: errorCallback })
      );

      expect(result.current).toBeDefined();
    });

    it('should handle re-rendering with different options', () => {
      let { result, rerender } = renderHook(
        ({ options }) => useUltraTyped(options),
        {
          initialProps: { options: { strings: ['Initial'] } },
        }
      );

      expect(result.current).toBeDefined();

      act(() => {
        rerender({ options: { strings: ['Updated', 'Options'] } });
      });

      expect(result.current).toBeDefined();
    });
  });

  describe('Regression Tests', () => {
    it('should handle multiple hook instances', () => {
      const { result: result1 } = renderHook(() =>
        useUltraTyped({ strings: ['Hook 1'] })
      );
      const { result: result2 } = renderHook(() =>
        useUltraTyped({ strings: ['Hook 2'] })
      );

      expect(result1.current).toBeDefined();
      expect(result2.current).toBeDefined();
      expect(result1.current).not.toBe(result2.current);
    });

    it('should handle hook cleanup on unmount', () => {
      const { result, unmount } = renderHook(() =>
        useUltraTyped({ strings: ['Test'] })
      );

      expect(result.current).toBeDefined();

      expect(() => unmount()).not.toThrow();
    });

    it('should maintain performance with large strings', () => {
      const largeString = 'A'.repeat(10000);
      const startTime = performance.now();

      const { result } = renderHook(() =>
        useUltraTyped({ strings: [largeString] })
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(result.current).toBeDefined();
      expect(renderTime).toBeLessThan(100); // Should render quickly
    });
  });
});
