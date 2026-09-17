# Figma screen inventory — Ditto Pay mobile

Source: https://www.figma.com/design/NyZLmydPFVxa8ehyWWyB68/Untitled (page `0:1`, "Page 1").

> **Visual source has moved.** Auth and onboarding are now built from the Claude Design hand-off (`DittoPay Light.dc.html`), not these frames — see `docs/design-language.md`. The node IDs below stay useful as a map of *what screens exist and how they connect*; do not take colour, type or spacing from them. Screens marked ✅ are implemented; the hand-off is their reference.

Purpose: the list of screens and how they connect, so expo-router routes can be laid out in `apps/mobile/app/`. Visual detail is intentionally left out; implement screens one at a time by opening the Figma node ID listed next to each entry with `get_design_context` / `get_screenshot`.

How this was derived: the Figma layers are auto-named (`Container`, `Section`), so screen names come from the headings, stage labels and annotation chips inside each frame, plus screenshots of the first third of the page. Node IDs point at the top-level frame that holds the screen and all its state variants (dark/light, 375/430 width, error/loading states). A few frames are noted as unconfirmed where the Figma tool limit stopped screenshots.

---

## 1. Launch

| Screen | Notes | Figma node |
| --- | --- | --- |
| Splash | fast, slow (progress bar), failed (Retry) | `1:164157` ✅ `app/index.tsx` |
| Welcome | "Made to get paid." → Create Account / Sign In. Includes "Not available in your region yet" bottom sheet | `1:164223` ✅ `app/(auth)/welcome.tsx` |

Flow: Splash → Welcome → (Create Account → §3) or (Sign In → §2). A signed-in user skips to §7.

## 2. Sign in and password reset

| Screen | Notes | Figma node |
| --- | --- | --- |
| Sign In | email + password; empty, wrong credentials, locked (15 min) | `1:164310` ✅ `app/(auth)/sign-in.tsx` |
| Reset your password | step 1, enter email, "Send code" | `1:164476` ✅ `app/(auth)/forgot-password/index.tsx` |
| Enter the reset code | step 2, 6-digit OTP, wrong-code state | `1:164476` ✅ `app/(auth)/forgot-password/code.tsx` |
| Set a new password | step 3, live tickable rules | `1:164476` ✅ `app/(auth)/forgot-password/new-password.tsx` |

Flow: Sign In → Forgot password? → Reset (email) → Reset code → New password → Sign In.

## 3. Onboarding stage 1 of 4 — Account creation (10 steps)

All in frame `1:165000` unless noted. Labels in Figma read "Stage 1 of 4 · Account creation — step N of 10".

| Step | Screen | Notes | Figma node |
| --- | --- | --- | --- |
| 0 | Country and language | not in the Figma frames; added by the hand-off. UK / English only, the rest listed and disabled | — ✅ `app/(onboarding)/create-account/country-language.tsx` |
| 1 | What kind of merchant are you? | Sole Merchant / Business. The hand-off makes Business selectable, where Figma greyed it | `1:165000` ✅ `app/(onboarding)/create-account/merchant-type.tsx` |
| 2 | Your legal name | first, middle (optional), last, date of birth (18+) | `1:165000` ✅ `app/(onboarding)/create-account/legal-name.tsx` |
| 3 | Your email | email + confirm email, mismatch error | `1:165000` ✅ `app/(onboarding)/create-account/email.tsx` |
| 4 | Your mobile number | UK mobile validation | `1:165000` ✅ `app/(onboarding)/create-account/mobile.tsx` |
| 5 | Verify your mobile | 6-digit OTP. **The hand-off verifies the _email_ here**, not the mobile; the route keeps its name | `1:163382` (state grid), `1:165000` ✅ `app/(onboarding)/create-account/verify-mobile.tsx` |
| 6 | Create a password | rules checklist, Show toggle | `1:165000` ✅ `app/(onboarding)/create-account/password.tsx` |
| 7 | Your home address | country, county, postcode, town, street, house, flat. Labelled "Sector 3 of 4" while filed under stage 1 — reproduced as drawn; placement is a product decision | `1:164705` ✅ `app/(onboarding)/create-account/home-address.tsx` |
| 8–10 | Stage complete | "You're all set — next we'll verify your identity." | `1:165000` ✅ `app/(onboarding)/create-account/complete.tsx` |

