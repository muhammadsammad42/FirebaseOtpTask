import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function OTPInput({ value, onChangeText, error }) {
  return (
    <View>
      <Text style={styles.label}>Verification code</Text>
      <TextInput
        accessibilityLabel="Six digit verification code"
        value={value}
        onChangeText={(text) => onChangeText(text.replace(/\D/g, '').slice(0, 6))}
        keyboardType="number-pad"
        maxLength={6}
        placeholder="• • • • • •"
        placeholderTextColor="#A0A9B8"
        style={[styles.input, error && styles.errorBorder]}
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: '#26354A', fontSize: 14, fontWeight: '700', marginBottom: 9 },
  input: {
    height: 62,
    borderWidth: 1,
    borderColor: '#DCE4EF',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    color: '#17263C',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 12,
    textAlign: 'center',
  },
  errorBorder: { borderColor: '#D14343' },
  error: { color: '#B42318', fontSize: 13, marginTop: 7 },
});
