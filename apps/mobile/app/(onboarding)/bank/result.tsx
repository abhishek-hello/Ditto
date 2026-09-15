import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function BankResultScreen() {
  return (
    <PlaceholderScreen
      title="Bank link result"
      stage="Bank verification — steps 2–3 of 11"
      figma="1:166357, 1:166295"
      notes="Verifying / success / name mismatch / near-match manual review (reference BL-…). Options: Try a different bank account, Talk to support, Finish this later."
      actions={[
        { label: 'Continue', href: '/(onboarding)/bank/terms' },
        { label: 'Try a different bank account', href: '/(onboarding)/bank/link' },
        { label: 'Finish this later', href: '/(tabs)/home' },
      ]}
    />
  );
}
