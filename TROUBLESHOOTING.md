# Troubleshooting Guide

## Common Issues and Solutions

### 1. MongoDB Connection Issues

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions**:
- **Windows**: Start MongoDB from Services
  ```bash
  net start MongoDB
  ```
- **macOS**: Start MongoDB with Homebrew
  ```bash
  brew services start mongodb-community
  ```
- **Linux**: Start MongoDB service
  ```bash
  sudo systemctl start mongod
  ```
- **Verify running**: `mongosh` or `mongo`

**Alternative**: Use MongoDB Atlas (cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/coffee-shop
   ```

---

### 2. Stripe Payment Errors

**Error**: `Invalid Stripe API key`

**Solutions**:
- Verify API keys in `.env`:
  ```
  STRIPE_SECRET_KEY=sk_test_...
  STRIPE_PUBLIC_KEY=pk_test_...
  ```
- Check keys are from test mode (not live)
- Restart server after updating `.env`
- Clear browser cache and localStorage

**Error**: `Card declined` when testing

**Solutions**:
- Use test card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/25`)
- CVC: Any 3 digits (e.g., `123`)
- Check Stripe dashboard for test mode indicator

**Error**: `Stripe API not found`

**Solutions**:
- Install Stripe package: `npm install stripe`
- Verify import in `server.js`:
  ```javascript
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  ```

---

### 3. CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solutions**:
- Verify backend is running on `http://localhost:5000`
- Check frontend API_BASE URL:
  - In `admin.js`: `const API_BASE = 'http://localhost:5000/api';`
  - In `checkout.js`: `const API_BASE = 'http://localhost:5000/api';`
- Ensure CORS is enabled in `server.js`:
  ```javascript
  app.use(cors());
  ```
- Restart server after changes

---

### 4. Admin Login Not Working

**Error**: Cannot login to admin dashboard

**Solutions**:
- Check credentials:
  - Default Username: `admin`
  - Default Password: `admin123`
- Clear browser localStorage:
  ```javascript
  localStorage.clear()
  ```
- Check browser console (F12) for errors
- Verify token is being set in localStorage

**Error**: `Admin token expired`

**Solutions**:
- Logout and login again
- Clear localStorage
- Check if server restarted

---

### 5. Products Not Displaying

**Error**: No products showing on homepage or checkout

**Solutions**:
- Seed database with sample products:
  ```bash
  npm run seed
  ```
- Check MongoDB connection
- Verify products table exists
- Check browser console for API errors
- Manually add products through admin dashboard

---

### 6. Payment Processing Fails

**Error**: Payment fails silently

**Solutions**:
- Check browser console (F12) for error messages
- Verify Stripe keys are correct
- Check server logs for errors
- Ensure you're using test cards for testing
- Verify all required fields are filled in checkout

**Error**: `PaymentIntent not found`

**Solutions**:
- Refresh the page and try again
- Verify Stripe API key
- Check network tab (F12) for failed requests
- Look for 401/403 errors (invalid API key)

---

### 7. Yango Delivery Integration Issues

**Error**: Yango delivery not creating orders

**Solutions**:
- Verify API credentials in `.env`:
  ```
  YANGO_API_KEY=your_key
  YANGO_API_URL=https://api.yango.com/v2
  ```
- System will fallback to demo mode if credentials invalid
- Contact Yango support for API issues
- Check internet connection

**Error**: Delivery status not updating

**Solutions**:
- System uses demo status if API fails
- Yango API might be down - try again later
- Verify delivery ID in order details
- Check Yango dashboard directly

---

### 8. Server Won't Start

**Error**: `Port 5000 is already in use`

