import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const googleConfig = Constants.expoConfig?.extra?.google || {};
  let redirectUri = makeRedirectUri({ useProxy: true });
  // Fallback: if somehow native exp:// URI is generated, force Expo proxy URL
  if (redirectUri.startsWith('exp://')) {
    const slug = (Constants.expoConfig && Constants.expoConfig.slug) || 'tiffin-nation';
    const owner = (Constants.expoConfig && Constants.expoConfig.owner) || 'anonymous';
    redirectUri = `https://auth.expo.io/@${owner}/${slug}`;
  }
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: googleConfig.expoClientId || undefined,
    androidClientId: googleConfig.androidClientId || undefined,
    iosClientId: googleConfig.iosClientId || undefined,
    webClientId: googleConfig.webClientId || undefined,
    redirectUri,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = (userData) => {
    setUser({ ...user, ...userData });
    AsyncStorage.setItem('user', JSON.stringify({ ...user, ...userData }));
  };

  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === 'success' && response.authentication?.accessToken) {
        try {
          const accessToken = response.authentication.accessToken;
          const profileRes = await fetch('https://www.googleapis.com/userinfo/v2/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const profile = await profileRes.json();
          const googleUser = {
            name: profile.name,
            email: profile.email,
            picture: profile.picture,
            provider: 'google',
          };
          await AsyncStorage.setItem('token', `google-${accessToken}`);
          await AsyncStorage.setItem('user', JSON.stringify(googleUser));
          setToken(`google-${accessToken}`);
          setUser(googleUser);
        } catch (e) {
          console.warn('Google profile fetch failed:', e?.message || e);
        }
      }
    };
    handleGoogleResponse();
  }, [response]);

  const googleLogin = async () => {
    try {
      console.log('OAuth redirectUri:', redirectUri);
      await promptAsync({ useProxy: true });
      return { success: true };
    } catch (e) {
      return { success: false, message: 'Google login failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        googleLogin,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

