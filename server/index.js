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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static uploaded images
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const PUBLIC_UPLOADS = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_UPLOADS)) fs.mkdirSync(PUBLIC_UPLOADS, { recursive: true });
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/uploads', express.static(PUBLIC_UPLOADS));

// File / Base64 Image Upload API
app.post('/api/upload', (req, res) => {
  try {
    const { image: rawImage, dataUrl, filename } = req.body || {};
    const image = rawImage || dataUrl;
    if (!image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Process base64 data URL
    if (image.startsWith('data:image')) {
      const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (!matches) {
        return res.json({ url: image });
      }
      let ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
      if (ext.includes('+')) ext = ext.split('+')[0];
      const buffer = Buffer.from(matches[2], 'base64');
      const safeName = `img-${Date.now()}-${Math.floor(Math.random() * 10000)}.${ext}`;
      
      fs.writeFileSync(path.join(UPLOADS_DIR, safeName), buffer);
      try {
        fs.writeFileSync(path.join(PUBLIC_UPLOADS, safeName), buffer);
      } catch (err) {}

      return res.json({ 
        success: true, 
        url: `/uploads/${safeName}`, 
        filename: safeName 
      });
    }

    // If already a URL, return as-is
    res.json({ success: true, url: image });
  } catch (err) {
    console.error('Image upload failed:', err);
    res.status(500).json({ error: 'Failed to process uploaded image' });
  }
});

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

// Activity Audit Logger
const logAudit = (actor, role, action, resource, details) => {
  try {
    const logs = readData('audit-logs.json') || [];
    const newLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actor: actor || 'System Administrator',
      role: role || 'admin',
      action,
      resource,
      details
    };
    logs.unshift(newLog);
    if (logs.length > 250) logs.length = 250; // Keep latest 250 entries
    writeData('audit-logs.json', logs);
  } catch (err) {
    console.error('Audit log error:', err);
  }
};

// Auth & Role Verification Helper
const getAuthUser = (req) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.replace('Bearer ', '').trim();
  const users = readData('users.json');

  // Format: jwt_<userId> or legacy local_jwt_admin
  if (token === 'local_jwt_admin' || token === 'jwt_admin') {
    return users.find(u => u.role === 'super_admin' || u.role === 'admin') || users[0];
  }
  
  const userId = token.replace('jwt_', '');
  return users.find(u => u.id === userId) || null;
};

// Role Check Middleware
const requireRoles = (allowedRoles = []) => {
  return (req, res, next) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required. Please provide a valid Bearer token.' });
    }
    req.currentUser = user;
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role) && user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Access denied: Insufficient role permissions' });
    }
    next();
  };
};

// --- HEALTH CHECK ---
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    brand: 'BeadsSource International Wholesale API', 
    environment: process.env.NODE_ENV || 'production',
    time: new Date().toISOString() 
  });
});

