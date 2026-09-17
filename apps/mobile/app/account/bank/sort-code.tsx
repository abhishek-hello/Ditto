import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function AccountBankSortCodeScreen() {
  return (
    <PlaceholderScreen
      title="Enter Sort Code"
      stage="Change bank account — 1 of 5"
      figma="145:1869"
      notes={'Re-auth precedes this step. Shows "A bank change is in progress" notice on re-entry.'}
      actions={[{ label: 'Continue', href: '/account/bank/account-number' }]}
    />
  );
}
