import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Appearance, Platform } from 'react-native';
import { SessionProvider, useSession } from '@/components/SessionProvider';
import { publicEnv } from '@/lib/env';
import { PINNED_SCHEME } from '@/theme';
import { fontAssets } from '@/theme/typography';

// Status bar, keyboard and system alerts follow the pinned scheme too;
// 'unspecified' hands control back to the OS. react-native-web has no
// setColorScheme, and useTheme() already covers web.
if (Platform.OS !== 'web') Appearance.setColorScheme(PINNED_SCHEME ?? 'unspecified');

export default function RootLayout() {
  // Every type style names a Clash Grotesk face explicitly, so rendering before
  // the faces land shows the system font at the wrong metrics. The native splash
  // stays up instead; `error` is ignored on purpose — a missing font file should
  // degrade to the system font, not strand the user on a blank screen.
  const [loaded, error] = useFonts(fontAssets);
  if (!loaded && !error) return null;

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
