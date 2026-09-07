// API Base URL
const API_BASE = 'http://localhost:5000/api';

// Stripe initialization
let stripe, elements, cardElement;

// Cart data
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeStripe();
  displayOrderSummary();
  setupPaymentMethodListeners();
});

// Initialize Stripe
function initializeStripe() {
  // Replace with your publishable key
  const stripeKey = 'pk_test_51234567890abcdefg';
  
  stripe = Stripe(stripeKey);
  elements = stripe.elements();
  cardElement = elements.create('card');
  cardElement.mount('#stripe-element');

  // Handle real-time validation errors from the card Element
  cardElement.addEventListener('change', (event) => {
    if (event.error) {
      showError(event.error.message);
    } else {
      clearError();
    }
  });
}

// Display Order Summary
function displayOrderSummary() {
  if (cart.length === 0) {
    document.getElementById('orderItems').innerHTML = '<p>Your cart is empty</p>';
    return;
  }

  let html = '';
  let subtotal = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    html += `
      <div class="order-item">
        <div class="item-info">
          <h4>${item.name}</h4>
          <p>$${item.price.toFixed(2)} each</p>
        </div>
        <div class="item-quantity">
          <button type="button" onclick="updateQuantity(${index}, -1)">-</button>
          <span>${item.quantity}</span>
          <button type="button" onclick="updateQuantity(${index}, 1)">+</button>
        </div>
        <div class="item-price">
          $${itemTotal.toFixed(2)}
          <button type="button" onclick="removeItem(${index})" style="display: block; width: 100%; margin-top: 5px; padding: 3px; background-color: #f44336;">✕</button>
        </div>
      </div>
    `;
  });

  document.getElementById('orderItems').innerHTML = html;

  // Update totals
  const deliveryFee = 2.00;
  const total = subtotal + deliveryFee;

  document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
  document.getElementById('deliveryFee').textContent = '$' + deliveryFee.toFixed(2);
  document.getElementById('totalAmount').textContent = '$' + total.toFixed(2);
}

// Update Quantity
function updateQuantity(index, change) {
  cart[index].quantity += change;
  if (cart[index].quantity < 1) {
    cart.splice(index, 1);
  }
  saveCart();
  displayOrderSummary();
}

// Remove Item
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  displayOrderSummary();
}

// Save Cart to LocalStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Setup Payment Method Listeners
function setupPaymentMethodListeners() {
  const paymentOptions = document.querySelectorAll('.payment-option');
  paymentOptions.forEach(option => {
    option.addEventListener('click', function() {
      const radio = this.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        selectPayment(radio.value);
      }
    });
  });

  const deliveryOptions = document.querySelectorAll('.payment-option');
  deliveryOptions.forEach(option => {
    option.addEventListener('click', function() {
      const radio = this.querySelector('input[type="radio"]');
      if (radio && radio.name === 'delivery') {
        radio.checked = true;
        selectDelivery(radio.value);
      }
    });
  });
}

// Select Payment Method
function selectPayment(method) {
  // Update UI
  document.querySelectorAll('input[name="payment"]').forEach(radio => {
    const option = radio.closest('.payment-option');
    if (radio.value === method) {
      radio.checked = true;
      option.classList.add('selected');
    } else {
      option.classList.remove('selected');
    }
  });

  // Show/hide relevant payment forms
  if (method === 'stripe') {
    document.getElementById('stripeContainer').style.display = 'block';
    document.getElementById('mobileMoneyContainer').style.display = 'none';
  } else if (method === 'mobile') {
    document.getElementById('stripeContainer').style.display = 'none';
    document.getElementById('mobileMoneyContainer').style.display = 'block';
  }
}

// Select Delivery Method
function selectDelivery(method) {
  document.querySelectorAll('input[name="delivery"]').forEach(radio => {
    const option = radio.closest('.payment-option');
    if (radio.value === method) {
      radio.checked = true;
      option.classList.add('selected');
    } else {
      option.classList.remove('selected');
    }
  });
}

