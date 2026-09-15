import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function SignInScreen() {
  return (
    <PlaceholderScreen
      title="Sign In"
      figma="1:164310"
      notes="Email + password. States: empty, filled, wrong credentials, locked (15 min)."
      actions={[
        { label: 'Forgot password?', href: '/(auth)/forgot-password' },
        { label: 'Team member invite (dev)', href: '/team-invite/welcome' },
      ]}
    />
  );
}
