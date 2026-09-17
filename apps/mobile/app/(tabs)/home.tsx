import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function HomeScreen() {
  return (
    <PlaceholderScreen
      title="Home"
      figma="16:894,145:841,162:28,168:522"
      notes={
        'Merchant dashboard: payments received last 7 days, Create Payment, Add Rewards Customer, Enable Automated Rewards, outstanding payments, team income, team members, rewards customers. Team member variant (1:174703): "[MERCHANT] · you work here".'
      }
      actions={[
        { label: 'Create Payment', href: '/(tabs)/qr' },
        { label: 'Add Rewards Customer', href: '/rewards/add-customer' },
        { label: 'Enable Automated Rewards', href: '/rewards' },
        { label: 'Team members', href: '/account/team' },
      ]}
    />
  );
}
