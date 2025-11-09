import React from 'react';
import { Text, Animated } from 'react-native';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import OrderScreen from '../screens/OrderScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors, fonts } from '../styles/theme';
import { useNavAnimation } from '../context/NavAnimationContext';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  const { translateY, opacity, show } = useNavAnimation();

  const AnimatedTabBar = (props) => {
    React.useEffect(() => {
      // When switching tabs, ensure nav is visible
      if (show) show();
    }, [props.state?.index]);

    return (
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          transform: [{ translateY }],
          opacity,
          zIndex: 100,
        }}
        pointerEvents="box-none"
      >
        <BottomTabBar {...props} />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
      <Tab.Navigator
        tabBar={(props) => <AnimatedTabBar {...props} />}
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FF2020',
          tabBarInactiveTintColor: '#C0C0C0',
          lazy: true,
          detachInactiveScreens: true,
          tabBarStyle: {
            position: 'absolute',
            left: 20,
            right: 20,
            bottom: 20,
            height: 70,
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: 25,
            paddingTop: 10,
            paddingBottom: 10,
            borderTopWidth: 0,
            elevation: 3,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.04)'
          },
        }}
      >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size = 26 }) => (
            <Ionicons name="home" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{
          tabBarIcon: ({ color, size = 26 }) => (
            <Ionicons name="fast-food-outline" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Order"
        component={OrderScreen}
        options={{
          tabBarIcon: ({ color, size = 26 }) => (
            <Ionicons name="receipt-outline" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size = 26 }) => (
            <Ionicons name="person-outline" size={26} color={color} />
          ),
        }}
      />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default MainNavigator;

