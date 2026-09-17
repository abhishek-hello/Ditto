# Figma → screen workflow (mobile)

How a Figma frame becomes a real screen in `apps/mobile`. The agent-facing version is the `/figma-screen` slash command in `.claude/commands/`; this page is the human-readable contract behind it.

Source file: https://www.figma.com/design/NyZLmydPFVxa8ehyWWyB68/Untitled. Screen → node map: [`figma-screens.md`](../figma-screens.md).

## The loop

Every screen goes through the same four beats. Nothing skips a beat.

| Beat | Who | What happens | Exit condition |
| --- | --- | --- | --- |
| 1. Plan | agent | Pulls the frame via the REST script and the inbox folder. Lists states, theme changes, reused / new components, assets, navigation, open decisions. | You approve the plan. |
| 2. Build | agent | Replaces the `PlaceholderScreen` on the route. `npm run check` passes. Optional Expo-web self-check. | Agent hands over verification steps. |
| 3. Verify | you | Open the route in the Expo dev client on a phone. Walk every state. Flip dark mode. | You say "approved" or list fixes. |
| 4. Commit | agent | Conventional commit on the working branch. Marks the row in `figma-screens.md`. | PR when the batch (usually one section of the inventory) is done. |

Run it as:

```
/figma-screen (auth)/sign-in 1:164310
/figma-screen (auth)/sign-in --from design-inbox/auth-sign-in
```

The node is optional when the route maps to exactly one row in the inventory; the inbox folder defaults to the route slug.

## Where design data comes from

The Figma MCP server is **not used**: the Starter plan allows 20 calls a month for the whole workspace and they are gone. Two free routes replace it, and the command reads both.

**Local snapshot — the default.** The REST quota is a handful of requests a month, so the design is pulled once: `npm run figma -- snapshot` saves node data and a render of every inventory section in `design-snapshot/` (gitignored) in about three requests. `--assets` adds icons and image fills; `snapshot <ids>` refreshes nodes that changed. After that, `npm run figma -- screens` maps every route to its frames and states and names the next screen to do, and `extract` / `export --svg` read the local copy without calling the API. Batch screens by flow: `/figma-screen "§3 steps 2–7"`.

**1. REST script — exact values by node ID.** Needs a personal access token in `.env` as `FIGMA_TOKEN` (Figma → Settings → Security → Personal access tokens, scope *File content: read*). The REST API has its own quota, separate from the MCP server's.

```
npm run figma -- list                     # pages and top-level frames
npm run figma -- extract 1:164310         # colours, text styles, spacing, radii, shadows, icons, copy
npm run figma -- export 1:164310 --png    # 2x render of a frame
npm run figma -- export 12:34 --svg --out apps/mobile/assets/icons
```

**2. Inbox folder — layout reference and state renders.** Run the free community plugin **Figma to Code** on the frame, save its Tailwind/HTML output and a 2x PNG per state under `design-inbox/<screen>/`. See `design-inbox/README.md` for the layout. The folder is gitignored.

Precedence when they disagree: script values, then plugin code, then PNG. When the script fails and the inbox is empty, the agent stops and says which one it needs. It must not build from the inventory notes alone.

## Design language first

Before the first screen, the theme is seeded from the whole file rather than one frame. Inputs: `extract` on the Sign In frame, one dark-mode frame and one main-app frame (or their plugin exports under `design-inbox/design-language/`), plus `list` to spot a dedicated style-guide frame. The colour, text, radius and spacing tallies are reconciled into named tokens, near-duplicate shades merged and the merges written down. The result is `apps/mobile/src/theme/` (light and dark palettes, spacing, radii, type scale, `useTheme()`) and `docs/design-language.md`, which records each token's Figma origin so the designer can confirm the merges.

## Order of work

1. **Design language first** (see above) creates `apps/mobile/src/theme/`. After that every screen extends the theme; nobody forks it.
2. **Then primitives.** The first screens that show a Button, TextField, OTP input, bottom sheet, or list row build them once under `src/components/`. Later screens reuse them.
3. **Then flows, in inventory order.** Launch → Sign in → Onboarding stages → Tabs → Account. Doing a flow end to end keeps navigation coherent and makes the batch PR reviewable on a device.

Recommended first screen: **Sign In (`1:164310`)**. It has a text field, a primary button, error and locked states, and dark / light variants, so it seeds most of the primitives.

## Rules the build must follow

- **Theme tokens only.** No hex, font-size, or spacing literal in a screen file. `StyleSheet.create` stays (see `DESIGN.md`); the styling-library question is revisited once the theme is proven across a flow.
- **Light and dark both work** from the first screen. `app.config.ts` has `userInterfaceStyle: 'automatic'`.
- **No fixed widths.** Frames ship at 375 and 430.
- **Every state in the frame is reachable** in the app — by real validation, a prop, a route param, or a `__DEV__`-only toggle — and is listed in the hand-over so you can walk it.
- **Assets are downloaded bytes**, committed under `apps/mobile/assets/`. Nothing hand-drawn. SVG rendering needs `react-native-svg`; that dependency is raised as a decision on the first screen that needs an icon, not added silently.
- **Money via `formatPence`**, validators from `@ditto/core`. Style pass only: no API wiring, no schema, no web. Data is static props until the feature issue wires it.
- **Route file stays thin and at its path.** Shared pieces go in `src/components/`, imported through `@/`.
- **`npm run check` passes** before hand-over. Knip complaints about a new unused export mean use it or delete it.

## Verifying on a device

The agent's hand-over tells you the route, the deep link (`dittopay://…`), how to reach each state, and how to see dark mode. Set `EXPO_PUBLIC_DEV_BYPASS_AUTH=1` in `.env` to reach any route without a session. Compare against the Figma frame at the same width as your device where possible.

What to look for, in priority order: text and copy exact → spacing and alignment → colours in both themes → state transitions → keyboard and safe-area behaviour.

## Batching and PRs

Commit after each approved screen. Open one PR per inventory section (e.g. "§2 Sign in and password reset") unless the screen belongs to a Linear issue, in which case `/new-issue` owns the branch and PR. Tick the row in `figma-screens.md` in the same commit so the inventory doubles as the progress board.
