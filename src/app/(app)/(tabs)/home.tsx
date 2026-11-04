import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '@/components/ScreenContainer';
import StatCard from '@/components/StatCard';
import Pill from '@/components/Pill';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import StaffRow from '@/features/staff/components/StaffRow';
import { useRecentStaff } from '@/features/staff/hooks/useRecentStaff';
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardStats';
import { useMe } from '@/features/auth/hooks/useMe';
import { formatRole } from '@/constants/roles';
import { Routes } from '@/constants/routes';
import { greeting, todayLabel } from '@/core/utils/formatDate';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';

function SectionLoading() {
  return (
    <View style={styles.stateCard}>
      <ActivityIndicator color={Colors.primary} />
    </View>
  );
}

export default function HomeScreen() {
  const me = useMe();
  const stats = useDashboardStats();
  const recent = useRecentStaff(5);
  const [refreshing, setRefreshing] = useState(false);

  const firstName = me.data?.name?.split(' ')[0];

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Failures are reported by the global handler (snackbar)
      await Promise.all([me.refetch(), stats.refetch(), recent.refetch()]);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScreenContainer scroll={false} padded={false}>
      {/* Fixed banner: name and role come from /auth/me */}
      <View style={styles.banner}>
        <Text style={styles.date}>{todayLabel()}</Text>
        <Text style={styles.greeting}>
          {greeting()}
          {firstName ? `, ${firstName}` : ''}
        </Text>
        <View style={styles.subRow}>
          {me.data?.role && (
            <Pill
              label={formatRole(me.data.role)}
              color={Colors.white}
              background="rgba(255,255,255,0.2)"
            />
          )}
          <Text style={styles.subText}>Here’s what’s happening today.</Text>
        </View>
        <Pressable style={styles.createBtn} onPress={() => router.push(Routes.CreateStaff)}>
          <Ionicons name="add" size={18} color={Colors.primary} />
          <Text style={styles.createText}>Create staff</Text>
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Stats: GET /admin/stats */}
        <View style={styles.grid}>
          {stats.data ? (
            <>
              <View style={styles.gridRow}>
                <StatCard
                  icon="people-outline"
                  label="Total Patients"
                  value={stats.data.totalPatients}
                  caption={
                    stats.data.newPatientsThisMonth != null
                      ? `+${stats.data.newPatientsThisMonth} this month`
                      : undefined
                  }
                />
                <StatCard
                  icon="medkit-outline"
                  color={Colors.success}
                  background={Colors.successSoft}
                  label="Total Doctors"
                  value={stats.data.totalDoctors}
                  caption={
                    stats.data.activeDoctorsToday != null
                      ? `${stats.data.activeDoctorsToday} active today`
                      : undefined
                  }
                />
              </View>
              <View style={styles.gridRow}>
                <StatCard
                  icon="people-circle-outline"
                  color={Colors.purple}
                  background={Colors.purpleSoft}
                  label="Other Staff"
                  value={stats.data.totalOtherStaff}
                  caption={
                    stats.data.staffTeams != null
                      ? `Across ${stats.data.staffTeams} teams`
                      : undefined
                  }
                />
                <StatCard
                  icon="calendar-outline"
                  color={Colors.orange}
                  background={Colors.orangeSoft}
                  label="Today's Appointments"
                  value={stats.data.todaysAppointments}
                  caption={
                    stats.data.remainingAppointments != null
                      ? `${stats.data.remainingAppointments} remaining`
                      : undefined
                  }
                />
              </View>
            </>
          ) : stats.isError ? (
            <View style={styles.stateCard}>
              <ErrorState message={stats.error.message} onRetry={() => stats.refetch()} />
            </View>
          ) : (
            <SectionLoading />
          )}
        </View>

        {/* Recently added staff: GET /admin/staff */}
        <View style={styles.sectionHead}>
          <View>
            <Text style={styles.eyebrow}>TEAM UPDATES</Text>
            <Text style={styles.sectionTitle}>Recently added staff</Text>
          </View>
          <Pressable onPress={() => router.navigate(Routes.Staff)}>
            <Text style={styles.viewAll}>View all ›</Text>
          </Pressable>
        </View>

        {recent.data ? (
          recent.data.length === 0 ? (
            <View style={styles.stateCard}>
              <EmptyState title="No staff yet" message="Create the first staff account to get started." />
            </View>
          ) : (
            <View style={styles.listCard}>
              {recent.data.map((s, i) => (
                <View key={s.id}>
                  {i > 0 && <View style={styles.divider} />}
                  <StaffRow staff={s} />
                </View>
              ))}
            </View>
          )
        ) : recent.isError ? (
          <View style={styles.stateCard}>
            <ErrorState message={recent.error.message} onRetry={() => recent.refetch()} />
          </View>
        ) : (
          <SectionLoading />
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    gap: 8,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
  },
  date: { color: Colors.primarySoft, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  greeting: { color: Colors.white, fontSize: 20, fontWeight: '800' },
  subRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  subText: { color: Colors.primarySoft, fontSize: 12 },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  createText: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
  body: { paddingHorizontal: 16, paddingBottom: 24 },
  grid: { gap: 12, marginTop: 16 },
  gridRow: { flexDirection: 'row', gap: 12 },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 22,
    marginBottom: 10,
  },
  eyebrow: { color: Colors.primary, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  sectionTitle: { color: Colors.text, fontSize: 16, fontWeight: '800', marginTop: 2 },
  viewAll: { color: Colors.primary, fontWeight: '700', fontSize: 13 },
  stateCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 16,
    alignItems: 'center',
  },
  listCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 12 },
});