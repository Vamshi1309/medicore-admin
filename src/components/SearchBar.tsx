import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';

export default function SearchBar(props: TextInputProps) {
  return (
    <View style={styles.wrapper}>
      <Ionicons name="search" size={18} color={Colors.muted} />
      <TextInput
        placeholderTextColor={Colors.muted}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    paddingHorizontal: 14,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: { flex: 1, color: Colors.text, fontSize: 15 },
});