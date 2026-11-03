import React from 'react';
import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { storageService, OFFICIAL_WHATSAPP_LINK } from '../../services/storage';

interface OverviewSectionProps {
  onNavigateToSection: (sectionId: string) => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ onNavigateToSection }) => {
  const conversations = storageService.getConversations('biz_01');
  const contacts = storageService.getContacts('biz_01');
  const tasks = storageService.getFollowUpTasks();
  const deals = storageService.getPipelineDeals();

  const totalPipelineValue = deals.reduce((sum, d) => sum + (d.stage !== 'lost' ? d.value : 0), 0);
  const pendingTasks = tasks.filter((t) => !t.completed);

  return (
    <div className="space-y-8">
      {/* Top Banner: Connection & Health */}
      <div className="bg-[#101D35] text-white rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
            <h2 className="text-base font-bold">TechCorp Logistics · WhatsApp Live Node</h2>
          </div>
          <p className="text-xs text-slate-300">
            Official WhatsApp Cloud API Connected: <span className="font-mono text-[#55B9F5]">+1 (555) 019-2831</span> · Webhook Health: 100% Nominal
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToSection('inbox')}
            className="bg-[#55B9F5] hover:bg-[#38A9F3] text-[#101D35] font-semibold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm"
          >
            Open Live Inbox
          </button>
          <button
            onClick={() => onNavigateToSection('pipeline')}
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors border border-slate-700"
          >
            Sales Kanban
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Active Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-[#EAF6FF] text-[#101D35] flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-[#55B9F5]" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#101D35] font-mono tabular-nums">
              {conversations.length}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">3 unread customer messages</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total CRM Contacts</span>
            <div className="w-8 h-8 rounded-lg bg-[#EAF6FF] text-[#101D35] flex items-center justify-center">
              <Users className="w-4 h-4 text-[#55B9F5]" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#101D35] font-mono tabular-nums">
              {contacts.length}
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Synced across WhatsApp Inbound</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Open Pipeline Value</span>
            <div className="w-8 h-8 rounded-lg bg-[#EAF6FF] text-[#101D35] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#25D366]" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#101D35] font-mono tabular-nums">
              ${totalPipelineValue.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Across 5 qualified opportunities</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Avg. First Response</span>
            <div className="w-8 h-8 rounded-lg bg-[#EAF6FF] text-[#101D35] flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#55B9F5]" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#101D35] font-mono tabular-nums">1.4m</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Accelerated by AI suggestions</p>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Recent Conversations & Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent WhatsApp Chats */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#101D35]">Recent WhatsApp Inquiries</h3>
            <button
              onClick={() => onNavigateToSection('inbox')}
              className="text-xs text-[#55B9F5] hover:underline font-semibold flex items-center gap-1"
            >
              <span>View All Inbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => onNavigateToSection('inbox')}
                className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 p-2 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#101D35] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {c.contactName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#101D35] truncate">{c.contactName}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{c.lastMessageText}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block tabular-nums">{c.lastMessageTime}</span>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 mt-1 inline-block">
                    {c.leadStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Pending Follow-up Tasks */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#101D35]">Follow-up Tasks Due Today</h3>
            <button
              onClick={() => onNavigateToSection('tasks')}
              className="text-xs text-[#55B9F5] hover:underline font-semibold flex items-center gap-1"
            >
              <span>View Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {pendingTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-slate-800 leading-tight">{task.title}</span>
                  <span
                    className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      task.priority === 'urgent'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>For: {task.contactName}</span>
                  <span className="font-medium text-[#101D35]">{task.dueTime}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateToSection('tasks')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule New Follow-up</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
