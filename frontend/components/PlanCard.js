import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../styles/theme';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function PlanCard({ plan, selected, onSelect }) {
  const { title, price, meals, total, breakdown } = plan || {};
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((e) => !e);
  };

  return (
    <View style={styles.card}>
      <View style={styles.rowTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.meta}>{breakdown || `₹${price}/meal • ${meals} meals`}</Text>
        </View>
        <TouchableOpacity onPress={onSelect} activeOpacity={0.85} style={[styles.checkbox, selected && styles.checkboxActive]}>
          {selected && <Ionicons name="checkmark" size={16} color="#fff" />}
        </TouchableOpacity>
      </View>
      <View style={styles.rowBottom}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{total}</Text>
        </View>
        <TouchableOpacity onPress={toggle} activeOpacity={0.85} style={styles.expandBtn}>
          <Text style={styles.expandText}>{expanded ? 'Hide details' : 'Details'}</Text>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
      {expanded && (
        <View style={styles.detailBox}>
          <Text style={styles.detailText}>• Flexible start date
          {'\n'}• Pause/Resume anytime
          {'\n'}• Free delivery on all days
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#F0F0F0', marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  rowTop: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  title: { fontSize: 16, fontFamily: fonts.semiBold, color: colors.textPrimary },
  meta: { fontSize: 12, fontFamily: fonts.regular, color: colors.textSecondary, marginTop: 2 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  rowBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  totalLabel: { fontSize: 12, color: colors.textSecondary, fontFamily: fonts.regular },
  totalValue: { fontSize: 18, fontFamily: fonts.bold, color: colors.textPrimary },
  expandBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  expandText: { fontFamily: fonts.semiBold, color: colors.textPrimary },
  detailBox: { marginTop: spacing.sm, backgroundColor: '#FAFAFA', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#F0F0F0' },
  detailText: { color: colors.textSecondary, fontFamily: fonts.regular, fontSize: 12, lineHeight: 18 },
});
