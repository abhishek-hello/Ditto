# PRODUCT.md — what Ditto Pay is

## One line

Ditto Pay lets people in the UK send, receive, and hold money from their phone, instantly, using a handle instead of bank details.

## Who it's for

- **Consumers (UK residents, 18+)** who want to split bills, pay friends, and pay small merchants without typing sort codes.
- **Small merchants** (market stalls, sole traders) who want to accept payments via QR/handle with next-day settlement. *(Phase 2.)*

## Scope

| In | Out (deliberately) |
| --- | --- |
| GBP only | Any other currency, FX |
| UK bank accounts (sort code + account number) | IBAN / SWIFT / international rails |
| UK mobile numbers (+44) for sign-up | Email-only sign-up |
| Mobile app first (iOS + Android), web dashboard second | Desktop-first product |
| Peer-to-peer by handle, top-up from bank, withdrawal to bank | Credit, lending, BNPL, crypto |

## Surfaces

- **Mobile app** (`apps/mobile`): sign up, KYC, wallet balance, send/request by handle, transaction history, link bank account, top-up, withdraw.
- **Web** (`apps/web`): marketing site, account dashboard (view balance and history, download statements), merchant onboarding later.
- **API** (`apps/api`): everything that moves money. Clients never write to `wallets` or `transactions` directly.

## Core objects

- **Profile** — one per user; public `handle` (`@alice_uk`), display name.
- **Wallet** — one GBP wallet per user; balance in integer pence.
- **Transaction** — a movement of pence between wallets (`p2p`), or between a wallet and the outside world (`top_up`, `withdrawal`, `merchant`). Immutable once `completed`; corrections are new `reversed` transactions.

## Non-negotiables

1. **Never lose or invent a penny.** Every balance change is a Postgres transaction with a matching `transactions` row.
2. **UK regulatory posture.** Ditto Pay is an e-money style product; KYC before first top-up, transaction limits, and audit trails are product requirements, not nice-to-haves. Design data models so they can be exported for compliance.
3. **Plain English, en-GB.** Copy says "sort code", "top up", "£12.50". Dates are `dd/mm/yyyy` in the UI.

## Roadmap sketch

1. **Now** — monorepo, auth (Supabase phone OTP), profile + wallet auto-creation, read-only wallet/history endpoints.
2. **Next** — atomic P2P ledger function, bank linking via Open Banking provider, top-up + withdrawal.
3. **Later** — merchant QR, statements, web dashboard, referral.
