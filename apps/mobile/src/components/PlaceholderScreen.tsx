import { type Href, Link } from 'expo-router';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';

const FIGMA_FILE = 'https://www.figma.com/design/NyZLmydPFVxa8ehyWWyB68/Untitled';

interface PlaceholderAction {
  label: string;
  href: Href;
}

export interface PlaceholderScreenProps {
  title: string;
  /** Route params or other runtime context, shown under the title. */
  subtitle?: string;
  /** Stage / step label from the Figma annotation chips. */
  stage?: string;
  /** Comma-separated Figma node IDs from docs/figma-screens.md. */
  figma?: string;
  notes?: string;
  /** Where this screen leads. Keeps the scaffold navigable end to end. */
  actions?: PlaceholderAction[];
}

/**
 * Stand-in for a screen that has a route but no design implementation yet.
 * Replace the body of each route file with the real screen; keep the route.
 */
export function PlaceholderScreen({
  title,
  subtitle,
  stage,
  figma,
  notes,
  actions,
}: PlaceholderScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { colors, spacing, radius, size, text } = theme;
  const nodes = figma?.split(',').map((n) => n.trim()) ?? [];
  const buttonStyle = StyleSheet.flatten([
    styles.button,
    {
      height: size.button,
      borderRadius: radius.xl,
      backgroundColor: colors.primary,
      borderColor: colors.primaryBorder,
    },
  ]);

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.container,
        { padding: spacing.gutter, paddingBottom: insets.bottom + spacing.xxxl, gap: spacing.lg },
      ]}
    >
      {stage ? <Text style={[text.overline, { color: colors.textMuted }]}>{stage}</Text> : null}
      <Text style={[text.h1, { color: colors.textPrimary }]}>{title}</Text>
      {subtitle ? (
        <Text style={[text.caption, { color: colors.textMuted }]}>{subtitle}</Text>
      ) : null}
      {notes ? <Text style={[text.body, { color: colors.textSecondary }]}>{notes}</Text> : null}

      {nodes.length > 0 ? (
        <View style={[styles.figmaRow, { gap: spacing.md }]}>
          <Text style={[text.captionSm, { color: colors.textPlaceholder }]}>Figma</Text>
          {nodes.map((node) => (
            <Pressable
              key={node}
              onPress={() => Linking.openURL(`${FIGMA_FILE}?node-id=${node.replace(':', '-')}`)}
            >
              <Text style={[text.labelStrong, { color: colors.link }]}>{node}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {actions && actions.length > 0 ? (
        <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
          {actions.map((action) => (
            <Link key={action.label} href={action.href} asChild>
              {/* Link asChild clones this element through expo-router's Slot, which rejects array styles in dev. */}
              <Pressable style={buttonStyle}>
                <Text style={[text.button, { color: colors.onPrimary }]}>{action.label}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  figmaRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  button: { alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
});
