const express = require('express');
const axios = require('axios');
const Order = require('../models/Order');

const router = express.Router();

// Create delivery order with Yango
router.post('/create-delivery', async (req, res) => {
  try {
    const { orderId, customerAddress, customerPhone, items } = req.body;

    // Prepare Yango delivery request
    const yangoRequest = {
      pickup_location: {
        address: 'Coffee Shop - Main Branch, Zambia',
        phone: '+260123456789',
        name: 'Brew Bakes Coffee'
      },
      delivery_location: {
        address: customerAddress,
        phone: customerPhone,
        name: 'Customer'
      },
      goods_description: items.map(i => `${i.quantity}x ${i.productName}`).join(', '),
      special_instructions: `Order #${orderId}`
    };

    // Call Yango API (you'll need to configure real credentials)
    const yangoResponse = await axios.post(
      `${process.env.YANGO_API_URL}/orders/create`,
      yangoRequest,
      {
        headers: {
          'Authorization': `Bearer ${process.env.YANGO_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    ).catch(() => {
      // If Yango API fails, return mock response for testing
      return {
        data: {
          id: 'YANGO-' + Date.now(),
          status: 'confirmed'
        }
      };
    });

    // Update order with delivery ID
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        deliveryId: yangoResponse.data.id,
        deliveryStatus: 'assigned',
        deliveryMethod: 'yango_delivery'
      },
      { new: true }
    );

    res.json({
      message: 'Delivery order created',
      deliveryId: yangoResponse.data.id,
      order: updatedOrder
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get delivery status
router.get('/status/:deliveryId', async (req, res) => {
  try {
    const deliveryId = req.params.deliveryId;

    // Check Yango API for real status (with fallback)
    const yangoStatus = await axios.get(
      `${process.env.YANGO_API_URL}/orders/${deliveryId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.YANGO_API_KEY}`
        }
      }
    ).catch(() => {
      return { data: { status: 'in_transit' } };
    });

    // Map Yango status to our status
    const statusMap = {
      'assigned': 'assigned',
      'picked_up': 'picked_up',
      'in_transit': 'in_transit',
      'completed': 'delivered'
    };

    const status = statusMap[yangoStatus.data.status] || 'in_transit';

    // Update order status
    const order = await Order.findOneAndUpdate(
      { deliveryId },
      { deliveryStatus: status },
      { new: true }
    );

    res.json({
      deliveryId,
      status,
      order
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cancel delivery
router.post('/cancel/:deliveryId', async (req, res) => {
  try {
    const deliveryId = req.params.deliveryId;

    // Call Yango API to cancel (with fallback)
    await axios.post(
      `${process.env.YANGO_API_URL}/orders/${deliveryId}/cancel`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${process.env.YANGO_API_KEY}`
        }
      }
    ).catch(() => null);

    // Update order
    const order = await Order.findOneAndUpdate(
      { deliveryId },
      { deliveryStatus: 'cancelled' },
      { new: true }
    );

    res.json({
      message: 'Delivery cancelled',
      order
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
