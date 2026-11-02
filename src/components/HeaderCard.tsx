import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';

interface Props {
  eyebrow?: string;
  title: string;
  right?: ReactNode;
  children?: ReactNode;
}

export default function HeaderCard({ eyebrow, title, right, children }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          {eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
          <Text style={styles.title}>{title}</Text>
        </View>
        {right}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    padding: 20,
    gap: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  eyebrow: { color: Colors.primarySoft, fontSize: 13, marginBottom: 4 },
  title: { color: Colors.white, fontSize: 24, fontWeight: '700' },
});