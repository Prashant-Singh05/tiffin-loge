import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows } from '../styles/theme';
import Feather from '@expo/vector-icons/Feather';
import { AuthContext } from '../context/AuthContext';
import ShadowButton from '../components/ShadowButton';
import SafeImage from '../components/SafeImage';
import ordersData from '../data/orders';
import { useNavAnimation } from '../context/NavAnimationContext';

const OrderScreen = ({ navigation }) => {
  const { user } = React.useContext(AuthContext);
  const { handleScroll, show } = useNavAnimation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (show) show();
      return () => { if (show) show(); };
    }, [show])
  );

  const loadOrders = async () => {
    setOrders(ordersData);
    setLoading(false);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered':
        return { color: '#2ECC71', bg: '#E8F9EF', icon: 'check-circle' };
      case 'Cancelled':
        return { color: '#E74C3C', bg: '#FFECEC', icon: 'x-circle' };
      case 'Out for Delivery':
        return { color: '#3498DB', bg: '#EAF4FF', icon: 'truck' };
      case 'Preparing':
      default:
        return { color: '#F39C12', bg: '#FFF6E5', icon: 'clock' };
    }
  };

  const getStatusText = (status) => status;

  // using shared handleScroll from NavAnimationContext

  const renderOrder = ({ item }) => {
    const s = getStatusStyle(item.status);
    return (
      <TouchableOpacity activeOpacity={0.9} style={styles.orderCard}>
        {/* Header */}
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.kitchenName}>{item.provider}</Text>
            <Text style={styles.orderId}>{item.itemName}</Text>
          </View>
          <View style={[styles.statusPill, { backgroundColor: s.bg }]}> 
            <Feather name={s.icon} size={14} color={s.color} />
            <Text style={[styles.statusPillText, { color: s.color }]}>{item.status}</Text>
          </View>
        </View>

        {/* Body */}
        <Text style={styles.orderDishLine}>{item.itemName}</Text>
        <Text style={styles.orderDate}>{item.date}</Text>
        <View style={styles.divider} />

        {/* Footer */}
        <View style={styles.orderFooter}>
          <Text style={styles.orderPrice}>₹{item.amount}</Text>
          <View style={styles.actionsRight}>
            <ShadowButton title="Order Details" compact onPress={() => {}} style={[styles.cta, { marginLeft: 8 }]} />
            {item.status !== 'Delivered' && item.status !== 'Cancelled' && (
              <ShadowButton title="Track Order" compact onPress={() => {}} style={styles.cta} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyText}>No orders yet</Text>
          <Text style={styles.emptySubtext}>Start ordering to see your orders here</Text>
          <Button
            title="Browse Food"
            onPress={() => navigation.navigate('Home')}
            style={styles.browseButton}
          />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[styles.ordersList, styles.scrollPad]}
          refreshing={loading}
          onRefresh={loadOrders}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  emptyText: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  browseButton: {
    minWidth: 200,
  },
  ordersList: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  scrollPad: {
    paddingBottom: spacing.xxl + 40, // space for floating tab bar
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  kitchenName: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },
  orderId: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statusPillText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    marginLeft: 6,
  },
  orderDishLine: { color: '#777', marginTop: 4, fontFamily: fonts.regular },
  orderDate: { color: '#999', marginVertical: 6, fontFamily: fonts.regular, fontSize: 12 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#F1F1F1', marginVertical: 8 },
  orderItems: { marginBottom: spacing.md },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderPrice: { fontWeight: '700', color: '#E74C3C', fontSize: 16 },
  actionsRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cta: { minWidth: 130 },
});

export default OrderScreen;

