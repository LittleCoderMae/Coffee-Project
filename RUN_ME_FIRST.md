# ✅ COFFEE SHOP SYSTEM - QUICK START

## Installation Complete! ✨

Your backend dependencies are now installed. Follow these steps to run the system:

---

## Step 1: Install MongoDB

**Option A: Local Installation (Recommended for Windows)**
1. Download: https://www.mongodb.com/try/download/community
2. Run the installer
3. During installation, check "Install MongoDB as a Service"
4. MongoDB will auto-start

**Option B: MongoDB Atlas (Cloud - No Installation)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a free M0 cluster
4. Get connection string like: `mongodb+srv://username:password@cluster.mongodb.net/coffee-shop`
5. Update `MONGODB_URI` in `.env` file

---

## Step 2: Configure Environment Variables

Edit `server/.env` and update these values:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/coffee-shop
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=pk_test_YOUR_KEY_HERE
STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY_HERE
YANGO_API_KEY=optional_your_yango_key
YANGO_API_URL=https://api.yango.com/v2
ADMIN_PASSWORD=admin123
```

**Getting Stripe Keys (Optional but Recommended):**
1. Go to https://stripe.com
2. Sign up for free account
3. Go to https://dashboard.stripe.com/apikeys
4. Copy "Secret key" and "Publishable key"
5. Paste into `.env`

> **Note:** System works without Stripe keys - payment will be in demo mode

---

## Step 3: Start the System (3 Steps)

**Open 3 PowerShell/Command Prompt windows:**

### Window 1: Start MongoDB
```bash
mongod
```
You'll see: `waiting for connections on port 27017`

### Window 2: Start Node Server
```bash
cd "C:\Users\user\Desktop\Coffee Project\server"
npm start
```
You'll see: `Server running on port 5000`

### Window 3: Seed Sample Data (Optional)
```bash
cd "C:\Users\user\Desktop\Coffee Project\server"
npm run seed
```
This creates 15 sample products + admin account

---

## Step 4: Access the System

Open these URLs in your browser:

### Customer Website
```
http://localhost:5000/public/index.html
```
- Browse coffee products
- Add to cart
- Checkout with payment
- Track delivery

### Admin Dashboard
```
http://localhost:5000/public/admin.html
```

**Login Credentials:**
- Username: `admin`
- Password: `admin123`

**What You Can Do:**
- ✅ View all orders
- ✅ See customer details
- ✅ Track payments received
- ✅ Mark orders as served/pending
- ✅ Toggle product availability
- ✅ View delivery status
- ✅ See order analytics

---

## Troubleshooting

### MongoDB Connection Error
```
Error: MongoServerError: connect ECONNREFUSED
```
**Solution:** Make sure MongoDB is running (Window 1)

### Port 5000 Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change PORT in `.env` to 5001, or kill process on 5000:
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Cannot Connect to Stripe
**Solution:** Stripe keys are optional. System works in demo mode without them.

### Cannot Access localhost:5000
**Solution:** 
1. Check server is running (Window 2)
2. Try `http://127.0.0.1:5000/public/index.html`
3. Check firewall isn't blocking port 5000

---

## File Locations Reference

```
Project Root: C:\Users\user\Desktop\Coffee Project\

Backend:
  - Server code: server/server.js
  - Routes: server/routes/
  - Models: server/models/
  - Config: server/.env (create this from .env.example)

Frontend:
  - Customer site: public/index.html
  - Admin page: public/admin.html
  - Login page: public/login.html
  - Checkout: public/checkout.html

Database:
  - MongoDB runs on: localhost:27017
  - Database name: coffee-shop

Server Port:
  - API: http://localhost:5000
```

---

## What Each File Does

### Backend Routes
- `/api/products` - Get/create/update/delete products
- `/api/orders` - Create orders, view order status
- `/api/admin` - Admin dashboard data & stats
- `/api/payment` - Process stripe payments
- `/api/delivery` - Integrate with Yango delivery

### Database Models
- `Product` - Coffee products with availability toggle
- `Order` - Customer orders with payment status
- `Admin` - Admin accounts for dashboard login

---

## Next Steps

1. **Start MongoDB** (Window 1)
2. **Start Server** (Window 2)
3. **Seed Data** (Window 3) - Optional
4. **Open Browser** - http://localhost:5000/public/index.html
5. **Test Admin** - http://localhost:5000/public/admin.html (admin/admin123)

---

## Full Documentation

For detailed info, see:
- `README.md` - Complete project overview
- `QUICKSTART.md` - Step-by-step guide
- `CONFIGURATION.md` - Environment setup details
- `ARCHITECTURE.md` - System design & API docs
- `TROUBLESHOOTING.md` - Common issues & fixes

---

**All set!** Your coffee shop management system is ready to run. 🎉
