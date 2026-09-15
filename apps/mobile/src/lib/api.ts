import { createApiClient } from '@ditto/api-client';
import { publicEnv } from './env';
import { supabase } from './supabase';

export const api = createApiClient({
  baseUrl: publicEnv.apiUrl,
  getAccessToken: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  },
});
