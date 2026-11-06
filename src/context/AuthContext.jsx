import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

const ROLE_PERMISSIONS = {
  super_admin: ['dashboard', 'products', 'categories', 'inventory', 'orders', 'quotes', 'customers', 'reviews', 'content', 'reports', 'roles', 'settings', 'help', 'audit'],
  admin: ['dashboard', 'products', 'categories', 'inventory', 'orders', 'quotes', 'customers', 'reviews', 'content', 'reports', 'settings', 'help', 'audit'],
  product_manager: ['dashboard', 'products', 'categories', 'inventory', 'reviews', 'help'],
  order_manager: ['dashboard', 'orders', 'quotes', 'customers', 'reports', 'help'],
  inventory_manager: ['dashboard', 'inventory', 'products', 'help'],
  support: ['dashboard', 'orders', 'quotes', 'customers', 'reviews', 'help'],
  customer: ['dashboard', 'orders', 'quotes', 'profile', 'wishlist']
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('beadssource_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('beadssource_token'));
  const [loading, setLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'register'

  useEffect(() => {
    if (user) {
      localStorage.setItem('beadssource_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('beadssource_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('beadssource_token', token);
    } else {
      localStorage.removeItem('beadssource_token');
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login(email, password);
      setUser(data.user);
      setToken(data.token);
      setAuthModalOpen(false);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await api.register(userData);
      setUser(data.user);
      setToken(data.token);
      setAuthModalOpen(false);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const openLogin = () => {
    setAuthModalMode('login');
    setAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthModalMode('register');
    setAuthModalOpen(true);
  };

  const userRole = user?.role || 'guest';
  const isAdmin = ['super_admin', 'admin', 'product_manager', 'order_manager', 'inventory_manager', 'support'].includes(userRole);
  const isSuperAdmin = userRole === 'super_admin';
  const isWholesaleVerified = user && Boolean(user.wholesaleApproved);

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    const permissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateUser,
      isAdmin,
      isSuperAdmin,
      userRole,
      hasPermission,
      isWholesaleVerified,
      authModalOpen,
      setAuthModalOpen,
      authModalMode,
      setAuthModalMode,
      openLogin,
      openRegister
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
