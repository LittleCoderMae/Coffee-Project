// API Base URL
const API_BASE = 'http://localhost:5000/api';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadDashboardStats();
  loadOrders();
  loadProducts();
  loadCustomers();
  loadPayments();
  loadDeliveries();
});

// Authentication
function checkAuth() {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    window.location.href = 'login.html';
  }
}

function logout() {
  localStorage.removeItem('adminToken');
  window.location.href = 'login.html';
}

// Section Navigation
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.dashboard-section').forEach(section => {
    section.classList.remove('active');
  });

  // Remove active class from all nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });

  // Show selected section
  document.getElementById(sectionId).classList.add('active');

  // Add active class to clicked nav link
  event.target.classList.add('active');

  // Load section-specific data
  if (sectionId === 'orders') {
    loadOrders();
  } else if (sectionId === 'payments') {
    loadPayments();
  } else if (sectionId === 'products') {
    loadProducts();
  } else if (sectionId === 'customers') {
    loadCustomers();
  } else if (sectionId === 'deliveries') {
    loadDeliveries();
  } else if (sectionId === 'reports') {
    loadReports();
  }
}

// Dashboard Stats
async function loadDashboardStats() {
  try {
    const response = await fetch(`${API_BASE}/admin/stats`);
    const data = await response.json();

    document.getElementById('totalOrders').textContent = data.totalOrders;
    document.getElementById('paidOrders').textContent = data.paidOrders;
    document.getElementById('pendingOrders').textContent = data.pendingOrders;
    document.getElementById('deliveredOrders').textContent = data.deliveredOrders;
    document.getElementById('totalRevenue').textContent = `$${data.totalRevenue.toFixed(2)}`;
  } catch (error) {
    console.error('Error loading dashboard stats:', error);
  }
}

// Load Orders
async function loadOrders() {
  try {
    const response = await fetch(`${API_BASE}/orders/`);
    const orders = await response.json();

    const tbody = document.getElementById('ordersTable');
    tbody.innerHTML = '';

    orders.forEach(order => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${order.orderNumber}</strong></td>
        <td>${order.customerName}</td>
        <td>${order.customerPhone}</td>
        <td>$${order.totalAmount.toFixed(2)}</td>
        <td><span class="badge ${order.orderStatus}">${order.orderStatus}</span></td>
        <td><span class="badge ${order.paymentStatus}">${order.paymentStatus}</span></td>
        <td><span class="badge ${order.deliveryStatus}">${order.deliveryStatus}</span></td>
        <td>
          <button class="btn btn-primary btn-small" onclick="viewOrderDetails('${order._id}')">View</button>
          <button class="btn btn-success btn-small" onclick="updateOrderStatus('${order._id}')">Update</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading orders:', error);
  }
}

// View Order Details
async function viewOrderDetails(orderId) {
  try {
    const response = await fetch(`${API_BASE}/orders/${orderId}`);
    const order = await response.json();

    const itemsHTML = order.items.map(item => `
      <tr>
        <td>${item.productName}</td>
        <td>${item.quantity}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>$${item.subtotal.toFixed(2)}</td>
      </tr>
    `).join('');

    const modalBody = document.getElementById('orderModalBody');
    modalBody.innerHTML = `
      <div>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Customer:</strong> ${order.customerName}</p>
        <p><strong>Email:</strong> ${order.customerEmail || 'N/A'}</p>
        <p><strong>Phone:</strong> ${order.customerPhone}</p>
        <p><strong>Address:</strong> ${order.customerAddress}</p>
        <p><strong>Order Status:</strong> <span class="badge ${order.orderStatus}">${order.orderStatus}</span></p>
        <p><strong>Payment Status:</strong> <span class="badge ${order.paymentStatus}">${order.paymentStatus}</span></p>
        <p><strong>Delivery Status:</strong> <span class="badge ${order.deliveryStatus}">${order.deliveryStatus}</span></p>
        <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
        
        <h3>Items</h3>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <div style="margin-top: 20px; display: flex; gap: 10px;">
          <button class="btn btn-primary" onclick="quickUpdateStatus('${orderId}', 'confirmed')">Confirm Order</button>
          <button class="btn btn-primary" onclick="quickUpdateStatus('${orderId}', 'prepared')">Mark Prepared</button>
          <button class="btn btn-success" onclick="quickUpdateStatus('${orderId}', 'ready')">Ready for Pickup</button>
          <button class="btn btn-warning" onclick="quickUpdateStatus('${orderId}', 'delivered')">Mark Delivered</button>
        </div>
      </div>
    `;

    openModal('orderModal');
  } catch (error) {
    console.error('Error loading order details:', error);
  }
}

// Quick Update Status
async function quickUpdateStatus(orderId, status) {
  try {
    const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderStatus: status })
    });

    if (response.ok) {
      alert('Order status updated!');
      closeModal('orderModal');
      loadOrders();
      loadDashboardStats();
    }
  } catch (error) {
    console.error('Error updating order status:', error);
  }
}

