import React, { useState } from 'react';
import {
  Bell,
  Send,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Calendar,
  Users,
} from 'lucide-react';

export const AdminNotificationsSection: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'info' | 'warning' | 'urgent'>('info');
  const [actionMsg, setActionMsg] = useState('');

  const [announcements, setAnnouncements] = useState([
    {
      id: 'ann_01',
      title: 'Meta Cloud API v20.0 Framework Live',
      message: 'All tenant webhooks have been upgraded to Meta Cloud API v20.0 with automatic exponential backoff retry mechanism.',
      priority: 'info',
      date: '2026-03-02 09:00 AM',
    },
    {
      id: 'ann_02',
      title: 'Scheduled Cloud Infrastructure Maintenance',
      message: 'Brief 2-minute database maintenance scheduled for Sunday at 03:00 AM UTC. Incoming webhooks will be queued and buffered without loss.',
      priority: 'warning',
      date: '2026-02-28 04:30 PM',
    },
  ]);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newAnn = {
      id: `ann_${Date.now()}`,
      title: title.trim(),
      message: message.trim(),
      priority,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAnnouncements([newAnn, ...announcements]);
    setTitle('');
    setMessage('');
    setActionMsg('Announcement broadcast to all active tenant dashboards.');
    setTimeout(() => setActionMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#101D35] flex items-center gap-2">
            <span>Platform Announcements & Notifications</span>
            <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
              Tenant Dashboard Broadcast
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast platform-wide notifications, maintenance schedules, and feature release alerts to all customer dashboards.
          </p>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Compose Form */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-sm text-[#101D35] flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-amber-500" />
            <span>Broadcast New Announcement</span>
          </h3>

          <form onSubmit={handleBroadcast} className="space-y-3.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Announcement Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Major Release: Visual Chatbot Builder"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#25D366]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#25D366]"
              >
                <option value="info">Informational (Blue)</option>
                <option value="warning">Important Notice (Amber)</option>
                <option value="urgent">Urgent / Critical (Red)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Notification Body</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain the update, expected impact, and any required action..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#25D366]"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-semibold shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast to All Tenants</span>
            </button>
          </form>
        </div>

        {/* Right: Broadcast History */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-xs text-[#101D35] uppercase tracking-wider">Announcement History</h3>
            <span className="text-[11px] text-slate-400">All tenant workspaces</span>
          </div>

          <div className="divide-y divide-slate-100 p-4 space-y-3 flex-1 overflow-y-auto">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className={`p-4 rounded-xl border space-y-1.5 ${
                  ann.priority === 'urgent'
                    ? 'bg-red-50/60 border-red-200'
                    : ann.priority === 'warning'
                    ? 'bg-amber-50/60 border-amber-200'
                    : 'bg-blue-50/60 border-blue-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#101D35]">{ann.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{ann.date}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{ann.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
