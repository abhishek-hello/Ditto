import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function BusinessProfessionScreen() {
  return (
    <PlaceholderScreen
      title="Please tell us what you do"
      stage="Business details — step 1 of 3"
      figma="1:165847"
      notes="Profession category → sub-profession accordion, live search."
      actions={[{ label: 'Continue', href: '/(onboarding)/business/trading-name' }]}
    />
  );
}
