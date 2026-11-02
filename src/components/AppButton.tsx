import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { Colors } from '@/theme/colors';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'danger';
}

export default function AppButton({ title, onPress, loading, disabled, variant = 'primary' }: Props) {
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  const textColor = isDanger ? Colors.error : isOutline ? Colors.primary : Colors.white;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        isOutline && styles.outline,
        isDanger && styles.danger,
        (disabled || loading) && styles.disabled,
        pressed && { opacity: 0.85 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.primary },
  danger: { backgroundColor: Colors.errorSoft },
  disabled: { opacity: 0.6 },
  text: { fontSize: 16, fontWeight: '600' },
});