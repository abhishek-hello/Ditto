import { resolve } from 'node:path';
import { config as loadDotenv } from 'dotenv';
import type { ExpoConfig } from 'expo/config';

// Every app reads the single ROOT .env (see ENVIRONMENTS.md).
loadDotenv({ path: resolve(__dirname, '../../.env'), quiet: true });

const config: ExpoConfig = {
  name: 'Ditto Pay',
  slug: 'ditto-pay',
  scheme: 'dittopay',
  version: '0.0.1',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  ios: {
    bundleIdentifier: 'com.dittopay.app',
    supportsTablet: false,
  },
  android: {
    package: 'com.dittopay.app',
  },
  web: {
    bundler: 'metro',
    output: 'static',
  },
  // EAS Update is off until we have a channel strategy; flip on and add expo-updates.
  updates: { enabled: false },
  plugins: ['expo-router', 'expo-secure-store'],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
