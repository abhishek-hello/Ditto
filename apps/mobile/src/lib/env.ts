/** Public env for the app bundle. Only EXPO_PUBLIC_* is allowed here. */
export const publicEnv = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000',
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  /**
   * Dev-only: lets every route be reached without a Supabase session so the
   * screen scaffold can be clicked through. Ignored in release builds.
   */
  devBypassAuth: __DEV__ && process.env.EXPO_PUBLIC_DEV_BYPASS_AUTH === '1',
} as const;
