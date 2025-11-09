# Dabba Hub Backend API

Node.js + Express + MongoDB backend for Dabba Hub mobile application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dabba-hub
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

3. Start MongoDB (if running locally):
```bash
mongod
```

4. Start the server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User
- `GET /api/user/profile` - Get user profile (Protected)
- `PUT /api/user/update` - Update user profile (Protected)

### Orders
- `GET /api/orders` - Get all orders for user (Protected)
- `GET /api/orders/:id` - Get single order (Protected)
- `POST /api/orders` - Create new order (Protected)
- `PUT /api/orders/:id/status` - Update order status (Protected)

### Plans
- `GET /api/plans` - Get all plans
- `GET /api/plans/kitchen/:kitchenId` - Get plans by kitchen

### Cart
- `GET /api/cart` - Get user cart (Protected)
- `POST /api/cart` - Add item to cart (Protected)
- `PUT /api/cart/item/:itemId` - Update cart item (Protected)
- `DELETE /api/cart/item/:itemId` - Remove item from cart (Protected)
- `POST /api/cart/coupon` - Apply coupon (Protected)
- `DELETE /api/cart` - Clear cart (Protected)

### Kitchens
- `GET /api/kitchens` - Get all kitchens
- `GET /api/kitchens/:id` - Get kitchen by ID

## Models

- **User**: name, email, phone, password, address, subscriptionInfo
- **Kitchen**: name, description, image, address, rating, categories
- **Plan**: kitchenId, name, price, duration, mealsPerDay
- **Order**: userId, kitchenId, items, orderId, totalAmount, status
- **Cart**: userId, items, couponCode, discount

## Authentication

JWT tokens are required for protected routes. Include token in Authorization header:
```
Authorization: Bearer <token>
```

