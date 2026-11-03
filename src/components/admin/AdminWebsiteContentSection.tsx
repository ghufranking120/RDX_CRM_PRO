import React, { useState } from 'react';
import { Globe, Save, Check, RefreshCw, Eye, Sparkles } from 'lucide-react';
import { WebsiteContent } from '../../types';
import { storageService, OFFICIAL_WHATSAPP_LINK } from '../../services/storage';

export const AdminWebsiteContentSection: React.FC = () => {
  const [content, setContent] = useState<WebsiteContent>(storageService.getWebsiteContent());
  const [previewMode, setPreviewMode] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveWebsiteContent(content);
    storageService.addAuditLog({
      actor: 'Ghufran King (Super Admin)',
      role: 'super_admin',
      action: 'UPDATE_WEBSITE_CMS',
      target: 'Published live changes to public website content',
      ipAddress: '127.0.0.1',
      status: 'Success',
    });
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const handleRestoreDefaults = () => {
    const defaults: WebsiteContent = {
      heroHeadline: 'Manage Every Customer Conversation in One Place',
      heroSubtitle: 'Empower your sales, support, and operations teams with an enterprise-grade WhatsApp CRM. Built for speed, team collaboration, and measurable deal velocity.',
      announcementText: '🚀 Official WhatsApp Cloud API integration is live! Start managing customer conversations in real-time.',
      announcementActive: true,
      aboutMission: 'RDX CRM connects modern commerce teams to where their customers already communicate: WhatsApp. We eliminate scattered chats, unassigned leads, and delayed replies with a unified team inbox, smart pipeline tracking, and workflow automation.',
      contactPhone: '+923138066389',
      contactWhatsappLink: 'https://wa.me/923138066389',
      contactEmail: 'contact@rdxcrm.com',
      footerText: '© 2026 RDX CRM. All rights reserved. Smart Conversations. Better Customer Relationships.',
    };
    setContent(defaults);
    storageService.saveWebsiteContent(defaults);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">D. Website Content Management (CMS)</h2>
          <p className="text-xs text-slate-400">
            Edit live public website headlines, announcement banners, mission copy, and footer disclaimers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{previewMode ? 'Exit Preview' : 'Live Preview'}</span>
          </button>

          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restore Defaults</span>
          </button>
        </div>
      </div>

      {savedNotification && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Website content successfully updated and published live to visitors!</span>
        </div>
      )}

      {/* Live Preview Box */}
      {previewMode && (
        <div className="bg-white text-[#101D35] p-6 rounded-2xl border-2 border-[#55B9F5] shadow-xl space-y-4">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#EAF6FF] text-[#101D35]">
            Live Public Preview
          </span>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">{content.heroHeadline}</h1>
            <p className="text-sm text-slate-600 max-w-2xl">{content.heroSubtitle}</p>
          </div>
          {content.announcementActive && (
            <div className="p-2.5 bg-[#EAF6FF] text-[#101D35] text-xs font-medium rounded-lg">
              {content.announcementText}
            </div>
          )}
        </div>
      )}

      {/* CMS Edit Form */}
      <form onSubmit={handlePublish} className="bg-slate-900/80 p-7 rounded-2xl border border-slate-800 space-y-5 text-xs text-slate-300">
        <div className="space-y-1.5">
          <label className="font-semibold text-white">Homepage Hero Headline *</label>
          <input
            type="text"
            required
            value={content.heroHeadline}
            onChange={(e) => setContent({ ...content, heroHeadline: e.target.value })}
            className="w-full p-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-white">Homepage Hero Subtitle *</label>
          <textarea
            rows={3}
            required
            value={content.heroSubtitle}
            onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
            className="w-full p-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-3 bg-slate-800/40 rounded-xl border border-slate-800">
          <div className="sm:col-span-8 space-y-1">
            <label className="font-semibold text-white">Top Announcement Bar Text</label>
            <input
              type="text"
              value={content.announcementText}
              onChange={(e) => setContent({ ...content, announcementText: e.target.value })}
              className="w-full p-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none"
            />
          </div>

          <div className="sm:col-span-4 flex items-center gap-2 pt-2 sm:pt-4">
            <input
              type="checkbox"
              id="annActive"
              checked={content.announcementActive}
              onChange={(e) => setContent({ ...content, announcementActive: e.target.checked })}
              className="w-4 h-4 rounded text-[#55B9F5]"
            />
            <label htmlFor="annActive" className="text-xs font-semibold text-white cursor-pointer">
              Show Announcement Banner
            </label>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-white">About Page Mission Statement</label>
          <textarea
            rows={3}
            value={content.aboutMission}
            onChange={(e) => setContent({ ...content, aboutMission: e.target.value })}
            className="w-full p-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-semibold text-white">Contact Email</label>
            <input
              type="email"
              value={content.contactEmail}
              onChange={(e) => setContent({ ...content, contactEmail: e.target.value })}
              className="w-full p-2 bg-slate-800 border border-slate-700 text-white rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-white">WhatsApp Contact Number</label>
            <input
              type="text"
              readOnly
              value={content.contactPhone}
              className="w-full p-2 bg-slate-800/60 border border-slate-700 text-slate-400 font-mono rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-white">Footer Copyright & Legal Disclaimer</label>
          <input
            type="text"
            value={content.footerText}
            onChange={(e) => setContent({ ...content, footerText: e.target.value })}
            className="w-full p-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg"
          />
        </div>

        <div className="pt-3">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#55B9F5] hover:bg-[#38A9F3] text-[#101D35] rounded-xl font-bold shadow-xs transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Publish Changes to Live Website</span>
          </button>
        </div>
      </form>
    </div>
  );
};