// ==========================================
// 1. PRODUCTS API
// ==========================================
app.get('/api/products', (req, res) => {
  let products = readData('products.json');
  const { category, search, sort, minPrice, maxPrice, inStock, featured, bestSeller, status } = req.query;

  if (status) {
    products = products.filter(p => (p.status || 'published') === status);
  }

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
    products.sort((a, b) => (b.rating || 5) - (a.rating || 5));
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

// ==========================================
// SMART PRODUCT RECOMMENDATION ENGINE API
// ==========================================
app.get('/api/products/:idOrSlug/recommendations', (req, res) => {
  const products = readData('products.json').filter(p => (p.status || 'published') === 'published');
  const target = products.find(p => p.id === req.params.idOrSlug || p.slug === req.params.idOrSlug);
  
  if (!target) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // 1. Same Category / Materials Related Items (excluding self)
  const related = products.filter(p => 
    p.id !== target.id && (
      p.category === target.category ||
      (target.materials && p.materials && p.materials.toLowerCase().includes(target.materials.toLowerCase()))
    )
  ).slice(0, 8);

  // 2. Intelligent Complementary Pairings (Cross-selling rule matrix)
  const categoryStr = (target.category || '').toLowerCase();
  let pairingCategories = [];

  if (categoryStr.includes('gemstone') || categoryStr.includes('turquoise') || categoryStr.includes('crystal')) {
    // Beads pair with Clasps, Connectors & Pewter Spacers
    pairingCategories = ['jewelry-connectors', 'jewelry-spacers', 'jewelry-findings', 'jewelry-pendants'];
  } else if (categoryStr.includes('finding') || categoryStr.includes('connector') || categoryStr.includes('spacer') || categoryStr.includes('charm')) {
    // Findings pair with Natural Gemstone strands & Faceted Crystals
    pairingCategories = ['natural-gemstone-beads', 'turquoise-beads', 'crystal-beads', 'cubic-zirconia'];
  } else if (categoryStr.includes('pendant')) {
    // Pendants pair with Chains/Findings & Gemstone bead strands
    pairingCategories = ['jewelry-findings', 'natural-gemstone-beads', 'jewelry-connectors'];
  } else {
    pairingCategories = ['natural-gemstone-beads', 'jewelry-connectors', 'jewelry-spacers'];
  }

  const pairings = products.filter(p => 
    p.id !== target.id && pairingCategories.includes(p.category)
  ).slice(0, 8);

  // 3. Frequently Bought Together Bundle (1 complementary clasp/finding + 1 bead/spacer)
  const bundleClasp = products.find(p => p.id !== target.id && (p.category === 'jewelry-connectors' || p.category === 'jewelry-findings')) || pairings[0];
  const bundleSpacer = products.find(p => p.id !== target.id && (p.category === 'jewelry-spacers' || p.category === 'cubic-zirconia')) || related[0];
  const frequentlyBoughtTogether = [bundleClasp, bundleSpacer].filter(Boolean);

  // 4. Trending and Best Sellers Fallback
  const trending = products.filter(p => p.id !== target.id && (p.isBestSeller || (p.rating || 5) >= 4.8)).slice(0, 6);

  res.json({
    productId: target.id,
    productName: target.name,
    related: related.length > 0 ? related : trending.slice(0, 4),
    pairings: pairings.length > 0 ? pairings : trending.slice(2, 6),
    frequentlyBoughtTogether,
    trending
  });
});

// General Recommendation API by category / cart items
app.get('/api/recommendations', (req, res) => {
  const products = readData('products.json').filter(p => (p.status || 'published') === 'published');
  const { category, excludeIds, limit } = req.query;
  const excluded = (excludeIds || '').split(',').filter(Boolean);
  const maxItems = parseInt(limit, 10) || 6;

  let candidates = products.filter(p => !excluded.includes(p.id));

  if (category && category !== 'all') {
    candidates = candidates.filter(p => p.category === category);
  }

  // Rank by rating and best sellers
  candidates.sort((a, b) => (b.rating || 5) - (a.rating || 5));

  res.json(candidates.slice(0, maxItems));
});

// Admin/Manager: Create Product
app.post('/api/products', (req, res) => {
  const products = readData('products.json');
  const user = getAuthUser(req);
  
  const newProduct = {
    id: `bs-${Date.now().toString().slice(-4)}`,
    slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    name: req.body.name,
    sku: req.body.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    category: req.body.category || 'natural-gemstone-beads',
    price: parseFloat(req.body.price) || 0,
    salePrice: req.body.salePrice ? parseFloat(req.body.salePrice) : null,
    stock: parseInt(req.body.stock) || 100,
    lowStockThreshold: parseInt(req.body.lowStockThreshold) || 200,
    status: req.body.status || 'published',
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
      "Packaging": "Standard Export Protective Packaging"
    }
  };

  products.unshift(newProduct);
  writeData('products.json', products);
  logAudit(user?.name || 'Administrator', user?.role || 'admin', 'PRODUCT_CREATE', `Product ${newProduct.sku}`, `Created new product ${newProduct.name}`);
  res.status(201).json(newProduct);
});

// Admin/Manager: Update Product
app.put('/api/products/:id', (req, res) => {
  const products = readData('products.json');
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const user = getAuthUser(req);
  products[index] = { ...products[index], ...req.body, id: products[index].id };
  writeData('products.json', products);
  logAudit(user?.name || 'Administrator', user?.role || 'admin', 'PRODUCT_UPDATE', `Product ${products[index].sku}`, `Updated details for ${products[index].name}`);
  res.json(products[index]);
});

// Admin/Manager: Delete Product
app.delete('/api/products/:id', (req, res) => {
  let products = readData('products.json');
  const product = products.find(p => p.id === req.params.id);
  const filtered = products.filter(p => p.id !== req.params.id);
  writeData('products.json', filtered);
  const user = getAuthUser(req);
  logAudit(user?.name || 'Administrator', user?.role || 'admin', 'PRODUCT_DELETE', `Product ${product?.sku || req.params.id}`, `Removed product from database`);
  res.json({ success: true, message: 'Product deleted' });
});

// ==========================================
// 2. CATEGORIES API
// ==========================================
app.get('/api/categories', (req, res) => {
  const categories = readData('categories.json');
  res.json(categories);
});

app.post('/api/categories', (req, res) => {
  const categories = readData('categories.json');
  const user = getAuthUser(req);
  const newCat = {
    id: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: req.body.name,
    slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: req.body.description || 'Premium wholesale category',
    image: req.body.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    itemCount: req.body.itemCount || 0
  };
  categories.push(newCat);
  writeData('categories.json', categories);
  logAudit(user?.name || 'Administrator', user?.role || 'admin', 'CATEGORY_CREATE', `Category ${newCat.name}`, 'Added wholesale category');
  res.status(201).json(newCat);
});

app.put('/api/categories/:id', (req, res) => {
  const categories = readData('categories.json');
  const index = categories.findIndex(c => c.id === req.params.id || c.slug === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Category not found' });

  const user = getAuthUser(req);
  categories[index] = { ...categories[index], ...req.body };
  writeData('categories.json', categories);
  logAudit(user?.name || 'Administrator', user?.role || 'admin', 'CATEGORY_UPDATE', `Category ${categories[index].name}`, 'Updated category details');
  res.json(categories[index]);
});

app.delete('/api/categories/:id', (req, res) => {
  let categories = readData('categories.json');
  const cat = categories.find(c => c.id === req.params.id || c.slug === req.params.id);
  const filtered = categories.filter(c => c.id !== req.params.id && c.slug !== req.params.id);
  writeData('categories.json', filtered);
  const user = getAuthUser(req);
  logAudit(user?.name || 'Administrator', user?.role || 'admin', 'CATEGORY_DELETE', `Category ${cat?.name || req.params.id}`, 'Deleted wholesale category');
  res.json({ success: true, message: 'Category removed' });
});

// ==========================================
// 3. INVENTORY MANAGEMENT API
// ==========================================
app.get('/api/inventory', (req, res) => {
  const products = readData('products.json');
  const lowStockThreshold = 200;
  
  const inventoryItems = products.map(p => ({
    id: p.id,
    sku: p.sku,
    name: p.name,
    category: p.category,
    stock: p.stock || 0,
    lowStockThreshold: p.lowStockThreshold || lowStockThreshold,
    isLowStock: (p.stock || 0) < (p.lowStockThreshold || lowStockThreshold),
    price: p.price,
    materials: p.materials,
    image: p.image
  }));

  res.json(inventoryItems);
});

app.put('/api/inventory/:id', (req, res) => {
  const products = readData('products.json');
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  const user = getAuthUser(req);
  const prevStock = products[index].stock;
  if (req.body.stock !== undefined) products[index].stock = parseInt(req.body.stock) || 0;
  if (req.body.lowStockThreshold !== undefined) products[index].lowStockThreshold = parseInt(req.body.lowStockThreshold) || 200;

  writeData('products.json', products);
  logAudit(
    user?.name || 'Inventory Manager',
    user?.role || 'inventory_manager',
    'STOCK_ADJUSTMENT',
    `SKU ${products[index].sku}`,
    `Stock adjusted from ${prevStock} to ${products[index].stock} units`
  );

  res.json(products[index]);
});

// ==========================================
// 4. AUTH & USER MANAGEMENT API
// ==========================================
app.post('/api/auth/register', (req, res) => {
  const users = readData('users.json');
  const { email, password, name, company, phone, taxId, shippingAddress, billingAddress } = req.body;

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
    status: 'active',
    wholesaleApproved: Boolean(company && taxId),
    shippingAddress: shippingAddress || {},
    billingAddress: billingAddress || {},
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeData('users.json', users);

  const { password: _, ...userSafe } = newUser;
  res.status(201).json({ user: userSafe, token: `jwt_${newUser.id}` });
});

app.post('/api/auth/login', (req, res) => {
  const users = readData('users.json');
  const { email, password } = req.body || {};

  if (!email || !password || !String(email).trim() || !String(password).trim()) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase().trim());
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (user.status === 'suspended') {
    return res.status(403).json({ error: 'Your wholesale account is currently suspended. Please contact customer support.' });
  }

  const { password: _, ...userSafe } = user;
  res.json({ user: userSafe, token: `jwt_${user.id}` });
});

// Customer: Update own profile
app.put('/api/auth/profile', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const users = readData('users.json');
  const index = users.findIndex(u => u.id === user.id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });

  const { name, company, phone, taxId, shippingAddress, billingAddress, password } = req.body;
  if (name) users[index].name = name;
  if (company) users[index].company = company;
  if (phone) users[index].phone = phone;
  if (taxId) users[index].taxId = taxId;
  if (shippingAddress) users[index].shippingAddress = shippingAddress;
  if (billingAddress) users[index].billingAddress = billingAddress;
  if (password) users[index].password = password;

  writeData('users.json', users);
  const { password: _, ...userSafe } = users[index];
  res.json(userSafe);
});

