import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function AccountInformationIndexScreen() {
  return (
    <PlaceholderScreen
      title="My Account Information"
      figma="145:28,145:4033,168:522"
      notes="Date of birth is verified and not viewable. Every change goes through re-authentication first."
      actions={[
        { label: 'Change Name', href: '/account/information/name' },
        { label: 'Change Email', href: '/account/information/email' },
        { label: 'Change Mobile', href: '/account/information/mobile' },
        { label: 'Change Home Address', href: '/account/information/address' },
      ]}
    />
  );
}
