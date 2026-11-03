import React, { useState } from 'react';
import { UserCheck, Plus, Mail, Phone, Shield, X } from 'lucide-react';
import { TeamMember } from '../../types';
import { storageService } from '../../services/storage';

export const TeamMembersSection: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>(storageService.getTeamMembers());
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newMember, setNewMember] = useState<{
    name: string;
    email: string;
    role: 'Owner' | 'Admin' | 'Agent';
    phone: string;
  }>({
    name: '',
    email: '',
    role: 'Agent',
    phone: '',
  });

  const loadData = () => {
    setTeam(storageService.getTeamMembers());
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;

    const created: TeamMember = {
      id: `tm_${Date.now()}`,
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      phone: newMember.phone || '+1 (555) 000-0000',
      status: 'invited',
      assignedChatsCount: 0,
    };

    storageService.addTeamMember(created);
    setShowInviteModal(false);
    setNewMember({
      name: '',
      email: '',
      role: 'Agent',
      phone: '',
    });
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#101D35]">Team Members & Agent Seats</h2>
          <p className="text-xs text-slate-500">
            Allocate agent licenses to team members sharing your business WhatsApp number.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#101D35] hover:bg-slate-900 text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#55B9F5]" />
          <span>Invite Agent</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-[#101D35] font-bold border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4">Member Name</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Phone</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Assigned Chats</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {team.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-[#101D35]">{member.name}</div>
                  <div className="text-[11px] text-slate-400">{member.email}</div>
                </td>

                <td className="py-3 px-4">
                  <span className="font-semibold text-slate-700">{member.role}</span>
                </td>

                <td className="py-3 px-4 font-mono text-slate-600">{member.phone}</td>

                <td className="py-3 px-4">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      member.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {member.status}
                  </span>
                </td>

                <td className="py-3 px-4 font-mono font-bold text-[#101D35]">
                  {member.assignedChatsCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* INVITE MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#101D35]">Invite Agent to Team</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leo Martin"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="leo@company.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Role</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value as any })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  <option value="Agent">Agent (Inbox & Contacts)</option>
                  <option value="Admin">Admin (Full Team & Settings)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Phone</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#101D35] hover:bg-slate-900 text-white rounded-lg font-semibold"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
