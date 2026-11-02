import { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import ScreenContainer from '@/components/ScreenContainer';
import AppTextInput from '@/components/AppTextInput';
import AppButton from '@/components/AppButton';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Routes } from '@/constants/routes';
import { Colors } from '@/theme/colors';

const schema = z
  .object({
    name: z.string().min(2, 'Enter your name'),
    phone: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit phone number'),
    password: z.string().min(6, 'Minimum 6 characters'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterScreen() {
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', password: '', confirm: '' },
  });

  useEffect(() => clearError, [clearError]);

  const onSubmit = (d: FormData) => register(d.name.trim(), d.phone.trim(), d.password);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Create account</Text>

      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <AppTextInput
            label="Name"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="phone"
        render={({ field }) => (
          <AppTextInput
            label="Phone number"
            placeholder="9876543210"
            keyboardType="phone-pad"
            maxLength={10}
            value={field.value}
            onChangeText={field.onChange}
            error={errors.phone?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <AppTextInput
            label="Password"
            secureTextEntry
            value={field.value}
            onChangeText={field.onChange}
            error={errors.password?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="confirm"
        render={({ field }) => (
          <AppTextInput
            label="Confirm password"
            secureTextEntry
            value={field.value}
            onChangeText={field.onChange}
            error={errors.confirm?.message}
          />
        )}
      />

      {error && <Text style={styles.apiError}>{error}</Text>}

      <AppButton title="Register" onPress={handleSubmit(onSubmit)} loading={isLoading} />

      <Link href={Routes.Login} style={styles.link}>
        Already have an account? Login
      </Link>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700', marginBottom: 24, color: Colors.text },
  apiError: { color: Colors.error, marginBottom: 12 },
  link: { marginTop: 20, textAlign: 'center', color: Colors.primary },
});