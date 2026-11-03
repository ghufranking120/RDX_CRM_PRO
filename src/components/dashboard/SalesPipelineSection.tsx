import React, { useState } from 'react';
import {
  GitBranch,
  Plus,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  X,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { PipelineDeal, PipelineStage } from '../../types';
import { storageService, OFFICIAL_WHATSAPP_LINK } from '../../services/storage';

export const SalesPipelineSection: React.FC = () => {
  const [deals, setDeals] = useState<PipelineDeal[]>(storageService.getPipelineDeals());
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [newDeal, setNewDeal] = useState<{
    title: string;
    contactName: string;
    contactPhone: string;
    value: number;
    stage: PipelineStage;
    assignedAgent: string;
    priority: 'low' | 'medium' | 'high';
  }>({
    title: '',
    contactName: '',
    contactPhone: '',
    value: 12000,
    stage: 'new',
    assignedAgent: 'Marcus Vance',
    priority: 'medium',
  });

  const loadData = () => {
    setDeals(storageService.getPipelineDeals());
  };

  const stages: { id: PipelineStage; label: string }[] = [
    { id: 'new', label: 'New Lead' },
    { id: 'contacted', label: 'Contacted' },
    { id: 'qualified', label: 'Qualified' },
    { id: 'proposal', label: 'Proposal Sent' },
    { id: 'won', label: 'Closed Won' },
  ];

  const moveStage = (dealId: string, direction: 'forward' | 'back') => {
    const deal = deals.find((d) => d.id === dealId);
    if (!deal) return;

    const stageOrder: PipelineStage[] = ['new', 'contacted', 'qualified', 'proposal', 'won'];
    const currentIndex = stageOrder.indexOf(deal.stage);
    let nextIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex >= 0 && nextIndex < stageOrder.length) {
      storageService.updateDealStage(dealId, stageOrder[nextIndex]);
      loadData();
    }
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeal.title || !newDeal.contactName) return;

    const created: PipelineDeal = {
      id: `deal_${Date.now()}`,
      title: newDeal.title,
      contactId: `cnt_${Date.now()}`,
      contactName: newDeal.contactName,
      contactPhone: newDeal.contactPhone || '+1 (555) 000-0000',
      stage: newDeal.stage,
      value: Number(newDeal.value) || 0,
      currency: 'USD',
      assignedAgent: newDeal.assignedAgent,
      expectedCloseDate: '2026-04-30',
      priority: newDeal.priority,
    };

    storageService.addDeal(created);
    setShowAddDealModal(false);
    setNewDeal({
      title: '',
      contactName: '',
      contactPhone: '',
      value: 12000,
      stage: 'new',
      assignedAgent: 'Marcus Vance',
      priority: 'medium',
    });
    loadData();
  };

  const totalValue = deals.reduce((sum, d) => sum + (d.stage !== 'lost' ? d.value : 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#101D35]">Sales Pipeline Kanban</h2>
          <p className="text-xs text-slate-500">
            Total active pipeline value:{' '}
            <span className="font-bold font-mono text-[#101D35]">${totalValue.toLocaleString()} USD</span>
          </p>
        </div>

        <button
          onClick={() => setShowAddDealModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#101D35] hover:bg-slate-900 text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#55B9F5]" />
          <span>Add Opportunity</span>
        </button>
      </div>

      {/* Kanban Board 5 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map((st) => {
          const stageDeals = deals.filter((d) => d.stage === st.id);
          const colSum = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div
              key={st.id}
              className="bg-slate-50 rounded-2xl border border-slate-200 p-3.5 flex flex-col min-w-[220px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                <div>
                  <h3 className="text-xs font-bold text-[#101D35] uppercase tracking-wide">
                    {st.label}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    ${colSum.toLocaleString()} ({stageDeals.length})
                  </p>
                </div>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[620px]">
                {stageDeals.length === 0 ? (
                  <div className="py-8 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-xl">
                    No deals in this stage
                  </div>
                ) : (
                  stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-[#55B9F5]/80 hover:shadow-sm transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-[#101D35] leading-snug line-clamp-2">
                          {deal.title}
                        </h4>
                        <span
                          className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0 ${
                            deal.priority === 'high'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {deal.priority}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <p className="text-[11px] font-semibold text-slate-700">{deal.contactName}</p>
                        <p className="text-[10px] font-mono text-slate-400">{deal.contactPhone}</p>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                        <span className="font-extrabold font-mono text-[#101D35]">
                          ${deal.value.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400">{deal.assignedAgent}</span>
                      </div>

                      {/* Move Buttons */}
                      <div className="flex items-center justify-between pt-1 gap-1">
                        <button
                          onClick={() => moveStage(deal.id, 'back')}
                          disabled={deal.stage === 'new'}
                          className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 text-slate-600 transition-colors"
                          title="Move back"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => moveStage(deal.id, 'forward')}
                          disabled={deal.stage === 'won'}
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#EAF6FF] hover:bg-[#d4ecff] text-[#101D35] text-[10px] font-semibold transition-colors disabled:opacity-30"
                        >
                          <span>Advance</span>
                          <ChevronRight className="w-3 h-3 text-[#55B9F5]" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD DEAL MODAL */}
      {showAddDealModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#101D35]">Create Pipeline Opportunity</h3>
              <button onClick={() => setShowAddDealModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Opportunity Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Refrigerated Container Contract"
                  value={newDeal.title}
                  onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elena Rostova"
                    value={newDeal.contactName}
                    onChange={(e) => setNewDeal({ ...newDeal, contactName: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Phone (WhatsApp)</label>
                  <input
                    type="tel"
                    placeholder="+44 7700 900123"
                    value={newDeal.contactPhone}
                    onChange={(e) => setNewDeal({ ...newDeal, contactPhone: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Deal Value ($ USD) *</label>
                  <input
                    type="number"
                    required
                    value={newDeal.value}
                    onChange={(e) => setNewDeal({ ...newDeal, value: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Initial Stage</label>
                  <select
                    value={newDeal.stage}
                    onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value as PipelineStage })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="new">New Lead</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal Sent</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Priority Level</label>
                <select
                  value={newDeal.priority}
                  onChange={(e) => setNewDeal({ ...newDeal, priority: e.target.value as any })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDealModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#101D35] hover:bg-slate-900 text-white rounded-lg font-semibold"
                >
                  Save Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
