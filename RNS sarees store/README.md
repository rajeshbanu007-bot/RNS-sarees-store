# 🧵 RNS Sarees Store

A complete, professional sarees e-commerce website with a WhatsApp ordering system and chatbot.

**WhatsApp:** +91 8978421841

---

## 📁 Project Structure

```
RNS sarees store/
├── index.html          ← Main website
├── style.css           ← Premium dark-gold design
├── script.js           ← Filters, animations, ordering
├── banner.jpg          ← Hero banner image
├── saree1.jpg          ← Cotton saree product image
├── saree2.jpg          ← Party wear product image
├── saree3.jpg          ← Traditional saree product image
├── saree4.jpg          ← Designer saree product image
└── server/
    ├── package.json    ← Node.js dependencies
    ├── server.js       ← Express REST API
    ├── bot.js          ← WhatsApp chatbot
    └── products.json   ← Product data
```

---

## 🌐 Website (No Setup Needed)

Just open `index.html` in your browser — it works instantly without any server!

Every "Order Now" button sends the customer directly to WhatsApp (+91 8978421841) with a pre-filled message.

---

## 🖥️ Backend API (Optional)

### Setup

```bash
cd server
npm install
npm start
```

The server will run at `http://localhost:3000`

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products?category=cotton` | Filter by category |
| GET | `/api/products/:id` | Single product |
| POST | `/api/products` | Add new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

#### Example — Add a product:
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Silk Saree","category":"traditional","price":4500,"description":"Pure silk"}'
```

---

## 🤖 WhatsApp Bot

### Setup

```bash
cd server
npm install
node bot.js
```

1. A QR code will appear in the terminal
2. Open WhatsApp on your phone → Settings → Linked Devices → Link a Device
3. Scan the QR code
4. The bot is now live! ✅

### Bot Features

| Customer Types | Bot Response |
|---|---|
| `Hi` / `Hello` | Welcome menu with 6 options |
| `1` | Cotton Sarees with prices |
| `2` | Party Wear with prices |
| `3` | Traditional / Kanjivaram |
| `4` | Designer Collection |
| `5` | View all collections |
| `6` | Custom order form |
| `cotton` / `party` etc. | Photo catalogue request |
| Order keywords | Order confirmation flow |

---

## 🌍 DNS Configuration (for hosting)

When you buy a domain (e.g., rnssarees.com), add these DNS records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | Your server IP | Auto |
| CNAME | www | rnssarees.com | Auto |

> Get your server IP from your hosting provider (Hostinger, GoDaddy, etc.)

---

## 📦 WhatsApp Order Link

Direct order link (share anywhere):
```
https://wa.me/918978421841?text=Hi%20RNS%20Sarees%2C%20I%20want%20to%20order%20a%20saree
```

---

## 🛠️ Customization

- **Add products:** Edit `server/products.json` or use the API
- **Change prices:** Update `index.html` product cards
- **Add images:** Place `.jpg` files in the root folder, update `src` in `index.html`
- **Bot messages:** Edit `server/bot.js` reply strings

---

*© 2025 RNS Sarees Store — Elegance Woven into Every Thread*
