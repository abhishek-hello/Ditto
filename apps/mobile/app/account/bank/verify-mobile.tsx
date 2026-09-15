import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function AccountBankVerifyMobileScreen() {
  return (
    <PlaceholderScreen
      title="Verify your mobile"
      stage="Change bank account — 5 of 5"
      figma="1:172654"
      notes="Shared OTP component."
      actions={[{ label: 'Continue', href: '/account/bank/result' }]}
    />
  );
}
