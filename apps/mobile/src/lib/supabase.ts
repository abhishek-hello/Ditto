import { createPublicClient } from '@ditto/supabase';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { publicEnv } from './env';

// Sessions live in the device keychain / keystore, never AsyncStorage.
const secureStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createPublicClient(
  { url: publicEnv.supabaseUrl, key: publicEnv.supabaseAnonKey },
  {
    auth: {
      ...(Platform.OS !== 'web' ? { storage: secureStorage } : {}),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
