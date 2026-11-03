import React, { useState } from 'react';
import { RdxLogo } from '../common/RdxLogo';
import { Menu, X, ArrowRight, MessageSquare } from 'lucide-react';
import { OFFICIAL_WHATSAPP_LINK } from '../../services/storage';

export type PublicPageId =
  | 'home'
  | 'features'
  | 'pricing'
  | 'about'
  | 'contact'
  | 'faq'
  | 'login'
  | 'register'
  | 'privacy'
  | 'terms';

interface PublicNavbarProps {
  currentPage: PublicPageId;
  onNavigate: (page: PublicPageId) => void;
  onOpenDashboard: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenDashboard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PublicPageId; label: string }[] = [
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'about', label: 'About Us' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: PublicPageId) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Brand Wordmark */}
        <div
          onClick={() => handleNavClick('home')}
          className="cursor-pointer whitespace-nowrap shrink-0"
        >
          <RdxLogo size="md" />
        </div>

        {/* Clean Single-line Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`hover:text-[#101D35] transition-colors py-1 whitespace-nowrap shrink-0 relative ${
                currentPage === item.id
                  ? 'text-[#101D35] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#25D366]'
                  : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Primary Action Buttons */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <a
            href={OFFICIAL_WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#25D366] px-3 py-2 rounded-xl transition-colors border border-slate-200 hover:border-[#25D366]/40"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={() => handleNavClick('login')}
            className="text-xs font-bold text-slate-700 hover:text-[#101D35] px-3 py-2 rounded-xl transition-colors"
          >
            Customer Login
          </button>

          <button
            onClick={() => handleNavClick('register')}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] px-4 py-2.5 rounded-xl transition-colors shadow-xs"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-[#101D35] rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2 text-sm font-semibold text-slate-700">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-3 py-2 rounded-lg transition-colors ${
                  currentPage === item.id ? 'bg-[#25D366]/10 text-[#128C7E] font-bold' : 'hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('login')}
              className="w-full text-center py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-700"
            >
              Customer Login
            </button>
            <button
              onClick={() => handleNavClick('register')}
              className="w-full text-center py-2.5 rounded-xl bg-[#25D366] text-white font-bold text-xs"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
