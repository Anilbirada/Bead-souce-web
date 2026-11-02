import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper functions for reading/writing persistent data
const readData = (filename) => {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return [];
  }
};

const writeData = (filename, data) => {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

// --- HEALTH CHECK ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'BeadsSource International Wholesale API', time: new Date().toISOString() });
});

// --- PRODUCTS API ---
app.get('/api/products', (req, res) => {
  let products = readData('products.json');
  const { category, search, sort, minPrice, maxPrice, inStock, featured, bestSeller } = req.query;

  if (category && category !== 'all') {
    products = products.filter(p => p.category === category || p.slug === category);
  }

  if (search) {
    const q = search.toLowerCase().trim();
    products = products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.sku.toLowerCase().includes(q) ||
      (p.materials && p.materials.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  if (minPrice) {
    products = products.filter(p => p.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    products = products.filter(p => p.price <= parseFloat(maxPrice));
  }

  if (inStock === 'true') {
    products = products.filter(p => p.stock > 0);
  }

  if (featured === 'true') {
    products = products.filter(p => p.isFeatured);
  }

  if (bestSeller === 'true') {
    products = products.filter(p => p.isBestSeller);
  }

  // Sorting
  if (sort === 'price-low') {
    products.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
  } else if (sort === 'price-high') {
    products.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
  } else if (sort === 'name-asc') {
    products.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'rating') {
    products.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'newest') {
    products.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
  }

  res.json(products);
});

app.get('/api/products/:idOrSlug', (req, res) => {
  const products = readData('products.json');
  const item = products.find(p => p.id === req.params.idOrSlug || p.slug === req.params.idOrSlug);
  if (!item) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(item);
});

// Admin: Create Product
app.post('/api/products', (req, res) => {
  const products = readData('products.json');
  const newProduct = {
    id: `bs-${Date.now().toString().slice(-4)}`,
    slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    name: req.body.name,
    sku: req.body.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    category: req.body.category || 'natural-gemstone-beads',
    price: parseFloat(req.body.price) || 0,
    salePrice: req.body.salePrice ? parseFloat(req.body.salePrice) : null,
    stock: parseInt(req.body.stock) || 50,
    image: req.body.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    images: req.body.images && req.body.images.length ? req.body.images : [req.body.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
    description: req.body.description || 'Premium wholesale gemstone beads crafted for professional jewelers.',
    materials: req.body.materials || 'Natural Gemstone',
    finish: Array.isArray(req.body.finish) ? req.body.finish : ['Standard Polished'],
    sizes: Array.isArray(req.body.sizes) ? req.body.sizes : ['Standard Strand'],
    holeSize: req.body.holeSize || '1.0mm',
    moq: parseInt(req.body.moq) || 5,
    isBestSeller: Boolean(req.body.isBestSeller),
    isFeatured: Boolean(req.body.isFeatured),
    isNewArrival: Boolean(req.body.isNewArrival),
    rating: 5.0,
    reviewsCount: 1,
    specs: req.body.specs || {
      "Grade": "AAA Wholesale",
      "Packaging": "Standard Wholesale Packaging"
    }
  };

  products.unshift(newProduct);
  writeData('products.json', products);
  res.status(201).json(newProduct);
});

// Admin: Update Product
app.put('/api/products/:id', (req, res) => {
  const products = readData('products.json');
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products[index] = { ...products[index], ...req.body, id: products[index].id };
  writeData('products.json', products);
  res.json(products[index]);
});

// Admin: Delete Product
app.delete('/api/products/:id', (req, res) => {
  let products = readData('products.json');
  const filtered = products.filter(p => p.id !== req.params.id);
  writeData('products.json', filtered);
  res.json({ success: true, message: 'Product deleted' });
});

// --- CATEGORIES API ---
app.get('/api/categories', (req, res) => {
  const categories = readData('categories.json');
  res.json(categories);
});

// Admin: Update Categories
app.post('/api/categories', (req, res) => {
  const categories = readData('categories.json');
  const newCat = {
    id: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: req.body.name,
    slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: req.body.description || '',
    image: req.body.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    itemCount: 0
  };
  categories.push(newCat);
  writeData('categories.json', categories);
  res.status(201).json(newCat);
});

// --- AUTH API ---
app.post('/api/auth/register', (req, res) => {
  const users = readData('users.json');
  const { email, password, name, company, phone, taxId } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    email: email.toLowerCase().trim(),
    password,
    name,
    company: company || '',
    phone: phone || '',
    taxId: taxId || '',
    role: 'customer',
    wholesaleApproved: Boolean(company && taxId),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeData('users.json', users);

  const { password: _, ...userSafe } = newUser;
  res.status(201).json({ user: userSafe, token: `jwt_${newUser.id}` });
});

app.post('/api/auth/login', (req, res) => {
  const users = readData('users.json');
  const { email, password } = req.body;

  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase().trim());
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { password: _, ...userSafe } = user;
  res.json({ user: userSafe, token: `jwt_${user.id}` });
});

// --- ORDERS API ---
app.get('/api/orders', (req, res) => {
  const orders = readData('orders.json');
  const { email } = req.query;
  if (email) {
    const userOrders = orders.filter(o => o.customer && o.customer.email.toLowerCase() === email.toLowerCase());
    return res.json(userOrders);
  }
  res.json(orders);
});

app.get('/api/orders/:id', (req, res) => {
  const orders = readData('orders.json');
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// Create Order (Checkout)
app.post('/api/orders', (req, res) => {
  const orders = readData('orders.json');
  const products = readData('products.json');

  const { customer, items, subtotal, discount, couponCode, shipping, tax, total, paymentMethod, notes } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: 'Order contains no items' });
  }

  const newOrder = {
    id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString(),
    customer: customer || {},
    items: items || [],
    subtotal: subtotal || 0,
    discount: discount || 0,
    couponCode: couponCode || null,
    shipping: shipping || 0,
    tax: tax || 0,
    total: total || 0,
    status: 'Processing',
    paymentMethod: paymentMethod || 'Wire Transfer',
    paymentStatus: paymentMethod === 'Purchase Order' ? 'Pending Approval' : 'Paid',
    trackingNumber: `EXP-${Math.floor(10000000 + Math.random() * 90000000)}`,
    notes: notes || ''
  };

  // Decrement inventory stock
  items.forEach(orderItem => {
    const product = products.find(p => p.id === orderItem.id || p.sku === orderItem.sku);
    if (product) {
      product.stock = Math.max(0, product.stock - (orderItem.quantity || 1));
    }
  });

  orders.unshift(newOrder);
  writeData('orders.json', orders);
  writeData('products.json', products);

  res.status(201).json(newOrder);
});

// Admin: Update Order Status
app.put('/api/orders/:id/status', (req, res) => {
  const orders = readData('orders.json');
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  if (req.body.status) order.status = req.body.status;
  if (req.body.paymentStatus) order.paymentStatus = req.body.paymentStatus;
  if (req.body.trackingNumber) order.trackingNumber = req.body.trackingNumber;

  writeData('orders.json', orders);
  res.json(order);
});

// --- RFQ / QUOTATION API ---
app.get('/api/quotes', (req, res) => {
  const quotes = readData('quotes.json');
  const { email } = req.query;
  if (email) {
    return res.json(quotes.filter(q => q.customer && q.customer.email.toLowerCase() === email.toLowerCase()));
  }
  res.json(quotes);
});

app.post('/api/quotes', (req, res) => {
  const quotes = readData('quotes.json');
  const { customer, targetDeliveryDate, targetBudget, items, comments } = req.body;

  const newQuote = {
    id: `RFQ-2026-${Math.floor(100 + Math.random() * 900)}`,
    date: new Date().toISOString(),
    customer: customer || {},
    targetDeliveryDate: targetDeliveryDate || 'Flexible',
    targetBudget: targetBudget || 'Competitive Wholesale',
    items: items || [],
    comments: comments || '',
    status: 'In Review',
    adminNotes: 'New wholesale RFQ received. Ramesh Sir review pending.',
    counterOffer: null,
    responseSent: false
  };

  quotes.unshift(newQuote);
  writeData('quotes.json', quotes);
  res.status(201).json(newQuote);
});

app.put('/api/quotes/:id', (req, res) => {
  const quotes = readData('quotes.json');
  const quote = quotes.find(q => q.id === req.params.id);
  if (!quote) return res.status(404).json({ error: 'Quote request not found' });

  if (req.body.status) quote.status = req.body.status;
  if (req.body.adminNotes) quote.adminNotes = req.body.adminNotes;
  if (req.body.counterOffer !== undefined) quote.counterOffer = req.body.counterOffer;
  if (req.body.responseSent !== undefined) quote.responseSent = req.body.responseSent;

  writeData('quotes.json', quotes);
  res.json(quote);
});

// --- COUPONS API ---
app.get('/api/coupons', (req, res) => {
  const coupons = readData('coupons.json');
  res.json(coupons);
});

app.post('/api/coupons/validate', (req, res) => {
  const coupons = readData('coupons.json');
  const { code, subtotal } = req.body;
  if (!code) return res.status(400).json({ error: 'Coupon code required' });

  const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim() && c.active);
  if (!coupon) {
    return res.status(404).json({ error: 'Invalid or expired coupon code' });
  }

  if (subtotal && subtotal < coupon.minOrder) {
    return res.status(400).json({ 
      error: `Coupon requires a minimum order of $${coupon.minOrder}. Current order is $${subtotal.toFixed(2)}` 
    });
  }

  res.json({ valid: true, coupon });
});

// Admin: Create Coupon
app.post('/api/coupons', (req, res) => {
  const coupons = readData('coupons.json');
  const newCoupon = {
    code: req.body.code.toUpperCase().trim(),
    discountType: req.body.discountType || 'percentage',
    discountValue: parseFloat(req.body.discountValue) || 10,
    minOrder: parseFloat(req.body.minOrder) || 100,
    description: req.body.description || 'Wholesale promotion',
    active: true
  };
  coupons.push(newCoupon);
  writeData('coupons.json', coupons);
  res.status(201).json(newCoupon);
});

// --- ADMIN STATS / ANALYTICS ---
app.get('/api/admin/stats', (req, res) => {
  const products = readData('products.json');
  const orders = readData('orders.json');
  const quotes = readData('quotes.json');
  const users = readData('users.json');

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalStockUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const lowStockCount = products.filter(p => p.stock < 200).length;
  const pendingQuotes = quotes.filter(q => q.status === 'In Review').length;

  res.json({
    totalRevenue,
    ordersCount: orders.length,
    productsCount: products.length,
    usersCount: users.length,
    pendingQuotes,
    totalStockUnits,
    lowStockCount,
    recentOrders: orders.slice(0, 5),
    recentQuotes: quotes.slice(0, 5)
  });
});

app.listen(PORT, () => {
  console.log(`BeadsSource Wholesale API running on http://localhost:${PORT}`);
});
