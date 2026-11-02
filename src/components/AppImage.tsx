import { StyleSheet } from 'react-native';
import { Image, ImageProps } from 'expo-image';
import { Colors } from '@/theme/colors';

export default function AppImage({ style, ...rest }: ImageProps) {
  return (
    <Image
      contentFit="cover"
      transition={200}
      style={[styles.image, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: Colors.border },
});