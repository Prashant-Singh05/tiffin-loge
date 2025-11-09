import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Get your computer's IP address for physical device testing
// For Android emulator: use 10.0.2.2
// For iOS simulator: use localhost
// For physical device: use your computer's IP (e.g., 192.168.1.100)

// Update this with your backend URL based on your setup
// For Expo Go on physical device, you'll need to use your computer's IP address
// Find your IP: Windows: ipconfig | findstr IPv4
// Then update the PHYSICAL_DEVICE_IP below

// ⚠️ UPDATE THIS with your computer's IP address
// Find your IP: Run 'ipconfig' and look for IPv4 Address under your WiFi adapter
// Example: 192.168.1.100 (NOT 192.168.56.1 or 169.254.x.x - those are virtual adapters)
// ⚠️ For Expo Go: Change this to your computer's WiFi IP address
// Find your IP: Run 'ipconfig' and look for IPv4 Address under WiFi adapter
// For Android Emulator: Use '10.0.2.2' (already handled below)
// For iOS Simulator: Use 'localhost' (already handled below)
const PHYSICAL_DEVICE_IP = '172.16.63.129'; // Your WiFi IP address

const getApiUrl = () => {
  if (__DEV__) {
    // For Expo Go on physical devices, ALWAYS use WiFi IP (never localhost)
    // Physical devices can't access localhost - they need the computer's IP address
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      // Expo Go on Android or iOS physical device - use WiFi IP
      const apiUrl = `http://${PHYSICAL_DEVICE_IP}:5000/api`;
      console.log(`📱 Using WiFi IP for ${Platform.OS}: ${apiUrl}`);
      return apiUrl;
    } else if (Platform.OS === 'web') {
      // Web platform can use localhost
      return 'http://localhost:5000/api';
    } else {
      // Fallback: use WiFi IP for any other platform (safer for physical devices)
      return `http://${PHYSICAL_DEVICE_IP}:5000/api`;
    }
  }
  return 'https://your-production-api.com/api';
};

const API_URL = getApiUrl();

console.log(`🌐 API URL: ${API_URL} (Platform: ${Platform.OS})`);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;

