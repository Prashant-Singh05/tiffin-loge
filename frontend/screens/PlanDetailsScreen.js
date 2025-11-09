import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../styles/theme';

const PlanDetailsScreen = ({ route }) => {
  const { plan } = route.params || {};
  if (!plan) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Plan Details</Text>
        <Text style={styles.subText}>No plan provided.</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{plan.planName || plan.name}</Text>
      <Text style={styles.subText}>{plan.provider}</Text>
      <View style={styles.card}>
        <Text style={styles.row}>Price: ₹{plan.price}</Text>
        <Text style={styles.row}>Duration: {plan.duration}</Text>
        <Text style={styles.row}>Meals/Day: {plan.mealsPerDay}</Text>
        {!!plan.status && <Text style={styles.row}>Status: {plan.status}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },
  subText: {
    marginTop: spacing.xs,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  card: {
    marginTop: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  row: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
});

export default PlanDetailsScreen;
