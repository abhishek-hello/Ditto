import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export * from './schema';
export { schema };

export interface CreateDbOptions {
  /** Postgres connection string. Use Supabase's transaction pooler URL (port 6543) in serverless, session pooler or direct (5432) for long-lived servers. */
  url: string;
  /** Max pooled connections. Keep small; Supabase pooler multiplexes. */
  max?: number;
}

/**
 * Server-only. Connects as the `postgres` role, which bypasses RLS — so this
 * must never be instantiated outside apps/api or migration tooling.
 */
export function createDb({ url, max = 10 }: CreateDbOptions) {
  const client = postgres(url, {
    max,
    // Supabase's transaction pooler (Supavisor) does not support prepared statements.
    prepare: false,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  const db = drizzle(client, { schema });
  return Object.assign(db, {
    /** Close the underlying pool. Call on shutdown. */
    close: () => client.end(),
  });
}

export type Db = ReturnType<typeof createDb>;
