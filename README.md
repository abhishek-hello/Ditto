# Ditto Pay

UK mobile payments platform. One repo, three deployables, shared packages.

```
ditto-monorepo/
├── apps/
│   ├── mobile/     Expo SDK 57 + expo-router      → App Store / Play Store (EAS)
│   ├── web/        Next.js 16 App Router           → Vercel
│   └── api/        Node 24 + Express 5 + Supabase  → container / Node host
├── packages/
│   ├── core/              domain types, zod schemas, money (pence), UK validators
│   ├── supabase/          client factories, generated DB types, SQL migrations
│   ├── api-client/        typed fetch client for apps/api (used by web + mobile)
│   └── typescript-config/ tsconfig presets
├── docs/           architecture, patterns, guides
├── scripts/        repo tooling (env check, bootstrap)
├── patches/        patch-package diffs for third-party deps
├── .github/        CI workflows, PR template
├── .claude/ .cursor/   agent configs (all defer to AGENTS.md)
├── package.json    npm workspaces + root scripts only
├── turbo.json      task graph
├── biome.json      lint + format
├── knip.json       dead-code detection
├── env.example     every env var, no values
└── package-lock.json
```

## Quick start

Requires Node 24 (`.nvmrc`) and npm 10+.

```sh
cp env.example .env       # then fill in Supabase values — see ENVIRONMENTS.md
npm install
npm run dev:api           # http://localhost:4000/health
npm run dev:web           # http://localhost:3000
npm run dev:mobile        # Expo dev server; press i / a / w
```

Or `./scripts/bootstrap.sh` does the first two steps and a typecheck.

### Local Supabase (optional, needs Docker)

```sh
cd packages/supabase
npx supabase start        # prints API URL + keys; paste into root .env
npm run types:generate -w @ditto/supabase
```

## Everyday commands

| Command | What |
| --- | --- |
| `npm run dev` | All apps in parallel through Turborepo |
| `npm run check` | Lint + typecheck + dead-code + tests. Required before a PR. |
| `npm run lint:fix` | Biome autofix (format + safe lint fixes) |
| `npm run build` | Build every app (Next, API `dist/`); mobile builds go through EAS |
| `npm run check:env` | Verify `.env` has every key from `env.example` and nothing else |
| `npm run knip` | Unused files / exports / dependencies |
| `npm run <task> -- --filter=@ditto/api` | Scope any Turbo task to one workspace |

## Read next

- [PRODUCT.md](./PRODUCT.md) — what Ditto Pay is and isn't
- [DESIGN.md](./DESIGN.md) — technical rules (money, auth, API shape, packages)
- [ENVIRONMENTS.md](./ENVIRONMENTS.md) — env vars, local / preview / production
- [AGENTS.md](./AGENTS.md) — instructions for AI coding agents (and a good human onboarding page)
- [docs/architecture.md](./docs/architecture.md) — request flow, ledger, auth
- [docs/patterns.md](./docs/patterns.md) — how to add a route, screen, package, migration
