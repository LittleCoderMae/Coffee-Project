# Quick Start Guide

## 5-Minute Setup

### Windows Users

1. **Run Setup Script**
   ```bash
   setup.bat
   ```

2. **Edit Configuration**
   - Open `server/.env`
   - Add your Stripe API keys
   - Add Yango delivery credentials

3. **Start MongoDB**
   ```bash
   mongod
   ```

4. **Start Backend**
   ```bash
   cd server
   npm start
   ```

5. **Open in Browser**
   - Customer Site: `http://localhost:5000/public/index.html`
   - Admin Dashboard: `http://localhost:5000/public/admin.html`
   - Admin Login: `admin / admin123`

### macOS Users

1. **Run Setup Script**
   ```bash
   bash setup.sh
   ```

2. **Edit Configuration**
   ```bash
   nano server/.env
   ```
   - Add Stripe keys
   - Add Yango credentials

3. **Start MongoDB**
   ```bash
   brew services start mongodb-community
   ```

4. **Start Backend**
   ```bash
   cd server
   npm start
   ```

5. **Open in Browser**
   - Customer: `http://localhost:5000/public/index.html`
   - Admin: `http://localhost:5000/public/admin.html`

### Linux Users

1. **Run Setup Script**
   ```bash
   bash setup.sh
   ```

2. **Edit Configuration**
   ```bash
   vim server/.env
   ```

3. **Start MongoDB**
   ```bash
   sudo systemctl start mongod
   ```

4. **Start Backend**
   ```bash
   cd server
   npm start
   ```

## Using the System

### For Customers

**Landing Page**
- Browse products by category
- Add items to cart
- View cart summary

**Checkout Process**
1. Click "Checkout"
2. Enter delivery address
3. Choose delivery method (Yango or Pickup)
4. Enter payment details
5. Confirm order

**Payment Options**
- Credit/Debit Card (Stripe)
- Mobile Money (Airtel, MTN, Zamtel)

### For Admin

**Dashboard**
1. Go to `http://localhost:5000/public/admin.html`
2. Login: `admin / admin123`
3. View overview of orders and revenue

**Key Actions**
- **View Orders**: See all customer orders with status
- **Update Status**: Mark orders as prepared, ready, delivered
- **Manage Products**: Add/edit/delete items, toggle availability
- **Track Payments**: Monitor payment status and methods
- **Manage Delivery**: Track Yango deliveries
- **View Reports**: Check sales analytics

## Testing with Demo Data

### Stripe Test Card
- Number: `4242 4242 4242 4242`
- Expiry: `12/25`
- CVC: `123`

### Admin Account
- Username: `admin`
- Password: `admin123`

### Test Order
1. Browse and add items to cart
2. Go to checkout
3. Enter test delivery address
4. Use test Stripe card
5. Complete order

Check admin dashboard to see the order!

## File Structure Quick Reference

```
Coffee Project/
├── server/                 # Backend
│   ├── models/            # Database schemas
│   ├── routes/            # API endpoints
│   ├── .env              # Configuration
│   ├── package.json       # Dependencies
│   └── server.js         # Main server file
├── public/               # Frontend
│   ├── index.html        # Customer site
│   ├── checkout.html     # Checkout page
│   ├── admin.html        # Admin dashboard
│   ├── login.html        # Admin login
│   └── images/           # Product images
├── README.md             # Full documentation
├── CONFIGURATION.md      # Setup details
└── setup.bat/sh         # Setup script
```

## Common Tasks

### Add a New Product

1. Go to Admin Dashboard
2. Click "Products" in sidebar
3. Click "Add Product"
4. Fill in details:
   - Name
   - Category (Coffee, Pastry, Snacks, Drinks)
   - Price
   - Stock
5. Click "Save Product"

### Mark Order as Served

1. Go to "Orders" section
2. Find the order
3. Click "View"
4. Click "Mark Ready" or "Mark Delivered"
5. Order status updates in real-time

### Toggle Product Availability

1. Go to "Products"
2. Find the product
3. Toggle the switch ON/OFF
4. Changes apply immediately

### Check Payment Status

1. Go to "Payments"
2. See all orders with payment status
3. Filter by status (pending, completed, failed)
4. View payment method used

### Track Deliveries

1. Go to "Deliveries"
2. See all Yango deliveries
3. Click "View" for details
4. Track delivery status

## Frequently Asked Questions

### Q: How do I add products initially?
**A:** Use the Admin Dashboard → Products → Add Product

### Q: How do customers pay?
**A:** They have two options:
- Credit/Debit Card via Stripe
- Mobile Money (Airtel/MTN/Zamtel)

### Q: Can customers track their orders?
**A:** Yes! Order status updates:
- Pending → Confirmed → Prepared → Ready → In Delivery → Delivered

### Q: How is delivery handled?
**A:** Two options:
- **Yango Delivery**: Professional delivery service
- **Pickup**: Customer collects from store

### Q: What if Stripe/Yango API fails?
**A:** System has fallback modes:
- Yango falls back to demo mode
- Stripe requires valid credentials

### Q: How do I change admin password?
**A:** Update `.env` file:
```
ADMIN_PASSWORD=your_new_password
```

### Q: Can I use this in production?
**A:** Mostly yes, but:
- Add HTTPS
- Change admin credentials
- Use Stripe live keys
- Setup proper database backups
- Enable proper error logging
- Add rate limiting

## Next Steps

1. **Customize Branding**
   - Update colors in CSS
   - Add your logo
   - Update product images

2. **Add More Payment Methods**
   - PayPal integration
   - Bank transfer
   - More mobile money providers

3. **Add Features**
   - Email notifications
   - SMS notifications
   - Order scheduling
   - Loyalty program

4. **Deploy to Production**
   - Setup domain name
   - Configure SSL/HTTPS
   - Use production database
   - Update API keys

## Support

For issues or questions:
1. Check CONFIGURATION.md for detailed setup
2. Check README.md for full documentation
3. Check console errors in browser (F12)
4. Check server logs in terminal

---

**Happy serving! ☕**

Need help? Check the documentation or contact support.
