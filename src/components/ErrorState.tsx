import { StyleSheet, Text, View } from 'react-native';
import AppButton from '@/components/AppButton';
import { Colors } from '@/theme/colors';

interface Props {
  message?: string;
  onRetry: () => void;
}

export default function ErrorState({ message = 'Something went wrong.', onRetry }: Props) {
  return (
    <View style={styles.box}>
      <Text style={styles.message}>{message}</Text>
      <AppButton title="Try again" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { padding: 24, gap: 16 },
  message: { color: Colors.error, textAlign: 'center' },
});