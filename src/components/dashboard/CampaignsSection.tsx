import React, { useState, useEffect } from 'react';
import {
  Send,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart2,
  Users,
  FileText,
  Trash2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Campaign } from '../../types';
import { storageService } from '../../services/storage';

export const CampaignsSection: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  // Form states
  const [campaignName, setCampaignName] = useState('');
  const [audienceSegment, setAudienceSegment] = useState('All Contacts');
  const [templateName, setTemplateName] = useState('ramadan_special_discount');
  const [scheduledAt, setScheduledAt] = useState('');
  const [totalRecipients, setTotalRecipients] = useState('150');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('rdx_session_token');
      const res = await fetch('/api/campaigns', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data);
      }
    } catch {
      // Offline fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('rdx_session_token');
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: campaignName.trim(),
          audienceSegment,
          templateName,
          scheduledAt: scheduledAt || undefined,
          totalRecipients: parseInt(totalRecipients) || 50,
        }),
      });

      if (res.ok) {
        setActionMsg('Campaign created successfully.');
        setShowCreateModal(false);
        setCampaignName('');
        setScheduledAt('');
        fetchCampaigns();
      }
    } catch {
      setActionMsg('Failed to create campaign.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setActionMsg(''), 4000);
    }
  };

  const handleSendCampaign = async (id: string) => {
    try {
      const token = localStorage.getItem('rdx_session_token');
      const res = await fetch(`/api/campaigns/${id}/send`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setActionMsg('Campaign sending initiated via Meta Cloud API.');
        fetchCampaigns();
      }
    } catch {
      setActionMsg('Failed to trigger campaign.');
    }
    setTimeout(() => setActionMsg(''), 4000);
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    try {
      const token = localStorage.getItem('rdx_session_token');
      await fetch(`/api/campaigns/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      fetchCampaigns();
    } catch {
      // Ignored
    }
  };

  const filtered = campaigns.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.audienceSegment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.templateName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#101D35] flex items-center gap-2">
            <span>WhatsApp Campaign Manager</span>
            <span className="text-xs bg-[#25D366]/10 text-[#128C7E] font-semibold px-2 py-0.5 rounded-full border border-[#25D366]/30">
              Meta Approved Templates
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, schedule, and dispatch bulk WhatsApp messages to targeted customer segments using compliant Meta Cloud API templates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Campaign KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Campaigns</span>
          <span className="text-2xl font-extrabold text-[#101D35] mt-1 block">{campaigns.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Recipients Reached</span>
          <span className="text-2xl font-extrabold text-blue-600 mt-1 block">
            {campaigns.reduce((acc, c) => acc + (c.deliveredCount || 0), 0).toLocaleString()}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Average Delivery Rate</span>
          <span className="text-2xl font-extrabold text-[#25D366] mt-1 block">96.8%</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Average Read Rate</span>
          <span className="text-2xl font-extrabold text-purple-600 mt-1 block">82.4%</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns, audience, templates..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#25D366]"
          />
        </div>

        <button
          onClick={fetchCampaigns}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-[#101D35] border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Audience Segment</th>
                <th className="py-3 px-4">Template</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Delivery Stats</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading campaigns...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No campaigns found. Click "Create Campaign" to launch your first WhatsApp broadcast.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#101D35]">
                      <div>{c.name}</div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>{c.audienceSegment}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {c.templateName}
                    </td>
                    <td className="py-3 px-4">
                      {c.status === 'Completed' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Completed</span>
                        </span>
                      )}
                      {c.status === 'Sending' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800 animate-pulse">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Sending</span>
                        </span>
                      )}
                      {c.status === 'Scheduled' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-800">
                          <Clock className="w-3 h-3" />
                          <span>Scheduled</span>
                        </span>
                      )}
                      {c.status === 'Draft' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          <span>Draft</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#101D35]">{c.deliveredCount}</span>
                        <span className="text-slate-400">/ {c.totalRecipients} sent</span>
                        {c.totalRecipients > 0 && (
                          <span className="text-[10px] font-bold text-emerald-600">
                            ({Math.round(((c.deliveredCount || 0) / c.totalRecipients) * 100)}%)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {c.status !== 'Completed' && c.status !== 'Sending' && (
                          <button
                            onClick={() => handleSendCampaign(c.id)}
                            className="px-2.5 py-1 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>Launch</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteCampaign(c.id)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#101D35]">Create New WhatsApp Campaign</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g., Ramadan Special Offer 2026"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#25D366]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Audience Segment</label>
                  <select
                    value={audienceSegment}
                    onChange={(e) => setAudienceSegment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#25D366]"
                  >
                    <option value="All Contacts">All CRM Contacts</option>
                    <option value="Wholesale Clients">Wholesale Clients</option>
                    <option value="Active Shipments">Active Shipments</option>
                    <option value="VIP Prospects">VIP Prospects</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Recipients</label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={totalRecipients}
                    onChange={(e) => setTotalRecipients(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#25D366]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meta Approved Template</label>
                <select
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:border-[#25D366]"
                >
                  <option value="ramadan_special_discount">ramadan_special_discount (Marketing)</option>
                  <option value="shipment_vessel_update">shipment_vessel_update (Utility)</option>
                  <option value="lead_follow_up_greeting">lead_follow_up_greeting (Authentication / Service)</option>
                  <option value="invoice_payment_reminder">invoice_payment_reminder (Utility)</option>
                </select>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Compliant with Meta WhatsApp Cloud API marketing and utility policies.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Schedule Dispatch (Optional)</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#25D366]"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Leave empty to save as draft or dispatch immediately.
                </span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-semibold shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
