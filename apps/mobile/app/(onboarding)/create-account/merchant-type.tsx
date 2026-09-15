import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function CreateAccountMerchantTypeScreen() {
  return (
    <PlaceholderScreen
      title="What kind of merchant are you?"
      stage="Account creation — step 1 of 10"
      figma="1:165000"
      notes="Sole Merchant / Business (coming soon)."
      actions={[{ label: 'Continue', href: '/(onboarding)/create-account/legal-name' }]}
    />
  );
}
