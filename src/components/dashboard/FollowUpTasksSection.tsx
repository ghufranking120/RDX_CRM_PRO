import React, { useState } from 'react';
import { CalendarCheck, Plus, CheckCircle2, Clock, X, AlertCircle } from 'lucide-react';
import { FollowUpTask } from '../../types';
import { storageService } from '../../services/storage';

export const FollowUpTasksSection: React.FC = () => {
  const [tasks, setTasks] = useState<FollowUpTask[]>(storageService.getFollowUpTasks());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState<{
    contactName: string;
    contactPhone: string;
    title: string;
    dueTime: string;
    priority: 'urgent' | 'normal' | 'low';
    assignedTo: string;
  }>({
    contactName: '',
    contactPhone: '',
    title: '',
    dueTime: 'Tomorrow, 10:00 AM',
    priority: 'normal',
    assignedTo: 'Marcus Vance',
  });

  const loadData = () => {
    setTasks(storageService.getFollowUpTasks());
  };

  const toggleTask = (taskId: string) => {
    storageService.toggleTaskCompleted(taskId);
    loadData();
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.contactName) return;

    const task: FollowUpTask = {
      id: `task_${Date.now()}`,
      contactId: `cnt_${Date.now()}`,
      contactName: newTask.contactName,
      contactPhone: newTask.contactPhone || '+1 (555) 000-0000',
      title: newTask.title,
      dueTime: newTask.dueTime,
      priority: newTask.priority,
      completed: false,
      assignedTo: newTask.assignedTo,
    };

    storageService.addTask(task);
    setShowAddModal(false);
    setNewTask({
      contactName: '',
      contactPhone: '',
      title: '',
      dueTime: 'Tomorrow, 10:00 AM',
      priority: 'normal',
      assignedTo: 'Marcus Vance',
    });
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#101D35]">Follow-up Tasks & Reminders</h2>
          <p className="text-xs text-slate-500">
            Keep track of client commitments, document deliveries, and callback deadlines.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#101D35] hover:bg-slate-900 text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#55B9F5]" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 flex items-center justify-between gap-4 transition-colors ${
              task.completed ? 'bg-slate-50/60 opacity-60' : 'hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                  task.completed
                    ? 'bg-[#25D366] border-[#25D366] text-white'
                    : 'border-slate-300 hover:border-[#55B9F5]'
                }`}
              >
                {task.completed && <CheckCircle2 className="w-4 h-4" />}
              </button>

              <div className="min-w-0">
                <h4
                  className={`text-xs font-bold ${
                    task.completed ? 'line-through text-slate-500' : 'text-[#101D35]'
                  }`}
                >
                  {task.title}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                  <span className="font-medium text-slate-700">Client: {task.contactName}</span>
                  <span>·</span>
                  <span className="font-mono">{task.contactPhone}</span>
                  <span>·</span>
                  <span>Assigned to {task.assignedTo}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{task.dueTime}</span>
              </div>

              <span
                className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                  task.priority === 'urgent'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {task.priority}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ADD TASK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#101D35]">Create Follow-up Task</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Confirm customs clearance document with client"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kamran Ashraf"
                    value={newTask.contactName}
                    onChange={(e) => setNewTask({ ...newTask, contactName: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Phone (WhatsApp)</label>
                  <input
                    type="tel"
                    placeholder="+92 312 4567890"
                    value={newTask.contactPhone}
                    onChange={(e) => setNewTask({ ...newTask, contactPhone: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Due Schedule *</label>
                  <input
                    type="text"
                    value={newTask.dueTime}
                    onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="low">Low</option>
                  </select>
                </div>
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
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
