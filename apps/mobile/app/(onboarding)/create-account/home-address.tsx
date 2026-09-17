import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function CreateAccountHomeAddressScreen() {
  return (
    <PlaceholderScreen
      title="Your home address"
      stage="Account creation — step 7 of 10"
      figma="16:894"
      notes={
        'Country, county, postcode, town, street, house, flat. Figma also lists this under stage 3 ("Sector 3 of 4"); placement is a product decision. Shared address form.'
      }
      actions={[{ label: 'Continue', href: '/(onboarding)/create-account/complete' }]}
    />
  );
}
