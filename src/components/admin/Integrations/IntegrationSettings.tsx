import React, { useState, useEffect } from 'react';
import {
  Key,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  Eye,
  EyeOff,
  Save,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Phone,
  Webhook,
} from 'lucide-react';
import { IncomingWebhookLog } from './IncomingWebhookLog';

export interface IntegrationSettingsProps {
  onSuccess?: () => void;
}

export const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({ onSuccess }) => {
  // Input fields required by specification
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [verifyToken, setVerifyToken] = useState('rdx_token_meta_cloud_waba_2026');
  const [wabaAccountId, setWabaAccountId] = useState('');
  const [whatsappDisplayPhone, setWhatsappDisplayPhone] = useState('');

  // UI state
  const [showAccessToken, setShowAccessToken] = useState(false);
  const [hasExistingToken, setHasExistingToken] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Loading & feedback state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Test Connection state
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    details: string;
    phoneId?: string;
  } | null>(null);

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://rdxcrm.com';
  const callbackUrl = `${currentOrigin}/api/whatsapp/webhook`;

  // Fetch persisted configuration on mount
  const loadConfiguration = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('rdx_session_token');
      const res = await fetch('/api/whatsapp/config', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        const data = await res.json();
        setPhoneNumberId(data.metaPhoneId || '');
        setWabaAccountId(data.metaWabaId || '');
        setVerifyToken(data.metaVerifyToken || 'rdx_token_meta_cloud_waba_2026');
        setWhatsappDisplayPhone(data.whatsappPhone || '');
        setHasExistingToken(data.hasAccessToken);
        if (data.tokenMask) {
          setAccessToken(data.tokenMask);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch WhatsApp configuration from backend:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfiguration();
  }, []);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Persistent Save Function
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);
    setTestResult(null);

    try {
      const token = localStorage.getItem('rdx_session_token');
      const payload: Record<string, string> = {
        metaPhoneId: phoneNumberId.trim(),
        metaVerifyToken: verifyToken.trim(),
        metaWabaId: wabaAccountId.trim(),
        whatsappPhone: whatsappDisplayPhone.trim(),
      };

      // Only pass accessToken if user entered a new token (not mask)
      if (accessToken.trim() && !accessToken.includes('••••')) {
        payload.metaAccessToken = accessToken.trim();
      }

      const res = await fetch('/api/whatsapp/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveStatus({
          type: 'success',
          message: 'WhatsApp Cloud API credentials saved successfully to database!',
        });
        setHasExistingToken(data.hasAccessToken);
        if (onSuccess) onSuccess();
        setTimeout(() => setSaveStatus(null), 4000);
      } else {
        setSaveStatus({
          type: 'error',
          message: data.error || 'Failed to save configuration. Please verify entries.',
        });
      }
    } catch (err: any) {
      setSaveStatus({
        type: 'error',
        message: err.message || 'Network error communicating with CRM server.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Test Connection: executes whatsappService.testConnection method on backend
  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const token = localStorage.getItem('rdx_session_token');
      const payload: Record<string, string> = {};

      // If user typed custom credentials into fields without saving yet, allow active probe with them
      if (phoneNumberId.trim()) payload.phoneId = phoneNumberId.trim();
      if (accessToken.trim() && !accessToken.includes('••••')) {
        payload.accessToken = accessToken.trim();
      }

      const res = await fetch('/api/whatsapp/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setTestResult(data);
      } else {
        setTestResult({
          success: false,
          details: data.error || 'Failed to execute test connection.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        details: `Network error running whatsappService.testConnection: ${err.message}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E9ED] shadow-sm overflow-hidden text-[#17212B]">
      {/* Header */}
      <div className="p-6 border-b border-[#E5E9ED] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F7F9FA]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center font-bold">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#17212B]">
              Meta WhatsApp Cloud API Integration Settings
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure official Meta Graph API credentials for outbound messaging and webhook synchronization.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasExistingToken ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              <span>Token Active</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Sandbox / Setup Required</span>
            </span>
          )}
        </div>
      </div>

      {/* Status Toasts */}
      {saveStatus && (
        <div
          className={`m-6 p-4 rounded-xl text-xs flex items-center gap-2.5 ${
            saveStatus.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {saveStatus.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span className="font-medium">{saveStatus.message}</span>
        </div>
      )}

      {/* Test Connection Result Box */}
      {testResult && (
        <div
          className={`mx-6 mb-2 mt-4 p-4 rounded-xl text-xs border ${
            testResult.success
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/70 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {testResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <p className="font-bold text-xs">
                {testResult.success
                  ? 'Connection Test Succeeded (HTTP 200 OK)'
                  : 'Connection Test Result: Verification Incomplete'}
              </p>
              <p className="text-[11px] leading-relaxed opacity-90">{testResult.details}</p>
              {testResult.phoneId && (
                <p className="font-mono text-[10px] text-slate-500">
                  Target Phone ID: {testResult.phoneId}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="p-6 space-y-6">
        {/* Meta Webhook Reference Details */}
        <div className="p-4 bg-[#F7F9FA] rounded-xl border border-[#E5E9ED] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#17212B] flex items-center gap-1.5">
              <Webhook className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Webhook Endpoint Configuration (Paste into Meta App Dashboard)</span>
            </span>
            <span className="text-[10px] text-slate-500">Public Callback</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Webhook Callback URL
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={callbackUrl}
                  className="w-full p-2 bg-white border border-[#E5E9ED] rounded-lg font-mono text-[11px] text-slate-700 select-all"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(callbackUrl, 'url')}
                  className="p-2 border border-[#E5E9ED] hover:bg-slate-100 rounded-lg text-slate-600 shrink-0 transition-colors"
                  title="Copy Callback URL"
                >
                  {copiedField === 'url' ? (
                    <Check className="w-3.5 h-3.5 text-[#25D366]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Webhook Verify Token
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={verifyToken}
                  className="w-full p-2 bg-white border border-[#E5E9ED] rounded-lg font-mono text-[11px] text-emerald-700 font-semibold select-all"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(verifyToken, 'token')}
                  className="p-2 border border-[#E5E9ED] hover:bg-slate-100 rounded-lg text-slate-600 shrink-0 transition-colors"
                  title="Copy Verify Token"
                >
                  {copiedField === 'token' ? (
                    <Check className="w-3.5 h-3.5 text-[#25D366]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* 1. Phone Number ID */}
          <div className="space-y-1.5">
            <label className="font-semibold text-[#17212B] flex items-center justify-between">
              <span>
                Phone Number ID <span className="text-red-500">*</span>
              </span>
              <span className="text-[10px] text-slate-400">Meta WABA Phone ID</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 105948382718291"
              value={phoneNumberId}
              onChange={(e) => setPhoneNumberId(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#E5E9ED] rounded-xl font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#25D366]"
            />
            <p className="text-[10px] text-slate-400">
              Found in Meta Developer Portal &gt; WhatsApp &gt; API Setup
            </p>
          </div>

          {/* 2. Verify Token */}
          <div className="space-y-1.5">
            <label className="font-semibold text-[#17212B] flex items-center justify-between">
              <span>
                Verify Token <span className="text-red-500">*</span>
              </span>
              <span className="text-[10px] text-slate-400">Secret Verification Handshake</span>
            </label>
            <input
              type="text"
              required
              placeholder="rdx_token_meta_cloud_waba_2026"
              value={verifyToken}
              onChange={(e) => setVerifyToken(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#E5E9ED] rounded-xl font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#25D366]"
            />
            <p className="text-[10px] text-slate-400">
              Matched against <code className="text-[#25D366]">hub.verify_token</code> during Meta challenge verification
            </p>
          </div>
        </div>

        {/* 3. Access Token */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-[#17212B]">
              Access Token <span className="text-red-500">*</span>
            </label>
            <span className="text-[10px] text-slate-400">Meta Permanent System User Token (Saved securely server-side)</span>
          </div>

          <div className="relative">
            <input
              type={showAccessToken ? 'text' : 'password'}
              placeholder="EAAG... (Paste Meta Permanent System User Token)"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              className="w-full p-2.5 pr-10 bg-white border border-[#E5E9ED] rounded-xl font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#25D366]"
            />
            <button
              type="button"
              onClick={() => setShowAccessToken(!showAccessToken)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              title={showAccessToken ? 'Hide token' : 'Show token'}
            >
              {showAccessToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            Generate in Meta Business Manager &gt; System Users with <code className="text-[#25D366]">whatsapp_business_messaging</code> permissions.
          </p>
        </div>

        {/* Optional WABA ID & Display Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
          <div className="space-y-1">
            <label className="font-semibold text-[#17212B]">WhatsApp Business Account ID (WABA ID)</label>
            <input
              type="text"
              placeholder="e.g. 104829104928172"
              value={wabaAccountId}
              onChange={(e) => setWabaAccountId(e.target.value)}
              className="w-full p-2 bg-white border border-[#E5E9ED] rounded-xl font-mono text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#17212B]">Verified Display Phone Number</label>
            <input
              type="text"
              placeholder="+92 313 8066389"
              value={whatsappDisplayPhone}
              onChange={(e) => setWhatsappDisplayPhone(e.target.value)}
              className="w-full p-2 bg-white border border-[#E5E9ED] rounded-xl text-xs font-mono"
            />
          </div>
        </div>

        {/* Action Buttons: Save & Test Connection */}
        <div className="pt-4 border-t border-[#E5E9ED] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#25D366] text-[#17212B] hover:bg-[#25D366]/10 text-xs font-bold transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Testing Connection...' : 'Test Connection'}</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Configuration...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>

      {/* Incoming Webhook Log Monitor for Developers */}
      <div className="p-6 bg-[#FFFFFF] border-t border-[#E5E9ED]">
        <IncomingWebhookLog />
      </div>
    </div>
  );
};

export default IntegrationSettings;
