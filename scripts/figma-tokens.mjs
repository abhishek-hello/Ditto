#!/usr/bin/env node
/**
 * Pull design data from Figma over the REST API (separate quota from the MCP
 * server, works on every plan with a personal access token).
 *
 *   node scripts/figma-tokens.mjs list                    # pages + top-level frames
 *   node scripts/figma-tokens.mjs extract 1:164310 [...]  # colours, text, spacing, radii, shadows, icons
 *   node scripts/figma-tokens.mjs extract 1:164310 --json # same, machine-readable
 *   node scripts/figma-tokens.mjs export 1:164310 --png --out /tmp/shots       # render frames
 *   node scripts/figma-tokens.mjs export 12:34 56:78 --svg --out apps/mobile/assets/icons
 *
 * Needs FIGMA_TOKEN in the root .env (Figma → Settings → Security → Personal
 * access tokens, scope "File content: read"). Optional FIGMA_FILE_KEY overrides
 * the default file.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const DEFAULT_FILE_KEY = 'NyZLmydPFVxa8ehyWWyB68';
const API = 'https://api.figma.com/v1';
const out = (line) => process.stdout.write(`${line}\n`);

// ── env ───────────────────────────────────────────────────────────────────────

function loadRootEnv() {
  const envPath = resolve(root, '.env');
  if (!existsSync(envPath)) return {};
  const out = {};
  for (const raw of readFileSync(envPath, 'utf8').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    out[line.slice(0, eq).trim()] = line
      .slice(eq + 1)
      .trim()
      .replace(/^['"]|['"]$/g, '');
  }
  return out;
}

const env = { ...loadRootEnv(), ...process.env };
const token = env.FIGMA_TOKEN;
const fileKey = env.FIGMA_FILE_KEY || DEFAULT_FILE_KEY;

if (!token) {
  console.error('✗ FIGMA_TOKEN is not set. Add it to the root .env (see ENVIRONMENTS.md).');
  process.exit(1);
}

// ── http ──────────────────────────────────────────────────────────────────────

async function figma(path) {
  const res = await fetch(`${API}${path}`, { headers: { 'X-Figma-Token': token } });
  if (res.status === 429) {
    const retry = res.headers.get('retry-after');
    throw new Error(`Figma REST rate limit hit${retry ? ` — retry after ${retry}s` : ''}.`);
  }
  if (!res.ok) {
    throw new Error(`Figma ${res.status} on ${path}: ${(await res.text()).slice(0, 300)}`);
  }
  return res.json();
}

// ── helpers ───────────────────────────────────────────────────────────────────

const normId = (id) => id.replace('-', ':');

function toHex({ r, g, b, a = 1 }, opacity = 1) {
  const c = (v) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, '0');
  const alpha = a * opacity;
  return alpha >= 0.999 ? `#${c(r)}${c(g)}${c(b)}` : `#${c(r)}${c(g)}${c(b)}${c(alpha)}`;
}

class Tally {
  constructor() {
    this.map = new Map();
  }
  add(key, sample) {
    const entry = this.map.get(key) ?? { key, count: 0, samples: new Set() };
    entry.count += 1;
    if (sample && entry.samples.size < 4) entry.samples.add(sample);
    this.map.set(key, entry);
  }
  sorted() {
    return [...this.map.values()]
      .sort((a, b) => b.count - a.count)
      .map((e) => ({ ...e, samples: [...e.samples] }));
  }
}

const ICON_TYPES = new Set([
  'VECTOR',
  'BOOLEAN_OPERATION',
  'STAR',
  'ELLIPSE',
  'LINE',
  'REGULAR_POLYGON',
]);
const looksLikeIcon = (node) =>
  /icon|logo|glyph|symbol/i.test(node.name ?? '') ||
  (node.type === 'INSTANCE' && /icon/i.test(node.name ?? ''));

// ── extract ───────────────────────────────────────────────────────────────────

function extract(nodesResponse) {
  const colours = new Tally();
  const namedStyles = new Tally();
  const text = new Tally();
  const radii = new Tally();
  const padding = new Tally();
  const gaps = new Tally();
  const shadows = new Tally();
  const strokes = new Tally();
  const variables = new Tally();
  const icons = new Map();
  const images = new Map();
  const frames = [];
  const copy = new Tally();

  for (const [id, entry] of Object.entries(nodesResponse.nodes)) {
    if (!entry?.document) {
      console.error(`✗ node ${id} not found in file`);
      continue;
    }
    const styleNames = entry.styles ?? {};

    const walk = (node, path, depth) => {
      const here = `${path}/${node.name}`;
      const label = `${node.name} (${node.id})`;

      if (depth <= 1 && node.absoluteBoundingBox) {
        const { width, height } = node.absoluteBoundingBox;
        frames.push({ id: node.id, name: node.name, width, height, depth });
      }

      for (const fill of node.fills ?? []) {
        if (fill.visible === false) continue;
        if (fill.type === 'SOLID') colours.add(toHex(fill.color, fill.opacity), here);
        if (fill.type === 'IMAGE') images.set(node.id, { name: node.name, ref: fill.imageRef });
        if (fill.type?.startsWith('GRADIENT')) {
          const stops = (fill.gradientStops ?? []).map((s) => toHex(s.color)).join(' → ');
          colours.add(`gradient(${stops})`, here);
        }
      }
      for (const stroke of node.strokes ?? []) {
        if (stroke.visible === false || stroke.type !== 'SOLID') continue;
        strokes.add(`${toHex(stroke.color, stroke.opacity)} @ ${node.strokeWeight ?? '?'}px`, here);
      }
      for (const [slot, styleId] of Object.entries(node.styles ?? {})) {
        const s = styleNames[styleId];
        if (s) namedStyles.add(`${slot}: ${s.name}`, here);
      }
      for (const [prop, ref] of Object.entries(node.boundVariables ?? {})) {
        const refs = Array.isArray(ref) ? ref : [ref];
        for (const r of refs) if (r?.id) variables.add(`${prop} → ${r.id}`, here);
      }

      if (node.type === 'TEXT' && node.style) {
        const s = node.style;
        const lh = s.lineHeightPx ? `/${Math.round(s.lineHeightPx)}` : '';
        const ls = s.letterSpacing ? ` ls:${s.letterSpacing.toFixed(2)}` : '';
        const tc = s.textCase && s.textCase !== 'ORIGINAL' ? ` ${s.textCase.toLowerCase()}` : '';
        text.add(`${s.fontFamily} ${s.fontWeight} ${s.fontSize}${lh}${ls}${tc}`, here);
        if (node.characters) copy.add(node.characters.trim().slice(0, 80), label);
      }

      if (typeof node.cornerRadius === 'number' && node.cornerRadius > 0) {
        radii.add(String(node.cornerRadius), here);
      } else if (node.rectangleCornerRadii?.some((r) => r > 0)) {
        radii.add(node.rectangleCornerRadii.join('/'), here);
      }
      if (node.layoutMode) {
        const p = [node.paddingTop, node.paddingRight, node.paddingBottom, node.paddingLeft].map(
          (v) => v ?? 0,
        );
        if (p.some((v) => v > 0)) padding.add(p.join(' '), here);
        if (node.itemSpacing)
          gaps.add(`${node.itemSpacing} (${node.layoutMode.toLowerCase()})`, here);
      }
      for (const effect of node.effects ?? []) {
        if (effect.visible === false || !effect.type?.includes('SHADOW')) continue;
        const { offset = { x: 0, y: 0 }, radius = 0, spread = 0, color } = effect;
        shadows.add(
          `${effect.type} ${offset.x},${offset.y} blur:${radius} spread:${spread} ${color ? toHex(color) : ''}`,
          here,
        );
      }

      if (ICON_TYPES.has(node.type) || looksLikeIcon(node)) {
        // Record the nearest icon-ish ancestor once, not every path inside it.
        const box = node.absoluteBoundingBox;
        if (!icons.has(node.id)) {
          icons.set(node.id, {
            name: node.name,
            type: node.type,
            size: box ? `${Math.round(box.width)}×${Math.round(box.height)}` : '?',
          });
        }
        if (ICON_TYPES.has(node.type)) return;
      }
      for (const child of node.children ?? []) walk(child, here, depth + 1);
    };

    walk(entry.document, '', 0);
  }

  return {
    frames,
    colours: colours.sorted(),
    strokes: strokes.sorted(),
    namedStyles: namedStyles.sorted(),
    variables: variables.sorted(),
    text: text.sorted(),
    radii: radii.sorted(),
    padding: padding.sorted(),
    gaps: gaps.sorted(),
    shadows: shadows.sorted(),
    icons: [...icons.entries()].map(([id, v]) => ({ id, ...v })),
    images: [...images.entries()].map(([id, v]) => ({ id, ...v })),
    copy: copy.sorted(),
  };
}

function printReport(r) {
  const section = (title, rows, fmt) => {
    out(`\n## ${title} (${rows.length})`);
    for (const row of rows) out(fmt(row));
  };
  const tally = (row) =>
    `${String(row.count).padStart(4)}  ${row.key}    ← ${row.samples[0] ?? ''}`;

  section('Frames', r.frames, (f) => `  ${f.id}  ${f.width}×${f.height}  ${f.name}`);
  section('Named styles', r.namedStyles, tally);
  section('Variables (bound)', r.variables, tally);
  section('Colours (fills)', r.colours, tally);
  section('Strokes', r.strokes, tally);
  section('Text styles', r.text, tally);
  section('Corner radii', r.radii, tally);
  section('Padding (t r b l)', r.padding, tally);
  section('Gaps', r.gaps, tally);
  section('Shadows', r.shadows, tally);
  section('Icons', r.icons, (i) => `  ${i.id}  ${i.size.padEnd(8)} ${i.type.padEnd(18)} ${i.name}`);
  section('Images', r.images, (i) => `  ${i.id}  ${i.name}`);
  section('Copy', r.copy, (c) => `${String(c.count).padStart(4)}  “${c.key}”`);
}

// ── commands ──────────────────────────────────────────────────────────────────

async function cmdList() {
  const file = await figma(`/files/${fileKey}?depth=2`);
  out(`# ${file.name}  (last modified ${file.lastModified})`);
  for (const page of file.document.children ?? []) {
    out(`\n## page ${page.id}  ${page.name}`);
    for (const frame of page.children ?? []) {
      const box = frame.absoluteBoundingBox;
      const size = box ? `${Math.round(box.width)}×${Math.round(box.height)}` : '';
      out(`  ${frame.id.padEnd(10)} ${frame.type.padEnd(10)} ${size.padEnd(10)} ${frame.name}`);
    }
  }
}

async function cmdExtract(ids, flags) {
  if (ids.length === 0) throw new Error('extract needs at least one node id');
  const res = await figma(`/files/${fileKey}/nodes?ids=${ids.map(normId).join(',')}`);
  const report = extract(res);
  if (flags.json) out(JSON.stringify(report, null, 2));
  else printReport(report);
}

async function cmdExport(ids, flags) {
  if (ids.length === 0) throw new Error('export needs at least one node id');
  const format = flags.svg ? 'svg' : 'png';
  const scale = flags.scale ?? (format === 'png' ? 2 : 1);
  const outDir = resolve(root, flags.out ?? 'figma-export');
  mkdirSync(outDir, { recursive: true });

  const res = await figma(
    `/images/${fileKey}?ids=${ids.map(normId).join(',')}&format=${format}&scale=${scale}`,
  );
  for (const [id, url] of Object.entries(res.images ?? {})) {
    if (!url) {
      console.error(`✗ ${id}: Figma returned no render`);
      continue;
    }
    const bytes = Buffer.from(await (await fetch(url)).arrayBuffer());
    const file = resolve(outDir, `${id.replace(':', '-')}.${format}`);
    writeFileSync(file, bytes);
    out(`✓ ${file} (${bytes.length} bytes)`);
  }
}

// ── main ──────────────────────────────────────────────────────────────────────

const [, , command, ...rest] = process.argv;
const flags = {};
const positional = [];
for (let i = 0; i < rest.length; i += 1) {
  const arg = rest[i];
  if (arg === '--json' || arg === '--png' || arg === '--svg') flags[arg.slice(2)] = true;
  else if (arg === '--out') flags.out = rest[++i];
  else if (arg === '--scale') flags.scale = Number(rest[++i]);
  else positional.push(arg);
}

const commands = { list: cmdList, extract: cmdExtract, export: cmdExport };
const run = commands[command];
if (!run) {
  console.error(
    'usage: figma-tokens.mjs <list | extract <ids...> [--json] | export <ids...> [--png|--svg] [--out dir] [--scale n]>',
  );
  process.exit(1);
}

run(positional, flags).catch((err) => {
  console.error(`✗ ${err.message}`);
  process.exit(1);
});