// Admin: List all registered customers / users (Restricted to management/support)
app.get('/api/users', requireRoles(['super_admin', 'admin', 'support']), (req, res) => {
  const users = readData('users.json');
  const usersSafe = users.map(({ password, ...u }) => u);
  res.json(usersSafe);
});

// Admin: Create staff or customer user
app.post('/api/users', requireRoles(['super_admin', 'admin']), (req, res) => {
  const users = readData('users.json');
  const { email, password, name, role, company, phone, taxId, wholesaleApproved } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  if (users.some(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
    return res.status(400).json({ error: 'User email already exists' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    email: email.toLowerCase().trim(),
    password,
    name,
    role: role || 'customer',
    company: company || '',
    phone: phone || '',
    taxId: taxId || '',
    wholesaleApproved: wholesaleApproved !== undefined ? Boolean(wholesaleApproved) : true,
    status: 'active',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeData('users.json', users);
  const admin = getAuthUser(req);
  logAudit(admin?.name || 'Super Administrator', admin?.role || 'super_admin', 'USER_CREATE', `Account ${newUser.email}`, `Created user with role ${newUser.role}`);

  const { password: _, ...userSafe } = newUser;
  res.status(201).json(userSafe);
});

// Admin: Update user role, status or wholesale approval
app.put('/api/users/:id', requireRoles(['super_admin', 'admin']), (req, res) => {
  const users = readData('users.json');
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });

  const admin = getAuthUser(req);
  const { role, status, wholesaleApproved, name, company, phone } = req.body;
  if (role) users[index].role = role;
  if (status) users[index].status = status;
  if (wholesaleApproved !== undefined) users[index].wholesaleApproved = Boolean(wholesaleApproved);
  if (name) users[index].name = name;
  if (company) users[index].company = company;
  if (phone) users[index].phone = phone;

  writeData('users.json', users);
  logAudit(admin?.name || 'Super Administrator', admin?.role || 'super_admin', 'USER_UPDATE', `Account ${users[index].email}`, `Updated account role/status to ${users[index].role}/${users[index].status}`);

  const { password: _, ...userSafe } = users[index];
  res.json(userSafe);
});

// Admin: Delete user
app.delete('/api/users/:id', requireRoles(['super_admin']), (req, res) => {
  let users = readData('users.json');
  const target = users.find(u => u.id === req.params.id);
  if (!target) return res.status(404).json({ error: 'User not found' });

  const filtered = users.filter(u => u.id !== req.params.id);
  writeData('users.json', filtered);
  const admin = getAuthUser(req);
  logAudit(admin?.name || 'Super Administrator', admin?.role || 'super_admin', 'USER_DELETE', `Account ${target.email}`, 'Account removed');

  res.json({ success: true, message: 'User account removed' });
});

// ==========================================
// 5. ORDERS API
// ==========================================
app.get('/api/orders', (req, res) => {
  const orders = readData('orders.json');
  const { email, status } = req.query;

  let filtered = [...orders];
  if (email) {
    filtered = filtered.filter(o => o.customer && o.customer.email.toLowerCase() === email.toLowerCase());
  }
  if (status && status !== 'all') {
    filtered = filtered.filter(o => o.status.toLowerCase() === status.toLowerCase());
  }

  res.json(filtered);
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

  const { customer, items, subtotal, discount, couponCode, shipping, tax, total, paymentMethod, notes, shippingAddress } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: 'Order contains no items' });
  }

  const newOrder = {
    id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString(),
    customer: customer || {},
    shippingAddress: shippingAddress || customer?.shippingAddress || {},
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
    courierName: 'DHL Express Worldwide',
    notes: notes || '',
    internalNotes: ''
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

  logAudit(customer?.name || 'Customer', 'customer', 'ORDER_CREATE', `Order ${newOrder.id}`, `Wholesale order placed for total $${newOrder.total.toFixed(2)}`);

  res.status(201).json(newOrder);
});

