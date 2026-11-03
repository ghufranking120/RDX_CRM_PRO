/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WhatsAppFloatingButton } from './components/common/WhatsAppFloatingButton';
import { PublicNavbar, PublicPageId } from './components/public/PublicNavbar';
import { PublicFooter } from './components/public/PublicFooter';

import { HomePage } from './components/public/pages/HomePage';
import { FeaturesPage } from './components/public/pages/FeaturesPage';
import { PricingPage } from './components/public/pages/PricingPage';
import { AboutPage } from './components/public/pages/AboutPage';
import { ContactPage } from './components/public/pages/ContactPage';
import { FaqPage } from './components/public/pages/FaqPage';
import { LoginPage } from './components/public/pages/LoginPage';
import { RegisterPage } from './components/public/pages/RegisterPage';
import { PrivacyPolicyPage } from './components/public/pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/public/pages/TermsOfServicePage';

import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { AdminLayout } from './components/admin/AdminLayout';

import { storageService } from './services/storage';

export type ActiveAppView = 'public' | 'dashboard' | 'admin';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveAppView>('public');
  const [publicPage, setPublicPage] = useState<PublicPageId>('home');

  // Sync with URL hash for persistent clean routing (#admin, #dashboard, #pricing, etc.)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'admin') {
        setActiveView('admin');
      } else if (hash === 'dashboard') {
        setActiveView('dashboard');
      } else if (
        ['home', 'features', 'pricing', 'about', 'contact', 'faq', 'login', 'register', 'privacy', 'terms'].includes(
          hash
        )
      ) {
        setActiveView('public');
        setPublicPage(hash as PublicPageId);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Initialize theme on mount
  useEffect(() => {
    const currentTheme = storageService.getTheme();
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, []);

  // Scroll to top on public page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [publicPage, activeView]);

  const handleNavigatePublic = (page: PublicPageId) => {
    setPublicPage(page);
    setActiveView('public');
    window.location.hash = `#${page}`;
  };

  const handleLoginSuccess = (view: 'dashboard' | 'admin') => {
    setActiveView(view);
    window.location.hash = `#${view}`;
  };

  const handleNavigateToAdmin = () => {
    setActiveView('admin');
    window.location.hash = '#admin';
  };

  const renderPublicPage = () => {
    switch (publicPage) {
      case 'home':
        return (
          <HomePage
            onNavigate={handleNavigatePublic}
            onOpenDashboard={() => {
              setActiveView('dashboard');
              window.location.hash = '#dashboard';
            }}
          />
        );
      case 'features':
        return (
          <FeaturesPage
            onNavigate={handleNavigatePublic}
            onOpenDashboard={() => {
              setActiveView('dashboard');
              window.location.hash = '#dashboard';
            }}
          />
        );
      case 'pricing':
        return <PricingPage onNavigate={handleNavigatePublic} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigatePublic} />;
      case 'contact':
        return <ContactPage />;
      case 'faq':
        return <FaqPage />;
      case 'login':
        return <LoginPage onNavigate={handleNavigatePublic} onLoginSuccess={handleLoginSuccess} />;
      case 'register':
        return (
          <RegisterPage
            onNavigate={handleNavigatePublic}
            onRegisterSuccess={() => {
              setActiveView('dashboard');
              window.location.hash = '#dashboard';
            }}
          />
        );
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsOfServicePage />;
      default:
        return (
          <HomePage
            onNavigate={handleNavigatePublic}
            onOpenDashboard={() => {
              setActiveView('dashboard');
              window.location.hash = '#dashboard';
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-white selection:bg-[#25D366]/20">
      {/* 1. PUBLIC WEBSITE AREA */}
      {activeView === 'public' && (
        <div className="flex-1 flex flex-col">
          <PublicNavbar
            currentPage={publicPage}
            onNavigate={handleNavigatePublic}
            onOpenDashboard={() => {
              setActiveView('dashboard');
              window.location.hash = '#dashboard';
            }}
          />

          <main className="flex-1">{renderPublicPage()}</main>

          <PublicFooter
            onNavigate={handleNavigatePublic}
            onNavigateToAdmin={handleNavigateToAdmin}
          />
        </div>
      )}

      {/* 2. CUSTOMER WORKSPACE DASHBOARD */}
      {activeView === 'dashboard' && (
        <DashboardLayout
          onLogout={() => {
            localStorage.removeItem('rdx_session_token');
            setActiveView('public');
            setPublicPage('login');
            window.location.hash = '#login';
          }}
          onNavigateToPublic={() => {
            setActiveView('public');
            window.location.hash = '#home';
          }}
        />
      )}

      {/* 3. SUPER ADMIN CONSOLE (Protected by server-side verification) */}
      {activeView === 'admin' && (
        <AdminLayout
          onLogout={() => {
            localStorage.removeItem('rdx_session_token');
            setActiveView('public');
            setPublicPage('home');
            window.location.hash = '#home';
          }}
          onNavigateToPublic={() => {
            setActiveView('public');
            window.location.hash = '#home';
          }}
          onNavigateToDashboard={() => {
            setActiveView('dashboard');
            window.location.hash = '#dashboard';
          }}
        />
      )}

      {/* 4. Global Floating WhatsApp Button (links directly to https://wa.me/923138066389) */}
      <WhatsAppFloatingButton />
    </div>
  );
}
