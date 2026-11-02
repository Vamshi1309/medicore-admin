import { Redirect } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Routes } from '@/constants/routes';

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return <Redirect href={isAuthenticated ? Routes.Home : Routes.Login} />;
}