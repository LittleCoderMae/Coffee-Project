const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: String,
  customerPhone: {
    type: String,
    required: true
  },
  customerAddress: {
    type: String,
    required: true
  },
  gpsCoordinates: {
    latitude: Number,
    longitude: Number
  },
  items: [{
    productId: mongoose.Schema.Types.ObjectId,
    productName: String,
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  subtotal: Number,
  promoCode: String,
  discountAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'mtn_money', 'airtel_money', 'pay_on_delivery'],
    default: 'pay_on_delivery'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'prepared', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryMethod: {
    type: String,
    enum: ['pickup', 'home_delivery'],
    default: 'home_delivery'
  },
  scheduledDeliveryTime: Date,
  pickupLocation: String,
  deliveryId: String,
  deliveryStatus: {
    type: String,
    enum: ['not_assigned', 'assigned', 'picked_up', 'in_transit', 'delivered'],
    default: 'not_assigned'
  },
  deliveryDriver: {
    name: String,
    phone: String,
    vehicle: String,
    location: {
      latitude: Number,
      longitude: Number
    }
  },
  orderTimeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);

