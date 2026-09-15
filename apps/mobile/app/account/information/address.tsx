import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function AccountInformationAddressScreen() {
  return (
    <PlaceholderScreen
      title="Change Home Address"
      figma="1:171645"
      notes="Pre-filled form, Save Changes. Shared address form."
      actions={[
        {
          label: 'Re-authenticate first',
          href: '/account/reauth?next=/account/information/address',
        },
      ]}
    />
  );
}
