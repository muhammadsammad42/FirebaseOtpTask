# Phone OTP Verification

A JavaScript React Native app built with Expo and React Native Firebase Authentication. It sends a real SMS verification code to the supplied phone number and confirms it with Firebase. It requires an Android native development build; it does **not** work in Expo Go.

## Features

- Pakistan (+92) selected by default, with a small country-code selector.
- Input checks and E.164 formatting before requesting Firebase verification.
- Firebase sends and verifies SMS codes; no simulated code or email flow.
- Six-digit code entry, masked destination number, resend cooldown, loading states, and Firebase/network error messages.
- Success and retry screens.

## Requirements

- Node.js LTS and npm.
- Android Studio/Android SDK and an Android device or emulator for local builds, or an Expo/EAS account for cloud builds.
- A Firebase project with Phone sign-in enabled and an Android app registered as `com.quiz4.phoneotpverification`.
- The Firebase Android configuration file `google-services.json`, placed in this project root. It is intentionally excluded from Git.

## Firebase Console setup

1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. In **Authentication → Sign-in method**, enable **Phone**.
3. In **Project settings → Your apps**, add an Android app with package name `com.quiz4.phoneotpverification`.
4. Download that Android app's `google-services.json` and place it next to `app.json` in the project root. Do not rename it.
5. Add the SHA-256 fingerprint for Play Integrity and SHA-1 fingerprint for the reCAPTCHA fallback to the Android app's SHA certificate fingerprints in Firebase. For a local debug build, get them using `cd android` then `.\gradlew signingReport` after prebuild (Windows PowerShell); for EAS, configure the Android keystore in EAS and register its SHA fingerprints. A release build may use a different key and therefore needs its own fingerprints.
6. In **Authentication → Settings → SMS region policy**, allow the regions you intend to verify (Pakistan for the default +92 flow). New Firebase projects may deny all SMS regions by default.
7. Confirm that the Firebase project has sufficient SMS quota and meets Firebase's current phone-auth requirements. Firebase may also apply per-number and per-project throttling.

### Firebase predefined test phone numbers

To test without sending SMS, open **Firebase Console → Authentication → Settings → Phone numbers for testing** and add a fictional phone number and a verification code there. Use values you configure in your own Firebase project; no test numbers or codes are present in the app.

For Android development builds, set `EXPO_PUBLIC_FIREBASE_PHONE_AUTH_TESTING=true` in an ignored `.env.local` file in the project root, then start/reload Metro. This explicit **development-only** mode disables Android app verification as Firebase documents for fictional numbers; the app marks the mode on screen. Enter the configured test number and its matching Console code in the normal input and verification flow. The number/code are not bundled in source. The app uses the same native Firebase `signInWithPhoneNumber` and confirmation APIs as it does for real numbers. No SMS is sent for Firebase's configured fictional test numbers.

Remove the flag (or set it to `false`) for real-number testing. The app only enables this setting in Android development (`__DEV__`); production builds always keep app verification enabled. Never use test mode for real numbers or configure a real person's number as a fictional test number. Remove test entries or use a real number for the final SMS demonstration.

## Install and run on Android

From the project directory:

```sh
npm install
npx expo install --fix
npx expo prebuild --platform android
npx expo run:android
```

Use an Android device with USB debugging enabled or a running Android emulator. `expo run:android` builds and installs the native app. After the first native build, use `npx expo start --dev-client` to start Metro for subsequent JavaScript changes. Rebuild the native app after changing native dependencies, app plugins, package name, or Firebase configuration.

### Cloud development build (optional)

```sh
npm install
npx expo install --fix
npm install --global eas-cli
eas login
eas build:configure
eas build --platform android --profile development
```

Because `google-services.json` is Git-ignored, create a secret **file** environment variable named `GOOGLE_SERVICES_JSON` in the matching EAS environment (`development` for the development profile) and upload the file in the Expo dashboard. `app.config.js` uses its path during cloud builds; local builds use the root `google-services.json`. If you build with `preview` or `production`, add the same file variable to that profile's environment. Never commit signing keys or private credentials. Install the generated development APK on a device, then run `npx expo start --dev-client`.

To test configured Firebase numbers, create a local `.env.local` containing:

```env
EXPO_PUBLIC_FIREBASE_PHONE_AUTH_TESTING=true
```

Then start Metro with `npx expo start --dev-client` and reload the development app. Remove the flag or set it to `false` before testing a real SMS number. `.env.local` is ignored by Git.

## Actual SMS demonstration

1. Complete all Firebase Console steps above and ensure `google-services.json` matches the configured package name.
2. Build and install a development APK (local or EAS). Expo Go cannot load React Native Firebase native modules.
3. Ensure `EXPO_PUBLIC_FIREBASE_PHONE_AUTH_TESTING` is unset or `false`. Use a real phone number in E.164-compatible form. For Pakistan, enter a mobile number such as `3001234567` or `03001234567`; the app converts it to `+923001234567`. If a number is configured as a Firebase test number, Firebase will use its configured test code instead and will not send an SMS.
4. Tap **Send OTP**, receive the SMS, enter the current six-digit code, and tap **Verify OTP**.
5. If SMS does not arrive, check Firebase Auth phone settings, package name, signing SHA-1/SHA-256, network connectivity, quota/throttling, and Firebase console logs. Firebase may block or rate-limit requests. Never share a verification code.

## Project layout

```text
App.js
app.json
components/
  CustomButton.js
  OTPInput.js
  PhoneInput.js
screens/
  FailureScreen.js
  OTPScreen.js
  PhoneNumberScreen.js
  SuccessScreen.js
services/
  firebase.js
```

## Testing checklist

- Invalid and valid Pakistan phone number formats.
- An Android development build with Firebase test-phone mode enabled, using a Firebase Console-configured fictional phone number and its matching code (no SMS expected); repeat with mode off for real SMS.
- Real SMS request and correct code on a configured physical device.
- Incorrect and expired codes, then retry/request a fresh code.
- Resend disabled during its cooldown and available afterwards.
- Offline/network failure, invalid number, quota, and throttling errors.

Real SMS delivery and Firebase credentials cannot be verified from an unconfigured workspace. Firebase's predefined test phone numbers work through the same Firebase phone-auth flow; use them for development checks, and verify actual SMS delivery with a real phone number for the final demonstration.

## Official documentation

- [Expo: Using Firebase](https://docs.expo.dev/guides/using-firebase/)
- [Expo: Development builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [Expo: Environment variables](https://docs.expo.dev/guides/environment-variables/)
- [Firebase: Phone authentication on Android](https://firebase.google.com/docs/auth/android/phone-auth)
- [Firebase: Phone authentication and test numbers](https://firebase.google.com/docs/auth/web/phone-auth)

## GitHub submission

```sh
git init
git add .
git status
git commit -m "Build Firebase phone OTP verification app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Before pushing, confirm that `google-services.json`, signing credentials, and other private files are not staged. The provided `.gitignore` excludes them.
