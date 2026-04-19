/**
 * Unit tests for TypeScript adapter
 */

import { describe, it, expect } from 'vitest';
import { UltraTypedTS, createUltraTyped } from './index';

describe('TypeScript Adapter', () => {
  describe('UltraTypedTS Class', () => {
    it('should be defined', () => {
      expect(UltraTypedTS).toBeDefined();
    });

    it('should be a constructor', () => {
      expect(typeof UltraTypedTS).toBe('function');
    });

    it('should handle null element', () => {
      expect(() => new UltraTypedTS(null as any, { strings: ['Test'] })).not.toThrow();
    });

    it('should handle empty options', () => {
      expect(() => new UltraTypedTS(null as any, {})).not.toThrow();
    });

    it('should have control methods', () => {
      const instance = new UltraTypedTS(null as any, { strings: ['Test'] });
      expect(instance.start).toBeDefined();
      expect(instance.stop).toBeDefined();
      expect(instance.reset).toBeDefined();
      expect(instance.destroy).toBeDefined();
      expect(instance.updateOptions).toBeDefined();
    });
  });

  describe('createUltraTyped Factory', () => {
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
      expect(() => createUltraTyped(null as any, {})).not.toThrow();
    });

    it('should return instance with control methods', () => {
      const instance = createUltraTyped(null as any, { strings: ['Test'] });
      expect(instance.start).toBeDefined();
      expect(instance.stop).toBeDefined();
      expect(instance.reset).toBeDefined();
      expect(instance.destroy).toBeDefined();
      expect(instance.updateOptions).toBeDefined();
    });
  });
});
