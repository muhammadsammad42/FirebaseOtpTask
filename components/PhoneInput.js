import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const COUNTRY_CODES = [
  { name: 'Pakistan', dial: '+92', flag: '🇵🇰' },
  { name: 'United States', dial: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { name: 'India', dial: '+91', flag: '🇮🇳' },
];

export default function PhoneInput({ value, onChangeText, country, onSelectCountry, error }) {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <Text style={styles.label}>Mobile number</Text>
      <View style={[styles.field, error && styles.fieldError]}>
        <Pressable style={styles.country} onPress={() => setVisible(true)} accessibilityRole="button">
          <Text style={styles.flag}>{country.flag}</Text>
          <Text style={styles.dial}>{country.dial}</Text>
          <Text style={styles.chevron}>⌄</Text>
        </Pressable>
        <TextInput
          accessibilityLabel="Phone number"
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType="phone-pad"
          placeholder={country.dial === '+92' ? '3XX XXXXXXX' : 'Phone number'}
          placeholderTextColor="#A0A9B8"
          maxLength={16}
          returnKeyType="done"
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : <Text style={styles.hint}>Enter your number without the country code.</Text>}

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Select country</Text>
            {COUNTRY_CODES.map((option) => (
              <Pressable
                key={option.dial}
                style={styles.option}
                onPress={() => {
                  onSelectCountry(option);
                  setVisible(false);
                }}
              >
                <Text style={styles.optionText}>{option.flag}  {option.name}</Text>
                <Text style={styles.optionDial}>{option.dial}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: '#26354A', fontSize: 14, fontWeight: '700', marginBottom: 9 },
  field: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCE4EF',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
  },
  fieldError: { borderColor: '#D14343' },
  country: { flexDirection: 'row', alignItems: 'center', paddingRight: 12, marginRight: 10, borderRightWidth: 1, borderColor: '#E4EAF2' },
  flag: { fontSize: 19, marginRight: 5 },
  dial: { color: '#26354A', fontWeight: '700', fontSize: 15 },
  chevron: { color: '#718096', fontSize: 17, marginLeft: 5, marginTop: -4 },
  input: { flex: 1, color: '#17263C', fontSize: 16, minHeight: 56 },
  error: { color: '#B42318', fontSize: 13, marginTop: 7 },
  hint: { color: '#748198', fontSize: 13, marginTop: 7 },
  overlay: { flex: 1, backgroundColor: 'rgba(20,35,55,0.35)', justifyContent: 'center', padding: 28 },
  sheet: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 20 },
  sheetTitle: { fontSize: 18, color: '#17263C', fontWeight: '700', marginBottom: 10 },
  option: { minHeight: 49, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E5EAF1' },
  optionText: { color: '#26354A', fontSize: 15 },
  optionDial: { color: '#65758B', fontWeight: '600' },
});
