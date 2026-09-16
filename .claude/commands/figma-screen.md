---
description: Implement one mobile screen from its Figma frame — plan, build, hand over for verification
argument-hint: <route, e.g. (auth)/sign-in> [figma node, e.g. 1:164310] [--from design-inbox/<folder>]
---

Implement this Figma screen in `apps/mobile`: **$ARGUMENTS**

This is the style-integration pass: replace the `PlaceholderScreen` on a route with the real screen, faithful to Figma, wired to navigation, with every visual state the frame shows. Follow this workflow exactly; do not deviate unless I say so in this conversation. `AGENTS.md` hard rules and `docs/guides/figma-to-screen.md` apply throughout.

## Where design data comes from

The Figma MCP server is **not used** (Starter plan, 20 calls a month, exhausted). Two sources, both free:

1. **REST script** — `node scripts/figma-tokens.mjs` with `FIGMA_TOKEN` in `.env`. Exact values by node ID.
   ```
   node scripts/figma-tokens.mjs extract <node>                     # colours, text, spacing, radii, shadows, icons, copy
   node scripts/figma-tokens.mjs export <node> --png --out <scratchpad dir>   # 2x render to compare against
   node scripts/figma-tokens.mjs export <icon ids> --svg --out apps/mobile/assets/icons
   ```
2. **Inbox folder** — `design-inbox/<screen>/`, filled by me from the "Figma to Code" community plugin (Tailwind/HTML output as `*.html`) and PNG exports of each state. Read every file in the folder. The plugin code is a **layout reference**, never something to paste.

Resolve the node from the argument, or from `docs/figma-screens.md` by route. The inbox folder defaults to `design-inbox/<route slug>` (`(auth)/sign-in` → `design-inbox/auth-sign-in`) unless `--from` says otherwise.

Precedence when sources disagree: `extract` values > plugin code > PNG. If the script fails (no token, 4xx, rate limit) **and** the inbox is empty, stop and tell me exactly which of the two to provide. Never hand-write a screen from the inventory notes or from memory.

## Phase 1 — Plan (no file edits)

1. **Gather.** Run `extract` on the node (and `export --png` into the scratchpad, then look at the PNG with Read). Read the inbox folder. If a frame holds several screens (many onboarding frames do), say which screen inside it we are doing and which we are not.
2. **Read what exists:** `apps/mobile/src/theme/`, `apps/mobile/src/components/`, the current route file and its `actions` hrefs, the group `_layout.tsx`, `docs/design-language.md`, and the `react-navigation` skill for headers, sheets, and safe areas.
3. **Write the plan.** It must cover, in this order:
   - **States in the frame** — every variant the design shows (empty / filled / error / loading / locked / dark / light / 375 and 430 widths) and how each will be reachable in the app (real validation, a prop, route param, or a `__DEV__`-only toggle). Nothing gets silently dropped.
   - **Theme changes** — tokens to add to `src/theme/`. A colour or size that is within a shade of an existing token maps to that token; say so. Nothing new without a Figma origin from `extract`. No hex, font size, or spacing literal goes in a screen file.
   - **Components reused** from `src/components/`, and **components proposed** as shared. A piece becomes shared when a second screen needs it or it is clearly a design-system primitive (Button, TextField, OtpInput, BottomSheet, ListRow, StageHeader). Name each with its props.
   - **Assets** — every icon and image with its node ID from the `Icons` section of `extract`, the path it will be committed to under `apps/mobile/assets/`, and the format. Never hand-draw an icon.
   - **Navigation** — which tappable element goes to which route. Keep every href the placeholder already had unless the design says otherwise. Note header / modal / sheet presentation the group layout needs.
   - **Deployables touched** — should be `apps/mobile` only. Anything in `packages/*` or a new API call is out of scope for a style pass; flag it and stub with static props.
   - **New dependency** — name and justify, default is none. Fonts via `expo-font` and SVG via `react-native-svg` count.
   - **Open decisions** and anything in the frame that contradicts `docs/figma-screens.md` or `PRODUCT.md`.

Then **stop and wait for my approval**. Do not edit any file before that.

## Phase 2 — Implement (after approval)

- Route file stays at its path and stays thin. Screen composition lives in the route file; reusable pieces go in `src/components/`; theme in `src/theme/`. Import via `@/`.
- `StyleSheet.create` with theme tokens via the theme hook. Support light and dark from day one (`userInterfaceStyle` is `automatic`). No fixed widths; the frame ships at 375 and 430.
- Safe areas via `react-native-safe-area-context`; keyboard-avoiding behaviour on every form; scroll when content can exceed the viewport.
- Money on screen goes through `formatPence`. Never a float or a `toFixed`.
- Validators from `@ditto/core` where they exist (UK mobile, sort code, account number, postcode, email).
- Icons come from `export --svg` by node ID; commit the exact bytes. Never a file whose contents you authored.
- Remove the `PlaceholderScreen` import from this route. Leave the component in place while other routes still use it.
- Run `npm run check`. Fix what it reports. If Knip flags a new unused export, use it or delete it.
- **Self-check on Expo web if the chrome-devtools MCP is available:** start `npx expo start --web` from `apps/mobile`, open the route, screenshot it, and compare against the exported PNG. Report the differences you see. This never replaces my device check.

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
- One screen per run of this command. If the frame reveals a shared piece that three other screens need, build it once here and say so; do not go and touch those screens.
- Never widen scope into API wiring, schema, or web. File a Linear issue in `Ditto-Team` / `Ditto-Monorepo` for anything you find that belongs there.
