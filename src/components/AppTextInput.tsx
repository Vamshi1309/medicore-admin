import { ReactNode } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Colors } from '@/theme/colors';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  right?: ReactNode;
  optional?: boolean;
}

export default function AppTextInput({ label, error, right, optional, style, ...rest }: Props) {
  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={styles.label}>
          {label}
          {optional && <Text style={styles.optional}>{'  Optional'}</Text>}
        </Text>
      )}
      <View style={[styles.field, !!error && { borderColor: Colors.error }]}>
        <TextInput placeholderTextColor={Colors.muted} style={[styles.input, style]} {...rest} />
        {right}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { marginBottom: 6, color: Colors.text, fontWeight: '600' },
  optional: { color: Colors.muted, fontSize: 12, fontWeight: '400' },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: Colors.surface,
  },
  input: { flex: 1, color: Colors.text, fontSize: 15 },
  error: { color: Colors.error, marginTop: 4, fontSize: 12 },
});