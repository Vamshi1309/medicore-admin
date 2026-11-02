import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Colors } from '@/theme/colors';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

export default function AppTextInput({ label, error, style, ...rest }: Props) {
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholderTextColor={Colors.muted}
        style={[styles.input, error && { borderColor: Colors.error }, style]}
        {...rest}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { marginBottom: 6, color: Colors.text, fontWeight: '500' },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    color: Colors.text,
  },
  error: { color: Colors.error, marginTop: 4, fontSize: 12 },
});