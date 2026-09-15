import { Stack } from 'expo-router';

/** Account settings sub-screens. The Account menu itself is the (tabs)/account tab. */
export default function AccountLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen name="reauth" options={{ title: 'Confirm it’s you', presentation: 'modal' }} />
    </Stack>
  );
}
