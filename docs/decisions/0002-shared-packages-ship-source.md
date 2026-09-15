# 0002 — Shared packages ship TypeScript source

**Status:** accepted · 2026-09-15

## Decision

`packages/*` set `main`/`exports` to `./src/index.ts`. No `dist`, no build task.

## Why

Every consumer already transpiles TypeScript: Next.js (`transpilePackages`), Metro (natively), `tsx` in the API. A build step would only add cache invalidation and stale-`dist` bugs.

## Consequences

- New packages must be added to `transpilePackages` in `apps/web/next.config.ts`.
- If a package is ever published or consumed by plain Node, add a build then.
