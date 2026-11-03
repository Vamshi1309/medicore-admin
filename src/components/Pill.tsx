import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Radius } from '@/theme/radius';

interface Props {
  label: string;
  color: string;      // text color
  background: string; // pill color
  style?: StyleProp<ViewStyle>;
}

export default function Pill({ label, color, background, style }: Props) {
  return (
    <View style={[styles.pill, { backgroundColor: background }, style]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: Radius.pill },
  text: { fontSize: 12, fontWeight: '600' },
});