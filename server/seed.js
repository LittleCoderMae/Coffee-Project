const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Product = require('./models/Product');
const Order = require('./models/Order');
const Admin = require('./models/Admin');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coffee-shop')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

// Sample Products Data
const sampleProducts = [
  {
    name: 'Espresso',
    description: 'Rich and bold espresso shot',
    price: 3.50,
    category: 'coffee',
    image: 'espresso.jpg',
    available: true,
    stock: 50
  },
  {
    name: 'Cappuccino',
    description: 'Creamy cappuccino with perfect foam',
    price: 4.50,
    category: 'coffee',
    image: 'cappuccino.jpg',
    available: true,
    stock: 45
  },
  {
    name: 'Latte',
    description: 'Smooth and creamy latte',
    price: 4.75,
    category: 'coffee',
    image: 'latte.jpg',
    available: true,
    stock: 40
  },
  {
    name: 'Americano',
    description: 'Classic American coffee',
    price: 3.75,
    category: 'coffee',
    image: 'americano.jpg',
    available: true,
    stock: 55
  },
  {
    name: 'Croissant',
    description: 'Buttery French croissant',
    price: 3.50,
    category: 'pastry',
    image: 'croissant.jpg',
    available: true,
    stock: 30
  },
  {
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake slice',
    price: 4.00,
    category: 'pastry',
    image: 'chocolate-cake.jpg',
    available: true,
    stock: 25
  },
  {
    name: 'Blueberry Muffin',
    description: 'Fresh blueberry muffin',
    price: 3.25,
    category: 'pastry',
    image: 'blueberry-muffin.jpg',
    available: true,
    stock: 35
  },
  {
    name: 'Almond Biscotti',
    description: 'Crispy almond biscotti',
    price: 2.50,
    category: 'pastry',
    image: 'biscotti.jpg',
    available: true,
    stock: 60
  },
  {
    name: 'Cheese Sandwich',
    description: 'Grilled cheese sandwich',
    price: 5.50,
    category: 'snacks',
    image: 'cheese-sandwich.jpg',
    available: true,
    stock: 20
  },
  {
    name: 'Ham & Cheese Wrap',
    description: 'Delicious ham and cheese wrap',
    price: 6.50,
    category: 'snacks',
    image: 'wrap.jpg',
    available: true,
    stock: 15
  },
  {
    name: 'Trail Mix',
    description: 'Healthy trail mix',
    price: 3.75,
    category: 'snacks',
    image: 'trail-mix.jpg',
    available: true,
    stock: 40
  },
  {
    name: 'Orange Juice',
    description: 'Fresh squeezed orange juice',
    price: 3.50,
    category: 'drinks',
    image: 'orange-juice.jpg',
    available: true,
    stock: 35
  },
  {
    name: 'Iced Tea',
    description: 'Refreshing iced tea',
    price: 2.75,
    category: 'drinks',
    image: 'iced-tea.jpg',
    available: true,
    stock: 45
  },
  {
    name: 'Smoothie - Berry',
    description: 'Mixed berry smoothie',
    price: 5.00,
    category: 'drinks',
    image: 'smoothie.jpg',
    available: true,
    stock: 25
  },
  {
    name: 'Hot Chocolate',
    description: 'Creamy hot chocolate',
    price: 3.75,
    category: 'drinks',
    image: 'hot-chocolate.jpg',
    available: true,
    stock: 30
  }
];

// Sample Orders Data
const sampleOrders = [
  {
    orderNumber: 'ORD-' + Date.now() + '-0001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+260977123456',
    customerAddress: '123 Main Street, Lusaka',
    items: [
      {
        productId: new mongoose.Types.ObjectId(),
        productName: 'Cappuccino',
        quantity: 2,
        price: 4.50,
        subtotal: 9.00
      },
      {
        productId: new mongoose.Types.ObjectId(),
        productName: 'Croissant',
        quantity: 1,
        price: 3.50,
        subtotal: 3.50
      }
    ],
    totalAmount: 14.50,
    paymentStatus: 'completed',
    paymentMethod: 'stripe',
    orderStatus: 'delivered',
    deliveryMethod: 'yango_delivery',
    deliveryStatus: 'delivered',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    orderNumber: 'ORD-' + Date.now() + '-0002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    customerPhone: '+260966789012',
    customerAddress: '456 Oak Avenue, Lusaka',
    items: [
      {
        productId: new mongoose.Types.ObjectId(),
        productName: 'Latte',
        quantity: 1,
        price: 4.75,
        subtotal: 4.75
      },
      {
        productId: new mongoose.Types.ObjectId(),
        productName: 'Blueberry Muffin',
        quantity: 2,
        price: 3.25,
        subtotal: 6.50
      }
    ],
    totalAmount: 13.25,
    paymentStatus: 'completed',
    paymentMethod: 'mobile_money',
    orderStatus: 'in_delivery',
    deliveryMethod: 'yango_delivery',
    deliveryStatus: 'in_transit',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    orderNumber: 'ORD-' + Date.now() + '-0003',
    customerName: 'Mike Johnson',
    customerEmail: 'mike@example.com',
    customerPhone: '+260975555555',
    customerAddress: '789 Pine Road, Lusaka',
    items: [
      {
        productId: new mongoose.Types.ObjectId(),
        productName: 'Espresso',
        quantity: 3,
        price: 3.50,
        subtotal: 10.50
      },
      {
        productId: new mongoose.Types.ObjectId(),
        productName: 'Cheese Sandwich',
        quantity: 1,
        price: 5.50,
        subtotal: 5.50
      }
    ],
    totalAmount: 18.00,
    paymentStatus: 'pending',
    paymentMethod: 'stripe',
    orderStatus: 'confirmed',
    deliveryMethod: 'pickup',
    deliveryStatus: 'not_assigned',
    createdAt: new Date()
  }
];

// Seed database
async function seedDatabase() {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Admin.deleteMany({});

    // Insert products
    console.log('Inserting products...');
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${products.length} products`);

    // Insert orders
    console.log('Inserting orders...');
    const orders = await Order.insertMany(sampleOrders);
    console.log(`✅ Inserted ${orders.length} orders`);

    // Create admin user
    console.log('Creating admin user...');
    const admin = new Admin({
      username: 'admin',
      password: 'admin123', // In production, hash this password
      email: 'admin@brewtakes.com',
      role: 'admin'
    });
    await admin.save();
    console.log('✅ Admin user created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nAdmin Credentials:');
    console.log('- Username: admin');
    console.log('- Password: admin123');
    console.log('\nSample Data:');
    console.log(`- ${products.length} products added`);
    console.log(`- ${orders.length} sample orders added`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed
seedDatabase();
