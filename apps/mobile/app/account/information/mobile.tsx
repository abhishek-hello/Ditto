import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function AccountInformationMobileScreen() {
  return (
    <PlaceholderScreen
      title="Change Mobile"
      figma="145:841"
      notes="New mobile → code by SMS."
      actions={[
        {
          label: 'Re-authenticate first',
          href: '/account/reauth?next=/account/information/mobile',
        },
      ]}
    />
  );
}
