import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

export type { Database } from './database.types';
export type DittoSupabaseClient = SupabaseClient<Database>;

export interface SupabaseClientOptions {
  url: string;
  key: string;
}

/**
 * Browser / mobile client. Uses the anon key; RLS enforces access.
 * Callers pass their own storage adapter (SecureStore on mobile, cookies on web)
 * via `auth` options if they need session persistence.
 */
export function createPublicClient(
  { url, key }: SupabaseClientOptions,
  auth?: Parameters<typeof createClient<Database>>[2],
): DittoSupabaseClient {
  return createClient<Database>(url, key, auth);
}

/**
 * Server-only client using the service-role key. Bypasses RLS.
 * Only ever instantiate inside apps/api. Never import from a client bundle.
 */
export function createServiceClient({ url, key }: SupabaseClientOptions): DittoSupabaseClient {
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
