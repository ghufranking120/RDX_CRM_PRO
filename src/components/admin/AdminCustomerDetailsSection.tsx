import React, { useState } from 'react';
import {
  Building,
  User,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Shield,
  HardDrive,
  BarChart2,
  Key,
  CreditCard,
  Edit,
  Save,
} from 'lucide-react';
import { storageService } from '../../services/storage';

export const AdminCustomerDetailsSection: React.FC = () => {
  const businesses = storageService.getBusinesses();
  const [selectedBizId, setSelectedBizId] = useState<string>(businesses[0]?.id || 'biz_01');
  const [isEditingLimits, setIsEditingLimits] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  const biz = businesses.find((b) => b.id === selectedBizId) || businesses[0];

  const [messageLimit, setMessageLimit] = useState(biz?.messageLimit || 25000);
  const [agentLimit, setAgentLimit] = useState(biz?.agentSeatsLimit || 10);

  const handleSaveLimits = () => {
    if (biz) {
      biz.messageLimit = messageLimit;
      biz.agentSeatsLimit = agentLimit;
      storageService.updateBusiness(biz);
      setIsEditingLimits(false);
      setActionMsg(`Limits updated for ${biz.name}.`);
      setTimeout(() => setActionMsg(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#101D35] flex items-center gap-2">
            <span>Customer Workspace Deep Dive</span>
            <span className="text-xs bg-[#25D366]/10 text-[#128C7E] font-semibold px-2 py-0.5 rounded-full border border-[#25D366]/30">
              Tenant Inspector
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Inspect individual customer tenant workspaces, Meta Cloud API credentials status, and enforce custom resource quotas.
          </p>
        </div>

        {/* Tenant Picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Select Customer:</span>
          <select
            value={selectedBizId}
            onChange={(e) => {
              setSelectedBizId(e.target.value);
              const b = businesses.find((x) => x.id === e.target.value);
              if (b) {
                setMessageLimit(b.messageLimit);
                setAgentLimit(b.agentSeatsLimit);
              }
            }}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-[#101D35] focus:outline-none focus:border-[#25D366]"
          >
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.planId})
              </option>
            ))}
          </select>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMsg}</span>
        </div>
      )}

      {biz && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Business Profile */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#101D35] text-white flex items-center justify-center font-bold text-lg">
                {biz.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#101D35]">{biz.name}</h3>
                <span className="text-[11px] text-slate-500 font-mono">{biz.ownerEmail}</span>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Subscription Tier:</span>
                <span className="font-bold text-[#101D35] uppercase bg-slate-100 px-2 py-0.5 rounded">
                  {biz.planId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Workspace Status:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{biz.status}</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Connected Phone:</span>
                <span className="font-mono text-slate-800">{biz.whatsappPhone || 'Not connected'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Member Since:</span>
                <span className="font-mono text-slate-600 text-[11px]">
                  {new Date(biz.connectedSince).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="font-bold text-[#101D35] block mb-2">Meta WhatsApp Integration:</span>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">WABA ID:</span>
                  <span className="text-slate-700">{biz.whatsappAccountId || 'WABA_019283719'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Access Token Status:</span>
                  <span className="text-emerald-700 font-sans font-semibold">Active & Encrypted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quota Management & Metrics */}
          <div className="lg:col-span-8 space-y-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#101D35]">Tenant Usage Quotas & Limits</h3>
                <button
                  onClick={() => setIsEditingLimits(!isEditingLimits)}
                  className="flex items-center gap-1 text-xs text-[#25D366] font-semibold hover:underline"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>{isEditingLimits ? 'Cancel' : 'Edit Quotas'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-semibold text-slate-600 block">Monthly Outbound Message Cap</span>
                  {isEditingLimits ? (
                    <input
                      type="number"
                      value={messageLimit}
                      onChange={(e) => setMessageLimit(parseInt(e.target.value) || 1000)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold"
                    />
                  ) : (
                    <span className="text-xl font-extrabold text-[#101D35] block font-mono">
                      {biz.messagesSentThisMonth.toLocaleString()} / {biz.messageLimit.toLocaleString()}
                    </span>
                  )}
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#25D366] rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round((biz.messagesSentThisMonth / biz.messageLimit) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-semibold text-slate-600 block">Agent Seats Quota</span>
                  {isEditingLimits ? (
                    <input
                      type="number"
                      value={agentLimit}
                      onChange={(e) => setAgentLimit(parseInt(e.target.value) || 2)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold"
                    />
                  ) : (
                    <span className="text-xl font-extrabold text-[#101D35] block font-mono">
                      {biz.agentSeatsUsed} / {biz.agentSeatsLimit} Seats
                    </span>
                  )}
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round((biz.agentSeatsUsed / biz.agentSeatsLimit) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {isEditingLimits && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleSaveLimits}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Quotas</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
