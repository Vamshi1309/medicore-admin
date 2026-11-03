import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useMe } from '@/features/auth/hooks/useMe';
import { useAuthStore } from '@/features/auth/store/authStore';
import { ADMIN_ROLE } from '@/constants/roles';

export default function AppLayout() {
  const { data: user } = useMe();
  const logout = useAuthStore((s) => s.logout);

  // Defense in depth: if the role is ever not ADMIN, leave the admin area
  useEffect(() => {
    if (user && user.role !== ADMIN_ROLE) logout();
  }, [user, logout]);

  return <Stack screenOptions={{ headerShown: false }} />;
}