import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { FooterBar } from '@/components/FooterBar';
import { FormScreen } from '@/components/FormScreen';
import { OptionCard } from '@/components/OptionCard';
import { Panel } from '@/components/Panel';
import { ScreenHeading } from '@/components/ScreenHeading';
import { StageHeader } from '@/components/StageHeader';
import { useTheme } from '@/theme';

type RewardKind = 'points' | 'visits' | 'skip';

const NOTES: Record<RewardKind, string> = {
  points:
    'Points suit repeat spend of different sizes — customers collect as they pay, and you decide what a full card is worth.',
  visits:
    "Visits suit a fixed service — one stamp per visit, capped so a single day can't fill the card.",
  skip: 'Skipping turns rewards off. No programme is created and no defaults are switched on. Set one up any time from Account → My Rewards Programme.',
};

/** Stage 4, step 3: pick a rewards programme, or none. */
export default function RewardsSetupScreen() {
  const { colors, spacing, text } = useTheme();
  const router = useRouter();
  const [kind, setKind] = useState<RewardKind>('skip');

  const onContinue = () => {
    if (kind === 'points') router.push('/(onboarding)/bank/rewards-points');
    else if (kind === 'visits') router.push('/(onboarding)/bank/rewards-visits');
    else router.push('/(onboarding)/bank/terms');
  };

  return (
    <FormScreen
      header={
        <>
          <StageHeader
            fills={[1, 1, 1, 0.27]}
            label="Stage 4 of 4 · Bank verification — step 3 of 11"
          />
          <View style={{ marginTop: spacing.lgXl, gap: spacing.sm }}>
            <ScreenHeading
              title="Automated customer rewards"
              highlight="rewards"
              size="sm"
              subtitle="Bring customers back by rewarding them automatically. Pick the type that suits you."
            />
            <Text style={[text.caption, { color: colors.textMuted }]}>
              You can make changes in Account before you add your first customer. Cancel any time.
            </Text>
          </View>
        </>
      }
      gap={spacing.lg}
      footer={
        <FooterBar>
          <Button
            label={kind === 'skip' ? 'Continue without rewards' : `Set up ${kind}`}
            onPress={onContinue}
          />
        </FooterBar>
      }
    >
      <View accessibilityRole="radiogroup" style={{ gap: spacing.lg }}>
        <OptionCard
          icon="★"
          title="Points"
          description="Customers earn points for every pound spent."
          example="Eg. 10 points = 1 free coffee"
          showRadio
          selected={kind === 'points'}
          onPress={() => setKind('points')}
        />
        <OptionCard
          icon="↻"
          title="Visits"
          description="Customers earn a reward after a set number of visits."
          example="Eg. 10 visits = free hair cut"
          showRadio
          selected={kind === 'visits'}
          onPress={() => setKind('visits')}
        />
        <OptionCard
          icon="–"
          iconMuted
          title="Skip for now"
          description="Turn rewards off. Set one up later from Account."
          example="No programme created"
          showRadio
          selected={kind === 'skip'}
          onPress={() => setKind('skip')}
        />
      </View>

      <Panel>{NOTES[kind]}</Panel>
    </FormScreen>
  );
}
