import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ArrowRight, ShieldCheck, Download, Zap, X } from 'lucide-react';
import { storageService, OFFICIAL_WHATSAPP_LINK } from '../../services/storage';

export const SubscriptionBillingSection: React.FC = () => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'growth' | 'enterprise'>('enterprise');
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  const plans = storageService.getPlans();
  const currentPlan = plans.find((p) => p.id === 'growth') || plans[1];

  const invoices = [
    { id: 'INV-2026-003', date: 'Mar 01, 2026', amount: '$79.00', status: 'Paid', method: 'Visa •••• 4242' },
    { id: 'INV-2026-002', date: 'Feb 01, 2026', amount: '$79.00', status: 'Paid', method: 'Visa •••• 4242' },
    { id: 'INV-2026-001', date: 'Jan 01, 2026', amount: '$79.00', status: 'Paid', method: 'Visa •••• 4242' },
  ];

  const handleUpgradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUpgradeSuccess(true);
    setTimeout(() => {
      setShowUpgradeModal(false);
      setUpgradeSuccess(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#101D35]">Subscription & Resource Quotas</h2>
          <p className="text-xs text-slate-500">
            Monitor your monthly WhatsApp message throughput, agent seat allocations, and payment receipts.
          </p>
        </div>

        <button
          onClick={() => setShowUpgradeModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#55B9F5] hover:bg-[#38A9F3] text-[#101D35] text-xs font-bold transition-colors shadow-xs"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Upgrade Tier</span>
        </button>
      </div>

      {/* Plan Card & Meter Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Tier summary */}
        <div className="lg:col-span-5 bg-[#101D35] text-white p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#55B9F5] text-[#101D35]">
              Active Plan
            </span>
            <span className="text-xs font-mono text-slate-400">Next renewal: Apr 01, 2026</span>
          </div>

          <div>
            <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
            <p className="text-xs text-slate-300 mt-1">{currentPlan.description}</p>
          </div>

          <div className="pt-1">
            <span className="text-4xl font-extrabold font-mono tabular-nums">${currentPlan.priceMonthly}</span>
            <span className="text-xs text-slate-400 ml-1">/ month</span>
          </div>

          <div className="pt-2 border-t border-slate-700/80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span>Card on File:</span>
              <span className="font-mono text-white">Visa ending in 4242</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Billing Address:</span>
              <span className="text-white">New York, NY</span>
            </div>
          </div>
        </div>

        {/* Right: Usage Quota Meters */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="font-bold text-sm text-[#101D35]">Monthly Resource Consumption</h3>

          {/* Meter 1: WhatsApp Messages */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">WhatsApp Messages Sent</span>
              <span className="font-mono text-slate-500">
                <strong className="text-[#101D35]">4,210</strong> / 12,000 (35.0%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div style={{ width: '35%' }} className="h-full bg-[#55B9F5] rounded-full" />
            </div>
            <p className="text-[10px] text-slate-400">Resets on the 1st of next month. Overage protected.</p>
          </div>

          {/* Meter 2: Agent Seats */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Team Agent Seats</span>
              <span className="font-mono text-slate-500">
                <strong className="text-[#101D35]">4</strong> / 10 seats assigned
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div style={{ width: '40%' }} className="h-full bg-[#101D35] rounded-full" />
            </div>
            <p className="text-[10px] text-slate-400">6 additional agent seats available to invite.</p>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h3 className="text-sm font-bold text-[#101D35]">Billing History & Official Receipts</h3>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/60 text-[#101D35] font-bold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Invoice ID</th>
              <th className="py-3 px-4">Billing Date</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-mono font-bold text-[#101D35]">{inv.id}</td>
                <td className="py-3 px-4 text-slate-600">{inv.date}</td>
                <td className="py-3 px-4 font-mono font-bold text-[#101D35]">{inv.amount}</td>
                <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{inv.method}</td>
                <td className="py-3 px-4">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {inv.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => alert(`Downloading verified receipt for ${inv.id}`)}
                    className="p-1 text-slate-500 hover:text-[#55B9F5] transition-colors"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* UPGRADE MODAL */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#101D35]">Upgrade Subscription Tier</h3>
              <button onClick={() => setShowUpgradeModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {upgradeSuccess ? (
              <div className="text-center py-8 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-[#101D35]">Plan Upgraded to Enterprise</h4>
                <p className="text-xs text-slate-500">Your message limit is now 60,000 msgs/month.</p>
              </div>
            ) : (
              <form onSubmit={handleUpgradeSubmit} className="space-y-4 text-xs">
                <p className="text-slate-600">
                  Select your new plan. Upgrades take effect immediately with pro-rated billing.
                </p>

                <div className="space-y-2">
                  <label
                    onClick={() => setSelectedPlan('enterprise')}
                    className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedPlan === 'enterprise'
                        ? 'border-[#55B9F5] bg-[#EAF6FF] text-[#101D35] font-bold shadow-xs'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">Enterprise Scale</span>
                      <span className="font-mono text-sm font-extrabold">$199 / mo</span>
                    </div>
                    <p className="text-xs text-slate-600 font-normal mt-1">
                      60,000 WhatsApp messages · 35 agent seats · Dedicated account engineer
                    </p>
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowUpgradeModal(false)}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#55B9F5] hover:bg-[#38A9F3] text-[#101D35] rounded-lg font-bold"
                  >
                    Confirm Enterprise Upgrade
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
