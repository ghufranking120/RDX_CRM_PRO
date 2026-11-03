import React, { useState } from 'react';
import { Users, Search, Download, ShieldCheck, UserCheck, AlertTriangle } from 'lucide-react';
import { User, UserRole } from '../../types';
import { storageService } from '../../services/storage';

export const AdminUserManagementSection: React.FC = () => {
  const [users, setUsers] = useState<User[]>(storageService.getUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const loadData = () => {
    setUsers(storageService.getUsers());
  };

  const handleToggleStatus = (user: User) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    const updated: User = { ...user, status: newStatus };
    storageService.updateUser(updated);
    storageService.addAuditLog({
      actor: 'Ghufran King (Super Admin)',
      role: 'super_admin',
      action: 'TOGGLE_USER_STATUS',
      target: `${user.name} (${newStatus})`,
      ipAddress: '127.0.0.1',
      status: 'Success',
    });
    loadData();
  };

  const handleChangeRole = (user: User, newRole: UserRole) => {
    const updated: User = { ...user, role: newRole };
    storageService.updateUser(updated);
    storageService.addAuditLog({
      actor: 'Ghufran King (Super Admin)',
      role: 'super_admin',
      action: 'UPDATE_USER_ROLE',
      target: `${user.name} -> ${newRole}`,
      ipAddress: '127.0.0.1',
      status: 'Success',
    });
    loadData();
  };

  const handleExportUsers = () => {
    const headers = ['ID,Name,Email,Role,BusinessName,Status,CreatedAt,LastActive'];
    const rows = users.map((u) =>
      `"${u.id}","${u.name}","${u.email}","${u.role}","${u.businessName}","${u.status}","${u.createdAt}","${u.lastActive}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `rdx_users_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.businessName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">B. Global User Management</h2>
          <p className="text-xs text-slate-400">
            View registered user credentials, assign roles, activate or suspend platform access.
          </p>
        </div>

        <button
          onClick={handleExportUsers}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Users CSV</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span>Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-1.5 bg-slate-800 border border-slate-700 text-white rounded-lg text-xs"
          >
            <option value="all">All Roles</option>
            <option value="Platform Super Admin">Platform Super Admin</option>
            <option value="Business Owner">Business Owner</option>
            <option value="Business Admin">Business Admin</option>
            <option value="Team Agent">Team Agent</option>
            <option value="Read-only Manager">Read-only Manager</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-white font-bold border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <span className="font-bold text-white block">{user.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{user.email}</span>
                  </td>

                  <td className="py-3 px-4 text-slate-300">{user.businessName}</td>

                  <td className="py-3 px-4">
                    <select
                      value={
                        user.role === 'super_admin'
                          ? 'Platform Super Admin'
                          : user.role === 'business_admin'
                          ? 'Business Owner'
                          : user.role === 'agent'
                          ? 'Team Agent'
                          : user.role
                      }
                      onChange={(e) => handleChangeRole(user, e.target.value as UserRole)}
                      className="p-1 bg-slate-800 border border-slate-700 text-xs text-white rounded font-medium"
                    >
                      <option value="Platform Super Admin">Platform Super Admin</option>
                      <option value="Business Owner">Business Owner</option>
                      <option value="Business Admin">Business Admin</option>
                      <option value="Team Agent">Team Agent</option>
                      <option value="Read-only Manager">Read-only Manager</option>
                    </select>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        user.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {user.createdAt.substring(0, 10)}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(user)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                        user.status === 'active'
                          ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
                          : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {user.status === 'active' ? 'Suspend' : 'Reactivate'}
                    </button>
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
