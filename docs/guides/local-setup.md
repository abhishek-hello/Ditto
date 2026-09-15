# Local setup

1. Install Node 24 (`nvm use` reads `.nvmrc`) and Docker (only if you want a local Supabase).
2. `cp env.example .env`.
3. Supabase values, pick one:
   - **Local:** `cd packages/supabase && npx supabase start`, copy the printed URL / anon / service_role into `.env` (`SUPABASE_*`, `NEXT_PUBLIC_SUPABASE_*`, `EXPO_PUBLIC_SUPABASE_*`).
   - **Cloud:** create a personal project at supabase.com, run `npx supabase db push` from `packages/supabase`, copy keys from Project Settings → API.
4. `npm install`.
5. `npm run check:env` then `npm run check`.
6. `npm run dev:api` → open http://localhost:4000/health, expect `{"ok":true,...}`.
7. `npm run dev:web` → http://localhost:3000.
8. `npm run dev:mobile` → scan the QR with Expo Go, or press `i` / `a` for a simulator. Set `EXPO_PUBLIC_API_URL` to your LAN IP (e.g. `http://192.168.1.20:4000`) for a physical device.

## Common problems

- **"Invalid environment"** on API start → the zod schema in `apps/api/src/env.ts` lists what's missing.
- **Two copies of React** in Metro → run `npm ls react`; every workspace must resolve to one version. Don't add a `react` dep with a different range.
- **Next can't import `@ditto/x`** → it's missing from `transpilePackages`.
- **Expo Go can't reach the API** → `localhost` on the phone is the phone. Use the LAN IP.
