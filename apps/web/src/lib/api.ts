'use client';

import { type ApiClient, createApiClient } from '@ditto/api-client';
import { publicEnv } from './env';
import { getSupabase } from './supabase';

let client: ApiClient | null = null;

export function getApi(): ApiClient {
  if (!client) {
    client = createApiClient({
      baseUrl: publicEnv.apiUrl,
      getAccessToken: async () => {
        const { data } = await getSupabase().auth.getSession();
        return data.session?.access_token ?? null;
      },
    });
  }
  return client;
}
