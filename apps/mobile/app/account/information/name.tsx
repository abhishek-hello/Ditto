import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function AccountInformationNameScreen() {
  return (
    <PlaceholderScreen
      title="Change Name"
      figma="1:173815"
      notes="Submits a re-verification request."
      actions={[
        { label: 'Re-authenticate first', href: '/account/reauth?next=/account/information/name' },
      ]}
    />
  );
}
