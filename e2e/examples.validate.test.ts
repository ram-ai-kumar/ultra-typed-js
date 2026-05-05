// e2e/examples.validate.test.ts
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join, resolve } from "path";

const projectRoot = resolve(__dirname, "..");

const examplesWithBuild = [
  "packages/react/examples",
  "packages/vue/examples",
  "packages/svelte/examples",
];

const examplesReadmeOnly = [
  "packages/core/examples",
  "packages/alpine/examples",
  "packages/typescript/examples",
  "packages/typed-compat/examples",
  "packages/angular/examples",
  "packages/astro/examples",
  "packages/lit/examples",
  "packages/preact/examples",
  "packages/solid/examples",
];

describe("Example Validation", () => {
  // Validate examples with build capability
  describe("Buildable Examples (Structure)", () => {
    examplesWithBuild.forEach((examplePath) => {
      describe(`${examplePath}`, () => {
        it(`should have package.json`, () => {
          const packageJsonPath = join(projectRoot, examplePath, "package.json");
          expect(existsSync(packageJsonPath)).toBe(true);
        });

        it(`should have valid package.json`, () => {
          const packageJsonPath = join(projectRoot, examplePath, "package.json");
          const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
          expect(packageJson).toHaveProperty("name");
          expect(packageJson).toHaveProperty("version");
          expect(packageJson).toHaveProperty("scripts.build");
        });

        it(`should have source files`, () => {
          const exampleFullPath = join(projectRoot, examplePath);
          
          // Check that the example directory has some files
          const files = readdirSync(exampleFullPath);
          const hasContent = files.some(file => 
            file.includes('README.md') || 
            file.includes('src') || 
            file.includes('index.html') ||
            file.includes('.ts') ||
            file.includes('.svelte')
          );
          expect(hasContent).toBe(true);
        });

        it(`should have README.md with substantial content`, () => {
          const readmePath = join(projectRoot, examplePath, "README.md");
          expect(existsSync(readmePath)).toBe(true);
          const content = readFileSync(readmePath, "utf-8");
          expect(content.length).toBeGreaterThan(300);
          expect(content).toMatch(/UltraTyped|ultratyped/i);
          expect(content).toMatch(/```/); // Has code blocks
        });
      });
    });
  });

  // Validate examples with README only
  describe("README-Only Examples", () => {
    examplesReadmeOnly.forEach((examplePath) => {
      it(`${examplePath} should have README.md with substantial content`, () => {
        const readmePath = join(projectRoot, examplePath, "README.md");
        expect(existsSync(readmePath)).toBe(true);
        const content = readFileSync(readmePath, "utf-8");
        expect(content.length).toBeGreaterThan(300);
        expect(content).toMatch(/UltraTyped|ultratyped/i);
        expect(content).toMatch(/```/); // Has code blocks
        // Check for actual content beyond just markers
        const lines = content.split('\n').filter(line => line.trim() !== '' && !line.startsWith('```'));
        expect(lines.length).toBeGreaterThan(10);
      });
    });
  });
});
