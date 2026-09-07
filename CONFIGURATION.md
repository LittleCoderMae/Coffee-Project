# Configuration Guide

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your credentials:

```bash
cp .env.example .env
```

### 3. Setup MongoDB

#### Option A: Local MongoDB
```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### 4. Get Stripe API Keys

1. Go to https://stripe.com
2. Sign up and create an account
3. Go to Developers → API Keys
4. Copy your:
   - Secret Key → `STRIPE_SECRET_KEY`
   - Publishable Key → `STRIPE_PUBLIC_KEY`
5. Update `public/checkout.js` with publishable key

### 5. Get Yango API Credentials

1. Contact Yango delivery service
2. Get your API key and credentials
3. Update in `.env`:
   - `YANGO_API_KEY`
   - `YANGO_API_URL`

### 6. Start the Server

```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

Server runs on: `http://localhost:5000`

## Configuration Details

### Environment Variables (.env)

```env
# Server
PORT=5000                                              # Server port

# Database
MONGODB_URI=mongodb://localhost:27017/coffee-shop     # MongoDB connection

# Authentication
JWT_SECRET=your_jwt_secret_key_here                   # JWT signing key

# Stripe Payment
STRIPE_SECRET_KEY=sk_test_...                         # Stripe secret
STRIPE_PUBLIC_KEY=pk_test_...                         # Stripe publishable

# Yango Delivery
YANGO_API_KEY=your_yango_api_key_here                # Yango API key
YANGO_API_URL=https://api.yango.com/v2               # Yango API URL

# Admin
ADMIN_PASSWORD=admin123                               # Admin default password
```

## Payment Gateway Setup

### Stripe Configuration

**Test Mode Setup:**
1. Dashboard → Developers → API keys
2. Use Test Publishable and Secret keys
3. Test Card: `4242 4242 4242 4242`
4. Expiry: Any future date (e.g., 12/25)
5. CVC: Any 3 digits

**Live Mode Setup:**
1. Switch to Live keys in dashboard
2. Update `.env` with live keys
3. Change Stripe client from test to live in `checkout.js`

**Integration Points:**
- Frontend: `public/checkout.js` - Stripe.js for payment form
- Backend: `server/routes/payment.js` - Payment intent creation

### Mobile Money Integration

The system supports:
- **Airtel Money**
- **MTN Mobile Money**
- **Zamtel**

These need to be configured with respective providers for production.

## Yango Delivery Integration

### Setup Steps

1. **Register with Yango:**
   - Contact Yango delivery service in your region
   - Get merchant/partner account

2. **Get API Credentials:**
   - API Key
   - API URL (usually https://api.yango.com/v2)
   - Merchant ID (if required)

3. **Update .env:**
   ```
   YANGO_API_KEY=your_key
   YANGO_API_URL=https://api.yango.com/v2
   ```

4. **Test Integration:**
   - Use demo mode (fallback) for testing
   - Verify credentials with Yango support

### API Endpoints Used

- `POST /orders/create` - Create delivery order
- `GET /orders/{id}` - Get delivery status
- `POST /orders/{id}/cancel` - Cancel delivery

## Database Structure

### Products Collection
```javascript
{
  name: String,
  description: String,
  price: Number,
  image: String,
  category: "coffee|pastry|snacks|drinks",
  available: Boolean,
  stock: Number,
  createdAt: Date
}
```

### Orders Collection
```javascript
{
  orderNumber: String (unique),
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  customerAddress: String,
  items: [
    {
      productId: ObjectId,
      productName: String,
      quantity: Number,
      price: Number,
      subtotal: Number
    }
  ],
  totalAmount: Number,
  paymentStatus: "pending|completed|failed|refunded",
  paymentMethod: "stripe|paypal|mobile_money",
  orderStatus: "pending|confirmed|prepared|ready|in_delivery|delivered|cancelled",
  deliveryMethod: "pickup|yango_delivery",
  deliveryId: String,
  deliveryStatus: "not_assigned|assigned|picked_up|in_transit|delivered",
  createdAt: Date,
  updatedAt: Date
}
```

### Admin Collection
```javascript
{
  username: String,
  password: String (hashed),
  email: String,
  role: "admin|manager",
  createdAt: Date
}
```

## Frontend Configuration

### Stripe in checkout.js

Update line with your publishable key:
```javascript
const stripeKey = 'pk_test_your_key_here';
```

### API Base URL

Default: `http://localhost:5000/api`

To change, update in:
- `public/admin.js` (line 2)
- `public/checkout.js` (line 2)

## Development vs Production

### Development
- Use MongoDB local: `mongodb://localhost:27017/coffee-shop`
- Use Stripe test keys
- CORS allows localhost:3000
- No HTTPS required
- Demo admin credentials

### Production
- Use MongoDB Atlas
- Use Stripe live keys
- Configure CORS for your domain
- Enable HTTPS
- Change admin credentials
- Environment-specific error handling
- Rate limiting enabled
- Proper logging

## Deployment Checklist

- [ ] Update `.env` with production values
- [ ] Switch Stripe to live mode
- [ ] Configure MongoDB Atlas
- [ ] Update API_BASE URLs for production domain
- [ ] Set JWT_SECRET to strong random value
- [ ] Change admin password
- [ ] Enable HTTPS
- [ ] Setup CORS for production domain
- [ ] Enable rate limiting
- [ ] Setup error logging
- [ ] Setup email notifications
- [ ] Backup database
- [ ] Setup monitoring
- [ ] Configure payment webhooks

## Troubleshooting

### "Cannot connect to MongoDB"
- Check MongoDB is running
- Verify connection string
- Check firewall/antivirus isn't blocking port 27017

### "Stripe API error"
- Verify API keys are correct
- Check you're using test keys for development
- Verify Stripe account is active
- Check Stripe dashboard for errors

### "Yango delivery not working"
- Verify API credentials
- Check internet connection
- Fallback to demo mode is working
- Contact Yango support

### "CORS error on checkout"
- Verify backend is running on correct port
- Check API_BASE URL in frontend
- Verify CORS is enabled in server.js

### "Admin login not working"
- Check credentials (default: admin/admin123)
- Verify .env ADMIN_PASSWORD matches
- Clear browser localStorage and try again

## Support & Resources

- **Stripe Documentation**: https://stripe.com/docs
- **MongoDB Documentation**: https://docs.mongodb.com
- **Express.js Guide**: https://expressjs.com
- **Yango API**: Contact support or check partner portal

---

For additional help, contact the development team.
