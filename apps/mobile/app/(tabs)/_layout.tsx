import { Tabs } from 'expo-router';
import { useTheme } from '@/theme';

/** Main app tab bar (Figma 1:176941): Home · Payments · QR · Account. TODO: icons + active pill. */
export default function TabsLayout() {
  const { colors, text } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: text.h4,
        tabBarStyle: {
          backgroundColor: colors.surfaceRaised,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.onPrimary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: text.link,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="payments" options={{ title: 'Payments' }} />
      <Tabs.Screen name="qr" options={{ title: 'QR' }} />
      <Tabs.Screen name="account" options={{ title: 'Account' }} />
    </Tabs>
  );
}
