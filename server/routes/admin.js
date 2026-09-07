const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.countDocuments({ paymentStatus: 'completed' });
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });
    
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    const paymentByStatus = await Order.aggregate([
      { $group: { _id: '$paymentStatus', count: { $sum: 1 } } }
    ]);

    res.json({
      totalOrders,
      paidOrders,
      pendingOrders,
      deliveredOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      ordersByStatus,
      paymentByStatus
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders with detailed info
router.get('/orders/list', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    const ordersWithStats = orders.map(order => ({
      ...order.toObject(),
      itemCount: order.items.length
    }));
    res.json(ordersWithStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get orders by payment status
router.get('/orders/payment/:status', async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: req.params.status }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get orders by order status
router.get('/orders/status/:status', async (req, res) => {
  try {
    const orders = await Order.find({ orderStatus: req.params.status }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment report
router.get('/reports/payments', async (req, res) => {
  try {
    const paymentReport = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      {
        $group: {
          _id: '$paymentMethod',
          totalAmount: { $sum: '$totalAmount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$totalAmount' }
        }
      }
    ]);
    res.json(paymentReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product availability report
router.get('/reports/products', async (req, res) => {
  try {
    const products = await Product.find();
    const report = products.map(p => ({
      _id: p._id,
      name: p.name,
      available: p.available,
      stock: p.stock,
      price: p.price
    }));
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get daily sales report
router.get('/reports/daily-sales', async (req, res) => {
  try {
    const dailySales = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);
    res.json(dailySales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get customer report (who ordered)
router.get('/reports/customers', async (req, res) => {
  try {
    const customers = await Order.aggregate([
      {
        $group: {
          _id: '$customerName',
          email: { $first: '$customerEmail' },
          phone: { $first: '$customerPhone' },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          lastOrder: { $max: '$createdAt' }
        }
      },
      { $sort: { totalOrders: -1 } }
    ]);
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
