import { useEffect, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import ScreenContainer from '@/components/ScreenContainer';
import AppTextInput from '@/components/AppTextInput';
import AppButton from '@/components/AppButton';
import Logo from '@/components/Logo';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';

const schema = z.object({
  staffId: z.string().trim().min(1, 'Enter your staff ID'),
  password: z.string().min(6, 'Minimum 6 characters'),
});
type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(false);
  const version = Constants.expoConfig?.version ?? '1.0.0';

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
  const onSubmit = (d: FormData) => {
    Keyboard.dismiss();
    return login(d.staffId, d.password);
  };

  return (
    <ScreenContainer centered={false} padded={false} safeTop={false}>
      {/* White status bar icons on the blue header */}
      <StatusBar style="light" />

      {/* Blue header: logo and name */}
      <View style={[styles.header, { paddingTop: insets.top + 36 }]}>
        <Logo width={260} height={110} />
        <Text style={styles.brand}>MediCore</Text>
        <Text style={styles.tagline}>Admin Console</Text>
      </View>

      {/* Form: no card, directly on the page background */}
      <View style={styles.form}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.sub}>Sign in with your staff ID to continue.</Text>

        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Controller
          control={control}
          name="staffId"
          render={({ field }) => (
            <AppTextInput
              label="Staff ID"
              placeholder="e.g. ADMIN-0001"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="username"
              textContentType="username"
              returnKeyType="next"
              value={field.value}
              onChangeText={(t) => {
                field.onChange(t);
                if (error) clearError();
              }}
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
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={() => handleSubmit(onSubmit)()}
              value={field.value}
              onChangeText={(t) => {
                field.onChange(t);
                if (error) clearError();
              }}
              error={errors.password?.message}
              right={
                <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={10}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.muted}
                  />
                </Pressable>
              }
            />
          )}
        />

        <AppButton title="Sign in" onPress={handleSubmit(onSubmit)} loading={isLoading} />
      </View>

      {/* Pushes the footer to the bottom on tall screens */}
      <View style={{ flex: 1 }} />

      <Text style={styles.footer}>Authorized personnel only · v{version}</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingBottom: 36,
    gap: 6,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
  },
  brand: { color: Colors.white, fontSize: 30, fontWeight: '800', letterSpacing: 0.5 },
  tagline: {
    color: Colors.primarySoft,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  form: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginHorizontal: 20,
    marginTop: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: { color: Colors.text, fontSize: 22, fontWeight: '800' },
  sub: { color: Colors.muted, fontSize: 13, marginTop: 4, marginBottom: 20 },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.errorSoft,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { flex: 1, color: Colors.error, fontSize: 13 },
  footer: {
    textAlign: 'center',
    color: Colors.muted,
    fontSize: 12,
    paddingVertical: 20,
  },
});