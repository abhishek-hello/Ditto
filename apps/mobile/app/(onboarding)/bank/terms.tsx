import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function BankTermsScreen() {
  return (
    <PlaceholderScreen
      title="Review Terms & Conditions"
      stage="Bank verification — step 4 of 11"
      figma="1:167327"
      notes="10 numbered sections, scroll-gated accept, version 2.1."
      actions={[{ label: 'Accept', href: '/(onboarding)/bank/fees' }]}
    />
  );
}
