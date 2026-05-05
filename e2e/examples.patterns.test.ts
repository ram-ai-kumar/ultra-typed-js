// e2e/examples.patterns.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

describe("Example Pattern Validation", () => {
  const readmeExamples = [
    {
      framework: "React",
      path: "packages/react/examples/README.md",
      patterns: ["useUltraTyped", "useEffect", "useRef"],
      validateCodeBlocks: true,
    },
    {
      framework: "Vue",
      path: "packages/vue/examples/README.md",
      patterns: ["useUltraTyped", "ref\\(", "onBeforeUnmount"],
      validateCodeBlocks: true,
    },
    {
      framework: "Svelte",
      path: "packages/svelte/examples/README.md",
      patterns: ["onMount", "onDestroy", "use:ultratyped"],
      validateCodeBlocks: true,
    },
    {
      framework: "Alpine.js",
      path: "packages/alpine/examples/README.md",
      patterns: ["x-data", "x-init", "\\$refs"],
      validateCodeBlocks: false, // Alpine examples might be in HTML
    },
    {
      framework: "Lit",
      path: "packages/lit/examples/README.md",
      patterns: ["LitElement", "firstUpdated", "disconnectedCallback"],
      validateCodeBlocks: true,
    },
    {
      framework: "Preact",
      path: "packages/preact/examples/README.md",
      patterns: ["useUltraTyped", "useEffect", "useRef"],
      validateCodeBlocks: true,
    },
    {
      framework: "Solid",
      path: "packages/solid/examples/README.md",
      patterns: ["useUltraTyped", "createEffect", "onCleanup"],
      validateCodeBlocks: true,
    },
    {
      framework: "Core",
      path: "packages/core/examples/README.md",
      patterns: ["UltraTyped", "basic-example"],
      validateCodeBlocks: true,
    },
    {
      framework: "TypeScript",
      path: "packages/typescript/examples/README.md",
      patterns: ["UltraTyped", "UltraTypedOptions"],
      validateCodeBlocks: true,
    },
    {
      framework: "Typed Compat",
      path: "packages/typed-compat/examples/README.md",
      patterns: ["Typed", "typed-compat"],
      validateCodeBlocks: true,
    },
    {
      framework: "Angular",
      path: "packages/angular/examples/README.md",
      patterns: ["UltraTyped", "@Component"],
      validateCodeBlocks: true,
    },
    {
      framework: "Astro",
      path: "packages/astro/examples/README.md",
      patterns: ["UltraTyped", "define:"], // Astro component syntax
      validateCodeBlocks: true,
    },
  ];

  readmeExamples.forEach(({ framework, path, patterns, validateCodeBlocks = true }) => {
    describe(`${framework} README`, () => {
      let content: string;

      beforeEach(() => {
        expect(existsSync(path)).toBe(true);
        content = readFileSync(path, "utf-8");
      });

      it(`should contain expected patterns`, () => {
        patterns.forEach((pattern) => {
          const regex = new RegExp(pattern);
          expect(content).toMatch(regex);
        });
      });

      if (validateCodeBlocks) {
        it(`should have valid code blocks in examples`, () => {
          // Extract code blocks (assuming markdown fenced code blocks)
          const codeBlockRegex = /```[^`]*?```/g;
          const codeBlocks = content.match(codeBlockRegex) || [];

          // Should have at least one code block
          expect(codeBlocks.length).toBeGreaterThan(0);

          // Each code block should have content
          codeBlocks.forEach((block, index) => {
            const cleanBlock = block.replace(/^```[^`]*?\n?/, '').replace(/\n?```$/, '');
            expect(cleanBlock.trim().length).toBeGreaterThan(0);
          });
        });
      }
    });
  });
});
