/**
 * Unit tests for Astro adapter
 */

import { describe, it, expect } from 'vitest';
import { astroUltraTyped } from './index';

describe('Astro Adapter', () => {
  describe('astroUltraTyped function', () => {
    it('should be defined', () => {
      expect(astroUltraTyped).toBeDefined();
    });

    it('should be a function', () => {
      expect(typeof astroUltraTyped).toBe('function');
    });

    it('should handle null element', () => {
      expect(() => astroUltraTyped(null as any, { strings: ['Test'] })).not.toThrow();
    });

    it('should handle empty options', () => {
      expect(() => astroUltraTyped(null as any, { strings: [] })).not.toThrow();
    });

    it('should handle custom typeSpeed', () => {
      expect(() => astroUltraTyped(null as any, { strings: ['Test'], typeSpeed: 100 })).not.toThrow();
    });

    it('should handle loop option', () => {
      expect(() => astroUltraTyped(null as any, { strings: ['Test'], loop: true })).not.toThrow();
    });
  });
});
