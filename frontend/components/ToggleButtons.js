import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors, fonts, spacing } from '../styles/theme';

const ACCENT = colors.accent || '#E67E22';

export default function ToggleButtons({ tab, onChange }) {
  return (
    <View style={styles.toggleContainer}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.toggleBtn, tab === 'order' && styles.activeBtn]}
        onPress={() => onChange('order')}
      >
        <Text style={[styles.toggleText, tab === 'order' && styles.activeText]}>Order Now</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.toggleBtn, tab === 'subscribe' && styles.activeBtn]}
        onPress={() => onChange('subscribe')}
      >
        <Text style={[styles.toggleText, tab === 'subscribe' && styles.activeText]}>Subscribe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  toggleBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFF4EF',
  },
  activeBtn: {
    backgroundColor: ACCENT,
  },
  toggleText: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: '#555',
  },
  activeText: {
    color: '#fff',
  },
});
