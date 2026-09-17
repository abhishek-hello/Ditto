import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function TeamInviteVerifyMobileScreen() {
  return (
    <PlaceholderScreen
      title="Please Verify Your Mobile Number"
      stage="Team member onboarding — 2 of 6"
      figma="145:3519"
      notes={'Recovery: "Invited by", Message merchant. Shared OTP component.'}
      actions={[{ label: 'Continue', href: '/team-invite/details' }]}
    />
  );
}
