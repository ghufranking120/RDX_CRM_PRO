import React from 'react';

interface RdxLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'auto';
  showTagline?: boolean;
}

export const RdxLogo: React.FC<RdxLogoProps> = ({
  size = 'md',
  variant = 'auto',
  showTagline = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const isDark = variant === 'dark';

  return (
    <div className="flex items-center gap-2.5 group select-none">
      <div
        className={`relative ${iconSizes[size]} rounded-xl bg-[#101D35] flex items-center justify-center shadow-sm overflow-hidden shrink-0 border border-slate-700/30 transition-transform duration-200 group-hover:scale-105`}
      >
        {/* Subtle geometric gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#55B9F5]/25 via-transparent to-transparent pointer-events-none" />

        {/* Crisp Stylized RDX Monogram with WhatsApp Node Accent */}
        <svg
          viewBox="0 0 32 32"
          className="w-5/6 h-5/6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main R Shape */}
          <path
            d="M8 8H16C18.2 8 20 9.8 20 12C20 14.2 18.2 16 16 16H8V8Z"
            stroke="#55B9F5"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Diagonal leg */}
          <path
            d="M15 16L21 24"
            stroke="#55B9F5"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Stem */}
          <path
            d="M8 8V24"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Live WhatsApp connectivity node */}
          <circle cx="23" cy="9" r="2.5" fill="#25D366" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-extrabold tracking-tight ${textSizes[size]} ${
              isDark ? 'text-white' : 'text-[#101D35]'
            }`}
          >
            RDX<span className="text-[#55B9F5] font-light ml-0.5">CRM</span>
          </span>
          <span className="text-[9px] uppercase tracking-wider font-bold bg-[#EAF6FF] text-[#101D35] px-1.5 py-0.5 rounded border border-[#55B9F5]/30">
            PRO
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-slate-500 font-medium tracking-tight mt-0.5">
            Smart Conversations. Better Relationships.
          </span>
        )}
      </div>
    </div>
  );
};
