import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows } from '../styles/theme';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function DishCard({ dish, onAdd }) {
  const { name, price, rating = 4.5, image, emoji } = dish || {};
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        {image ? (
          <Image source={image} style={styles.thumbImg} />
        ) : (
          <View style={styles.thumbPlaceholder}><Text style={{ fontSize: 24 }}>{emoji || '🍽️'}</Text></View>
        )}
      </View>
      <View style={styles.mid}>
        <Text style={styles.title} numberOfLines={1}>{name}</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.price}>₹{price}</Text>
          <View style={styles.ratingChip}>
            <Ionicons name="star" size={12} color="#FFC107" />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        </View>
      </View>
      <View style={styles.right}>
        <TouchableOpacity style={styles.addBtn} activeOpacity={0.9} onPress={onAdd}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#F0F0F0', marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  left: { marginRight: spacing.md },
  thumbImg: { width: 72, height: 72, borderRadius: borderRadius.md },
  thumbPlaceholder: { width: 72, height: 72, borderRadius: borderRadius.md, backgroundColor: colors.cardBackground, alignItems: 'center', justifyContent: 'center' },
  mid: { flex: 1 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xs },
  title: { fontSize: 16, fontFamily: fonts.semiBold, color: colors.textPrimary },
  price: { fontSize: 16, fontFamily: fonts.bold, color: colors.primary },
  ratingChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFF7D1', borderWidth: 1, borderColor: '#FFE39A', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  ratingText: { fontSize: 12, fontFamily: fonts.medium, color: colors.textPrimary },
  right: { justifyContent: 'center', marginLeft: spacing.md },
  addBtn: { borderWidth: 1, borderColor: colors.accent, borderRadius: 12, paddingVertical: 6, paddingHorizontal: 12 },
  addBtnText: { color: colors.accent, fontFamily: fonts.semiBold, fontSize: 12 },
});
