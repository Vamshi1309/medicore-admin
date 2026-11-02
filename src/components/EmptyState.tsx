import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/theme/colors';

export default function EmptyState({ title, message }: { title: string; message?: string }) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', padding: 32 },
  title: { fontSize: 16, fontWeight: '600', color: Colors.text },
  message: { marginTop: 6, color: Colors.muted, textAlign: 'center' },
});