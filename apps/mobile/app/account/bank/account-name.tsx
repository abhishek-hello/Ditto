import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function AccountBankAccountNameScreen() {
  return (
    <PlaceholderScreen
      title="Enter Account Name"
      stage="Change bank account — 3 of 5"
      figma="145:1869"
      actions={[{ label: 'Continue', href: '/account/bank/review' }]}
    />
  );
}
