import { Stack, useRouter, useSegments } from 'expo-router';
import { StageHeader } from '@/components/StageHeader';

interface StageConfig {
  stage: number;
  label: string;
  stepCount?: number;
  /** Route name → 1-based step. Each screen adds its entry once its frame confirms it. */
  steps?: Record<string, number>;
}

const STAGES: Record<string, StageConfig> = {
  'create-account': {
    stage: 1,
    label: 'Account creation',
    stepCount: 10,
    steps: { 'merchant-type': 1 },
  },
  identity: { stage: 2, label: 'Identity verification' },
  business: { stage: 3, label: 'Business details' },
  bank: { stage: 4, label: 'Bank verification' },
};

/** Onboarding stages 1–4. The stage header is derived from the current sub-folder and route. */
export default function OnboardingLayout() {
  const router = useRouter();
  // Typed as string[] so this compiles with and without the generated route types
  // (CI has none, so useSegments() falls back to a one-element tuple there).
  const segments: string[] = useSegments();
  const current = STAGES[segments[1] ?? ''];
  const step = current?.steps?.[segments[2] ?? ''];

  // A deep link straight into a step has no history; the index route decides where to go.
  const onBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <>
      {current ? (
        <StageHeader
          stage={current.stage}
          label={current.label}
          step={step}
          stepCount={step === undefined ? undefined : current.stepCount}
          onBack={onBack}
        />
      ) : null}
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
