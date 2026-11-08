// Integration Test: Complete Wholesale RFQ to Confirmed Order Workflow
import assert from 'assert';

const API_BASE = 'http://127.0.0.1:5000/api';
const ADMIN_TOKEN = 'Bearer local_jwt_admin';

async function request(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  try {
    return { status: res.status, ok: res.ok, data: JSON.parse(text) };
  } catch {
    return { status: res.status, ok: res.ok, data: text };
  }
}

export async function runRfqToOrderTest() {
  console.log('\n--- [TEST SUITE: INTEGRATION / WHOLESALE RFQ-TO-ORDER WORKFLOW] ---');
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

  // Fetch initial product to track stock decrement
  const prodsRes = await request(`${API_BASE}/products`);
  const targetProd = prodsRes.data[0];
  const initialStock = targetProd.stock;

  // Step 1: Customer submits Wholesale RFQ
  const rfqPayload = {
    customer: {
      name: 'Elena Rostova QA',
      email: 'qa.buyer@luxurybeads.com',
      company: 'Rostova Fine Jewelry Atelier',
      country: 'France'
    },
    targetDeliveryDate: '2026-12-15',
    targetBudget: '$2,500 USD',
    comments: 'Requesting wholesale lot with vacuum 18K gold micro-pave finishes.',
    items: [
      {
        id: targetProd.id,
        name: targetProd.name,
        sku: targetProd.sku,
        requestedQty: 100,
        catalogPrice: targetProd.price,
        targetPrice: Number((targetProd.price * 0.75).toFixed(2))
      }
    ]
  };

  const createRfqRes = await request(`${API_BASE}/quotes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rfqPayload)
  });

  test(createRfqRes.status === 201 && createRfqRes.data.id?.startsWith('RFQ-'), `Step 1: Customer submitted RFQ (${createRfqRes.data?.id}) successfully`);
  const rfqId = createRfqRes.data.id;

  // Step 2: Administrator reviews RFQ and counter-offers pricing
  const updateRfqRes = await request(`${API_BASE}/quotes/${rfqId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': ADMIN_TOKEN
    },
    body: JSON.stringify({
      status: 'Counter Offer Sent',
      adminNotes: 'Approved factory lot discount: $2.10/unit with DHL Express dispatch.',
      counterOffer: 2.10,
      responseSent: true
    })
  });

  test(updateRfqRes.status === 200 && updateRfqRes.data.status === 'Counter Offer Sent', 'Step 2: Administrator reviewed and issued counter-offer');

  // Step 3: Customer accepts Quotation (Automatic conversion to Confirmed Order)
  const acceptRes = await request(`${API_BASE}/quotes/${rfqId}/accept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  test(acceptRes.status === 201 && acceptRes.data.order?.id?.startsWith('ORD-'), `Step 3: Quotation accepted and auto-converted to Order (${acceptRes.data?.order?.id})`);
  const generatedOrder = acceptRes.data.order;

  // Step 4: Verify Order Details & Commercial Terms
  test(generatedOrder.status === 'Confirmed' && generatedOrder.paymentStatus === 'Invoice Issued', 'Step 4a: Order status is Confirmed with Commercial Invoice Issued');
  test(generatedOrder.courierName === 'DHL Express Worldwide' && generatedOrder.trackingNumber, 'Step 4b: International courier and tracking number assigned');
  test(generatedOrder.quoteId === rfqId, 'Step 4c: Order links back directly to original RFQ ID');

  // Step 5: Verify Inventory stock decrement
  const refreshedProds = await request(`${API_BASE}/products`);
  const updatedProd = refreshedProds.data.find(p => p.id === targetProd.id);
  const expectedStock = Math.max(0, initialStock - 100);
  test(updatedProd.stock === expectedStock, `Step 5: Inventory safely decremented from ${initialStock} to ${updatedProd.stock} units`);

  // Step 6: Verify Quotation status in database
  const quoteCheck = await request(`${API_BASE}/quotes?email=qa.buyer@luxurybeads.com`);
  const foundQuote = quoteCheck.data.find(q => q.id === rfqId);
  test(foundQuote.status === 'Accepted' && foundQuote.orderId === generatedOrder.id, 'Step 6: Quotation record updated to Accepted with orderId');

  // Step 7: IDEMPOTENCY / Duplicate Acceptance Protection
  const duplicateAcceptRes = await request(`${API_BASE}/quotes/${rfqId}/accept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  test(duplicateAcceptRes.status === 400 && duplicateAcceptRes.data.error?.includes('already been accepted'), 'Step 7: Idempotency guard prevents duplicate order generation from accepted quote');

  console.log(`RFQ-to-Order Integration Results: ${passed} Passed, ${failed} Failed\n`);
  return { passed, failed };
}

if (process.argv[1]?.endsWith('rfq_to_order.test.mjs')) {
  runRfqToOrderTest().then(res => process.exit(res.failed > 0 ? 1 : 0));
}
