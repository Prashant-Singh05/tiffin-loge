import React, { useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows } from '../styles/theme';
import { AuthContext } from '../context/AuthContext';
import { useNavAnimation } from '../context/NavAnimationContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AppButton from '../components/AppButton';
import ShadowButton from '../components/ShadowButton';

const ProfileScreen = ({ navigation }) => {
  const { user: authUser, logout } = React.useContext(AuthContext);
  const { handleScroll, show } = useNavAnimation();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editVisible, setEditVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [avatarUri, setAvatarUri] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      if (show) show();
      return () => { if (show) show(); };
    }, [show])
  );

  const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://172.16.63.129:5000/api';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const id = authUser?._id || authUser?.id || 'me';
        const res = await axios.get(`${API_BASE}/user/${id}`);
        const u = res.data?.user || res.data;
        setUser(u);
        setForm({
          name: u?.name || '',
          email: u?.email || '',
          phone: u?.phone || '',
          address: u?.address || '',
        });
        setAvatarUri(u?.avatar || '');
      } catch (e) {
        console.warn('Profile fetch failed:', e?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatarUri(uri);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setUploading(true);
    try {
      const id = user._id || user.id || 'me';
      const isLocal = avatarUri && (avatarUri.startsWith('file:') || avatarUri.startsWith('content:'));
      if (isLocal) {
        const fd = new FormData();
        fd.append('avatar', {
          uri: avatarUri,
          name: 'avatar.jpg',
          type: 'image/jpeg',
        });
        // optionally include fields
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        await axios.put(`${API_BASE}/user/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await axios.put(`${API_BASE}/user/${id}`, form);
      }
      setUser({ ...user, ...form, avatar: avatarUri || user?.avatar });
      Alert.alert('Success', 'Profile updated successfully');
      setEditVisible(false);
    } catch (e) {
      console.warn('Profile update failed:', e?.message);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.replace('Auth');
        },
      },
    ]);
  };

  const renderOption = (icon, title, screen) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(screen)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 0.4,
        borderBottomColor: '#E2E2E2',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name={icon} size={22} color="#535353" style={{ marginRight: 12 }} />
        <Text style={{ fontSize: 16, color: '#000', fontWeight: '500' }}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollPad}
      >
        {/* Header */}
        <LinearGradient
          colors={["#FF5F6D", "#FFC371"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.headerGrad,
            {
              height: 260 + insets.top,
              paddingTop: insets.top + 40,
              justifyContent: 'flex-end',
              paddingBottom: 30,
              borderBottomLeftRadius: 28,
              borderBottomRightRadius: 28,
            },
          ]}
        >
          <TouchableOpacity onPress={pickImage} activeOpacity={0.9} style={styles.avatarWrap}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarSeed}><Text style={styles.avatarSeedTxt}>{(user?.name||'U').charAt(0).toUpperCase()}</Text></View>
            )}
            <Ionicons name="pencil" size={14} color={colors.primary} style={styles.editBadge} />
          </TouchableOpacity>
          <Text style={[styles.userName, { color: colors.white }]}>{user?.name || 'User'}</Text>
          <Text style={[styles.userEmail, { color: colors.white, opacity: 0.9 }]}>{user?.email || ''}</Text>
          <TouchableOpacity
            onPress={() => setEditVisible(true)}
            activeOpacity={0.7}
            style={{
              marginTop: 12,
              marginBottom: 16,
              borderWidth: 1.5,
              borderColor: '#fff',
              borderRadius: 20,
              paddingVertical: 6,
              paddingHorizontal: 20,
              backgroundColor: 'transparent',
              alignSelf: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontFamily: fonts.semiBold, fontSize: 14 }}>Edit Profile</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Plan Card */}
        <View style={styles.planCard}>
          <Text style={styles.planTitle}>Current Plan</Text>
          <Text style={styles.planSub}>Premium Veg Plan</Text>
          <Text style={styles.planMeta}>Next Delivery: Tomorrow, 12:30 PM</Text>
          <View style={{ marginTop: spacing.md }}>
            <ShadowButton title="Manage Plan" onPress={() => navigation.navigate('Subscription')} />
          </View>
        </View>

        {/* Options */}
        <View style={{ marginTop: spacing.xl, paddingHorizontal: spacing.lg }}>
          {renderOption('receipt-outline', 'My Orders', 'Order')}
          {renderOption('card-outline', 'Payment & Refunds', 'PaymentRefunds')}
          {renderOption('lock-closed-outline', 'Privacy Settings', 'PrivacySettings')}
          {renderOption('help-circle-outline', 'Help & Support', 'HelpSupport')}
          <TouchableOpacity onPress={handleLogout} style={{ marginTop: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="log-out-outline" size={22} color={colors.primary} style={{ marginRight: 12 }} />
              <Text style={{ color: colors.primary, fontSize: 16, fontFamily: fonts.semiBold }}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Edit Modal */}
        <Modal visible={editVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              {['name', 'email', 'phone', 'address'].map((field) => (
                <TextInput
                  key={field}
                  value={form[field]}
                  onChangeText={(t) => setForm({ ...form, [field]: t })}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  style={styles.input}
                  placeholderTextColor={colors.textSecondary}
                />
              ))}
              <View style={{ marginTop: spacing.md }}>
                <ShadowButton title={uploading ? 'Saving...' : 'Save Changes'} onPress={handleSave} />
              </View>
              <TouchableOpacity onPress={() => setEditVisible(false)} style={{ marginTop: spacing.sm }}>
                <Text style={{ textAlign: 'center', color: colors.primary, fontFamily: fonts.medium }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Tiffin Hub v1.0.0</Text>
          <Text style={styles.appInfoText}> 2025 Tiffin Hub. All rights reserved.</Text>
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
  headerGrad: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: spacing.lg,
    ...shadows.small,
  },
  avatarWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.white,
  },
  avatarImg: { width: '100%', height: '100%' },
  avatarSeed: {
    flex: 1,
    backgroundColor: colors.black + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSeedTxt: { fontSize: 40, color: colors.white, fontFamily: fonts.bold },
  editBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#00000080',
    borderRadius: 10,
    padding: 4,
  },
  planCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: -40,
    borderRadius: 20,
    padding: spacing.lg,
    ...shadows.card,
  },
  planTitle: { fontSize: 16, fontFamily: fonts.medium, color: colors.textPrimary },
  planSub: { color: colors.textSecondary, marginTop: 4, fontFamily: fonts.regular },
  planMeta: { color: '#999', fontSize: 13, marginTop: 2, fontFamily: fonts.regular },
  userSection: {
    alignItems: 'center',
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    backgroundColor: colors.cardBackground,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.small,
  },
  avatarText: {
    fontSize: 40,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  userName: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  userPhone: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  menuSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(230,162,110,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuItemIcon: {
    fontSize: 18,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
  },
  menuItemTextDestructive: {
    color: colors.error,
  },
  menuItemArrow: {
    fontSize: 18,
    color: '#B3B3B3',
  },
  menuItemDestructive: {
    justifyContent: 'center',
  },
  appInfo: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  scrollPad: {
    paddingBottom: spacing.xxl + 40,
  },
  appInfoText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
});

export default ProfileScreen;

