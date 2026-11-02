import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateTierPrice } from '../utils/currency';
import { api } from '../utils/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('beadssource_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('beadssource_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('beadssource_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem('beadssource_coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('beadssource_coupon');
    }
  }, [coupon]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addToCart = (product, quantity = 1, finish = null, size = null) => {
    const qty = parseInt(quantity, 10) || 1;
    const selectedFinish = finish || (product.finish && product.finish[0]) || 'Standard';
    const selectedSize = size || (product.sizes && product.sizes[0]) || 'Standard';

    setCart(prev => {
      const index = prev.findIndex(item => 
        item.id === product.id && 
        item.selectedFinish === selectedFinish && 
        item.selectedSize === selectedSize
      );

      if (index > -1) {
        const next = [...prev];
        next[index].quantity += qty;
        return next;
      } else {
        return [...prev, {
          id: product.id,
          name: product.name,
          sku: product.sku,
          price: product.price,
          salePrice: product.salePrice,
          image: product.image,
          selectedFinish,
          selectedSize,
          moq: product.moq || 1,
          quantity: qty
        }];
      }
    });

    showToast(`Added ${qty} × "${product.name}" to cart`);
    setIsCartDrawerOpen(true);
  };

  const updateQuantity = (itemId, finish, size, newQty) => {
    if (newQty <= 0) {
      removeFromCart(itemId, finish, size);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.id === itemId && item.selectedFinish === finish && item.selectedSize === size) {
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (itemId, finish, size) => {
    setCart(prev => prev.filter(item => 
      !(item.id === itemId && item.selectedFinish === finish && item.selectedSize === size)
    ));
    showToast('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  const applyCoupon = async (code) => {
    try {
      const res = await api.validateCoupon(code, rawSubtotal);
      if (res.valid) {
        setCoupon(res.coupon);
        showToast(`Coupon "${res.coupon.code}" applied successfully!`);
        return { success: true };
      }
    } catch (err) {
      showToast(err.message || 'Invalid coupon');
      return { success: false, error: err.message };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    showToast('Coupon removed');
  };

  // Calculations
  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Raw subtotal without tiered discounts
  const rawSubtotal = cart.reduce((sum, item) => {
    const unitPrice = item.salePrice || item.price;
    return sum + (unitPrice * item.quantity);
  }, 0);

  // Tiered wholesale discount:
  // Calculate item by item discounted price
  const tieredSubtotal = cart.reduce((sum, item) => {
    const base = item.salePrice || item.price;
    const tierUnitPrice = calculateTierPrice(base, item.quantity);
    return sum + (tierUnitPrice * item.quantity);
  }, 0);

  const tierSavings = Math.max(0, rawSubtotal - tieredSubtotal);

  // Coupon discount
  let couponDiscount = 0;
  if (coupon) {
    if (coupon.discountType === 'percentage') {
      couponDiscount = (tieredSubtotal * coupon.discountValue) / 100;
    } else if (coupon.discountType === 'fixed') {
      couponDiscount = coupon.discountValue;
    }
  }

  // Shipping logic
  // Free international express shipping for orders over $500 or with FREESHIP coupon
  const freeShippingThreshold = 500;
  const isFreeShipping = tieredSubtotal >= freeShippingThreshold || (coupon && coupon.discountType === 'free_shipping');
  const shippingFee = cart.length === 0 ? 0 : (isFreeShipping ? 0 : 25.00);

  const finalTotal = Math.max(0, tieredSubtotal - couponDiscount + shippingFee);

  const freeShippingProgress = Math.min(100, Math.round((tieredSubtotal / freeShippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - tieredSubtotal);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      itemsCount,
      rawSubtotal,
      tieredSubtotal,
      tierSavings,
      coupon,
      applyCoupon,
      removeCoupon,
      couponDiscount,
      shippingFee,
      isFreeShipping,
      finalTotal,
      freeShippingProgress,
      amountToFreeShipping,
      freeShippingThreshold,
      isCartDrawerOpen,
      setIsCartDrawerOpen,
      openCartDrawer: () => setIsCartDrawerOpen(true),
      closeCartDrawer: () => setIsCartDrawerOpen(false),
      toastMessage
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
