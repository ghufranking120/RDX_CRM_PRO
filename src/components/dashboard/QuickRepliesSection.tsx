import React, { useState } from 'react';
import { Zap, Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { QuickReply } from '../../types';
import { storageService } from '../../services/storage';

export const QuickRepliesSection: React.FC = () => {
  const [replies, setReplies] = useState<QuickReply[]>(storageService.getQuickReplies());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReply, setNewReply] = useState<{
    shortcut: string;
    title: string;
    message: string;
    category: 'General' | 'Sales' | 'Support' | 'Onboarding';
  }>({
    shortcut: '/hello',
    title: '',
    message: '',
    category: 'General',
  });

  const loadData = () => {
    setReplies(storageService.getQuickReplies());
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.shortcut || !newReply.message) return;

    let shortcut = newReply.shortcut.trim();
    if (!shortcut.startsWith('/')) {
      shortcut = '/' + shortcut;
    }

    const created: QuickReply = {
      id: `qr_${Date.now()}`,
      shortcut,
      title: newReply.title || shortcut,
      message: newReply.message,
      category: newReply.category,
    };

    storageService.addQuickReply(created);
    setShowAddModal(false);
    setNewReply({
      shortcut: '/hello',
      title: '',
      message: '',
      category: 'General',
    });
    loadData();
  };

  const handleDelete = (id: string) => {
    storageService.deleteQuickReply(id);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#101D35]">Quick Replies & Canned Responses</h2>
          <p className="text-xs text-slate-500">
            Speed up agent response times. Type slash commands (e.g. <span className="font-mono text-[#55B9F5]">/welcome</span>) directly inside the WhatsApp chat input.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#101D35] hover:bg-slate-900 text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#55B9F5]" />
          <span>New Quick Reply</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {replies.map((reply) => (
          <div
            key={reply.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#101D35]">{reply.title}</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#EAF6FF] text-[#101D35] border border-[#55B9F5]/30">
                  {reply.shortcut}
                </span>
              </div>

              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 inline-block">
                {reply.category}
              </span>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 font-sans">
                {reply.message}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
              <span className="text-[11px] text-slate-400">Insert shortcut: {reply.shortcut}</span>
              <button
                onClick={() => handleDelete(reply.id)}
                className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                title="Delete snippet"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#101D35]">Create Quick Reply</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Shortcut (starts with /) *</label>
                <input
                  type="text"
                  required
                  placeholder="/pricing"
                  value={newReply.shortcut}
                  onChange={(e) => setNewReply({ ...newReply, shortcut: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Snippet Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Standard Pricing Link"
                  value={newReply.title}
                  onChange={(e) => setNewReply({ ...newReply, title: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Category</label>
                <select
                  value={newReply.category}
                  onChange={(e) => setNewReply({ ...newReply, category: e.target.value as any })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  <option value="General">General</option>
                  <option value="Sales">Sales</option>
                  <option value="Support">Support</option>
                  <option value="Onboarding">Onboarding</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Full Message Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type the pre-crafted response..."
                  value={newReply.message}
                  onChange={(e) => setNewReply({ ...newReply, message: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
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
                  Save Quick Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
