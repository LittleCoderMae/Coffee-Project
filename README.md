# Brew Bakes & Coffee Shop — Static Site

This repository contains a static client-side website (HTML/CSS/JS) for Brew Bakes & Coffee Shop.

Quick notes:
- The site is static and can be hosted on GitHub Pages.
- The `server/` folder contains Node/Express code and is not required for the static site. Remove or keep it in a separate branch if you do not want it published.

Deploy to GitHub Pages (recommended):
1. Push this repository to GitHub.
2. In the repository Settings → Pages, choose the `main` branch and `/ (root)` as the source.
3. Optionally add a `CNAME` for a custom domain.

Local preview:
```bash
python -m http.server 8000
# then open http://localhost:8000
```

If you want, I can push these changes and help enable Pages settings (you'll need to enable the site in your GitHub repo settings).

---
Generated helper files: `.nojekyll` (prevents Jekyll processing on GitHub Pages).
# Brew Bakes Coffee Shop Management System

A complete full-stack coffee shop management system with admin dashboard, payment gateway integration, and delivery management.

## Features

### Admin Dashboard
- 📊 **Dashboard Overview** - View total orders, paid orders, pending orders, and revenue
- 📋 **Order Management** - View all orders, update status, track delivery
- 💳 **Payment Management** - Track payments by status and method
- 🛍️ **Product Management** - Add, edit, delete products and toggle availability
- 📦 **Delivery Management** - Track Yango deliveries and manage delivery status
- 👥 **Customer Information** - View customer order history and spending
- 📈 **Reports & Analytics** - Daily sales reports, payment method breakdown

### Client Features
- ☕ **Product Catalog** - Browse available coffee, pastries, snacks, and drinks
- 🛒 **Shopping Cart** - Add/remove items, update quantities
- 💰 **Checkout** - Multiple payment methods (Stripe, Mobile Money)
- 🚚 **Delivery Options** - Yango delivery or pickup
- 📱 **Order Tracking** - Track order status in real-time

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** - Database
- **Stripe** - Payment processing
- **JWT** - Authentication
- **Axios** - API calls for Yango delivery

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling
- **JavaScript** - Interactivity
- **Stripe.js** - Payment form

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running
- Stripe account and API keys
- Yango delivery API credentials

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
copy .env.example .env
```

4. Update `.env` with your credentials:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/coffee-shop
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
YANGO_API_KEY=your_yango_api_key
YANGO_API_URL=https://api.yango.com/v2
ADMIN_PASSWORD=admin123
```

5. Start the server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. The frontend files are in the `public` directory
2. Update the API base URL in the JavaScript files if needed
3. Update Stripe publishable key in `public/checkout.js`

## Project Structure

```
Coffee Project/
├── server/
│   ├── models/
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Admin.js
│   ├── routes/
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── admin.js
│   │   ├── payment.js
│   │   └── delivery.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── public/
│   ├── index.html (main customer page)
│   ├── checkout.html (checkout & payment)
│   ├── checkout.js
│   ├── admin.html (admin dashboard)
│   ├── admin.js
│   ├── login.html (admin login)
│   └── images/ (product images)
└── README.md
```

## API Endpoints

### Products
- `GET /api/products/` - Get all products
- `GET /api/products/available` - Get available products
- `GET /api/products/:id` - Get single product
- `POST /api/products/` - Create product
- `PUT /api/products/:id` - Update product
- `PATCH /api/products/:id/toggle-availability` - Toggle availability
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders/` - Get all orders
- `POST /api/orders/` - Create order
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status
- `PATCH /api/orders/:id/payment-status` - Update payment status
- `PATCH /api/orders/:id/delivery-status` - Update delivery status

### Admin Dashboard
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/reports/customers` - Get customer information
- `GET /api/admin/reports/payments` - Get payment report
- `GET /api/admin/reports/products` - Get product availability report
- `GET /api/admin/reports/daily-sales` - Get daily sales report

### Payment
- `POST /api/payment/create-payment-intent` - Create Stripe payment intent
- `POST /api/payment/confirm-payment` - Confirm payment
- `POST /api/payment/mobile-money` - Process mobile money payment
- `GET /api/payment/methods` - Get available payment methods

### Delivery
- `POST /api/delivery/create-delivery` - Create Yango delivery
- `GET /api/delivery/status/:deliveryId` - Get delivery status
- `POST /api/delivery/cancel/:deliveryId` - Cancel delivery

## Usage

### Admin Dashboard

1. **Login**
   - Go to `/admin/login.html`
   - Default credentials: `admin / admin123`

2. **View Dashboard**
   - See overview of orders, payments, and revenue
   - Monitor order and payment statuses

3. **Manage Products**
   - Add new products with price, category, and stock
   - Toggle product availability on/off
   - Edit or delete products

4. **Track Orders**
   - View all customer orders
   - Update order status (pending → prepared → ready → delivered)
   - View detailed order information

5. **Manage Payments**
   - Track payment status for all orders
   - View payment methods used
   - Monitor revenue by payment method

6. **Delivery Management**
   - View Yango delivery assignments
   - Track delivery status
   - Cancel deliveries if needed

7. **View Reports**
   - Daily sales analytics
   - Customer purchase history
   - Payment method breakdown

### Customer Ordering

1. **Browse Products**
   - Visit the home page at `index.html`
   - Filter by category (Coffee, Pastry, Snacks, Drinks)
   - Add items to cart

2. **Proceed to Checkout**
   - Go to `checkout.html`
   - Enter delivery information
   - Choose delivery method (Yango or Pickup)

3. **Payment**
   - Choose payment method:
     - **Credit/Debit Card** - Uses Stripe for secure processing
     - **Mobile Money** - Airtel Money, MTN Mobile Money, or Zamtel
   - Complete payment process

4. **Delivery**
   - For Yango delivery - Driver will pick up order
   - For Pickup - Collect from store
   - Receive order confirmation with tracking

## Configuration

### Stripe Setup

1. Sign up at https://stripe.com
2. Get your API keys from the dashboard
3. Add to `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLIC_KEY=pk_test_...
   ```

### Yango Delivery Setup

1. Register with Yango delivery partner
2. Get your API credentials
3. Add to `.env`:
   ```
   YANGO_API_KEY=your_key
   YANGO_API_URL=https://api.yango.com/v2
   ```

### MongoDB Setup

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   ```
3. MongoDB will run on `mongodb://localhost:27017`

## Order Status Flow

```
pending → confirmed → prepared → ready → in_delivery → delivered
                        ↓
                    cancelled (if needed)
```

## Payment Status Flow

```
pending → completed
   ↓
 failed
   ↓
refunded
```

## Delivery Status Flow (Yango)

```
not_assigned → assigned → picked_up → in_transit → delivered
                                ↓
                            cancelled (if needed)
```

## Security Notes

⚠️ **Important**: This is a development/demo version. For production:

1. **Environment Variables**
   - Never commit `.env` file
   - Use environment variables for all sensitive data
   - Rotate keys regularly

2. **Authentication**
   - Implement proper JWT verification
   - Use HTTPS only
   - Add admin role verification to all admin endpoints

3. **Payment**
   - Never store full card numbers
   - Use Stripe for PCI compliance
   - Implement proper error handling

4. **Database**
   - Use MongoDB Atlas for production
   - Enable authentication
   - Regular backups

5. **API Security**
   - Add rate limiting
   - Implement CORS properly
   - Input validation on all endpoints

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB is listening on port 27017

### Stripe Payment Error
- Verify Stripe API keys are correct
- Check Stripe account is in test mode
- Use Stripe test card: `4242 4242 4242 4242`

### CORS Error
- Ensure backend runs on port 5000
- Check frontend API_BASE URL is correct
- CORS is enabled in server.js

### Yango Delivery Error
- Verify API credentials
- Check internet connection
- API might be down - fallback to demo mode

## Demo Test Data

### Admin Login
- Username: `admin`
- Password: `admin123`

### Test Credit Card (Stripe)
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)

## Future Enhancements

- [ ] Email notifications for orders
- [ ] SMS notifications via Twilio
- [ ] Order scheduling for future delivery
- [ ] Loyalty program/rewards
- [ ] Menu customization
- [ ] Real-time order status push notifications
- [ ] Receipt generation and printing
- [ ] Inventory management
- [ ] Staff management system
- [ ] Analytics dashboard with charts

## Support

For issues, questions, or contributions, please contact the development team.

## License

This project is proprietary and confidential.

---

**Version**: 1.0.0
**Last Updated**: December 2024
