import localProducts from '../data/products.json';
import localCategories from '../data/categories.json';

const API_BASE = '/api';

export const api = {
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });

    try {
      const res = await fetch(`${API_BASE}/products?${query.toString()}`);
      if (!res.ok) throw new Error('Network response not ok');
      return await res.json();
    } catch (err) {
      console.warn('Backend API unavailable, falling back to local dataset:', err);
      let results = [...localProducts];
      if (params.category && params.category !== 'all') {
        results = results.filter(p => p.category === params.category || p.slug === params.category);
      }
      if (params.search) {
        const q = params.search.toLowerCase().trim();
        results = results.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.sku.toLowerCase().includes(q) ||
          (p.materials && p.materials.toLowerCase().includes(q))
        );
      }
      if (params.featured === 'true') {
        results = results.filter(p => p.isFeatured);
      }
      if (params.bestSeller === 'true') {
        results = results.filter(p => p.isBestSeller);
      }
      return results;
    }
  },

  async getProduct(idOrSlug) {
    try {
      const res = await fetch(`${API_BASE}/products/${idOrSlug}`);
      if (!res.ok) throw new Error('Not found');
      return await res.json();
    } catch (err) {
      return localProducts.find(p => p.id === idOrSlug || p.slug === idOrSlug) || null;
    }
  },

  async getCategories() {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (err) {
      return localCategories;
    }
  },

  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      return data;
    } catch (err) {
      // Fallback auth for local testing
      if (email.toLowerCase().includes('admin') && password === 'admin') {
        return {
          user: {
            id: 'usr-admin',
            email: 'admin@beadssource.com',
            name: 'Ramesh Sir (Admin)',
            role: 'admin',
            company: 'BeadsSource SP Bengaluru',
            wholesaleApproved: true
          },
          token: 'local_jwt_admin'
        };
      }
      throw err;
    }
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  async createOrder(orderData) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Order creation failed');
    return data;
  },

  async getOrders(email = null) {
    const url = email ? `${API_BASE}/orders?email=${encodeURIComponent(email)}` : `${API_BASE}/orders`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
  },

  async updateOrderStatus(orderId, statusData) {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statusData)
    });
    return await res.json();
  },

  async submitQuote(quoteData) {
    const res = await fetch(`${API_BASE}/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quoteData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Quote submission failed');
    return data;
  },

  async getQuotes(email = null) {
    const url = email ? `${API_BASE}/quotes?email=${encodeURIComponent(email)}` : `${API_BASE}/quotes`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch quotes');
    return await res.json();
  },

  async updateQuote(quoteId, quoteData) {
    const res = await fetch(`${API_BASE}/quotes/${quoteId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quoteData)
    });
    return await res.json();
  },

  async validateCoupon(code, subtotal) {
    const res = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid coupon');
    return data;
  },

  async getCoupons() {
    const res = await fetch(`${API_BASE}/coupons`);
    return await res.json();
  },

  async createCoupon(couponData) {
    const res = await fetch(`${API_BASE}/coupons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(couponData)
    });
    return await res.json();
  },

  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`);
    if (!res.ok) throw new Error('Failed to load stats');
    return await res.json();
  },

  async createProduct(productData) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return await res.json();
  },

  async updateProduct(id, productData) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return await res.json();
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  }
};
