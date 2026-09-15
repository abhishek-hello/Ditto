import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function AccountBankAccountNumberScreen() {
  return (
    <PlaceholderScreen
      title="Enter Account Number"
      stage="Change bank account — 2 of 5"
      figma="1:172654"
      actions={[{ label: 'Continue', href: '/account/bank/account-name' }]}
    />
  );
}
