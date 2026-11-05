import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToastStore } from '@/core/ui/toast';
import { Colors } from '@/theme/colors';

const HIDDEN_OFFSET = 120; // how far below its position it starts and leaves
const DURATION = 4000;     // same as Flutter's default snackbar
const SNACKBAR_BG = '#323232';
// Must match the tab bar height in (tabs)/_layout.tsx (68 + bottom inset)
const TAB_BAR_HEIGHT = 68;

export default function ToastHost() {
  const insets = useSafeAreaInsets();
  const segments = useSegments() as string[];
  const toast = useToastStore((s) => s.toast);
  const hide = useToastStore((s) => s.hide);

  const translateY = useRef(new Animated.Value(HIDDEN_OFFSET)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!toast) return;

    translateY.setValue(HIDDEN_OFFSET);
    opacity.setValue(0);
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: HIDDEN_OFFSET, duration: 200, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(({ finished }) => finished && hide());
    }, DURATION);

    return () => clearTimeout(timer);
  }, [toast, translateY, opacity, hide]);

  if (!toast) return null;

  const isError = toast.type === 'error';
  // Sit above the tab bar on tab screens, near the bottom edge elsewhere
  const onTabs = segments.includes('(tabs)');
  const bottom = onTabs ? TAB_BAR_HEIGHT + insets.bottom + 12 : insets.bottom + 16;

  return (
    <Animated.View
      pointerEvents="box-none"
      accessibilityLiveRegion="polite"
      style={[styles.wrap, { bottom, opacity, transform: [{ translateY }] }]}
    >
      <Pressable onPress={hide} style={styles.snackbar}>
        <Ionicons
          name={isError ? 'alert-circle' : 'checkmark-circle'}
          size={20}
          color={isError ? '#FF8A80' : '#7DDBA3'}
        />
        <Text style={styles.text}>{toast.message}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16, zIndex: 100 },
  snackbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: SNACKBAR_BG,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 8,
  },
  text: { flex: 1, color: Colors.white, fontSize: 14 },
});