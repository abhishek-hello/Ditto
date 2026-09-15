import { resolve } from 'node:path';
import { config as loadDotenv } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Every workspace reads the single ROOT .env (see ENVIRONMENTS.md).
// drizzle-kit runs this file as CJS, so import.meta.dirname is unavailable; scripts run from the package dir.
loadDotenv({ path: resolve(process.cwd(), '../../.env'), quiet: true });

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema.ts',
  out: './drizzle',
  // `generate` and `check` work offline; `migrate`, `push`, `studio` need this.
  dbCredentials: { url: process.env.SUPABASE_DB_URL ?? '' },
  // Supabase manages its own roles (anon, authenticated, service_role…);
  // tell drizzle-kit not to try to create or drop them.
  entities: { roles: { provider: 'supabase' } },
  schemaFilter: ['public'],
  strict: true,
  verbose: true,
});
