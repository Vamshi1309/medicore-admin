import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '@/components/ScreenContainer';
import SearchBar from '@/components/SearchBar';
import FilterChips from '@/components/FilterChips';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import StaffCard from '@/features/staff/components/StaffCard';
import { useStaffList } from '@/features/staff/hooks/useStaffList';
import { useToggleStaffStatus } from '@/features/staff/hooks/useToggleStaffStatus';
import { StaffRole } from '@/features/staff/models/staff.types';
import { useMe } from '@/features/auth/hooks/useMe';
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
  const [refreshing, setRefreshing] = useState(false);

  const me = useMe();
  const list = useStaffList();
  const toggle = useToggleStaffStatus();

  // Search and tabs run in the app
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (list.data ?? []).filter(
      (s) =>
        (role === 'ALL' || s.role === role) &&
        (q === '' || s.name.toLowerCase().includes(q) || s.staffId.toLowerCase().includes(q)),
    );
  }, [list.data, search, role]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await list.refetch(); // a failure is reported by the global snackbar
    } finally {
      setRefreshing(false);
    }
  };

  const hasNoStaff = list.data?.length === 0;

  return (
    <ScreenContainer scroll={false}>
      {/* Fixed part */}
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

      {list.data && (
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{visible.length} team members</Text>
          <Text style={styles.meta}>Sorted by newest</Text>
        </View>
      )}

      {/* Scrolling part */}
      {list.isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : list.isError && !list.data ? (
        <ErrorState message={list.error.message} onRetry={() => list.refetch()} />
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(s) => s.id}
          renderItem={({ item }) => (
            <StaffCard
              staff={item}
              onToggle={(id, value) => toggle.mutate({ id, isActive: value })}
              // Locked while its own request is running, and for the signed-in admin
              disabled={
                (toggle.isPending && toggle.variables?.id === item.id) || item.id === me.data?.id
              }
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={
            hasNoStaff ? (
              <EmptyState title="No staff yet" message="Create the first staff account to get started." />
            ) : (
              <EmptyState title="No staff found" message="Try a different name or filter." />
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});