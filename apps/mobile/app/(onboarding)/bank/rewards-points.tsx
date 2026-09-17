import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { FooterBar } from '@/components/FooterBar';
import { FormScreen } from '@/components/FormScreen';
import { Overline } from '@/components/Overline';
import { Panel } from '@/components/Panel';
import { ScreenHeading } from '@/components/ScreenHeading';
import { StageHeader } from '@/components/StageHeader';
import { TextField } from '@/components/TextField';
import { useTheme } from '@/theme';

const NAME_MAX_LENGTH = 48;
/** Width of the "£1 spent = [ n ] points" inline field. */
const INLINE_FIELD_WIDTH = 74;

const digitsOnly = (value: string, max: number) => value.replace(/\D/g, '').slice(0, max);

/**
 * Stage 4: a points programme — how fast points accrue, what they unlock, and
 * the per-transaction cap that stops one big sale filling a card.
 */
export default function RewardsPointsScreen() {
  const { colors, spacing, text } = useTheme();
  const router = useRouter();
  const [perPound, setPerPound] = useState('1');
  const [rewardName, setRewardName] = useState('');
  const [pointsNeeded, setPointsNeeded] = useState('');
  const [maxPerTransaction, setMaxPerTransaction] = useState('50');

  const rate = Number(perPound);
  const target = Number(pointsNeeded);
  const complete = rate > 0 && target > 0;
  const belowMinimum = pointsNeeded !== '' && target < 1;

  const summary = complete
    ? `Customers earn ${rate} point${rate === 1 ? '' : 's'} per £1 spent and unlock "${
        rewardName.trim() || 'your reward'
      }" at ${target} points — about £${Math.ceil(target / rate)} of spend. Capped at ${
        maxPerTransaction || '∞'
      } points per transaction.`
    : 'Fill in points per £1 and points needed above to see how this reads to your customers.';

  return (
    <FormScreen
      header={
        <>
          <StageHeader label="Stage 4 of 4 · Bank verification — step 3 of 11" />
          <View style={{ marginTop: spacing.mdLg }}>
            <ScreenHeading title="Set up points" highlight="points" />
          </View>
        </>
      }
      footer={
        <FooterBar>
          <Button
            label="Continue"
            disabled={!complete}
            onPress={() => router.push('/(onboarding)/bank/terms')}
          />
        </FooterBar>
      }
    >
      <Overline>Points accrual</Overline>
      <View style={[styles.row, { gap: spacing.lgXl, marginTop: spacing.mdLg }]}>
        <Text style={[text.input, { color: colors.textPrimary }]}>£1 spent =</Text>
        <TextField
          value={perPound}
          onChangeText={(next) => setPerPound(digitsOnly(next, 3))}
          keyboardType="number-pad"
          accessibilityLabel="Points earned per pound"
          containerStyle={{ width: INLINE_FIELD_WIDTH }}
        />
        <Text style={[text.input, { color: colors.textPrimary }]}>points</Text>
      </View>

      <Overline style={{ marginTop: spacing.xxlXxxl, marginBottom: spacing.mdLg }}>
        Set reward
      </Overline>
      <TextField
        label="Reward name (optional — leave blank if none)"
        value={rewardName}
        onChangeText={(next) => setRewardName(next.slice(0, NAME_MAX_LENGTH))}
        placeholder="Free coffee"
        maxLength={NAME_MAX_LENGTH}
        helper={`${NAME_MAX_LENGTH - rewardName.length} characters left`}
      />

      <TextField
        label="Points required to unlock"
        value={pointsNeeded}
        onChangeText={(next) => setPointsNeeded(digitsOnly(next, 5))}
        placeholder="10"
        keyboardType="number-pad"
        error={belowMinimum ? 'Enter at least 1 point.' : undefined}
        tinted={belowMinimum}
        containerStyle={{ marginTop: spacing.xlXxl }}
      />

      <Overline style={{ marginTop: spacing.xlXxl, marginBottom: spacing.mdLg }}>
        Maximum points per transaction
      </Overline>
      <TextField
        value={maxPerTransaction}
        onChangeText={(next) => setMaxPerTransaction(digitsOnly(next, 5))}
        keyboardType="number-pad"
        accessibilityLabel="Maximum points per transaction"
        helper="Stops one large transaction unlocking a reward instantly."
      />

      <Overline style={{ marginTop: spacing.xxl, marginBottom: spacing.mdLg }}>Summary</Overline>
      <Panel>{summary}</Panel>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
