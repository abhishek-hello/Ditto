import { useLocalSearchParams } from 'expo-router';
import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function PaymentIdScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <PlaceholderScreen
      title="Payment Detail"
      figma="63:1988"
      notes="Share Receipt (disabled until received)."
      subtitle={`id: ${id}`}
      actions={[{ label: 'Back to Transaction Logs', href: '/(tabs)/payments' }]}
    />
  );
}
