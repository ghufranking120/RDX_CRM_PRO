import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  RefreshCw,
  Play,
  Pause,
  Trash2,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Search,
  Filter,
  Code,
  Radio,
  ExternalLink,
  Send,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export interface WebhookLogEntry {
  id: string;
  timestamp: string;
  signature?: string;
  signatureValid: boolean;
  deliveryStatus: 'delivered' | 'processed' | 'rejected' | 'duplicate' | 'simulated';
  eventType: 'messages' | 'statuses' | 'verification_challenge' | 'unknown';
  payloadSummary: string;
  senderPhone?: string;
  recipientPhoneId?: string;
  wamid?: string;
  businessId?: string;
  rawPayloadSnippet: string;
  httpStatus: number;
}

export interface RetryingMessageEntry {
  id: string;
  conversationId: string;
  businessId: string;
  sender: string;
  senderName?: string;
  text: string;
  timestamp: string;
  status: 'Retrying' | 'retrying' | 'failed' | 'delivered' | 'sent';
  recipientPhone?: string;
  retryCount?: number;
  maxRetries?: number;
  nextRetryAt?: string;
  lastRetryError?: string;
  metaMessageId?: string;
  retryHistory?: Array<{
    attempt: number;
    timestamp: string;
    delayMs: number;
    status: string;
    error?: string;
  }>;
}

