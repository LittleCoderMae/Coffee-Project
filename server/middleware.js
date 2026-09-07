// Middleware and utility functions

// Request logging middleware
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
};

// Input validation middleware
const validateOrderInput = (req, res, next) => {
  const { customerName, customerPhone, customerAddress, items, totalAmount } = req.body;

  if (!customerName || !customerPhone || !customerAddress) {
    return res.status(400).json({
      error: 'Missing required fields: customerName, customerPhone, customerAddress'
    });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      error: 'Order must contain at least one item'
    });
  }

  if (!totalAmount || totalAmount <= 0) {
    return res.status(400).json({
      error: 'Invalid total amount'
    });
  }

  next();
};

// Rate limiting middleware
const rateLimit = (limit, window) => {
  const requests = {};

  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!requests[key]) {
      requests[key] = [];
    }

    // Clean old requests
    requests[key] = requests[key].filter(time => now - time < window);

    if (requests[key].length >= limit) {
      return res.status(429).json({
        error: 'Too many requests. Please try again later.'
      });
    }

    requests[key].push(now);
    next();
  };
};

// JWT verification middleware (placeholder)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // In production, verify JWT here
  // For demo, just check if token exists
  next();
};

// Utility functions

// Generate order number
const generateOrderNumber = () => {
  return 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
};

// Calculate order subtotal
const calculateSubtotal = (items) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

// Format currency
const formatCurrency = (amount) => {
  return `$${amount.toFixed(2)}`;
};

// Parse phone number
const parsePhoneNumber = (phone) => {
  // Remove common formatting characters
  return phone.replace(/[\s\-\(\)]/g, '');
};

// Validate email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Date formatting
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get order status color
const getStatusColor = (status) => {
  const colors = {
    'pending': '#ff9800',
    'confirmed': '#2196f3',
    'prepared': '#9c27b0',
    'ready': '#4caf50',
    'in_delivery': '#00bcd4',
    'delivered': '#4caf50',
    'cancelled': '#f44336',
    'completed': '#4caf50',
    'failed': '#f44336'
  };
  return colors[status] || '#666';
};

// Async error wrapper for routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  requestLogger,
  errorHandler,
  validateOrderInput,
  rateLimit,
  verifyToken,
  generateOrderNumber,
  calculateSubtotal,
  formatCurrency,
  parsePhoneNumber,
  validateEmail,
  formatDate,
  getStatusColor,
  asyncHandler
};
