import React, { Component, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('BeadsSource Application Notice:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('beadssource_user');
      localStorage.removeItem('beadssource_token');
      localStorage.removeItem('beadssource_cart');
      localStorage.removeItem('beadssource_wishlist');
      sessionStorage.clear();
    } catch (e) {
      console.warn(e);
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF9F5] text-[#191919] flex items-center justify-center p-6 text-center select-none font-sans">
          <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#E9E3D8] shadow-2xl space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF6E5] border border-[#DACFBA] text-[#C49A3A] flex items-center justify-center mx-auto text-2xl shadow-xs">
              💎
            </div>
            <h1 className="font-serif font-bold text-2xl text-[#191919]">
              BeadsSource Wholesale
            </h1>
            <p className="text-xs text-gray-500 leading-relaxed">
              A previous session cache was detected in your browser. Click below to load the latest verified wholesale catalog and components.
            </p>
            <div className="pt-2">
              <button
                onClick={this.handleReset}
                className="w-full py-3 bg-[#191919] hover:bg-[#2C2C2C] text-[#C49A3A] font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
              >
                Reset Session &amp; Launch Storefront
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