export const IncomingWebhookLog: React.FC = () => {
  // Top-level Navigation Mode: Webhooks vs Retries
  const [activeTab, setActiveTab] = useState<'inbound' | 'retries'>('inbound');

  // Inbound Webhooks state
  const [logs, setLogs] = useState<WebhookLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(true);
  const [pollInterval, setPollInterval] = useState<number>(3000); // 3 seconds
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Filters & Search
  const [eventTypeFilter, setEventTypeFilter] = useState<'all' | 'messages' | 'statuses' | 'verification_challenge'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Expandable JSON states
  const [expandedLogIds, setExpandedLogIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Inbound Simulation & Action states
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedFeedback, setSimulatedFeedback] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  // Outbound Retries state
  const [retryingList, setRetryingList] = useState<RetryingMessageEntry[]>([]);
  const [failedList, setFailedList] = useState<RetryingMessageEntry[]>([]);
  const [retryMetrics, setRetryMetrics] = useState({ retryingCount: 0, failedCount: 0, totalRetriedCount: 0 });
  const [isSimulatingRetry, setIsSimulatingRetry] = useState(false);
  const [retryActionMsg, setRetryActionMsg] = useState<string | null>(null);

  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch Webhook Logs
  const fetchLogs = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const token = localStorage.getItem('rdx_session_token');
      const params = new URLSearchParams();
      params.append('limit', '50');
      if (eventTypeFilter !== 'all') params.append('eventType', eventTypeFilter);
      if (statusFilter !== 'all') params.append('deliveryStatus', statusFilter);

      const res = await fetch(`/api/whatsapp/webhook-logs?${params.toString()}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.warn('Failed to fetch incoming webhook logs:', err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  // Fetch Outbound Retry Queue
  const fetchRetryQueue = async () => {
    try {
      const token = localStorage.getItem('rdx_session_token');
      const res = await fetch('/api/whatsapp/retries', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        const data = await res.json();
        setRetryingList(data.activeRetrying || []);
        setFailedList(data.recentlyFailed || []);
        setRetryMetrics(data.metrics || { retryingCount: 0, failedCount: 0, totalRetriedCount: 0 });
      }
    } catch (err) {
      console.warn('Failed to fetch retry queue:', err);
    }
  };

  // Setup / teardown polling
  useEffect(() => {
    fetchLogs();
    fetchRetryQueue();

    if (isPolling) {
      pollingTimerRef.current = setInterval(() => {
        fetchLogs(true);
        fetchRetryQueue();
      }, pollInterval);
    }

    return () => {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
      }
    };
  }, [isPolling, pollInterval, eventTypeFilter, statusFilter, activeTab]);

  const toggleExpand = (id: string) => {
    setExpandedLogIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Simulate an incoming webhook payload for instant developer testing
  const handleSimulateWebhook = async (type: 'messages' | 'statuses') => {
    setIsSimulating(true);
    setSimulatedFeedback(null);
    try {
      const token = localStorage.getItem('rdx_session_token');
      const sampleMessages = [
        'Hello! I would like to inquire about container logistics rates.',
        'Can you send the shipping manifest for our consignment?',
        'Do you offer expedited customs clearance in Dubai?',
      ];
      const randomText = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];

      const res = await fetch('/api/whatsapp/webhook-logs/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          eventType: type,
          text: type === 'messages' ? randomText : undefined,
          phone: '+923138066389',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSimulatedFeedback(`Simulated ${type} event dispatched with HMAC signature!`);
        fetchLogs(true);
        setTimeout(() => setSimulatedFeedback(null), 4000);
      }
    } catch (err: any) {
      setSimulatedFeedback(`Simulation error: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  // Simulate Outbound Failure with Exponential Backoff
  const handleSimulateRetry = async () => {
    setIsSimulatingRetry(true);
    setRetryActionMsg(null);
    try {
      const token = localStorage.getItem('rdx_session_token');
      const res = await fetch('/api/whatsapp/retries/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          recipientPhone: '+923138066389',
          failCount: 2, // Fails 2 times with exponential delay, then delivers on attempt 3
          text: 'Cargo invoice & delivery clearance tracking PIN.',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setRetryActionMsg("Outbound message failed initial dispatch: status set to 'Retrying'. Watch exponential backoff progress in real-time below!");
        fetchRetryQueue();
        setTimeout(() => setRetryActionMsg(null), 6000);
      }
    } catch (err: any) {
      setRetryActionMsg(`Simulation error: ${err.message}`);
    } finally {
      setIsSimulatingRetry(false);
    }
  };

  // Force Immediate Retry
  const handleForceRetry = async (messageId: string) => {
    try {
      const token = localStorage.getItem('rdx_session_token');
      const res = await fetch(`/api/whatsapp/messages/${messageId}/retry`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        setRetryActionMsg('Immediate retry dispatched for message!');
        fetchRetryQueue();
        setTimeout(() => setRetryActionMsg(null), 4000);
      }
    } catch (err: any) {
      setRetryActionMsg(`Retry error: ${err.message}`);
    }
  };

  // Clear Logs
  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear all incoming webhook logs?')) return;
    setIsClearing(true);
    try {
      const token = localStorage.getItem('rdx_session_token');
      const res = await fetch('/api/whatsapp/webhook-logs', {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        setLogs([]);
        setExpandedLogIds({});
      }
    } catch (err) {
      console.warn('Failed to clear webhook logs:', err);
    } finally {
      setIsClearing(false);
    }
  };

  // Filter logs by search query
  const filteredLogs = logs.filter((log) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.payloadSummary.toLowerCase().includes(q) ||
      (log.senderPhone && log.senderPhone.toLowerCase().includes(q)) ||
      (log.wamid && log.wamid.toLowerCase().includes(q)) ||
      (log.signature && log.signature.toLowerCase().includes(q)) ||
      log.eventType.toLowerCase().includes(q) ||
      log.deliveryStatus.toLowerCase().includes(q)
    );
  });

  // Calculate Quick Stats
  const stats = {
    total: logs.length,
    messages: logs.filter((l) => l.eventType === 'messages').length,
    statuses: logs.filter((l) => l.eventType === 'statuses').length,
    verifiedSignatures: logs.filter((l) => l.signatureValid && l.signature).length,
  };

  const getStatusBadge = (status: WebhookLogEntry['deliveryStatus']) => {
    switch (status) {
      case 'processed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Processed</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <Check className="w-3 h-3 text-sky-600" />
            <span>Delivered</span>
          </span>
        );
      case 'simulated':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Zap className="w-3 h-3 text-purple-600" />
            <span>Simulated</span>
          </span>
        );
      case 'duplicate':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Duplicate</span>
          </span>
        );
      case 'rejected':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
            <AlertCircle className="w-3 h-3 text-red-600" />
            <span>Rejected</span>
          </span>
        );
    }
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffSecs = Math.floor((now.getTime() - date.getTime()) / 1000);

      let relative = '';
      if (diffSecs < 10) relative = 'Just now';
      else if (diffSecs < 60) relative = `${diffSecs}s ago`;
      else if (diffSecs < 3600) relative = `${Math.floor(diffSecs / 60)}m ago`;
      else relative = `${Math.floor(diffSecs / 3600)}h ago`;

      return {
        relative,
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        date: date.toLocaleDateString(),
      };
    } catch {
      return { relative: 'Recently', time: isoString, date: '' };
    }
  };

  return (
    <div className="mt-8 border-t border-[#E5E9ED] pt-8 space-y-5">
      {/* Top Tab Mode Switcher: Inbound Webhooks vs Outbound Retries */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E5E9ED]">
        <div className="flex items-center gap-2 p-1 bg-[#F7F9FA] border border-[#E5E9ED] rounded-xl">
          <button
            onClick={() => setActiveTab('inbound')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'inbound'
                ? 'bg-white text-[#17212B] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-[#25D366]" />
            <span>Inbound Webhook Stream</span>
            <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded-full text-[10px]">
              {logs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('retries')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'retries'
                ? 'bg-white text-[#17212B] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${retryMetrics.retryingCount > 0 ? 'text-amber-500 animate-spin' : 'text-slate-500'}`} />
            <span>Outbound Retry Monitor (Exponential Backoff)</span>
            {retryMetrics.retryingCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] animate-pulse">
                {retryMetrics.retryingCount} Retrying
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Polling Indicator Pill */}
          <button
            onClick={() => setIsPolling(!isPolling)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isPolling
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
            }`}
            title={isPolling ? 'Click to Pause Live Polling' : 'Click to Resume Live Polling'}
          >
            {isPolling ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
                </span>
                <span>Live ({pollInterval / 1000}s)</span>
                <Pause className="w-3 h-3 ml-0.5 text-emerald-700" />
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>Paused</span>
                <Play className="w-3 h-3 ml-0.5 text-slate-600" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ============================================================
          VIEW 1: OUTBOUND RETRY MONITOR (EXPONENTIAL BACKOFF)
          ============================================================ */}
      {activeTab === 'retries' && (
        <div className="space-y-5">
          {/* Header Description */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#17212B]">Outbound Message Retry Monitor</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/15 text-amber-800 rounded-md uppercase tracking-wider">
                  Exponential Backoff
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically catches failed Meta Cloud API transmissions, updates message status to <strong className="text-amber-700 font-mono">'Retrying'</strong>, and backs off exponentially (1.5s, 3.0s, 6.0s) before marking permanent failure.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSimulateRetry}
                disabled={isSimulatingRetry}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors shadow-xs disabled:opacity-50"
                title="Simulate temporary outbound failure to watch status update to 'Retrying' and back off exponentially"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingRetry ? 'animate-spin' : ''}`} />
                <span>{isSimulatingRetry ? 'Dispatching Test...' : 'Test Exponential Backoff'}</span>
              </button>
            </div>
          </div>

          {/* Action Notification */}
          {retryActionMsg && (
            <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-xs flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-600 shrink-0 animate-spin" />
              <span className="font-medium">{retryActionMsg}</span>
            </div>
          )}

          {/* Exponential Backoff Architecture Diagram */}
          <div className="p-4 bg-[#F7F9FA] rounded-xl border border-[#E5E9ED] space-y-2">
            <span className="text-[11px] font-bold text-[#17212B] flex items-center gap-1.5 uppercase tracking-wide">
              <TrendingUp className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Retry Strategy & Exponential Backoff Ladder</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs pt-1">
              <div className="p-2.5 bg-white border border-[#E5E9ED] rounded-lg">
                <span className="text-[10px] text-slate-400 font-mono block">Initial Attempt</span>
                <span className="font-bold text-[#17212B]">Direct Meta Send</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">If 429/500/503 &rarr; Status = 'Retrying'</span>
              </div>
              <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-lg">
                <span className="text-[10px] text-amber-700 font-mono block">Backoff Step 1</span>
                <span className="font-bold text-amber-800">1.5s Delay</span>
                <span className="text-[10px] text-amber-600 block mt-0.5">Status = 'Retrying' (Attempt 1/3)</span>
              </div>
              <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-lg">
                <span className="text-[10px] text-amber-700 font-mono block">Backoff Step 2 (2x)</span>
                <span className="font-bold text-amber-800">3.0s Delay</span>
                <span className="text-[10px] text-amber-600 block mt-0.5">Status = 'Retrying' (Attempt 2/3)</span>
              </div>
              <div className="p-2.5 bg-red-50/60 border border-red-200 rounded-lg">
                <span className="text-[10px] text-red-700 font-mono block">Backoff Step 3 (4x)</span>
                <span className="font-bold text-red-800">6.0s &rarr; Max Limit</span>
                <span className="text-[10px] text-red-600 block mt-0.5">Exhausted &rarr; Status = 'failed' (WF 7)</span>
              </div>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-[#F7F9FA] rounded-xl border border-[#E5E9ED]">
              <span className="text-[11px] font-semibold text-slate-500 block">Active Retrying Messages</span>
              <span className="text-xl font-bold text-amber-600 mt-0.5 block flex items-center gap-2">
                <span>{retryMetrics.retryingCount}</span>
                {retryMetrics.retryingCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />}
              </span>
            </div>
            <div className="p-3 bg-[#F7F9FA] rounded-xl border border-[#E5E9ED]">
              <span className="text-[11px] font-semibold text-slate-500 block">Exhausted Failures</span>
              <span className="text-xl font-bold text-red-600 mt-0.5 block">{retryMetrics.failedCount}</span>
            </div>
            <div className="p-3 bg-[#F7F9FA] rounded-xl border border-[#E5E9ED]">
              <span className="text-[11px] font-semibold text-slate-500 block">Total Message Retry Lifecycle</span>
              <span className="text-xl font-bold text-[#17212B] mt-0.5 block">{retryMetrics.totalRetriedCount}</span>
            </div>
          </div>

          {/* Active Retrying Queue List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#17212B]">Currently Retrying Messages (In Backoff Queue)</h4>
              <span className="text-[11px] text-slate-400">Updates dynamically via live polling</span>
            </div>

            {retryingList.length === 0 ? (
              <div className="p-6 text-center bg-[#F7F9FA] border border-[#E5E9ED] rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                <h5 className="text-xs font-bold text-slate-700">No Failed Outbound Messages Currently Retrying</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  All Meta WhatsApp Cloud API outbound messages have either been successfully delivered or are idle.
                </p>
                <button
                  onClick={handleSimulateRetry}
                  disabled={isSimulatingRetry}
                  className="mt-3 px-3 py-1 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Simulate Outbound Retry Test
                </button>
              </div>
            ) : (
              retryingList.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-white border-2 border-amber-300 rounded-xl p-4 shadow-xs space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        <RefreshCw className="w-3 h-3 text-amber-700 animate-spin" />
                        <span>Status: Retrying</span>
                      </span>

                      <span className="text-xs font-mono font-bold text-[#17212B]">
                        Attempt {msg.retryCount || 1} / {msg.maxRetries || 3}
                      </span>

                      <span className="text-[11px] font-mono text-slate-500">
                        To: {msg.recipientPhone || 'Customer Phone'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {msg.nextRetryAt && (
                        <span className="text-[11px] text-amber-700 font-mono">
                          Next Backoff: {new Date(msg.nextRetryAt).toLocaleTimeString()}
                        </span>
                      )}
                      <button
                        onClick={() => handleForceRetry(msg.id)}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[11px] font-bold transition-colors"
                      >
                        Force Retry Now
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">"{msg.text}"</p>

                  {msg.lastRetryError && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-[11px] font-mono text-red-700 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Last Meta API Error: {msg.lastRetryError}</span>
                    </div>
                  )}

                  {msg.retryHistory && msg.retryHistory.length > 0 && (
                    <div className="text-[10px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-100">
                      <span className="font-semibold block text-slate-700">Backoff Attempt Log:</span>
                      {msg.retryHistory.map((h, i) => (
                        <div key={i} className="font-mono">
                          • Attempt {h.attempt}: delayed {h.delayMs}ms ({h.status}) - {h.error || 'Pending'}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ============================================================
          VIEW 2: INBOUND WEBHOOK STREAM (META INBOUND)
          ============================================================ */}
      {activeTab === 'inbound' && (
        <div className="space-y-5">
          {/* Header with Title and Real-time Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-[#17212B]">Incoming Webhook Log</h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-[#25D366]/15 text-[#128C7E] rounded-md uppercase tracking-wider">
                      Developer Debugger
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time stream of incoming Meta WhatsApp Cloud API webhooks, HMAC-SHA256 signatures, and event delivery statuses.
                  </p>
                </div>
              </div>
            </div>

            {/* Inbound Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={pollInterval}
                onChange={(e) => setPollInterval(Number(e.target.value))}
                className="p-1.5 bg-white border border-[#E5E9ED] rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#25D366]"
                title="Polling frequency"
              >
                <option value={3000}>3s poll</option>
                <option value={5000}>5s poll</option>
                <option value={10000}>10s poll</option>
              </select>

              <button
                onClick={() => fetchLogs()}
                disabled={isLoading}
                className="p-2 bg-white border border-[#E5E9ED] hover:bg-slate-50 text-slate-700 rounded-xl text-xs transition-colors disabled:opacity-50"
                title="Refresh Webhook Logs Now"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#25D366]' : ''}`} />
              </button>

              <button
                onClick={() => handleSimulateWebhook('messages')}
                disabled={isSimulating}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                title="Simulate inbound Meta WhatsApp webhook to verify endpoint and deduplication"
              >
                <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-bounce text-[#25D366]' : ''}`} />
                <span>{isSimulating ? 'Simulating...' : 'Simulate Event'}</span>
              </button>

              <button
                onClick={handleClearLogs}
                disabled={isClearing || logs.length === 0}
                className="p-2 border border-[#E5E9ED] hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl text-xs transition-colors disabled:opacity-40"
                title="Clear all recorded webhook logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Simulation Feedback Alert */}
          {simulatedFeedback && (
            <div className="p-3 bg-purple-50 border border-purple-200 text-purple-900 rounded-xl text-xs flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600 shrink-0" />
              <span className="font-medium">{simulatedFeedback}</span>
            </div>
          )}

          {/* Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#F7F9FA] rounded-xl border border-[#E5E9ED]">
              <span className="text-[11px] font-semibold text-slate-500 block">Total Logs Captured</span>
              <span className="text-lg font-bold text-[#17212B] mt-0.5 block">{stats.total}</span>
            </div>
            <div className="p-3 bg-[#F7F9FA] rounded-xl border border-[#E5E9ED]">
              <span className="text-[11px] font-semibold text-slate-500 block">Inbound Messages</span>
              <span className="text-lg font-bold text-emerald-600 mt-0.5 block">{stats.messages}</span>
            </div>
            <div className="p-3 bg-[#F7F9FA] rounded-xl border border-[#E5E9ED]">
              <span className="text-[11px] font-semibold text-slate-500 block">Status Updates</span>
              <span className="text-lg font-bold text-sky-600 mt-0.5 block">{stats.statuses}</span>
            </div>
            <div className="p-3 bg-[#F7F9FA] rounded-xl border border-[#E5E9ED]">
              <span className="text-[11px] font-semibold text-slate-500 block">Verified Signatures</span>
              <span className="text-lg font-bold text-[#128C7E] mt-0.5 block">{stats.verifiedSignatures}</span>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
            {/* Event Type Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#F7F9FA] border border-[#E5E9ED] rounded-xl overflow-x-auto">
              {[
                { id: 'all', label: 'All Events' },
                { id: 'messages', label: 'Messages' },
                { id: 'statuses', label: 'Status Updates' },
                { id: 'verification_challenge', label: 'Challenges' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setEventTypeFilter(tab.id as any)}
                  className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                    eventTypeFilter === tab.id
                      ? 'bg-white text-[#17212B] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search payload, phone, WAMID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#E5E9ED] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#25D366]"
              />
            </div>
          </div>

          {/* Logs Stream Container */}
          <div className="space-y-3">
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center bg-[#F7F9FA] border border-[#E5E9ED] rounded-2xl">
                <Radio className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-pulse" />
                <h4 className="text-xs font-bold text-slate-700">No Webhook Events Recorded Yet</h4>
                <p className="text-[11px] text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                  Meta WhatsApp Cloud API will stream payloads to your public webhook endpoint whenever an inbound message arrives or delivery receipts update.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleSimulateWebhook('messages')}
                    disabled={isSimulating}
                    className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                  >
                    Send Test Webhook Now
                  </button>
                </div>
              </div>
            ) : (
              filteredLogs.map((log) => {
                const timeInfo = formatTimestamp(log.timestamp);
                const isExpanded = !!expandedLogIds[log.id];

                return (
                  <div
                    key={log.id}
                    className="bg-[#FFFFFF] border border-[#E5E9ED] rounded-xl p-4 transition-all hover:border-slate-300 shadow-2xs space-y-3"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(log.deliveryStatus)}

                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-700 uppercase">
                          {log.eventType}
                        </span>

                        <span className="text-[11px] font-mono text-slate-500">
                          HTTP {log.httpStatus}
                        </span>

                        {/* Signature Status */}
                        {log.signature ? (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono ${
                              log.signatureValid
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                            title={`Signature: ${log.signature}`}
                          >
                            {log.signatureValid ? (
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <ShieldAlert className="w-3 h-3 text-red-600" />
                            )}
                            <span>{log.signature.slice(0, 16)}...</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-50 text-slate-400 border border-slate-200">
                            <span>Unsigned / Dev</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 shrink-0">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="font-medium text-slate-600">{timeInfo.relative}</span>
                        <span>•</span>
                        <span>{timeInfo.time}</span>
                      </div>
                    </div>

                    {/* Summary Row */}
                    <div className="flex items-start justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <p className="font-semibold text-[#17212B] leading-snug">
                          {log.payloadSummary}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-mono">
                          {log.senderPhone && (
                            <span>
                              From: <strong className="text-slate-700">{log.senderPhone}</strong>
                            </span>
                          )}
                          {log.recipientPhoneId && (
                            <span>
                              Phone ID: <strong className="text-slate-700">{log.recipientPhoneId}</strong>
                            </span>
                          )}
                          {log.wamid && (
                            <span title={log.wamid}>
                              WAMID: <strong className="text-slate-700">{log.wamid.slice(0, 18)}...</strong>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Expand / Collapse Button */}
                      <button
                        onClick={() => toggleExpand(log.id)}
                        className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg border border-[#E5E9ED] shrink-0 transition-colors"
                      >
                        <Code className="w-3 h-3 text-slate-500" />
                        <span>{isExpanded ? 'Hide Payload' : 'Inspect JSON'}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>

                    {/* Expandable JSON Payload Code Box */}
                    {isExpanded && (
                      <div className="pt-2 border-t border-[#E5E9ED]/80 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono text-slate-500 font-semibold flex items-center gap-1.5">
                            <Code className="w-3.5 h-3.5 text-[#25D366]" />
                            <span>Raw Meta Webhook Payload Envelope</span>
                          </span>

                          <button
                            onClick={() => copyToClipboard(log.rawPayloadSnippet, log.id)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-slate-600 hover:text-[#17212B] hover:bg-slate-100 transition-colors font-medium"
                            title="Copy JSON Payload"
                          >
                            {copiedId === log.id ? (
                              <>
                                <Check className="w-3 h-3 text-[#25D366]" />
                                <span className="text-[#25D366]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy JSON</span>
                              </>
                            )}
                          </button>
                        </div>

                        <pre className="p-3 bg-[#111B21] text-emerald-400 font-mono text-[11px] leading-relaxed rounded-xl overflow-x-auto max-h-64 border border-slate-800 select-all">
                          <code>{log.rawPayloadSnippet}</code>
                        </pre>

                        {log.signature && (
                          <div className="p-2 bg-[#F7F9FA] rounded-lg border border-[#E5E9ED] text-[11px] font-mono flex items-center justify-between">
                            <span className="text-slate-500 truncate mr-2">
                              x-hub-signature-256: <code className="text-slate-800">{log.signature}</code>
                            </span>
                            <span
                              className={`shrink-0 font-bold ${
                                log.signatureValid ? 'text-emerald-600' : 'text-red-600'
                              }`}
                            >
                              {log.signatureValid ? '✓ Signature Verified' : '✗ Signature Invalid'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400 pt-2 border-t border-[#E5E9ED]">
        <span>
          Auto-polling: {isPolling ? `Active every ${pollInterval / 1000}s` : 'Paused'} • Ring buffer holds latest 100 webhook events & retry queue
        </span>
        {lastUpdated && (
          <span>Last sync: {lastUpdated.toLocaleTimeString()}</span>
        )}
      </div>
    </div>
  );
};
