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
 * The REST quota is small, so pull the design once and work from the local copy:
 *
 *   node scripts/figma-tokens.mjs snapshot            # node data + renders for every inventory node → design-snapshot/
 *   node scripts/figma-tokens.mjs snapshot --assets   # also every icon (SVG) and image fill
 *   node scripts/figma-tokens.mjs snapshot 1:165000   # refresh just these nodes
 *   node scripts/figma-tokens.mjs screens             # route → Figma frames per state, and the next screen to do
 *
 * extract and export --svg read design-snapshot/ first and only call the API for
 * nodes it does not have.
 *
 * Needs FIGMA_TOKEN in the root .env (Figma → Settings → Security → Personal
 * access tokens, scope "File content: read"). Optional FIGMA_FILE_KEY overrides
 * the default file.
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
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

// ── http ──────────────────────────────────────────────────────────────────────

/** "4d 13h", "2h 5m" or "7m" from a Retry-After in seconds. */
function humanWait(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.ceil((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

async function figma(path) {
  if (!token) {
    throw new Error('FIGMA_TOKEN is not set. Add it to the root .env (see ENVIRONMENTS.md).');
  }
  const res = await fetch(`${API}${path}`, { headers: { 'X-Figma-Token': token } });
  if (res.status === 429) {
    const retry = Number(res.headers.get('retry-after'));
    const until = new Date(Date.now() + retry * 1000).toLocaleString('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    throw new Error(
      `Figma REST rate limit hit${retry ? ` — retry after ${humanWait(retry)} (${until})` : ''}.`,
    );
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
  const wanted = ids.map(normId);
  const snapshot = readSnapshot();
  const nodes = localNodes(snapshot, wanted);
  const remote = wanted.filter((id) => !(id in nodes));
  if (remote.length > 0) {
    Object.assign(nodes, (await figma(`/files/${fileKey}/nodes?ids=${remote.join(',')}`)).nodes);
  } else {
    console.error(`(from design-snapshot/, fetched ${snapshot.fetchedAt.slice(0, 10)})`);
  }
  const report = extract({ nodes });
  if (flags.json) out(JSON.stringify(report, null, 2));
  else printReport(report);
}

async function cmdExport(ids, flags) {
  if (ids.length === 0) throw new Error('export needs at least one node id');
  const format = flags.svg ? 'svg' : 'png';
  const scale = flags.scale ?? (format === 'png' ? 2 : 1);
  const outDir = resolve(root, flags.out ?? 'figma-export');
  mkdirSync(outDir, { recursive: true });

  let wanted = ids.map(normId);
  if (format === 'svg') {
    // Icons already in the snapshot are copied byte for byte, without a request.
    const local = (id) => snap('icons', `${slug(id)}.svg`);
    for (const id of wanted.filter((id) => existsSync(local(id)))) {
      const file = resolve(outDir, `${slug(id)}.svg`);
      copyFileSync(local(id), file);
      out(`✓ ${file} (from design-snapshot/)`);
    }
    wanted = wanted.filter((id) => !existsSync(local(id)));
    if (wanted.length === 0) return;
  }

  const res = await figma(
    `/images/${fileKey}?ids=${wanted.join(',')}&format=${format}&scale=${scale}`,
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

// ── snapshot: a local copy of the design ──────────────────────────────────────

const SNAPSHOT_DIR = resolve(root, 'design-snapshot');
const snap = (...parts) => resolve(SNAPSHOT_DIR, ...parts);
const slug = (id) => id.replace(':', '-');
/** Sections rendered per request. Smaller batches are less likely to time out. */
const RENDER_BATCH = 20;
const ICON_BATCH = 100;
const IMAGE_MAGIC = [
  ['89504e47', 'png'],
  ['ffd8ff', 'jpg'],
  ['47494638', 'gif'],
  ['52494646', 'webp'],
];

function readSnapshot() {
  const file = snap('nodes.json');
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
}

/** Nodes at any depth in the snapshot, shaped like entries of a /nodes response. */
function localNodes(snapshot, ids) {
  const found = {};
  const wanted = new Set(ids);
  for (const entry of Object.values(snapshot?.nodes ?? {})) {
    const stack = entry?.document ? [entry.document] : [];
    while (stack.length > 0 && wanted.size > 0) {
      const node = stack.pop();
      if (wanted.delete(node.id)) found[node.id] = { document: node, styles: entry.styles };
      for (const child of node.children ?? []) stack.push(child);
    }
  }
  return found;
}

/** Route files with the Figma nodes and the title they point at. */
function routeFiles() {
  const appDir = resolve(root, 'apps/mobile/app');
  const routes = [];
  for (const rel of readdirSync(appDir, { recursive: true })) {
    if (!rel.endsWith('.tsx') || rel.split('/').at(-1).startsWith('_')) continue;
    const source = readFileSync(resolve(appDir, rel), 'utf8');
    const ids = source.match(/figma="([^"]+)"/)?.[1] ?? source.match(/Figma (\d+:\d+)/)?.[1] ?? '';
    routes.push({
      route: `/${rel.replace(/\.tsx$/, '').replace(/(^|\/)index$/, '')}`,
      file: `apps/mobile/app/${rel}`,
      title: source.match(/title="([^"]+)"/)?.[1] ?? null,
      figma: ids
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean),
      done: !source.includes('PlaceholderScreen'),
    });
  }
  return routes;
}

/** Every node the inventory and the route files point at, in inventory order. */
function inventoryIds() {
  const ids = new Set();
  const docs = readFileSync(resolve(root, 'docs/figma-screens.md'), 'utf8');
  for (const match of docs.matchAll(/`(\d+:\d+)`/g)) ids.add(match[1]);
  for (const route of routeFiles()) for (const id of route.figma) ids.add(id);
  return [...ids];
}

async function download(urls, pathFor) {
  for (const [id, url] of Object.entries(urls)) {
    if (!url) {
      console.error(`✗ ${id}: Figma returned nothing`);
      continue;
    }
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`✗ ${id}: download failed (${res.status})`);
      continue;
    }
    const bytes = Buffer.from(await res.arrayBuffer());
    writeFileSync(pathFor(id, bytes), bytes);
  }
}

/** Renders the ids that are not on disk yet, `batch` per request. */
async function renderMissing(ids, { dir, format, scale, batch, force }) {
  const pathFor = (id) => snap(dir, `${slug(id)}.${format}`);
  const missing = ids.filter((id) => force || !existsSync(pathFor(id)));
  for (let i = 0; i < missing.length; i += batch) {
    const chunk = missing.slice(i, i + batch);
    out(`→ ${dir} ${i + 1}–${i + chunk.length} of ${missing.length} (1 request)`);
    const res = await figma(
      `/images/${fileKey}?ids=${chunk.join(',')}&format=${format}&scale=${scale}`,
    );
    if (res.err) throw new Error(`Figma could not render: ${res.err}`);
    await download(res.images ?? {}, pathFor);
  }
}

async function fetchFills(refs, force) {
  const have = new Set(readdirSync(snap('fills')).map((name) => name.replace(/\.\w+$/, '')));
  const missing = refs.filter((ref) => force || !have.has(ref));
  if (missing.length === 0) return;
  out(`→ image fills ${missing.length} (1 request)`);
  const res = await figma(`/files/${fileKey}/images`);
  const urls = Object.fromEntries(missing.map((ref) => [ref, res.meta?.images?.[ref]]));
  await download(urls, (ref, bytes) => {
    const hex = bytes.toString('hex', 0, 4);
    const ext = IMAGE_MAGIC.find(([magic]) => hex.startsWith(magic))?.[1] ?? 'bin';
    return snap('fills', `${ref}.${ext}`);
  });
}

const norm = (text) =>
  text.toLowerCase().replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();

function textNodes(node, found = []) {
  if (node.type === 'TEXT' && node.characters?.trim()) found.push(node);
  for (const child of node.children ?? []) textNodes(child, found);
  return found;
}

/** Phone-sized rounded frames in a section, each with the annotation text beside it. */
function phonesIn(section) {
  const phones = [];
  const visit = (node, parent) => {
    const { width = 0, height = 0, x = 0, y = 0 } = node.absoluteBoundingBox ?? {};
    const radius = node.cornerRadius ?? Math.max(0, ...(node.rectangleCornerRadii ?? []));
    const isPhone = width >= 360 && width <= 440 && height >= 600 && height <= 1000 && radius >= 16;
    if (!isPhone) {
      for (const child of node.children ?? []) visit(child, node);
      return;
    }
    const inside = textNodes(node);
    const own = new Set(inside.map((t) => t.id));
    const bySize = [...inside].sort((a, b) => (b.style?.fontSize ?? 0) - (a.style?.fontSize ?? 0));
    phones.push({
      id: node.id,
      row: Math.round(y / 200),
      x,
      label: textNodes(parent ?? node)
        .filter((t) => !own.has(t.id))
        .map((t) => t.characters.trim())
        .join(' — '),
      headline: bySize[0]?.characters.trim() ?? '',
      texts: inside.map((t) => norm(t.characters)),
    });
  };
  visit(section, null);
  return phones.sort((a, b) => a.row - b.row || a.x - b.x);
}

/** Route → Figma frames (one per state), matched by the route's title. */
function screenMap(snapshot) {
  const order = inventoryIds();
  const cache = new Map();
  const phonesOf = (id) => {
    if (!cache.has(id)) {
      const doc = snapshot.nodes[id]?.document;
      cache.set(id, doc ? phonesIn(doc) : []);
    }
    return cache.get(id);
  };
  const rank = (route) => {
    const at = order.indexOf(route.figma[0]);
    return at === -1 ? order.length : at;
  };
  const brief = ({ id, section, label, headline }) => ({ id, section, label, headline });

  return routeFiles()
    .filter((route) => route.figma.length > 0)
    .sort((a, b) => rank(a) - rank(b) || a.route.localeCompare(b.route))
    .map((route) => {
      const candidates = route.figma.flatMap((section) =>
        phonesOf(section).map((phone) => ({ ...phone, section })),
      );
      const want = route.title ? norm(route.title) : null;
      const exact = want ? candidates.filter((p) => p.texts.includes(want)) : [];
      const loose = want ? candidates.filter((p) => p.texts.some((t) => t.includes(want))) : [];
      const frames = (exact.length > 0 ? exact : loose).map(brief);
      return {
        route: route.route,
        file: route.file,
        title: route.title,
        status: route.done ? 'done' : 'todo',
        sections: route.figma,
        renders: route.figma.map((id) => `design-snapshot/renders/${slug(id)}.png`),
        frames,
        // Nothing matched the title: every screen in its sections, to pick by hand.
        candidates: frames.length === 0 ? candidates.map(brief) : undefined,
      };
    });
}

function writeScreens(snapshot) {
  const map = screenMap(snapshot);
  writeFileSync(snap('screens.json'), JSON.stringify(map, null, 2));
  out('\n## Screens → design-snapshot/screens.json');
  for (const s of map) {
    const frames =
      s.frames.length > 0
        ? s.frames.map((f) => `${f.id} ${f.label || '(no label)'}`).join(' | ')
        : `not matched in ${s.sections.join(', ')}`;
    out(`  ${s.status}  ${s.route.padEnd(46)} ${frames}`);
  }
  const todo = map.filter((s) => s.status === 'todo');
  const unmatched = map.filter((s) => s.frames.length === 0).length;
  out(
    `\n${map.length} routes: ${map.length - todo.length} done, ${todo.length} to do, ${unmatched} not matched to a frame (see "candidates").`,
  );
  if (todo[0]) out(`Next: ${todo[0].route}`);
}

async function cmdSnapshot(ids, flags) {
  for (const dir of ['renders', 'icons', 'fills']) mkdirSync(snap(dir), { recursive: true });
  const refresh = ids.length > 0;
  const force = Boolean(flags.force) || refresh;
  const requested = refresh ? ids.map(normId) : inventoryIds();
  let snapshot = readSnapshot();

  const missing = requested.filter((id) => force || !snapshot || !(id in snapshot.nodes));
  if (missing.length > 0) {
    out(`→ node data for ${missing.length} node(s) (1 request)`);
    const res = await figma(`/files/${fileKey}/nodes?ids=${missing.join(',')}`);
    snapshot = {
      name: res.name,
      lastModified: res.lastModified,
      fetchedAt: new Date().toISOString(),
      nodes: { ...snapshot?.nodes, ...res.nodes },
    };
    writeFileSync(snap('nodes.json'), JSON.stringify(snapshot));
  }
  const sections = requested.filter((id) => snapshot.nodes[id]?.document);
  for (const id of requested) {
    if (!snapshot.nodes[id]?.document) console.error(`✗ ${id} is not in the Figma file`);
  }

  const scale = flags.scale ?? 1;
  await renderMissing(sections, {
    dir: 'renders',
    format: 'png',
    scale,
    batch: RENDER_BATCH,
    force,
  });
  if (flags.assets) {
    const entries = Object.fromEntries(sections.map((id) => [id, snapshot.nodes[id]]));
    const report = extract({ nodes: entries });
    const icons = report.icons.map((icon) => icon.id);
    await renderMissing(icons, { dir: 'icons', format: 'svg', scale: 1, batch: ICON_BATCH, force });
    await fetchFills([...new Set(report.images.map((image) => image.ref))], force);
  }

  writeScreens(snapshot);
  out(`\n✓ design-snapshot/ ready: ${snapshot.name}, Figma last modified ${snapshot.lastModified}`);
}

async function cmdScreens() {
  const snapshot = readSnapshot();
  if (!snapshot) throw new Error('No design-snapshot/ yet. Run: npm run figma -- snapshot');
  writeScreens(snapshot);
}

// ── main ──────────────────────────────────────────────────────────────────────

const [, , command, ...rest] = process.argv;
const flags = {};
const positional = [];
for (let i = 0; i < rest.length; i += 1) {
  const arg = rest[i];
  if (['--json', '--png', '--svg', '--force', '--assets'].includes(arg)) flags[arg.slice(2)] = true;
  else if (arg === '--out') flags.out = rest[++i];
  else if (arg === '--scale') flags.scale = Number(rest[++i]);
  else positional.push(arg);
}

const commands = {
  snapshot: cmdSnapshot,
  screens: cmdScreens,
  list: cmdList,
  extract: cmdExtract,
  export: cmdExport,
};
const run = commands[command];
if (!run) {
  console.error(
    'usage: figma-tokens.mjs <snapshot [ids...] [--assets] [--force] | screens | list | extract <ids...> [--json] | export <ids...> [--png|--svg] [--out dir] [--scale n]>',
  );
  process.exit(1);
}

run(positional, flags).catch((err) => {
  console.error(`✗ ${err.message}`);
  if (command === 'snapshot') {
    console.error(
      '  Everything already in design-snapshot/ is kept; run the same command again to continue.',
    );
  }
  process.exit(1);
});
