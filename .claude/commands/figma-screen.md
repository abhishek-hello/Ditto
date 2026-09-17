---
description: Implement mobile screens from the local Figma snapshot — one route or a batch — plan, build, hand over for verification
argument-hint: <route(s) or inventory section, e.g. (auth)/sign-in or "§3 steps 2–7"> [--from design-inbox/<folder>]
---

Implement these Figma screens in `apps/mobile`: **$ARGUMENTS**

The argument is one route, several routes, or an inventory section. A batch gets one plan, one build and one hand-over, with a commit per screen.

This is the style-integration pass: replace the `PlaceholderScreen` on a route with the real screen, faithful to Figma, wired to navigation, with every visual state the frame shows. Follow this workflow exactly; do not deviate unless I say so in this conversation. `AGENTS.md` hard rules and `docs/guides/figma-to-screen.md` apply throughout.

## Where design data comes from

The Figma MCP server is **not used**, and the REST quota is only a handful of requests a month. The whole design is pulled **once** into `design-snapshot/` (gitignored) and screens are built from that copy.

1. **Local snapshot (default).** `npm run figma -- snapshot` once (`--assets` adds icons and image fills; `snapshot <ids>` refreshes nodes that changed). After that, with no API calls:
   ```
   npm run figma -- screens                        # route → frames per state, and the next screen to do
   npm run figma -- extract <frame ids>            # exact colours, text, spacing, radii, copy
   npm run figma -- export <icon ids> --svg --out apps/mobile/assets/icons   # exact bytes from the snapshot
   ```
   Section renders are in `design-snapshot/renders/<section>.png`. Open one only when the extracted values leave the layout unclear: images are the most expensive thing to read.
2. **REST API.** The same commands call it only for nodes the snapshot lacks. Every request spends the monthly quota: batch ids into one call and never retry in a loop.
3. **Inbox folder** — `design-inbox/<screen>/`, filled by me from the "Figma to Code" community plugin (Tailwind/HTML output as `*.html`) and PNG exports of each state. Read every file in the folder. The plugin code is a **layout reference**, never something to paste.

Resolve frames with `npm run figma -- screens`. If a route is not matched, pick its frames from `candidates` in `design-snapshot/screens.json` and say which you picked. The inbox folder defaults to `design-inbox/<route slug>` (`(auth)/sign-in` → `design-inbox/auth-sign-in`) unless `--from` says otherwise.

Precedence when sources disagree: `extract` values > plugin code > PNG. If the snapshot lacks the frames, the API fails (no token, 4xx, rate limit) **and** the inbox is empty, stop and tell me exactly which of the two to provide. Never hand-write a screen from the inventory notes or from memory.

## Phase 1 — Plan (no file edits)

1. **Gather.** Run `extract` on the frame ids from `screens`, one call for the whole batch. Open the section render only if the layout is unclear. Read the inbox folder. If a frame holds several screens (many onboarding frames do), say which screen inside it we are doing and which we are not.
2. **Read what exists:** `apps/mobile/src/theme/`, `apps/mobile/src/components/`, the current route file and its `actions` hrefs, the group `_layout.tsx`, `docs/design-language.md`, and the `react-navigation` skill for headers, sheets, and safe areas.
3. **Write the plan.** Keep it short: plain reuse of existing tokens and components gets one line, not a table. It must cover, in this order:
   - **States in the frame** — every variant the design shows (empty / filled / error / loading / locked / dark / light / 375 and 430 widths) and how each will be reachable in the app (real validation, a prop, route param, or a `__DEV__`-only toggle). Nothing gets silently dropped.
   - **Theme changes** — tokens to add to `src/theme/`. A colour or size that is within a shade of an existing token maps to that token; say so. Nothing new without a Figma origin from `extract`. No hex, font size, or spacing literal goes in a screen file.
   - **Components reused** from `src/components/`, and **components proposed** as shared. A piece becomes shared when a second screen needs it or it is clearly a design-system primitive (Button, TextField, OtpInput, BottomSheet, ListRow, StageHeader). Name each with its props.
   - **Assets** — every icon and image with its node ID from the `Icons` section of `extract`, the path it will be committed to under `apps/mobile/assets/`, and the format. Never hand-draw an icon.
   - **Navigation** — which tappable element goes to which route. Keep every href the placeholder already had unless the design says otherwise. Note header / modal / sheet presentation the group layout needs.
   - **Deployables touched** — should be `apps/mobile` only. Anything in `packages/*` or a new API call is out of scope for a style pass; flag it and stub with static props.
   - **New dependency** — name and justify, default is none. Fonts via `expo-font` and SVG via `react-native-svg` count.
   - **Open decisions** and anything in the frame that contradicts `docs/figma-screens.md` or `PRODUCT.md`.

Then **stop and wait for my approval**. Do not edit any file before that. Exception: if the plan adds no tokens, no components and no open decisions, say so in one line and go straight to Phase 2.

## Phase 2 — Implement (after approval)

- Route file stays at its path and stays thin. Screen composition lives in the route file; reusable pieces go in `src/components/`; theme in `src/theme/`. Import via `@/`.
- `StyleSheet.create` with theme tokens via the theme hook. Support light and dark from day one (`userInterfaceStyle` is `automatic`). No fixed widths; the frame ships at 375 and 430.
- Safe areas via `react-native-safe-area-context`; keyboard-avoiding behaviour on every form; scroll when content can exceed the viewport.
- Money on screen goes through `formatPence`. Never a float or a `toFixed`.
- Validators from `@ditto/core` where they exist (UK mobile, sort code, account number, postcode, email).
- Icons come from `export --svg` by node ID; commit the exact bytes. Never a file whose contents you authored.
- Remove the `PlaceholderScreen` import from this route. Leave the component in place while other routes still use it.
- Run `npm run check`. Fix what it reports. If Knip flags a new unused export, use it or delete it.
- **Self-check on Expo web if the chrome-devtools MCP is available:** start `npx expo start --web` from `apps/mobile`, open each route, and compare element boxes (`getBoundingClientRect` via evaluate_script) with the `extract` values. Take a screenshot only if I ask. Report the differences you see. This never replaces my device check.

Then **stop again**. Hand back with:
- The `npm run check` result. Paste failures verbatim.
- **Exactly how to verify:** the route to open in the Expo dev client (and the `dittopay://` deep link), how to trigger each state you listed in the plan, and how to see dark mode.
- A note of any deliberate deviation from the Figma frame and why.
- What you could **not** verify yourself.

I verify on a device. Do not commit on your own judgment that it matches.

## Phase 3 — Commit (after I approve the implementation)

- If we are on `main`, branch first: `git checkout -b feat/mobile-<screen-slug>`. If we are on a Linear issue branch (see `/new-issue`), stay on it.
- Commit: `feat(mobile): <screen name> screen from Figma <node>`, body listing states and shared components added.
- Push and open a PR only when I say the batch is done, or immediately if the `/new-issue` flow owns this branch. One PR usually covers one section of `docs/figma-screens.md`.
- Update the row in `docs/figma-screens.md` with a `✅ <route>` note so the inventory doubles as the progress tracker.

## Standing rules

- Fidelity beats speed. The client judges Ditto Pay by opening the app on a phone. Text, spacing, and states must match the frame.
- Reuse over re-creation: never add a second Button, TextField, or colour scale. Extend the one that exists.
- One screen, or the batch I named, per run of this command. If the frame reveals a shared piece that three other screens need, build it once here and say so; do not go and touch those screens.
- Never widen scope into API wiring, schema, or web. File a Linear issue in `Ditto-Team` / `Ditto-Monorepo` for anything you find that belongs there.
