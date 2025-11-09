import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, PanResponder, ScrollView } from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows } from '../styles/theme';
import Ionicons from '@expo/vector-icons/Ionicons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// percentage snap points: 25%, 60%, 100%
const SNAP_POINTS = [0.25, 0.6, 1];

const CookDetailsSheet = ({ visible, onClose, cook = {} }) => {
  const [snapIndex, setSnapIndex] = useState(1);
  const [translateY, setTranslateY] = useState(SCREEN_HEIGHT);
  const startYRef = useRef(0);

  const snapTo = (index) => {
    const target = SCREEN_HEIGHT * (1 - SNAP_POINTS[index]);
    setTranslateY(target);
    setSnapIndex(index);
  };

  useEffect(() => {
    if (visible) {
      snapTo(1);
    } else {
      setTranslateY(SCREEN_HEIGHT);
    }
  }, [visible]);

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 2,
    onPanResponderGrant: () => {
      startYRef.current = translateY;
    },
    onPanResponderMove: (_, g) => {
      const next = Math.min(Math.max(startYRef.current + g.dy, 0), SCREEN_HEIGHT);
      setTranslateY(next);
    },
    onPanResponderRelease: () => {
      const current = translateY;
      const openAmount = 1 - current / SCREEN_HEIGHT; // 0..1
      // If below 20% open, close completely
      if (openAmount < 0.2) {
        setTranslateY(SCREEN_HEIGHT);
        onClose?.();
        return;
      }
      // Snap to nearest snap point (no animation)
      const distances = SNAP_POINTS.map((p) => Math.abs(p - openAmount));
      const nextIdx = distances.indexOf(Math.min(...distances));
      snapTo(nextIdx);
    },
  }), [translateY]);

  const {
    name = 'Cook Name',
    avatar,
    experience = 5,
    hygieneRating = 4.7,
    lastInspection = '2025-05-02',
    specialities = ['North Indian', 'Punjabi', 'Veg', 'Jain'],
    bio = 'Passionate home chef focusing on fresh ingredients and authentic flavors.',
    area = 'Vaishali Nagar, Jaipur',
    verifiedTill = '2026-12-31',
    totalReviews = 247,
    reviewRating = 4.8,
    safetyTags = ['Fresh Ingredients', 'Clean Utensils', 'Daily Cooking', 'Glove Usage'],
    sentimentTags = ['Great Taste', 'Fresh Daily', 'Family Friendly'],
  } = cook || {};

  if (!visible) return null;

  return (
    <View style={styles.backdrop}>
      <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
      <View style={[styles.sheet, { transform: [{ translateY }] }]}> 
        {/* Drag Handle */}
        <View style={styles.handle} pointerEvents="auto" {...panResponder.panHandlers} />

        {/* Header Identity Cluster */}
        <View style={styles.identityRow}>
          <View style={styles.avatarWrap}>
            {avatar ? (
              <Image source={avatar} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cardBackground }] }>
                <Text style={{ fontFamily: fonts.bold, fontSize: 22, color: colors.textPrimary }}>
                  {name?.[0]?.toUpperCase() || 'C'}
                </Text>
              </View>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cookName}>{name}</Text>
            <Text style={styles.cookSub}>Home Chef | {experience} Years Experience</Text>
            <View style={styles.verifiedRow}>
              <View style={styles.verifiedPill}>
                <Ionicons name="checkmark-circle" size={16} color="#fff" />
                <Text style={styles.verifiedText}>Verified Cook</Text>
              </View>
              <Text style={styles.validTill}>Valid till: {verifiedTill}</Text>
            </View>
          </View>
        </View>

        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}>
          {/* Hygiene & Safety Matrix */}
          <Text style={styles.sectionTitle}>Hygiene & Safety</Text>
          <View style={styles.hygieneRow}>
            <Text style={styles.hygieneItem}>⭐ {hygieneRating}</Text>
            <Text style={styles.hygieneItem}>Last inspection: {lastInspection}</Text>
          </View>
          <View style={styles.chipsRow}>
            {safetyTags.map((t) => (
              <View key={t} style={styles.safetyChip}><Text style={styles.safetyChipText}>{t}</Text></View>
            ))}
          </View>

          {/* Cuisine Expertise */}
          <Text style={styles.sectionTitle}>Specialities</Text>
          <View style={styles.chipsRow}>
            {specialities.map((t) => (
              <View key={t} style={styles.specialChip}><Text style={styles.specialChipText}>{t}</Text></View>
            ))}
          </View>

          {/* Review Summary */}
          <View style={styles.reviewBox}>
            <Text style={styles.bigStar}>★ {reviewRating}</Text>
            <Text style={styles.reviewMeta}>{totalReviews} reviews</Text>
            <View style={[styles.chipsRow, { marginTop: 6 }]}>
              {sentimentTags.map((t) => (
                <View key={t} style={styles.badgeChip}><Text style={styles.badgeChipText}>{t}</Text></View>
              ))}
            </View>
          </View>

          {/* Mini Bio */}
          <Text style={styles.sectionTitle}>About the Cook</Text>
          <Text style={styles.bio} numberOfLines={3}>{bio}</Text>

          {/* Location */}
          <Text style={styles.sectionTitle}>Kitchen Location</Text>
          <Text style={styles.location}>{area}</Text>

          {/* Footer Actions */}
          <View style={styles.footerRow}>
            <TouchableOpacity style={[styles.footerBtn, styles.footerOutline]} activeOpacity={0.85}>
              <Text style={[styles.footerText, { color: colors.textPrimary }]}>View Full Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.footerBtn, styles.footerGhost]} activeOpacity={0.85}>
              <Text style={[styles.footerText, { color: '#999' }]}>Report Cook</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: spacing.lg,
    maxHeight: SCREEN_HEIGHT * 0.96,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  handle: { alignSelf: 'center', width: 60, height: 6, borderRadius: 3, backgroundColor: '#DDD', marginVertical: 8 },
  identityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  avatarWrap: { marginRight: spacing.md },
  avatar: { width: 84, height: 84, borderRadius: 42 },
  cookName: { fontSize: 22, fontFamily: fonts.bold, color: colors.textPrimary },
  cookSub: { color: colors.textSecondary, marginTop: 2, fontFamily: fonts.regular },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  verifiedPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#34A853', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  verifiedText: { color: '#fff', fontFamily: fonts.semiBold },
  validTill: { color: colors.textSecondary, fontFamily: fonts.regular },

  sectionTitle: { fontSize: 16, fontFamily: fonts.semiBold, color: colors.textPrimary, marginTop: spacing.md, marginBottom: 8 },
  hygieneRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  hygieneItem: { color: colors.textPrimary, fontFamily: fonts.medium },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  safetyChip: { borderWidth: 1, borderColor: '#EEEEEE', backgroundColor: '#FAFAFA', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
  safetyChipText: { color: colors.textPrimary, fontFamily: fonts.medium, fontSize: 12 },

  specialChip: { backgroundColor: '#F3F3F3', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  specialChipText: { color: colors.textPrimary, fontFamily: fonts.semiBold, fontSize: 12 },

  reviewBox: { marginTop: spacing.md, padding: spacing.md, borderRadius: borderRadius.lg, backgroundColor: colors.cardBackground },
  bigStar: { fontSize: 22, fontFamily: fonts.bold, color: colors.textPrimary },
  reviewMeta: { color: colors.textSecondary, marginTop: 2, fontFamily: fonts.regular },
  badgeChip: { borderWidth: 1, borderColor: '#EEEEEE', backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  badgeChipText: { color: colors.textPrimary, fontFamily: fonts.medium, fontSize: 12 },

  bio: { color: '#555', fontFamily: fonts.regular, lineHeight: 20 },
  location: { color: colors.textPrimary, fontFamily: fonts.medium },

  footerRow: { flexDirection: 'row', marginTop: spacing.lg, gap: 10 },
  footerBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  footerOutline: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  footerGhost: { backgroundColor: '#F7F7F7' },
  footerText: { fontFamily: fonts.semiBold },
});

export default CookDetailsSheet;
