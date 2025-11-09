import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../styles/theme';

const mockAddresses = [
  { id: '1', label: 'Home', details: '221B Baker Street, London' },
  { id: '2', label: 'Work', details: '5th Avenue, New York' },
];

const ManageAddressScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardTitle}>{item.label}</Text>
        <Text style={styles.cardSub}>{item.details}</Text>
      </View>
      <TouchableOpacity style={styles.editBtn}>
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockAddresses}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: spacing.lg }}
        renderItem={renderItem}
      />
      <TouchableOpacity style={styles.addBtn}>
        <Text style={styles.addText}>Add New Address</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardLeft: {
    flexShrink: 1,
    paddingRight: spacing.md,
  },
  cardTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  cardSub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  editBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
  },
  editText: {
    fontFamily: fonts.medium,
    color: colors.textPrimary,
  },
  addBtn: {
    margin: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  addText: {
    color: colors.white,
    fontFamily: fonts.semiBold,
    fontSize: 16,
  },
});

export default ManageAddressScreen;
