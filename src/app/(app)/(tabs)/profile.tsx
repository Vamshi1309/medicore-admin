import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
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
        <ScreenContainer centered={false}>
            <Text style={styles.eyebrow}>ACCOUNT SETTINGS</Text>
            <Text style={styles.heading}>Profile</Text>

            <View style={styles.card}>
                <View style={styles.banner} />

                <View style={styles.avatarRing}>
                    <Avatar name={user.name} size={88} />
                </View>

                <Text style={styles.name}>{user.name}</Text>
                <View style={styles.pillWrap}>
                    <Pill label={formatRole(user.role)} color={Colors.primary} background={Colors.primarySoft} />
                </View>

                <View style={styles.rows}>
                    <InfoRow icon="id-card-outline" label="Staff ID" value={user.staffId} />
                    <View style={styles.divider} />
                    <InfoRow icon="call-outline" label="Phone number" value={user.phoneNumber} />
                </View>

                <View style={styles.actions}>
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
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    eyebrow: { color: Colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
    heading: { color: Colors.text, fontSize: 30, fontWeight: '800', marginTop: 4, marginBottom: 16 },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: Radius.lg,
        overflow: 'hidden',
        paddingBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
    },
    banner: { height: 90, backgroundColor: Colors.primary },
    avatarRing: {
        alignSelf: 'center',
        marginTop: -44,
        padding: 4,
        borderRadius: Radius.pill,
        backgroundColor: Colors.surface,
    },
    name: { textAlign: 'center', fontSize: 22, fontWeight: '700', color: Colors.text, marginTop: 10 },
    pillWrap: { alignItems: 'center', marginTop: 8 },
    rows: {
        marginHorizontal: 16,
        marginTop: 20,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.md,
    },
    divider: { height: 1, backgroundColor: Colors.border },
    actions: { marginHorizontal: 16, marginTop: 16 },
});