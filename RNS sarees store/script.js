// ============================================================
//  RNS Sarees Store — script.js
//  COD + UPI Orders, Order Tracking, Profile, Animations
// ============================================================

const WA_NUMBER = '918978421841';
const UPI_ID    = '8978421841@upi';

// ── Order statuses (demo progression) ──
const ORDER_STATUSES = ['Confirmed', 'Packed', 'Shipped', 'Delivered'];

// ── Current order being placed ──
let currentOrder = { product: '', price: '' };

// ============================================================
//  ORDER MODAL
// ============================================================
function openOrderModal(productName, price) {
  currentOrder = { product: productName, price };

  // Pre-fill from profile if saved
  const profile = getProfile();
  if (profile.name)    document.getElementById('order-name').value    = profile.name;
  if (profile.phone)   document.getElementById('order-phone').value   = profile.phone;
  if (profile.address) document.getElementById('order-address').value = profile.address;

  document.getElementById('modal-product-info').textContent =
    `✦ ${productName}  ·  ₹${Number(price).toLocaleString('en-IN')}`;

  // Show step 1, hide step 2
  document.getElementById('order-step-1').style.display = 'block';
  document.getElementById('order-step-2').style.display = 'none';

  // Reset payment to COD each time modal opens
  currentPayment = 'cod';
  selectPayment('cod');
  if (document.getElementById('utr-input')) document.getElementById('utr-input').value = '';

  document.getElementById('order-modal-overlay').classList.add('open');
  document.getElementById('order-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
  document.getElementById('order-modal-overlay').classList.remove('open');
  document.getElementById('order-modal').classList.remove('open');
  document.body.style.overflow = '';
}

// ── Which payment is selected ──
let currentPayment = 'cod'; // 'cod' or 'upi'

/**
 * Called when user clicks a payment card in the order modal.
 * Switches the highlighted card and shows/hides the UPI details panel.
 */
function selectPayment(method) {
  currentPayment = method;

  const codCard  = document.getElementById('pay-cod-opt');
  const upiCard  = document.getElementById('pay-upi-opt');
  const codCheck = document.getElementById('pay-check-cod');
  const upiCheck = document.getElementById('pay-check-upi');
  const upiPanel = document.getElementById('upi-details');

  if (method === 'cod') {
    // Highlight COD, de-select UPI
    codCard.classList.add('selected');
    upiCard.classList.remove('selected');
    codCheck.style.display = 'inline';
    upiCheck.style.display = 'none';
    upiPanel.style.display = 'none';
  } else {
    // Highlight UPI, de-select COD
    upiCard.classList.add('selected');
    codCard.classList.remove('selected');
    upiCheck.style.display = 'inline';
    codCheck.style.display = 'none';
    upiPanel.style.display = 'block';
    // Focus UTR input for convenience
    setTimeout(() => document.getElementById('utr-input')?.focus(), 200);
  }
}

/** Copy UPI ID to clipboard when user taps it */
document.addEventListener('DOMContentLoaded', () => {
  const upiIdEl = document.querySelector('.upi-id');
  if (upiIdEl) {
    upiIdEl.style.cursor = 'pointer';
    upiIdEl.title = 'Tap to copy UPI ID';
    upiIdEl.addEventListener('click', () => {
      navigator.clipboard.writeText('8978421841@upi').then(() => {
        upiIdEl.textContent = '✅ Copied!';
        setTimeout(() => { upiIdEl.textContent = '📲 8978421841@upi'; }, 2000);
      }).catch(() => {
        upiIdEl.textContent = '📋 8978421841@upi  ← copy this';
      });
    });
  }
});

function placeOrder() {
  const name    = document.getElementById('order-name').value.trim();
  const phone   = document.getElementById('order-phone').value.trim();
  const address = document.getElementById('order-address').value.trim();
  const isUPI   = (currentPayment === 'upi');
  const utr     = document.getElementById('utr-input').value.trim();

  if (!name || !phone || !address) {
    alert('Please fill in your Name, Phone and Delivery Address.');
    return;
  }
  if (phone.replace(/\D/g,'').length < 10) {
    alert('Please enter a valid 10-digit mobile number.');
    return;
  }

  const payMethod = isUPI ? 'UPI / Online' : 'Cash on Delivery';
  const orderId   = generateOrderId();
  const now       = new Date();

  const orderRecord = {
    id:        orderId,
    product:   currentOrder.product,
    price:     currentOrder.price,
    name,
    phone,
    address,
    payment:   payMethod,
    utr:       isUPI ? utr : '',
    status:    'Confirmed',
    date:      now.toLocaleDateString('en-IN'),
    time:      now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })
  };

  // Save to localStorage
  saveOrder(orderRecord);

  // Show success step
  document.getElementById('order-step-1').style.display = 'none';
  document.getElementById('order-step-2').style.display = 'block';
  document.getElementById('generated-order-id').textContent = orderId;

  document.getElementById('order-summary-box').innerHTML = `
    <strong>Product:</strong> ${currentOrder.product}<br/>
    <strong>Price:</strong> ₹${Number(currentOrder.price).toLocaleString('en-IN')}<br/>
    <strong>Payment:</strong> ${payMethod}${isUPI && utr ? ` (UTR: ${utr})` : ''}<br/>
    <strong>Delivery to:</strong> ${address.substring(0,60)}${address.length>60?'...':''}<br/>
    <strong>Expected:</strong> 3–5 Business Days
  `;

  // WhatsApp confirmation link
  const waMsg = encodeURIComponent(
    `🛍️ *New Order — RNS Sarees Store*\n\n` +
    `📦 Product: ${currentOrder.product}\n` +
    `💰 Price: ₹${Number(currentOrder.price).toLocaleString('en-IN')}\n` +
    `🆔 Order ID: ${orderId}\n` +
    `💳 Payment: ${payMethod}${isUPI && utr ? ` (UTR: ${utr})` : ''}\n\n` +
    `👤 Name: ${name}\n📞 Phone: ${phone}\n📍 Address: ${address}\n\n` +
    `Please confirm my order. Thank you! 🙏`
  );
  document.getElementById('wa-order-confirm').href = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;

  updateProfileBadge();
}

