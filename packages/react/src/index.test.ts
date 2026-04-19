/**
 * Unit tests for React adapter
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, cleanup } from '@testing-library/react';
import { useUltraTyped } from './index';

describe('React Adapter', () => {
  afterEach(() => {
    cleanup();
  });

  describe('useUltraTyped Hook', () => {
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

    it('should handle custom backSpeed', () => {
      const { result } = renderHook(() =>
        useUltraTyped({ strings: ['Test'], backSpeed: 50 })
      );

      expect(result.current).toBeDefined();
    });

    it('should handle custom backDelay', () => {
      const { result } = renderHook(() =>
        useUltraTyped({ strings: ['Test'], backDelay: 1000 })
      );

      expect(result.current).toBeDefined();
    });

    it('should handle loop option', () => {
      const { result } = renderHook(() =>
        useUltraTyped({ strings: ['Test'], loop: true })
      );

      expect(result.current).toBeDefined();
    });

    it('should handle loop: false option', () => {
      const { result } = renderHook(() =>
        useUltraTyped({ strings: ['Test'], loop: false })
      );

      expect(result.current).toBeDefined();
    });

    it('should handle single string', () => {
      const { result } = renderHook(() =>
        useUltraTyped({ strings: ['Single'] })
      );

      expect(result.current).toBeDefined();
    });

    it('should handle multiple strings', () => {
      const { result } = renderHook(() =>
        useUltraTyped({ strings: ['First', 'Second', 'Third'] })
      );

      expect(result.current).toBeDefined();
    });

    it('should handle empty strings array', () => {
      const { result } = renderHook(() =>
        useUltraTyped({ strings: [] })
      );

      expect(result.current).toBeDefined();
    });

    it('should handle special characters', () => {
      const { result } = renderHook(() =>
        useUltraTyped({ strings: ['Hello! @#$%^&*()'] })
      );

      expect(result.current).toBeDefined();
    });

    it('should handle Unicode characters', () => {
      const { result } = renderHook(() =>
        useUltraTyped({ strings: ['Hello 世界 🌍'] })
      );

      expect(result.current).toBeDefined();
    });

    it('should cleanup on unmount', () => {
      const { result, unmount } = renderHook(() =>
        useUltraTyped({ strings: ['Test'] })
      );

      expect(result.current).toBeDefined();
      expect(() => unmount()).not.toThrow();
    });

    it('should handle rapid re-renders', () => {
      const { result, rerender } = renderHook(
        (props) => useUltraTyped(props),
        { initialProps: { strings: ['Test'] } }
      );

      expect(result.current).toBeDefined();

      expect(() => {
        for (let i = 0; i < 10; i++) {
          rerender({ strings: ['Test', 'Updated'] });
        }
      }).not.toThrow();
    });
  });
});
