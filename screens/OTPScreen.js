import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import OTPInput from '../components/OTPInput';
import { getPhoneAuthError, requestPhoneCode } from '../services/firebase';

function maskPhone(number) {
  if (number.length < 8) return number;
  return `${number.slice(0, 5)}••••${number.slice(-3)}`;
}

export default function OTPScreen({ phoneNumber, confirmation, onVerified, onFailed, onResent, onBack }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(30);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function verifyCode() {
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the six-digit code from your SMS.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await confirmation.confirm(code);
      onVerified();
    } catch (verificationError) {
      onFailed(getPhoneAuthError(verificationError));
    } finally {
      setLoading(false);
    }
  }

  async function resendCode() {
    if (cooldown > 0 || resending || loading) return;
    setError('');
    setResending(true);
    try {
      const nextConfirmation = await requestPhoneCode(phoneNumber);
      onResent(nextConfirmation);
      setCode('');
      setCooldown(30);
    } catch (requestError) {
      setError(getPhoneAuthError(requestError));
    } finally {
      setResending(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text onPress={onBack} style={styles.back}>‹  Change phone number</Text>
        <View style={styles.icon}><Text style={styles.iconText}>✉</Text></View>
        <Text style={styles.title}>Verify your number</Text>
        <Text style={styles.subtitle}>We've sent a verification code to your phone number.</Text>
        <View style={styles.numberPill}><Text style={styles.number}>{maskPhone(phoneNumber)}</Text></View>
        <View style={styles.card}>
          <OTPInput value={code} onChangeText={setCode} error={error} />
          <View style={styles.buttonWrap}>
            <CustomButton title="Verify OTP" onPress={verifyCode} loading={loading} />
          </View>
          <View style={styles.resendRow}>
            <Text style={styles.resendLabel}>Didn't receive the code? </Text>
            <Text
              onPress={resendCode}
              style={[styles.resendAction, (cooldown > 0 || resending || loading) && styles.resendDisabled]}
            >
              {resending ? 'Sending…' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
            </Text>
          </View>
        </View>
        <Text style={styles.tip}>The code is valid for a limited time. Never share it with anyone.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 28, justifyContent: 'center' },
  back: { color: '#1769D2', fontSize: 15, fontWeight: '600', marginBottom: 35 },
  icon: { width: 58, height: 58, borderRadius: 19, backgroundColor: '#E2EEFF', alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  iconText: { color: '#1769D2', fontSize: 25 },
  title: { color: '#17263C', fontSize: 29, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: '#6E7D91', fontSize: 15, lineHeight: 23, marginTop: 10 },
  numberPill: { alignSelf: 'flex-start', borderRadius: 20, backgroundColor: '#EAF2FE', paddingVertical: 8, paddingHorizontal: 14, marginTop: 18, marginBottom: 23 },
  number: { color: '#1769D2', fontSize: 15, fontWeight: '700' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 22, shadowColor: '#203A5C', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.07, shadowRadius: 18, elevation: 3 },
  buttonWrap: { marginTop: 22 },
  resendRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 22 },
  resendLabel: { color: '#78869A', fontSize: 14 },
  resendAction: { color: '#1769D2', fontSize: 14, fontWeight: '700' },
  resendDisabled: { color: '#93A1B3' },
  tip: { color: '#8794A6', fontSize: 13, textAlign: 'center', lineHeight: 20, marginTop: 23, paddingHorizontal: 12 },
});