## 4. Onboarding stage 2 of 4 — Identity verification (iDenfy)

All in frame `1:175312`.

| Screen | Notes |
| --- | --- |
| Verify Your Identity | intro, choose Passport / Driving Licence |
| Document scan | iDenfy SDK, passport / licence |
| Match Your Face | biometric consent ("BEFORE YOU CONTINUE") |
| Face Detection | "Scanning your face", iDenfy SDK |
| Identity Verified | success |

## 5. Onboarding stage 3 of 4 — Business details (3 steps)

| Step | Screen | Notes | Figma node |
| --- | --- | --- | --- |
| 1 | Please tell us what you do | live search over 68 trades, custom trade when nothing matches | `1:165847` ✅ `app/(onboarding)/business/profession.tsx` |
| 2 | Your trading name | optional, 34-char cap, live "how this looks to a paying customer" preview | `1:165949` ✅ `app/(onboarding)/business/trading-name.tsx` |
| 3 | Your home address | see §3 step 7, labelled "Sector 3 of 4 · Business details" | `1:164705` |
| — | Business Details Success | "Fantastic!" → Connect Bank Account | `1:166066` ✅ `app/(onboarding)/business/complete.tsx` |

## 6. Onboarding stage 4 of 4 — Bank verification (11 steps)

| Step | Screen | Notes | Figma node |
| --- | --- | --- | --- |
| 1 | Link your bank account | sort code, account number, account holder name | `1:166104` ✅ `app/(onboarding)/bank/link.tsx` |
| 2 | Bank link result | name mismatch, "Attempt N of 3" | `1:166357` ✅ `app/(onboarding)/bank/result.tsx` |
| 3 | Locked out of automatic linking | three ways on: different account, support (ref BL-48213), finish later | `1:166295` ✅ `app/(onboarding)/bank/help.tsx` |
| 3 | Automated customer rewards | choose Points / Visits / Skip for now | `1:166447` ✅ `app/(onboarding)/bank/rewards-setup.tsx` |
| 3 | Set up points | accrual, reward, unlock threshold, per-transaction cap, live summary | `1:166447` ✅ `app/(onboarding)/bank/rewards-points.tsx` |
| 3 | Set up visits | fixed 1 point per visit, visits needed, reward, cap per day/week/month/year | `1:166447` ✅ `app/(onboarding)/bank/rewards-visits.tsx` |
| 4 | Review Terms & Conditions | 10 numbered sections, scroll-gated accept, version 2.1 | `1:167327` ✅ `app/(onboarding)/bank/terms.tsx` |
| 5 | Please authorise account fees | fee table, T&Cs consent, Variable Direct Debit consent | `1:167327` ✅ `app/(onboarding)/bank/fees.tsx` |
| 6 | Account set up fee | £25 one-off, discount code (DITTO25 waives it), card fields | `1:167327` ✅ `app/(onboarding)/bank/setup-fee.tsx` |
| 7 | Payment | Stripe hand-off / successful / didn't go through / confirming | `1:167327` ✅ `app/(onboarding)/bank/payment.tsx` |
| 8 | You're all set | "A quick 60-second tour", share sheet, watch later | `1:167327` ✅ `app/(onboarding)/bank/tour.tsx` |
| — | Bank account linked | end of onboarding → Home | `1:167327` ✅ `app/(onboarding)/bank/complete.tsx` |

Flow: Bank → (mismatch → result → help) → Rewards choice → Points / Visits / skip → Terms → Fees → Set-up fee → Payment → Tour → §7 Home.

The step numbers above are the hand-off's own captions, which repeat "step 3 of 11" across four rewards screens. Reproduced as written.

## 7. Main app (tab bar: Home, Payments, QR, Account)

Tab bar variants: `1:176941`.

