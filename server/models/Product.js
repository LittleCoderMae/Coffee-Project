const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  image: String,
  category: {
    type: String,
    enum: ['coffee', 'snacks', 'combos', 'pastry', 'drinks'],
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    default: 0
  },
  ingredients: [String],
  allergens: [String],
  comboItems: [{
    productId: mongoose.Schema.Types.ObjectId,
    quantity: Number
  }],
  discount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
