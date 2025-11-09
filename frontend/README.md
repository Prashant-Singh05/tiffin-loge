# Dabba Hub Frontend

React Native (Expo) mobile application for Dabba Hub.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update API URL in `config/api.js`:
```javascript
const API_URL = __DEV__ 
  ? 'http://localhost:5000/api' 
  : 'https://your-production-api.com/api';
```

For Android emulator: `http://10.0.2.2:5000/api`
For iOS simulator: `http://localhost:5000/api`
For physical device: `http://YOUR_IP:5000/api`

3. Add Poppins fonts (optional):
   - Download from Google Fonts
   - Place in `assets/fonts/` directory
   - Files: Poppins-Regular.ttf, Poppins-Medium.ttf, Poppins-SemiBold.ttf, Poppins-Bold.ttf

4. Start Expo:
```bash
npm start
```

5. Run on device:
   - Press `a` for Android
   - Press `i` for iOS
   - Scan QR code with Expo Go app

## Screens

- **SplashScreen**: Animated logo and loading
- **OnboardingScreen**: Three slides with skip option
- **LoginScreen**: Email/password login with social options
- **RegisterScreen**: User registration form
- **LocationScreen**: Google Maps location picker
- **HomeScreen**: Search, offers, categories, popular items, nearby kitchens
- **SubscriptionScreen**: Active, expired, and new meal plans
- **OrderScreen**: Order history and tracking
- **CartScreen**: Shopping cart with coupon support
- **ProfileScreen**: User profile and settings

## Navigation

- **AuthNavigator**: Login and Register screens
- **MainNavigator**: Bottom tab navigation (Home, Subscription, Order, Cart, Profile)

## State Management

- **AuthContext**: User authentication and profile
- **AppContext**: Cart, onboarding state, user location

## Design System

- Primary: #FF2020
- Secondary: #E2E2E2
- Text Primary: #000000
- Text Secondary: #535353
- Font: Poppins (fallback to system fonts)
- Border Radius: 20px
- Modern minimalist layout with light shadows

