const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [{
    kitchenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Kitchen',
    },
    kitchenName: String,
    itemId: String,
    name: String,
    quantity: Number,
    price: Number,
    image: String,
  }],
  couponCode: {
    type: String,
    default: '',
  },
  discount: {
    type: Number,
    default: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Cart', cartSchema);

