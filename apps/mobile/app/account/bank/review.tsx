import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function AccountBankReviewScreen() {
  return (
    <PlaceholderScreen
      title="Review & Confirm"
      stage="Change bank account — 4 of 5"
      figma="145:1869"
      actions={[{ label: 'Confirm', href: '/account/bank/verify-mobile' }]}
    />
  );
}
