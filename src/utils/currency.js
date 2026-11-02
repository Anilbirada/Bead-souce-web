export const EXCHANGE_RATE_USD_TO_INR = 86.5;

export const formatPrice = (amount, currency = 'USD') => {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';
  const num = Number(amount);

  if (currency === 'INR') {
    const inrValue = num * EXCHANGE_RATE_USD_TO_INR;
    return `₹${Math.round(inrValue).toLocaleString('en-IN')}`;
  }

  return `$${num.toFixed(2)}`;
};

export const calculateTierPrice = (basePrice, quantity) => {
  if (!basePrice) return 0;
  const qty = Number(quantity) || 1;
  if (qty >= 50) {
    return Number((basePrice * 0.70).toFixed(2)); // 30% off for 50+
  }
  if (qty >= 10) {
    return Number((basePrice * 0.85).toFixed(2)); // 15% off for 10-49
  }
  return basePrice;
};
