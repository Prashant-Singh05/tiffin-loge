import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, spacing, borderRadius, shadows } from '../styles/theme';
import Ionicons from '@expo/vector-icons/Ionicons';

const RestaurantHeader = ({ restaurant, onPressCook }) => {
  const {
    name = 'Kitchen',
    bannerImage,
    timings = '10am–3pm, 7pm–9pm',
    cuisineType = 'North Indian',
    rating = 4.6,
    cookName = 'Cook',
    verified = false,
  } = restaurant || {};

  return (
    <View style={styles.wrapper}>
      <View style={styles.heroWrap}>
        {bannerImage ? (
          <ImageBackground
            source={bannerImage}
            resizeMode="cover"
            style={styles.hero}
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0.05)", "rgba(0,0,0,0)"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </ImageBackground>
        ) : (
          <LinearGradient
            colors={["#f7f7f7", "#ffffff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          />
        )}
      </View>

      <View style={styles.contentRow}>
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.title} numberOfLines={1}>{name}</Text>
            {verified && (
              <View style={styles.verifiedPill}>
                <Ionicons name="checkmark-circle" size={14} color="#fff" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
          <Text style={styles.subtext} numberOfLines={2}>
            {cuisineType} | {timings}
          </Text>
        </View>

        <View style={styles.rightCluster}>
          <View style={styles.ratingPill}>
            <Text style={styles.ratingStar}>★</Text>
            <Text style={styles.ratingText}>{Number(rating).toFixed(1)}</Text>
          </View>

          <TouchableOpacity onPress={onPressCook} activeOpacity={0.9} style={styles.cookBtn}>
            <Ionicons name="restaurant-outline" size={20} color={colors.accent} />
            <Text style={styles.cookBtnText} numberOfLines={1}>{cookName}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  heroWrap: {
    marginHorizontal: -spacing.xl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    ...shadows.card,
  },
  hero: {
    width: '100%',
    aspectRatio: 3 / 2,
    backgroundColor: colors.cardBackground,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 22, fontFamily: fonts.bold, color: colors.textPrimary, maxWidth: '80%' },
  subtext: { marginTop: 4, color: '#666', fontFamily: fonts.regular },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#34A853',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  verifiedText: { color: '#fff', fontFamily: fonts.semiBold, fontSize: 11 },
  rightCluster: { alignItems: 'flex-end', gap: 8, marginLeft: spacing.md, width: 120 },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingStar: { color: '#FFC107', marginRight: 4, fontSize: 12, fontFamily: fonts.semiBold },
  ratingText: { color: colors.textPrimary, fontFamily: fonts.semiBold, fontSize: 12 },
  cookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cookBtnText: { color: colors.textPrimary, fontFamily: fonts.semiBold },
});

export default RestaurantHeader;