**Solutions**:
- Kill process using port 5000:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <pid> /F

  # macOS/Linux
  lsof -i :5000
  kill -9 <pid>
  ```
- Or change PORT in `.env`:
  ```
  PORT=5001
  ```

**Error**: `Module not found: 'express'`

**Solutions**:
- Install dependencies:
  ```bash
  cd server
  npm install
  ```
- Verify `package.json` exists
- Check npm installation: `npm --version`

---

### 9. Checkout Page Errors

**Error**: `Stripe element not loading`

**Solutions**:
- Verify Stripe script is loaded:
  ```html
  <script src="https://js.stripe.com/v3/"></script>
  ```
- Check Stripe publishable key is correct in `checkout.js`
- Clear browser cache
- Try in incognito mode

**Error**: Cart items disappearing

**Solutions**:
- localStorage is being cleared
- Check browser's privacy settings
- Try a different browser
- Verify localStorage is enabled

---

### 10. Admin Dashboard Not Loading

**Error**: Dashboard shows blank screen

**Solutions**:
- Refresh page (Ctrl+R)
- Clear browser cache and cookies
- Check browser console (F12) for errors
- Verify API_BASE URL is correct
- Ensure backend is running
- Check localStorage has token:
  ```javascript
  localStorage.getItem('adminToken')
  ```

**Error**: Data not loading in admin

**Solutions**:
- Verify backend API is running
- Check network tab (F12) for failed requests
- Seed database with sample data:
  ```bash
  npm run seed
  ```
- Check MongoDB connection
- Look for 404 or 500 errors

---

### 11. Mobile Money Payment Issues

**Error**: Mobile money form not appearing

**Solutions**:
- Select "Mobile Money" radio button
- Verify form is shown in correct section
- Check browser console for JavaScript errors

**Error**: Payment processing fails

**Solutions**:
- Verify phone number format
- Check provider selection (Airtel/MTN/Zamtel)
- In production, integrate with actual provider APIs
- For testing, use fallback demo mode

---

### 12. Database Issues

**Error**: `MongoNetworkError: failed to connect`

**Solutions**:
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB is listening on port 27017
- Try MongoDB Compass to test connection
- Check firewall settings

**Error**: `ValidationError: Product validation failed`

**Solutions**:
- Ensure all required fields are provided
- Check data types match schema
- Verify product price is a number
- Check category is valid (coffee/pastry/snacks/drinks)

---

### 13. Performance Issues

**Slow page load**:
- Check network tab (F12) for slow requests
- Verify database indexes are created
- Optimize images
- Enable gzip compression
- Check MongoDB query performance

**High memory usage**:
- Check for memory leaks in code
- Restart server
- Monitor with `node --inspect`

---

### 14. Email/Notifications Not Working

**Note**: Email notifications are not yet implemented

**To add**:
1. Install nodemailer:
   ```bash
   npm install nodemailer
   ```
2. Configure in `.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-password
   ```
3. Implement in routes

---

### 15. Environment Variable Issues

**Error**: `process.env.VARIABLE` is undefined

**Solutions**:
- Verify `.env` file exists in `server/` directory
- Check variable name is correct
- Restart server after updating `.env`
- Use `dotenv` package:
  ```javascript
  const dotenv = require('dotenv');
  dotenv.config();
  ```

---

## Debug Mode

### Enable Detailed Logging

Add to `server.js`:
```javascript
const mongoose = require('mongoose');
mongoose.set('debug', true); // Log all MongoDB queries

// Log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Body:', req.body);
  next();
});
```

### Browser Developer Tools

1. **Open DevTools**: Press F12
2. **Console Tab**: See JavaScript errors
3. **Network Tab**: Check API requests
4. **Storage Tab**: Check localStorage/cookies
5. **Application Tab**: View database

### Check Logs

```bash
# Server console - shows errors and logs
# Browser console - shows frontend errors
# MongoDB compass - view data directly
```

---

## Getting Help

### Before Contacting Support

1. ✅ Check this troubleshooting guide
2. ✅ Check browser console (F12)
3. ✅ Check server logs
4. ✅ Check .env file configuration
5. ✅ Try restarting server and MongoDB
6. ✅ Try clearing cache and localStorage

### Provide When Requesting Help

- Error message (exact text)
- Step to reproduce
- Browser and OS version
- Relevant code snippet
- Server logs (last 20 lines)
- Screenshot or video

---

## Quick Reference

### Restart Everything
```bash
# Terminal 1
mongod

# Terminal 2
cd server && npm start

# Clear cache in browser: Ctrl+Shift+Delete
```

### Seed Database
```bash
npm run seed
```

### Check Services
```bash
# Check MongoDB
mongosh

# Check Node
node --version

# Check npm
npm --version

# Check if port is available
netstat -ano | findstr :5000
```

### View Logs
```bash
# Server logs are in terminal window
# Browser logs: F12 → Console
# MongoDB logs: Check MongoDB service logs
```

---

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `ECONNREFUSED` | MongoDB not running | Start MongoDB service |
| `Port already in use` | Another process on port | Change port or kill process |
| `Invalid API key` | Wrong Stripe key | Check .env file |
| `CORS blocked` | Cross-origin request | Verify API_BASE URL |
| `Module not found` | Missing dependency | `npm install` |
| `Token undefined` | Not logged in | Login to admin |
| `No products` | Database empty | Run `npm run seed` |
| `Payment failed` | Card declined/invalid | Use test card 4242... |

---

**Last Updated**: December 2024
**Version**: 1.0.0

For additional help, refer to:
- README.md
- CONFIGURATION.md
- QUICKSTART.md
- IMPLEMENTATION.md
