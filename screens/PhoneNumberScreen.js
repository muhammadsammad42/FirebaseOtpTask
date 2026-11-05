import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import PhoneInput from '../components/PhoneInput';
import { getPhoneAuthError, requestPhoneCode } from '../services/firebase';

const DEFAULT_COUNTRY = { name: 'Pakistan', dial: '+92', flag: '🇵🇰' };

function toE164(raw, country) {
  let number = raw.replace(/[\s()-]/g, '');
  if (number.startsWith('+')) return /^\+[1-9]\d{7,14}$/.test(number) ? number : null;
  number = number.replace(/\D/g, '');
  if (country.dial === '+92' && number.startsWith('0')) number = number.slice(1);
  if (!number || number.startsWith('0')) return null;
  const e164 = `${country.dial}${number}`;
  if (!/^\+[1-9]\d{7,14}$/.test(e164)) return null;
  if (country.dial === '+92' && !/^(\+923\d{9})$/.test(e164)) return null;
  return e164;
}

export default function PhoneNumberScreen({ onCodeSent }) {
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendCode() {
    const formattedPhone = toE164(phone, country);
    if (!formattedPhone) {
      setError(country.dial === '+92'
        ? 'Enter a valid Pakistani mobile number, e.g. 3001234567.'
        : 'Enter a valid phone number including the area code.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const confirmation = await requestPhoneCode(formattedPhone);
      onCodeSent(formattedPhone, confirmation);
    } catch (requestError) {
      setError(getPhoneAuthError(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brandIcon}><Text style={styles.brandIconText}>✓</Text></View>
        <Text style={styles.title}>Phone OTP{'\n'}Verification</Text>
        <Text style={styles.subtitle}>Verify your mobile number securely.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Get started</Text>
          <Text style={styles.cardDescription}>Enter your phone number and we’ll send you a one-time verification code.</Text>
          <PhoneInput value={phone} onChangeText={setPhone} country={country} onSelectCountry={setCountry} error={error} />
          <View style={styles.buttonWrap}>
            <CustomButton title="Send OTP" onPress={sendCode} loading={loading} />
          </View>
          <Text style={styles.footnote}>Standard SMS rates may apply.</Text>
        </View>
        <Text style={styles.secureText}>SECURE PHONE VERIFICATION</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 50, paddingBottom: 28, justifyContent: 'center' },
  brandIcon: { width: 52, height: 52, borderRadius: 17, backgroundColor: '#E2EEFF', alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  brandIconText: { color: '#1769D2', fontSize: 27, fontWeight: '800' },
  title: { color: '#17263C', fontSize: 34, lineHeight: 40, fontWeight: '800', letterSpacing: -0.8 },
  subtitle: { color: '#6E7D91', fontSize: 16, marginTop: 10, marginBottom: 30 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 22, shadowColor: '#203A5C', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.07, shadowRadius: 18, elevation: 3 },
  cardTitle: { color: '#17263C', fontSize: 20, fontWeight: '700' },
  cardDescription: { color: '#78869A', fontSize: 14, lineHeight: 21, marginTop: 7, marginBottom: 23 },
  buttonWrap: { marginTop: 21 },
  footnote: { color: '#8A96A7', fontSize: 12, textAlign: 'center', marginTop: 13 },
  secureText: { color: '#A0AABA', textAlign: 'center', letterSpacing: 1.4, fontSize: 10, fontWeight: '700', marginTop: 27 },
});
