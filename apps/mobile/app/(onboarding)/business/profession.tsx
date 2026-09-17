import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { FooterBar } from '@/components/FooterBar';
import { FormScreen } from '@/components/FormScreen';
import { ScreenHeading } from '@/components/ScreenHeading';
import { StageHeader } from '@/components/StageHeader';
import { TextField } from '@/components/TextField';
import { TRADES } from '@/lib/trades';
import { useTheme } from '@/theme';

/** The handoff caps the rendered list here; the search narrows it anyway. */
const MAX_RESULTS = 40;

/** Stage 3, step 1: the trade category, searched or typed. */
export default function ProfessionScreen() {
  const { border, colors, radius, spacing, text } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [trade, setTrade] = useState('');

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return TRADES.filter((candidate) => candidate.toLowerCase().includes(needle)).slice(
      0,
      MAX_RESULTS,
    );
  }, [query]);

  return (
    <FormScreen
      header={
        <>
          <StageHeader
            fills={[1, 1, 0.33, 0]}
            label="Stage 3 of 4 · Business details — step 1 of 3"
          />
          <View style={{ marginTop: spacing.xl }}>
            <ScreenHeading
              title="Please tell us what you do"
              highlight="what you do"
              subtitle="Select the category that matches your business best."
            />
            <TextField
              value={query}
              onChangeText={setQuery}
              placeholder="Search or type your trade"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Search trades"
              containerStyle={{ marginTop: spacing.xlXxl }}
            />
          </View>
        </>
      }
      gap={spacing.md}
      footer={
        <FooterBar>
          <Button
            label="Continue"
            disabled={trade === ''}
            onPress={() => router.push('/(onboarding)/business/trading-name')}
          />
        </FooterBar>
      }
    >
      {matches.map((candidate) => {
        const selected = candidate === trade;
        return (
          <Pressable
            key={candidate}
            onPress={() => setTrade(candidate)}
            accessibilityRole="radio"
            aria-checked={selected}
            style={({ pressed }) => [
              styles.row,
              {
                gap: spacing.mdLg,
                paddingVertical: spacing.xl - (selected ? border.strong : border.hairline),
                paddingHorizontal: spacing.xl,
                borderRadius: radius.lg,
                borderWidth: selected ? border.strong : border.hairline,
                borderColor: selected ? colors.primary : colors.border,
                backgroundColor: selected ? colors.primarySoft : colors.surface,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={[text.buttonXs, styles.label, { color: colors.textPrimary }]}>
              {candidate}
            </Text>
            {selected ? <Text style={[text.value, { color: colors.primary }]}>✓</Text> : null}
          </Pressable>
        );
      })}

      {matches.length === 0 ? (
        <Text style={[text.bodySm, { color: colors.textMuted, margin: spacing.mdLg }]}>
          No match. Keep typing and we'll add "{query.trim()}" as a custom trade.
        </Text>
      ) : null}
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  label: { flex: 1 },
});
