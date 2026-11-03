import React from 'react';
import {
  HardDrive,
  Cpu,
  Users,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { storageService } from '../../services/storage';

export const AdminUsageLimitsSection: React.FC = () => {
  const businesses = storageService.getBusinesses();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#101D35] flex items-center gap-2">
          <span>Platform Usage Quotas & Limits Governance</span>
          <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-full">
            Quota Monitor
          </span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Global resource meters, tenant message thresholds, database storage limits, and overage detection.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Messages Sent This Month</span>
          <span className="text-2xl font-extrabold text-[#101D35] mt-1 block">
            {businesses.reduce((acc, b) => acc + (b.messagesSentThisMonth || 0), 0).toLocaleString()}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Allocated Message Pool</span>
          <span className="text-2xl font-extrabold text-blue-600 mt-1 block">
            {businesses.reduce((acc, b) => acc + (b.messageLimit || 0), 0).toLocaleString()}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Active Agent Seats</span>
          <span className="text-2xl font-extrabold text-[#25D366] mt-1 block">
            {businesses.reduce((acc, b) => acc + (b.agentSeatsUsed || 0), 0)} / {businesses.reduce((acc, b) => acc + (b.agentSeatsLimit || 0), 0)}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Tenants Near Quota</span>
          <span className="text-2xl font-extrabold text-amber-600 mt-1 block">0</span>
        </div>
      </div>

      {/* Tenant Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-xs text-[#101D35] uppercase tracking-wider">Tenant Quota Consumption</h3>
          <span className="text-xs text-slate-400">Refreshed live</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3 px-4">Business Tenant</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Outbound Messages</th>
                <th className="py-3 px-4">Usage %</th>
                <th className="py-3 px-4">Agent Seats</th>
                <th className="py-3 px-4">Quota Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {businesses.map((b) => {
                const pct = Math.min(100, Math.round((b.messagesSentThisMonth / b.messageLimit) * 100));
                return (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#101D35]">{b.name}</td>
                    <td className="py-3 px-4 uppercase font-bold text-slate-600 text-[10px]">{b.planId}</td>
                    <td className="py-3 px-4 font-mono">
                      {b.messagesSentThisMonth.toLocaleString()} / {b.messageLimit.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              pct > 90 ? 'bg-red-500' : pct > 75 ? 'bg-amber-500' : 'bg-[#25D366]'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-700">{pct}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {b.agentSeatsUsed} / {b.agentSeatsLimit}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Nominal</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
