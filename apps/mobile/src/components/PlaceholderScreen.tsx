import { type Href, Link } from 'expo-router';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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
  const nodes = figma?.split(',').map((n) => n.trim()) ?? [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {stage ? <Text style={styles.stage}>{stage}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {notes ? <Text style={styles.notes}>{notes}</Text> : null}

      {nodes.length > 0 ? (
        <View style={styles.figmaRow}>
          <Text style={styles.figmaLabel}>Figma</Text>
          {nodes.map((node) => (
            <Pressable
              key={node}
              onPress={() => Linking.openURL(`${FIGMA_FILE}?node-id=${node.replace(':', '-')}`)}
            >
              <Text style={styles.figmaNode}>{node}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {actions && actions.length > 0 ? (
        <View style={styles.actions}>
          {actions.map((action) => (
            <Link key={action.label} href={action.href} asChild>
              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>{action.label}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, gap: 12 },
  stage: { fontSize: 13, fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' },
  title: { fontSize: 28, fontWeight: '600' },
  subtitle: { fontSize: 14, color: '#6b7280' },
  notes: { fontSize: 15, color: '#4b5563', lineHeight: 22 },
  figmaRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  figmaLabel: { fontSize: 13, color: '#9ca3af' },
  figmaNode: { fontSize: 13, color: '#2563eb', fontFamily: 'monospace' },
  actions: { marginTop: 12, gap: 10 },
  button: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
