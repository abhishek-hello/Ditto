import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function BankLinkScreen() {
  return (
    <PlaceholderScreen
      title="Link your bank account"
      stage="Bank verification — step 1 of 11"
      figma="40:310"
      notes="Sort code, account number, account holder name (ukSortCode / ukAccountNumber from @ditto/core)."
      actions={[{ label: 'Link account', href: '/(onboarding)/bank/result' }]}
    />
  );
}
