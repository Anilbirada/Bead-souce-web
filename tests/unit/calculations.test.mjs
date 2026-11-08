// Unit tests for B2B Pricing Calculations, Tier Savings, Shipping Thresholds, and Currency Conversion
import assert from 'assert';

export function runCalculationTests() {
  console.log('\n--- [TEST SUITE: UNIT / CALCULATIONS & PRICING TIERS] ---');
  let passed = 0;
  let failed = 0;

  function it(desc, fn) {
    try {
      fn();
      console.log(`  [PASS] ${desc}`);
      passed++;
    } catch (err) {
      console.error(`  [FAIL] ${desc}: ${err.message}`);
      failed++;
    }
  }

  // 1. Tier Pricing Rules
  function calculateTierPrice(basePrice, qty) {
    if (qty >= 50) return Number((basePrice * 0.70).toFixed(2)); // 30% savings
    if (qty >= 10) return Number((basePrice * 0.85).toFixed(2)); // 15% savings
    return basePrice;
  }

  it('calculates Tier 1 standard pricing for qty < 10', () => {
    const price = calculateTierPrice(10.00, 5);
    assert.strictEqual(price, 10.00);
  });

  it('calculates Tier 2 (15% wholesale discount) for qty 10-49', () => {
    const price = calculateTierPrice(10.00, 20);
    assert.strictEqual(price, 8.50);
  });

  it('calculates Tier 3 (30% volume lot discount) for qty >= 50', () => {
    const price = calculateTierPrice(10.00, 100);
    assert.strictEqual(price, 7.00);
  });

  // 2. Shipping Thresholds
  function calculateShipping(subtotal, defaultCourierFee = 35.00) {
    const FREE_SHIPPING_THRESHOLD = 500.00;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0.00 : defaultCourierFee;
  }

  it('applies standard international courier fee below $500 threshold', () => {
    const fee = calculateShipping(350.00);
    assert.strictEqual(fee, 35.00);
  });

  it('grants free international courier delivery at or above $500 threshold', () => {
    const fee = calculateShipping(500.00);
    assert.strictEqual(fee, 0.00);
  });

  it('grants free international courier delivery for large $1,500 order', () => {
    const fee = calculateShipping(1500.00);
    assert.strictEqual(fee, 0.00);
  });

  // 3. Coupon Discount Calculation
  function applyCouponDiscount(subtotal, coupon) {
    if (!coupon || !coupon.active) return 0;
    if (coupon.minOrder && subtotal < coupon.minOrder) return 0;
    if (coupon.discountType === 'percentage') {
      return Number(((subtotal * coupon.discountValue) / 100).toFixed(2));
    }
    return Math.min(subtotal, coupon.discountValue);
  }

  it('calculates percentage coupon discount correctly', () => {
    const discount = applyCouponDiscount(200.00, {
      active: true,
      discountType: 'percentage',
      discountValue: 15,
      minOrder: 100
    });
    assert.strictEqual(discount, 30.00);
  });

  it('rejects coupon discount if subtotal is below minimum order', () => {
    const discount = applyCouponDiscount(80.00, {
      active: true,
      discountType: 'percentage',
      discountValue: 15,
      minOrder: 100
    });
    assert.strictEqual(discount, 0.00);
  });

  // 4. Currency Conversion Rates (USD baseline)
  const RATES = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    CAD: 1.36,
    AUD: 1.52,
    JPY: 155.0
  };

  function convertCurrency(amountInUSD, targetCurrency) {
    const rate = RATES[targetCurrency] || 1.0;
    return Number((amountInUSD * rate).toFixed(2));
  }

  it('converts USD to EUR accurately', () => {
    const eur = convertCurrency(100.00, 'EUR');
    assert.strictEqual(eur, 92.00);
  });

  it('converts USD to GBP accurately', () => {
    const gbp = convertCurrency(100.00, 'GBP');
    assert.strictEqual(gbp, 79.00);
  });

  console.log(`Unit Test Results: ${passed} Passed, ${failed} Failed\n`);
  return { passed, failed };
}

if (process.argv[1]?.endsWith('calculations.test.mjs')) {
  const res = runCalculationTests();
  process.exit(res.failed > 0 ? 1 : 0);
}
