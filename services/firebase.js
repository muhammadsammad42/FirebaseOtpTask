import { Platform } from 'react-native';
import auth from '@react-native-firebase/auth';

export const isFirebasePhoneTestModeEnabled =
  __DEV__ &&
  Platform.OS === 'android' &&
  process.env.EXPO_PUBLIC_FIREBASE_PHONE_AUTH_TESTING === 'true';

export async function requestPhoneCode(phoneNumber) {
  if (Platform.OS === 'android') {
    auth().settings.appVerificationDisabledForTesting = isFirebasePhoneTestModeEnabled;
  }
  return auth().signInWithPhoneNumber(phoneNumber);
}

export function getPhoneAuthError(error) {
  const messages = {
    'auth/invalid-phone-number': 'That phone number is not valid. Check the country code and number.',
    'auth/too-many-requests': 'Too many attempts. Please wait a while before trying again.',
    'auth/quota-exceeded': 'SMS quota has been reached for this project. Try again later.',
    'auth/network-request-failed': 'Network request failed. Check your internet connection and retry.',
    'auth/invalid-verification-code': 'That code is incorrect. Check the SMS and try again.',
    'auth/code-expired': 'This code has expired. Request a new code to continue.',
    'auth/session-expired': 'This verification session has expired. Request a new code.',
    'auth/missing-client-identifier': 'Firebase app verification is not configured. Check the Android Firebase setup and SHA fingerprints.',
  };
  return messages[error.code] || `Unable to complete phone verification. ${error.message || 'Please try again.'}`;
}
