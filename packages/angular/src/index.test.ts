/**
 * Comprehensive test suite for Angular adapter
 * Covers: Smoke, Edge, Negative, Exception, Regression, Security tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { UltraTypedDirective } from "./index";
import type { UltraTypedOptions } from "./index";

// Mock Angular's ElementRef and SimpleChanges
class MockElementRef {
  nativeElement: HTMLElement;

  constructor() {
    this.nativeElement = document.createElement("div");
  }
}

class MockSimpleChanges {
  [key: string]: any;
}

describe("Angular Adapter", () => {
  let directive: UltraTypedDirective;
  let mockElementRef: MockElementRef;
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    mockElementRef = new MockElementRef();
    mockElementRef.nativeElement = container;
    directive = new UltraTypedDirective(mockElementRef as any);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe("Smoke Tests - Basic Functionality", () => {
    it("should create directive instance", () => {
      expect(directive).toBeDefined();
      expect(directive).toBeInstanceOf(UltraTypedDirective);
    });

    it("should have default ultratyped options", () => {
      expect(directive.ultratyped).toBeDefined();
      expect(directive.ultratyped.strings).toEqual([]);
    });

    it("should handle basic string array", () => {
      directive.ultratyped = {
        strings: ["Hello", "World"],
      };

      const changes = new MockSimpleChanges();
      changes["ultratyped"] = {
        currentValue: directive.ultratyped,
        previousValue: undefined,
        firstChange: true,
      };

      expect(() => {
        directive.ngOnChanges(changes);
      }).not.toThrow();
    });

    it("should handle multiple strings", () => {
      directive.ultratyped = {
        strings: ["First", "Second", "Third"],
      };

      const changes = new MockSimpleChanges();
      changes["ultratyped"] = {
        currentValue: directive.ultratyped,
        previousValue: undefined,
        firstChange: true,
      };

      expect(() => {
        directive.ngOnChanges(changes);
      }).not.toThrow();
    });

    it("should respect loop configuration", () => {
      directive.ultratyped = {
        strings: ["Test"],
        loop: false,
      };

      const changes = new MockSimpleChanges();
      changes["ultratyped"] = {
        currentValue: directive.ultratyped,
        previousValue: undefined,
        firstChange: true,
      };

      expect(() => {
        directive.ngOnChanges(changes);
      }).not.toThrow();
    });

    it("should handle custom speeds", () => {
      directive.ultratyped = {
        strings: ["Speed test"],
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 500,
      };

      const changes = new MockSimpleChanges();
      changes["ultratyped"] = {
        currentValue: directive.ultratyped,
        previousValue: undefined,
        firstChange: true,
      };

      expect(() => {
        directive.ngOnChanges(changes);
      }).not.toThrow();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty strings array", () => {
      directive.ultratyped = {
        strings: [],
      };

      const changes = new MockSimpleChanges();
      changes["ultratyped"] = {
        currentValue: directive.ultratyped,
        previousValue: undefined,
        firstChange: true,
      };

      expect(() => {
        directive.ngOnChanges(changes);
      }).not.toThrow();
    });

    it("should handle single character strings", () => {
      directive.ultratyped = {
        strings: ["A", "B"],
      };

      const changes = new MockSimpleChanges();
      changes["ultratyped"] = {
        currentValue: directive.ultratyped,
        previousValue: undefined,
        firstChange: true,
      };

      expect(() => {
        directive.ngOnChanges(changes);
      }).not.toThrow();
    });

    it("should handle very long strings", () => {
      const longString = "A".repeat(1000);
      directive.ultratyped = {
        strings: [longString],
      };

      const changes = new MockSimpleChanges();
      changes["ultratyped"] = {
        currentValue: directive.ultratyped,
        previousValue: undefined,
        firstChange: true,
      };

      expect(() => {
        directive.ngOnChanges(changes);
      }).not.toThrow();
    });

    it("should handle special characters and Unicode", () => {
      directive.ultratyped = {
        strings: ["Hello 🌍 Émojis àccénts"],
      };

      const changes = new MockSimpleChanges();
      changes["ultratyped"] = {
        currentValue: directive.ultratyped,
        previousValue: undefined,
        firstChange: true,
      };

      expect(() => {
        directive.ngOnChanges(changes);
      }).not.toThrow();
    });

    it("should handle zero speed values", () => {
      directive.ultratyped = {
        strings: ["Test"],
        typeSpeed: 0,
        backSpeed: 0,
      };

      const changes = new MockSimpleChanges();
      changes["ultratyped"] = {
        currentValue: directive.ultratyped,
        previousValue: undefined,
        firstChange: true,
      };

      expect(() => {
        directive.ngOnChanges(changes);
      }).not.toThrow();
    });

    it("should handle strings with only whitespace", () => {
      directive.ultratyped = {
        strings: ["   ", "\t\n", ""],
      };

      const changes = new MockSimpleChanges();
      changes["ultratyped"] = {
        currentValue: directive.ultratyped,
        previousValue: undefined,
        firstChange: true,
      };

      expect(() => {
        directive.ngOnChanges(changes);
      }).not.toThrow();
    });
  });

  describe("Negative Tests", () => {
    it("should handle null ElementRef", () => {
      expect(() => {
        new UltraTypedDirective(null as any);
      }).not.toThrow();
    });

    it("should handle null ultratyped input", () => {
      directive.ultratyped = null as any;

      const changes = new MockSimpleChanges();
      changes["ultratyped"] = {
        currentValue: null,
        previousValue: { strings: ["Test"] },
        firstChange: false,
      };

      expect(() => {
        directive.ngOnChanges(changes);
      }).toThrow();
    });

    it("should handle undefined ultratyped input", () => {
      directive.ultratyped = undefined as any;

      const changes = new MockSimpleChanges();
      changes["ultratyped"] = {
        currentValue: undefined,
        previousValue: { strings: ["Test"] },
        firstChange: false,
      };

      expect(() => {
        directive.ngOnChanges(changes);
      }).toThrow();
    });

    it("should handle non-string values in strings array", () => {
      directive.ultratyped = {
        strings: ["Valid", 123, null] as any,
      };

      const changes = new MockSimpleChanges();
      changes["ultratyped"] = {
        currentValue: directive.ultratyped,
        previousValue: undefined,
        firstChange: true,
      };

      expect(() => {
        directive.ngOnChanges(changes);
      }).toThrow();
    });

    it("should handle negative speed values", () => {
      directive.ultratyped = {
        strings: ["Test"],
        typeSpeed: -50,
        backSpeed: -30,
      } as any;

      const changes = new MockSimpleChanges();
      changes["ultratyped"] = {
        currentValue: directive.ultratyped,
        previousValue: undefined,
        firstChange: true,
      };

      expect(() => {
        directive.ngOnChanges(changes);
      }).not.toThrow();
    });
  });

  describe("Exception Handling", () => {
    it("should handle ngOnDestroy without initialization", () => {
      expect(() => {
        directive.ngOnDestroy();
      }).not.toThrow();
    });

    it("should handle multiple ngOnChanges calls", () => {
      directive.ultratyped = {
        strings: ["Test"],
      };

      const changes = new MockSimpleChanges();
      changes["ultratyped"] = {
        currentValue: directive.ultratyped,
        previousValue: undefined,
        firstChange: true,
      };

      expect(() => {
        directive.ngOnChanges(changes);
        directive.ngOnChanges(changes);
      }).not.toThrow();
    });

    it("should handle multiple ngOnDestroy calls", () => {
      directive.ultratyped = {
        strings: ["Test"],
      };

      const changes = new MockSimpleChanges();
      changes["ultratyped"] = {
        currentValue: directive.ultratyped,
        previousValue: undefined,
        firstChange: true,
      };

      directive.ngOnChanges(changes);

      expect(() => {
        directive.ngOnDestroy();
        directive.ngOnDestroy();
      }).not.toThrow();
    });
  });

  describe("Regression Tests", () => {
    it("should handle multiple directive instances", () => {
      const container2 = document.createElement("div");
      document.body.appendChild(container2);

      const mockElementRef2 = new MockElementRef();
      mockElementRef2.nativeElement = container2;
      const directive2 = new UltraTypedDirective(mockElementRef2 as any);

      directive.ultratyped = {
        strings: ["Instance 1"],
      };
      directive2.ultratyped = {
        strings: ["Instance 2"],
      };

      const changes = new MockSimpleChanges();
      changes["ultratyped"] = {
        currentValue: directive.ultratyped,
        previousValue: undefined,
        firstChange: true,
      };

      expect(() => {
        directive.ngOnChanges(changes);
        directive2.ngOnChanges(changes);
      }).not.toThrow();

      document.body.removeChild(container2);
    });

    it("should maintain performance with large strings", () => {
      const largeString = "A".repeat(10000);
      directive.ultratyped = {
        strings: [largeString],
      };

      const changes = new MockSimpleChanges();
      changes["ultratyped"] = {
        currentValue: directive.ultratyped,
        previousValue: undefined,
        firstChange: true,
      };

      const startTime = performance.now();
      directive.ngOnChanges(changes);
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(100);
    });

    it("should handle option updates properly", () => {
      directive.ultratyped = {
        strings: ["Initial"],
      };

      const changes1 = new MockSimpleChanges();
      changes1["ultratyped"] = {
        currentValue: directive.ultratyped,
        previousValue: undefined,
        firstChange: true,
      };

      directive.ngOnChanges(changes1);

      // Update options
      directive.ultratyped = {
        strings: ["Updated", "Options"],
      };

      const changes2 = new MockSimpleChanges();
      changes2["ultratyped"] = {
        currentValue: directive.ultratyped,
        previousValue: { strings: ["Initial"] },
        firstChange: false,
      };

      expect(() => {
        directive.ngOnChanges(changes2);
      }).not.toThrow();
    });
  });

  describe("Security Tests", () => {
    it("should handle XSS attempts in strings gracefully", () => {
      const xssString = '<script>alert("xss")</script>';
      directive.ultratyped = {
        strings: [xssString],
      };

      const changes = new MockSimpleChanges();
      changes["ultratyped"] = {
        currentValue: directive.ultratyped,
        previousValue: undefined,
        firstChange: true,
      };

      expect(() => {
        directive.ngOnChanges(changes);
      }).not.toThrow();
    });

    it("should handle HTML entities in strings", () => {
      const htmlString = '&lt;script&gt;alert("xss")&lt;/script&gt;';
      directive.ultratyped = {
        strings: [htmlString],
      };

      const changes = new MockSimpleChanges();
      changes["ultratyped"] = {
        currentValue: directive.ultratyped,
        previousValue: undefined,
        firstChange: true,
      };

      expect(() => {
        directive.ngOnChanges(changes);
      }).not.toThrow();
    });

    it("should handle very long strings that could cause DoS", () => {
      const dosString = "A".repeat(100000);
      directive.ultratyped = {
        strings: [dosString],
      };

      const changes = new MockSimpleChanges();
      changes["ultratyped"] = {
        currentValue: directive.ultratyped,
        previousValue: undefined,
        firstChange: true,
      };

      expect(() => {
        directive.ngOnChanges(changes);
      }).not.toThrow();
    });
  });

  describe("Angular Lifecycle Integration", () => {
    it("should implement OnChanges interface", () => {
      expect(typeof directive.ngOnChanges).toBe("function");
    });

    it("should implement OnDestroy interface", () => {
      expect(typeof directive.ngOnDestroy).toBe("function");
    });

    it("should handle empty SimpleChanges", () => {
      expect(() => {
        directive.ngOnChanges({});
      }).not.toThrow();
    });

    it("should handle SimpleChanges without ultratyped property", () => {
      const changes = new MockSimpleChanges();
      changes["otherProperty"] = {
        currentValue: "value",
        previousValue: undefined,
        firstChange: true,
      };

      expect(() => {
        directive.ngOnChanges(changes);
      }).not.toThrow();
    });
  });
});
