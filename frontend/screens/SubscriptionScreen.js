import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Animated,
} from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows } from '../styles/theme';
import { AuthContext } from '../context/AuthContext';
import { useNavAnimation } from '../context/NavAnimationContext';
import AppButton from '../components/AppButton';
import ShadowButton from '../components/ShadowButton';
import subscriptionsData from '../data/subscriptions';
import { useScrollDirection } from '../context/ScrollContext';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';

const SubscriptionScreen = ({ navigation }) => {
  const { user } = React.useContext(AuthContext);
  const { handleScroll, show } = useNavAnimation();
  const dispatch = useDispatch();
  const [plans, setPlans] = useState([]);
  const [userPlans, setUserPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [pendingPlan, setPendingPlan] = useState(null); // the new plan card user tapped
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('12:30 PM');
  const sheetY = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    setPlans(subscriptionsData.filter((p) => p.status === 'New Plan'));
    setUserPlans(
      subscriptionsData.filter((p) => p.status === 'Active' || p.status === 'Expired')
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    if (modalVisible) {
      Animated.spring(sheetY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 18,
        stiffness: 180,
      }).start();
    } else {
      Animated.timing(sheetY, {
        toValue: 300,
        duration: 180,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible, sheetY]);

  useFocusEffect(
    React.useCallback(() => {
      if (show) show();
      return () => { if (show) show(); };
    }, [show])
  );

  const loadPlans = async () => {};
  const loadUserPlans = async () => {};

  const filteredPlans = userPlans.filter((plan) => {
    if (activeTab === 'active') return plan.status === 'Active';
    if (activeTab === 'expired') return plan.status === 'Expired';
    return true;
  });

  // use shared handleScroll from NavAnimationContext

  const renderPlan = ({ item }) => {
    const plan = { name: item.planName, price: item.price, duration: item.duration, mealsPerDay: item.mealsPerDay };
    const kitchen = { name: item.provider };
    const isActive = item.status === 'Active';
    const isExpired = item.status === 'Expired';

    return (
      <View style={[styles.planCard, isExpired && styles.expiredCard]}>
        <View style={styles.planHeader}>
          <View>
            <Text style={styles.kitchenName}>{kitchen.name || 'Kitchen Name'}</Text>
            <Text style={styles.planType}>{plan.name || 'Regular'} Plan</Text>
          </View>
          <View style={[styles.statusBadge, isActive && styles.activeBadge, isExpired && styles.expiredBadge]}>
            <Text style={[styles.statusText, isActive && styles.activeText, isExpired && styles.expiredText]}>
              {(item.status || 'ACTIVE').toUpperCase()}
            </Text>
          </View>
        </View>
        
        <View style={styles.planDetails}>
          <Text style={styles.planPrice}>₹{plan.price || 0}/month</Text>
          <Text style={styles.planDuration}>{plan.duration || 30} days • {plan.mealsPerDay || 1} meal/day</Text>
        </View>

        <View style={styles.planDates}>
          <Text style={styles.dateLabel}>Meals/Day: {plan.mealsPerDay}</Text>
          <Text style={styles.dateLabel}>{plan.duration}</Text>
        </View>

        {!isExpired && (
          <ShadowButton
            title="Manage Plan"
            onPress={() => navigation.navigate('PlanDetails', { plan: item })}
            style={styles.manageButton}
          />
        )}
      </View>
    );
  };

  const renderNewPlan = ({ item }) => (
    <TouchableOpacity
      style={styles.newPlanCard}
      onPress={() => {}}
    >
      <View style={styles.newPlanHeader}>
        <Text style={styles.newPlanKitchen}>{item.provider}</Text>
        <Text style={styles.newPlanType}>{item.planName}</Text>
      </View>
      <View style={styles.newPlanPrice}>
        <Text style={styles.priceAmount}>₹{item.price}</Text>
        <Text style={styles.pricePeriod}>/month</Text>
      </View>
      <Text style={styles.newPlanDescription} numberOfLines={2}>
        {`${item.duration} • ${item.mealsPerDay} meal/day`}
      </Text>
      <AppButton
        title="Subscribe"
        type="secondary"
        onPress={() => {
          setPendingPlan(item);
          setSelectedChoice(null);
          setSelectedDate('Today');
          setSelectedTime('12:30 PM');
          setModalVisible(true);
        }}
        style={styles.subscribeButton}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Subscriptions</Text>
      </View>

      <View style={styles.tabsContainer}>
        <View style={styles.tabsPill}>
          <TouchableOpacity
            style={[styles.pillTab, activeTab === 'active' && styles.pillTabActive]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.pillText, activeTab === 'active' && styles.pillTextActive]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pillTab, activeTab === 'expired' && styles.pillTabActive]}
            onPress={() => setActiveTab('expired')}
          >
            <Text style={[styles.pillText, activeTab === 'expired' && styles.pillTextActive]}>Expired</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pillTab, activeTab === 'new' && styles.pillTabActive]}
            onPress={() => setActiveTab('new')}
          >
            <Text style={[styles.pillText, activeTab === 'new' && styles.pillTextActive]}>New Plans</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollPad}
      >
        {activeTab === 'new' ? (
          <>
            <Text style={styles.sectionTitle}>Available Plans</Text>
            <FlatList
              data={plans}
              renderItem={renderNewPlan}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </>
        ) : (
          <>
            {filteredPlans.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No {activeTab} subscriptions found
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredPlans}
                renderItem={renderPlan}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            )}
          </>
        )}
      </ScrollView>

      {/* Bottom Sheet Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.sheetTitle}>Choose Your Plan</Text>
              {[{ label: '7 days Meal Plan', price: 770, meals: 7 }, { label: 'Monthly Meal Plan', price: 2699, meals: 30 }, { label: '2 Month Meal Plan', price: 5000, meals: 60 }].map((p, idx) => {
                const active = selectedChoice === idx;
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setSelectedChoice(idx)}
                    style={[styles.planChoice, { borderColor: active ? colors.accent : colors.border }]}
                    activeOpacity={0.8}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View>
                        <Text style={styles.choiceName}>{p.label}</Text>
                        <Text style={styles.choiceMeta}>₹{p.price} • {p.meals} Full Meals</Text>
                      </View>
                      <View style={[styles.choiceRadio, { borderColor: active ? colors.accent : colors.border, backgroundColor: active ? colors.accent : 'transparent' }]} />
                    </View>
                  </TouchableOpacity>
                );
              })}

              {/* Date & Time */}
              <View style={{ marginTop: spacing.lg }}>
                <Text style={styles.subTitle}>Select Date & Time</Text>
                <View style={styles.selectorRow}>
                  {['Today', 'Tomorrow', 'Mon'].map((d) => (
                    <TouchableOpacity
                      key={d}
                      onPress={() => setSelectedDate(d)}
                      style={[styles.pill, selectedDate === d && styles.pillActive]}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.pillText, selectedDate === d && styles.pillTextActive]}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={[styles.selectorRow, { marginTop: spacing.sm }]}>
                  {['12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM'].map((t) => (
                    <TouchableOpacity
                      key={t}
                      onPress={() => setSelectedTime(t)}
                      style={[styles.pill, selectedTime === t && styles.pillActive]}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.pillText, selectedTime === t && styles.pillTextActive]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.sheetFooter}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.footerBtn, styles.footerBtnOutline]}
                activeOpacity={0.8}
              >
                <Text style={[styles.footerBtnText, { color: colors.accent }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (pendingPlan && selectedChoice !== null) {
                    const options = [
                      { label: '7d', days: 7, price: 770 },
                      { label: '30d', days: 30, price: 2699 },
                      { label: '60d', days: 60, price: 5000 },
                    ];
                    const choice = options[selectedChoice];
                    dispatch(addItem({
                      id: `${pendingPlan.id || pendingPlan.provider}-${choice.days}`,
                      name: `${pendingPlan.planName} • ${choice.days} days`,
                      price: choice.price,
                      image: null,
                      providerId: pendingPlan.providerId || pendingPlan.provider || 'subscription',
                      providerName: pendingPlan.provider,
                    }));
                  }
                  setModalVisible(false);
                }}
                style={[styles.footerBtn, { backgroundColor: colors.accent }]}
                activeOpacity={0.8}
              >
                <Text style={[styles.footerBtnText, { color: colors.white }]}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },
  tabsContainer: { paddingHorizontal: spacing.md, marginBottom: spacing.md },
  tabsPill: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 999,
  },
  pillTabActive: {
    backgroundColor: colors.white,
    ...shadows.small,
  },
  pillText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  pillTextActive: {
    color: colors.textPrimary,
    fontFamily: fonts.semiBold,
  },
  content: {
    flex: 1,
  },
  scrollPad: {
    paddingBottom: spacing.xxl + 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  planCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  expiredCard: {
    opacity: 0.6,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  kitchenName: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },
  planType: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.secondary,
  },
  activeBadge: {
    backgroundColor: '#3CCB68',
  },
  expiredBadge: {
    backgroundColor: colors.textSecondary,
  },
  statusText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },
  activeText: {
    color: colors.white,
  },
  expiredText: {
    color: colors.white,
  },
  planDetails: {
    marginBottom: spacing.md,
  },
  planPrice: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  planDuration: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  planDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  dateLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  manageButton: {
    marginTop: spacing.sm,
  },
  newPlanCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  newPlanHeader: {
    marginBottom: spacing.md,
  },
  newPlanKitchen: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },
  newPlanType: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  newPlanPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
  priceAmount: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  pricePeriod: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  newPlanDescription: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  subscribeButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '90%',
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  planChoice: {
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 15,
    marginVertical: 8,
  },
  choiceName: { fontSize: 16, fontFamily: fonts.semiBold, color: colors.textPrimary },
  choiceMeta: { color: '#777', marginTop: 4, fontFamily: fonts.regular },
  choiceRadio: { width: 18, height: 18, borderWidth: 2, borderRadius: 9 },
  subTitle: { fontSize: 16, fontFamily: fonts.semiBold, color: colors.textPrimary, marginBottom: 8 },
  selectorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  pillActive: { backgroundColor: '#FFF3E8', borderColor: colors.accent },
  pillText: { fontSize: 13, fontFamily: fonts.medium, color: colors.textSecondary },
  pillTextActive: { color: colors.accent, fontFamily: fonts.semiBold },
  sheetFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  footerBtn: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  footerBtnOutline: { borderWidth: 1.5, borderColor: colors.accent, marginRight: 10 },
});

export default SubscriptionScreen;

