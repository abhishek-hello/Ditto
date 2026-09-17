import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function AccountInformationEmailScreen() {
  return (
    <PlaceholderScreen
      title="Change Email"
      figma="145:841"
      notes="New email → code sent to the new address."
      actions={[
        { label: 'Re-authenticate first', href: '/account/reauth?next=/account/information/email' },
      ]}
    />
  );
}