| Tab / screen | Notes | Figma node |
| --- | --- | --- |
| Home | merchant dashboard: payments received last 7 days, Create Payment, Add Rewards Customer, Enable Automated Rewards, outstanding payments, team income, team members, rewards customers | `1:168352` |
| Payments (Transaction Logs) | list, Paid / Unpaid, date range filter (From / To) | `1:168352` |
| Payment Detail | with Share Receipt (disabled until received) | `1:169470` |
| QR (Take Payment QR) | keypad, VAT, Tip, Add note, Favourite (£250), Repeat last, Clear; "Are you sure?" confirm sheet | `1:177306` |
| Scan to pay | QR display, amount, trading name, Share link to pay, Cancel payment; expiring, expired ("Create a new code") | `1:160237`, `1:163100` |
| Payment Confirmation | received, share receipt, Done | `1:169470` |
| Account | see §8 | `1:170876` |

Flow: Home / QR tab → Take Payment QR → confirm sheet → Scan to pay → Payment Confirmation → Payment Detail.

### Rewards (reached from Home and Account)

| Screen | Notes | Figma node |
| --- | --- | --- |
| Customer Rewards (My Rewards Program) | programme overview (accrual, reward at, max per txn), locked once customers exist, Change reward type, Turn Off | `1:169470` |
| Enable Rewards | empty state "You haven't enabled rewards yet" | `1:169470` |
| Add Rewards Customer | name + email, duplicate / invalid errors | `1:169470` |
| Change reward type warning | "Switching Rewards Type Will Delete Points" | `1:175746` |
| Turn off rewards | "Turning Off Rewards Will Delete Points", type DISABLE | `1:175746`, `1:169470` |

## 8. Account

Account menu (`1:170876`) sections: Merchant Account, Payment settings, Security. Entries below are each a screen.

| Screen | Notes | Figma node |
| --- | --- | --- |
| Account menu | list of everything below | `1:170876` |
| My Account Information | Change Name, Change Email, Change Mobile, Date of birth (verified, not viewable), Change Home Address | `1:170876` |
| Re-authentication | Confirm your password / Face or fingerprint / Verify your mobile (OTP); shown before any sensitive change | `1:171645` |
| Change Name | submits re-verification request | `1:173815` |
| Change Email | new email → code to new address | `1:171645` |
| Change Mobile | new mobile → code by SMS | `1:171645` |
| Change Home Address | pre-filled form, Save Changes | `1:171645` |
| Change Password | old, new, confirm; mismatch errors | `1:171645` |
| Manage Team Members | list, Invite Team Member (name + mobile, 48h link), member detail / Team Member Activity, Remove | `1:173070` |
| TIPS Summary | unpaid tips per member | `1:173070` |
| My Rewards Program | see §7 Rewards | `1:169470` |
| Notifications | list, "Mark all read"; notice detail: Email / Mobile / Bank / Address / Business Name / Password changed, Direct debit failed, Billing Notice | `1:170876`, `1:175746`, `1:176201` |
| Documents | IDENTITY (Passport, Driving Licence), RECORDS (T&Cs PDF, invoices), Getting Started demo video | `1:170876`, `1:176201` |
| Favourite Payment Settings | saved prices used by the keypad Favourite key | `1:173815` |
| Default Note | pre-fills payment note | `1:173815` |
| QR Code Timeout | presets + custom 2–60 min | `1:173815` |
| VAT Settings (Default VAT) | 0%, 5%, custom | `1:173815` |
| Default TIP | 0%, 5%, custom | `1:173815` |
| Bank Account (change bank) | see flow below | `1:172654` |
| Account Fees | weekly fee, fee history | `1:173815` |
| Fingerprint / Face ID Login | toggle | `1:170876` |
| Theme | dark / light | `1:170876` |
| Delete Account | re-auth, "Type DELETE to confirm", 14-day grace | `1:170876`, `1:171645` |

### Change bank account flow (`1:172654`)

Re-auth → Enter Sort Code → Enter Account Number → Enter Account Name → Review & Confirm → Verify your mobile → result:
- Bank change scheduled (48h hold), or Bank account changed
- Name doesn't match (2 attempts left / 1 attempt left / "Let's get a person to check this")
- "A bank change is in progress" notice on re-entry