// Update Order Status
function updateOrderStatus(orderId) {
  const status = prompt('Enter new status (pending, confirmed, prepared, ready, in_delivery, delivered, cancelled):');
  if (status) {
    quickUpdateStatus(orderId, status);
  }
}

// Filter Orders
function filterOrders() {
  const searchTerm = document.getElementById('orderSearch').value.toLowerCase();
  const rows = document.getElementById('ordersTable').getElementsByTagName('tr');

  Array.from(rows).forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? '' : 'none';
  });
}

// Refresh Orders
function refreshOrders() {
  loadOrders();
  alert('Orders refreshed!');
}

// Load Products
async function loadProducts() {
  try {
    const response = await fetch(`${API_BASE}/products/`);
    const products = await response.json();

    const tbody = document.getElementById('productsTable');
    tbody.innerHTML = '';

    products.forEach(product => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td>${product.stock}</td>
        <td>
          <label class="toggle-switch">
            <input type="checkbox" ${product.available ? 'checked' : ''} onchange="toggleProductAvailability('${product._id}')">
            <span class="toggle-slider"></span>
          </label>
          <span>${product.available ? 'Available' : 'Unavailable'}</span>
        </td>
        <td>
          <button class="btn btn-primary btn-small" onclick="editProduct('${product._id}')">Edit</button>
          <button class="btn btn-danger btn-small" onclick="deleteProduct('${product._id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

// Toggle Product Availability
async function toggleProductAvailability(productId) {
  try {
    const response = await fetch(`${API_BASE}/products/${productId}/toggle-availability`, {
      method: 'PATCH'
    });

    if (response.ok) {
      loadProducts();
    }
  } catch (error) {
    console.error('Error toggling product availability:', error);
  }
}

// Open Add Product Modal
function openAddProductModal() {
  document.getElementById('productName').value = '';
  document.getElementById('productCategory').value = '';
  document.getElementById('productPrice').value = '';
  document.getElementById('productStock').value = '';
  document.getElementById('productDescription').value = '';
  openModal('productModal');
}

// Edit Product
function editProduct(productId) {
  // Implement edit functionality
  alert('Edit product functionality coming soon!');
}

// Save Product
async function saveProduct(event) {
  event.preventDefault();

  const product = {
    name: document.getElementById('productName').value,
    category: document.getElementById('productCategory').value,
    price: parseFloat(document.getElementById('productPrice').value),
    stock: parseInt(document.getElementById('productStock').value),
    description: document.getElementById('productDescription').value,
    available: true
  };

  try {
    const response = await fetch(`${API_BASE}/products/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });

    if (response.ok) {
      alert('Product added successfully!');
      closeModal('productModal');
      loadProducts();
    }
  } catch (error) {
    console.error('Error saving product:', error);
  }
}

// Delete Product
async function deleteProduct(productId) {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      const response = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Product deleted!');
        loadProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }
}

// Load Customers
async function loadCustomers() {
  try {
    const response = await fetch(`${API_BASE}/admin/reports/customers`);
    const customers = await response.json();

    const tbody = document.getElementById('customersTable');
    tbody.innerHTML = '';

    customers.forEach(customer => {
      const row = document.createElement('tr');
      const lastOrder = new Date(customer.lastOrder).toLocaleDateString();
      row.innerHTML = `
        <td>${customer._id}</td>
        <td>${customer.email || 'N/A'}</td>
        <td>${customer.phone}</td>
        <td>${customer.totalOrders}</td>
        <td>$${customer.totalSpent.toFixed(2)}</td>
        <td>${lastOrder}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading customers:', error);
  }
}

// Load Payments
async function loadPayments() {
  try {
    const response = await fetch(`${API_BASE}/orders/`);
    const orders = await response.json();

    // Calculate payment stats
    const completed = orders.filter(o => o.paymentStatus === 'completed').length;
    const pending = orders.filter(o => o.paymentStatus === 'pending').length;
    const failed = orders.filter(o => o.paymentStatus === 'failed').length;

    document.getElementById('completedPayments').textContent = completed;
    document.getElementById('pendingPayments').textContent = pending;
    document.getElementById('failedPayments').textContent = failed;

    // Load payment history
    const tbody = document.getElementById('paymentsTable');
    tbody.innerHTML = '';

    orders.forEach(order => {
      const row = document.createElement('tr');
      const date = new Date(order.createdAt).toLocaleDateString();
      row.innerHTML = `
        <td>${order.orderNumber}</td>
        <td>${order.customerName}</td>
        <td>$${order.totalAmount.toFixed(2)}</td>
        <td>${order.paymentMethod || 'N/A'}</td>
        <td><span class="badge ${order.paymentStatus}">${order.paymentStatus}</span></td>
        <td>${date}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading payments:', error);
  }
}

// Load Deliveries
async function loadDeliveries() {
  try {
    const response = await fetch(`${API_BASE}/orders/`);
    const orders = await response.json();

    const deliveryOrders = orders.filter(o => o.deliveryMethod === 'yango_delivery');

    const tbody = document.getElementById('deliveriesTable');
    tbody.innerHTML = '';

    deliveryOrders.forEach(order => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${order.deliveryId || 'N/A'}</td>
        <td>${order.orderNumber}</td>
        <td>${order.customerName}</td>
        <td>${order.customerAddress}</td>
        <td><span class="badge ${order.deliveryStatus}">${order.deliveryStatus}</span></td>
        <td>
          <button class="btn btn-primary btn-small" onclick="viewDeliveryDetails('${order._id}')">View</button>
          <button class="btn btn-danger btn-small" onclick="cancelDelivery('${order.deliveryId}')">Cancel</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading deliveries:', error);
  }
}

// View Delivery Details
function viewDeliveryDetails(orderId) {
  alert('Delivery details for order: ' + orderId);
}

// Cancel Delivery
async function cancelDelivery(deliveryId) {
  if (confirm('Are you sure you want to cancel this delivery?')) {
    try {
      const response = await fetch(`${API_BASE}/delivery/cancel/${deliveryId}`, {
        method: 'POST'
      });

      if (response.ok) {
        alert('Delivery cancelled!');
        loadDeliveries();
      }
    } catch (error) {
      console.error('Error cancelling delivery:', error);
    }
  }
}

// Load Reports
async function loadReports() {
  try {
    // Load daily sales
    const salesResponse = await fetch(`${API_BASE}/admin/reports/daily-sales`);
    const sales = await salesResponse.json();

    const salesHTML = sales.map(day => `
      <tr>
        <td>${day._id}</td>
        <td>${day.orderCount}</td>
        <td>$${day.totalSales.toFixed(2)}</td>
      </tr>
    `).join('');

    // Load payment methods report
    const methodResponse = await fetch(`${API_BASE}/admin/reports/payments`);
    const methods = await methodResponse.json();

    const methodsHTML = methods.map(method => `
      <tr>
        <td>${method._id || 'Unknown'}</td>
        <td>${method.count}</td>
        <td>$${method.totalAmount.toFixed(2)}</td>
        <td>$${method.avgAmount.toFixed(2)}</td>
      </tr>
    `).join('');

    document.getElementById('dailySalesChart').innerHTML = `
      <table style="width: 100%;">
        <thead>
          <tr>
            <th>Date</th>
            <th>Orders</th>
            <th>Total Sales</th>
          </tr>
        </thead>
        <tbody>
          ${salesHTML}
        </tbody>
      </table>
    `;

    const tbody = document.getElementById('paymentMethodsTable');
    tbody.innerHTML = methodsHTML;
  } catch (error) {
    console.error('Error loading reports:', error);
  }
}

// Modal Functions
function openModal(modalId) {
  document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// Close modal when clicking outside
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.classList.remove('active');
  }
};
