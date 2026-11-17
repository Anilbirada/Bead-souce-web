import React from 'react';

/**
 * Official BeadsSource Brand Logo Component
 * Incorporates the authentic brand typography and gradient (Amber Orange to Royal Purple)
 * Supporting both light backgrounds (Header, Checkout) and dark backgrounds (Footer, Mobile Drawer)
 */
export default function BrandLogo({ 
  variant = 'default', // 'default' (light bg), 'dark' (dark bg)
  size = 'md',        // 'sm', 'md', 'lg'
  withSubtitle = true,
  className = ''
}) {
  const isDark = variant === 'dark';

  // Sizing map for the official logo artwork
  const sizeClasses = {
    sm: 'h-6 sm:h-7',
    md: 'h-7 sm:h-8',
    lg: 'h-9 sm:h-10',
    xl: 'h-11 sm:h-12'
  };

  const logoSrc = isDark 
    ? '/brand/beadssource-logo-darkbg@2x.png' 
    : '/brand/beadssource-logo@2x.png';

  return (
    <div className={`flex flex-col select-none group ${className}`}>
      <div className="flex items-center gap-2">
        <img 
          src={logoSrc} 
          alt="BeadsSource" 
          className={`${sizeClasses[size] || sizeClasses.md} w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]`}
          loading="eager"
        />
      </div>
      {withSubtitle && (
        <span 
          className={`text-[9px] uppercase tracking-[0.26em] font-semibold transition-colors mt-0.5 ${
            isDark ? 'text-[#C49A3A]' : 'text-[#78716C] group-hover:text-[#191919]'
          }`}
        >
          Fine Wholesale Jewelry
        </span>
      )}
    </div>
  );
}
