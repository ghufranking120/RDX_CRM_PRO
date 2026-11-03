import React from 'react';
import { LayoutDashboard, ShieldCheck, Globe, MessageSquare, ArrowUpRight } from 'lucide-react';
import { OFFICIAL_WHATSAPP_LINK, OFFICIAL_WHATSAPP_NUMBER } from '../../services/storage';

export type ActiveAppView = 'public' | 'dashboard' | 'admin';

interface PlatformSwitcherProps {
  currentView: ActiveAppView;
  onViewChange: (view: ActiveAppView) => void;
  publicPage?: string;
}

export const PlatformSwitcher: React.FC<PlatformSwitcherProps> = ({
  currentView,
  onViewChange,
}) => {
  return (
    <div className="bg-[#101D35] text-white border-b border-slate-800 text-xs py-2 px-4 select-none shrink-0 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: View Mode Segmented Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium hidden md:inline">Mode:</span>
          <div className="flex items-center p-0.5 bg-slate-900/90 rounded-lg border border-slate-700/60">
            <button
              onClick={() => onViewChange('public')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
                currentView === 'public'
                  ? 'bg-[#55B9F5] text-[#101D35] shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </button>

            <button
              onClick={() => onViewChange('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
                currentView === 'dashboard'
                  ? 'bg-[#55B9F5] text-[#101D35] shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Customer Dashboard</span>
            </button>

            <button
              onClick={() => onViewChange('admin')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
                currentView === 'admin'
                  ? 'bg-[#55B9F5] text-[#101D35] shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin</span>
            </button>
          </div>
        </div>

        {/* Right: Official WhatsApp Contact Info */}
        <div className="flex items-center gap-4 text-slate-300">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-400">WhatsApp:</span>
            <span className="font-mono text-white font-medium">{OFFICIAL_WHATSAPP_NUMBER}</span>
          </div>

          <a
            href={OFFICIAL_WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors"
          >
            <MessageSquare className="w-3 h-3 fill-white" />
            <span>Chat on WhatsApp</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
