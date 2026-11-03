import React, { useState } from 'react';
import { CreditCard, Save, Plus, Edit2, CheckCircle2, DollarSign } from 'lucide-react';
import { PlanConfig } from '../../types';
import { storageService } from '../../services/storage';

export const AdminPlansBillingSection: React.FC = () => {
  const [plans, setPlans] = useState<PlanConfig[]>(storageService.getPlans());
  const [editingPlan, setEditingPlan] = useState<PlanConfig | null>(null);
  const [saved, setSaved] = useState(false);

  const loadData = () => {
    setPlans(storageService.getPlans());
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    storageService.updatePlan(editingPlan);
    storageService.addAuditLog({
      actor: 'Ghufran King (Super Admin)',
      role: 'super_admin',
      action: 'UPDATE_PRICING_PLAN',
      target: `Updated plan: ${editingPlan.name} ($${editingPlan.priceMonthly}/mo)`,
      ipAddress: '127.0.0.1',
      status: 'Success',
    });
    setEditingPlan(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    loadData();
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">H. Subscription Plans & Tier Limits</h2>
          <p className="text-xs text-slate-400">
            Define pricing, monthly message allocations, and agent seats across public and tenant tiers.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Plan limits updated and synchronized to public website!</span>
        </div>
      )}

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((p) => (
          <div
            key={p.id}
            className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-white">{p.name}</h3>
                {p.popular && (
                  <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#55B9F5] text-[#101D35]">
                    Popular
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>

              <div className="pt-1">
                <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                  ${p.priceMonthly}
                </span>
                <span className="text-xs text-slate-400 ml-1">/ month</span>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl space-y-1 text-xs text-slate-300 font-mono">
                <div className="flex items-center justify-between">
                  <span>Messages / Mo:</span>
                  <span className="font-bold text-white">{p.messageLimit.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Agent Limit:</span>
                  <span className="font-bold text-white">{p.agentLimit} Seats</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => setEditingPlan(p)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#55B9F5]" />
                <span>Edit Limits & Price</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingPlan && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-700 space-y-4 text-white text-xs">
            <h3 className="font-bold text-base">Edit {editingPlan.name}</h3>

            <form onSubmit={handleSavePlan} className="space-y-3.5">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Plan Display Name</label>
                <input
                  type="text"
                  required
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Monthly Price ($)</label>
                  <input
                    type="number"
                    required
                    value={editingPlan.priceMonthly}
                    onChange={(e) => setEditingPlan({ ...editingPlan, priceMonthly: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Annual Price ($/mo)</label>
                  <input
                    type="number"
                    required
                    value={editingPlan.priceYearly}
                    onChange={(e) => setEditingPlan({ ...editingPlan, priceYearly: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Monthly Message Quota</label>
                  <input
                    type="number"
                    required
                    value={editingPlan.messageLimit}
                    onChange={(e) => setEditingPlan({ ...editingPlan, messageLimit: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Agent Seats Limit</label>
                  <input
                    type="number"
                    required
                    value={editingPlan.agentLimit}
                    onChange={(e) => setEditingPlan({ ...editingPlan, agentLimit: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#55B9F5] text-[#101D35] font-bold rounded-lg hover:bg-[#38A9F3]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
