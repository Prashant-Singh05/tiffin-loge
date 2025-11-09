const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  kitchenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Kitchen',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a plan name'],
    enum: ['Mini', 'Regular', 'Jumbo'],
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0,
  },
  duration: {
    type: Number,
    required: true,
    default: 30, // days
  },
  mealsPerDay: {
    type: Number,
    default: 1,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Plan', planSchema);

