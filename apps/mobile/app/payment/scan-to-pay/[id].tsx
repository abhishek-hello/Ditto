import { useLocalSearchParams } from 'expo-router';
import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function PaymentScanToPayIdScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <PlaceholderScreen
      title="Scan to pay"
      figma="6:7140,6:11393"
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
