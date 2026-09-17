import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { useTheme } from '@/theme';

const TOUR_URL = 'dittopay.co.uk/tour';
const TOUR_LENGTH = '1:00';
/** Poster height in the handoff. */
const POSTER_HEIGHT = 300;
/** Stand-in playback: 2% every 300ms reaches the end in about a minute. */
const TICK_MS = 300;
const TICK_PERCENT = 2;

const SHARE_TARGETS = ['WhatsApp', 'Email', 'Instagram', 'More…'];

/**
 * Stage 4, last step: a 60-second tour before the first payment.
 *
 * TODO: the poster is a placeholder with a simulated progress bar. Swap for a
 * real player (`expo-video`) once the tour is cut — the controls, the share
 * sheet and the "watch later" state are already the ones the handoff specifies.
 */
export default function TourScreen() {
  const { border, colors, radius, size, spacing, text } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [playing, setPlaying] = useState(false);
  const [percent, setPercent] = useState(0);
  const [watchLater, setWatchLater] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      setPercent((current) => {
        const next = Math.min(100, current + TICK_PERCENT);
        if (next >= 100) setPlaying(false);
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(timer.current);
  }, [playing]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + spacing.md,
          paddingHorizontal: spacing.gutter,
          paddingBottom: insets.bottom + spacing.xxl,
        },
      ]}
    >
      <View style={[styles.actions, { gap: spacing.lgXl }]}>
        <Pressable
          onPress={() => setShareOpen(true)}
          accessibilityRole="button"
          hitSlop={spacing.md}
        >
          <Text style={[text.linkLg, { color: colors.link }]}>Share ↗</Text>
        </Pressable>
        <Pressable
          onPress={() => setWatchLater((on) => !on)}
          accessibilityRole="button"
          hitSlop={spacing.md}
        >
          <Text style={[text.linkLg, { color: colors.textMuted }]}>
            {watchLater ? 'Saved ✓' : 'Watch later'}
          </Text>
        </Pressable>
      </View>

      <Text
        accessibilityRole="header"
        style={[text.h1Sm, { color: colors.textPrimary, marginTop: spacing.lgXl }]}
      >
        You're all <Text style={{ color: colors.accentText }}>set</Text>
      </Text>
      <Text style={[text.body, { color: colors.textMuted, marginTop: spacing.sm }]}>
        A quick 60-second tour before you take your first payment.
      </Text>

      <Pressable
        onPress={() => setPlaying((on) => !on)}
        accessibilityRole="button"
        accessibilityLabel={playing ? 'Pause the tour' : 'Play the tour'}
        style={[
          styles.poster,
          {
            height: POSTER_HEIGHT,
            marginTop: spacing.xlXxl,
            borderRadius: radius.xxl,
            backgroundColor: colors.surfacePlaceholder,
          },
        ]}
      >
        <View
          style={[
            styles.playButton,
            {
              width: size.playButton,
              height: size.playButton,
              borderRadius: radius.pill,
              backgroundColor: colors.surface,
              paddingLeft: playing ? 0 : 4,
            },
          ]}
        >
          <Text style={[text.h3Sm, { color: colors.textPrimary }]}>{playing ? '❚❚' : '▶'}</Text>
        </View>

        <View
          style={[
            styles.duration,
            {
              top: spacing.lgXl,
              left: spacing.lgXl,
              paddingVertical: spacing.xs + 1,
              paddingHorizontal: spacing.mdLg,
              borderRadius: radius.sm,
              backgroundColor: colors.scrim,
            },
          ]}
        >
          <Text style={[text.overline, styles.durationText, { color: colors.onInverse }]}>
            {TOUR_LENGTH}
          </Text>
        </View>

        <View style={[styles.track, { backgroundColor: colors.scrim }]}>
          <View style={[styles.fill, { width: `${percent}%`, backgroundColor: colors.primary }]} />
        </View>
      </Pressable>

      <Button
        label={watchLater ? 'Saved to Watch later' : 'Watch later'}
        variant="secondary"
        size="sm"
        onPress={() => setWatchLater((on) => !on)}
        style={{ marginTop: spacing.lgXl }}
      />

      <View style={styles.spacer} />

      <Button
        label="Take me to DittoPay"
        onPress={() => router.replace('/(onboarding)/bank/complete')}
      />

      <BottomSheet
        visible={shareOpen}
        onClose={() => setShareOpen(false)}
        accessibilityLabel="Share the demo"
      >
        <View style={{ gap: spacing.xs }}>
          <Text style={[text.h3Sm, { color: colors.textPrimary }]}>Share the demo</Text>
          <Text style={[text.bodyXs, { color: colors.textMuted }]}>
            Anyone with the link can watch — no DittoPay account needed.
          </Text>
        </View>

        <Pressable
          onPress={() => setCopied(true)}
          accessibilityRole="button"
          accessibilityLabel={`Copy ${TOUR_URL}`}
          style={[
            styles.linkRow,
            {
              gap: spacing.mdLg,
              paddingVertical: spacing.lgXl,
              paddingHorizontal: spacing.xl,
              borderRadius: radius.lg,
              borderWidth: border.hairline,
              borderColor: colors.border,
              backgroundColor: colors.surfaceSubtle,
            },
          ]}
        >
          <Text
            numberOfLines={1}
            style={[text.bodyXs, styles.linkText, { color: colors.textSecondary }]}
          >
            {TOUR_URL}
          </Text>
          <Text style={[text.bodyXs, { color: colors.link }]}>{copied ? 'Copied' : 'Copy'}</Text>
        </Pressable>

        <View style={[styles.grid, { gap: spacing.mdLg }]}>
          {SHARE_TARGETS.map((target) => (
            <View
              key={target}
              style={[
                styles.gridItem,
                {
                  paddingVertical: spacing.lgXl,
                  paddingHorizontal: spacing.xl,
                  borderRadius: radius.lg,
                  borderWidth: border.hairline,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                },
              ]}
            >
              <Text style={[text.linkLg, { color: colors.textPrimary }]}>{target}</Text>
            </View>
          ))}
        </View>

        <Button label="Copy link" size="md" onPress={() => setCopied(true)} />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  poster: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  playButton: { alignItems: 'center', justifyContent: 'center' },
  duration: { position: 'absolute' },
  durationText: { letterSpacing: 0 },
  track: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 4 },
  fill: { height: 4 },
  spacer: { flex: 1, minHeight: 24 },
  linkRow: { flexDirection: 'row', alignItems: 'center' },
  linkText: { flex: 1, minWidth: 0 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  gridItem: { flexGrow: 1, flexBasis: '45%' },
});
