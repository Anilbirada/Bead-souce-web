// Integration Test: Shopping Cart, Coupon Application & Direct Checkout Flow
import assert from 'assert';

const API_BASE = 'http://127.0.0.1:5000/api';

async function request(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  try {
    return { status: res.status, ok: res.ok, data: JSON.parse(text) };
  } catch {
    return { status: res.status, ok: res.ok, data: text };
  }
}

export async function runCartCheckoutTest() {
  console.log('\n--- [TEST SUITE: INTEGRATION / CART & CHECKOUT WORKFLOW] ---');
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

  // 1. Fetch available products
  const prodsRes = await request(`${API_BASE}/products`);
  const item1 = prodsRes.data[0];
  const item2 = prodsRes.data[1];
  const initialStock1 = item1.stock;

  // 2. Reject empty checkout submission
  const emptyOrderRes = await request(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer: { name: 'Empty Buyer', email: 'empty@buyer.com' },
      items: []
    })
  });
  test(emptyOrderRes.status === 400 && emptyOrderRes.data.error, 'Rejects empty checkout payload with 400 Bad Request');

  // 3. Create Wholesale Direct Checkout with multiple items and coupon
  const orderQty = 15;
  const subtotal = (item1.price * orderQty) + (item2.price * 10);
  const discount = Number((subtotal * 0.10).toFixed(2)); // 10% coupon
  const shipping = subtotal >= 500 ? 0 : 35.00;
  const total = Number((subtotal - discount + shipping).toFixed(2));

  const validOrderPayload = {
    customer: {
      name: 'Claire Dupont',
      email: 'claire@dupontjewels.fr',
      company: 'Dupont Haute Parfumerie & Bijoux',
      phone: '+33 1 42 68 55 00'
    },
    shippingAddress: {
      addressLine1: '28 Rue du Faubourg Saint-Honore',
      city: 'Paris',
      state: 'Ile-de-France',
      postalCode: '75008',
      country: 'France'
    },
    items: [
      {
        id: item1.id,
        name: item1.name,
        sku: item1.sku,
        price: item1.price,
        quantity: orderQty,
        total: item1.price * orderQty
      },
      {
        id: item2.id,
        name: item2.name,
        sku: item2.sku,
        price: item2.price,
        quantity: 10,
        total: item2.price * 10
      }
    ],
    subtotal,
    discount,
    couponCode: 'WHOLESALE10',
    shipping,
    tax: 0,
    total,
    paymentMethod: 'Wire Transfer',
    notes: 'Please pack in heavy export cartons.'
  };

  const createOrderRes = await request(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validOrderPayload)
  });

  test(createOrderRes.status === 201 && createOrderRes.data.id?.startsWith('ORD-'), `Direct wholesale checkout successfully created order: ${createOrderRes.data?.id}`);
  const createdOrder = createOrderRes.data;

  // 4. Verify inventory reduction
  const prodsAfter = await request(`${API_BASE}/products`);
  const updatedItem1 = prodsAfter.data.find(p => p.id === item1.id);
  const expectedRemaining = Math.max(0, initialStock1 - orderQty);
  test(updatedItem1.stock === expectedRemaining, `Checkout safely reduced stock of SKU ${item1.sku} by ${orderQty} units`);

  // 5. Query order by customer email
  const customerOrdersRes = await request(`${API_BASE}/orders?email=claire@dupontjewels.fr`);
  const foundInHistory = customerOrdersRes.data.some(o => o.id === createdOrder.id);
  test(customerOrdersRes.status === 200 && foundInHistory, 'Customer can query their newly created order in portal history');

  console.log(`Cart & Checkout Integration Results: ${passed} Passed, ${failed} Failed\n`);
  return { passed, failed };
}

if (process.argv[1]?.endsWith('cart_checkout.test.mjs')) {
  runCartCheckoutTest().then(res => process.exit(res.failed > 0 ? 1 : 0));
}
