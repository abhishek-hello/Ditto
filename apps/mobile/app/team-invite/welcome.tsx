import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function TeamInviteWelcomeScreen() {
  return (
    <PlaceholderScreen
      title={"Welcome To [Merchant]'s Team"}
      stage="Team member onboarding — 1 of 6"
      figma="1:174285"
      notes="Please Verify Your Email. Opened from the SMS invite link (48h)."
      actions={[{ label: 'Continue', href: '/team-invite/verify-mobile' }]}
    />
  );
}
