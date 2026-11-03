import React from 'react';
import {
  Users,
  Building,
  MessageSquare,
  DollarSign,
  Activity,
  ShieldCheck,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';
import { storageService, OFFICIAL_WHATSAPP_LINK } from '../../services/storage';

export const AdminOverviewSection: React.FC = () => {
  const users = storageService.getUsers();
  const businesses = storageService.getBusinesses();
  const logs = storageService.getAuditLogs();

  const totalMessagesSent = businesses.reduce((sum, b) => sum + b.messagesSentThisMonth, 0);

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h2 className="text-xl font-bold text-white">A. Platform Super Admin Overview</h2>
        <p className="text-xs text-slate-400">
          Global multi-tenant metrics, connected WhatsApp business nodes, and active platform audits.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Registered Users</span>
            <Users className="w-4 h-4 text-[#55B9F5]" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">{users.length}</div>
          <span className="text-[10px] text-emerald-400 font-semibold">Across all tenant roles</span>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Active Businesses</span>
            <Building className="w-4 h-4 text-[#55B9F5]" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">{businesses.length}</div>
          <span className="text-[10px] text-emerald-400 font-semibold">3 Connected WABA Accounts</span>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Platform Messages (MTD)</span>
            <MessageSquare className="w-4 h-4 text-[#25D366]" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            {totalMessagesSent.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">Verified Meta API throughput</span>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Platform MRR</span>
            <DollarSign className="w-4 h-4 text-[#55B9F5]" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">$307</div>
          <span className="text-[10px] text-emerald-400 font-semibold">Monthly subscription volume</span>
        </div>
      </div>

      {/* 2-Column Split: Business Tenant Status & Recent Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Businesses List */}
        <div className="lg:col-span-7 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="font-bold text-sm text-white">Registered Multi-Tenant Accounts</h3>

          <div className="divide-y divide-slate-800">
            {businesses.map((biz) => (
              <div key={biz.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-bold text-white">{biz.name}</h4>
                  <p className="text-[11px] font-mono text-slate-400">{biz.whatsappPhone}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-[#55B9F5] border border-slate-700">
                    {biz.planId}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    {biz.messagesSentThisMonth.toLocaleString()} / {biz.messageLimit.toLocaleString()} msgs
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Security & Health Status */}
        <div className="lg:col-span-5 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4 text-xs">
          <h3 className="font-bold text-sm text-white">System & Integration Status</h3>

          <div className="space-y-3">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Meta Cloud API v20.0</p>
                <p className="text-[10px] text-slate-400">Webhook ingress nominal</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase">Operational</span>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Gemini 3.8 Flash Assistant</p>
                <p className="text-[10px] text-slate-400">Server-side proxy ready</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase">Operational</span>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">n8n Automation Bridge</p>
                <p className="text-[10px] text-slate-400">Dispatch webhook enabled</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase">Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
