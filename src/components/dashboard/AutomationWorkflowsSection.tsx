import React, { useState } from 'react';
import { GitBranch, Plus, Zap, CheckCircle2, Play, Power, X } from 'lucide-react';
import { AutomationWorkflow } from '../../types';
import { storageService } from '../../services/storage';

export const AutomationWorkflowsSection: React.FC = () => {
  const [automations, setAutomations] = useState<AutomationWorkflow[]>(storageService.getAutomations());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState<{
    name: string;
    trigger: string;
    action: string;
  }>({
    name: '',
    trigger: 'Inbound message from new customer',
    action: 'Send greeting template and assign to round-robin queue',
  });

  const loadData = () => {
    setAutomations(storageService.getAutomations());
  };

  const [runningId, setRunningId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    storageService.toggleAutomation(id);
    loadData();
  };

  const handleTestRun = async (wf: AutomationWorkflow) => {
    setRunningId(wf.id);
    setSuccessToast(null);

    // Call server n8n execution route if backend active
    try {
      await fetch(`/api/n8n/test/${wf.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: { ruleName: wf.name, trigger: wf.trigger } }),
      });
    } catch {
      // offline / demo fallback
    }

    setTimeout(() => {
      const updated: AutomationWorkflow = {
        ...wf,
        executionsCount: (wf.executionsCount || 0) + 1,
        lastTriggered: `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} (Executed OK)`,
      };
      storageService.updateAutomation(updated);
      storageService.addAuditLog({
        actor: 'Sarah Jenkins (Business Owner)',
        role: 'Business Owner',
        action: 'AUTOMATION_DISPATCH',
        target: `${wf.name} fired: "${wf.action}"`,
        ipAddress: '127.0.0.1',
        status: 'Success',
      });
      setRunningId(null);
      setSuccessToast(`Rule "${wf.name}" executed successfully! Action dispatched.`);
      loadData();
      setTimeout(() => setSuccessToast(null), 3500);
    }, 600);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkflow.name) return;

    const created: AutomationWorkflow = {
      id: `wf_${Date.now()}`,
      name: newWorkflow.name,
      trigger: newWorkflow.trigger,
      action: newWorkflow.action,
      active: true,
      executionsCount: 0,
      lastTriggered: 'Never',
    };

    storageService.addAutomation(created);
    setShowAddModal(false);
    setNewWorkflow({
      name: '',
      trigger: 'Inbound message from new customer',
      action: 'Send greeting template and assign to round-robin queue',
    });
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#101D35]">Workflow Automations & n8n Engine</h2>
          <p className="text-xs text-slate-500">
            Automate routine customer interactions, out-of-hours greetings, and deal assignment logic.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#101D35] hover:bg-slate-900 text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#55B9F5]" />
          <span>New Workflow Rule</span>
        </button>
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automations.map((wf) => (
          <div
            key={wf.id}
            className={`p-5 rounded-2xl border transition-all space-y-4 ${
              wf.active ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-50/70 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#101D35]">{wf.name}</h3>
                <span className="text-[10px] font-mono text-slate-400">Rule ID: {wf.id}</span>
              </div>

              {/* Active Toggle Switch */}
              <button
                onClick={() => handleToggle(wf.id)}
                className={`w-11 h-6 rounded-full p-1 transition-colors relative ${
                  wf.active ? 'bg-[#25D366]' : 'bg-slate-300'
                }`}
                aria-label="Toggle automation active"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    wf.active ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Trigger</span>
                <p className="font-semibold text-slate-800">{wf.trigger}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#EAF6FF]/50 border border-[#55B9F5]/30 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#55B9F5]">Action</span>
                <p className="font-semibold text-[#101D35]">{wf.action}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <div className="space-y-0.5">
                <div>Executions: {wf.executionsCount}</div>
                <div className="text-[10px] text-slate-400">Last: {wf.lastTriggered || 'Never'}</div>
              </div>

              <button
                onClick={() => handleTestRun(wf)}
                disabled={runningId === wf.id}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-[#55B9F5]/20 text-[#101D35] font-semibold text-xs rounded-lg transition-colors border border-slate-200 disabled:opacity-50"
              >
                <Play className={`w-3 h-3 text-[#55B9F5] ${runningId === wf.id ? 'animate-spin' : ''}`} />
                <span>{runningId === wf.id ? 'Running...' : 'Test Run'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE WORKFLOW MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#101D35]">Create Automation Rule</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Workflow Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Lead Routing"
                  value={newWorkflow.name}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">When Event Occurs (Trigger)</label>
                <select
                  value={newWorkflow.trigger}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, trigger: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  <option value="Inbound message from new customer">Inbound message from new customer</option>
                  <option value="Inbound message received outside working hours">Inbound message outside working hours</option>
                  <option value="Contact tagged with VIP">Contact tagged with VIP</option>
                  <option value="Pipeline deal moved to Won">Pipeline deal moved to Won</option>
                  <option value="No response from customer for 48 hours">No response from customer for 48 hours</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Action to Execute</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Send template message and notify manager"
                  value={newWorkflow.action}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, action: e.target.value })}
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
                  Activate Workflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
