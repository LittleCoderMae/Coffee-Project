# Installation & Setup Guide

## Current Network Issue

You're experiencing network connectivity issues when trying to download packages. Here are your options:

## 🔧 Option 1: Use Pre-Created package-lock.json (Recommended)

If you have a working npm install elsewhere, copy the node_modules folder, or try:

```bash
cd "C:\Users\user\Desktop\Coffee Project\server"
npm install --no-save
```

## 🔧 Option 2: Fix Network/Proxy Issues

If you're behind a corporate proxy:

```bash
npm config set proxy http://proxy.example.com:8080
npm config set https-proxy http://proxy.example.com:8080
npm install
```

Or reset npm config:

```bash
npm config delete proxy
npm config delete https-proxy
npm cache clean --force
npm install
```

## 🔧 Option 3: Install Packages Individually (Fallback)

If npm registry is down, install one at a time:

```bash
cd "C:\Users\user\Desktop\Coffee Project\server"
npm install express
npm install mongoose
npm install cors
npm install dotenv
npm install stripe
npm install axios
npm install bcryptjs
npm install jsonwebtoken
```

## 🔧 Option 4: Use Node Package Manager Alternative (Yarn)

```bash
# Install yarn first (if you have it)
npm install -g yarn
cd "C:\Users\user\Desktop\Coffee Project\server"
yarn install
```

## 🔧 Option 5: Manual Setup (For Testing/Demo)

If you want to test the system without full installation:

1. **MongoDB** - Must be installed
   - Download: https://www.mongodb.com/try/download/community
   - Install and keep running

2. **Node.js** - Verify it's installed
   ```bash
   node --version
   npm --version
   ```

3. **Create Minimal Environment**
   - Create server/.env manually with credentials
   - Test with API calls (curl/Postman)

---

## ✅ Complete Installation Steps (When Network Works)

### Step 1: Check Prerequisites
```bash
node --version      # Should be v14+
npm --version       # Should be v6+
```

### Step 2: Create .env File
```bash
cd "C:\Users\user\Desktop\Coffee Project\server"
copy .env.example .env
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Install MongoDB
**Windows:**
- Download: https://www.mongodb.com/try/download/community
- Run installer
- Start service: `net start MongoDB`

**Or use MongoDB Atlas (Cloud):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update MONGODB_URI in .env

### Step 5: Start the System

**Terminal 1 - Start MongoDB:**
```bash
mongod
```

**Terminal 2 - Start Node Server:**
```bash
cd "C:\Users\user\Desktop\Coffee Project\server"
npm start
```

**Terminal 3 (Optional) - Development Mode:**
```bash
cd "C:\Users\user\Desktop\Coffee Project\server"
npm run dev
```

### Step 6: Access the System
- Customer: http://localhost:5000/public/index.html
- Admin: http://localhost:5000/public/admin.html
- Login: admin / admin123

---

## 🚀 When Network is Fixed

```bash
# 1. Navigate to server folder
cd "C:\Users\user\Desktop\Coffee Project\server"

# 2. Install all dependencies
npm install

# 3. Create .env file
copy .env.example .env

# 4. Edit .env with your API keys
# - Add Stripe keys
# - Add Yango credentials
# - Configure MongoDB URI

# 5. Start MongoDB (separate terminal)
mongod

# 6. Start server (another terminal)
npm start

# 7. Seed sample data (optional, new terminal)
npm run seed

# 8. Open browser
# Customer: http://localhost:5000/public/index.html
# Admin: http://localhost:5000/public/admin.html
```

---

## 📋 What Gets Installed

```
express           - Web server framework
mongoose          - MongoDB ODM
stripe            - Payment processing
axios             - HTTP client
cors              - Cross-origin support
dotenv            - Environment variables
bcryptjs          - Password hashing
jsonwebtoken      - JWT authentication
nodemon (dev)     - Auto-restart on changes
```

---

## 🔍 Verify Installation

Once installed, verify with:

```bash
# Check Express
npm list express

# Check Mongoose  
npm list mongoose

# Check Stripe
npm list stripe

# All packages
npm list
```

---

## 🆘 If Installation Still Fails

1. **Check Network**
   ```bash
   ping registry.npmjs.org
   ```

2. **Check Node/npm**
   ```bash
   node --version
   npm --version
   npm config list
   ```

3. **Clear Cache**
   ```bash
   npm cache clean --force
   rmdir /s /q %appdata%\npm-cache
   ```

4. **Try Different npm Registry**
   ```bash
   npm config set registry https://registry.npmjs.org/
   ```

5. **Update npm**
   ```bash
   npm install -g npm@latest
   ```

---

## ✅ After Installation - Running the System

### Start Services (3 Terminals)

**Terminal 1: MongoDB**
```bash
mongod
```
You'll see: `waiting for connections on port 27017`

**Terminal 2: Node Server**
```bash
cd "C:\Users\user\Desktop\Coffee Project\server"
npm start
```
You'll see: `Server running on port 5000`

**Terminal 3: Seed Sample Data (Optional)**
```bash
cd "C:\Users\user\Desktop\Coffee Project\server"
npm run seed
```

### Access System

Open in browser:
- **Customer Site**: http://localhost:5000/public/index.html
- **Admin Login**: http://localhost:5000/public/login.html
- **Admin Dashboard**: http://localhost:5000/public/admin.html
- **Credentials**: admin / admin123

---

## 📚 Next Steps

1. Read `QUICKSTART.md` for step-by-step guide
2. Read `README.md` for complete documentation
3. Add your Stripe API keys to `.env`
4. Test the admin dashboard
5. Test a sample order

---

**Need Help?** Check `TROUBLESHOOTING.md` or `CONFIGURATION.md`
