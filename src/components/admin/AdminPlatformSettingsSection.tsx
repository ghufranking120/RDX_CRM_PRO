import React, { useState } from 'react';
import { Settings, Save, Check, Phone, ShieldAlert, UserPlus } from 'lucide-react';
import { PlatformSettings } from '../../types';
import { storageService, OFFICIAL_WHATSAPP_LINK, OFFICIAL_WHATSAPP_NUMBER } from '../../services/storage';

export const AdminPlatformSettingsSection: React.FC = () => {
  const [settings, setSettings] = useState<PlatformSettings>(storageService.getPlatformSettings());
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.savePlatformSettings(settings);
    storageService.addAuditLog({
      actor: 'Ghufran King (Super Admin)',
      role: 'super_admin',
      action: 'UPDATE_PLATFORM_SETTINGS',
      target: 'Platform operational parameters updated',
      ipAddress: '127.0.0.1',
      status: 'Success',
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-white">G. Master Platform Settings</h2>
        <p className="text-xs text-slate-400">
          Core platform branding, official WhatsApp contact endpoints, registration controls, and maintenance modes.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Platform settings updated and persisted successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-slate-900/80 p-7 rounded-2xl border border-slate-800 space-y-5 text-xs text-slate-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-white">Platform Brand Name</label>
            <input
              type="text"
              required
              value={settings.platformName}
              onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-white">Platform Tagline</label>
            <input
              type="text"
              required
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
            />
          </div>
        </div>

        {/* WhatsApp Official Contact Information */}
        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <Phone className="w-4 h-4 text-[#25D366]" />
            <span>Official WhatsApp Platform Contact Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-400">Contact Number</label>
              <input
                type="text"
                readOnly
                value={settings.whatsappNumber}
                className="w-full p-2 bg-slate-800 border border-slate-700 text-white font-mono rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">WhatsApp Link</label>
              <input
                type="text"
                readOnly
                value={settings.whatsappLink}
                className="w-full p-2 bg-slate-800 border border-slate-700 text-white font-mono rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-white">Support Desk Email</label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-white">Default Server Timezone</label>
            <input
              type="text"
              value={settings.defaultTimezone}
              onChange={(e) => setSettings({ ...settings, defaultTimezone: e.target.value })}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg"
            />
          </div>
        </div>

        {/* System Toggles */}
        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 space-y-3">
          <span className="font-bold text-white block">System Access Switches</span>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Public User Registration</p>
              <p className="text-[11px] text-slate-400">Allow new businesses to self-register for trial</p>
            </div>
            <input
              type="checkbox"
              checked={settings.registrationOpen}
              onChange={(e) => setSettings({ ...settings, registrationOpen: e.target.checked })}
              className="w-4 h-4 rounded text-[#55B9F5]"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-700">
            <div>
              <p className="font-semibold text-white">Platform Maintenance Mode</p>
              <p className="text-[11px] text-slate-400">Display maintenance page to non-admin visitors</p>
            </div>
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              className="w-4 h-4 rounded text-[#55B9F5]"
            />
          </div>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#55B9F5] hover:bg-[#38A9F3] text-[#101D35] rounded-xl font-bold transition-colors flex items-center gap-2 shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Master Platform Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
