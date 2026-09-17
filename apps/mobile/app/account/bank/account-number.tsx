import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function AccountBankAccountNumberScreen() {
  return (
    <PlaceholderScreen
      title="Enter Account Number"
      stage="Change bank account — 2 of 5"
      figma="145:1869"
      actions={[{ label: 'Continue', href: '/account/bank/account-name' }]}
    />
  );
}
