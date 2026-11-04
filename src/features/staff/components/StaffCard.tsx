import { StyleSheet, Switch, Text, View } from 'react-native';
import Avatar from '@/components/Avatar';
import Pill from '@/components/Pill';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';
import { Staff } from '../models/staff.types';
import { getRoleStyle } from '../utils/roleStyle';

interface Props {
  staff: Staff;
  onToggle: (id: string, value: boolean) => void;
}

export default function StaffCard({ staff, onToggle }: Props) {
  const role = getRoleStyle(staff.role);

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Avatar name={staff.name} size={52} background={role.background} textColor={role.color} />
        <View style={styles.info}>
          <Text style={styles.name}>{staff.name}</Text>
          <Text style={styles.staffId}>{staff.staffId}</Text>
        </View>
        <Switch
          value={staff.isActive}
          onValueChange={(v) => onToggle(staff.id, v)}
          trackColor={{ false: Colors.border, true: Colors.success }}
          thumbColor={Colors.white}
        />
      </View>

      <View style={styles.bottom}>
        <Pill label={role.label} color={role.color} background={role.background} />
        <View style={styles.status}>
          <View style={[styles.dot, { backgroundColor: staff.isActive ? Colors.success : Colors.muted }]} />
          <Text style={[styles.statusText, { color: staff.isActive ? Colors.success : Colors.muted }]}>
            {staff.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: Colors.text },
  staffId: { fontSize: 13, color: Colors.muted, marginTop: 2 },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  status: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 13, fontWeight: '600' },
});

