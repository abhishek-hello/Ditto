# AGENTS.md — working in the Ditto Pay monorepo

Canonical instructions for AI coding agents (Claude Code, Cursor, Copilot, Codex). `CLAUDE.md`, `.cursor/rules/`, and `.github/copilot-instructions.md` all defer to this file. Edit **this** file only.

## What this is

Ditto Pay: a UK-only mobile payments platform. Three deployables share code from `packages/`:

| Path | What | Stack | Dev URL |
| --- | --- | --- | --- |
| `apps/mobile` | Customer app | Expo SDK 57, expo-router, React Native 0.86 | Expo dev server (8081) |
| `apps/web` | Marketing site + account dashboard | Next.js 16 App Router, Tailwind 4 | http://localhost:3000 |
| `apps/api` | Backend | Node 24, Express 5, Supabase (service role), zod | http://localhost:4000 |
| `packages/core` | Domain types, zod schemas, money + UK validators | TS source, no build | — |
| `packages/supabase` | Client factories, generated DB types, migrations | TS source, no build | — |
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
3. **Service-role Supabase key is `apps/api` only.** Never import `createServiceClient` from web or mobile. Clients use the anon key and rely on RLS.
4. **All API input is zod-validated** with schemas from `@ditto/core/schemas`, via `validateBody`. Responses use the `ApiResponse<T>` envelope. No ad-hoc shapes.
5. **Shared packages ship TS source.** No build step. Add new packages to `transpilePackages` in `apps/web/next.config.ts`.
6. **One root `.env`.** Every app loads it (see `ENVIRONMENTS.md`). Every new var goes in `env.example` with no value. Public vars must be prefixed `NEXT_PUBLIC_` / `EXPO_PUBLIC_`.
7. **Schema changes are migrations** in `packages/supabase/supabase/migrations/`, then regenerate `database.types.ts`. Never edit the generated types by hand.
8. **Biome is the only linter/formatter.** Do not add ESLint or Prettier.
9. **No new dependencies without a reason in the PR.** Prefer what is already in the tree. Third-party fixes go through `patches/`.
10. **Don't touch `package-lock.json` by hand.** Change `package.json`, run `npm install`.

## Conventions

- Files: `kebab-case.ts`; React components `PascalCase.tsx` inside `src/components/`; route files follow the framework (expo-router `app/`, Next `src/app/`).
- Imports: workspace packages by name (`@ditto/core`), app-local via `@/` alias. Never relative paths across workspaces.
- Tests: colocated `*.test.ts`, Vitest. Test money math and validators exhaustively; test routes with supertest.
- Logging: `pino` in the API. No `console.log` (Biome warns; `console.warn/error` allowed).
- Errors in the API: throw `HttpError(status, code, message)`; the error middleware renders the envelope.
- Commits: conventional commits (`feat(api): …`, `fix(mobile): …`, `chore: …`).

## When you're done

Run `npm run check`. If Knip reports an unused export you just added, either use it or delete it; do not add it to an ignore list.
