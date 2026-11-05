import { ReactNode, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import ScreenContainer from '@/components/ScreenContainer';
import AppTextInput from '@/components/AppTextInput';
import AppButton from '@/components/AppButton';
import SelectField from '@/components/SelectField';
import { STAFF_ROLE_OPTIONS } from '@/features/staff/utils/roleStyle';
import { useCreateStaff } from '@/features/staff/hooks/useCreateStaff';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';

const schema = z.object({
  name: z.string().trim().min(2, 'Enter the full name'),
  password: z.string().min(6, 'Minimum 6 characters'), // same rule as the backend
  role: z.enum(['DOCTOR', 'RECEPTIONIST', 'PHARMACIST', 'RADIOLOGIST']),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'Enter a 10-digit phone number')
    .optional()
    .or(z.literal('')),
  email: z.string().trim().email('Enter a valid email').optional().or(z.literal('')),
});
type FormData = z.infer<typeof schema>;

function Section({
  number,
  title,
  subtitle,
  children,
}: {
  number: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{number}</Text>
        </View>
        <View>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSub}>{subtitle}</Text>
        </View>
      </View>
      {children}
    </View>
  );
}

export default function CreateStaffScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const create = useCreateStaff();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', password: '', role: 'DOCTOR', phone: '', email: '' },
  });

  const onSubmit = (d: FormData) => {
    Keyboard.dismiss();
    create.mutate(
      {
        name: d.name.trim(),
        password: d.password,
        role: d.role,
        phoneNumber: d.phone?.trim() || undefined, // empty -> left out
        email: d.email?.trim() || undefined,
      },
      // Success message, list refresh and the staff ID alert happen in the hook
      { onSuccess: () => router.back() },
    );
  };

  return (
    <ScreenContainer centered={false}>
      <Pressable style={styles.back} onPress={() => router.back()} disabled={create.isPending}>
        <Ionicons name="chevron-back" size={18} color={Colors.muted} />
        <Text style={styles.backText}>Back to staff</Text>
      </Pressable>

      <Text style={styles.eyebrow}>TEAM MANAGEMENT</Text>
      <Text style={styles.heading}>Create staff account</Text>
      <Text style={styles.intro}>Add a new team member and generate their secure login credentials.</Text>

      <Section number="01" title="Account details" subtitle="Required information for signing in.">
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <AppTextInput
              label="Full name *"
              placeholder="e.g. Jordan Lee"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.name?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <AppTextInput
              label="Temporary password *"
              placeholder="Minimum 6 characters"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              value={field.value}
              onChangeText={field.onChange}
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
        <Text style={styles.hint}>Share this with the staff member once the account is created.</Text>
      </Section>

      <Section number="02" title="Role & contact" subtitle="Choose access level and add optional details.">
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <SelectField
              label="Role *"
              options={STAFF_ROLE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <AppTextInput
              label="Phone"
              optional
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
          name="email"
          render={({ field }) => (
            <AppTextInput
              label="Email"
              optional
              placeholder="name@hospital.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={field.value}
              onChangeText={field.onChange}
              error={errors.email?.message}
            />
          )}
        />
      </Section>

      <View style={styles.actions}>
        <View style={{ flex: 1 }}>
          <AppButton
            title="Cancel"
            variant="outline"
            disabled={create.isPending}
            onPress={() => router.back()}
          />
        </View>
        <View style={{ flex: 1 }}>
          <AppButton
            title="Create account"
            loading={create.isPending}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backText: { color: Colors.muted, fontWeight: '600' },
  eyebrow: { color: Colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  heading: { color: Colors.text, fontSize: 28, fontWeight: '800', marginTop: 4 },
  intro: { color: Colors.muted, marginTop: 6, marginBottom: 20 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: Colors.primary, fontWeight: '700', fontSize: 12 },
  cardTitle: { color: Colors.text, fontSize: 16, fontWeight: '700' },
  cardSub: { color: Colors.muted, fontSize: 12, marginTop: 2 },
  hint: { color: Colors.muted, fontSize: 12, marginTop: -8 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 4, marginBottom: 24 },
});