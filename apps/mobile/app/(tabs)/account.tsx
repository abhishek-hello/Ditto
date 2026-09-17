import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function AccountScreen() {
  return (
    <PlaceholderScreen
      title="Account"
      figma="40:310,56:5,145:28,145:841,145:1869,145:4033,168:522"
      notes={
        'Sections: Merchant Account, Payment settings, Security. Team member variant shows a reduced "TEAM Account" menu (no bank, fees, team management).'
      }
      actions={[
        { label: 'My Account Information', href: '/account/information' },
        { label: 'Change Password', href: '/account/password' },
        { label: 'Manage Team Members', href: '/account/team' },
        { label: 'TIPS Summary', href: '/account/tips' },
        { label: 'My Rewards Program', href: '/rewards' },
        { label: 'Notifications', href: '/account/notifications' },
        { label: 'Documents', href: '/account/documents' },
        { label: 'Favourite Payment Settings', href: '/account/favourites' },
        { label: 'Default Note', href: '/account/default-note' },
        { label: 'QR Code Timeout', href: '/account/qr-timeout' },
        { label: 'VAT Settings', href: '/account/vat' },
        { label: 'Default TIP', href: '/account/tip' },
        { label: 'Bank Account', href: '/account/bank/sort-code' },
        { label: 'Account Fees', href: '/account/fees' },
        { label: 'Fingerprint / Face ID Login', href: '/account/biometrics' },
        { label: 'Theme', href: '/account/theme' },
        { label: 'Delete Account', href: '/account/delete' },
      ]}
    />
  );
}
