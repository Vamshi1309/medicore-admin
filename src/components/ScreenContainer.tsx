import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/theme/colors';

interface Props {
  children: ReactNode;
  centered?: boolean;
  scroll?: boolean;
  padded?: boolean;   // false = no side or top padding (screen handles its own)
  safeTop?: boolean;  // false = content may draw behind the status bar
}

export default function ScreenContainer({
  children,
  centered = true,
  scroll = true,
  padded = true,
  safeTop = true,
}: Props) {
  const edges: Edge[] = safeTop ? ['top', 'left', 'right'] : [];

  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {scroll ? (
          <ScrollView
            contentContainerStyle={[
              styles.content,
              padded && styles.padded,
              !centered && styles.top,
            ]}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.fixed, padded && styles.fixedPadded]}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { flexGrow: 1, justifyContent: 'center' },
  padded: { padding: 20 },
  top: { justifyContent: 'flex-start' },
  fixed: { flex: 1 },
  fixedPadded: { paddingHorizontal: 20, paddingTop: 20 },
});