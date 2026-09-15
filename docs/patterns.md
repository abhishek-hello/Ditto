# Patterns

## Add an API route

1. Define the input schema in `packages/core/src/schemas.ts` and export its types.
2. Create `apps/api/src/routes/<thing>.ts` exporting `function <thing>Router(db)` that returns an Express `Router`.
3. Validate with `validateBody(schema)`. Throw `HttpError(status, 'snake_code', 'message')` for failures. Respond with `ok(res, data)`.
4. Mount it in `apps/api/src/app.ts` under `v1`.
5. Add a method to `packages/api-client/src/index.ts` so web and mobile get a typed call.
6. Test with supertest in `apps/api/src/<thing>.test.ts`.

## Add a mobile screen

- Route file in `apps/mobile/app/` (expo-router). Keep it thin: layout + hooks.
- Logic and components in `apps/mobile/src/`. Import with `@/`.
- Data via `api` from `@/lib/api`; auth via `supabase` from `@/lib/supabase`.

## Add a web page

- `apps/web/src/app/<segment>/page.tsx`. Server Component unless it needs state.
- Client data via `getApi()` from `@/lib/api` inside a `'use client'` component.

## Add a shared package

```sh
mkdir -p packages/<name>/src
```
- `package.json`: `"name": "@ditto/<name>"`, `"private": true`, `"main": "./src/index.ts"`, `exports`, scripts `typecheck` + `clean`, devDep `@ditto/typescript-config`.
- `tsconfig.json` extends `@ditto/typescript-config/library.json`.
- Add to `transpilePackages` in `apps/web/next.config.ts` and to `knip.json` if it needs custom entries.
- `npm install` at root to link it.

## Add a migration

```sh
cd packages/supabase
npx supabase migration new <snake_name>
# edit supabase/migrations/<timestamp>_<snake_name>.sql
npx supabase db reset
npm run types:generate -w @ditto/supabase
```
Commit the SQL and the regenerated `database.types.ts` together. Money columns are `bigint … _pence`.

## Add an env var

Add to `env.example` (no value), to the table in `ENVIRONMENTS.md`, and to the zod schema in `apps/api/src/env.ts` or the `publicEnv` object in the app's `src/lib/env.ts`. Run `npm run check:env`.

## Patch a dependency

Edit under `node_modules/<pkg>`, run `npx patch-package <pkg>`, add a row to `patches/README.md` with the upstream link.
