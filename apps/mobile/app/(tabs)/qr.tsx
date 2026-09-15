import { formatPence, pence } from '@ditto/core';
import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function QrScreen() {
  return (
    <PlaceholderScreen
      title="Take Payment QR"
      figma="1:177306"
      notes={`Keypad, VAT, Tip, Add note, Favourite (${formatPence(pence(25000))}), Repeat last, Clear; "Are you sure?" confirm sheet.`}
      actions={[{ label: 'Confirm → Scan to pay (demo)', href: '/payment/scan-to-pay/demo' }]}
    />
  );
}
