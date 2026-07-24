// ============================================================
//  RNS Sarees Store — server.js
//  Express REST API for product management
// ============================================================

const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const DATA = path.join(__dirname, 'products.json');

// ---- Middleware ----
app.use(cors());
app.use(express.json());

// Serve the frontend from parent directory
app.use(express.static(path.join(__dirname, '..')));

// ---- Helpers ----
function readProducts() {
  return JSON.parse(fs.readFileSync(DATA, 'utf8'));
}

function writeProducts(data) {
  fs.writeFileSync(DATA, JSON.stringify(data, null, 2));
}

// ============================================================
//  ROUTES
// ============================================================

// GET /api/products — list all, optional ?category= filter
app.get('/api/products', (req, res) => {
  let products = readProducts();
  const { category } = req.query;
  if (category && category !== 'all') {
    products = products.filter(p => p.category === category);
  }
  res.json({ success: true, count: products.length, products });
});

// GET /api/products/:id — single product
app.get('/api/products/:id', (req, res) => {
  const products = readProducts();
  const product  = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, product });
});

// POST /api/products — add new product
app.post('/api/products', (req, res) => {
  const { name, category, price, image, description } = req.body;
  if (!name || !category || !price) {
    return res.status(400).json({ success: false, message: 'name, category, price are required' });
  }
  const products = readProducts();
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name,
    category,
    price: Number(price),
    image: image || 'saree1.jpg',
    description: description || '',
    inStock: true
  };
  products.push(newProduct);
  writeProducts(products);
  res.status(201).json({ success: true, message: 'Product added', product: newProduct });
});

// PUT /api/products/:id — update product
app.put('/api/products/:id', (req, res) => {
  const products = readProducts();
  const index    = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'Product not found' });
  products[index] = { ...products[index], ...req.body, id: products[index].id };
  writeProducts(products);
  res.json({ success: true, message: 'Product updated', product: products[index] });
});

// DELETE /api/products/:id — remove product
app.delete('/api/products/:id', (req, res) => {
  let products = readProducts();
  const exists = products.some(p => p.id === parseInt(req.params.id));
  if (!exists) return res.status(404).json({ success: false, message: 'Product not found' });
  products = products.filter(p => p.id !== parseInt(req.params.id));
  writeProducts(products);
  res.json({ success: true, message: 'Product deleted' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', store: 'RNS Sarees Store', time: new Date().toISOString() });
});

// ---- Start Server ----
app.listen(PORT, () => {
  console.log(`\n🧵  RNS Sarees Store Server running!`);
  console.log(`📦  API:      http://localhost:${PORT}/api/products`);
  console.log(`🌐  Website:  http://localhost:${PORT}\n`);
});
