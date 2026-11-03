import React, { useState } from 'react';
import { RdxLogo } from '../common/RdxLogo';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Send,
  Radio,
  Bot,
  Sparkles,
  Cpu,
  Target,
  CalendarCheck,
  Calendar,
  BarChart3,
  UserCheck,
  Webhook,
  CreditCard,
  Settings,
  HelpCircle,
  Menu,
  X,
  LogOut,
  Building,
  ShieldCheck,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';

import { OverviewSection } from './OverviewSection';
import { WhatsAppInboxSection } from './WhatsAppInboxSection';
import { ContactsSection } from './ContactsSection';
import { CampaignsSection } from './CampaignsSection';
import { BroadcastSection } from './BroadcastSection';
import { ChatbotBuilderSection } from './ChatbotBuilderSection';
import { AiAssistantSection } from './AiAssistantSection';
import { AutomationWorkflowsSection } from './AutomationWorkflowsSection';
import { SalesPipelineSection } from './SalesPipelineSection';
import { FollowUpTasksSection } from './FollowUpTasksSection';
import { AppointmentsSection } from './AppointmentsSection';
import { AnalyticsSection } from './AnalyticsSection';
import { TeamMembersSection } from './TeamMembersSection';
import { IntegrationsSection } from './IntegrationsSection';
import { SubscriptionBillingSection } from './SubscriptionBillingSection';
import { AccountSettingsSection } from './AccountSettingsSection';
import { HelpSupportSection } from './HelpSupportSection';

import { storageService, OFFICIAL_WHATSAPP_LINK } from '../../services/storage';

export type DashboardSectionId =
  | 'overview'
  | 'inbox'
  | 'contacts'
  | 'campaigns'
  | 'broadcast'
  | 'chatbot'
  | 'ai'
  | 'automation'
  | 'leads'
  | 'tasks'
  | 'appointments'
  | 'analytics'
  | 'team'
  | 'integrations'
  | 'billing'
  | 'settings'
  | 'help';

interface DashboardLayoutProps {
  onLogout: () => void;
  onNavigateToPublic: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  onLogout,
  onNavigateToPublic,
}) => {
  const [currentSection, setCurrentSection] = useState<DashboardSectionId>('inbox');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const currentUser = storageService.getCurrentUser();

  const navItems: {
    id: DashboardSectionId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    { id: 'overview', label: '1. Overview', icon: LayoutDashboard },
    { id: 'inbox', label: '2. WhatsApp Inbox', icon: MessageSquare, badge: 'Live' },
    { id: 'contacts', label: '3. Contacts', icon: Users },
    { id: 'campaigns', label: '4. Campaigns', icon: Send },
    { id: 'broadcast', label: '5. Broadcast', icon: Radio },
    { id: 'chatbot', label: '6. Chatbot Builder', icon: Bot, badge: 'Flow' },
    { id: 'ai', label: '7. AI Assistant', icon: Sparkles },
    { id: 'automation', label: '8. Automation', icon: Cpu },
    { id: 'leads', label: '9. Leads & Pipeline', icon: Target },
    { id: 'tasks', label: '10. Tasks', icon: CalendarCheck },
    { id: 'appointments', label: '11. Appointments', icon: Calendar },
    { id: 'analytics', label: '12. Analytics', icon: BarChart3 },
    { id: 'team', label: '13. Team Members', icon: UserCheck },
    { id: 'integrations', label: '14. Integrations', icon: Webhook },
    { id: 'billing', label: '15. Subscription & Billing', icon: CreditCard },
    { id: 'settings', label: '16. Settings', icon: Settings },
    { id: 'help', label: '17. Help & Support', icon: HelpCircle },
  ];

  const renderActiveSection = () => {
    switch (currentSection) {
      case 'overview':
        return <OverviewSection onNavigateToSection={(s) => setCurrentSection(s as DashboardSectionId)} />;
      case 'inbox':
        return <WhatsAppInboxSection />;
      case 'contacts':
        return <ContactsSection />;
      case 'campaigns':
        return <CampaignsSection />;
      case 'broadcast':
        return <BroadcastSection />;
      case 'chatbot':
        return <ChatbotBuilderSection />;
      case 'ai':
        return <AiAssistantSection />;
      case 'automation':
        return <AutomationWorkflowsSection />;
      case 'leads':
        return <SalesPipelineSection />;
      case 'tasks':
        return <FollowUpTasksSection />;
      case 'appointments':
        return <AppointmentsSection />;
      case 'analytics':
        return <AnalyticsSection />;
      case 'team':
        return <TeamMembersSection />;
      case 'integrations':
        return <IntegrationsSection />;
      case 'billing':
        return <SubscriptionBillingSection />;
      case 'settings':
        return <AccountSettingsSection />;
      case 'help':
        return <HelpSupportSection />;
      default:
        return <WhatsAppInboxSection />;
    }
  };

  const handleSelectNav = (id: DashboardSectionId) => {
    setCurrentSection(id);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#F7F9FA] overflow-hidden text-slate-800 antialiased font-sans">
      {/* 1. Desktop & Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E5E9ED] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[#E5E9ED] flex items-center justify-between">
          <div onClick={onNavigateToPublic} className="cursor-pointer">
            <RdxLogo size="sm" />
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Tenant Identifier */}
        <div className="px-4 py-3 bg-[#F7F9FA] border-b border-[#E5E9ED]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#101D35] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              <Building className="w-4 h-4 text-[#55B9F5]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-[#101D35] truncate block">
                {currentUser?.businessName || 'Business Workspace'}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                <span>Meta API Ready</span>
              </span>
            </div>
          </div>
        </div>

        {/* 18 Sidebar Nav Items (Scrollable) */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectNav(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all text-left ${
                  isActive
                    ? 'bg-[#25D366]/10 text-[#128C7E] font-bold shadow-xs'
                    : 'text-slate-600 hover:text-[#101D35] hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#25D366]' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-[#25D366] text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* 18. Logout & User Footer */}
        <div className="p-3 border-t border-[#E5E9ED] bg-white space-y-2">
          <div className="flex items-center justify-between px-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-[#101D35] truncate block">
                  {currentUser?.name || 'Customer Agent'}
                </span>
                <span className="text-[10px] text-slate-400 truncate block">
                  {currentUser?.role || 'Business Admin'}
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
              title="18. Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E5E9ED] px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-[#101D35]">Customer Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="capitalize font-medium text-slate-700">
                {currentSection.replace('-', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={OFFICIAL_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded-lg text-xs font-semibold transition-colors border border-[#25D366]/30"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Official WhatsApp Help</span>
            </a>

            <button
              onClick={onNavigateToPublic}
              className="text-xs font-semibold text-slate-600 hover:text-[#101D35] px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Public Site
            </button>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{renderActiveSection()}</div>
        </main>
      </div>
    </div>
  );
};
