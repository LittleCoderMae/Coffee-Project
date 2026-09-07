const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');
const Order = require('../models/Order');

const router = express.Router();

// Create payment intent (Stripe)
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: { orderId }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Confirm payment
router.post('/confirm-payment', async (req, res) => {
  try {
    const { orderId, paymentIntentId, paymentMethod } = req.body;

    // Update order with payment info
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: 'completed',
        paymentMethod: paymentMethod || 'stripe'
      },
      { new: true }
    );

    res.json({
      message: 'Payment confirmed',
      order
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get payment methods
router.get('/methods', (req, res) => {
  res.json({
    methods: [
      { id: 'stripe', name: 'Credit/Debit Card (Stripe)', icon: '💳' },
      { id: 'paypal', name: 'PayPal', icon: '🅿️' },
      { id: 'mobile_money', name: 'Mobile Money (Airtel/MTN/Zamtel)', icon: '📱' }
    ]
  });
});

// Mobile money payment handler
router.post('/mobile-money', async (req, res) => {
  try {
    const { orderId, phoneNumber, provider } = req.body;

    // In a real scenario, you would integrate with MTN, Airtel, or Zamtel APIs
    // For now, we'll simulate the process
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: 'pending', // Will be updated by webhook
        paymentMethod: 'mobile_money'
      },
      { new: true }
    );

    res.json({
      message: 'Mobile money payment initiated',
      provider,
      phoneNumber,
      orderId,
      order
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
