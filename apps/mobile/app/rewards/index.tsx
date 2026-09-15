import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function RewardsIndexScreen() {
  return (
    <PlaceholderScreen
      title="Customer Rewards"
      figma="1:169470"
      notes={
        'My Rewards Program: overview (accrual, reward at, max per txn), locked once customers exist, Change reward type, Turn Off. Empty state: Enable Rewards ("You haven\'t enabled rewards yet").'
      }
      actions={[
        { label: 'Add Rewards Customer', href: '/rewards/add-customer' },
        { label: 'Change reward type', href: '/rewards/change-type' },
        { label: 'Turn Off', href: '/rewards/turn-off' },
      ]}
    />
  );
}
