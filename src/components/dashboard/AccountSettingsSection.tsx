import React, { useState } from 'react';
import { Building, Phone, Mail, MapPin, Globe, CheckCircle2, Shield } from 'lucide-react';
import { storageService, OFFICIAL_WHATSAPP_LINK } from '../../services/storage';

export const AccountSettingsSection: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    businessName: 'TechCorp Logistics',
    whatsappPhone: '+1 (555) 019-2831',
    billingEmail: 'billing@techcorp.io',
    timezone: 'America/New_York (GMT-5)',
    address: '450 Lexington Ave, Suite 1200, New York, NY 10017',
    website: 'https://techcorp.io',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#101D35]">Account & Business Settings</h2>
        <p className="text-xs text-slate-500">
          Manage your organization profile, verified WhatsApp business display number, and localization defaults.
        </p>
      </div>

      <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        {saved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Business Display Name</label>
            <input
              type="text"
              required
              value={profile.businessName}
              onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Verified WhatsApp Number</label>
              <input
                type="text"
                readOnly
                value={profile.whatsappPhone}
                className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg font-mono text-slate-600"
              />
              <p className="text-[10px] text-slate-400">Locked to official Meta WABA certificate</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Billing & Notice Email</label>
              <input
                type="email"
                required
                value={profile.billingEmail}
                onChange={(e) => setProfile({ ...profile, billingEmail: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Default Operating Timezone</label>
              <select
                value={profile.timezone}
                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              >
                <option value="America/New_York (GMT-5)">America/New_York (GMT-5)</option>
                <option value="Asia/Karachi (GMT+5)">Asia/Karachi (GMT+5)</option>
                <option value="Europe/London (GMT+0)">Europe/London (GMT+0)</option>
                <option value="Asia/Dubai (GMT+4)">Asia/Dubai (GMT+4)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Corporate Website</label>
              <input
                type="url"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Registered Corporate Address</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#101D35] hover:bg-slate-900 text-white rounded-xl font-semibold shadow-xs transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
