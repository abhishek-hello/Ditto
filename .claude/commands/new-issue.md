---
description: Start work on a Linear issue following the standard Ditto Pay workflow
argument-hint: <linear issue URL or ID, e.g. DIT-3>
---

Start work on this Linear issue: **$ARGUMENTS**

Follow the standard Ditto Pay development workflow. Do not deviate from it unless I explicitly say so in this conversation. `AGENTS.md` hard rules apply throughout.

## Do now, without asking

1. **Fetch the issue** from Linear (`mcp__linear__get_issue`). Read the full description — it carries the verbatim client quote or Figma reference the task came from. If it links a Figma frame, pull it with the Figma MCP before planning.
2. **Move it to `In Progress`** immediately. This signals I've picked it up.
3. **Branch**, in exactly this order:
   ```
   git checkout main
   git pull
   git checkout -b <the issue's gitBranchName from Linear>
   ```
   - Use Linear's `gitBranchName` field **verbatim**. Never invent a branch name — that exact string is what auto-links the branch and PR back to the issue.
   - If `main` has uncommitted changes, or the pull isn't clean, or we're on an unpushed branch with work on it: **stop and tell me**. Do not stash, force, or work around it.
4. **Investigate the codebase** and write a detailed implementation plan. Read `PRODUCT.md`, `DESIGN.md`, and `docs/architecture.md` first if the issue touches anything you haven't already read this session.

## Then stop

Present the plan and wait. **Do not edit any file before I approve it.**

The plan must explicitly call out:
- **Any schema change / Drizzle migration required** — say so up front, never at the end. The schema in `packages/db/src/schema.ts` is the source of truth; a change there means `npm run db:generate -w @ditto/db`, committed SQL under `packages/db/drizzle/`, and regenerated Supabase types. Triggers or functions mean a `--custom` migration. API routes and RLS-backed client reads both break on an unapplied migration.
- **Which deployables it touches** (`apps/api`, `apps/web`, `apps/mobile`, `packages/*`) and whether a shared package change ripples into more than one app.
- **Any new env var** — it must go in `env.example` with no value, prefixed `NEXT_PUBLIC_` / `EXPO_PUBLIC_` if public.
- **Any new dependency** — name it and justify it. Default is no.
- Any decision you need from me before the work is buildable.
- Anything in the issue that turns out to be wrong, ambiguous, or bigger than it reads.

## After I approve the plan

Implement the change, run `npm run check`, then **stop again**. When you hand it back, tell me:
- The `npm run check` result. If anything fails, paste the output — do not summarise it away.
- Exactly what to click, run, or tap to verify it. For mobile, which screen to open in the Expo dev client. For web, which URL on `localhost:3000`. For API, the exact `curl` or supertest to run.
- What you could **not** verify yourself.

I verify manually. Do not commit on your own judgment that it works, no matter how confident you are.

## After I approve the implementation

- Commit — conventional commit with the app or package as scope: `feat(api): …`, `fix(mobile): …`, `fix(web): …`, `feat(db): …`, `chore: …`. Plain-language description of what changed.
- Push the branch
- Open a PR with the issue ID in the body
- Send me the PR link
- Move the issue to `In Review`

`Done` is my call on merge.

## Standing rules

- **One issue = one branch = one PR.** If you spot an unrelated bug mid-task, file a new Linear issue in team `Ditto-Team` / project `Ditto-Monorepo` — do not widen the branch.
- Statuses are `Backlog → Todo → In Progress → In Review → Done`.
- **Money is integer pence** (`Pence` from `@ditto/core`). GBP only, UK only. Format only at the UI edge with `formatPence`. Any plan that puts a float or a `number` of pounds anywhere is wrong.
- **Database writes happen only in `apps/api` through Drizzle.** Never import `createDb()` from web or mobile. Clients read via supabase-js and RLS.
- **All API input is zod-validated** with schemas from `@ditto/core/schemas`; responses use the `ApiResponse<T>` envelope.
- If you change a dependency, run `npm run lock:regen`. Never hand-edit `package-lock.json`.
- For changes touching `apps/web`, you may offer to push to a **draft PR** first so I can verify on the Vercel preview URL rather than local dev. Only do this if I agree — it reorders the verify and push steps. Mobile changes have no preview URL; they are verified in the Expo dev client only.
- The client judges Ditto Pay by opening the app on a phone and sending a payment end to end, not by reading a changelog. Amounts, names, and states on screen must be exactly right. Keep that in mind for anything customer-facing.
