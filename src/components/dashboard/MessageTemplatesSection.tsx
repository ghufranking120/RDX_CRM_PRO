import React, { useState } from 'react';
import { FileText, Plus, CheckCircle2, Clock, X, AlertCircle } from 'lucide-react';
import { MessageTemplate } from '../../types';
import { storageService } from '../../services/storage';

export const MessageTemplatesSection: React.FC = () => {
  const [templates, setTemplates] = useState<MessageTemplate[]>(storageService.getMessageTemplates());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState<{
    name: string;
    category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
    headerText: string;
    body: string;
    footerText: string;
    variables: string;
  }>({
    name: '',
    category: 'UTILITY',
    headerText: '',
    body: 'Hello {{1}}, your booking for {{2}} is confirmed.',
    footerText: 'Reply STOP to opt out',
    variables: 'Customer Name, Booking Date',
  });

  const loadData = () => {
    setTemplates(storageService.getMessageTemplates());
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplate.name || !newTemplate.body) return;

    const formattedName = newTemplate.name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const created: MessageTemplate = {
      id: `tmpl_${Date.now()}`,
      name: formattedName,
      language: 'en_US',
      category: newTemplate.category,
      status: 'APPROVED', // Meta simulation
      body: newTemplate.body,
      headerText: newTemplate.headerText || undefined,
      footerText: newTemplate.footerText || undefined,
      variables: newTemplate.variables.split(',').map((v) => v.trim()).filter(Boolean),
      lastUpdated: new Date().toISOString().substring(0, 10),
    };

    storageService.addMessageTemplate(created);
    setShowAddModal(false);
    setNewTemplate({
      name: '',
      category: 'UTILITY',
      headerText: '',
      body: '',
      footerText: '',
      variables: '',
    });
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#101D35]">WhatsApp Message Templates</h2>
          <p className="text-xs text-slate-500">
            Pre-approved Meta templates for initiating customer notifications, order alerts, and scheduled broadcasts.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#101D35] hover:bg-slate-900 text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#55B9F5]" />
          <span>Submit New Template</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-xs text-[#101D35] truncate">{tmpl.name}</span>
                <span
                  className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border shrink-0 ${
                    tmpl.status === 'APPROVED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {tmpl.status}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <span className="font-semibold uppercase tracking-wider">{tmpl.category}</span>
                <span>·</span>
                <span>Language: {tmpl.language}</span>
              </div>

              {/* Message Simulation Preview */}
              <div className="bg-[#EAF6FF]/40 border border-[#55B9F5]/30 rounded-xl p-3 text-xs text-slate-800 space-y-1.5">
                {tmpl.headerText && <p className="font-bold text-[#101D35] text-xs">{tmpl.headerText}</p>}
                <p className="leading-relaxed text-slate-700">{tmpl.body}</p>
                {tmpl.footerText && (
                  <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                    {tmpl.footerText}
                  </p>
                )}
              </div>
            </div>

            <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Variables: {tmpl.variables.length}</span>
              <span>Updated {tmpl.lastUpdated}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE TEMPLATE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#101D35]">Create Meta Message Template</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Template Identifier Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. shipping_dispatch_notice"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
                />
                <p className="text-[10px] text-slate-400">Lowercase letters and underscores only.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Category *</label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="UTILITY">UTILITY</option>
                    <option value="MARKETING">MARKETING</option>
                    <option value="AUTHENTICATION">AUTHENTICATION</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Header Title (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Order Update"
                    value={newTemplate.headerText}
                    onChange={(e) => setNewTemplate({ ...newTemplate, headerText: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Template Body (Use {'{{1}}'}, {'{{2}}'}) *</label>
                <textarea
                  rows={4}
                  required
                  value={newTemplate.body}
                  onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Footer Text</label>
                <input
                  type="text"
                  placeholder="e.g. Reply STOP to unsubscribe"
                  value={newTemplate.footerText}
                  onChange={(e) => setNewTemplate({ ...newTemplate, footerText: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#101D35] hover:bg-slate-900 text-white rounded-lg font-semibold"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
