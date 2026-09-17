import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function AccountBankVerifyMobileScreen() {
  return (
    <PlaceholderScreen
      title="Verify your mobile"
      stage="Change bank account — 5 of 5"
      figma="6:9904,17:1297,145:841,145:1869"
      notes="Shared OTP component."
      actions={[{ label: 'Continue', href: '/account/bank/result' }]}
    />
  );
}
