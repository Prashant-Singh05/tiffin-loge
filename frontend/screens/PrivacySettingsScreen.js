import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../styles/theme';

const PrivacySettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Privacy Settings</Text>
      <Text style={styles.sub}>This is a placeholder screen. Configure your privacy options here.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, padding: spacing.xl, paddingTop: spacing.xxl },
  title: { fontSize: 22, fontFamily: fonts.bold, color: colors.textPrimary, marginBottom: spacing.md },
  sub: { fontSize: 14, fontFamily: fonts.regular, color: colors.textSecondary },
});

export default PrivacySettingsScreen;
