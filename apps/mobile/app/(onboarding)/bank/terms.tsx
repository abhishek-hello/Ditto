import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { FooterBar } from '@/components/FooterBar';
import { ProgressSegments } from '@/components/ProgressSegments';
import { ScreenHeading } from '@/components/ScreenHeading';
import { StageHeader } from '@/components/StageHeader';
import { TERMS_CLAUSES, TERMS_EFFECTIVE, TERMS_READING_TIME, TERMS_VERSION } from '@/lib/terms';
import { useTheme } from '@/theme';

/**
 * Counted as read at 96% rather than 100%: rounding and the bounce at the end of
 * an iOS scroll mean the last few percent are not reliably reachable.
 */
const READ_THRESHOLD = 96;

/**
 * Stage 4, step 4: the terms, which cannot be accepted until they have been
 * scrolled. The bar under the heading tracks how far through the reader is.
 */
export default function TermsScreen() {
  const { colors, spacing, text } = useTheme();
  const router = useRouter();
  const [percentRead, setPercentRead] = useState(0);
  const read = percentRead >= READ_THRESHOLD;

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollable = contentSize.height - layoutMeasurement.height;
    // Content shorter than the viewport is read the moment it is shown.
    const percent =
      scrollable > 0 ? Math.min(100, Math.round((contentOffset.y / scrollable) * 100)) : 100;
    setPercentRead((previous) => Math.max(previous, percent));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ paddingHorizontal: spacing.gutter }}>
        <StageHeader label="Stage 4 of 4 · Bank verification — step 4 of 11" />
        <View style={{ marginTop: spacing.mdLg, gap: spacing.mdLg }}>
          <ScreenHeading title="Review Terms & Conditions" highlight="& Conditions" size="sm" />
          <View style={styles.metaRow}>
            <Text style={[text.caption, { color: colors.textMuted }]}>{TERMS_READING_TIME}</Text>
            <Text style={[text.link, { color: colors.link }]}>View on web ↗</Text>
          </View>
          <ProgressSegments fills={[percentRead / 100]} compact />
        </View>
      </View>

      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={64}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.gutter,
          paddingTop: spacing.lg,
          paddingBottom: spacing.xl,
        }}
      >
        {TERMS_CLAUSES.map((clause) => (
          <View key={clause.heading} style={{ marginBottom: spacing.xlXxl }}>
            <Text style={[text.h5, { color: colors.textPrimary, marginBottom: spacing.sm }]}>
              {clause.heading}
            </Text>
            <Text style={[text.body, { color: colors.textSecondary }]}>{clause.body}</Text>
          </View>
        ))}

        <View style={{ height: 1, backgroundColor: colors.border, marginBottom: spacing.lgXl }} />
        <Text style={[text.caption, { color: colors.textMuted }]}>
          Version {TERMS_VERSION} — effective {TERMS_EFFECTIVE}. This version number is recorded
          against your account the moment you accept.
        </Text>
      </ScrollView>

      <FooterBar>
        <View style={[styles.statusRow, { gap: spacing.mdLg }]}>
          <Checkbox checked={read} />
          <Text style={[text.caption, { color: colors.textMuted }]}>
            {read
              ? `Accepted · v${TERMS_VERSION} — saved to Notifications`
              : `Scroll to the end to accept — ${percentRead}% read`}
          </Text>
        </View>
        <Button
          label="Continue"
          disabled={!read}
          onPress={() => router.push('/(onboarding)/bank/fees')}
        />
      </FooterBar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
});
