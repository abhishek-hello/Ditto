import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { type LayoutChangeEvent, Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';

const ENTER_MS = 240;
const EXIT_MS = 180;

export interface BottomSheetProps {
  visible: boolean;
  /** Called by the scrim, by Android back, and by any child that dismisses. */
  onClose: () => void;
  /** Name announced for the sheet as a whole. */
  accessibilityLabel?: string;
  children: ReactNode;
}

/**
 * Bottom sheet: scrim, grabber, rounded top corners. Geometry comes from the
 * theme (handoff: 26pt top corners, 24 gutter, 14 top / 38 bottom padding,
 * content gap 14, grabber 44x5).
 *
 * Children are stacked with `spacing.lgXl`; the sheet supplies its own padding
 * and safe-area inset. Dismissal is scrim tap, Android back, or a child calling
 * `onClose`. Drag-to-dismiss is not wired: it needs a `GestureHandlerRootView`
 * at the root layout, which is a change wider than the screen that added this.
 */
export function BottomSheet({ visible, onClose, accessibilityLabel, children }: BottomSheetProps) {
  const { colors, radius, shadow, size, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  /** Stays mounted through the closing animation, then unmounts. */
  const [mounted, setMounted] = useState(visible);
  const progress = useSharedValue(0);
  const travel = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      // A reopen already knows its height; a first open waits for onLayout.
      if (travel.value > 0) {
        progress.value = withTiming(1, { duration: ENTER_MS, easing: Easing.out(Easing.cubic) });
      }
      return;
    }
    progress.value = withTiming(
      0,
      { duration: EXIT_MS, easing: Easing.in(Easing.cubic) },
      (finished) => {
        'worklet';
        if (finished) runOnJS(setMounted)(false);
      },
    );
  }, [visible, progress, travel]);

  /** First layout tells us how far the sheet has to travel. */
  const onSheetLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      if (height <= 0 || travel.value > 0) return;
      travel.value = height;
      progress.value = withTiming(1, { duration: ENTER_MS, easing: Easing.out(Easing.cubic) });
    },
    [progress, travel],
  );

  const scrimStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const sheetStyle = useAnimatedStyle(() => ({
    // Hidden until the first layout, so it never flashes in place.
    opacity: travel.value > 0 ? 1 : 0,
    transform: [{ translateY: (1 - progress.value) * travel.value }],
  }));

  if (!mounted) return null;

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.root}>
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }, scrimStyle]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={onClose}
          />
        </Animated.View>

        <Animated.View
          onLayout={onSheetLayout}
          accessibilityViewIsModal
          accessibilityLabel={accessibilityLabel}
          style={[
            styles.sheet,
            shadow.sheet,
            {
              shadowColor: colors.ambientShadow,
              backgroundColor: colors.surfaceRaised,
              borderTopLeftRadius: radius.sheet,
              borderTopRightRadius: radius.sheet,
              paddingTop: spacing.lgXl,
              paddingHorizontal: spacing.gutter,
              paddingBottom: insets.bottom + spacing.xxl,
              gap: spacing.lgXl,
            },
            sheetStyle,
          ]}
        >
          <View
            style={[
              styles.grabber,
              {
                width: size.sheetHandle.width,
                height: size.sheetHandle.height,
                borderRadius: radius.pill,
                backgroundColor: colors.handle,
                marginBottom: spacing.mdLg,
              },
            ]}
          />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  sheet: { width: '100%' },
  grabber: { alignSelf: 'center' },
});
