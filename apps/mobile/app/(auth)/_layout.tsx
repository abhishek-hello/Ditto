import { Stack } from 'expo-router';

/** Every auth screen draws its own back button and heading, as the handoff does. */
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
