import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Signs the session out and returns to the welcome screen. A route rather than
 * a button because the Account menu is still the placeholder scaffold, whose
 * actions are href-only.
 */
export default function LogoutScreen() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.signOut().finally(() => router.replace('/(auth)/welcome'));
  }, [router]);

  return null;
}