// Admin: Update Order Status
app.put('/api/orders/:id/status', (req, res) => {
  const orders = readData('orders.json');
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const user = getAuthUser(req);
  if (req.body.status) order.status = req.body.status;
  if (req.body.paymentStatus) order.paymentStatus = req.body.paymentStatus;
  if (req.body.trackingNumber) order.trackingNumber = req.body.trackingNumber;
  if (req.body.courierName) order.courierName = req.body.courierName;
  if (req.body.internalNotes !== undefined) order.internalNotes = req.body.internalNotes;

  writeData('orders.json', orders);
  logAudit(user?.name || 'Order Manager', user?.role || 'order_manager', 'ORDER_UPDATE', `Order ${order.id}`, `Status changed to ${order.status}, payment: ${order.paymentStatus}`);

  res.json(order);
});

// ==========================================
// 6. RFQ / QUOTATIONS API
// ==========================================
app.get('/api/quotes', (req, res) => {
  const quotes = readData('quotes.json');
  const { email, status } = req.query;

  let filtered = [...quotes];
  if (email) {
    filtered = filtered.filter(q => q.customer && q.customer.email.toLowerCase() === email.toLowerCase());
  }
  if (status && status !== 'all') {
    filtered = filtered.filter(q => q.status.toLowerCase() === status.toLowerCase());
  }

  res.json(filtered);
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
    adminNotes: 'New wholesale RFQ received. Pending review by Administrator.',
    counterOffer: null,
    responseSent: false
  };

  quotes.unshift(newQuote);
  writeData('quotes.json', quotes);
  logAudit(customer?.name || 'Customer', 'customer', 'QUOTE_SUBMIT', `Quotation ${newQuote.id}`, `Submitted RFQ with ${newQuote.items.length} items`);

  res.status(201).json(newQuote);
});

