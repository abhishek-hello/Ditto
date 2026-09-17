/**
 * The merchant terms shown at onboarding. Inlined because the version number is
 * recorded against the account the moment it is accepted, so the text the user
 * saw has to ship with the build that recorded it — fetching it would mean the
 * stored version could describe words nobody read.
 *
 * TODO: serve this from the API alongside the version, once there is an
 * endpoint that can return both atomically.
 */
export const TERMS_VERSION = '2.1';
export const TERMS_EFFECTIVE = '1 August 2026';
export const TERMS_READING_TIME = 'About a 3-minute read · 2,150 words';

export const TERMS_CLAUSES = [
  {
    heading: '1. Your agreement with DittoPay',
    body: 'By continuing you enter into an agreement with DittoPay Ltd to provide payment processing services to your business. This agreement sits alongside, and does not replace, your agreement with the bank account you have linked.',
  },
  {
    heading: '2. Fees and charges',
    body: "DittoPay charges a per-transaction processing fee and a recurring service fee, both shown to you before you authorise them. Fees may change with 30 days' notice, and any change is shown to you in the app before it takes effect.",
  },
  {
    heading: '3. Settlement of funds',
    body: "Payments taken through DittoPay are settled to your linked bank account on the schedule shown in your Account settings. Settlement times can vary with your bank's own processing.",
  },
  {
    heading: '4. Your responsibilities',
    body: 'You agree to use DittoPay only for genuine goods and services you provide, to keep your account details accurate, and to tell us promptly if you suspect your account has been accessed without your permission.',
  },
  {
    heading: '5. Refunds and disputes',
    body: 'You can refund a payment to a customer from within the app. If a customer disputes a payment with their bank, DittoPay may place a temporary hold on the disputed amount while the dispute is resolved.',
  },
  {
    heading: '6. Customer rewards programmes',
    body: 'If you turn on a rewards programme, its terms are between you and your customers. DittoPay provides the tools to run it and is not a party to the reward itself.',
  },
  {
    heading: '7. Suspending or closing your account',
    body: 'DittoPay may suspend your account if we reasonably suspect fraud, misuse, or a breach of these terms. You can close your account at any time from Account settings; any funds owed to you are still settled.',
  },
  {
    heading: '8. Changes to these terms',
    body: "We may update these terms from time to time. Where a change is material, we'll ask you to review and accept it again before it applies to you, the same way you're doing now.",
  },
  {
    heading: '9. Data and privacy',
    body: 'DittoPay processes your business and transaction data to provide the service and meet our legal obligations. Full detail is in our separate Privacy Policy, linked from Account settings.',
  },
  {
    heading: '10. Governing law',
    body: 'These terms are governed by the law of England and Wales. Nothing here affects your statutory rights.',
  },
] as const;
