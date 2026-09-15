import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const STAGE_COUNT = 4;

export interface StageHeaderProps {
  /** 1-based stage number. */
  stage: number;
  label: string;
}

/** Onboarding "Stage N of 4 · Label" header with a simple progress bar. */
export function StageHeader({ stage, label }: StageHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.text}>
        Stage {stage} of {STAGE_COUNT} · {label}
      </Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${(stage / STAGE_COUNT) * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingBottom: 12, gap: 8 },
  text: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  track: { height: 4, borderRadius: 2, backgroundColor: '#e5e7eb', overflow: 'hidden' },
  fill: { height: 4, backgroundColor: '#111827' },
});
