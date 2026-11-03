import React from 'react';
import { BarChart3, TrendingUp, Clock, Users, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const AnalyticsSection: React.FC = () => {
  const dailyData = [
    { day: 'Mon', inbound: 42, outbound: 86 },
    { day: 'Tue', inbound: 58, outbound: 114 },
    { day: 'Wed', inbound: 74, outbound: 142 },
    { day: 'Thu', inbound: 65, outbound: 128 },
    { day: 'Fri', inbound: 89, outbound: 165 },
    { day: 'Sat', inbound: 34, outbound: 48 },
    { day: 'Sun', inbound: 28, outbound: 35 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#101D35]">Analytics & Message Metrics</h2>
        <p className="text-xs text-slate-500">
          Measure conversation volume, agent productivity, and lead conversion rates.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Volume (30D)</span>
          <div className="text-3xl font-extrabold text-[#101D35] font-mono tabular-nums">4,210</div>
          <span className="text-[10px] text-emerald-600 font-semibold">+18.4% from previous month</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Avg First Response</span>
          <div className="text-3xl font-extrabold text-[#101D35] font-mono tabular-nums">1.4m</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Under 2 min target SLA</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Lead Conversion Rate</span>
          <div className="text-3xl font-extrabold text-[#101D35] font-mono tabular-nums">34.2%</div>
          <span className="text-[10px] text-slate-500">Inbound inquiry to qualified deal</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Resolution Rate</span>
          <div className="text-3xl font-extrabold text-[#101D35] font-mono tabular-nums">92.8%</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Resolved in first session</span>
        </div>
      </div>

      {/* Message Volume Chart Simulation */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#101D35]">7-Day Message Volume (Inbound vs Outbound)</h3>
            <p className="text-xs text-slate-400">Total verified WhatsApp message exchanges through Meta Cloud API</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#55B9F5]" />
              <span className="text-slate-600">Outbound Sent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#101D35]" />
              <span className="text-slate-600">Inbound Received</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div className="h-56 flex items-end justify-between gap-3 pt-6 border-b border-slate-100">
          {dailyData.map((d, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="w-full max-w-[48px] flex items-end justify-center gap-1.5 h-44">
                {/* Inbound bar */}
                <div
                  style={{ height: `${(d.inbound / 180) * 100}%` }}
                  className="w-1/2 bg-[#101D35] rounded-t-md transition-all duration-300 relative group"
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] bg-slate-900 text-white px-1 rounded pointer-events-none font-mono">
                    {d.inbound}
                  </span>
                </div>

                {/* Outbound bar */}
                <div
                  style={{ height: `${(d.outbound / 180) * 100}%` }}
                  className="w-1/2 bg-[#55B9F5] rounded-t-md transition-all duration-300 relative group"
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] bg-slate-900 text-white px-1 rounded pointer-events-none font-mono">
                    {d.outbound}
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-slate-600 font-mono">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h3 className="text-sm font-bold text-[#101D35]">Representative Performance Metrics</h3>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/60 text-[#101D35] font-bold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Representative</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Chats Handled</th>
              <th className="py-3 px-4">Avg Response Time</th>
              <th className="py-3 px-4">Deals Won</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50/50">
              <td className="py-3 px-4 font-bold text-[#101D35]">Marcus Vance</td>
              <td className="py-3 px-4 text-slate-600">Senior Representative</td>
              <td className="py-3 px-4 font-mono">184</td>
              <td className="py-3 px-4 font-mono font-semibold text-emerald-600">1.2m</td>
              <td className="py-3 px-4 font-mono font-bold text-[#101D35]">$66,500</td>
            </tr>
            <tr className="hover:bg-slate-50/50">
              <td className="py-3 px-4 font-bold text-[#101D35]">Sarah Jenkins</td>
              <td className="py-3 px-4 text-slate-600">Account Executive</td>
              <td className="py-3 px-4 font-mono">92</td>
              <td className="py-3 px-4 font-mono font-semibold text-emerald-600">1.6m</td>
              <td className="py-3 px-4 font-mono font-bold text-[#101D35]">$28,000</td>
            </tr>
            <tr className="hover:bg-slate-50/50">
              <td className="py-3 px-4 font-bold text-[#101D35]">Aisha Siddiqui</td>
              <td className="py-3 px-4 text-slate-600">Support Agent</td>
              <td className="py-3 px-4 font-mono">68</td>
              <td className="py-3 px-4 font-mono font-semibold text-emerald-600">1.8m</td>
              <td className="py-3 px-4 font-mono font-bold text-[#101D35]">—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
