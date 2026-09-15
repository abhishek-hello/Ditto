# scripts/

Repo tooling only. Nothing here ships to production.

| Script | Purpose |
| --- | --- |
| `bootstrap.sh` | First-time local setup: creates `.env`, installs, typechecks. |
| `check-env.mjs` | Diff `env.example` against `.env`; fails on missing or undocumented keys. |

Conventions: Node scripts are `.mjs` (ESM, no build step). Shell scripts use `set -euo pipefail`. Backfills and one-off data fixes go in `scripts/backfills/<date>-<name>.mjs` and are deleted once run in every environment.
