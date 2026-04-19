/**
 * Unit tests for Vue adapter
 */

import { describe, it, expect } from 'vitest';
import { useUltraTyped } from './index';

describe('Vue Adapter', () => {
  describe('useUltraTyped Composable', () => {
    it('should return a ref', () => {
      const el = useUltraTyped({ strings: ['Hello', 'World'] });

      expect(el).toBeDefined();
      expect(el.value).toBeDefined();
    });

    it('should handle empty options', () => {
      const el = useUltraTyped({});

      expect(el).toBeDefined();
    });

    it('should handle custom typeSpeed', () => {
      const el = useUltraTyped({ strings: ['Test'], typeSpeed: 100 });

      expect(el).toBeDefined();
    });

    it('should handle custom backSpeed', () => {
      const el = useUltraTyped({ strings: ['Test'], backSpeed: 50 });

      expect(el).toBeDefined();
    });

    it('should handle custom backDelay', () => {
      const el = useUltraTyped({ strings: ['Test'], backDelay: 1000 });

      expect(el).toBeDefined();
    });

    it('should handle loop option', () => {
      const el = useUltraTyped({ strings: ['Test'], loop: true });

      expect(el).toBeDefined();
    });

    it('should handle loop: false option', () => {
      const el = useUltraTyped({ strings: ['Test'], loop: false });

      expect(el).toBeDefined();
    });

    it('should handle single string', () => {
      const el = useUltraTyped({ strings: ['Single'] });

      expect(el).toBeDefined();
    });

    it('should handle multiple strings', () => {
      const el = useUltraTyped({ strings: ['First', 'Second', 'Third'] });

      expect(el).toBeDefined();
    });

    it('should handle empty strings array', () => {
      const el = useUltraTyped({ strings: [] });

      expect(el).toBeDefined();
    });

    it('should handle special characters', () => {
      const el = useUltraTyped({ strings: ['Hello! @#$%^&*()'] });

      expect(el).toBeDefined();
    });

    it('should handle Unicode characters', () => {
      const el = useUltraTyped({ strings: ['Hello 世界 🌍'] });

      expect(el).toBeDefined();
    });
  });
});
