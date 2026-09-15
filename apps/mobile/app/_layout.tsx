import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SessionProvider, useSession } from '@/components/SessionProvider';
import { publicEnv } from '@/lib/env';

export default function RootLayout() {
  return (
    <SessionProvider>
      <RootStack />
      <StatusBar style="auto" />
    </SessionProvider>
  );
}

/**
 * Auth gate. Signed-out users only see the (auth) group; signed-in users only
 * see the main app. Onboarding and team-invite stay reachable from both sides
 * because a session is created part-way through account creation.
 */
function RootStack() {
  const { isSignedIn } = useSession();
  const showAuth = publicEnv.devBypassAuth || !isSignedIn;
  const showApp = publicEnv.devBypassAuth || isSignedIn;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={showAuth}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="team-invite" />
      <Stack.Protected guard={showApp}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="payment" />
        <Stack.Screen name="rewards" />
        <Stack.Screen name="account" />
      </Stack.Protected>
    </Stack>
  );
}
