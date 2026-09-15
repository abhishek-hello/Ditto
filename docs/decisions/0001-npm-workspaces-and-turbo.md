# 0001 — npm workspaces + Turborepo

**Status:** accepted · 2026-09-15

## Decision

Use npm workspaces with a single root `package-lock.json`, and Turborepo for the task graph.

## Why

- npm is already on every machine and in CI; one fewer tool to install. Hoisting gives React Native the single `react` copy it needs.
- Turborepo gives cached, filtered `typecheck`/`test`/`build` across workspaces without a custom script layer.

## Alternatives

- **pnpm**: stricter, faster, but its isolated `node_modules` needs `node-linker=hoisted` for Metro anyway, which removes most of the benefit.
- **Nx**: heavier than we need for three apps.

## Consequences

- Shared packages export TS source; consumers transpile. No package `build` step.
- `packageManager` is pinned in root `package.json`; CI uses `npm ci`.
