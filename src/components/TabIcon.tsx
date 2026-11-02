import { ComponentProps } from 'react';
import { ColorValue, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface Props {
    filled: IconName;
    outline: IconName;
    focused: boolean;
    color: ColorValue;
}

export default function TabIcon({ filled, outline, focused, color }: Props) {
    return (
        <View style={[styles.wrap, focused && styles.active]}>
            <Ionicons name={focused ? filled : outline} size={22} color={color as string} />
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { paddingHorizontal: 18, paddingVertical: 4, borderRadius: Radius.pill },
    active: { backgroundColor: Colors.primarySoft },
});