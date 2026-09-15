import { Stack } from 'expo-router';

export default function PaymentLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen name="[id]" options={{ title: 'Payment' }} />
      <Stack.Screen name="scan-to-pay/[id]" options={{ title: 'Scan to pay' }} />
      <Stack.Screen name="confirmation/[id]" options={{ title: 'Payment received' }} />
    </Stack>
  );
}