// Handle Checkout
async function handleCheckout(event) {
  event.preventDefault();

  if (cart.length === 0) {
    showError('Your cart is empty!');
    return;
  }

  // Get form data
  const customerName = document.getElementById('customerName').value;
  const customerEmail = document.getElementById('customerEmail').value;
  const customerPhone = document.getElementById('customerPhone').value;
  const customerAddress = document.getElementById('customerAddress').value;
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
  const deliveryMethod = document.querySelector('input[name="delivery"]:checked').value;

  // Validate
  if (!customerName || !customerPhone || !customerAddress) {
    showError('Please fill in all required fields!');
    return;
  }

  // Show loading
  document.getElementById('loadingSpinner').style.display = 'block';
  document.getElementById('submitBtn').disabled = true;

  try {
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = deliveryMethod === 'yango' ? 2.00 : 0;
    const totalAmount = subtotal + deliveryFee;

    // Create order
    const orderResponse = await fetch(`${API_BASE}/orders/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        items: cart.map(item => ({
          productId: item._id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity
        })),
        totalAmount,
        paymentMethod,
        deliveryMethod,
        orderStatus: 'pending',
        paymentStatus: 'pending'
      })
    });

    if (!orderResponse.ok) {
      throw new Error('Failed to create order');
    }

    const order = await orderResponse.json();
    const orderId = order._id;

    // Process payment based on method
    if (paymentMethod === 'stripe') {
      await processStripePayment(orderId, totalAmount, order.orderNumber);
    } else if (paymentMethod === 'mobile') {
      await processMobileMoneyPayment(orderId, totalAmount, order.orderNumber);
    }

    // Setup delivery if Yango
    if (deliveryMethod === 'yango') {
      await setupYangoDelivery(orderId, customerAddress, customerPhone);
    }

    // Show success
    showSuccess(order.orderNumber);

    // Clear cart
    localStorage.removeItem('cart');

    // Redirect after 3 seconds
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 3000);

  } catch (error) {
    showError('Checkout failed: ' + error.message);
    console.error('Checkout error:', error);
  } finally {
    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('submitBtn').disabled = false;
  }
}

// Process Stripe Payment
async function processStripePayment(orderId, amount, orderNumber) {
  try {
    // Create payment intent
    const intentResponse = await fetch(`${API_BASE}/payment/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, orderId })
    });

    const { clientSecret } = await intentResponse.json();

    // Confirm payment with card
    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: document.getElementById('customerName').value
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (paymentIntent.status === 'succeeded') {
      // Confirm payment in backend
      await fetch(`${API_BASE}/payment/confirm-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          paymentIntentId: paymentIntent.id,
          paymentMethod: 'stripe'
        })
      });
    }
  } catch (error) {
    throw new Error('Stripe payment failed: ' + error.message);
  }
}

// Process Mobile Money Payment
async function processMobileMoneyPayment(orderId, amount, orderNumber) {
  try {
    const provider = document.getElementById('mobileProvider').value;
    const phoneNumber = document.getElementById('mobileNumber').value;

    if (!provider || !phoneNumber) {
      throw new Error('Please select provider and enter phone number');
    }

    const response = await fetch(`${API_BASE}/payment/mobile-money`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        phoneNumber,
        provider,
        amount
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Mobile money payment failed');
    }

    // In a real scenario, you would wait for payment confirmation webhook
    // For now, show success message
    showSuccess(orderNumber);
  } catch (error) {
    throw new Error('Mobile money payment failed: ' + error.message);
  }
}

// Setup Yango Delivery
async function setupYangoDelivery(orderId, address, phone) {
  try {
    const response = await fetch(`${API_BASE}/delivery/create-delivery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        customerAddress: address,
        customerPhone: phone,
        items: cart
      })
    });

    if (!response.ok) {
      console.warn('Yango delivery setup warning:', response.statusText);
    }
  } catch (error) {
    console.warn('Yango delivery setup error:', error);
  }
}

// Show Error Message
function showError(message) {
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  window.scrollTo(0, 0);
}

// Clear Error Message
function clearError() {
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.style.display = 'none';
}

// Show Success Message
function showSuccess(orderNumber) {
  const successDiv = document.getElementById('successMessage');
  document.getElementById('orderNumber').textContent = orderNumber;
  successDiv.style.display = 'block';
  window.scrollTo(0, 0);
}
