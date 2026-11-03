import React, { useState } from 'react';
import {
  Send,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Sparkles,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { OFFICIAL_WHATSAPP_LINK } from '../../services/storage';

export const BroadcastSection: React.FC = () => {
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('all');
  const [selectedTag, setSelectedTag] = useState('Wholesale');
  const [hasOptInConsent, setHasOptInConsent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [resultMsg, setResultMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const audienceEstimates: Record<string, number> = {
    all: 24,
    tagged: 12,
    qualified: 8,
    active_leads: 16,
  };

  const recipientCount = audienceEstimates[targetAudience] || 15;

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    if (!hasOptInConsent) {
      setResultMsg({
        type: 'error',
        text: 'Please verify recipient opt-in consent to comply with Meta WhatsApp Cloud API policies.',
      });
      return;
    }

    setIsSending(true);
    setResultMsg(null);

    try {
      const token = localStorage.getItem('rdx_session_token');
      // Dispatch via Meta WhatsApp send API
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: `Instant Broadcast - ${new Date().toLocaleTimeString()}`,
          audienceSegment: targetAudience === 'tagged' ? `Tag: ${selectedTag}` : targetAudience,
          templateName: 'lead_follow_up_greeting',
          totalRecipients: recipientCount,
        }),
      });

      if (res.ok) {
        setResultMsg({
          type: 'success',
          text: `Broadcast queued successfully for ${recipientCount} contacts via official Meta WhatsApp Business Cloud API!`,
        });
        setBroadcastMessage('');
      } else {
        setResultMsg({
          type: 'error',
          text: 'Broadcast dispatch failed. Please verify your Meta Phone ID & Access Token.',
        });
      }
    } catch {
      setResultMsg({
        type: 'error',
        text: 'Network error connecting to WhatsApp dispatch engine.',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#101D35] flex items-center gap-2">
          <span>WhatsApp Instant Broadcast</span>
          <span className="text-xs bg-[#25D366]/10 text-[#128C7E] font-semibold px-2 py-0.5 rounded-full border border-[#25D366]/30">
            Cloud API Direct Dispatch
          </span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Send announcements, emergency notices, or special commercial updates to your segmented customer database.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Broadcast Composer */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <form onSubmit={handleSendBroadcast} className="space-y-4">
            {/* Target Audience Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#101D35]">Select Target Audience</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'all', label: 'All Contacts', count: 24 },
                  { id: 'tagged', label: 'By Tag Filter', count: 12 },
                  { id: 'qualified', label: 'Qualified Leads', count: 8 },
                  { id: 'active_leads', label: 'Active Deals', count: 16 },
                ].map((aud) => (
                  <button
                    key={aud.id}
                    type="button"
                    onClick={() => setTargetAudience(aud.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      targetAudience === aud.id
                        ? 'border-[#25D366] bg-[#25D366]/5 text-[#101D35]'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="text-xs font-bold block">{aud.label}</span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">{aud.count} recipients</span>
                  </button>
                ))}
              </div>
            </div>

            {targetAudience === 'tagged' && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700">Select Tag:</span>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-[#25D366]"
                >
                  <option value="Wholesale">Wholesale</option>
                  <option value="High Priority">High Priority</option>
                  <option value="Fleet Owner">Fleet Owner</option>
                  <option value="Retail Client">Retail Client</option>
                </select>
              </div>
            )}

            {/* Message Body Composer */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#101D35]">Broadcast Message Text</label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {broadcastMessage.length} / 1024 chars
                </span>
              </div>
              <textarea
                rows={5}
                required
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Type your official WhatsApp broadcast announcement here..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#25D366] focus:bg-white transition-all font-sans"
              />
            </div>

            {/* Quick Template Variable Tags */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Insert Variables:</span>
              {['{{name}}', '{{company}}', '{{phone}}'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setBroadcastMessage((prev) => prev + ` ${tag}`)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Compliance Checkbox */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasOptInConsent}
                  onChange={(e) => setHasOptInConsent(e.target.checked)}
                  className="mt-0.5 rounded text-[#25D366] focus:ring-[#25D366]"
                />
                <span className="text-slate-700 font-medium leading-relaxed">
                  I confirm that all targeted recipients have given explicit opt-in consent to receive WhatsApp messages from our business, complying with Meta WhatsApp Business Policies.
                </span>
              </label>
            </div>

            {resultMsg && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 font-medium ${
                  resultMsg.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                {resultMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{resultMsg.text}</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                <span>Ready to dispatch to <strong className="text-[#101D35]">{recipientCount} verified recipients</strong></span>
              </div>

              <button
                type="submit"
                disabled={isSending || !broadcastMessage.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Transmitting...' : 'Dispatch Broadcast'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Mobile WhatsApp Preview Screen */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#111B21] text-white rounded-2xl p-4 shadow-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
              <span className="font-semibold text-slate-300">Recipient Preview</span>
              <span className="text-[10px] bg-[#25D366]/20 text-[#25D366] px-1.5 py-0.5 rounded font-mono">
                WhatsApp Chat
              </span>
            </div>

            <div className="bg-[#0B141A] p-3 rounded-xl min-h-[180px] flex flex-col justify-end">
              <div className="bg-[#005C4B] text-white p-3 rounded-xl rounded-tr-none text-xs space-y-1 shadow-sm max-w-[90%] self-end">
                <p className="leading-relaxed whitespace-pre-wrap">
                  {broadcastMessage || 'Your message preview will appear here in real-time as you compose...'}
                </p>
                <div className="flex items-center justify-end gap-1 text-[9px] text-[#8696A0] pt-1">
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <ShieldCheck className="w-3 h-3 text-[#53BDEB]" />
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Info className="w-3.5 h-3.5 text-[#55B9F5]" />
                <span>Meta Policy Guidelines</span>
              </div>
              <p className="text-[10px] leading-relaxed">
                Marketing messages require pre-approved Meta message templates when contacting users outside the active 24-hour service window.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
