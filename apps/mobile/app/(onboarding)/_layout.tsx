import { Stack, useSegments } from 'expo-router';
import { StageHeader } from '@/components/StageHeader';

const STAGES: Record<string, { stage: number; label: string }> = {
  'create-account': { stage: 1, label: 'Account creation' },
  identity: { stage: 2, label: 'Identity verification' },
  business: { stage: 3, label: 'Business details' },
  bank: { stage: 4, label: 'Bank verification' },
};

/** Onboarding stages 1–4. The stage header is derived from the current sub-folder. */
export default function OnboardingLayout() {
  // Typed as string[] so this compiles with and without the generated route types
  // (CI has none, so useSegments() falls back to a one-element tuple there).
  const segments: string[] = useSegments();
  const current = STAGES[segments[1] ?? ''];

  return (
    <>
      {current ? <StageHeader stage={current.stage} label={current.label} /> : null}
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
