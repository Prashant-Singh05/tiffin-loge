import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows } from '../styles/theme';
import { AuthContext } from '../context/AuthContext';
import SafeImage from '../components/SafeImage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavAnimation } from '../context/NavAnimationContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import offersData from '../data/offers';
import categoriesData from '../data/categories';
import popularData from '../data/popular';
import nearYouData from '../data/nearYou';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { user } = React.useContext(AuthContext);
  const { handleScroll, show } = useNavAnimation();
  const insets = useSafeAreaInsets();
  const contentPad = {
    paddingTop: Math.max(insets.top + 10, 16),
    paddingBottom: 120,
    backgroundColor: colors.white,
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [offers, setOffers] = useState([]);
  const [popular, setPopular] = useState([]);
  const [nearYou, setNearYou] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (show) show();
      return () => {
        if (show) show();
      };
    }, [show])
  );

  const loadData = async () => {
    // Load local dummy data
    setOffers(offersData);
    setPopular(popularData);
    setNearYou(nearYouData);
    setLoading(false);
  };

  // using shared handleScroll from NavAnimationContext

  const categories = categoriesData;

  const renderOffer = ({ item }) => (
    <View style={styles.offerCard}>
      {item.image ? (
        <SafeImage source={item.image} style={styles.offerImage} resizeMode="contain" />
      ) : (
        <Text style={styles.offerEmoji}>{item.emoji || '🎉'}</Text>
      )}
      <Text style={styles.offerTitle}>{item.title}</Text>
      {!!item.description && <Text style={styles.offerDesc}>{item.description}</Text>}
      <TouchableOpacity style={styles.offerCta}>
        <Text style={styles.offerCtaText}>Order Now</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryCard}>
      {item.icon ? (
        <SafeImage source={item.icon} style={styles.categoryImage} resizeMode="contain" />
      ) : (
        <Text style={styles.categoryEmoji}>{item.emoji || '🍽️'}</Text>
      )}
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderPopular = ({ item }) => (
    <TouchableOpacity
      style={styles.kitchenCard}
      onPress={() =>
        navigation.navigate('MenuDetail', {
          providerName: item.provider,
          rating: item.rating,
          cuisine: item.description?.split(',')[0] || '',
        })
      }
    >
      <View style={styles.kitchenImage}>
        {item.image ? (
          <SafeImage source={item.image} style={styles.kitchenImageContent} resizeMode="cover" />
        ) : (
          <Text style={styles.kitchenImagePlaceholder}>{item.emoji || '🍱'}</Text>
        )}
      </View>
      <View style={styles.kitchenInfo}>
        <Text style={styles.kitchenName}>{item.name}</Text>
        <View style={styles.kitchenRating}>
          <View style={styles.ratingChip}>
            <Ionicons name="star" size={12} color="#FFC107" />
            <Text style={styles.ratingChipText}>{item.rating?.toFixed ? item.rating.toFixed(1) : item.rating}</Text>
          </View>
          <Text style={styles.ratingCount}>({item.provider})</Text>
        </View>
        <Text style={styles.kitchenDescription} numberOfLines={2}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={contentPad}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Foodie'} 👋</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color={colors.primary} />
              <Text style={styles.location}>Jaipur, Rajasthan</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchInputWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search meals, kitchens..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          </View>
        </View>

        {/* Today's Offers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Offers</Text>
          <FlatList
            data={offers}
            renderItem={renderOffer}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.offersList}
          />
        </View>
        

        {/* Categories */}
        <View style={[styles.section, styles.sectionGap]}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Popular */}
        <View style={[styles.section, styles.sectionGap, styles.sectionBottomGap]}>
          <Text style={styles.sectionTitle}>Popular</Text>
          <FlatList
            data={popular}
            renderItem={renderPopular}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.kitchensList}
          />
        </View>
        {/* Optional subtle divider */}
        <View style={styles.softDivider} />

        {/* Near You */}
        <View style={[styles.section, styles.sectionGap, styles.nearYouPad]}>
          <Text style={styles.sectionTitle}>Near You</Text>
          {nearYou.map((kitchen) => (
            <TouchableOpacity
              key={kitchen.id}
              style={styles.nearYouCard}
              onPress={() =>
                navigation.navigate('MenuDetail', {
                  providerName: kitchen.name,
                  rating: kitchen.rating,
                  cuisine: kitchen.cuisine,
                  distance: kitchen.distance,
                })
              }
            >
              <View style={styles.nearYouImage}>
                {kitchen.image ? (
                  <SafeImage source={kitchen.image} style={styles.nearYouImageContent} resizeMode="cover" />
                ) : (
                  <Text style={styles.nearYouImagePlaceholder}>{kitchen.emoji || '🍱'}</Text>
                )}
              </View>
              <View style={styles.nearYouInfo}>
                <Text style={styles.nearYouName}>{kitchen.name}</Text>
                <View style={styles.nearYouRating}>
                  <View style={styles.ratingChip}>
                    <Ionicons name="star" size={12} color="#FFC107" />
                    <Text style={styles.ratingChipText}>{kitchen.rating?.toFixed ? kitchen.rating.toFixed(1) : kitchen.rating}</Text>
                  </View>
                  <Text style={styles.distance}>{kitchen.distance}</Text>
                </View>
                <Text style={styles.nearYouDescription} numberOfLines={1}>
                  {kitchen.cuisine}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  greeting: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  location: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  searchSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  searchInputWrapper: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  searchInput: {
    height: 40,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
  },
  searchIcon: { position: 'absolute', right: spacing.md, top: 10 },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  offersList: {
    paddingHorizontal: spacing.md,
    paddingRight: 16,
    marginBottom: 20,
  },
  offerCard: {
    width: 260,
    height: 150,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    ...shadows.small,
  },
  offerIcon: {
    fontSize: 50,
    marginBottom: spacing.sm,
  },
  offerImage: {
    width: '100%',
    height: 100,
    marginBottom: spacing.sm,
  },
  offerEmoji: {
    fontSize: 42,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  offerTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  offerDesc: {
    marginTop: spacing.xs,
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  offerCta: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
  },
  offerCtaText: { color: colors.white, fontFamily: fonts.medium, fontSize: 12 },
  categoriesList: {
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: spacing.md,
    backgroundColor: 'rgba(230,162,110,0.08)',
    borderRadius: 999,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    minWidth: 80,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: spacing.xs,
  },
  categoryImage: {
    width: 40,
    height: 40,
    marginBottom: spacing.xs,
  },
  categoryEmoji: { fontSize: 28, marginBottom: spacing.xs },
  categoryName: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
  },
  kitchensList: {
    paddingHorizontal: spacing.md,
  },
  kitchenCard: {
    width: width - spacing.xl,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginRight: spacing.md,
    overflow: 'hidden',
    flexDirection: 'row',
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.card,
  },
  kitchenImage: {
    width: 84,
    height: 84,
    borderRadius: borderRadius.md,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  kitchenImageContent: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.md,
  },
  kitchenImagePlaceholder: {
    fontSize: 28,
    color: colors.textSecondary,
  },
  kitchenInfo: {
    flex: 1,
  },
  kitchenName: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },
  kitchenRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7D1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FFE39A',
  },
  ratingChipText: { fontSize: 12, fontFamily: fonts.medium, color: colors.textPrimary },
  ratingCount: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  kitchenDescription: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  nearYouCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.card,
  },
  nearYouImage: {
    width: 84,
    height: 84,
    borderRadius: borderRadius.md,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  nearYouImageContent: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.md,
  },
  nearYouImagePlaceholder: {
    fontSize: 28,
    color: colors.textSecondary,
  },
  nearYouInfo: {
    flex: 1,
  },
  nearYouName: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },
  nearYouRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  distance: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  separator: { height: 16, opacity: 0.001 },
  sectionGap: { marginTop: 24 },
  sectionBottomGap: { marginBottom: 24 },
  nearYouPad: { paddingBottom: 100 },
  softDivider: {
    height: 1,
    backgroundColor: '#F1F1F1',
    marginHorizontal: spacing.md,
    marginVertical: 16,
  },
});

export default HomeScreen;

