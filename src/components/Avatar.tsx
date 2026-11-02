import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/theme/colors';

interface Props {
  uri?: string | null;
  name?: string;
  size?: number;
}

const getInitials = (name?: string) =>
  (name ?? '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('') || '?';

export default function Avatar({ uri, name, size = 96 }: Props) {
  const [failed, setFailed] = useState(false);
  const shape = { width: size, height: size, borderRadius: size / 2 };

  // No URL, or it failed to load: show initials
  if (!uri || failed) {
    return (
      <View style={[styles.fallback, shape]}>
        <Text style={[styles.initials, { fontSize: size * 0.36 }]}>{getInitials(name)}</Text>
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
  fallback: { backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  initials: { color: Colors.white, fontWeight: '700' },
});