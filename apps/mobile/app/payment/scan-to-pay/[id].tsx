import { useLocalSearchParams } from 'expo-router';
import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function PaymentScanToPayIdScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <PlaceholderScreen
      title="Scan to pay"
      figma="1:160237, 1:163100"
      notes={
        'QR display, amount, trading name, Share link to pay, Cancel payment; expiring, expired ("Create a new code").'
      }
      subtitle={`id: ${id}`}
      actions={[
        { label: 'Payment received (demo)', href: '/payment/confirmation/demo' },
        { label: 'Cancel payment', href: '/(tabs)/qr' },
      ]}
    />
  );
}
