import { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface Props {
  label: string;
  value: string | number;
  caption?: string;
  icon?: IconName;
  color?: string;
  background?: string;
}

export default function StatCard({
  label,
  value,
  caption,
  icon,
  color = Colors.primary,
  background = Colors.primarySoft,
}: Props) {
  return (
    <View style={styles.card}>
      {icon && (
        <View style={[styles.iconBox, { backgroundColor: background }]}>
          <Ionicons name={icon} size={18} color={color} />
        </View>
      )}
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{typeof value === 'number' ? value.toLocaleString('en-US') : value}</Text>
      {caption && <Text style={styles.caption}>{caption}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  label: { color: Colors.muted, fontSize: 12 },
  value: { color: Colors.text, fontSize: 22, fontWeight: '800', marginTop: 2 },
  caption: { color: Colors.muted, fontSize: 11, marginTop: 2 },
});