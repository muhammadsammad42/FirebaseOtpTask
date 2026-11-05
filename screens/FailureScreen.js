import { StyleSheet, Text, View } from 'react-native';
import CustomButton from '../components/CustomButton';

export default function FailureScreen({ message, onRetry, onRestart }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.icon}><Text style={styles.cross}>!</Text></View>
        <Text style={styles.title}>Verification unsuccessful</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.button}><CustomButton title="Try verification again" onPress={onRetry} /></View>
        <View style={styles.secondaryButton}><CustomButton title="Start over" onPress={onRestart} secondary /></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 25, alignItems: 'center', elevation: 3, shadowColor: '#203A5C', shadowOpacity: 0.07, shadowRadius: 18, shadowOffset: { width: 0, height: 8 } },
  icon: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FFF0ED', justifyContent: 'center', alignItems: 'center', marginBottom: 22 },
  cross: { color: '#C53B2C', fontSize: 34, fontWeight: '800' },
  title: { color: '#17263C', fontSize: 23, fontWeight: '800', textAlign: 'center' },
  message: { color: '#738196', fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 12 },
  button: { width: '100%', marginTop: 27 },
  secondaryButton: { width: '100%', marginTop: 11 },
});
