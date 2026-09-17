import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function BankFeesScreen() {
  return (
    <PlaceholderScreen
      title="Please authorise your fees"
      stage="Bank verification — step 5 of 11"
      figma="56:5"
      notes="Variable Direct Debit mandate, discount code, VAT; Direct Debit Guarantee sheet; Authorise & Confirm."
      actions={[{ label: 'Authorise & Confirm', href: '/(onboarding)/bank/rewards-setup' }]}
    />
  );
}
