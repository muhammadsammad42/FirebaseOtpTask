import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

export default function CustomButton({ title, onPress, loading = false, disabled = false, secondary = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && !loading && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? '#1769D2' : '#FFFFFF'} />
      ) : (
        <Text style={[styles.label, secondary && styles.secondaryLabel]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: 15,
    backgroundColor: '#1769D2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  secondary: { backgroundColor: '#EAF2FE' },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.85 },
  label: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  secondaryLabel: { color: '#1769D2' },
});
