# Design language — Ditto Pay mobile

The tokens in `apps/mobile/src/theme/` and where each one came from. Source: the Figma file (`NyZLmydPFVxa8ehyWWyB68`), read through `scripts/figma-tokens.mjs` on 2026-09-16. The file has no variables or named styles and its layers are auto-named (it was imported from HTML), so every value below was mined from the screens themselves and reconciled by hand. Anything marked **provisional** has no Figma origin and needs the designer's confirmation.

Frames used: Splash `1:164157`, Welcome `1:164223`, Sign In `1:164310`, Reset password `1:164476`, Home + Payments `1:168352`, Tab bar `1:176941`, QR keypad `1:177306`, Account `1:170876`.

Read this with `docs/guides/figma-to-screen.md`. Screens read tokens through `useTheme()`; no hex, font size, or spacing literal goes in a screen file.

## Colour

Two palettes, chosen by the OS scheme. Auth and onboarding frames exist in both modes; the main app frames are light only (the Account screen even says "Theme: Light (only option for now)"), so dark values for app surfaces come from the auth frames and will be checked as those screens are built.

| Token | Light | Dark | Seen on |
| --- | --- | --- | --- |
| `background` | `#ffffff` | `#000d14` | every screen container |
| `surface` | `#eef2f3` | `#16232b` | inputs, cards, chips, list rows, back button |
| `surfaceRaised` | `#ffffff` | `#16232b` | icon circle inside a row, tab bar, bottom sheet |
| `border` | `#d3dbde` | `#2b3a43` | 1px on every surface (236 and 28 uses) |
| `borderStrong` | `#afbbc0` | `#3d4c56` | secondary button outline, sheet grabber |
| `textPrimary` | `#0a1418` | `#ffffff` | headings, input text, amounts |
| `textSecondary` | `#33424a` | `#c3cdd2` | row labels, sheet body |
| `textMuted` | `#647178` | `#8a979e` | field labels, captions, overlines, inactive tab icons |
| `textPlaceholder` | `#8a979e` | `#647178` **provisional** | empty input |
| `primary` | `#30f1fb` | `#30f1fb` | primary button, active tab pill, avatar, status chips, switch |
| `primaryBorder` | `#93def5` | `#8ff6fb` | 1px on a primary button |
| `onPrimary` | `#001014` | `#000d14` | text on cyan |
| `primarySoft` | `rgba(48,241,251,.16)` | `#0a3b42` | cyan tint (chart overlay), info icon circle on a sheet |
| `link` | `#03c3fd` | `#30f1fb` | "Forgot password?", "Show", "Change Email", "Mark all read" |
| `accentText` | `#0a737d` | `#30f1fb` | emphasised cyan number on a surface ("£120.00" outstanding) |
| `buttonDisabled` | `#dde4e6` | `#0c1a22` | locked Sign In button |
| `onButtonDisabled` | `#9aa5aa` | `#5a676e` | its label |
| `error` | `#c22b2b` | `#ff5a5f` | "Incorrect email or password.", Delete Account |
| `errorBorder` | `#c22b2b` | `#ff5a5f` | input and alert box border |
| `errorSoft` | `rgba(194,43,43,.08)` **provisional** | `#2e1214` | alert box / errored input background |
| `success` | `#0f7a46` | `#46d97a` | "ID Verified" tick, success text |
| `successSoft` | `#e3f6eb` | `#0c2a1d` | success badge background |
| `scrim` | `rgba(0,13,20,.72)` | same | bottom-sheet overlay (`#000d14b8`) |
| `handle` | `#afbbc0` | `#3d4c56` | sheet grabber, home indicator |

**Merged shades.** The QR keypad frames were drawn with a slightly different neutral set. They map onto the tokens above and are not separate colours: `#f1f3f6` → `surface`, `#12181f` → `textPrimary`, `#8b93a1` / `#7c8794` → `textMuted`, `#4b5560` → `textSecondary`, `#1a2530` / `#0e1620` → dark `surface` / `background`, `#06262b` → dark `primarySoft`. One Home variant uses `#03c3fd` for the avatar and Create Payment tile with a `#125b71` border; that is treated as an exploration, not a second primary. `#ff5359` → `error`. `#e2e8ea`, `#e9eeef` → `surface`.

**Not in the file yet:** a warning colour, a focused-input border (Figma shows no focus state), and light-mode dark-on-light disabled text beyond the button.

## Typography

Two families. **Clash Grotesk** (weights 600 and 700) for headings and the wordmark. **Inter** for everything else. The QR keypad frames use SF Pro, which is iOS system UI and is not a token. Menlo and Lucida Grande appear only in the designer's annotation chips.