app.put('/api/quotes/:id', (req, res) => {
  const quotes = readData('quotes.json');
  const quote = quotes.find(q => q.id === req.params.id);
  if (!quote) return res.status(404).json({ error: 'Quote request not found' });

  const user = getAuthUser(req);
  if (req.body.status) quote.status = req.body.status;
  if (req.body.adminNotes) quote.adminNotes = req.body.adminNotes;
  if (req.body.counterOffer !== undefined) quote.counterOffer = req.body.counterOffer;
  if (req.body.responseSent !== undefined) quote.responseSent = req.body.responseSent;

  writeData('quotes.json', quotes);
  logAudit(user?.name || 'Administrator', user?.role || 'admin', 'QUOTE_UPDATE', `Quotation ${quote.id}`, `Updated status to ${quote.status}`);

  res.json(quote);
});

// Customer / Admin: Accept Quotation & Automatically Convert to Confirmed Order
app.post('/api/quotes/:id/accept', (req, res) => {
  const quotes = readData('quotes.json');
  const quote = quotes.find(q => q.id === req.params.id);
  if (!quote) return res.status(404).json({ error: 'Quotation not found' });

  // Prevent duplicate acceptance / order creation
  if (quote.orderId || quote.status === 'Accepted') {
    return res.status(400).json({ 
      error: `Quotation ${quote.id} has already been accepted and converted into Order ${quote.orderId || ''}.` 
    });
  }

  const orders = readData('orders.json');
  const products = readData('products.json');

  // Calculate order items with approved prices
  const orderItems = (quote.items || []).map(item => {
    const unitPrice = typeof quote.counterOffer === 'number' && quote.counterOffer > 0 
      ? quote.counterOffer 
      : (item.targetPrice || item.catalogPrice || item.price || 1.50);
    const qty = parseInt(item.requestedQty || item.quantity || 50, 10);
    return {
      id: item.id || `item-${Math.floor(1000 + Math.random() * 9000)}`,
      name: item.name,
      sku: item.sku || 'WH-GEM-01',
      price: unitPrice,
      quantity: qty,
      total: parseFloat((unitPrice * qty).toFixed(2)),
      image: item.image || 'https://beadssource.com/wp-content/uploads/DSC_2552-scaled-1-1536x1025-1-300x300.jpg'
    };
  });

  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  const shipping = typeof quote.shippingRate === 'number' ? quote.shippingRate : 35.00;
  const tax = 0; // Wholesale international B2B tax exemption
  const total = parseFloat((subtotal + shipping + tax).toFixed(2));

  // Create Confirmed Order
  const newOrder = {
    id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString(),
    quoteId: quote.id,
    customer: quote.customer || {},
    shippingAddress: quote.customer?.shippingAddress || {
      addressLine1: '450 Fashion Avenue, Suite 1200',
      city: 'New York',
      state: 'NY',
      postalCode: '10018',
      country: quote.customer?.country || 'United States'
    },
    items: orderItems,
    subtotal,
    discount: 0,
    shipping,
    tax,
    total,
    status: 'Confirmed',
    paymentMethod: 'Net 30 Commercial Invoice / Wire Transfer',
    paymentStatus: 'Invoice Issued',
    trackingNumber: `EXP-${Math.floor(10000000 + Math.random() * 90000000)}`,
    courierName: 'DHL Express Worldwide',
    notes: `Officially converted from approved RFQ ${quote.id}. Target delivery requested: ${quote.targetDeliveryDate || 'Flexible'}.`,
    internalNotes: `Quotation conversion completed. Payment term: Net 30 Commercial Terms.`
  };

  // Decrement inventory stock safely
  orderItems.forEach(orderItem => {
    const prod = products.find(p => p.id === orderItem.id || p.sku === orderItem.sku);
    if (prod) {
      prod.stock = Math.max(0, (prod.stock || 0) - orderItem.quantity);
    }
  });

  // Update Quotation Status
  quote.status = 'Accepted';
  quote.acceptedAt = new Date().toISOString();
  quote.orderId = newOrder.id;

  orders.unshift(newOrder);
  writeData('orders.json', orders);
  writeData('quotes.json', quotes);
  writeData('products.json', products);

  logAudit(
    quote.customer?.name || 'Customer', 
    'customer', 
    'QUOTE_ACCEPT', 
    `Quotation ${quote.id}`, 
    `Quotation accepted and converted to Order ${newOrder.id} ($${total.toFixed(2)})`
  );

  res.status(201).json({
    success: true,
    message: `Quotation successfully accepted! Confirmed Order ${newOrder.id} has been generated.`,
    order: newOrder,
    quote
  });
});

