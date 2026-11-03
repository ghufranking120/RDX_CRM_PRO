import React, { useState } from 'react';
import { Building, ShieldCheck, Phone, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { BusinessTenant } from '../../types';
import { storageService } from '../../services/storage';

export const AdminBusinessManagementSection: React.FC = () => {
  const [businesses, setBusinesses] = useState<BusinessTenant[]>(storageService.getBusinesses());

  const loadData = () => {
    setBusinesses(storageService.getBusinesses());
  };

  const handleToggleFeature = (biz: BusinessTenant, featureKey: keyof BusinessTenant['features']) => {
    const updated: BusinessTenant = {
      ...biz,
      features: {
        ...biz.features,
        [featureKey]: !biz.features[featureKey],
      },
    };
    storageService.updateBusiness(updated);
    loadData();
  };

  const handleToggleStatus = (biz: BusinessTenant) => {
    const newStatus = biz.status === 'active' ? 'suspended' : 'active';
    const updated: BusinessTenant = { ...biz, status: newStatus };
    storageService.updateBusiness(updated);
    storageService.addAuditLog({
      actor: 'Ghufran King (Super Admin)',
      role: 'super_admin',
      action: 'TOGGLE_BUSINESS_STATUS',
      target: `${biz.name} (${newStatus})`,
      ipAddress: '127.0.0.1',
      status: 'Success',
    });
    loadData();
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-xl font-bold text-white">C. Multi-Tenant Business Management</h2>
        <p className="text-xs text-slate-400">
          Enforce strict data boundary isolation, manage plan tiers, and toggle tenant feature flags.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {businesses.map((biz) => (
          <div
            key={biz.id}
            className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-white">{biz.name}</h3>
                  <p className="text-xs font-mono text-slate-400">{biz.whatsappPhone}</p>
                </div>
                <span
                  className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                    biz.status === 'active'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {biz.status}
                </span>
              </div>

              <div className="p-3 bg-slate-800/70 rounded-xl space-y-1 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Plan Tier:</span>
                  <span className="font-bold uppercase text-[#55B9F5]">{biz.planId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Messages Used:</span>
                  <span className="font-mono text-white">
                    {biz.messagesSentThisMonth.toLocaleString()} / {biz.messageLimit.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Agent Seats:</span>
                  <span className="font-mono text-white">
                    {biz.agentSeatsUsed} / {biz.agentSeatsLimit}
                  </span>
                </div>
              </div>

              {/* Feature Flags Toggle Strip */}
              <div className="space-y-2 pt-1 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Tenant Feature Entitlements
                </span>
                <div className="space-y-1.5">
                  {(['aiReplies', 'pipeline', 'webhooks', 'customTemplates'] as const).map((feat) => {
                    const isEnabled = biz.features[feat];
                    return (
                      <div
                        key={feat}
                        onClick={() => handleToggleFeature(biz, feat)}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 cursor-pointer transition-colors text-[11px]"
                      >
                        <span className="capitalize text-slate-300">{feat.replace(/([A-Z])/g, ' $1')}</span>
                        <span
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                            isEnabled ? 'bg-emerald-500 text-slate-900' : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {isEnabled ? '✓' : '—'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-500 font-mono">ID: {biz.id}</span>
              <button
                onClick={() => handleToggleStatus(biz)}
                className={`px-3 py-1 rounded-lg font-semibold text-xs transition-colors ${
                  biz.status === 'active'
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
                    : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {biz.status === 'active' ? 'Suspend Tenant' : 'Activate Tenant'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
