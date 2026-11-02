import { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import ScreenContainer from '@/components/ScreenContainer';
import AppTextInput from '@/components/AppTextInput';
import AppButton from '@/components/AppButton';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Colors } from '@/theme/colors';

const schema = z.object({
  staffId: z.string().trim().min(1, 'Enter your staff ID'),
  password: z.string().min(6, 'Minimum 6 characters'),
});
type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { staffId: '', password: '' },
  });

  useEffect(() => clearError, [clearError]);

  // No manual navigation: the auth guard in _layout.tsx moves the user on success
  const onSubmit = (d: FormData) => login(d.staffId, d.password);

  return (
    <ScreenContainer>
      <Text style={styles.title}>MediCore Admin</Text>
      <Text style={styles.sub}>Sign in with your staff ID</Text>

      <Controller
        control={control}
        name="staffId"
        render={({ field }) => (
          <AppTextInput
            label="Staff ID"
            placeholder="e.g. ADMIN-0001"
            autoCapitalize="none"
            autoCorrect={false}
            value={field.value}
            onChangeText={field.onChange}
            error={errors.staffId?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <AppTextInput
            label="Password"
            placeholder="••••••"
            secureTextEntry
            value={field.value}
            onChangeText={field.onChange}
            error={errors.password?.message}
          />
        )}
      />

      {error && <Text style={styles.apiError}>{error}</Text>}

      <AppButton title="Sign in" onPress={handleSubmit(onSubmit)} loading={isLoading} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700', color: Colors.text },
  sub: { color: Colors.muted, marginTop: 4, marginBottom: 24 },
  apiError: { color: Colors.error, marginBottom: 12 },
});