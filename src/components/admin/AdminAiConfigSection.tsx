import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Save,
  CheckCircle2,
  Cpu,
  Key,
  Shield,
  Layers,
  Sliders,
} from 'lucide-react';

export const AdminAiConfigSection: React.FC = () => {
  const [model, setModel] = useState('gemini-2.5-flash');
  const [temperature, setTemperature] = useState('0.4');
  const [monthlyTokenQuota, setMonthlyTokenQuota] = useState('5000000');
  const [maxOutputTokens, setMaxOutputTokens] = useState('512');
  const [platformSystemPrompt, setPlatformSystemPrompt] = useState(
    'You are the official customer service intelligence for RDX CRM PRO businesses. Respond professionally, accurately, and assist users concisely via WhatsApp.'
  );
  const [actionMsg, setActionMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setActionMsg('AI Configuration updated and applied to all tenant inference pipelines.');
    setTimeout(() => setActionMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#101D35] flex items-center gap-2">
            <span>Gemini AI Engine & Platform Configuration</span>
            <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-full">
              Enterprise LLM
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure default generative model parameters, multi-tenant quota caps, and customer response safety boundaries.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save AI Settings</span>
        </button>
      </div>

      {actionMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Model & Tuning Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-sm text-[#101D35] flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-500" />
            <span>LLM Model & Latency Optimization</span>
          </h3>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Default Gemini Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#25D366] font-mono"
            >
              <option value="gemini-2.5-flash">gemini-2.5-flash (Recommended: Sub-second WhatsApp latency)</option>
              <option value="gemini-2.5-pro">gemini-2.5-pro (High complex reasoning & enterprise logic)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Temperature ({temperature})</label>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full accent-[#25D366]"
              />
              <span className="text-[10px] text-slate-400">Lower = More precise fact-based replies</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Max Output Tokens</label>
              <input
                type="number"
                value={maxOutputTokens}
                onChange={(e) => setMaxOutputTokens(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#25D366]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Monthly Platform Token Quota</label>
            <input
              type="text"
              value={monthlyTokenQuota}
              onChange={(e) => setMonthlyTokenQuota(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-[#25D366]"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Shared quota across all active tenant customer workspaces.</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-sm text-[#101D35] flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Master System Prompt & Safeguards</span>
          </h3>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Platform Master Prompt</label>
            <textarea
              rows={4}
              value={platformSystemPrompt}
              onChange={(e) => setPlatformSystemPrompt(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#25D366] leading-relaxed"
            />
          </div>

          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-1">
            <span className="font-bold text-purple-900 block">Automatic Human Handover Triggers:</span>
            <p className="text-purple-700 text-[11px] leading-relaxed">
              When angry customer sentiment, payment disputes, or high-value refund requests are detected, the AI engine halts automated responses and transfers the conversation to human staff.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
