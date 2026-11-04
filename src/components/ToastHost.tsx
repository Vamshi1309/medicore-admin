import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToastStore } from '@/core/ui/toast';
import { Colors } from '@/theme/colors';

const HIDDEN = -160;
const DURATION = 3500;

export default function ToastHost() {
  const insets = useSafeAreaInsets();
  const toast = useToastStore((s) => s.toast);
  const hide = useToastStore((s) => s.hide);
  const translateY = useRef(new Animated.Value(HIDDEN)).current;

  useEffect(() => {
    if (!toast) return;
    translateY.setValue(HIDDEN);
    Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();

    const timer = setTimeout(() => {
      Animated.timing(translateY, { toValue: HIDDEN, duration: 220, useNativeDriver: true }).start(
        ({ finished }) => finished && hide(),
      );
    }, DURATION);

    return () => clearTimeout(timer);
  }, [toast, translateY, hide]);

  if (!toast) return null;
  const isError = toast.type === 'error';

  return (
    <Animated.View
      pointerEvents="box-none"
      accessibilityLiveRegion="polite"
      style={[styles.wrap, { top: insets.top + 8, transform: [{ translateY }] }]}
    >
      <Pressable
        onPress={hide}
        style={[styles.toast, { backgroundColor: isError ? Colors.error : Colors.success }]}
      >
        <Ionicons name={isError ? 'alert-circle' : 'checkmark-circle'} size={20} color={Colors.white} />
        <Text style={styles.text}>{toast.message}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16, zIndex: 100 },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  text: { flex: 1, color: Colors.white, fontSize: 14, fontWeight: '600' },
});