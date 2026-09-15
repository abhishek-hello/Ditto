import { resolve } from 'node:path';
import { config as loadDotenv } from 'dotenv';
import type { NextConfig } from 'next';

// Every app reads the single ROOT .env (see ENVIRONMENTS.md).
loadDotenv({ path: resolve(process.cwd(), '../../.env'), quiet: true });

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Shared packages ship TypeScript source, not compiled JS.
  transpilePackages: ['@ditto/core', '@ditto/supabase', '@ditto/api-client'],
  typedRoutes: true,
};

export default nextConfig;
