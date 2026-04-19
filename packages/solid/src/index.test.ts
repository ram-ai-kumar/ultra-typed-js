/**
 * Unit tests for Solid.js adapter
 */

import { describe, it, expect } from 'vitest';
import { createUltraTyped } from './index';

describe('Solid.js Adapter', () => {
  describe('createUltraTyped function', () => {
    it('should be defined', () => {
      expect(createUltraTyped).toBeDefined();
    });

    it('should be a function', () => {
      expect(typeof createUltraTyped).toBe('function');
    });

    it('should handle null element', () => {
      expect(() => createUltraTyped(null as any, { strings: ['Test'] })).not.toThrow();
    });

    it('should handle empty options', () => {
      expect(() => createUltraTyped(null as any, { strings: [] })).not.toThrow();
    });

    it('should handle custom typeSpeed', () => {
      expect(() => createUltraTyped(null as any, { strings: ['Test'], typeSpeed: 100 })).not.toThrow();
    });

    it('should handle custom backSpeed', () => {
      expect(() => createUltraTyped(null as any, { strings: ['Test'], backSpeed: 50 })).not.toThrow();
    });

    it('should handle loop option', () => {
      expect(() => createUltraTyped(null as any, { strings: ['Test'], loop: true })).not.toThrow();
    });
  });
});
