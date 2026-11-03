import React, { useState } from 'react';
import { RdxLogo } from '../common/RdxLogo';
import {
  LayoutDashboard,
  Building,
  FileSearch,
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Key,
  Bot,
  Radio,
  Sliders,
  HelpCircle,
  Bell,
  Globe,
  Tag,
  Settings,
  ShieldCheck,
  Database,
  User,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

import { AdminOverviewSection } from './AdminOverviewSection';
import { AdminBusinessManagementSection } from './AdminBusinessManagementSection';
import { AdminCustomerDetailsSection } from './AdminCustomerDetailsSection';
import { AdminUserManagementSection } from './AdminUserManagementSection';
import { AdminPlansBillingSection } from './AdminPlansBillingSection';
import { AdminRevenueAnalyticsSection } from './AdminRevenueAnalyticsSection';
import { AdminIntegrationsSection } from './AdminIntegrationsSection';
import { AdminAiConfigSection } from './AdminAiConfigSection';
import { AdminCampaignMonitoringSection } from './AdminCampaignMonitoringSection';
import { AdminUsageLimitsSection } from './AdminUsageLimitsSection';
import { AdminSupportTicketsSection } from './AdminSupportTicketsSection';
import { AdminNotificationsSection } from './AdminNotificationsSection';
import { AdminWebsiteContentSection } from './AdminWebsiteContentSection';
import { AdminCouponsSection } from './AdminCouponsSection';
import { AdminPlatformSettingsSection } from './AdminPlatformSettingsSection';
import { AdminSecurityAuditSection } from './AdminSecurityAuditSection';
import { AdminBackupMaintenanceSection } from './AdminBackupMaintenanceSection';
import { AdminProfileSection } from './AdminProfileSection';
import { AdminLoginPage } from './AdminLoginPage';

import { storageService, OFFICIAL_WHATSAPP_LINK } from '../../services/storage';

export type AdminNavId =
  | 'overview'
  | 'customers'
  | 'customer_details'
  | 'users'
  | 'plans'
  | 'payments'
  | 'revenue'
  | 'whatsapp'
  | 'api_config'
  | 'ai_config'
  | 'campaigns'
  | 'usage'
  | 'support'
  | 'notifications'
  | 'content'
  | 'coupons'
  | 'system'
  | 'audit'
  | 'backup'
  | 'profile';

interface AdminLayoutProps {
  onLogout: () => void;
  onNavigateToPublic: () => void;
  onNavigateToDashboard: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  onLogout,
  onNavigateToPublic,
  onNavigateToDashboard,
}) => {
  const [currentNav, setCurrentNav] = useState<AdminNavId>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentUser = storageService.getCurrentUser();

  // Enforce server-side / role authorization check
  const isSuperAdmin =
    currentUser &&
    (currentUser.role === 'Platform Super Admin' || currentUser.role === 'super_admin');

  if (!isSuperAdmin) {
    return (
      <AdminLoginPage
        onLoginSuccess={() => setCurrentNav('overview')}
        onBackToPublic={onNavigateToPublic}
      />
    );
  }

  // 21 Navigation Items (20 sections + Logout)
  const navItems: {
    id: AdminNavId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    category?: string;
  }[] = [
    { id: 'overview', label: '1. Dashboard Overview', icon: LayoutDashboard },
    { id: 'customers', label: '2. All Customers', icon: Building },
    { id: 'customer_details', label: '3. Customer Details', icon: FileSearch },
    { id: 'users', label: '4. User Accounts', icon: Users },
    { id: 'plans', label: '5. Subscription Plans', icon: CreditCard },
    { id: 'payments', label: '6. Payments & Invoices', icon: DollarSign },
    { id: 'revenue', label: '7. Revenue Analytics', icon: TrendingUp },
    { id: 'whatsapp', label: '8. WhatsApp API Hub', icon: MessageSquare },
    { id: 'api_config', label: '9. API Configuration', icon: Key },
    { id: 'ai_config', label: '10. AI Configuration', icon: Bot },
    { id: 'campaigns', label: '11. Campaign Monitoring', icon: Radio },
    { id: 'usage', label: '12. Usage & Limits', icon: Sliders },
    { id: 'support', label: '13. Support Tickets', icon: HelpCircle },
    { id: 'notifications', label: '14. Notifications', icon: Bell },
    { id: 'content', label: '15. Website Content CMS', icon: Globe },
    { id: 'coupons', label: '16. Coupons & Discounts', icon: Tag },
    { id: 'system', label: '17. System Settings', icon: Settings },
    { id: 'audit', label: '18. Security & Activity Logs', icon: ShieldCheck },
    { id: 'backup', label: '19. Backup & Database Status', icon: Database },
    { id: 'profile', label: '20. Admin Profile', icon: User },
  ];

  const renderSection = () => {
    switch (currentNav) {
      case 'overview':
        return <AdminOverviewSection />;
      case 'customers':
        return <AdminBusinessManagementSection />;
      case 'customer_details':
        return <AdminCustomerDetailsSection />;
      case 'users':
        return <AdminUserManagementSection />;
      case 'plans':
        return <AdminPlansBillingSection />;
      case 'payments':
      case 'revenue':
        return <AdminRevenueAnalyticsSection />;
      case 'whatsapp':
      case 'api_config':
        return <AdminIntegrationsSection />;
      case 'ai_config':
        return <AdminAiConfigSection />;
      case 'campaigns':
        return <AdminCampaignMonitoringSection />;
      case 'usage':
        return <AdminUsageLimitsSection />;
      case 'support':
        return <AdminSupportTicketsSection />;
      case 'notifications':
        return <AdminNotificationsSection />;
      case 'content':
        return <AdminWebsiteContentSection />;
      case 'coupons':
        return <AdminCouponsSection />;
      case 'system':
        return <AdminPlatformSettingsSection />;
      case 'audit':
        return <AdminSecurityAuditSection />;
      case 'backup':
        return <AdminBackupMaintenanceSection />;
      case 'profile':
        return <AdminProfileSection />;
      default:
        return <AdminOverviewSection />;
    }
  };

  const handleSelectNav = (id: AdminNavId) => {
    setCurrentNav(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#F7F9FA] overflow-hidden text-slate-800 antialiased font-sans">
      {/* 1. Super Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#111B21] text-white flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static border-r border-slate-800 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div onClick={onNavigateToPublic} className="cursor-pointer">
            <RdxLogo size="sm" variant="dark" />
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Super Admin Status Banner */}
        <div className="px-4 py-3 bg-[#0B141A] border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-950/80 text-red-400 border border-red-700/60 flex items-center justify-center font-bold text-xs shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-white truncate block">Super Admin Portal</span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                <span>Root Governance</span>
              </span>
            </div>
          </div>
        </div>

        {/* 20 Admin Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectNav(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all text-left ${
                  isActive
                    ? 'bg-[#25D366] text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-slate-950' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* 21. Logout & Admin Profile Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#0B141A] space-y-2">
          <div className="flex items-center justify-between px-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-xs shrink-0">
                {currentUser?.name?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white truncate block">
                  {currentUser?.name || 'Super Admin'}
                </span>
                <span className="text-[10px] text-slate-400 truncate block">Platform Root</span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-950/40 transition-colors"
              title="21. Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E5E9ED] px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-[#101D35]">Super Admin Console</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="capitalize font-medium text-slate-700">
                {currentNav.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToDashboard}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors flex items-center gap-1.5"
            >
              <span>View Customer Inbox</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              onClick={onNavigateToPublic}
              className="text-xs font-semibold text-slate-600 hover:text-[#101D35] px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Public Site
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{renderSection()}</div>
        </main>
      </div>
    </div>
  );
};
