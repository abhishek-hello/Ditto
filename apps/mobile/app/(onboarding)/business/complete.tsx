import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function BusinessCompleteScreen() {
  return (
    <PlaceholderScreen
      title="Fantastic!"
      stage="Business details — complete"
      figma="40:270"
      notes={
        'Business Details Success → Connect Bank Account. (Step 3 "Your home address" is shared with stage 1 step 7.)'
      }
      actions={[{ label: 'Connect Bank Account', href: '/(onboarding)/bank/link' }]}
    />
  );
}
