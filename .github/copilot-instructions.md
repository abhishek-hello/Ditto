Follow `AGENTS.md` at the repository root. It is the canonical guide for this monorepo.
Key rules: money is integer pence (`Pence` from `@ditto/core`); GBP/UK only; the Supabase
service-role key is used only in `apps/api`; all API input is zod-validated; one root `.env`;
Biome is the only linter/formatter. Run `npm run check` before proposing changes.
