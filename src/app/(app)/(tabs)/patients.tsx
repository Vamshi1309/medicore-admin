import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ScreenContainer from '@/components/ScreenContainer';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import TotalBanner from '@/features/patients/components/TotalBanner';
import PatientCard from '@/features/patients/components/PatientCard';
import { usePatients } from '@/features/patients/hooks/usePatients';
import { Colors } from '@/theme/colors';

export default function PatientsScreen() {
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const list = usePatients();

  // Search by name or phone, in the app
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const digits = q.replace(/\D/g, '');
    return (list.data ?? []).filter(
      (p) =>
        q === '' ||
        p.name.toLowerCase().includes(q) ||
        (digits !== '' && (p.phoneNumber ?? '').replace(/\D/g, '').includes(digits)),
    );
  }, [list.data, search]);

  // Shown only when the backend sends createdAt
  const newThisMonth = useMemo(() => {
    const data = list.data;
    if (!data || !data.some((p) => p.createdAt)) return undefined;
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return data.filter((p) => p.createdAt?.startsWith(ym)).length;
  }, [list.data]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await list.refetch(); // a failure is reported by the global snackbar
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScreenContainer scroll={false}>
      {/* Fixed part */}
      <Text style={styles.eyebrow}>PATIENT RECORDS</Text>
      <Text style={styles.heading}>Patients</Text>

      {list.data && <TotalBanner total={list.data.length} newThisMonth={newThisMonth} />}

      <View style={{ marginTop: 12 }}>
        <SearchBar placeholder="Search by name or phone" value={search} onChangeText={setSearch} />
      </View>

      {list.data && (
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{visible.length} patients</Text>
          <Text style={styles.meta}>Read-only access</Text>
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
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => <PatientCard patient={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={
            list.data?.length === 0 ? (
              <EmptyState title="No patients yet" message="Registered patients will appear here." />
            ) : (
              <EmptyState title="No patients found" message="Try a different name or phone number." />
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
  eyebrow: { color: Colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  heading: { color: Colors.text, fontSize: 28, fontWeight: '800', marginTop: 4, marginBottom: 14 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, marginBottom: 10 },
  meta: { color: Colors.muted, fontSize: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});