import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const QuoteContext = createContext();

export const QuoteProvider = ({ children }) => {
  const [quoteItems, setQuoteItems] = useState(() => {
    try {
      const saved = localStorage.getItem('beadssource_quote_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('beadssource_quote_items', JSON.stringify(quoteItems));
  }, [quoteItems]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addToQuote = (product, requestedQty = 50, targetPrice = null, notes = '') => {
    const qty = parseInt(requestedQty, 10) || 50;
    const initialTarget = targetPrice || product.salePrice || product.price;

    setQuoteItems(prev => {
      const index = prev.findIndex(item => item.id === product.id);
      if (index > -1) {
        const next = [...prev];
        next[index].requestedQty += qty;
        if (notes) next[index].notes = notes;
        return next;
      } else {
        return [...prev, {
          id: product.id,
          name: product.name,
          sku: product.sku,
          catalogPrice: product.price,
          salePrice: product.salePrice,
          image: product.image,
          requestedQty: qty,
          targetPrice: initialTarget,
          notes: notes || 'Standard wholesale export specifications'
        }];
      }
    });

    showToast(`Added "${product.name}" to Quotation Builder`);
  };

  const removeFromQuote = (productId) => {
    setQuoteItems(prev => prev.filter(item => item.id !== productId));
    showToast('Item removed from quotation request');
  };

  const updateQuoteItem = (productId, field, value) => {
    setQuoteItems(prev => prev.map(item => {
      if (item.id === productId) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const clearQuote = () => {
    setQuoteItems([]);
  };

  const submitQuote = async (quoteData) => {
    try {
      const payload = {
        ...quoteData,
        items: quoteItems
      };
      const res = await api.submitQuote(payload);
      clearQuote();
      showToast(`Quotation #${res.id} submitted successfully!`);
      return { success: true, quote: res };
    } catch (err) {
      showToast(err.message || 'Quote submission failed');
      return { success: false, error: err.message };
    }
  };

  return (
    <QuoteContext.Provider value={{
      quoteItems,
      quoteCount: quoteItems.length,
      addToQuote,
      removeFromQuote,
      updateQuoteItem,
      clearQuote,
      submitQuote,
      toastMessage
    }}>
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuote = () => useContext(QuoteContext);
