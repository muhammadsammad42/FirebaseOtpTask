import { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import PhoneNumberScreen from './screens/PhoneNumberScreen';
import OTPScreen from './screens/OTPScreen';
import SuccessScreen from './screens/SuccessScreen';
import FailureScreen from './screens/FailureScreen';

export default function App() {
  const [screen, setScreen] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  function restart() {
    setPhoneNumber('');
    setConfirmation(null);
    setErrorMessage('');
    setScreen('phone');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7FC" />
      <View style={styles.container}>
        {screen === 'phone' && (
          <PhoneNumberScreen
            onCodeSent={(number, confirmationResult) => {
              setPhoneNumber(number);
              setConfirmation(confirmationResult);
              setScreen('otp');
            }}
          />
        )}
        {screen === 'otp' && (
          <OTPScreen
            phoneNumber={phoneNumber}
            confirmation={confirmation}
            onVerified={restart}
            onFailed={(message) => {
              setErrorMessage(message);
              setScreen('failure');
            }}
            onResent={setConfirmation}
            onBack={() => setScreen('phone')}
          />
        )}
        {screen === 'success' && (
          <SuccessScreen phoneNumber={phoneNumber} onRestart={restart} />
        )}
        {screen === 'failure' && (
          <FailureScreen
            message={errorMessage}
            onRetry={() => setScreen('otp')}
            onRestart={restart}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F7FC' },
  container: { flex: 1 },
});
