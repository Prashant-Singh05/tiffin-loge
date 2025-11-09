import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { colors, fonts, spacing, borderRadius, shadows } from '../styles/theme';
import SafeImage from '../components/SafeImage';
import AppButton from '../components/AppButton';
import Ionicons from '@expo/vector-icons/Ionicons';
import popularData from '../data/popular';
import subscriptionsData from '../data/subscriptions';
import { addItem, incrementQty, decrementQty } from '../store/cartSlice';
import RestaurantHeader from '../components/RestaurantHeader';
import CookDetailsSheet from '../components/CookDetailsSheet';
import ToggleButtons from '../components/ToggleButtons';
import DishCard from '../components/DishCard';
import PlanCard from '../components/PlanCard';

const toSlug = (s = '') => s.toLowerCase().replace(/\s+/g, '-');

const MenuDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { providerName = 'Kitchen', rating = 4.5, cuisine = '', distance = '' } = route.params || {};
  const providerId = toSlug(providerName);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [activeTab, setActiveTab] = useState('order'); // 'order' | 'subscribe'
  const listRef = useRef(null);
  const [cookVisible, setCookVisible] = useState(false);
  const [tab, setTab] = useState('order');
  const [selectedPlan, setSelectedPlan] = useState(null);

  const menuItems = useMemo(() => popularData.filter((p) => p.provider === providerName), [providerName]);
  const planItems = useMemo(() => subscriptionsData.filter((s) => s.provider === providerName), [providerName]);
  const recommendedDishes = useMemo(() => menuItems, [menuItems]);
  const subscriptionPlans = useMemo(() => (
    planItems.map((p) => ({
      title: p.planName,
      price: Math.round(p.price / (p.mealsPerDay * 30)),
      meals: p.mealsPerDay * 30,
      total: p.price,
      breakdown: `${p.mealsPerDay} meal/day`,
    }))
  ), [planItems]);

  const inCartQty = (id) => cartItems.find((i) => i.id === id)?.qty || 0;

  const renderItem = ({ item }) => {
    const qty = inCartQty(item.id);
    return (
      <View style={styles.card}>
        <View style={styles.left}>
          <View style={styles.thumb}>
            {item.image ? (
              <SafeImage source={item.image} style={styles.thumbImg} resizeMode="cover" />
            ) : (
              <Text style={styles.thumbEmoji}>{item.emoji || '🍽️'}</Text>
            )}
          </View>
        </View>
        <View style={styles.mid}>
          <Text style={styles.dishName}>{item.name}</Text>
          {!!item.description && (
            <Text style={styles.dishDesc} numberOfLines={2}>{item.description}</Text>
          )}
          <View style={styles.rowBetween}>
            <Text style={styles.price}>₹{item.price}</Text>
            {activeTab === 'order' && (
              <View style={styles.ratingChip}>
                <Ionicons name="star" size={12} color="#FFC107" />
                <Text style={styles.ratingText}>{item.rating?.toFixed ? item.rating.toFixed(1) : item.rating}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.right}>
          {activeTab === 'order' ? (
            qty === 0 ? (
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => dispatch(addItem({ id: item.id, name: item.name, price: item.price, image: item.image, providerId, providerName }))}
              >
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.qtyWrap}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => dispatch(decrementQty(item.id))}>
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qty}>{qty}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => dispatch(incrementQty(item.id))}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            )
          ) : (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => navigation.navigate('Subscription')}
            >
              <Text style={styles.addBtnText}>View</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const restaurant = {
    name: providerName,
    bannerImage: null,
    timings: '10am–3pm, 7pm–9pm',
    cuisineType: cuisine || 'North Indian',
    rating: rating || 4.6,
    cookName: 'Chef Anjali',
    verified: true,
  };
  const cook = {
    name: 'Chef Anjali',
    experience: 6,
    hygieneRating: 4.7,
    lastInspection: '2025-06-01',
    specialities: ['North Indian', 'Punjabi', 'Veg', 'Jain'],
    bio: 'Home chef crafting wholesome meals with fresh seasonal produce.',
    area: 'Vaishali Nagar, Jaipur',
    verifiedTill: '2026-12-31',
    totalReviews: 247,
    reviewRating: 4.8,
    safetyTags: ['Fresh Ingredients', 'Clean Utensils', 'Daily Cooking', 'Glove Usage'],
    sentimentTags: ['Great Taste', 'Fresh Daily', 'Family Friendly'],
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <RestaurantHeader restaurant={restaurant} onPressCook={() => setCookVisible(true)} />
        <View style={{ paddingHorizontal: spacing.xl, paddingTop: 20 }}>
          <ToggleButtons tab={tab} onChange={(t) => { setTab(t); listRef.current?.scrollToOffset?.({ offset: 0, animated: true }); }} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{tab === 'order' ? 'Recommended' : 'Menu Plans'}</Text>
          {tab === 'order' ? (
            <View style={{ paddingHorizontal: spacing.md }}>
              {recommendedDishes.map((d) => (
                <DishCard
                  key={d.id}
                  dish={d}
                  onAdd={() => dispatch(addItem({ id: d.id, name: d.name, price: d.price, image: d.image, providerId, providerName }))}
                />
              ))}
            </View>
          ) : (
            <View style={{ paddingHorizontal: spacing.md }}>
              {subscriptionPlans.map((p, idx) => (
                <PlanCard
                  key={`${p.title}-${idx}`}
                  plan={p}
                  selected={selectedPlan === idx}
                  onSelect={() => setSelectedPlan(idx)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      <CookDetailsSheet visible={cookVisible} onClose={() => setCookVisible(false)} cook={cook} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.xl, paddingTop: spacing.xxl },
  banner: {
    height: 140,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  bannerEmoji: { fontSize: 48 },
  title: { fontSize: 24, fontFamily: fonts.bold, color: colors.textPrimary, marginTop: spacing.md },
  subtitle: { fontSize: 14, fontFamily: fonts.regular, color: colors.textSecondary, marginTop: spacing.xs },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.sm },
  ratingChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFF7D1', borderWidth: 1, borderColor: '#FFE39A', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  ratingText: { fontSize: 12, fontFamily: fonts.medium, color: colors.textPrimary },
  distance: { fontSize: 12, fontFamily: fonts.regular, color: colors.textSecondary },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  toggleRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginVertical: 20 },
  toggleBtn: { flex: 1, borderRadius: 12, borderWidth: 1.5, height: 48, alignItems: 'center', justifyContent: 'center' },
  toggleText: { fontFamily: fonts.semiBold, fontSize: 16 },
  primaryBtn: {},
  secondaryBtn: {},

  section: { marginTop: spacing.lg },
  sectionTitle: { fontSize: 18, fontFamily: fonts.bold, color: colors.textPrimary, marginHorizontal: spacing.md, marginBottom: spacing.md },

  card: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md, ...shadows.card },
  left: { marginRight: spacing.md },
  thumb: { width: 72, height: 72, borderRadius: borderRadius.md, backgroundColor: colors.cardBackground, alignItems: 'center', justifyContent: 'center' },
  thumbImg: { width: '100%', height: '100%', borderRadius: borderRadius.md },
  thumbEmoji: { fontSize: 28, color: colors.textSecondary },
  mid: { flex: 1 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xs },
  dishName: { fontSize: 16, fontFamily: fonts.semiBold, color: colors.textPrimary },
  dishDesc: { fontSize: 12, fontFamily: fonts.regular, color: colors.textSecondary, marginTop: 2 },
  price: { fontSize: 16, fontFamily: fonts.bold, color: colors.primary },
  right: { justifyContent: 'center' },
  addBtn: { borderWidth: 1, borderColor: colors.accent, borderRadius: borderRadius.md, paddingVertical: 6, paddingHorizontal: 12 },
  addBtnText: { color: colors.accent, fontFamily: fonts.semiBold, fontSize: 12 },
  qtyWrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  qtyBtn: { width: 28, height: 28, borderRadius: borderRadius.md, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { color: colors.white, fontFamily: fonts.bold, fontSize: 16 },
  qty: { minWidth: 20, textAlign: 'center', fontFamily: fonts.semiBold, color: colors.textPrimary },
});

export default MenuDetail;
