/**
 * Unit tests for Svelte adapter
 */

import { describe, it, expect } from 'vitest';
import { ultratyped } from './index';

describe('Svelte Adapter', () => {
  describe('ultratyped function', () => {
    it('should be defined', () => {
      expect(ultratyped).toBeDefined();
    });

    it('should be a function', () => {
      expect(typeof ultratyped).toBe('function');
    });

    it('should handle null element', () => {
      expect(() => ultratyped(null, { strings: ['Test'] })).not.toThrow();
    });

    it('should handle undefined element', () => {
      expect(() => ultratyped(undefined, { strings: ['Test'] })).not.toThrow();
    });

    it('should handle empty options', () => {
      expect(() => ultratyped(null, {})).not.toThrow();
    });

    it('should handle custom typeSpeed', () => {
      expect(() => ultratyped(null, { strings: ['Test'], typeSpeed: 100 })).not.toThrow();
    });

    it('should handle custom backSpeed', () => {
      expect(() => ultratyped(null, { strings: ['Test'], backSpeed: 50 })).not.toThrow();
    });

    it('should handle custom backDelay', () => {
      expect(() => ultratyped(null, { strings: ['Test'], backDelay: 1000 })).not.toThrow();
    });

    it('should handle loop option', () => {
      expect(() => ultratyped(null, { strings: ['Test'], loop: true })).not.toThrow();
    });

    it('should handle loop: false option', () => {
      expect(() => ultratyped(null, { strings: ['Test'], loop: false })).not.toThrow();
    });
  });
});
