// Comprehensive API Testing Suite
import assert from 'assert';

const API_BASE = 'http://127.0.0.1:5000/api';

async function request(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  try {
    return { status: res.status, ok: res.ok, headers: res.headers, data: JSON.parse(text) };
  } catch {
    return { status: res.status, ok: res.ok, headers: res.headers, data: text };
  }
}

export async function runApiTests() {
  console.log('\n--- [TEST SUITE: API ENDPOINT & CONTRACT VERIFICATION] ---');
  let passed = 0;
  let failed = 0;

  function test(condition, desc) {
    if (condition) {
      console.log(`  [PASS] ${desc}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${desc}`);
      failed++;
    }
  }

  // 1. Health check
  const healthRes = await request(`${API_BASE}/health`);
  test(healthRes.status === 200 && healthRes.data.status === 'ok', 'GET /api/health returns 200 OK with brand metadata');

  // 2. Products listing & filters
  const allProds = await request(`${API_BASE}/products`);
  test(allProds.status === 200 && Array.isArray(allProds.data) && allProds.data.length > 0, `GET /api/products returns ${allProds.data?.length} catalog items`);

  // Category filter
  const catProds = await request(`${API_BASE}/products?category=natural-gemstone-beads`);
  test(catProds.status === 200 && catProds.data.every(p => p.category === 'natural-gemstone-beads'), 'GET /api/products?category=... returns strictly matching category');

  // Price filter
  const priceProds = await request(`${API_BASE}/products?minPrice=5&maxPrice=15`);
  test(priceProds.status === 200 && priceProds.data.every(p => p.price >= 5 && p.price <= 15), 'GET /api/products?minPrice=5&maxPrice=15 bounds pricing correctly');

  // Sorting
  const sortedProds = await request(`${API_BASE}/products?sort=price-low`);
  const isAscending = sortedProds.data.every((p, i, arr) => i === 0 || (p.salePrice || p.price) >= (arr[i - 1].salePrice || arr[i - 1].price));
  test(sortedProds.status === 200 && isAscending, 'GET /api/products?sort=price-low sorts prices ascending');

  // Single Product by ID & Slug
  const firstProd = allProds.data[0];
  const prodById = await request(`${API_BASE}/products/${firstProd.id}`);
  test(prodById.status === 200 && prodById.data.id === firstProd.id, `GET /api/products/:id finds product by ID (${firstProd.id})`);

  const prodBySlug = await request(`${API_BASE}/products/${firstProd.slug}`);
  test(prodBySlug.status === 200 && prodBySlug.data.sku === firstProd.sku, `GET /api/products/:slug finds product by URL slug (${firstProd.slug})`);

  // Non-existent product
  const notFoundProd = await request(`${API_BASE}/products/non-existent-sku-9999`);
  test(notFoundProd.status === 404 && notFoundProd.data.error, 'GET /api/products/:id returns structured 404 for non-existent item');

  // 3. Categories API
  const catsRes = await request(`${API_BASE}/categories`);
  test(catsRes.status === 200 && Array.isArray(catsRes.data) && catsRes.data.length >= 6, `GET /api/categories returns ${catsRes.data?.length} categories`);

  // 4. Coupons Validation API
  const validCoupon = await request(`${API_BASE}/coupons/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'WHOLESALE10', subtotal: 300 })
  });
  test(validCoupon.status === 200 && validCoupon.data.valid, 'POST /api/coupons/validate validates eligible coupon code');

  const minOrderRejected = await request(`${API_BASE}/coupons/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'WHOLESALE10', subtotal: 50 })
  });
  test(minOrderRejected.status === 400 && minOrderRejected.data.error, 'POST /api/coupons/validate rejects order below minimum threshold');

  const invalidCoupon = await request(`${API_BASE}/coupons/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'FAKEDISCOUNT999' })
  });
  test(invalidCoupon.status === 404, 'POST /api/coupons/validate returns 404 for non-existent code');

  // 5. Campaigns & Visual Advertising API
  const campRes = await request(`${API_BASE}/campaigns`);
  test(campRes.status === 200 && Array.isArray(campRes.data) && campRes.data.length >= 6, `GET /api/campaigns returns ${campRes.data?.length} visual pin campaigns`);

  // Track event
  const trackRes = await request(`${API_BASE}/campaigns/${campRes.data[0].id}/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventType: 'click' })
  });
  test(trackRes.status === 200 && trackRes.data.success, 'POST /api/campaigns/:id/track logs click engagement successfully');

  // 6. Recommendation Engine API
  const recomRes = await request(`${API_BASE}/products/${firstProd.id}/recommendations`);
  const hasRecoms = recomRes.status === 200 && (recomRes.data?.pairings?.length > 0 || recomRes.data?.related?.length > 0);
  test(hasRecoms, 'GET /api/products/:id/recommendations generates cross-selling pairings');

  // Global recommendations
  const globalRecom = await request(`${API_BASE}/recommendations?limit=4`);
  test(globalRecom.status === 200 && Array.isArray(globalRecom.data) && globalRecom.data.length === 4, 'GET /api/recommendations returns limited recommendations set');

  // 7. Image Upload API
  const tinyPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const uploadRes = await request(`${API_BASE}/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: tinyPng, filename: 'qa_sample.png' })
  });
  test(uploadRes.status === 200 && uploadRes.data.url?.startsWith('/uploads/'), `POST /api/upload stores and returns static URL: ${uploadRes.data?.url}`);

  // Disallowed extension test
  const badUpload = await request(`${API_BASE}/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: 'data:application/x-msdownload;base64,TVqQAAMAAAAEAAAA', filename: 'exploit.exe' })
  });
  test(badUpload.status === 400, 'POST /api/upload rejects non-image MIME types with 400 Bad Request');

  console.log(`API Test Results: ${passed} Passed, ${failed} Failed\n`);
  return { passed, failed };
}

if (process.argv[1]?.endsWith('api.test.mjs')) {
  runApiTests().then(res => process.exit(res.failed > 0 ? 1 : 0));
}
