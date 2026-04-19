/**
 * Unit tests for Alpine.js adapter
 */

import { describe, it, expect } from 'vitest';
import { ultratypedAlpine } from './index';

describe('Alpine.js Adapter', () => {
  describe('ultratypedAlpine function', () => {
    it('should be defined', () => {
      expect(ultratypedAlpine).toBeDefined();
    });

    it('should be a function', () => {
      expect(typeof ultratypedAlpine).toBe('function');
    });

    it('should handle Alpine object', () => {
      expect(() => ultratypedAlpine({} as any)).not.toThrow();
    });
  });
});
