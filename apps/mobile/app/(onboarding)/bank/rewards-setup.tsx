import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function BankRewardsSetupScreen() {
  return (
    <PlaceholderScreen
      title="Automated customer rewards"
      stage="Bank verification — steps 6–10 of 11"
      figma="1:166447"
      notes="Choose Points / Visits / Skip for now; programme config; summary."
      actions={[
        { label: 'Continue', href: '/(onboarding)/bank/complete' },
        { label: 'Skip for now', href: '/(onboarding)/bank/complete' },
      ]}
    />
  );
}
