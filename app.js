// Shared app script: menu, cart, payment, and order flow
const menuItems = [
	{ id: 1, name: "Espresso", category: "coffee", price: 25.00, description: "Strong and bold, our signature espresso shot", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
	{ id: 2, name: "Cappuccino", category: "coffee", price: 32.50, description: "Perfectly balanced espresso with steamed milk and foam", image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
	{ id: 3, name: "Latte", category: "coffee", price: 35.00, description: "Smooth espresso with steamed milk and a light layer of foam", image: "https://images.unsplash.com/photo-1561047029-3000c68339ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
	{ id: 4, name: "Cold Brew", category: "coffee", price: 30.00, description: "Smooth, refreshing cold brew coffee", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
	{ id: 5, name: "Green Tea", category: "tea", price: 20.00, description: "Light and refreshing green tea", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
	{ id: 6, name: "Chai Latte", category: "tea", price: 28.00, description: "Spiced tea with steamed milk", image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
	{ id: 7, name: "Croissant", category: "pastry", price: 18.00, description: "Buttery, flaky croissant", image:"images/crossant.jpeg" },
	{ id: 8, name: "Blueberry Muffin", category: "pastry", price: 16.50, description: "Freshly baked muffin with juicy blueberries", image: "images/muffin.jpeg" },
	{ id: 9, name: "Chocolate Cake", category: "cake", price: 65.00, description: "Rich, moist chocolate cake with chocolate frosting", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
	{ id: 10, name: "Red Velvet Cake", category: "cake", price: 75.00, description: "Classic red velvet with cream cheese frosting", image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
	{ id: 11, name: "Carrot Cake", category: "cake", price: 68.00, description: "Moist carrot cake with walnuts and cream cheese frosting", image: "images/carrot.jpeg" },
	{ id: 12, name: "Cheesecake", category: "cake", price: 72.00, description: "Creamy New York-style cheesecake with berry compote", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
	{ id: 13, name: "Classic Brownie", category: "brownie", price: 22.00, description: "Fudgy, chocolatey brownie with walnuts", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
	{ id: 14, name: "Blondie", category: "brownie", price: 24.00, description: "Butterscotch brownie with white chocolate chips", image: "images/blondie.jpeg" },
	{ id: 15, name: "Salted Caramel Brownie", category: "brownie", price: 26.00, description: "Rich chocolate brownie with salted caramel swirl", image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
	{ id: 16, name: "Peanut Butter Brownie", category: "brownie", price: 25.00, description: "Chocolate brownie with peanut butter swirl", image: "images/peanut.jpeg" }
];

let cart = [];
let currentCategory = 'all';
let selectedProvider = null;
const providerLabels = { mtn: 'MTN Mobile Money', airtel: 'Airtel Money', zamtel: 'Zamtel Money' };

// DOM refs (may be null on pages without specific sections)
const menuGrid = document.getElementById('menuGrid');
const cartSection = document.getElementById('cartSection');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const paymentSection = document.getElementById('paymentSection');
const paymentTabs = document.querySelectorAll('.payment-tab');
const paymentForms = document.querySelectorAll('.payment-form');
const cardPaymentForm = document.getElementById('cardPaymentForm');
const mobilePaymentForm = document.getElementById('mobilePaymentForm');
const orderConfirmation = document.getElementById('orderConfirmation');
const orderDetails = document.getElementById('orderDetails');
const newOrderBtn = document.getElementById('newOrderBtn');
const categoryButtons = document.querySelectorAll('.category-btn');
const providerOptions = document.querySelectorAll('.provider-option');
const providerRadios = document.querySelectorAll('input[name="provider"]');

function displayMenuItems(items) {
	if (!menuGrid) return;
	menuGrid.innerHTML = '';
	items.forEach(item => {
		const menuItemElement = document.createElement('div');
		menuItemElement.className = 'menu-item';
		menuItemElement.innerHTML = `\
			<img src="${item.image}" alt="${item.name}">\
			<div class="menu-item-content">\
				<h3>${item.name}</h3>\
				<p>${item.description}</p>\
				<div class="menu-item-footer">\
					<span class="price">ZMW ${item.price.toFixed(2)}</span>\
					<button class="add-to-cart" data-id="${item.id}">Add to Cart</button>\
				</div>\
			</div>`;
		menuGrid.appendChild(menuItemElement);
	});
	menuGrid.querySelectorAll('.add-to-cart').forEach(btn => btn.addEventListener('click', (e) => { addToCart(parseInt(e.target.dataset.id)); }));
}

function initMenu() {
	if (!menuGrid) return;
	displayMenuItems(menuItems);
	categoryButtons.forEach(btn => btn.addEventListener('click', () => {
		categoryButtons.forEach(b => b.classList.remove('active'));
		btn.classList.add('active');
		currentCategory = btn.dataset.category;
		const filtered = currentCategory === 'all' ? menuItems : menuItems.filter(i => i.category === currentCategory);
		displayMenuItems(filtered);
	}));
}

function addToCart(itemId) {
	const item = menuItems.find(i => i.id === itemId);
	if (!item) return;
	const existing = cart.find(c => c.id === itemId);
	if (existing) existing.quantity += 1; else cart.push({ ...item, quantity: 1 });
	updateCart();
}

function removeFromCart(itemId) {
	cart = cart.filter(i => i.id !== itemId);
	updateCart();
}

function updateQuantity(itemId, qty) {
	if (qty < 1) { removeFromCart(itemId); return; }
	const it = cart.find(c => c.id === itemId);
	if (!it) return;
	it.quantity = qty;
	updateCart();
}

function updateCart() {
	if (cartItems && cartTotal && cartCount) {
		cartItems.innerHTML = '';
		cart.forEach(item => {
			const el = document.createElement('div');
			el.className = 'cart-item';
			const thumb = item.image && item.image.length ? item.image : 'images/placeholder.png';
			el.innerHTML = `\
					<img src="${thumb}" alt="${item.name}">\
					<div class="cart-item-info">\
						<div class="cart-item-name">${item.name}</div>\
						<div class="cart-item-price">ZMW ${item.price.toFixed(2)}</div>\
					</div>\
					<div class="cart-item-quantity">\
						<button class="quantity-btn minus" data-id="${item.id}">-</button>\
						<span class="quantity">${item.quantity}</span>\
						<button class="quantity-btn plus" data-id="${item.id}">+</button>\
						<button class="remove-item" data-id="${item.id}">×</button>\
					</div>`;
			cartItems.appendChild(el);
		});
		cartItems.querySelectorAll('.quantity-btn.minus').forEach(b => b.addEventListener('click', (e) => { const id = parseInt(e.target.dataset.id); const it = cart.find(c => c.id === id); updateQuantity(id, it.quantity - 1); }));
		cartItems.querySelectorAll('.quantity-btn.plus').forEach(b => b.addEventListener('click', (e) => { const id = parseInt(e.target.dataset.id); const it = cart.find(c => c.id === id); updateQuantity(id, it.quantity + 1); }));
		cartItems.querySelectorAll('.remove-item').forEach(b => b.addEventListener('click', (e) => { removeFromCart(parseInt(e.target.dataset.id)); }));
		const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
		cartTotal.textContent = `Total: ZMW ${total.toFixed(2)}`;
		const count = cart.reduce((c, i) => c + i.quantity, 0);
		cartCount.textContent = count;
	}
	saveCartToStorage();
	renderRecommendations();
	// update sidebar summary if present
	const summaryCount = document.getElementById('summaryCount');
	const summarySubtotal = document.getElementById('summarySubtotal');
	const summaryTotal = document.getElementById('summaryTotal');
	if (summaryCount) summaryCount.textContent = cart.reduce((c,i)=>c+i.quantity,0);
	if (summarySubtotal) summarySubtotal.textContent = `ZMW ${cart.reduce((s,i)=>s+(i.price*i.quantity),0).toFixed(2)}`;
	if (summaryTotal) summaryTotal.textContent = `ZMW ${cart.reduce((s,i)=>s+(i.price*i.quantity),0).toFixed(2)}`;
	// refresh checkout summary if visible
	renderCheckoutSummary();
}

function setStep(idx) {
	// stepper UI removed — keep as no-op for compatibility
	return;
}

function renderRecommendations() {
	const grid = document.getElementById('recommendationGrid');
	if (!grid) return;
	grid.innerHTML = '';
	let candidates = [];
	if (cart.length > 0) {
		const firstCat = cart[0].category;
		candidates = menuItems.filter(i => i.category === firstCat && !cart.find(c => c.id === i.id));
	}
	if (!candidates || candidates.length === 0) candidates = menuItems.filter(i => !cart.find(c => c.id === i.id));
	candidates.slice(0,4).forEach(item => {
		const el = document.createElement('div'); el.className = 'menu-item';
		el.innerHTML = `\
			<img src="${item.image}" alt="${item.name}">\
			<div class="menu-item-content">\
				<h3>${item.name}</h3>\
				<p>${item.description}</p>\
				<div class="menu-item-footer">\
					<span class="price">ZMW ${item.price.toFixed(2)}</span>\
					<button class="add-to-cart" data-id="${item.id}">Add to Cart</button>\
				</div>\
			</div>`;
		grid.appendChild(el);
	});
	grid.querySelectorAll('.add-to-cart').forEach(btn => btn.addEventListener('click', (e) => addToCart(parseInt(e.target.dataset.id))));
}

function showMenu() {
	const menuSection = document.getElementById('menu');
	const menuGridEl = document.getElementById('menuGrid');
	if (!menuSection || !menuGridEl) return;
	// show section and render items
	menuSection.style.display = 'block';
	// ensure categories active handlers are set
	document.querySelectorAll('.category-btn').forEach(btn => btn.addEventListener('click', () => {
		document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
		btn.classList.add('active');
		const category = btn.dataset.category;
		const filtered = category === 'all' ? menuItems : menuItems.filter(i => i.category === category);
		displayMenuItems(filtered);
	}));
	displayMenuItems(menuItems);
	// scroll to menu
	setTimeout(() => menuSection.scrollIntoView({ behavior: 'smooth' }), 80);
}

function saveCartToStorage() { try { localStorage.setItem('brew_cart', JSON.stringify(cart)); } catch (e) {} }
function loadCartFromStorage() { try { const raw = localStorage.getItem('brew_cart'); if (raw) cart = JSON.parse(raw); } catch (e) { cart = []; } }

// Toast helper: creates a toast container if missing and shows messages
function ensureToastContainer() {
	let c = document.querySelector('.toast-container');
	if (!c) { c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); }
	return c;
}

function showToast(message, type = 'info', title = '') {
	const container = ensureToastContainer();
	const t = document.createElement('div'); t.className = `toast ${type}`;
	if (title) t.innerHTML = `<div class="title">${title}</div><div class="message">${message}</div>`; else t.innerHTML = `<div class="message">${message}</div>`;
	container.appendChild(t);
	// trigger transition
	void t.offsetWidth;
	t.classList.add('show');
	const timeout = 3500;
	const remover = () => { t.classList.remove('show'); setTimeout(() => t.remove(), 260); };
	const id = setTimeout(remover, timeout);
	t.addEventListener('click', () => { clearTimeout(id); remover(); });
}

function renderCheckoutSummary() {
	// order summary sidebar removed — no-op
	return;
}
// (Reviews are simulated/static — real-time review code removed)

function showPayment() { if (paymentSection) paymentSection.style.display = 'block'; }
function hidePayment() { if (paymentSection) paymentSection.style.display = 'none'; }

function showOrderConfirmation() {
	// Simplified: clear cart and notify user. No confirmation panel.
	const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
	const items = cart.reduce((c, i) => c + i.quantity, 0);
	cart = [];
	saveCartToStorage();
	updateCart();
	showToast(`${items} item(s) — Total ZMW ${total.toFixed(2)}. Thank you!`, 'success', 'Order Placed');
}

function resetOrder() {
	cart = [];
	saveCartToStorage();
	if (cartItems) cartItems.innerHTML = '<div class="card" style="text-align:center;padding:1rem;">Your cart is empty.</div>';
	if (cardPaymentForm) cardPaymentForm.reset();
	if (mobilePaymentForm) mobilePaymentForm.reset();
	document.querySelectorAll('.provider-option').forEach(o => o.classList.remove('selected'));
	selectedProvider = null;
	updateCart();
}

function init() {
	loadCartFromStorage();
	initMenu();
	if (menuGrid) displayMenuItems(menuItems);
	if (document.getElementById('cartCount')) updateCart();
	if (checkoutBtn) checkoutBtn.addEventListener('click', showPayment);
	if (paymentTabs) {
		paymentTabs.forEach((tab, idx) => {
			tab.setAttribute('role', 'tab');
			tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');
			tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
			tab.addEventListener('click', () => {
				paymentTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); t.setAttribute('tabindex', '-1'); });
				tab.classList.add('active'); tab.setAttribute('aria-selected', 'true'); tab.setAttribute('tabindex', '0');
				paymentForms.forEach(f => f.classList.remove('active'));
				const formEl = document.getElementById(`${tab.dataset.method}Form`);
				if (formEl) formEl.classList.add('active');
				tab.focus();
			});
			tab.addEventListener('keydown', (ev) => {
				if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
					ev.preventDefault();
					const next = ev.key === 'ArrowRight' ? (idx + 1) % paymentTabs.length : (idx - 1 + paymentTabs.length) % paymentTabs.length;
					paymentTabs[next].focus();
				} else if (ev.key === 'Enter' || ev.key === ' ') {
					ev.preventDefault(); tab.click();
				}
			});
		});
	}
	if (providerOptions) providerOptions.forEach(option => {
		option.setAttribute('tabindex', '0');
		option.setAttribute('role', 'button');
		option.addEventListener('click', (e) => { providerOptions.forEach(o => o.classList.remove('selected')); option.classList.add('selected'); selectedProvider = option.dataset.provider || option.querySelector('input[name="provider"]')?.value; });
		option.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); option.click(); } });
	});
	// provider-option labels (checkout.html) click handling
	document.querySelectorAll('.provider-option').forEach(label => label.addEventListener('click', (e) => {
		document.querySelectorAll('.provider-option').forEach(l => l.classList.remove('selected'));
		label.classList.add('selected');
		selectedProvider = label.dataset.provider || label.querySelector('input[name="provider"]')?.value;
	}));
	if (providerRadios) providerRadios.forEach(r => r.addEventListener('change', (e) => selectedProvider = e.target.value));

	// back button behavior (go back in history or to home)
	document.querySelectorAll('.back-btn').forEach(b => b.addEventListener('click', (e) => {
		e.preventDefault();
		if (window.history && window.history.length > 1) window.history.back(); else window.location.href = 'index.html';
	}));
	if (cardPaymentForm) cardPaymentForm.addEventListener('submit', (e) => { e.preventDefault(); mockPaymentProcess('card'); });
	if (mobilePaymentForm) mobilePaymentForm.addEventListener('submit', (e) => {
		e.preventDefault();
		if (!selectedProvider) { showToast('Select a provider', 'error'); return; }
		const mobileNumber = document.getElementById('mobileNumber')?.value; const pin = document.getElementById('pin')?.value;
		if (!mobileNumber || !pin) { showToast('Fill mobile fields', 'error'); return; }
		mockPaymentProcess('mobile');
	});
	if (newOrderBtn) newOrderBtn.addEventListener('click', resetOrder);
	renderRecommendations();
	// render checkout summary live (no-op if removed)
	renderCheckoutSummary();

	// wire hero view menu button to navigate to the dedicated menu page
	const viewMenuBtn = document.getElementById('viewMenuBtn');
	if (viewMenuBtn) viewMenuBtn.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'menu.html'; });

	// Reviews are static testimonials rendered in HTML; no dynamic review handlers.
	// promo code
	const applyPromo = document.getElementById('applyPromo');
	if (applyPromo) applyPromo.addEventListener('click', (e) => {
		e.preventDefault();
		const code = document.getElementById('promoCode')?.value?.trim();
		if (!code) return showToast('Enter a promo code', 'error');
		if (code.toUpperCase() === 'SAVE10') {
			const totalEl = document.getElementById('summaryTotal');
			const subtotal = cart.reduce((s,i)=>s+(i.price*i.quantity),0);
			const delivery = subtotal > 0 ? 20 : 0;
			const discounted = (subtotal + delivery) * 0.9;
			if (totalEl) totalEl.textContent = `ZMW ${discounted.toFixed(2)}`;
			showToast('Promo applied: 10% off', 'success');
		} else { showToast('Promo not recognized', 'error'); }
	});
	// place order button hooks
	const placeOrderBtn = document.getElementById('placeOrderBtn');
	if (placeOrderBtn) placeOrderBtn.addEventListener('click', (e) => { e.preventDefault(); if (cart.length === 0) { showToast('Your cart is empty', 'info'); return; } // go to payment step
		setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); });

	// Contact form handling: use non-blocking toast
	const contactForm = document.getElementById('contactForm');
	if (contactForm) {
		contactForm.addEventListener('submit', (e) => {
			e.preventDefault();
			const name = document.getElementById('name')?.value || 'Guest';
			contactForm.reset();
			showToast(`Thanks ${name}, we received your message.`, 'success', 'Message Sent');
		});
	}
}

