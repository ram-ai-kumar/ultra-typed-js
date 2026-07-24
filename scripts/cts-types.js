#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const cwd = process.cwd();
const dts = path.join(cwd, "dist", "index.d.ts");
const dcts = path.join(cwd, "dist", "index.d.cts");

if (!fs.existsSync(dts)) {
  console.error(`Missing dist/index.d.ts in ${cwd}`);
  process.exit(1);
}

let src = fs.readFileSync(dts, "utf8");

const defaultMatch = src.match(/export\s+default\s+(?:function|class)\s+(\w+)/);

if (defaultMatch) {
  const name = defaultMatch[1];

  // Convert exported interfaces/types to internal declarations so the namespace
  // can re-export them without creating duplicate top-level exports.
  src = src.replace(/^export\s+(interface|type)\s+/gm, "$1 ");

  // Convert `export default function/class Name` to `declare function/class Name`
  src = src.replace(
    /^export\s+default\s+(function|class)\s+(\w+)/gm,
    "declare $1 $2",
  );

  // Gather top-level interface/type names to expose via the merged namespace.
  const names = new Set();
  const re = /^(?:interface|type)\s+(\w+)/gm;
  let m;
  while ((m = re.exec(src)) !== null) {
    names.add(m[1]);
  }

  const nsExports = Array.from(names).join(", ");
  const nsBlock = nsExports
    ? `\ndeclare namespace ${name} {\n  export { ${nsExports} };\n}\n`
    : "\n";

  src += `${nsBlock}export = ${name};\n`;
  fs.writeFileSync(dcts, src, "utf8");
} else {
  // Named exports are format-agnostic in declaration files; just copy.
  fs.copyFileSync(dts, dcts);
}
