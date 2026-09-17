import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function AccountInformationNameScreen() {
  return (
    <PlaceholderScreen
      title="Change Name"
      figma="145:3085"
      notes="Submits a re-verification request."
      actions={[
        { label: 'Re-authenticate first', href: '/account/reauth?next=/account/information/name' },
      ]}
    />
  );
}
