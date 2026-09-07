# Visual System Architecture & Flow Diagrams

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        COFFEE SHOP SYSTEM                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT SIDE (Frontend)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐         ┌──────────────────────┐      │
│  │  index.html          │         │  admin.html          │      │
│  │  (Customer Page)     │         │  (Admin Dashboard)   │      │
│  │  - Browse products   │         │  - View orders       │      │
│  │  - Add to cart       │         │  - Manage products   │      │
│  │  - View availability │         │  - Track payments    │      │
│  └──────────────────────┘         │  - Manage delivery   │      │
│          ↓                         │  - View reports      │      │
│  ┌──────────────────────┐         └──────────────────────┘      │
│  │  checkout.html       │                  ↓                    │
│  │  (Checkout Page)     │         ┌──────────────────────┐      │
│  │  - Delivery info     │         │  login.html          │      │
│  │  - Payment method    │         │  (Admin Login)       │      │
│  │  - Order submission  │         │  - Authentication    │      │
│  └──────────────────────┘         └──────────────────────┘      │
│          ↓                                  ↓                    │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  JavaScript (checkout.js, admin.js)                 │       │
│  │  - API calls, Stripe integration, Local storage     │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                   │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ HTTP/REST API
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND SERVER (Node.js)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────┐      │
│  │  Express.js Server (server.js)                       │      │
│  │  - Route handling                                     │      │
│  │  - Request/response processing                        │      │
│  │  - CORS configuration                                │      │
│  └───────────────────────────────────────────────────────┘      │
│                            ↓                                    │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  API Routes                                          │      │
│  ├──────────────────────────────────────────────────────┤      │
│  │  routes/products.js    - Product CRUD               │      │
│  │  routes/orders.js      - Order management           │      │
│  │  routes/admin.js       - Dashboard & reports        │      │
│  │  routes/payment.js     - Stripe & mobile money      │      │
│  │  routes/delivery.js    - Yango integration          │      │
│  └──────────────────────────────────────────────────────┘      │
│                            ↓                                    │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  Models                                              │      │
│  ├──────────────────────────────────────────────────────┤      │
│  │  models/Product.js     - Product schema             │      │
│  │  models/Order.js       - Order schema               │      │
│  │  models/Admin.js       - Admin schema               │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                   │
└──────────────────────┬──────────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┬──────────────┐
         ↓             ↓             ↓              ↓
    ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐
    │ MongoDB │  │  Stripe  │  │  Yango  │  │ External │
    │ (Data)  │  │(Payments)│  │(Delivery)  │ Services │
    └─────────┘  └──────────┘  └─────────┘  └──────────┘
```

## 📊 Order Processing Flow

```
┌─────────────┐
│   Customer  │
│   Browses   │
└──────┬──────┘
       │
       ↓
┌──────────────────────┐
│  Adds Items to Cart  │
│  (localStorage)      │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│  Clicks Checkout     │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│  Enters Delivery Information         │
│  - Name, Phone, Address              │
│  - Chooses delivery method           │
│  - Selects payment method            │
└──────┬───────────────────────────────┘
       │
       ↓
   ╔═══════════════════════════╗
   ║   PAYMENT PROCESSING      ║
   ╠═══════════════════════════╣
   ║  Stripe?        Mobile?   ║
   ║     ↓              ↓      ║
   ║  Stripe API    Provider   ║
   ║  (Secure)      Integration║
   ╚═══════╤════════════╤═══════╝
           │            │
           └────┬───────┘
                ↓
       ┌────────────────┐
       │ Payment Status │
       │   Updated      │
       └────┬───────────┘
            │
            ↓
   ╔═══════════════════════════╗
   ║  ORDER CREATION IN DB     ║
   ║  - Order number           ║
   ║  - Items & prices         ║
   ║  - Customer info          ║
   ║  - Status: pending        ║
   ╚═════╤═══════════════════╤═╝
         │                   │
         ↓                   ↓
    ┌─────────────┐   ┌──────────────┐
    │  YANGO?     │   │   PICKUP?    │
    │     ↓       │   │     ↓        │
    │  Create     │   │  Store for   │
    │  Delivery   │   │  Pickup      │
    │  Order      │   │              │
    └─────┬───────┘   └──────┬───────┘
          │                  │
          └────────┬─────────┘
                   ↓
        ┌────────────────────────┐
        │  ORDER STATUS UPDATES  │
        │  - pending (1)         │
        │  - confirmed (2)       │
        │  - prepared (3)        │
        │  - ready (4)           │
        │  - in_delivery (5)     │
        │  - delivered (6)       │
        └────────┬───────────────┘
                 │
                 ↓
        ┌─────────────────────┐
        │  Admin Notified     │
        │  Dashboard Updated  │
        └─────────────────────┘
```

## 🔄 Admin Dashboard Flow

```
┌─────────────┐
│ Admin Login │
│ (login.html)│
└──────┬──────┘
       │
       ↓
