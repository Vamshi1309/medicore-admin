import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/theme/colors';

interface Props {
  uri?: string | null;
  name?: string;
  size?: number;
  background?: string;
  textColor?: string;
}

const getInitials = (name?: string) =>
  (name ?? '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('') || '?';

export default function Avatar({ uri, name, size = 96, background, textColor }: Props) {
  const [failed, setFailed] = useState(false);
  const shape = { width: size, height: size, borderRadius: size / 2 };

  if (!uri || failed) {
    return (
      <View style={[styles.fallback, shape, { backgroundColor: background ?? Colors.primary }]}>
        <Text style={{ fontSize: size * 0.36, fontWeight: '700', color: textColor ?? Colors.white }}>
          {getInitials(name)}
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      onError={() => setFailed(true)}
      contentFit="cover"
      transition={200}
      style={[styles.image, shape]}
    />
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: Colors.border },
  fallback: { alignItems: 'center', justifyContent: 'center' },
});