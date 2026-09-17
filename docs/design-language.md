# Design language — Ditto Pay mobile

The tokens in `apps/mobile/src/theme/` and where each one came from.

**Source: the Claude Design hand-off**, `DittoPay Light.dc.html` (project `a906f7fa-0c3a-43d4-ad4c-faa8625a7e60`, exported 2026-09-17). Every value below is a literal in that file. The bundle itself is gitignored under `claude-designs/` — it is source material, like `design-inbox/`; what the app needs was copied into `apps/mobile/assets/`.

This replaces the earlier Figma-derived palette (`NyZLmydPFVxa8ehyWWyB68`). The two disagree on nearly every value — brand, background, gutter, control heights and the body font — and the hand-off won. `docs/figma-screens.md` is still the route map; it is no longer the visual source.

Screens read tokens through `useTheme()`. No hex, font size, or spacing literal goes in a screen file.

## Colour

**Light only.** The hand-off ships no dark frames, so `darkColors` in `src/theme/colors.ts` is a placeholder copy of light and `PINNED_SCHEME = 'light'` keeps it off screen. Every value in it must be replaced before the pin comes off — see "Open items".

| Token | Light | Seen on |
| --- | --- | --- |
| `background` | `#f5f7f9` | every screen container |
| `surface` | `#ffffff` | inputs, cards, list rows, sheets, back button |
| `surfaceRaised` | `#ffffff` | sheets and popovers; the hand-off draws both white |
| `surfaceMuted` | `#edf0f2` | summary panels, read-only rows, "Attempt 2 of 3" chip |
| `surfaceSubtle` | `#f7f9fa` | fee-table total row, share-link row |
| `surfacePlaceholder` | `#dde2e6` | video poster |
| `border` | `#e3e7eb` | 1px on inputs, cards, rows, progress track |
| `borderStrong` | `#d7dce1` | secondary button outline, unticked checkbox |
| `divider` | `#ebeef1` | separator inside a card, hairline above a sticky footer |
| `textPrimary` | `#0a141b` | headings, input text, amounts |
| `textSecondary` | `#41474d` | terms body copy, fee-table labels |
| `textMuted` | `#62676d` | field labels, helper copy, stage labels, overlines |
| `textFaint` | `#7c838a` | screen footnotes |
| `textPlaceholder` | `#b4b9bf` | empty input |
| `primary` | `#03c3fd` | primary button, progress fill, selected state, links |
| `primaryBorder` | `#03c3fd` | border on a primary-filled or outlined control |
| `onPrimary` | `#041017` | ink on brand |
| `primarySoft` | `rgba(3,195,253,.10)` | tint behind a selected card |
| `link` | `#03c3fd` | "Forgot password?", "Show" / "Hide" |
| `accentText` | `#03c3fd` | highlighted phrase in a heading, accent amounts |
| `inverse` / `onInverse` | `#0a141b` / `#ffffff` | "Apply" and "Pay & Activate Account" |
| `buttonDisabled` | `#e6e9ec` | any CTA whose form is incomplete |
| `onButtonDisabled` | `#a7adb4` | its label |
| `error` | `#c8102e` | validation messages, error borders |
| `errorBorder` | `#c8102e` | errored input and alert box |
| `errorSoft` | `#fdedf0` | alert box fill, errored field fill, error status circle |
| `onErrorSoft` | `#a20d25` | ink on `errorSoft` |
| `scrim` | `rgba(10,20,27,.35)` | bottom-sheet overlay, video chrome |
| `handle` | `#dce0e5` | sheet grabber, unmet password-rule ring |
| `primaryShadow` | `rgba(3,195,253,.28)` | glow under an enabled primary button |
| `ambientShadow` | `rgba(10,20,27,.18)` | bottom sheet |

`success` / `successSoft` were dropped: the hand-off draws every confirmation in brand cyan, not green.

## Typography

**One family: Clash Grotesk**, at three weights — 400 Regular, 500 Medium, 600 Semibold. The Bold face shipped in the bundle is unused and was not copied. Inter is gone.

The faces are in `apps/mobile/assets/fonts/` and load through `expo-font`'s `useFonts` in `app/_layout.tsx`, which holds the native splash until they are ready. Every style names its `fontFamily` explicitly: React Native will not synthesise a weight for a custom family, and `fontWeight: '600'` on Regular silently renders Regular on Android.

Half-point sizes (14.5, 15.5, 16.5) are kept rather than rounded — there are too many of them in the hand-off to merge without visible drift.

| Group | Tokens |
| --- | --- |
| Headings | `h1Lg` 32 · `h1` 30 · `h1Sm` 28 · `h1Status` 29 · `h2` 24 · `h2Sm` 23 · `h3` 22 · `h3Sm` 20 · `h4` 18 · `h4Sm` 17 · `h5` 16.5 — all 600 |
| Amounts | `amount` 40/600 ls −0.8 · `amountCaption` 19/600 |
| Body | `bodyLg` 17 · `lead` 15.5 · `body` 15 · `bodyTight` 15/20 · `bodySm` 14.5 · `bodyXs` 14 — all 400; `input` 16/500 |
| Labels | `label` 13/500 · `caption` 13.5 · `captionSm` 13 · `captionXs` 12.5 — 400; `overline` 11.5/600 ls 1.04 uppercase · `value` 15/600 · `link` 13.5/600 · `linkLg` 14.5/600 · `hint` 13.5/600 |
| Controls | `button` 17 · `buttonMd` 16.5 · `buttonSm` 16 · `buttonXs` 15.5 · `codeCell` 24 · `sortCell` 22 · `accountCell` 19 · `statusGlyph` 34 · `statusGlyphSm` 28 — all 600 |

