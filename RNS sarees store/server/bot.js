// ============================================================
//  RNS Sarees Store — bot.js
//  WhatsApp Chatbot using whatsapp-web.js
//  Run with: node bot.js  →  scan QR code with WhatsApp
// ============================================================

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const STORE_NUMBER = '918978421841';
const STORE_NAME   = 'RNS Sarees Store';
const STORE_UPI    = '8978421841@upi';
const STORE_ADDR   = 'Old Bus Stand, Yellandu, Bhadradri Kothagudem Dist, Telangana - 507123';

// ---- Initialise Client ----
const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'rns-sarees-bot' }),
  puppeteer: { headless: true, args: ['--no-sandbox'] }
});

// ---- QR Code ----
client.on('qr', qr => {
  console.log('\n📱  Scan this QR code in WhatsApp > Linked Devices:\n');
  qrcode.generate(qr, { small: true });
});

// ---- Ready ----
client.on('ready', () => {
  console.log(`\n✅  ${STORE_NAME} WhatsApp Bot is READY!\n`);
});

// ---- Auth failure ----
client.on('auth_failure', msg => {
  console.error('❌  Authentication failed:', msg);
});

// ---- Disconnected ----
client.on('disconnected', reason => {
  console.warn('⚠️  Bot disconnected:', reason);
});

