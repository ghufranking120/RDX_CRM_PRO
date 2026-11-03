import React, { useState, useEffect } from 'react';
import {
  Send,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Users,
  Search,
  RefreshCw,
  BarChart2,
} from 'lucide-react';
import { Campaign } from '../../types';

export const AdminCampaignMonitoringSection: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllCampaigns = async () => {
    try {
      const token = localStorage.getItem('rdx_session_token');
      const res = await fetch('/api/campaigns', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data);
      }
    } catch {
      // Ignored
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCampaigns();
  }, []);

  const totalDispatched = campaigns.reduce((acc, c) => acc + (c.deliveredCount || 0), 0);
  const totalFailed = campaigns.reduce((acc, c) => acc + (c.failedCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#101D35] flex items-center gap-2">
            <span>Platform-wide Campaign & Broadcast Monitoring</span>
            <span className="text-xs bg-[#25D366]/10 text-[#128C7E] font-semibold px-2 py-0.5 rounded-full border border-[#25D366]/30">
              Meta WABA Watchdog
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor bulk message broadcasts across all tenant businesses, track deliverability rates, and detect policy violations.
          </p>
        </div>

        <button
          onClick={fetchAllCampaigns}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Broadcasts</span>
          <span className="text-2xl font-extrabold text-[#101D35] mt-1 block">{campaigns.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Messages Delivered</span>
          <span className="text-2xl font-extrabold text-[#25D366] mt-1 block">
            {totalDispatched.toLocaleString()}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Failed / Policy Blocks</span>
          <span className="text-2xl font-extrabold text-red-600 mt-1 block">{totalFailed}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Platform Health Score</span>
          <span className="text-2xl font-extrabold text-blue-600 mt-1 block">99.4%</span>
        </div>
      </div>

      {/* Campaigns Monitor Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-xs text-[#101D35] uppercase tracking-wider">Tenant Broadcast Queue</h3>
          <span className="text-xs text-slate-400">Live Meta throughput</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Tenant / Business</th>
                <th className="py-3 px-4">Meta Template</th>
                <th className="py-3 px-4">Recipients</th>
                <th className="py-3 px-4">Delivery Progress</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading campaign queues...
                  </td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No active broadcasts in flight.
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#101D35]">
                      <div>{c.name}</div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(c.createdAt).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {c.businessId === 'biz_01' ? 'TechCorp Logistics' : 'Apex Retail'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                      {c.templateName}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {c.totalRecipients.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#25D366]">{c.deliveredCount}</span>
                        <span className="text-slate-400">/ {c.totalRecipients}</span>
                        {c.totalRecipients > 0 && (
                          <span className="text-[10px] font-bold text-slate-500">
                            ({Math.round((c.deliveredCount / c.totalRecipients) * 100)}%)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          c.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'Sending'
                            ? 'bg-blue-100 text-blue-800 animate-pulse'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
