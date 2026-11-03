import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  User,
  Building,
} from 'lucide-react';
import { SupportTicket } from '../../types';

export const AdminSupportTicketsSection: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('rdx_session_token');
      const res = await fetch('/api/support-tickets', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
        if (data.length > 0 && !selectedTicket) {
          setSelectedTicket(data[0]);
        }
      }
    } catch {
      // Ignored
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    try {
      const token = localStorage.getItem('rdx_session_token');
      const res = await fetch(`/api/support-tickets/${selectedTicket.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ text: replyText.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedTicket(data.ticket);
        setReplyText('');
        setActionMsg('Reply sent to customer ticket.');
        fetchTickets();
      }
    } catch {
      setActionMsg('Failed to send reply.');
    }
    setTimeout(() => setActionMsg(''), 4000);
  };

  const handleUpdateStatus = async (status: SupportTicket['status']) => {
    if (!selectedTicket) return;
    try {
      const token = localStorage.getItem('rdx_session_token');
      const res = await fetch(`/api/support-tickets/${selectedTicket.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedTicket(updated);
        fetchTickets();
      }
    } catch {
      // Ignored
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchSearch =
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.submittedByEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#101D35] flex items-center gap-2">
            <span>Customer Support Tickets & Help Desk</span>
            <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
              Platform SLA
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage customer inquiries, technical requests, Meta token issues, and onboarding tickets.
          </p>
        </div>

        <button
          onClick={fetchTickets}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Tickets</span>
        </button>
      </div>

      {actionMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Main Grid: Ticket List + Conversation Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Ticket List */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          {/* Search & Filter Header */}
          <div className="p-3 border-b border-slate-100 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tickets, tenant, email..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#25D366]"
              />
            </div>

            <div className="flex items-center gap-1 text-[11px]">
              {['all', 'Open', 'In Progress', 'Resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-0.5 rounded-lg font-semibold transition-colors ${
                    statusFilter === st
                      ? 'bg-[#101D35] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'all' ? 'All' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Ticket Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-8 text-center text-slate-400 text-xs">Loading tickets...</div>
            ) : filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">No matching tickets found.</div>
            ) : (
              filteredTickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`w-full p-3.5 text-left transition-colors flex flex-col gap-1.5 ${
                    selectedTicket?.id === t.id ? 'bg-[#25D366]/10 border-l-4 border-[#25D366]' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#101D35] truncate max-w-[200px]">
                      {t.subject}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                        t.priority === 'Urgent'
                          ? 'bg-red-100 text-red-800'
                          : t.priority === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-700 truncate">
                      <Building className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{t.businessName}</span>
                    </span>
                    <span
                      className={`font-semibold ${
                        t.status === 'Resolved'
                          ? 'text-emerald-600'
                          : t.status === 'In Progress'
                          ? 'text-blue-600'
                          : 'text-amber-600'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Ticket Detail & Reply Thread */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          {selectedTicket ? (
            <>
              {/* Ticket Top Meta */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
                <div>
                  <h3 className="font-bold text-sm text-[#101D35]">{selectedTicket.subject}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-medium text-slate-700">{selectedTicket.businessName}</span>
                    <span>·</span>
                    <span className="font-mono">{selectedTicket.submittedByEmail}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleUpdateStatus(e.target.value as any)}
                    className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#25D366]"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Original Description */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 text-xs text-slate-700 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Customer Problem Description:
                </span>
                <p className="leading-relaxed whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>

              {/* Replies Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                {selectedTicket.replies?.length === 0 ? (
                  <p className="text-slate-400 italic text-center py-6">
                    No responses yet. Send an official reply below.
                  </p>
                ) : (
                  selectedTicket.replies?.map((rep) => (
                    <div
                      key={rep.id}
                      className={`p-3 rounded-xl max-w-[85%] space-y-1 ${
                        rep.sender.includes('Support') || rep.sender.includes('Admin')
                          ? 'bg-[#101D35] text-white ml-auto'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 text-[10px] opacity-75 font-semibold">
                        <span>{rep.sender}</span>
                        <span>{rep.timestamp}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{rep.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="p-3 border-t border-slate-100 flex gap-2 bg-white">
                <input
                  type="text"
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type official support reply to tenant..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#25D366]"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-slate-400 text-xs">
              Select a ticket from the left column to view conversation details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