// Customer: Submit Revision Request for Quotation
app.post('/api/quotes/:id/revision', (req, res) => {
  const quotes = readData('quotes.json');
  const quote = quotes.find(q => q.id === req.params.id);
  if (!quote) return res.status(404).json({ error: 'Quotation not found' });

  const { revisionNotes, proposedTargetPrice } = req.body || {};

  quote.status = 'Revision Requested';
  quote.revisionNotes = revisionNotes || 'Customer requested price/quantity adjustments.';
  if (proposedTargetPrice) quote.customerProposedPrice = parseFloat(proposedTargetPrice);
  quote.revisionRequestedAt = new Date().toISOString();

  writeData('quotes.json', quotes);
  logAudit(
    quote.customer?.name || 'Customer', 
    'customer', 
    'QUOTE_REVISION_REQUEST', 
    `Quotation ${quote.id}`, 
    `Revision requested: ${quote.revisionNotes}`
  );

  res.json({
    success: true,
    message: 'Revision request submitted to BeadsSource Wholesale Management Desk.',
    quote
  });
});

// ==========================================
// 7. COUPONS API
// ==========================================
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

app.post('/api/coupons', (req, res) => {
  const coupons = readData('coupons.json');
  const user = getAuthUser(req);
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
  logAudit(user?.name || 'Administrator', user?.role || 'admin', 'COUPON_CREATE', `Promo ${newCoupon.code}`, `Created coupon for ${newCoupon.discountValue}% discount`);

  res.status(201).json(newCoupon);
});

// ==========================================
// 8. STORE SETTINGS & CONFIGURATION API
// ==========================================
app.get('/api/settings', (req, res) => {
  const settings = readData('settings.json');
  res.json(settings);
});

app.put('/api/settings', (req, res) => {
  const user = getAuthUser(req);
  const settings = readData('settings.json');
  const updated = { ...settings, ...req.body };
  writeData('settings.json', updated);
  logAudit(user?.name || 'Super Administrator', user?.role || 'super_admin', 'SETTINGS_UPDATE', 'Global Settings', 'Updated website store configuration');
  res.json(updated);
});