function generateOrderId() {
  return 'RNS-' + Math.floor(10000 + Math.random() * 90000);
}

// ============================================================
//  ORDER TRACKING
// ============================================================
function trackOrder() {
  const input  = document.getElementById('track-input').value.trim().toUpperCase();
  const result = document.getElementById('track-result');

  if (!input) { alert('Please enter your Order ID.'); return; }

  const orders  = getAllOrders();
  const matched = orders.find(o => o.id === input);

  result.style.display = 'block';

  if (!matched) {
    result.innerHTML = `
      <p class="tr-not-found">❌ Order "${input}" not found.</p>
      <p style="font-size:.82rem;color:var(--text-muted);margin-top:.5rem;">
        Check your Order ID (e.g. RNS-12345) or 
        <a href="https://wa.me/${WA_NUMBER}?text=Hi%20I%20want%20to%20track%20order%20${input}" 
           target="_blank" style="color:var(--green-wa);">contact us on WhatsApp</a>.
      </p>`;
    return;
  }

  const stepIdx = ORDER_STATUSES.indexOf(matched.status);

  const stepsHTML = ORDER_STATUSES.map((s, i) => {
    const cls = i < stepIdx ? 'done' : i === stepIdx ? 'active' : '';
    const emoji = ['📋','📦','🚚','✅'][i];
    return `
      <div class="track-step">
        <div class="step-dot ${cls}">${cls === 'done' ? '✓' : emoji}</div>
        <span class="step-label ${cls}">${s}</span>
      </div>`;
  }).join('');

  result.innerHTML = `
    <p class="tr-product">${matched.product}</p>
    <p class="tr-meta">Order ID: <strong style="color:var(--gold)">${matched.id}</strong>
      &nbsp;·&nbsp; ₹${Number(matched.price).toLocaleString('en-IN')}
      &nbsp;·&nbsp; ${matched.payment}
      &nbsp;·&nbsp; Placed: ${matched.date}</p>
    <div class="track-steps">${stepsHTML}</div>
    <p style="font-size:.78rem;color:var(--text-muted);margin-top:1.25rem;text-align:center;">
      Questions? 
      <a href="https://wa.me/${WA_NUMBER}?text=Hi%2C%20tracking%20order%20${matched.id}" 
         target="_blank" style="color:var(--green-wa);">WhatsApp us</a>
    </p>`;
}

// Allow Enter key in track input
document.addEventListener('DOMContentLoaded', () => {
  const ti = document.getElementById('track-input');
  if (ti) ti.addEventListener('keydown', e => { if (e.key === 'Enter') trackOrder(); });
});

