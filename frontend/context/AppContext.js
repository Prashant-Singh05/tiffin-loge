import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    loadCart();
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const completed = await AsyncStorage.getItem('onboardingCompleted');
      setOnboardingCompleted(completed === 'true');
    } catch (error) {
      console.error('Onboarding check error:', error);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      setOnboardingCompleted(true);
    } catch (error) {
      console.error('Onboarding completion error:', error);
    }
  };

  const loadCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem('cart');
      if (cartData) {
        setCart(JSON.parse(cartData));
      }
    } catch (error) {
      console.error('Cart load error:', error);
    }
  };

  const saveCart = async (cartItems) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
      setCart(cartItems);
    } catch (error) {
      console.error('Cart save error:', error);
    }
  };

  const addToCart = async (item) => {
    try {
      const existingItemIndex = cart.findIndex(
        (cartItem) => cartItem.itemId === item.itemId
      );

      let updatedCart;
      if (existingItemIndex > -1) {
        updatedCart = cart.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      } else {
        updatedCart = [...cart, item];
      }

      await saveCart(updatedCart);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const updatedCart = cart.filter((item) => item.itemId !== itemId);
      await saveCart(updatedCart);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const updatedCart = cart.map((item) =>
        item.itemId === itemId ? { ...item, quantity } : item
      );
      await saveCart(updatedCart);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const clearCart = async () => {
    try {
      await AsyncStorage.removeItem('cart');
      setCart([]);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        onboardingCompleted,
        completeOnboarding,
        userLocation,
        setUserLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