| Token | Size / line | Weight | Extra | Seen on |
| --- | --- | --- | --- | --- |
| `display` | 32 / 39 | 700 | | "dittopay" wordmark (Clash) |
| `h1` | 26 / 30 | 600 | ls −0.5 | "Sign in", "Merchant Account" (Clash) |
| `h2` | 22 / 26 | 600 | ls −0.4 | sheet titles, "Transaction Logs" (Clash) |
| `h3` | 18 / 22 | 600 | | "Take your first payment" (Clash) |
| `h4` | 17 / 21 | 600 | | name in the account header (Clash) |
| `amountLg` | 34 / 41 | 600 | | "£752.00" |
| `amountMd` | 24 / 29 | 600 | | secondary amounts |
| `body` | 15 / 20 | 400 | | input text, tagline (merges 15/18, 15/22) |
| `bodySm` | 14 / 20 | 400 | | row labels, sheet copy (merges 13.5/16, 14/21, 14.5/18) |
| `caption` | 13 / 18 | 400 | | helper and error copy (merges 12.5/15, 13/16, 13/19) |
| `captionSm` | 12 / 16 | 400 | | footnotes, timestamps (merges 11.5/14, 12/17, 11/13, 10.5/13) |
| `label` | 13 / 16 | 500 | | field label above an input |
| `labelStrong` | 13 / 16 | 600 | | links, "Show", tab label (merges 12.5/15, 13.5/16, 12/15) |
| `labelSm` | 11 / 14 | 600 | | small chips: "ID Verified", "Active" (merges 11.5/14) |
| `overline` | 11 / 13 | 600 | ls 0.6, uppercase | "ACCOUNT", "SMITHS ELECTRICAL" |
| `value` | 15 / 18 | 600 | | row value on the right (merges 14.5/18) |
| `button` | 17 / 21 | 600 | | primary / secondary button |
| `buttonSm` | 15 / 18 | 600 | | sheet button, "Create Payment QR" |
| `buttonXs` | 14 / 18 | 600 | | splash "Retry" (Figma 14/17) |

Half-point sizes in Figma (11.5, 12.5, 13.5, 14.5) are a side effect of the HTML import and were rounded to whole points.

### Fonts: decision needed

Neither family is bundled yet, so the styles above carry no `fontFamily` and the system font renders. Wiring them is a one-line change per style once the files are in. Recommendation:

- **Inter**: download the static TTFs (Regular, Medium, SemiBold, Bold) from Google Fonts into `apps/mobile/assets/fonts/`. No new package.
- **Clash Grotesk**: download Semibold and Bold from Fontshare (Indian Type Foundry, free licence that permits app embedding) into the same folder.
- Load both with `expo-font` (already in the Expo SDK; needs adding to `apps/mobile/package.json`) in the root layout, holding the splash until ready.

## Spacing, shape, size

Base unit 2. Figma gaps cluster at 6 / 8 / 12 / 14 / 16 and paddings at 13 to 16 and 19.

| Token | Value | Seen on |
| --- | --- | --- |
| `spacing.gutter` | 16 | horizontal screen padding at both 375 and 430 |
| `spacing.sm` … `spacing.xl` | 6, 8, 12, 16 | gaps between chips, fields, cards |
| `spacing.xxl`, `xxxl`, `huge` | 20, 24, 32 | sheet padding, section spacing |
| `radius.md` | 12 | inputs, error box |
| `radius.lg` | 14 | list rows, sheet buttons |
| `radius.xl` | 16 | primary / secondary buttons, home action tiles |
| `radius.xxl` | 18 | stat card |
| `radius.sheet` | 20 | bottom-sheet top corners |
| `radius.pill` | 999 | chips, avatar, tab pill, icon circles, back button |
| `size.button` / `buttonSm` / `buttonXs` | 56 / 48 / 44 | full-width buttons / sheet and inline buttons / splash "Retry" |
| `size.input` | 52 | text inputs (14 horizontal padding inside) |
| `size.avatar` | 44 | initials circle |
| `size.tabPill` | 40 | active tab background (118 wide with label) |
| `size.rowIcon` | 38 | icon circle at the start of a row |
| `size.backButton` | 34 | circular back chevron |
| `size.chip` | 24 | status chips (5 / 11 padding) |
| `size.tabBar` | 65 | tab bar height including the top hairline |
| `border.hairline` | 1 | every border in the file |
| `shadow.sheet` | 0 −8 24, 12% | bottom sheet |
| `shadow.modal` | 0 12 32, 18% | centred dialog (Delete account) |

Card padding is 13 vertical / 15 horizontal on rows and 19 all round on the stat card. Row layout is icon circle, label, value, with a 12 gap.

## Components the file implies

Built once, under `src/components/`, by the first screen that needs each: `Button` (primary / secondary / disabled, 56 and 48), `TextField` (label, value, trailing action, error), `BackButton`, `Chip`, `ListRow` (icon, label, value or chevron or badge or switch), `StatCard`, `ActionTile`, `BottomSheet` (grabber, scrim), `Dialog`, `SegmentedControl` (Today / Week / Month), `TabBar` with the cyan active pill, `Avatar`, `SectionHeader` (overline).

## Icons: decision needed

The file contains 643 unnamed vector layers. The glyphs are the Lucide set: home, arrow-left-right, layout-grid, user, chevron-left, chevron-right, info, circle-check, trending-up, users, clock, star, trophy, download, bell, file. Stroke about 1.6 at 20px.

Recommendation: `lucide-react-native` on top of `react-native-svg` (two new packages, both Expo-compatible), and export from Figma only the glyphs that are not in Lucide, such as the diamond logo mark. The alternative, exporting every icon by node ID, is workable but the vectors are unnamed and the same glyph appears dozens of times.

## Open items for the designer

1. Light-mode error background and dark-mode placeholder colour (provisional values in use).
2. Whether `#03c3fd` on the second Home variant is intentional. The theme treats `#30f1fb` as the only primary.
3. Input focus state. None drawn.
4. Dark mode for the main app screens. Only auth and onboarding are drawn in dark.