## Spacing, shape, size

Base unit 2.

| Token | Value | Seen on |
| --- | --- | --- |
| `spacing.gutter` | 24 | horizontal screen padding on every frame |
| `spacing.sm` … `spacing.xl` | 6, 8, 10, 12, 14, 16 | gaps between fields, cards, buttons |
| `spacing.xlXxl` … `spacing.giant` | 18, 20, 22, 24, 26, 34 | field stacks, heading gaps, splash logo → bar |
| `radius.xs` / `sm` / `smMd` / `md` | 7 / 8 / 11 / 12 | checkbox / time badge / account cell / OTP cell, chips |
| `radius.lg` | 14 | inputs, selects, rows, notes, summary panels |
| `radius.xl` | 16 | buttons, cards, option cards |
| `radius.xxl` | 18 | trading-name preview, video poster |
| `radius.sheet` | 26 | bottom-sheet top corners |
| `radius.pill` | 999 | circles, progress segments |
| `size.button` / `buttonMd` / `buttonSm` / `buttonXs` | 56 / 54 / 52 / 46 | screen CTA / sheet CTA / inline / splash "Retry" |
| `size.input` / `inputSm` | 56 / 52 | text inputs / set-up fee card fields |
| `size.backButton` | 42 | circular back chevron |
| `size.codeCell` / `sortCell` / `accountCell` | 48×58 / 58 / 54 | OTP / sort code / account number |
| `size.checkbox` / `radio` / `ruleDot` | 24 / 26 / 22 | consents / reward cards / password rules |
| `size.statusCircle` / `statusCircleSm` | 82 / 64 | status screens / payment results |
| `size.iconTile` / `playButton` | 46 / 64 | reward card glyph, sheet info circle / video |
| `size.progressSegment` / `Sm` | 5 / 4 | stage bar / reset flow and terms read-through |
| `border.hairline` / `strong` | 1 / 1.5 | default / selected cards, focused cells, checkboxes |
| `shadow.primary` | 0 6 18 | brand glow under an enabled primary button |
| `shadow.footer` | 0 −6 18, 5% | sticky CTA over a scrolling form |
| `shadow.sheet` | 0 −10 40, 18% | bottom sheet |

## Components

Under `apps/mobile/src/components/`. Every screen is assembled from these:

`FormScreen` (background, gutters, pinned header, scrolling body, keyboard-safe footer) · `StageHeader` (back button, stage bar, caption) · `ProgressSegments` · `ScreenHeading` (title with one brand-coloured phrase) · `TextField` (label, error / helper, `password` toggle, `invalid` / `tinted` / `accent`) · `SelectField` · `CodeInput` (OTP, sort code, account number) · `Button` (primary / secondary / outline / inverse / plain, four heights) · `OptionCard` · `Checkbox` · `PasswordRules` · `StatusScreen` · `FooterBar` · `Panel` · `DetailRows` · `Overline` · `BottomSheet` · `BackButton` · `BrandLogo` (stacked / inline) · `VerifyCodeScreen`.

## Departures from the hand-off

Three, each because the prototype's browser workaround is wrong on a device:

1. **No fake keyboard.** The address screen draws an iOS keyboard in HTML and lifts the CTA by a fixed 230px. `FormScreen` uses `KeyboardAvoidingView`, which reads the real keyboard's height at any text size.
2. **`SelectField` has a chevron.** The hand-off sets `appearance:none` with no replacement arrow, leaving a control with no affordance. The options open in a bottom sheet rather than a picker package.
3. **`maskEmail` masks at 3+ characters, not 2.** The hand-off renders `jo···@` for `jo@`, implying characters that are not there.

The prototype's device chrome (375×812 frame, fake status bar, home indicator) and its state-switcher chip bar are not part of the app.

## Open items for the designer

1. **Dark mode.** Nothing to mine; `darkColors` is a placeholder and the app is pinned light.
2. **Input focus state.** None drawn. `accent` (brand border on a typed-in password) is the only thing close.
3. **Icons.** The hand-off draws every glyph as text (`‹ ✓ ! ★ ↻ ▶ ❚❚ ↗ ▾`) and so does the app. A real icon set is still an open decision.
4. **The address screen's stage.** Labelled "Sector 3 of 4 · Business details" while filed under account creation. Reproduced as drawn; see `docs/figma-screens.md` §3 step 7.
5. **Step 5 verifies email, not mobile.** The route is `create-account/verify-mobile`, and the copy says "Enter the email code". The hand-off's flow is followed; the name is not.
