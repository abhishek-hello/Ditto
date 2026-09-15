import { Redirect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSession } from '@/components/SessionProvider';
import { api } from '@/lib/api';

type Bootstrap = 'loading' | 'ready' | 'failed';

/**
 * Splash (Figma 1:164157): fast / slow (progress bar) / failed (Retry).
 * Bootstraps the API + session, then redirects.
 * TODO: route signed-in users with an unfinished onboarding stage back into (onboarding).
 */
export default function SplashScreen() {
  const { status } = useSession();
  const [bootstrap, setBootstrap] = useState<Bootstrap>('loading');

  const bootstrapApp = useCallback(() => {
    setBootstrap('loading');
    api
      .health()
      .then(() => setBootstrap('ready'))
      .catch(() => setBootstrap('failed'));
  }, []);

  useEffect(() => {
    bootstrapApp();
  }, [bootstrapApp]);

  if (bootstrap === 'ready' && status === 'signed-in') return <Redirect href="/(tabs)/home" />;
  if (bootstrap === 'ready' && status === 'signed-out') return <Redirect href="/(auth)/welcome" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ditto Pay</Text>
      {bootstrap === 'failed' ? (
        <>
          <Text style={styles.notes}>We couldn’t reach Ditto Pay. Check your connection.</Text>
          <Pressable style={styles.button} onPress={bootstrapApp}>
            <Text style={styles.buttonText}>Retry</Text>
          </Pressable>
        </>
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  title: { fontSize: 32, fontWeight: '600' },
  notes: { fontSize: 15, color: '#4b5563', textAlign: 'center' },
  button: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
