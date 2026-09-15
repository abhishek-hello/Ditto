import { Tabs } from 'expo-router';

/** Main app tab bar (Figma 1:176941): Home · Payments · QR · Account. TODO: icons. */
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="payments" options={{ title: 'Payments' }} />
      <Tabs.Screen name="qr" options={{ title: 'QR' }} />
      <Tabs.Screen name="account" options={{ title: 'Account' }} />
    </Tabs>
  );
}
