import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Download,
  Trash2,
  Edit2,
  Phone,
  Mail,
  Building,
  Tag,
  CheckCircle2,
  X,
  AlertTriangle,
} from 'lucide-react';
import { Contact, LeadStatus, LeadSource } from '../../types';
import { storageService } from '../../services/storage';

export const ContactsSection: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(storageService.getContacts('biz_01'));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  // New Contact Form State
  const [newContact, setNewContact] = useState<{
    name: string;
    phone: string;
    email: string;
    company: string;
    leadSource: LeadSource;
    leadStatus: LeadStatus;
    tags: string;
    estimatedDealValue: number;
  }>({
    name: '',
    phone: '',
    email: '',
    company: '',
    leadSource: 'WhatsApp Inbound',
    leadStatus: 'New',
    tags: 'Inbound, General',
    estimatedDealValue: 5000,
  });

  const loadData = () => {
    setContacts(storageService.getContacts('biz_01'));
  };

  // Add Contact
  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;

    const created: Contact = {
      id: `cnt_${Date.now()}`,
      businessId: 'biz_01',
      name: newContact.name,
      phone: newContact.phone,
      email: newContact.email || undefined,
      company: newContact.company || undefined,
      tags: newContact.tags.split(',').map((t) => t.trim()).filter(Boolean),
      leadSource: newContact.leadSource,
      leadStatus: newContact.leadStatus,
      assignedToAgentId: 'user_agent_01',
      assignedToAgentName: 'Marcus Vance',
      estimatedDealValue: Number(newContact.estimatedDealValue) || 0,
      createdAt: new Date().toISOString(),
      lastContactedAt: new Date().toISOString(),
      notes: [],
    };

    storageService.addContact(created);
    setShowAddModal(false);
    setNewContact({
      name: '',
      phone: '',
      email: '',
      company: '',
      leadSource: 'WhatsApp Inbound',
      leadStatus: 'New',
      tags: 'Inbound, General',
      estimatedDealValue: 5000,
    });
    loadData();
  };

  // Delete Contact
  const confirmDelete = () => {
    if (!contactToDelete) return;
    storageService.deleteContact(contactToDelete.id);
    setContactToDelete(null);
    loadData();
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID,Name,Phone,Email,Company,LeadSource,LeadStatus,DealValue'];
    const rows = contacts.map((c) =>
      `"${c.id}","${c.name}","${c.phone}","${c.email || ''}","${c.company || ''}","${c.leadSource}","${c.leadStatus}","${c.estimatedDealValue || 0}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rdx_contacts_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = selectedTag === 'all' || c.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6">
      {/* Header with Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#101D35]">Contacts Directory</h2>
          <p className="text-xs text-slate-500">
            Manage your verified customer records, WhatsApp phone numbers, and pipeline attributes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#101D35] hover:bg-slate-900 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#55B9F5]" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone, company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-slate-500">
          <span>Filter by Tag:</span>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
          >
            <option value="all">All Tags</option>
            <option value="Wholesale">Wholesale</option>
            <option value="High Priority">High Priority</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Medical Logistics">Medical Logistics</option>
            <option value="Inbound Lead">Inbound Lead</option>
          </select>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[#101D35] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Phone (WhatsApp)</th>
                <th className="py-3.5 px-4">Company</th>
                <th className="py-3.5 px-4">Tags</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Assigned Agent</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No contacts found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#101D35]">{contact.name}</div>
                      {contact.email && <div className="text-[11px] text-slate-400">{contact.email}</div>}
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      {contact.phone}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {contact.company || '—'}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {contact.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#EAF6FF] text-[#101D35] border border-[#55B9F5]/30">
                        {contact.leadStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {contact.assignedToAgentName}
                    </td>

                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setContactToDelete(contact)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete Contact"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD CONTACT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#101D35]">Create New CRM Contact</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mehmood"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Phone (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+92 300 1234567"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  placeholder="contact@client.com"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Global Exports Ltd"
                  value={newContact.company}
                  onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Lead Source</label>
                  <select
                    value={newContact.leadSource}
                    onChange={(e) => setNewContact({ ...newContact, leadSource: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="WhatsApp Inbound">WhatsApp Inbound</option>
                    <option value="Website Form">Website Form</option>
                    <option value="Meta Ad">Meta Ad</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Initial Status</label>
                  <select
                    value={newContact.leadStatus}
                    onChange={(e) => setNewContact({ ...newContact, leadStatus: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="Wholesale, High Priority"
                  value={newContact.tags}
                  onChange={(e) => setNewContact({ ...newContact, tags: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none"
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
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG */}
      {contactToDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-sm text-[#101D35]">Confirm Deletion</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-[#101D35]">{contactToDelete.name}</span>? This action will remove this contact from the CRM directory.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setContactToDelete(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-xs"
              >
                Delete Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
