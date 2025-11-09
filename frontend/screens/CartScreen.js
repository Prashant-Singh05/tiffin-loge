import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows } from '../styles/theme';
import { AuthContext } from '../context/AuthContext';
import ShadowButton from '../components/ShadowButton';
import { useDispatch, useSelector } from 'react-redux';
import { incrementQty, decrementQty, removeItem, clearCart } from '../store/cartSlice';

const CartScreen = ({ navigation }) => {
  const { user } = React.useContext(AuthContext);
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart);
  const cart = cartState.items.map((i) => ({
    itemId: i.id,
    name: i.name,
    price: i.price,
    qty: i.qty,
    providerId: i.providerId,
    providerName: i.providerName,
    image: i.image,
  }));
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const calculateTotals = () => {
    let subtotal = 0;
    cart.forEach((item) => {
      subtotal += item.price * item.qty;
    });
    const tax = subtotal * 0.05; // 5% tax
    const deliveryFee = 30; // Fixed delivery fee
    const total = subtotal + tax + deliveryFee - discount;
    return { subtotal, tax, deliveryFee, total };
  };

  const { subtotal, tax, deliveryFee, total } = calculateTotals();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setTimeout(() => {
      // simulate flat ₹20 off
      setDiscount(20);
      setApplyingCoupon(false);
      alert('Coupon applied: ₹20 off');
    }, 500);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) dispatch(removeItem(itemId));
    else if (newQuantity === 1) {/* no-op, state already 1 if called from - */}
  };

  const handleProceedToPay = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    // Simulate payment
    alert('Processing payment...');
    setTimeout(() => {
      alert('Payment successful! Order placed.');
      dispatch(clearCart());
      navigation.navigate('Order');
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cart</Text>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubtext}>Add items to your cart to continue</Text>
          <Button
            title="Browse Food"
            onPress={() => navigation.navigate('Home')}
            style={styles.browseButton}
          />
        </View>
      ) : (
        <>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {cart.map((item) => (
              <View key={item.itemId} style={styles.cartItem}>
                <View style={styles.itemImage}>
                  <Text style={styles.itemImagePlaceholder}>🍱</Text>
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemKitchen}>{item.providerName}</Text>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => dispatch(decrementQty(item.itemId))}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.qty}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => dispatch(incrementQty(item.itemId))}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => dispatch(removeItem(item.itemId))}
                  >
                    <Text style={styles.removeButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Coupon Section */}
            <View style={styles.couponSection}>
              <Text style={styles.sectionTitle}>Apply Coupon</Text>
              <View style={styles.couponInputContainer}>
                <TextInput
                  style={styles.couponInput}
                  placeholder="Enter coupon code"
                  placeholderTextColor={colors.textSecondary}
                  value={couponCode}
                  onChangeText={setCouponCode}
                />
                <Button
                  title="Apply"
                  onPress={handleApplyCoupon}
                  loading={applyingCoupon}
                  style={styles.applyButton}
                />
              </View>
            </View>

            {/* Summary */}
            <View style={styles.summary}>
              <Text style={styles.sectionTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax (5%)</Text>
                <Text style={styles.summaryValue}>₹{tax.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>₹{deliveryFee.toFixed(2)}</Text>
              </View>
              {discount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, styles.discountLabel]}>Discount</Text>
                  <Text style={[styles.summaryValue, styles.discountValue]}>
                    -₹{discount.toFixed(2)}
                  </Text>
                </View>
              )}
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
              </View>
            </View>

            {/* Delivery Time */}
            <View style={styles.deliveryTime}>
              <Text style={styles.deliveryTimeText}>
                ⏱️ Estimated delivery time: 30-45 minutes
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <ShadowButton title="Proceed to Pay" onPress={handleProceedToPay} />
          </View>
        </>
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
  content: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  itemImagePlaceholder: {
    fontSize: 40,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  itemKitchen: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  quantity: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    minWidth: 30,
    textAlign: 'center',
  },
  removeButton: {
    padding: spacing.xs,
  },
  removeButtonText: {
    fontSize: 20,
  },
  couponSection: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  couponInputContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
  },
  applyButton: {
    minWidth: 100,
  },
  summary: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
  },
  discountLabel: {
    color: colors.success,
  },
  discountValue: {
    color: colors.success,
  },
  totalRow: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  deliveryTime: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.info + '20',
    borderRadius: borderRadius.lg,
  },
  deliveryTimeText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.info,
    textAlign: 'center',
  },
  footer: {
    padding: spacing.xl,
    backgroundColor: colors.white,
    ...shadows.medium,
  },
});

export default CartScreen;

