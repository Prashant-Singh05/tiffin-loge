import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';

export default function ShadowButton({ title, onPress, color = '#FF2020', style, compact = false }) {
  return (
    <View
      style={[
        {
          borderRadius: 12,
          backgroundColor: 'transparent',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 5,
          overflow: Platform.OS === 'ios' ? 'visible' : 'hidden',
        },
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        android_ripple={{ color: 'rgba(0,0,0,0.05)', borderless: false }}
        style={({ pressed }) => ({
          backgroundColor: pressed ? '#E61A1A' : color,
          borderRadius: 12,
          height: compact ? 40 : 48,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: compact ? 14 : 20,
        })}
      >
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: compact ? 14 : 16 }}>{title}</Text>
      </Pressable>
    </View>
  );
}
