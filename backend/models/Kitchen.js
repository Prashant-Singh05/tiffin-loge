const mongoose = require('mongoose');

const kitchenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a kitchen name'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    default: '',
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  categories: [{
    type: String,
    enum: ['Veg', 'Non-Veg', 'Keto', 'Vegan'],
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Kitchen', kitchenSchema);

