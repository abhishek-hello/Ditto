#!/usr/bin/env node
/**
 * Compare env.example (the catalogue) against .env (your local values).
 * Exit 1 if any catalogued key is missing from .env, or .env has keys not in
 * the catalogue (so env.example never drifts).
 *
 *   node scripts/check-env.mjs          # checks .env
 *   node scripts/check-env.mjs .env.ci  # checks another file
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const examplePath = resolve(root, 'env.example');
const envPath = resolve(root, process.argv[2] ?? '.env');

function keysOf(file) {
  return new Set(
    readFileSync(file, 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'))
      .map((l) => l.split('=')[0].trim()),
  );
}

if (!existsSync(envPath)) {
  console.error(`✗ ${envPath} not found. Run: cp env.example .env`);
  process.exit(1);
}

const example = keysOf(examplePath);
const actual = keysOf(envPath);
const missing = [...example].filter((k) => !actual.has(k));
const extra = [...actual].filter((k) => !example.has(k));

if (missing.length) console.error(`✗ Missing from ${envPath}:\n  ${missing.join('\n  ')}`);
if (extra.length) console.error(`✗ In ${envPath} but not in env.example:\n  ${extra.join('\n  ')}`);
if (missing.length || extra.length) process.exit(1);
console.warn(`✓ ${envPath} matches env.example (${example.size} keys)`);
