# AGENTS.md — working in the Ditto Pay monorepo

Canonical instructions for AI coding agents (Claude Code, Cursor, Copilot, Codex). `CLAUDE.md`, `.cursor/rules/`, and `.github/copilot-instructions.md` all defer to this file. Edit **this** file only.

## What this is

Ditto Pay: a UK-only mobile payments platform. Three deployables share code from `packages/`:

| Path | What | Stack | Dev URL |
| --- | --- | --- | --- |
| `apps/mobile` | Customer app | Expo SDK 57, expo-router, React Native 0.86 | Expo dev server (8081) |
| `apps/web` | Marketing site + account dashboard | Next.js 16 App Router, Tailwind 4 | http://localhost:3000 |
| `apps/api` | Backend | Node 24, Express 5, Drizzle ORM over Supabase Postgres, zod | http://localhost:4000 |
| `packages/core` | Domain types, zod schemas, money + UK validators | TS source, no build | — |
| `packages/db` | Drizzle schema (source of truth), migrations, `createDb()` | TS source, no build | — |
| `packages/supabase` | supabase-js client factories + generated types (auth, RLS reads) | TS source, no build | — |
| `packages/api-client` | Typed fetch client for `apps/api` | TS source, no build | — |
| `packages/typescript-config` | tsconfig presets | JSON | — |

Read `PRODUCT.md` (what we're building), `DESIGN.md` (technical rules), `ENVIRONMENTS.md` (env vars and stages), `docs/architecture.md` (how requests flow).

## Commands (run from repo root)

```sh
npm install                # npm workspaces; single lockfile at root
npm run dev                # all apps via turbo (or dev:web / dev:api / dev:mobile)
npm run check              # lint + typecheck + knip + test — MUST pass before a PR
npm run lint:fix           # biome autofix
npm run check:env          # verify .env against env.example
npm run typecheck -- --filter=@ditto/api   # scope any turbo task with --filter
```

## Hard rules

1. **Money is integer pence.** Type `Pence` from `@ditto/core`. Never `number` pounds, never floats, never `toFixed` for arithmetic. Format only at the UI edge with `formatPence`.
2. **GBP only, UK only.** Do not add currency switches, i18n locales, or non-UK bank formats.
3. **Database writes happen only in `apps/api`, through Drizzle.** `createDb()` from `@ditto/db` connects as `postgres` and bypasses RLS; never import it from web or mobile. Clients use supabase-js with the anon key and rely on RLS for reads.
4. **All API input is zod-validated** with schemas from `@ditto/core/schemas`, via `validateBody`. Responses use the `ApiResponse<T>` envelope. No ad-hoc shapes.
5. **Shared packages ship TS source.** No build step. Add new packages to `transpilePackages` in `apps/web/next.config.ts`.
6. **One root `.env`.** Every app loads it (see `ENVIRONMENTS.md`). Every new var goes in `env.example` with no value. Public vars must be prefixed `NEXT_PUBLIC_` / `EXPO_PUBLIC_`.
7. **Schema lives in `packages/db/src/schema.ts`.** Edit it, run `npm run db:generate -w @ditto/db`, commit the SQL under `packages/db/drizzle/`. Never hand-edit generated SQL or `database.types.ts`; triggers/functions go in a `--custom` migration.
8. **Biome is the only linter/formatter.** Do not add ESLint or Prettier.
9. **No new dependencies without a reason in the PR.** Prefer what is already in the tree. Third-party fixes go through `patches/`.
10. **Don't touch `package-lock.json` by hand.** After any dependency change run `npm run lock:regen` (clean reinstall + `npm ci` verification). A plain `npm install` on top of an existing `node_modules` can prune optional platform packages from the lockfile, and CI's `npm ci` then fails with `Missing: @emnapi/... from lock file`.

## Conventions

- Files: `kebab-case.ts`; React components `PascalCase.tsx` inside `src/components/`; route files follow the framework (expo-router `app/`, Next `src/app/`).
- Imports: workspace packages by name (`@ditto/core`), app-local via `@/` alias. Never relative paths across workspaces.
- Tests: colocated `*.test.ts`, Vitest. Test money math and validators exhaustively; test routes with supertest.
- Logging: `pino` in the API. No `console.log` (Biome warns; `console.warn/error` allowed).
- Errors in the API: throw `HttpError(status, code, message)`; the error middleware renders the envelope.
- Commits: conventional commits (`feat(api): …`, `fix(mobile): …`, `chore: …`).

## Mobile skills (Callstack agent-skills)

Two skills from [callstackincubator/agent-skills](https://github.com/callstackincubator/agent-skills) are installed in `.claude/skills/` (pinned in `skills-lock.json`) for work in `apps/mobile`:

- `react-native-best-practices` — FPS, TTI, re-renders, lists, memory, bundle size, animations. Read it before touching screens, lists, or animations.
- `react-navigation` — stacks, tabs, headers, sheets, safe areas. expo-router is built on React Navigation 7, so its patterns apply to files under `apps/mobile/app/`.

Claude Code loads them automatically. Other assistants: read `.claude/skills/<name>/SKILL.md` directly. Update with `npx skills@latest update -p -y`; never hand-edit the skill files.

## Figma → screen workflow

Mobile screens are styled one at a time from their Figma frame with the `/figma-screen <route> [node]` command (`.claude/commands/figma-screen.md`). It plans, stops for approval, builds, stops for device verification, then commits. Design data comes from `scripts/figma-tokens.mjs` (Figma REST API, needs `FIGMA_TOKEN`) and the gitignored `design-inbox/` folder (Figma to Code plugin exports), not the Figma MCP server. Node IDs live in `docs/figma-screens.md`; the rules (theme tokens only, every state reachable, light + dark) are in `docs/guides/figma-to-screen.md`. Other assistants: follow that guide by hand.

## When you're done

Run `npm run check`. If Knip reports an unused export you just added, either use it or delete it; do not add it to an ignore list.
