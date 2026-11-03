import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '@/components/ScreenContainer';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';
import TotalBanner from '@/features/patients/components/TotalBanner';
import PatientCard from '@/features/patients/components/PatientCard';
import {
  MOCK_NEW_THIS_MONTH,
  MOCK_PATIENTS,
  MOCK_TOTAL_PATIENTS,
} from '@/features/patients/mock/patientsMock';
import { Colors } from '@/theme/colors';

export default function PatientsScreen() {
  const [search, setSearch] = useState('');

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const digits = q.replace(/\D/g, '');
    return MOCK_PATIENTS.filter(
      (p) =>
        q === '' ||
        p.name.toLowerCase().includes(q) ||
        (digits !== '' && p.phone.replace(/\D/g, '').includes(digits)),
    );
  }, [search]);

  return (
    <ScreenContainer scroll={false}>
      {/* Fixed part */}
      <Text style={styles.eyebrow}>PATIENT RECORDS</Text>
      <Text style={styles.heading}>Patients</Text>

      <TotalBanner total={MOCK_TOTAL_PATIENTS} newThisMonth={MOCK_NEW_THIS_MONTH} />

      <View style={{ marginTop: 12 }}>
        <SearchBar placeholder="Search by name or phone" value={search} onChangeText={setSearch} />
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>{visible.length} recent patients</Text>
        <Text style={styles.meta}>Read-only access</Text>
      </View>

      {/* Scrolling part */}
      <FlatList
        data={visible}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <PatientCard patient={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <EmptyState title="No patients found" message="Try a different name or phone number." />
        }
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  eyebrow: { color: Colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  heading: { color: Colors.text, fontSize: 28, fontWeight: '800', marginTop: 4, marginBottom: 14 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, marginBottom: 10 },
  meta: { color: Colors.muted, fontSize: 12 },
});