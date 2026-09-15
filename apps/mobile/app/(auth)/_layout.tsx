import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ title: 'Sign In' }} />
      <Stack.Screen name="forgot-password/index" options={{ title: 'Reset password' }} />
      <Stack.Screen name="forgot-password/code" options={{ title: 'Reset password' }} />
      <Stack.Screen name="forgot-password/new-password" options={{ title: 'Reset password' }} />
    </Stack>
  );
}
