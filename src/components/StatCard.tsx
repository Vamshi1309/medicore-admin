import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';

interface Props {
  label: string;
  value: string | number;
  caption?: string;
}

export default function StatCard({ label, value, caption }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {caption && <Text style={styles.caption}>{caption}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: { color: Colors.muted, fontSize: 13 },
  value: { color: Colors.text, fontSize: 28, fontWeight: '700', marginTop: 4 },
  caption: { color: Colors.muted, fontSize: 12, marginTop: 2 },
});