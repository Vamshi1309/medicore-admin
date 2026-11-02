import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import ScreenContainer from '@/components/ScreenContainer';
import AppButton from '@/components/AppButton';
import { useAuthStore } from '@/features/auth/store/authStore';
import { picsumSeedUrl } from '@/features/gallery/utils/imageUrl';
import { Colors } from '@/theme/colors';
import Avatar from '@/components/Avatar';
import { useMe } from '@/features/auth/hooks/useMe';

export default function HomeScreen() {
  const { data: user, isLoading, isError, refetch } = useMe();
  const logout = useAuthStore((s) => s.logout);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();   // after this, the auth guard moves the user to Login
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <ActivityIndicator size="large" color={Colors.primary} />
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer>
        <Text style={styles.sub}>Could not load your profile.</Text>
        <AppButton title="Try again" onPress={() => refetch()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Avatar
          name={user?.name}
          uri={user ? picsumSeedUrl(user.id, 200) : null}
          size={96}
        />
        <Text style={styles.title}>{user?.name ?? 'Loading...'}</Text>
        <Text style={styles.sub}>{user?.phoneNumber}</Text>
        <Text style={styles.sub}>Role: {user?.role}</Text>
        {user?.staffId && <Text style={styles.sub}>Staff ID: {user.staffId}</Text>}
      </View>

      <AppButton title="Logout" variant="outline" onPress={handleLogout} loading={loggingOut} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 24, fontWeight: '700', marginTop: 16, color: Colors.text },
  sub: { color: Colors.muted, marginTop: 4 },
});