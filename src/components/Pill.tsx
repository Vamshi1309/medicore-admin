import { StyleSheet, Text, View } from 'react-native';
import { Radius } from '@/theme/radius';

interface Props {
  label: string;
  color: string;      // text color
  background: string; // pill color
}

export default function Pill({ label, color, background }: Props) {
  return (
    <View style={[styles.pill, { backgroundColor: background }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: Radius.pill },
  text: { fontSize: 12, fontWeight: '600' },
});