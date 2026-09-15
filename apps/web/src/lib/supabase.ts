'use client';

import { createPublicClient, type DittoSupabaseClient } from '@ditto/supabase';
import { publicEnv } from './env';

let client: DittoSupabaseClient | null = null;

export function getSupabase(): DittoSupabaseClient {
  if (!client) {
    client = createPublicClient({ url: publicEnv.supabaseUrl, key: publicEnv.supabaseAnonKey });
  }
  return client;
}
