import React, { createContext, useContext, useState, useEffect } from 'react';
import { formatPrice as formatPriceUtil } from '../utils/currency';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('beadssource_currency') || 'USD';
  });

  useEffect(() => {
    localStorage.setItem('beadssource_currency', currency);
  }, [currency]);

  const formatPrice = (amount) => formatPriceUtil(amount, currency);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
