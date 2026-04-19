/**
 * Unit tests for Preact adapter
 */

import { describe, it, expect } from "vitest";
import { useUltraTyped } from "./index";

describe("Preact Adapter", () => {
  describe("useUltraTyped Hook", () => {
    it("should be defined", () => {
      expect(useUltraTyped).toBeDefined();
    });

    it("should be a function", () => {
      expect(typeof useUltraTyped).toBe("function");
    });

    // Note: Preact hooks require component context to run
    // These tests verify the hook exists and is a function
    // Full testing requires a Preact component test environment
  });
});
