import { StyleSheet, Text, View } from 'react-native';
import Avatar from '@/components/Avatar';
import Pill from '@/components/Pill';
import { Colors } from '@/theme/colors';
import { Staff } from '../models/staff.types';
import { getRoleStyle } from '../utils/roleStyle';

export default function StaffRow({ staff }: { staff: Staff }) {
  const role = getRoleStyle(staff.role);
  const statusColor = staff.isActive ? Colors.success : Colors.muted;

  return (
    <View style={styles.row}>
      <Avatar name={staff.name} size={40} background={role.background} textColor={role.color} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{staff.name}</Text>
        <Text style={styles.staffId}>{staff.staffId}</Text>
      </View>
      <View style={styles.right}>
        <Pill label={role.label} color={role.color} background={role.background} />
        <View style={styles.status}>
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {staff.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  name: { fontSize: 14, fontWeight: '700', color: Colors.text },
  staffId: { fontSize: 11, color: Colors.muted, marginTop: 2 },
  right: { alignItems: 'flex-end', gap: 5 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '600' },
});