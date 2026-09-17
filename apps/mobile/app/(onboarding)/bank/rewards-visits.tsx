import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
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
const PERIODS = ['Day', 'Week', 'Month', 'Year'] as const;
type Period = (typeof PERIODS)[number];

const digitsOnly = (value: string, max: number) => value.replace(/\D/g, '').slice(0, max);

/**
 * Stage 4: a visits programme. One point per visit is fixed — the whole idea is
 * one stamp per visit — so that row is read-only, and the cap is what keeps a
 * single busy day from filling a card.
 */
export default function RewardsVisitsScreen() {
  const { border, colors, radius, size, spacing, text } = useTheme();
  const router = useRouter();
  const [visitsNeeded, setVisitsNeeded] = useState('10');
  const [rewardName, setRewardName] = useState('');
  const [cap, setCap] = useState('2');
  const [period, setPeriod] = useState<Period>('Day');

  const target = Number(visitsNeeded);
  const complete = target > 0;
  const summary = complete
    ? `Your customers will earn "${rewardName.trim() || 'your reward'}" after ${visitsNeeded} visits, capped at ${cap || '1'} per ${period.toLowerCase()}.`
    : 'Set the number of visits required to see how this reads to your customers.';

  return (
    <FormScreen
      header={
        <>
          <StageHeader label="Stage 4 of 4 · Bank verification — step 3 of 11" />
          <View style={{ marginTop: spacing.mdLg, gap: spacing.sm }}>
            <ScreenHeading
              title="Set up visits"
              highlight="visits"
              subtitle="This locks once your first rewards customer is added."
            />
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
      <Text style={[text.label, { color: colors.textMuted, marginBottom: spacing.md }]}>
        Points per visit
      </Text>
      <View
        style={[
          styles.row,
          styles.fixedRow,
          {
            height: size.input,
            paddingHorizontal: spacing.xl,
            borderRadius: radius.lg,
            borderWidth: border.hairline,
            borderColor: colors.border,
            backgroundColor: colors.surfaceMuted,
            marginBottom: spacing.xlXxl,
          },
        ]}
      >
        <Text style={[text.input, { color: colors.textMuted }]}>1 point per visit</Text>
        <Overline>Fixed</Overline>
      </View>

      <TextField
        label="Visits required to earn the reward"
        value={visitsNeeded}
        onChangeText={(next) => setVisitsNeeded(digitsOnly(next, 3))}
        keyboardType="number-pad"
        containerStyle={{ marginBottom: spacing.xlXxl }}
      />

      <TextField
        label="What is the reward? (optional, e.g. free hair cut)"
        value={rewardName}
        onChangeText={(next) => setRewardName(next.slice(0, NAME_MAX_LENGTH))}
        placeholder="Free hair cut"
        maxLength={NAME_MAX_LENGTH}
        helper={`${NAME_MAX_LENGTH - rewardName.length} characters left`}
        containerStyle={{ marginBottom: spacing.xlXxl }}
      />

      <Text style={[text.label, { color: colors.textMuted, marginBottom: spacing.md }]}>
        Maximum visits
      </Text>
      <View style={[styles.row, { gap: spacing.md, marginBottom: spacing.mdLg }]}>
        {PERIODS.map((option) => {
          const selected = option === period;
          return (
            <Pressable
              key={option}
              onPress={() => setPeriod(option)}
              accessibilityRole="radio"
              aria-checked={selected}
              style={({ pressed }) => [
                styles.period,
                {
                  height: size.buttonMd - spacing.sm,
                  borderRadius: radius.lg,
                  borderWidth: selected ? border.strong : border.hairline,
                  borderColor: selected ? colors.primary : colors.border,
                  backgroundColor: selected ? colors.primarySoft : colors.surface,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text
                style={[text.linkLg, { color: selected ? colors.primary : colors.textSecondary }]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View
        style={[
          styles.row,
          {
            gap: spacing.lg,
            height: size.input,
            paddingHorizontal: spacing.xl,
            borderRadius: radius.lg,
            borderWidth: border.hairline,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            marginBottom: spacing.xxl,
          },
        ]}
      >
        <TextInput
          value={cap}
          onChangeText={(next) => setCap(digitsOnly(next, 3))}
          keyboardType="number-pad"
          accessibilityLabel="Maximum visits"
          style={[text.value, styles.capInput, { fontSize: 17, color: colors.textPrimary }]}
        />
        <Text style={[text.bodyTight, { color: colors.textMuted }]}>
          visits per {period.toLowerCase()}
        </Text>
      </View>

      <Overline style={{ marginBottom: spacing.mdLg }}>Summary</Overline>
      <Panel>{summary}</Panel>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  fixedRow: { justifyContent: 'space-between' },
  period: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  capInput: { width: 44 },
});
