import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function BusinessTradingNameScreen() {
  return (
    <PlaceholderScreen
      title="Your trading name"
      stage="Business details — step 2 of 3"
      figma="1:165949"
      notes={'Optional, live "how this looks to a paying customer" preview.'}
      actions={[{ label: 'Continue', href: '/(onboarding)/business/complete' }]}
    />
  );
}