┌──────────────────────┐
│ Check Credentials    │
│ (localStorage token) │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────────────────┐
│   ADMIN DASHBOARD (admin.html)   │
├──────────────────────────────────┤
│                                  │
│  ┌────────────────────────────┐  │
│  │ 1. DASHBOARD              │  │
│  │ - Total orders            │  │
│  │ - Paid orders             │  │
│  │ - Pending orders          │  │
│  │ - Delivered orders        │  │
│  │ - Total revenue           │  │
│  └────────────────────────────┘  │
│              ↓                   │
│  ┌────────────────────────────┐  │
│  │ 2. ORDERS                 │  │
│  │ - View all orders         │  │
│  │ - Update status           │  │
│  │ - Search & filter         │  │
│  │ - Track delivery          │  │
│  └────────────────────────────┘  │
│              ↓                   │
│  ┌────────────────────────────┐  │
│  │ 3. PAYMENTS               │  │
│  │ - Payment status          │  │
│  │ - Payment methods         │  │
│  │ - Revenue tracking        │  │
│  │ - Transaction history     │  │
│  └────────────────────────────┘  │
│              ↓                   │
│  ┌────────────────────────────┐  │
│  │ 4. PRODUCTS               │  │
│  │ - Add product             │  │
│  │ - Edit product            │  │
│  │ - Delete product          │  │
│  │ - TOGGLE AVAILABILITY     │◄──── KEY FEATURE
│  │ - Manage stock            │  │
│  └────────────────────────────┘  │
│              ↓                   │
│  ┌────────────────────────────┐  │
│  │ 5. DELIVERIES             │  │
│  │ - Yango deliveries        │  │
│  │ - Delivery status         │  │
│  │ - Cancel delivery         │  │
│  └────────────────────────────┘  │
│              ↓                   │
│  ┌────────────────────────────┐  │
│  │ 6. CUSTOMERS              │  │
│  │ - Customer list           │  │
│  │ - Order count             │  │
│  │ - Total spent             │  │
│  │ - Contact info            │  │
│  └────────────────────────────┘  │
│              ↓                   │
│  ┌────────────────────────────┐  │
│  │ 7. REPORTS                │  │
│  │ - Daily sales             │  │
│  │ - Payment reports         │  │
│  │ - Customer reports        │  │
│  │ - Product reports         │  │
│  └────────────────────────────┘  │
│                                  │
└──────────────────────────────────┘
```

## 💳 Payment Method Flow

```
              PAYMENT METHOD SELECTION
                       ↓
         ┌─────────────┴─────────────┐
         ↓                           ↓
    ┌─────────────┐           ┌──────────────────┐
    │ CREDIT CARD │           │ MOBILE MONEY     │
    │  (Stripe)   │           │  (Local Provider)│
    └──────┬──────┘           └────────┬─────────┘
           │                          │
           ↓                          ↓
    ┌──────────────────┐      ┌───────────────────┐
    │ Stripe Payment   │      │ Provider Selection│
    │ Intent Created   │      │ - Airtel Money    │
    │ - Amount: Total  │      │ - MTN Mobile Money│
    │ - Currency: USD  │      │ - Zamtel          │
    └────────┬─────────┘      └─────────┬─────────┘
             │                          │
             ↓                          ↓
    ┌──────────────────┐      ┌───────────────────┐
    │ Card Form        │      │ Phone Number Entry│
    │ - 4242424...     │      │ - Validation      │
    │ - Expiry: 12/25  │      │ - Provider API    │
    │ - CVC: 123       │      │   call            │
    └────────┬─────────┘      └─────────┬─────────┘
             │                          │
             ↓                          ↓
    ┌──────────────────┐      ┌───────────────────┐
    │ Payment          │      │ Provider Response │
    │ Confirmation     │      │ - Pending/Success │
    │ - Success/Fail   │      │ - Transaction ID  │
    └────────┬─────────┘      └─────────┬─────────┘
             │                          │
             └──────────┬───────────────┘
                        ↓
             ┌────────────────────────┐
             │ Update Order Status    │
             │ - paymentStatus: done  │
             │ - orderStatus: ready   │
             │ - Notify admin         │
             └────────────────────────┘
```

## 🚚 Delivery Integration

```
┌──────────────────┐
│ Order with Yango │
│ Delivery Selected│
└────────┬─────────┘
         │
         ↓