function mockPaymentProcess(method) {
	const overlay = document.getElementById('paymentOverlay');
	const spinner = document.getElementById('paymentSpinner');
	const success = document.getElementById('paymentSuccess');
	const cardForm = document.getElementById('cardPaymentForm');
	const mobileForm = document.getElementById('mobilePaymentForm');
	if (!overlay) { showOrderConfirmation(); setStep(2); return; }
	overlay.style.display = 'flex';
	overlay.classList.remove('success');
	spinner.style.display = 'block';
	success.style.display = 'none';
	// disable inputs
	[cardForm, mobileForm].forEach(f => { if (!f) return; Array.from(f.querySelectorAll('input,button,textarea')).forEach(el => el.disabled = true); });
	// simulate network delay
	setTimeout(() => {
		// show success
		overlay.classList.add('success');
		spinner.style.display = 'none';
		success.style.display = 'flex';
		// small delay to show success animation
		setTimeout(() => {
			overlay.style.display = 'none';
			// re-enable inputs
			[cardForm, mobileForm].forEach(f => { if (!f) return; Array.from(f.querySelectorAll('input,button,textarea')).forEach(el => el.disabled = false); });
			// finalize
			showOrderConfirmation();
			setStep(2);
		}, 800);
	}, 1600);
}

document.addEventListener('DOMContentLoaded', init);

