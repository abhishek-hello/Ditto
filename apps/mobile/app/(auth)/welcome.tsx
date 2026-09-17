import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheet } from '@/components/BottomSheet';
import { BrandLogo } from '@/components/BrandLogo';
import { Button } from '@/components/Button';
import { useTheme } from '@/theme';

/**
 * Ditto Pay is UK-only (AGENTS.md, PRODUCT.md), so this is a constant rather
 * than a lookup. The geo check lands here when it is wired.
 */
const REGION_SUPPORTED = true;

/**
 * Welcome: logo lockup, tagline, Create Account / Sign In, and the
 * "Not available in your region yet" sheet shown to unsupported regions.
 *
 * Dev builds accept `?state=geo` to treat the region as unsupported: the sheet
 * opens on arrival and Create Account reopens it.
 */
export default function WelcomeScreen() {
  const { colors, radius, size, spacing, text } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ state?: string }>();
  const pinnedGeo = __DEV__ && params.state === 'geo';

  const [sheetOpen, setSheetOpen] = useState(pinnedGeo);
  const regionSupported = REGION_SUPPORTED && !pinnedGeo;

  const onCreateAccount = () => {
    if (!regionSupported) {
      setSheetOpen(true);
      return;
    }
    router.push('/(onboarding)/create-account/country-language');
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingBottom: insets.bottom + spacing.xxl },
      ]}
    >
      <View style={[styles.hero, { paddingHorizontal: spacing.huge + spacing.sm }]}>
        <BrandLogo variant="inline" />
        <Text style={[text.bodyLg, { color: colors.textMuted, marginTop: spacing.huge }]}>
          Made to get paid.
        </Text>
      </View>

      <View style={{ paddingHorizontal: spacing.gutter, gap: spacing.lg }}>
        <Button label="Create Account" onPress={onCreateAccount} />
        <Button
          label="Sign In"
          variant="secondary"
          onPress={() => router.push('/(auth)/sign-in')}
        />
        <Pressable
          onPress={() => setSheetOpen(true)}
          accessibilityRole="button"
          style={{ marginTop: spacing.sm }}
        >
          <Text style={[styles.centred, text.captionSm, { color: colors.textMuted }]}>
            Available in the UK
          </Text>
        </Pressable>
      </View>

      <BottomSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        accessibilityLabel="Not available in your region yet"
      >
        <View
          style={[
            styles.badge,
            {
              width: size.iconTile,
              height: size.iconTile,
              borderRadius: radius.pill,
              backgroundColor: colors.primary,
              marginBottom: spacing.sm,
            },
          ]}
        >
          <Text style={[text.h3Sm, { color: colors.onPrimary }]}>i</Text>
        </View>

        <Text style={[text.h2Sm, { color: colors.textPrimary }]}>
          Not available in your region <Text style={{ color: colors.accentText }}>yet</Text>
        </Text>

        <Text style={[text.lead, { color: colors.textMuted }]}>
          DittoPay currently supports merchants in the UK. We'll let you know when that changes.
        </Text>

        <Button
          label="Got it"
          variant="secondary"
          size="md"
          onPress={() => setSheetOpen(false)}
          style={{ marginTop: spacing.mdLg }}
        />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centred: { textAlign: 'center' },
  badge: { alignItems: 'center', justifyContent: 'center' },
});
