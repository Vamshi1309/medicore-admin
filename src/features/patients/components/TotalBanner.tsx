import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';

interface Props {
  total: number;
  newThisMonth?: number;
}

export default function TotalBanner({ total, newThisMonth }: Props) {
  return (
    <View style={styles.banner}>
      <View style={styles.iconBox}>
        <Ionicons name="people-outline" size={22} color={Colors.white} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>Total patients</Text>
        <Text style={styles.value}>{total.toLocaleString('en-US')}</Text>
      </View>
      {newThisMonth !== undefined && (
        <Text style={styles.month}>
          <Text style={styles.monthStrong}>+{newThisMonth}</Text> this month
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    padding: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { color: Colors.primarySoft, fontSize: 12 },
  value: { color: Colors.white, fontSize: 26, fontWeight: '800' },
  month: { color: Colors.primarySoft, fontSize: 12 },
  monthStrong: { color: Colors.white, fontWeight: '700' },
});