┌──────────────────────────────────┐
│ Create Yango Delivery Order      │
│ - Pickup: Coffee Shop            │
│ - Delivery: Customer Address     │
│ - Items: Order items             │
│ - Special instructions: Order #  │
└────────┬─────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│ Yango API Call                   │
│ POST /orders/create              │
│ Response: Delivery ID            │
└────────┬─────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│ Update Order in DB               │
│ - deliveryId: Yango ID           │
│ - deliveryStatus: assigned       │
│ - deliveryMethod: yango          │
└────────┬─────────────────────────┘
         │
         ↓
   ╔═══════════════════════════╗
   ║ DELIVERY STATUS TRACKING  ║
   ╠═══════════════════════════╣
   ║ 1. assigned - Driver found║
   ║ 2. picked_up - At store   ║
   ║ 3. in_transit - Delivering
   ║ 4. delivered - Complete   ║
   ╚═══════════════════════════╝
         │
         ↓
┌──────────────────────────────────┐
│ Admin Monitoring                 │
│ - Deliveries section             │
│ - Real-time status updates       │
│ - Can cancel if needed           │
└──────────────────────────────────┘
```

## 📱 Database Schema Overview

```
┌─────────────────────────────────┐
│        PRODUCTS COLLECTION      │
├─────────────────────────────────┤
│ _id         : ObjectId          │
│ name        : String            │
│ description : String            │
│ price       : Number            │
│ category    : String            │
│ available   : Boolean ✓✗        │
│ stock       : Number            │
│ image       : String            │
│ createdAt   : Date              │
└─────────────────────────────────┘
         ↑
         │ Referenced by
         │
┌─────────────────────────────────┐
│       ORDERS COLLECTION         │
├─────────────────────────────────┤
│ _id            : ObjectId       │
│ orderNumber    : String(unique) │
│ customerName   : String         │
│ customerPhone  : String         │
│ customerAddress: String         │
│ items[]        : Array          │
│   - productId  : ObjectId       │
│   - productName: String         │
│   - quantity   : Number         │
│   - price      : Number         │
│ totalAmount    : Number         │
│ paymentStatus  : String         │
│ paymentMethod  : String         │
│ orderStatus    : String         │
│ deliveryMethod : String         │
│ deliveryId     : String         │
│ deliveryStatus : String         │
│ createdAt      : Date           │
│ updatedAt      : Date           │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│        ADMIN COLLECTION         │
├─────────────────────────────────┤
│ _id      : ObjectId             │
│ username : String               │
│ password : String(hashed)       │
│ email    : String               │
│ role     : String               │
│ createdAt: Date                 │
└─────────────────────────────────┘
```

## 🔐 Authentication Flow

```
┌──────────────────┐
│  Admin Visits    │
│  login.html      │
└────────┬─────────┘
         │
         ↓
┌──────────────────────────────┐
│ Enter Credentials            │
│ - Username: admin            │
│ - Password: admin123         │
└────────┬─────────────────────┘
         │
         ↓
┌──────────────────────────────┐
│ Client-side Check            │
│ (JavaScript)                 │
│ - Verify credentials         │
│ - Match default credentials  │
└────────┬─────────────────────┘
         │
         ↓
┌──────────────────────────────┐
│ Generate Token               │
│ - Store in localStorage      │
│ - Token: demo_token_<time>   │
└────────┬─────────────────────┘
         │
         ↓
┌──────────────────────────────┐
│ Redirect to Dashboard        │
│ (admin.html)                 │
└────────┬─────────────────────┘
         │
         ↓
┌──────────────────────────────┐
│ Load Dashboard               │
│ - Verify token exists        │
│ - Load user data             │
│ - Display dashboard          │
└──────────────────────────────┘
```

## 🎯 User Journeys

### Customer Journey
```
Explore → Add to Cart → Checkout → Delivery Info → Payment → Order Placed
   ↓          ↓             ↓           ↓            ↓          ↓
 View     Update         Select      Enter        Stripe/   Confirmation
Products  Quantity    Availability   Address      Mobile    & Tracking
```

### Admin Journey
```
Login → Dashboard → Orders → Payments → Products → Deliveries → Reports
  ↓        ↓         ↓        ↓        ↓         ↓           ↓
Verify   View All   Update   Track   Toggle    Track      Analytics
Token    Stats     Status  Methods  Status     Delivery   & Insights
```

---

## 📈 System Status Flows

### Order Status Lifecycle
```
PENDING → CONFIRMED → PREPARED → READY → IN_DELIVERY → DELIVERED
  (1)       (2)         (3)       (4)        (5)          (6)
  
   │
   ├─→ CANCELLED (at any point)
   
Timeline: Customer creates → Admin confirms → Prepares → Ready → 
          Yango picks up → Delivers → Complete
```

### Payment Status Lifecycle
```
PENDING → COMPLETED
  (1)       (2)
  
  ├─→ FAILED
  │
  └─→ REFUNDED
```

### Delivery Status Lifecycle
```
NOT_ASSIGNED → ASSIGNED → PICKED_UP → IN_TRANSIT → DELIVERED
    (1)         (2)         (3)         (4)          (5)
    
    │
    └─→ CANCELLED
```

---

**These diagrams show the complete flow and architecture of your coffee shop management system.**
**All components are integrated and working together seamlessly!**
