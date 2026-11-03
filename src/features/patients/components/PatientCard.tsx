import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '@/components/Avatar';
import { formatDate } from '@/core/utils/formatDate';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';
import { Patient } from '../models/patient.types';

const TONES = [
  { background: Colors.primarySoft, color: Colors.primary },
  { background: Colors.purpleSoft, color: Colors.purple },
  { background: Colors.successSoft, color: Colors.success },
  { background: Colors.orangeSoft, color: Colors.orange },
];

// Same patient -> same color every time, even when ids are UUIDs
const toneFor = (id: string) => {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return TONES[sum % TONES.length];
};

export default function PatientCard({ patient }: { patient: Patient }) {
  const tone = toneFor(patient.id);

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Avatar name={patient.name} size={52} background={tone.background} textColor={tone.color} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{patient.name}</Text>
          <Text style={styles.joined}>Joined {formatDate(patient.joinedAt)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Ionicons name="call-outline" size={16} color={Colors.primary} />
        <Text style={styles.rowText}>{patient.phone}</Text>
      </View>
      <View style={styles.row}>
        <Ionicons name="mail-outline" size={16} color={Colors.primary} />
        <Text style={styles.rowText}>{patient.email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { fontSize: 16, fontWeight: '700', color: Colors.text },
  joined: { fontSize: 12, color: Colors.muted, marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowText: { fontSize: 13, color: Colors.muted },
});