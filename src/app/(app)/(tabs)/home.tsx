import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '@/components/ScreenContainer';
import StatCard from '@/components/StatCard';
import Pill from '@/components/Pill';
import StaffRow from '@/features/staff/components/StaffRow';
import { MOCK_STAFF } from '@/features/staff/mock/staffMock';
import { MOCK_STATS } from '@/features/dashboard/mock/dashboardMock';
import { useMe } from '@/features/auth/hooks/useMe';
import { formatRole } from '@/constants/roles';
import { Routes } from '@/constants/routes';
import { greeting, todayLabel } from '@/core/utils/formatDate';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';

export default function HomeScreen() {
  const { data: user } = useMe();
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const stats = MOCK_STATS;
  const recent = MOCK_STAFF.slice(0, 4); // mock list is newest first

  return (
    <ScreenContainer centered={false} padded={false}>
      {/* Full-width banner, below the status bar */}
      <View style={styles.banner}>
        <Text style={styles.date}>{todayLabel()}</Text>
        <Text style={styles.greeting}>
          {greeting()}, {firstName}
        </Text>
        <View style={styles.subRow}>
          <Pill
            label={formatRole(user?.role) || 'Administrator'}
            color={Colors.white}
            background="rgba(255,255,255,0.2)"
          />
          <Text style={styles.subText}>Here’s what’s happening today.</Text>
        </View>
        <Pressable style={styles.createBtn} onPress={() => router.push(Routes.CreateStaff)}>
          <Ionicons name="add" size={18} color={Colors.primary} />
          <Text style={styles.createText}>Create staff</Text>
        </Pressable>
      </View>

      {/* Everything below keeps a small side margin */}
      <View style={styles.body}>
        <View style={styles.grid}>
          <View style={styles.gridRow}>
            <StatCard
              icon="people-outline"
              label="Total Patients"
              value={stats.totalPatients}
              caption={`+${stats.newPatientsThisMonth} this month`}
            />
            <StatCard
              icon="medkit-outline"
              color={Colors.success}
              background={Colors.successSoft}
              label="Total Doctors"
              value={stats.totalDoctors}
              caption={`${stats.activeDoctorsToday} active today`}
            />
          </View>
          <View style={styles.gridRow}>
            <StatCard
              icon="people-circle-outline"
              color={Colors.purple}
              background={Colors.purpleSoft}
              label="Other Staff"
              value={stats.otherStaff}
              caption={`Across ${stats.staffTeams} teams`}
            />
            <StatCard
              icon="calendar-outline"
              color={Colors.orange}
              background={Colors.orangeSoft}
              label="Today's Appointments"
              value={stats.todaysAppointments}
              caption={`${stats.remainingAppointments} remaining`}
            />
          </View>
        </View>

        <View style={styles.sectionHead}>
          <View>
            <Text style={styles.eyebrow}>TEAM UPDATES</Text>
            <Text style={styles.sectionTitle}>Recently added staff</Text>
          </View>
          <Pressable onPress={() => router.navigate(Routes.Staff)}>
            <Text style={styles.viewAll}>View all ›</Text>
          </Pressable>
        </View>

        <View style={styles.listCard}>
          {recent.map((s, i) => (
            <View key={s.id}>
              {i > 0 && <View style={styles.divider} />}
              <StaffRow staff={s} />
            </View>
          ))}
        </View>
      </View>
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
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
  },
  date: { color: Colors.primarySoft, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  greeting: { color: Colors.white, fontSize: 20, fontWeight: '800' },
  subRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  subText: { color: Colors.primarySoft, fontSize: 12 },
  // No alignSelf: the button stretches across the banner, inside its side padding
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
  body: { paddingHorizontal: 16 },
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
  listCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 12 },
});