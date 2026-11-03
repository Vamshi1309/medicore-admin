import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '@/components/ScreenContainer';
import SearchBar from '@/components/SearchBar';
import FilterChips from '@/components/FilterChips';
import EmptyState from '@/components/EmptyState';
import StaffCard from '@/features/staff/components/StaffCard';
import { MOCK_STAFF } from '@/features/staff/mock/staffMock';
import { Staff, StaffRole } from '@/features/staff/models/staff.types';
import { Routes } from '@/constants/routes';
import { Colors } from '@/theme/colors';

type RoleFilter = 'ALL' | StaffRole;

const FILTERS: { label: string; value: RoleFilter }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Doctors', value: 'DOCTOR' },
  { label: 'Receptionists', value: 'RECEPTIONIST' },
  { label: 'Pharmacists', value: 'PHARMACIST' },
  { label: 'Radiologists', value: 'RADIOLOGIST' },
];

export default function StaffScreen() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<RoleFilter>('ALL');
  const [staff, setStaff] = useState<Staff[]>(MOCK_STAFF);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return staff.filter(
      (s) =>
        (role === 'ALL' || s.role === role) &&
        (q === '' || s.name.toLowerCase().includes(q) || s.staffId.toLowerCase().includes(q)),
    );
  }, [staff, search, role]);

  const toggle = (id: string, value: boolean) =>
    setStaff((list) => list.map((s) => (s.id === id ? { ...s, isActive: value } : s)));

  return (
    <ScreenContainer scroll={false}>
      {/* Fixed part: stays in place while the list scrolls */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>TEAM MANAGEMENT</Text>
          <Text style={styles.heading}>Staff directory</Text>
        </View>
        <Pressable style={styles.createBtn} onPress={() => router.push(Routes.CreateStaff)}>
          <Ionicons name="add" size={18} color={Colors.white} />
          <Text style={styles.createText}>Create</Text>
        </Pressable>
      </View>

      <SearchBar placeholder="Search by name or staff ID" value={search} onChangeText={setSearch} />

      <View style={{ marginTop: 12 }}>
        <FilterChips options={FILTERS} selected={role} onChange={setRole} />
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>{visible.length} team members</Text>
        <Text style={styles.meta}>Sorted by newest</Text>
      </View>

      {/* Scrolling part: only the cards */}
      <FlatList
        data={visible}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => <StaffCard staff={item} onToggle={toggle} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <EmptyState title="No staff found" message="Try a different name or filter." />
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
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  eyebrow: { color: Colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  heading: { color: Colors.text, fontSize: 28, fontWeight: '800', marginTop: 4 },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  createText: { color: Colors.white, fontWeight: '700' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, marginBottom: 10 },
  meta: { color: Colors.muted, fontSize: 12 },
});