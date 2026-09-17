import { Text, type TextStyle } from 'react-native';
import { useTheme } from '@/theme';

export interface OverlineProps {
  children: string;
  style?: TextStyle;
}

/** Section label above a group: "CARD DETAILS", "SUMMARY", "POINTS ACCRUAL". */
export function Overline({ children, style }: OverlineProps) {
  const { colors, text } = useTheme();
  return <Text style={[text.overline, { color: colors.textMuted }, style]}>{children}</Text>;
}
