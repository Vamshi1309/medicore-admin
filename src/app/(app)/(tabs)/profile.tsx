import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import ScreenContainer from '@/components/ScreenContainer';
import AppButton from '@/components/AppButton';
import Avatar from '@/components/Avatar';
import InfoRow from '@/components/InfoRow';
import Pill from '@/components/Pill';
import ErrorState from '@/components/ErrorState';
import { useMe } from '@/features/auth/hooks/useMe';
import { useAuthStore } from '@/features/auth/store/authStore';
import { formatRole } from '@/constants/roles';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';

export default function ProfileScreen() {
    const { data: user, isLoading, isError, refetch } = useMe();
    const logout = useAuthStore((s) => s.logout);
    const [loggingOut, setLoggingOut] = useState(false);
    const version = Constants.expoConfig?.version ?? '1.0.0';

    if (isLoading) {
        return (
            <ScreenContainer>
                <ActivityIndicator size="large" color={Colors.primary} />
            </ScreenContainer>
        );
    }

    if (isError || !user) {
        return (
            <ScreenContainer>
                <ErrorState message="Could not load your profile." onRetry={() => refetch()} />
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer centered={false} padded={false}>
            {/* Header: full width, same style as Home */}
            <View style={styles.header}>
                <View style={styles.ring}>
                    <Avatar name={user.name} size={84} background={Colors.white} textColor={Colors.primary} />
                </View>
                <Text style={styles.name}>{user.name}</Text>
                <Pill
                    label={formatRole(user.role)}
                    color={Colors.white}
                    background="rgba(255,255,255,0.2)"
                    style={{ alignSelf: 'center' }}
                />
            </View>

            <View style={styles.body}>
                <Text style={styles.sectionLabel}>ACCOUNT DETAILS</Text>
                <View style={styles.card}>
                    <InfoRow icon="id-card-outline" label="Staff ID" value={user.staffId} />
                    <View style={styles.divider} />
                    <InfoRow icon="call-outline" label="Phone number" value={user.phoneNumber} />
                </View>

                <View style={styles.logout}>
                    <AppButton
                        title="Log out"
                        variant="danger"
                        loading={loggingOut}
                        onPress={async () => {
                            setLoggingOut(true);
                            await logout(); // the auth guard then moves the user to Login
                        }}
                    />
                </View>

                <Text style={styles.version}>MediCore Admin · Version {version}</Text>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingTop: 24,
        paddingBottom: 24,
        gap: 10,
        borderBottomLeftRadius: Radius.lg,
        borderBottomRightRadius: Radius.lg,
    },
    ring: {
        padding: 5,
        borderRadius: Radius.pill,
        backgroundColor: 'rgba(255,255,255,0.25)',
    },
    name: { color: Colors.white, fontSize: 20, fontWeight: '800', marginTop: 4 },
    body: { paddingHorizontal: 16, paddingTop: 22 },
    sectionLabel: {
        color: Colors.muted,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 10,
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: Radius.md,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 14 },
    logout: { marginTop: 20 },
    version: { textAlign: 'center', color: Colors.muted, fontSize: 12, marginTop: 20, marginBottom: 24 },
});