// ============================================================
//  MESSAGE HANDLER
// ============================================================
client.on('message', async msg => {
  const body = msg.body.trim().toLowerCase();
  const from = msg.from;

  // Ignore group messages and status updates
  if (from === 'status@broadcast' || msg.isGroupMsg) return;

  console.log(`📨  [${new Date().toLocaleTimeString()}] From: ${from} → "${msg.body}"`);

  // ---- GREETING ----
  if (['hi', 'hello', 'hey', 'hii', 'helo', 'namaste'].includes(body)) {
    await msg.reply(
`🧵 *Welcome to ${STORE_NAME}!* ✨

We have beautiful handpicked sarees for every occasion!

*Choose a category to browse:*

1️⃣  Pattu Sarees (₹2,999 – ₹6,999)
2️⃣  Linen Sarees (₹999 – ₹1,999)
3️⃣  Parey Sarees (₹1,499 – ₹2,999)
4️⃣  Designing Sarees (₹2,499 – ₹4,999)
5️⃣  View All Collections
6️⃣  Place a Custom Order
7️⃣  Store Address &amp; Timings

_Reply with a number (1-7)_ 😊`
    );
    return;
  }

  // ---- CATEGORY MENU ----
  if (msg.body === '1') {
    await msg.reply(
`🪡 *Pattu Sarees* — Pure Silk Luxury

Our Pattu sarees are woven from 100% pure silk with rich zari temple borders — perfect for weddings, festivals & special occasions.

❆ Kanjivaram Pattu — *₹3,499*
❆ Soft Pattu Saree — *₹2,999*
❆ Bridal Pattu Saree — *₹6,999*

💍 Ideal for bridal & festive wear
📸 Send *PATTU* to receive photos

To order, just tell us:
👉 Which design you liked
👉 Delivery address

📞 Call/WhatsApp: +91 8978421841`
    );
    return;
  }

  if (msg.body === '2') {
    await msg.reply(
`🌾 *Linen Sarees* — Lightweight Elegance

Our linen sarees are breathable, eco-friendly and perfect for daily wear and office.

❆ Classic Linen Saree — *₹999*
❆ Printed Linen Saree — *₹1,299*
❆ Handblock Linen — *₹1,999*

🌿 Soft, natural & all-season comfort
📸 Send *LINEN* to receive photos

To order, reply with your choice or call:
📞 +91 8978421841`
    );
    return;
  }

  if (msg.body === '3') {
    await msg.reply(
`✨ *Parey Sarees* — Sheer & Shimmering

Beautiful sheer parey sarees with delicate embroidery — perfect for parties & festive events.

❆ Classic Parey Saree — *₹1,499*
❆ Embroidered Parey — *₹1,999*
❆ Premium Parey Saree — *₹2,999*

🌟 Shimmering elegance for every celebration
📸 Send *PAREY* to receive photos

To order: call or WhatsApp:
📞 +91 8978421841`
    );
    return;
  }

  if (msg.body === '4') {
    await msg.reply(
`👑 *Designing Sarees* — Modern Luxury

Contemporary sarees with bold prints and hand-embroidered blouse pieces for the modern woman.

❆ Floral Digital Print — *₹2,499*
❆ Geometric Designer — *₹2,999*
❆ Premium Hand-Embroidered — *₹4,999*

🎨 Exclusive designs, limited stock
📸 Send *DESIGNING* to receive photos

📞 +91 8978421841`
    );
    return;
  }

  if (msg.body === '5') {
    await msg.reply(
`🧵 *Full Collection — ${STORE_NAME}*

🪡 Pattu: ₹2,999 – ₹6,999
🌾 Linen: ₹999 – ₹1,999
✨ Parey: ₹1,499 – ₹2,999
👑 Designing: ₹2,499 – ₹4,999

📦 Free shipping above ₹1,999
🚚 Delivery: 3–5 business days
↩️ Easy 7-day returns

💳 *Payment Options:*
💵 Cash on Delivery (COD)
📲 UPI: ${STORE_UPI}

To order or see photos, call/WhatsApp:
📞 *+91 8978421841*`
    );
    return;
  }

  if (msg.body === '6') {
    await msg.reply(
`📝 *Custom Order*

We can help you find the perfect saree! Please tell us:

1. 👗 Occasion (wedding, party, daily, puja)
2. 🎨 Colour preference
3. 💰 Budget range
4. 📏 Any size requirements

We'll curate options just for you within 1 hour! 🙏

📞 +91 8978421841`
    );
    return;
  }

  if (msg.body === '7') {
    await msg.reply(
`📍 *Find Our Store*

🏪 *${STORE_NAME}*
${STORE_ADDR}

⏰ *Business Hours:*
Mon – Sat: 9 AM – 8 PM
Sunday: 10 AM – 6 PM

💳 *Payment Methods:*
💵 Cash on Delivery
📲 UPI: ${STORE_UPI}
   (GPay · PhonePe · Paytm · BHIM)

📦 Free shipping above ₹1,999
🚚 Pan-India delivery in 3–5 days

📞 +91 8978421841`
    );
    return;
  }

  // ---- Photo requests ----
  const photoMap = {
    pattu:     '🪡 Our Pattu Sarees catalogue is being sent! Please wait a moment.',
    linen:     '🌾 Our Linen Sarees catalogue is being sent! Please wait a moment.',
    parey:     '✨ Our Parey Sarees catalogue is being sent! Please wait a moment.',
    designing: '👑 Our Designing Sarees catalogue is being sent! Please wait a moment.',
  };

  for (const [key, reply] of Object.entries(photoMap)) {
    if (body === key) {
      await msg.reply(reply + '\n\n_Our team will send photos shortly. Thank you for your patience!_ 🙏');
      return;
    }
  }

  // ---- Order confirmation keywords ----
  if (body.includes('order') || body.includes('buy') || body.includes('price') || body.includes('cost')) {
    await msg.reply(
`Thank you for your interest! 😊

To place an order, please share:
✦ Which saree you'd like
✦ Your name & delivery address
✦ Preferred payment method (UPI / COD)

We'll confirm your order within 30 minutes!

📞 +91 8978421841
🧵 *${STORE_NAME}*`
    );
    return;
  }

  // ---- Default fallback ----
  await msg.reply(
`Hi there! 👋 I'm the *${STORE_NAME}* assistant.

Reply *Hi* to see our full menu, or choose:
1️⃣ Pattu  2️⃣ Linen  3️⃣ Parey  4️⃣ Designing
7️⃣ Store Address

💳 We accept *COD* &amp; *UPI* (${STORE_UPI})
📞 Speak to us: +91 8978421841
📍 ${STORE_ADDR}`
  );
});

// ---- Start ----
client.initialize();