// ==========================================
// 9. CONTENT MANAGEMENT (CMS) API
// ==========================================
app.get('/api/content', (req, res) => {
  const content = readData('content.json');
  res.json(content);
});

app.put('/api/content', (req, res) => {
  const user = getAuthUser(req);
  const content = readData('content.json');
  const updated = { ...content, ...req.body };
  writeData('content.json', updated);
  logAudit(user?.name || 'Administrator', user?.role || 'admin', 'CONTENT_UPDATE', 'CMS Content', 'Updated homepage banners and FAQs');
  res.json(updated);
});

// ==========================================
// 9B. PRODUCT ADVERTISING & CAMPAIGNS API (Pinterest-Inspired Discovery)
// ==========================================
app.get('/api/campaigns', (req, res) => {
  const campaigns = readData('campaigns.json');
  const { placement, activeOnly } = req.query;
  let filtered = [...campaigns];

  if (activeOnly === 'true') {
    filtered = filtered.filter(c => c.active !== false);
  }
  if (placement && placement !== 'all') {
    filtered = filtered.filter(c => c.placement === placement);
  }

  // Sort by priority ascending
  filtered.sort((a, b) => (a.priority || 99) - (b.priority || 99));
  res.json(filtered);
});

app.post('/api/campaigns', requireRoles(['super_admin', 'admin', 'product_manager']), (req, res) => {
  const campaigns = readData('campaigns.json');
  const user = getAuthUser(req);

  const newCampaign = {
    id: `camp-${Date.now().toString().slice(-4)}`,
    title: req.body.title || 'Curated Collection',
    subtitle: req.body.subtitle || '',
    badge: req.body.badge || 'Artisan Spotlight',
    tag: req.body.tag || 'Fine Jewelry',
    image: req.body.image || 'https://beadssource.com/wp-content/uploads/DSC_2552-scaled-1-1536x1025-1-300x300.jpg',
    cardSize: req.body.cardSize || 'standard', // tall, standard, wide
    placement: req.body.placement || 'discovery_masonry',
    productId: req.body.productId || null,
    categorySlug: req.body.categorySlug || 'natural-gemstone-beads',
    ctaText: req.body.ctaText || 'Explore Collection',
    priority: parseInt(req.body.priority, 10) || campaigns.length + 1,
    active: req.body.active !== false,
    impressions: 0,
    clicks: 0,
    cartAdds: 0,
    rfqClicks: 0,
    createdAt: new Date().toISOString()
  };

  campaigns.push(newCampaign);
  writeData('campaigns.json', campaigns);
  logAudit(user?.name || 'Administrator', user?.role || 'admin', 'CAMPAIGN_CREATE', `Campaign ${newCampaign.title}`, `Created visual advertising campaign ${newCampaign.id}`);

  res.status(201).json(newCampaign);
});

app.put('/api/campaigns/:id', requireRoles(['super_admin', 'admin', 'product_manager']), (req, res) => {
  const campaigns = readData('campaigns.json');
  const user = getAuthUser(req);
  const index = campaigns.findIndex(c => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Campaign not found' });
  }

  campaigns[index] = {
    ...campaigns[index],
    ...req.body,
    id: campaigns[index].id // immutable
  };

  writeData('campaigns.json', campaigns);
  logAudit(user?.name || 'Administrator', user?.role || 'admin', 'CAMPAIGN_UPDATE', `Campaign ${campaigns[index].title}`, `Updated visual advertising campaign ${campaigns[index].id}`);

  res.json(campaigns[index]);
});

app.delete('/api/campaigns/:id', requireRoles(['super_admin', 'admin']), (req, res) => {
  let campaigns = readData('campaigns.json');
  const user = getAuthUser(req);
  const target = campaigns.find(c => c.id === req.params.id);

  if (!target) {
    return res.status(404).json({ error: 'Campaign not found' });
  }

  campaigns = campaigns.filter(c => c.id !== req.params.id);
  writeData('campaigns.json', campaigns);
  logAudit(user?.name || 'Administrator', user?.role || 'admin', 'CAMPAIGN_DELETE', `Campaign ${target.title}`, `Deleted advertising campaign ${target.id}`);

  res.json({ success: true, message: 'Campaign deleted' });
});

