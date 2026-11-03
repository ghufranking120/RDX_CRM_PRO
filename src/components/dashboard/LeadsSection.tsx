import React, { useState } from 'react';
import { Target, Search, Filter, TrendingUp, CheckCircle2, UserCheck, PhoneCall } from 'lucide-react';
import { Contact, LeadStatus } from '../../types';
import { storageService } from '../../services/storage';

export const LeadsSection: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(storageService.getContacts('biz_01'));
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = () => {
    setContacts(storageService.getContacts('biz_01'));
  };

  const handleUpdateStatus = (contactId: string, newStatus: LeadStatus) => {
    const list = storageService.getAllContacts();
    const contact = list.find((c) => c.id === contactId);
    if (contact) {
      contact.leadStatus = newStatus;
      storageService.updateContact(contact);
      loadData();
    }
  };

  const filteredLeads = contacts.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.leadStatus === statusFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const stageCounts = {
    New: contacts.filter((c) => c.leadStatus === 'New').length,
    Contacted: contacts.filter((c) => c.leadStatus === 'Contacted').length,
    Qualified: contacts.filter((c) => c.leadStatus === 'Qualified').length,
    Won: contacts.filter((c) => c.leadStatus === 'Won').length,
    Lost: contacts.filter((c) => c.leadStatus === 'Lost').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#101D35]">Leads & Opportunity Tracker</h2>
        <p className="text-xs text-slate-500">
          Track inbound inquiries as they qualify into high-value closed opportunities.
        </p>
      </div>

      {/* Stage KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(['New', 'Contacted', 'Qualified', 'Won', 'Lost'] as LeadStatus[]).map((stage) => (
          <div
            key={stage}
            onClick={() => setStatusFilter(statusFilter === stage ? 'all' : stage)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              statusFilter === stage
                ? 'bg-[#101D35] text-white border-[#101D35] shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider opacity-75">{stage}</div>
            <div className="text-2xl font-extrabold font-mono mt-1 tabular-nums">
              {stageCounts[stage]}
            </div>
          </div>
        ))}
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span>Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          >
            <option value="all">All Stages</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[#101D35] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Lead Name</th>
                <th className="py-3.5 px-4">Company</th>
                <th className="py-3.5 px-4">Lead Source</th>
                <th className="py-3.5 px-4">Est. Deal Value</th>
                <th className="py-3.5 px-4">Current Stage</th>
                <th className="py-3.5 px-4">Assigned Agent</th>
                <th className="py-3.5 px-4 text-right">Quick Stage Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#101D35]">{lead.name}</span>
                    <span className="block text-[11px] font-mono text-slate-400">{lead.phone}</span>
                  </td>

                  <td className="py-3 px-4 text-slate-600">{lead.company || 'Direct Buyer'}</td>

                  <td className="py-3 px-4">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {lead.leadSource}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-[#101D35]">
                    ${(lead.estimatedDealValue || 0).toLocaleString()}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        lead.leadStatus === 'Won'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : lead.leadStatus === 'Lost'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-[#EAF6FF] text-[#101D35] border border-[#55B9F5]/30'
                      }`}
                    >
                      {lead.leadStatus}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-600">{lead.assignedToAgentName}</td>

                  <td className="py-3 px-4 text-right">
                    <select
                      value={lead.leadStatus}
                      onChange={(e) => handleUpdateStatus(lead.id, e.target.value as LeadStatus)}
                      className="text-xs p-1 bg-slate-50 border border-slate-200 rounded-md font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="New">Set: New</option>
                      <option value="Contacted">Set: Contacted</option>
                      <option value="Qualified">Set: Qualified</option>
                      <option value="Won">Set: Won</option>
                      <option value="Lost">Set: Lost</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
