import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function PaymentsScreen() {
  return (
    <PlaceholderScreen
      title="Transaction Logs"
      figma="1:168352"
      notes="List, Paid / Unpaid, date range filter (From / To)."
      actions={[{ label: 'Open a payment (demo)', href: '/payment/demo' }]}
    />
  );
}