// Analytics tracking endpoint (public, debounced)
app.post('/api/campaigns/:id/track', (req, res) => {
  const campaigns = readData('campaigns.json');
  const target = campaigns.find(c => c.id === req.params.id);

  if (target) {
    const { event, eventType } = req.body || {};
    const evt = event || eventType;
    if (evt === 'click') target.clicks = (target.clicks || 0) + 1;
    else if (evt === 'cartAdd') target.cartAdds = (target.cartAdds || 0) + 1;
    else if (evt === 'rfqClick') target.rfqClicks = (target.rfqClicks || 0) + 1;
    else target.impressions = (target.impressions || 0) + 1;

    writeData('campaigns.json', campaigns);
  }

  res.json({ 
    success: true, 
    clicks: target ? target.clicks : 0, 
    impressions: target ? target.impressions : 0,
    cartAdds: target ? target.cartAdds : 0,
    rfqClicks: target ? target.rfqClicks : 0
  });
});

// ==========================================
// 10. AUDIT LOGS API
// ==========================================
app.get('/api/audit-logs', (req, res) => {
  const logs = readData('audit-logs.json');
  res.json(logs);
});

// ==========================================
// 11. REVIEWS API
// ==========================================
app.get('/api/reviews', (req, res) => {
  const reviews = readData('reviews.json');
  const { productId, status } = req.query;

  let filtered = [...reviews];
  if (productId) {
    filtered = filtered.filter(r => r.productId === productId);
  }
  if (status) {
    filtered = filtered.filter(r => r.status === status);
  }

  res.json(filtered);
});

app.post('/api/reviews', (req, res) => {
  const reviews = readData('reviews.json');
  const newReview = {
    id: `rev-${Date.now()}`,
    productId: req.body.productId,
    productName: req.body.productName || 'Wholesale Component',
    customerName: req.body.customerName || 'Verified Wholesale Jeweler',
    customerCompany: req.body.customerCompany || 'Jewelry Studio Partner',
    rating: parseInt(req.body.rating) || 5,
    title: req.body.title || 'Exceptional wholesale quality',
    comment: req.body.comment,
    status: 'pending',
    date: new Date().toISOString()
  };

  reviews.unshift(newReview);
  writeData('reviews.json', reviews);
  res.status(201).json(newReview);
});

app.put('/api/reviews/:id/status', (req, res) => {
  const reviews = readData('reviews.json');
  const review = reviews.find(r => r.id === req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found' });

  const user = getAuthUser(req);
  review.status = req.body.status || 'approved';
  writeData('reviews.json', reviews);
  logAudit(user?.name || 'Administrator', user?.role || 'admin', 'REVIEW_STATUS', `Review ${review.id}`, `Review status updated to ${review.status}`);

  res.json(review);
});

app.delete('/api/reviews/:id', (req, res) => {
  let reviews = readData('reviews.json');
  const filtered = reviews.filter(r => r.id !== req.params.id);
  writeData('reviews.json', filtered);
  res.json({ success: true, message: 'Review deleted' });
});

// ==========================================
// 12. ADMIN STATS & ANALYTICS API
// ==========================================
app.get('/api/admin/stats', requireRoles(['super_admin', 'admin', 'order_manager']), (req, res) => {
  const products = readData('products.json');
  const orders = readData('orders.json');
  const quotes = readData('quotes.json');
  const users = readData('users.json');

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalStockUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const lowStockCount = products.filter(p => (p.stock || 0) < (p.lowStockThreshold || 200)).length;
  const pendingQuotes = quotes.filter(q => q.status === 'In Review' || q.status === 'New').length;
  const pendingOrders = orders.filter(o => o.status === 'Processing' || o.status === 'Pending').length;

  // Category sales breakdown
  const categoryCount = {};
  products.forEach(p => {
    categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
  });

  res.json({
    totalRevenue,
    ordersCount: orders.length,
    pendingOrders,
    productsCount: products.length,
    usersCount: users.length,
    pendingQuotes,
    totalStockUnits,
    lowStockCount,
    categoryCount,
    recentOrders: orders.slice(0, 6),
    recentQuotes: quotes.slice(0, 6)
  });
});

// --- SERVE FRONTEND STATIC BUILD (FOR RENDER / PRODUCTION) ---
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // Express 5 compatible SPA fallback middleware
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`BeadsSource Wholesale API running on http://localhost:${PORT}`);
});
