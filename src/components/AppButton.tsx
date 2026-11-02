import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { Colors } from '@/theme/colors';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
}

export default function AppButton({ title, onPress, loading, disabled, variant = 'primary' }: Props) {
  const isOutline = variant === 'outline';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        isOutline && styles.outline,
        (disabled || loading) && styles.disabled,
        pressed && { opacity: 0.85 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? Colors.primary : Colors.white} />
      ) : (
        <Text style={[styles.text, isOutline && { color: Colors.primary }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.primary },
  disabled: { opacity: 0.6 },
  text: { color: Colors.white, fontSize: 16, fontWeight: '600' },
});