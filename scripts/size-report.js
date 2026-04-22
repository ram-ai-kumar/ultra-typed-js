#!/usr/bin/env node
/**
 * Bundle Size Report — UltraTyped.js
 *
 * Measures gzip + raw sizes of every package bundle, compares them against a
 * committed baseline, and prints a rich terminal table with deltas.
 *
 * Exit codes
 *   0  — all packages within baseline + threshold, or baseline updated
 *   1  — one or more packages regressed beyond REGRESSION_THRESHOLD
 *
 * Usage
 *   node scripts/size-report.js              # compare vs baseline
 *   node scripts/size-report.js --update     # write new baseline and exit 0
 *   node scripts/size-report.js --ci         # compact output for CI logs
 */

import { readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { createGzip } from 'zlib';
import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

// ─── Constants ───────────────────────────────────────────────────────────────

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.resolve(__dirname, '..');
const BASELINE   = path.join(ROOT, 'benchmarks/bundle-size-baseline.json');

/**
 * Maximum relative growth (5%) before a package is flagged as regressed.
 * A 5% increase on a 1 800 B core = 90 B — a meaningful, intentional change.
 */
const REGRESSION_THRESHOLD = 0.05;

/**
 * Aspirational gzip target for the core package (the primary marketing claim).
 * Packages exceeding this get a ⚠ marker even when within baseline threshold.
 */
const CORE_GZIP_GOAL = 2048; // 2 KB

/** All packages tracked for size regressions. */
const PACKAGES = [
  { name: 'core',         pkg: 'ultratyped',               file: 'packages/core/dist/index.mjs',          limitBytes: 2048  },
  { name: 'react',        pkg: '@ultratyped/react',         file: 'packages/react/dist/index.mjs',         limitBytes: 1024  },
  { name: 'vue',          pkg: '@ultratyped/vue',           file: 'packages/vue/dist/index.mjs',           limitBytes: 1024  },
  { name: 'svelte',       pkg: '@ultratyped/svelte',        file: 'packages/svelte/dist/index.mjs',        limitBytes: 1024  },
  { name: 'angular',      pkg: '@ultratyped/angular',       file: 'packages/angular/dist/index.mjs',       limitBytes: 1536  },
  { name: 'preact',       pkg: '@ultratyped/preact',        file: 'packages/preact/dist/index.mjs',        limitBytes: 1024  },
  { name: 'solid',        pkg: '@ultratyped/solid',         file: 'packages/solid/dist/index.mjs',         limitBytes: 1024  },
  { name: 'lit',          pkg: '@ultratyped/lit',           file: 'packages/lit/dist/index.mjs',           limitBytes: 1024  },
  { name: 'alpine',       pkg: '@ultratyped/alpine',        file: 'packages/alpine/dist/index.mjs',        limitBytes: 1024  },
  { name: 'astro',        pkg: '@ultratyped/astro',         file: 'packages/astro/dist/index.mjs',         limitBytes: 1024  },
  { name: 'typescript',   pkg: '@ultratyped/typescript',    file: 'packages/typescript/dist/index.mjs',    limitBytes: 3072  },
  { name: 'typed-compat', pkg: '@ultratyped/typed-compat',  file: 'packages/typed-compat/dist/index.mjs',  limitBytes: 5120  },
];

// ─── CLI flags ────────────────────────────────────────────────────────────────

const args          = process.argv.slice(2);
const FLAG_UPDATE   = args.includes('--update');
const FLAG_CI       = args.includes('--ci');

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Gzip-compress a file and return the compressed byte length. */
async function gzipSize(filePath) {
  const tmp = path.join(tmpdir(), `ultratyped-size-${Date.now()}.gz`);
  await pipeline(
    createReadStream(filePath),
    createGzip({ level: 9 }),
    createWriteStream(tmp),
  );
  const size = statSync(tmp).size;
  // best-effort cleanup — don't block on failure
  try { import('fs').then(fs => fs.unlinkSync(tmp)); } catch {}
  return size;
}

/** Format bytes to a human-readable string (B / KB). */
function fmt(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(2)} KB`;
}

/** Colour-code a delta string for the terminal (green = smaller, red = bigger). */
function colourDelta(bytes) {
  const sign = bytes > 0 ? '+' : '';
  const str  = `${sign}${fmt(bytes)}`;
  if (bytes < 0)  return `\x1b[32m${str}\x1b[0m`; // green  (smaller = good)
  if (bytes === 0) return `\x1b[90m${str}\x1b[0m`; // grey   (no change)
  return `\x1b[31m${str}\x1b[0m`;                  // red    (bigger = bad)
}

/** Return a % change string, coloured. */
function colourPct(pct) {
  const sign = pct > 0 ? '+' : '';
  const str  = `${sign}${(pct * 100).toFixed(1)}%`;
  if (pct < 0)  return `\x1b[32m${str}\x1b[0m`;
  if (pct === 0) return `\x1b[90m${str}\x1b[0m`;
  return `\x1b[31m${str}\x1b[0m`;
}

function pad(str, len, right = false) {
  const plain = str.replace(/\x1b\[[0-9;]*m/g, ''); // strip ANSI for width calc
  const pad   = ' '.repeat(Math.max(0, len - plain.length));
  return right ? pad + str : str + pad;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // ── 1. Measure current sizes ─────────────────────────────────────────────

  const results = [];

  for (const pkg of PACKAGES) {
    const absFile = path.join(ROOT, pkg.file);

    if (!existsSync(absFile)) {
      results.push({ ...pkg, raw: null, gzip: null, skipped: true });
      continue;
    }

    const raw  = statSync(absFile).size;
    const gzip = await gzipSize(absFile);
    results.push({ ...pkg, raw, gzip, skipped: false });
  }

  // ── 2. Load (or initialise) baseline ─────────────────────────────────────

  let baseline = {};
  let isNewBaseline = false;

  if (existsSync(BASELINE)) {
    baseline = JSON.parse(readFileSync(BASELINE, 'utf8')).packages ?? {};
  } else {
    isNewBaseline = true;
  }

  // ── 3. Update baseline mode ───────────────────────────────────────────────

  if (FLAG_UPDATE) {
    const newBaseline = {
      version:   2,
      updatedAt: new Date().toISOString(),
      packages:  {},
    };
    for (const r of results) {
      if (!r.skipped) {
        newBaseline.packages[r.name] = { raw: r.raw, gzip: r.gzip };
      }
    }
    writeFileSync(BASELINE, JSON.stringify(newBaseline, null, 2) + '\n');
    console.log(`\x1b[32m✔\x1b[0m Baseline written → ${path.relative(ROOT, BASELINE)}`);
    console.log(`  Commit this file to lock in the new baseline.`);
    process.exit(0);
  }

  // ── 4. Compare & build report rows ───────────────────────────────────────

  const COL = { name: 22, raw: 10, gzip: 10, delta: 14, pct: 9, status: 8 };

  const header = [
    pad('Package',  COL.name),
    pad('Raw',      COL.raw,   true),
    pad('Gzip',     COL.gzip,  true),
    pad('Δ Gzip',   COL.delta, true),
    pad('%',        COL.pct,   true),
    'Status',
  ].join('  ');

  const separator = '─'.repeat(header.replace(/\x1b\[[0-9;]*m/g, '').length);

  const rows      = [];
  let   regressed = false;

  for (const r of results) {
    if (r.skipped) {
      rows.push([
        pad(r.name,     COL.name),
        pad('—',        COL.raw,   true),
        pad('—',        COL.gzip,  true),
        pad('—',        COL.delta, true),
        pad('—',        COL.pct,   true),
        '\x1b[90mskipped (no dist)\x1b[0m',
      ].join('  '));
      continue;
    }

    const base    = baseline[r.name];
    const deltaB  = base ? r.gzip - base.gzip : 0;
    const deltaPct = base ? deltaB / base.gzip : 0;

    let statusIcon;
    if (!base || isNewBaseline) {
      statusIcon = '\x1b[36mnew baseline\x1b[0m';
    } else if (deltaPct > REGRESSION_THRESHOLD) {
      statusIcon = '\x1b[31m✖ REGRESSED\x1b[0m';
      regressed  = true;
    } else if (r.name === 'core' && r.gzip > CORE_GZIP_GOAL) {
      statusIcon = '\x1b[33m⚠ >2 KB goal\x1b[0m';
    } else if (deltaB < 0) {
      statusIcon = '\x1b[32m✔ smaller\x1b[0m';
    } else {
      statusIcon = '\x1b[32m✔\x1b[0m';
    }

    rows.push([
      pad(r.name,              COL.name),
      pad(fmt(r.raw),          COL.raw,   true),
      pad(fmt(r.gzip),         COL.gzip,  true),
      pad(base ? colourDelta(deltaB)  : '\x1b[90m—\x1b[0m', COL.delta, true),
      pad(base ? colourPct(deltaPct) : '\x1b[90m—\x1b[0m',  COL.pct,   true),
      statusIcon,
    ].join('  '));
  }

  // ── 5. Print report ───────────────────────────────────────────────────────

  if (!FLAG_CI) {
    console.log('\n\x1b[1mUltraTyped.js — Bundle Size Report\x1b[0m\n');
    console.log(separator);
    console.log(header);
    console.log(separator);
    for (const row of rows) console.log(row);
    console.log(separator);
  }

  // Always print a compact summary line for CI logs
  const measured = results.filter(r => !r.skipped);
  const skipped  = results.filter(r => r.skipped);
  console.log(
    `\nMeasured: ${measured.length} packages` +
    (skipped.length ? `  •  Skipped: ${skipped.length} (no dist)` : '') +
    (regressed ? '  \x1b[31m✖ REGRESSION DETECTED\x1b[0m' : '  \x1b[32m✔ All within threshold\x1b[0m')
  );

  if (isNewBaseline && !FLAG_UPDATE) {
    console.log(
      '\n\x1b[33m⚠  No baseline found — run `npm run size:report -- --update` to create one.\x1b[0m'
    );
  }

  if (regressed) {
    console.log(
      '\n\x1b[31mOne or more packages grew beyond the regression threshold.\x1b[0m\n' +
      'To accept this size increase as intentional, run:\n' +
      '  npm run size:report -- --update\n' +
      'Then commit the updated benchmarks/bundle-size-baseline.json.\n'
    );
    process.exit(1);
  }
}

main().catch(err => {
  console.error('\x1b[31msize-report failed:\x1b[0m', err.message);
  process.exit(1);
});