// ============================================================
//  PROFILE MODAL
// ============================================================
function openProfile() {
  const p = getProfile();
  document.getElementById('profile-name').value    = p.name    || '';
  document.getElementById('profile-phone').value   = p.phone   || '';
  document.getElementById('profile-address').value = p.address || '';
  updateAvatarInitials(p.name);

  document.getElementById('profile-saved-msg').style.display = 'none';
  switchProfileTab('info');

  document.getElementById('profile-modal-overlay').classList.add('open');
  document.getElementById('profile-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProfile() {
  document.getElementById('profile-modal-overlay').classList.remove('open');
  document.getElementById('profile-modal').classList.remove('open');
  document.body.style.overflow = '';
}

function switchProfileTab(tab) {
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.profile-tab-content').forEach(c => c.style.display = 'none');

  document.getElementById('ptab-' + tab).classList.add('active');
  document.getElementById('ptab-' + tab + '-content').style.display = 'block';

  if (tab === 'orders') renderMyOrders();
}

function saveProfile() {
  const name    = document.getElementById('profile-name').value.trim();
  const phone   = document.getElementById('profile-phone').value.trim();
  const address = document.getElementById('profile-address').value.trim();

  localStorage.setItem('rns_profile', JSON.stringify({ name, phone, address }));
  updateAvatarInitials(name);
  updateProfileBadge();

  const msg = document.getElementById('profile-saved-msg');
  msg.style.display = 'block';
  setTimeout(() => msg.style.display = 'none', 2500);
}

function getProfile() {
  try { return JSON.parse(localStorage.getItem('rns_profile') || '{}'); }
  catch { return {}; }
}

function updateAvatarInitials(name) {
  const el = document.getElementById('avatar-initials');
  if (!el) return;
  if (name) {
    const parts = name.trim().split(' ');
    el.textContent = (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  } else {
    el.textContent = '?';
  }
}

function updateProfileBadge() {
  const p = getProfile();
  const badge = document.getElementById('header-profile-name');
  if (badge) badge.textContent = p.name ? p.name.split(' ')[0] : 'Profile';
}

function renderMyOrders() {
  const orders  = getAllOrders();
  const list    = document.getElementById('my-orders-list');
  if (!orders.length) {
    list.innerHTML = '<p class="no-orders-msg">No orders yet. Start shopping! 🛍️</p>';
    return;
  }
  list.innerHTML = [...orders].reverse().map(o => `
    <div class="order-item">
      <span class="oi-id">${o.id}</span>
      <p class="oi-product">${o.product}</p>
      <p class="oi-meta">₹${Number(o.price).toLocaleString('en-IN')} · ${o.payment} · ${o.date}</p>
      <span class="oi-status status-${o.status.toLowerCase()}">${o.status}</span>
    </div>`).join('');
}

// ============================================================
//  ORDER STORAGE
// ============================================================
function saveOrder(order) {
  const orders = getAllOrders();
  orders.push(order);
  localStorage.setItem('rns_orders', JSON.stringify(orders));
}

function getAllOrders() {
  try { return JSON.parse(localStorage.getItem('rns_orders') || '[]'); }
  catch { return []; }
}

// ============================================================
//  CATEGORY FILTER
// ============================================================
const catCards  = document.querySelectorAll('.cat-card');
const productCards = document.querySelectorAll('.product-card');
const noResults = document.getElementById('no-results');

function filterProducts(category) {
  catCards.forEach(c => c.classList.toggle('active', c.dataset.cat === category));
  let visible = 0;
  productCards.forEach(p => {
    const match = category === 'all' || p.dataset.category === category;
    p.classList.toggle('hidden', !match);
    if (match) visible++;
  });
  if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
  document.getElementById('products').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================================
//  HAMBURGER / MOBILE MENU
// ============================================================
const hamburger  = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');

hamburger?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
});

function closeMobileMenu() { mobileMenu.classList.remove('open'); }

// ============================================================
//  HEADER SCROLL
// ============================================================
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 50 ? '0 4px 30px rgba(0,0,0,.5)' : 'none';
});

// ============================================================
//  ACTIVE NAV HIGHLIGHT
// ============================================================
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' }).observe.bind(null);

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting)
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => sectionObserver.observe(s));

// ============================================================
//  SCROLL REVEAL
// ============================================================
const revealEls = document.querySelectorAll(
  '.product-card, .cat-card, .contact-card, .payment-card, .about-inner, .wa-banner-inner, .tracking-box'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity  = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  revealObserver.observe(el);
});

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('cat-all')?.classList.add('active');
  updateProfileBadge();
});
