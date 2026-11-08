// Security & OWASP Verification Test Suite
import assert from 'assert';

const API_BASE = 'http://127.0.0.1:5000/api';
const SUPER_ADMIN_TOKEN = 'Bearer jwt_usr-super-admin';
const CUSTOMER_TOKEN = 'Bearer jwt_usr-buyer1';

async function request(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  try {
    return { status: res.status, ok: res.ok, headers: res.headers, data: JSON.parse(text) };
  } catch {
    return { status: res.status, ok: res.ok, headers: res.headers, data: text };
  }
}

export async function runSecurityTests() {
  console.log('\n--- [TEST SUITE: SECURITY / OWASP & RBAC AUDIT] ---');
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

  // 1. Unauthenticated access to sensitive administrative endpoints
  const unauthAudit = await request(`${API_BASE}/audit-logs`);
  test(unauthAudit.status === 401, 'RBAC 1.1: Unauthenticated request to /api/audit-logs returns 401 Unauthorized');

  const unauthUsers = await request(`${API_BASE}/users`);
  test(unauthUsers.status === 401, 'RBAC 1.2: Unauthenticated request to /api/users returns 401 Unauthorized');

  const unauthSettings = await request(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storeName: 'Hacked Store' })
  });
  test(unauthSettings.status === 401, 'RBAC 1.3: Unauthenticated PUT to /api/settings returns 401 Unauthorized');

  // 2. Customer token attempting administrative actions (Privilege Escalation / BOLA)
  const custAudit = await request(`${API_BASE}/audit-logs`, {
    headers: { 'Authorization': CUSTOMER_TOKEN }
  });
  test(custAudit.status === 403, 'RBAC 2.1: Customer role token accessing /api/audit-logs rejected with 403 Forbidden');

  const custSettings = await request(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': CUSTOMER_TOKEN
    },
    body: JSON.stringify({ storeName: 'Hacked Store' })
  });
  test(custSettings.status === 403, 'RBAC 2.2: Customer role token modifying /api/settings rejected with 403 Forbidden');

  const custCoupon = await request(`${API_BASE}/coupons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': CUSTOMER_TOKEN
    },
    body: JSON.stringify({ code: 'FREE100', discountValue: 100 })
  });
  test(custCoupon.status === 403, 'RBAC 2.3: Customer role token creating coupon rejected with 403 Forbidden');

  // 3. Super Administrator token granted access
  const adminAudit = await request(`${API_BASE}/audit-logs`, {
    headers: { 'Authorization': SUPER_ADMIN_TOKEN }
  });
  test(adminAudit.status === 200 && Array.isArray(adminAudit.data), 'RBAC 3.1: Super Administrator token successfully accesses /api/audit-logs');

  const adminUsers = await request(`${API_BASE}/users`, {
    headers: { 'Authorization': SUPER_ADMIN_TOKEN }
  });
  test(adminUsers.status === 200 && Array.isArray(adminUsers.data), 'RBAC 3.2: Super Administrator token accesses user account listings');

  // 4. Sensitive Data Masking: User list must never return plain passwords
  const usersHavePasswords = adminUsers.data.some(u => u.password !== undefined);
  test(!usersHavePasswords, 'Information Disclosure: User management API strips password fields in responses');

  // 5. Security Response Headers & Fingerprint Stripping
  const healthCheck = await request(`${API_BASE}/health`);
  const headers = healthCheck.headers;
  test(!headers.get('x-powered-by'), 'Fingerprinting: X-Powered-By header is cleanly stripped');
  test(headers.get('x-content-type-options') === 'nosniff', 'Headers: X-Content-Type-Options is set to nosniff');
  test(headers.get('x-frame-options') === 'SAMEORIGIN', 'Headers: X-Frame-Options is set to SAMEORIGIN (clickjacking protection)');
  test(headers.get('x-xss-protection') === '1; mode=block', 'Headers: X-XSS-Protection is enabled');
  test(headers.get('referrer-policy') === 'strict-origin-when-cross-origin', 'Headers: Referrer-Policy is strict-origin-when-cross-origin');

  // 6. Malicious File Upload Rejection
  const maliciousUpload = await request(`${API_BASE}/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: 'data:application/javascript;base64,YWxlcnQoMSk7',
      filename: 'exploit.js'
    })
  });
  test(maliciousUpload.status === 400 && maliciousUpload.data.error, 'Upload Security: Rejects non-image mime/scripts with 400 Bad Request');

  // 7. XSS Payload Handling in Forms
  const xssPayload = '<script>alert("xss")</script><img src=x onerror=alert(1)>';
  const xssReview = await request(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId: 'bs-001',
      customerName: xssPayload,
      comment: xssPayload,
      rating: 5
    })
  });
  test(xssReview.status === 201 && xssReview.data.status === 'pending', 'XSS Mitigation: Malicious tags in review safely handled without database corruption');

  console.log(`Security Test Results: ${passed} Passed, ${failed} Failed\n`);
  return { passed, failed };
}

if (process.argv[1]?.endsWith('security.test.mjs')) {
  runSecurityTests().then(res => process.exit(res.failed > 0 ? 1 : 0));
}
