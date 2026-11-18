import React, { createContext, useContext, useState, useEffect } from 'react';
import { formatPrice as formatPriceUtil } from '../utils/currency';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const currency = 'USD';
  const setCurrency = () => {}; // Strictly locked to USD

  const formatPrice = (amount) => formatPriceUtil(amount, 'USD');

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
