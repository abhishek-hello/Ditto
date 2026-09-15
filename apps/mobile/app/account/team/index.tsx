import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function AccountTeamIndexScreen() {
  return (
    <PlaceholderScreen
      title="Manage Team Members"
      figma="1:173070"
      notes="List of members."
      actions={[
        { label: 'Invite Team Member', href: '/account/team/invite' },
        { label: 'Member detail (demo)', href: '/account/team/demo' },
      ]}
    />
  );
}
