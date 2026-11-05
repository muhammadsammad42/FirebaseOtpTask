import { StyleSheet, Text, View } from 'react-native';
import CustomButton from '../components/CustomButton';

export default function SuccessScreen({ phoneNumber, onRestart }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.icon}><Text style={styles.check}>✓</Text></View>
        <Text style={styles.title}>Phone Number{'\n'}Verified Successfully!</Text>
        <Text style={styles.subtitle}>Your mobile number has been verified and is ready to use.</Text>
        <Text style={styles.label}>VERIFIED NUMBER</Text>
        <Text style={styles.number}>{phoneNumber}</Text>
        <View style={styles.button}><CustomButton title="Verify another number" onPress={onRestart} /></View>
      </View>
      <Text style={styles.footer}>Phone OTP Verification</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 25, alignItems: 'center', elevation: 3, shadowColor: '#203A5C', shadowOpacity: 0.07, shadowRadius: 18, shadowOffset: { width: 0, height: 8 } },
  icon: { width: 82, height: 82, borderRadius: 41, backgroundColor: '#E3F7EC', justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
  check: { color: '#159451', fontSize: 43, fontWeight: '700' },
  title: { color: '#17263C', fontSize: 25, lineHeight: 32, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: '#738196', fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 12 },
  label: { color: '#9AA5B4', fontSize: 10, fontWeight: '800', letterSpacing: 1.4, marginTop: 29 },
  number: { color: '#26354A', fontSize: 17, fontWeight: '700', marginTop: 8 },
  button: { width: '100%', marginTop: 30 },
  footer: { color: '#A0AABA', fontSize: 13, textAlign: 'center', marginTop: 24 },
});
