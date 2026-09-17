import { useLocalSearchParams } from 'expo-router';
import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function PaymentConfirmationIdScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <PlaceholderScreen
      title="Payment Confirmation"
      figma="63:1988"
      notes="Received, share receipt, Done."
      subtitle={`id: ${id}`}
      actions={[
        { label: 'View payment', href: '/payment/demo' },
        { label: 'Done', href: '/(tabs)/home' },
      ]}
    />
  );
}