## 9. Team member (invited user) onboarding

Frame `1:174285`. A team member joins a merchant's account via SMS invite; no DOB, address or ID.

| Step | Screen |
| --- | --- |
| 1 | Welcome To [Merchant]'s Team / Please Verify Your Email |
| 2 | Please Verify Your Mobile Number (recovery: "Invited by", Message merchant) |
| 3 | Your Details (Step 1 of 3): full name, email, mobile |
| 4 | Create Password (Step 2 of 3, reused) |
| 5 | Team Member Terms (Step 3 of 3, scroll-gated I Accept) |
| 6 | You're All Set! (Watch 1 Min Demo Video) |

Team member main app (`1:174703`): same tabs, Home shows "[MERCHANT] · you work here", Payment Logs, and a reduced "TEAM Account" menu (no bank, fees, team management).

## 10. Not screens (component specs)

`1:164075` text field states, `1:164118` masked field, `1:164131` dropdown bottom sheet, `1:164143` checkbox and segmented control. `1:164073`, `1:164997`, `1:165845` are annotation chips.

---

## expo-router layout (implemented in `apps/mobile/app/`)

Groups in parentheses do not appear in the URL, so two folders were renamed from the first draft to avoid path collisions: stage 1 lives in `(onboarding)/create-account/` (not `account/`, which would have made `/account/password` ambiguous with the settings screen), and the team-member flow is a real `team-invite/` prefix so the SMS deep link can target it.

```
apps/mobile/app/
  _layout.tsx                      root stack, auth gate
  index.tsx                        Splash (bootstrap, then redirect)

  (auth)/
    _layout.tsx
    welcome.tsx
    sign-in.tsx
    forgot-password/
      index.tsx                    Reset your password (email)
      code.tsx                     Enter the reset code
      new-password.tsx             Set a new password

  (onboarding)/                    stage progress header
    _layout.tsx
    create-account/
      merchant-type.tsx
      legal-name.tsx
      email.tsx
      mobile.tsx
      verify-mobile.tsx
      password.tsx
      home-address.tsx
      complete.tsx
    identity/
      index.tsx                    Verify Your Identity
      document.tsx                 iDenfy document scan
      face-consent.tsx
      face-scan.tsx
      verified.tsx
    business/
      profession.tsx
      trading-name.tsx
      complete.tsx
    bank/
      link.tsx
      result.tsx                   verifying / failed / near-match
      terms.tsx
      fees.tsx
      rewards-setup.tsx
      complete.tsx

  team-invite/                     entered via SMS deep link
    _layout.tsx
    welcome.tsx                    verify email
    verify-mobile.tsx
    details.tsx
    password.tsx
    terms.tsx
    complete.tsx

  (tabs)/
    _layout.tsx                    Home · Payments · QR · Account
    home.tsx
    payments.tsx                   Transaction Logs
    qr.tsx                         Take Payment QR
    account.tsx                    Account menu

  payment/
    [id].tsx                       Payment Detail
    scan-to-pay/[id].tsx
    confirmation/[id].tsx

  rewards/
    index.tsx                      Customer Rewards / Enable Rewards
    add-customer.tsx
    change-type.tsx
    turn-off.tsx

  account/
    reauth.tsx                     password / biometric / OTP, returns to caller
    information/
      index.tsx
      name.tsx
      email.tsx
      mobile.tsx
      address.tsx
    password.tsx
    team/
      index.tsx
      invite.tsx
      [memberId].tsx
    tips.tsx
    notifications/
      index.tsx
      [id].tsx
    documents.tsx
    favourites.tsx
    default-note.tsx
    qr-timeout.tsx
    vat.tsx
    tip.tsx
    fees.tsx
    bank/
      sort-code.tsx
      account-number.tsx
      account-name.tsx
      review.tsx
      verify-mobile.tsx
      result.tsx
    biometrics.tsx
    theme.tsx
    delete.tsx
```

Shared screens to build once and reuse: OTP entry (verify mobile / reset code / bank change / team invite), password create (account creation / team invite / change password), address form (onboarding / change address), re-auth gate.
