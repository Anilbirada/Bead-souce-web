export const EXCHANGE_RATES = {
  USD: 1.0,
  INR: 86.5,
  EUR: 0.92,
  GBP: 0.79
};

export const formatPrice = (amount, currency = 'USD') => {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';
  const num = Number(amount);

  switch (currency) {
    case 'INR': {
      const inrValue = num * EXCHANGE_RATES.INR;
      return `₹${Math.round(inrValue).toLocaleString('en-IN')}`;
    }
    case 'EUR': {
      const eurValue = num * EXCHANGE_RATES.EUR;
      return `€${eurValue.toFixed(2)}`;
    }
    case 'GBP': {
      const gbpValue = num * EXCHANGE_RATES.GBP;
      return `£${gbpValue.toFixed(2)}`;
    }
    case 'USD':
    default:
      return `$${num.toFixed(2)}`;
  }
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
