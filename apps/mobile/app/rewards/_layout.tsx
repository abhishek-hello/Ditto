import { Stack } from 'expo-router';

export default function RewardsLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen name="index" options={{ title: 'Rewards' }} />
      <Stack.Screen name="add-customer" options={{ title: 'Add customer' }} />
      <Stack.Screen name="change-type" options={{ title: 'Change reward type' }} />
      <Stack.Screen name="turn-off" options={{ title: 'Turn off rewards' }} />
    </Stack>
  );
}
