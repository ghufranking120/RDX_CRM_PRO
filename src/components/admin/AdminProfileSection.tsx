import React, { useState } from 'react';
import {
  User,
  Shield,
  Key,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  Save,
} from 'lucide-react';
import { storageService } from '../../services/storage';

export const AdminProfileSection: React.FC = () => {
  const currentUser = storageService.getCurrentUser();
  const [name, setName] = useState(currentUser?.name || 'Ghufran King');
  const [email, setEmail] = useState(currentUser?.email || 'admin@rdxcrm.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+923138066389');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setActionMsg('Error: New passwords do not match.');
      return;
    }

    if (currentUser) {
      currentUser.name = name;
      currentUser.email = email;
      currentUser.phone = phone;
      storageService.setCurrentUser(currentUser);
      setActionMsg('Admin Profile and credentials updated securely.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setActionMsg(''), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#101D35] flex items-center gap-2">
          <span>Super Administrator Profile & Security</span>
          <span className="text-xs bg-red-100 text-red-800 font-semibold px-2 py-0.5 rounded-full">
            Root Authority
          </span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your master administrator account credentials, emergency phone, and security session controls.
        </p>
      </div>

      {actionMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMsg}</span>
        </div>
      )}

      <form onSubmit={handleUpdateProfile} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5 text-xs">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-[#101D35] text-white flex items-center justify-center font-bold text-xl">
            {name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#101D35]">{name}</h3>
            <span className="text-xs text-slate-500">Platform Super Administrator</span>
          </div>
        </div>

        <div className="space-y-3.5">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#25D366]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Root Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-[#25D366]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Emergency WhatsApp Phone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-[#25D366]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-3">
            <span className="font-bold text-slate-900 block">Change Administrator Password:</span>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#25D366]"
              />
            </div>

            {newPassword && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#25D366]"
                />
              </div>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-semibold shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile & Security</span>
          </button>
        </div>
      </form>
    </div>
  );
};
