# Dabba Hub - Full-Stack Mobile Application

A cross-platform mobile food delivery and subscription application built with React Native (Expo), Node.js, Express, and MongoDB.

## 🎨 Design System

- **Primary Color**: #FF2020
- **Secondary Color**: #E2E2E2
- **Text Primary**: #000000
- **Text Secondary**: #535353
- **Font**: Poppins/Inter
- **Border Radius**: 20px
- **Modern minimalist layout with light shadows**

## 📱 Features

- **Splash Screen** with animated logo
- **Onboarding** with 3 slides
- **Authentication** (Login/Register with social login options)
- **Location Access** with Google Maps integration
- **Home Screen** with search, offers, categories, popular items, and nearby kitchens
- **Subscription Management** for meal plans
- **Order Tracking** with order history
- **Shopping Cart** with coupon support
- **User Profile** with settings and preferences

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Expo CLI (`npm install -g expo-cli`)
- React Native development environment

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dabba-hub
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

4. Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend API will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update the API URL in `frontend/config/api.js`:
```javascript
const API_URL = __DEV__ 
  ? 'http://localhost:5000/api' 
  : 'https://your-production-api.com/api';
```

For Android emulator, use `http://10.0.2.2:5000/api`
For iOS simulator, use `http://localhost:5000/api`
For physical device, use your computer's IP address: `http://YOUR_IP:5000/api`

4. Add Poppins fonts (optional):
   - Download Poppins font files from Google Fonts
   - Place them in `frontend/assets/fonts/` directory
   - Files needed: Poppins-Regular.ttf, Poppins-Medium.ttf, Poppins-SemiBold.ttf, Poppins-Bold.ttf

5. Start the Expo development server:
```bash
npm start
```

6. Run on your device:
   - Press `a` for Android
   - Press `i` for iOS
   - Scan QR code with Expo Go app on your physical device

## 📁 Project Structure

```
Dabba Hub/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── orderController.js
│   │   ├── planController.js
│   │   └── cartController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Kitchen.js
│   │   ├── Plan.js
│   │   ├── Order.js
│   │   └── Cart.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── planRoutes.js
│   │   ├── cartRoutes.js
│   │   └── kitchenRoutes.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── assets/
│   │   └── fonts/
│   ├── components/
│   │   ├── Button.js
│   │   ├── Input.js
│   │   └── LoadingIndicator.js
│   ├── config/
│   │   └── api.js
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── AppContext.js
│   ├── navigation/
│   │   ├── AuthNavigator.js
│   │   └── MainNavigator.js
│   ├── screens/
│   │   ├── SplashScreen.js
│   │   ├── OnboardingScreen.js
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── LocationScreen.js
│   │   ├── HomeScreen.js
│   │   ├── SubscriptionScreen.js
│   │   ├── OrderScreen.js
│   │   ├── CartScreen.js
│   │   └── ProfileScreen.js
│   ├── styles/
│   │   └── theme.js
│   ├── App.js
│   ├── app.json
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/update` - Update user profile

### Orders
- `GET /api/orders` - Get all orders for user
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status

### Plans
- `GET /api/plans` - Get all plans
- `GET /api/plans/kitchen/:kitchenId` - Get plans by kitchen

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/item/:itemId` - Update cart item
- `DELETE /api/cart/item/:itemId` - Remove item from cart
- `POST /api/cart/coupon` - Apply coupon
- `DELETE /api/cart` - Clear cart

### Kitchens
- `GET /api/kitchens` - Get all kitchens
- `GET /api/kitchens/:id` - Get kitchen by ID

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication. Tokens are stored in AsyncStorage and automatically included in API requests.

## 📱 App Flow

1. **Splash Screen** → Animated logo and loading
2. **Onboarding** → Three slides with skip option
3. **Authentication** → Login or Register
4. **Location** → Select delivery address on map
5. **Home** → Browse food, offers, categories
6. **Subscription** → Manage meal plans
7. **Order** → View order history and track orders
8. **Cart** → Review items and proceed to payment
9. **Profile** → User settings and preferences

## 🛠️ Technologies Used

### Frontend
- React Native (Expo)
- React Navigation
- Context API (State Management)
- AsyncStorage
- Axios
- React Native Maps
- Expo Location

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Bcrypt (Password Hashing)
- CORS

## 📝 Notes

- The app includes onboarding state management (shown only once)
- All network calls include error handling and loading indicators
- Responsive design for both Android and iOS
- Clean UI with consistent visual hierarchy
- Payment integration placeholder for Razorpay/Stripe

## 🐛 Troubleshooting

### Android SDK Path Issue

If you see: `Failed to resolve the Android SDK path. ANDROID_HOME is set to a non-existing path`

**Solution:**
1. Set environment variable manually:
   - Variable: `ANDROID_HOME`
   - Value: `C:\Users\YourUsername\AppData\Local\Android\Sdk`
   - Add to Path: `%ANDROID_HOME%\platform-tools`
2. **Restart your terminal** after setting environment variables

**Alternative:** Use Expo Go on your phone instead (no Android SDK needed)

### Other Common Issues

1. **MongoDB Connection Error**: Ensure MongoDB is running and the connection string in `.env` is correct
2. **API Connection Error**: 
   - Android Emulator: API URL should be `http://10.0.2.2:5000/api` (already configured)
   - iOS Simulator: API URL should be `http://localhost:5000/api` (already configured)
   - Physical Device: Update API URL in `frontend/config/api.js` with your computer's IP address
3. **Font Loading Error**: App will continue with system fonts if Poppins fonts are not found (fonts are already in correct location)
4. **Location Permission**: Ensure location permissions are granted in device settings


## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Development

For development with hot reload:
- Backend: `npm run dev` (requires nodemon)
- Frontend: `npm start` (Expo handles hot reload automatically)

## 🚀 Production Build

To create production builds:
```bash
# Android
expo build:android

# iOS
expo build:ios
```

---

**Built with ❤️ for Dabba Hub**

#
