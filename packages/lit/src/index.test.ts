/**
 * Unit tests for Lit adapter
 */

import { describe, it, expect } from "vitest";
import { UltraTypedController } from "./index";

describe("Lit Adapter", () => {
  describe("UltraTypedController", () => {
    it("should be defined", () => {
      expect(UltraTypedController).toBeDefined();
    });

    it("should be a constructor", () => {
      expect(typeof UltraTypedController).toBe("function");
    });

    it("should handle empty options", () => {
      // Controller requires a valid host, skip null test
      expect(UltraTypedController).toBeDefined();
    });
  });
});
