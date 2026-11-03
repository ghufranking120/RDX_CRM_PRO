import React, { useState } from 'react';
import { Palette, Check, RotateCcw, Image, Globe, Sparkles } from 'lucide-react';
import { ThemeId, ThemeConfig } from '../../types';
import { storageService } from '../../services/storage';

export const AdminThemeAppearanceSection: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(storageService.getTheme());
  const [previewTheme, setPreviewTheme] = useState<ThemeId>(storageService.getTheme());
  const [logoUrl, setLogoUrl] = useState('data:image/svg+xml,...');
  const [notification, setNotification] = useState<string | null>(null);

  const themeList: ThemeConfig[] = [
    {
      id: 'premium_white',
      name: '1. Premium White (Default)',
      primaryColor: '#55B9F5',
      bgPreview: '#FFFFFF',
      cardPreview: '#F8FAFC',
      textColor: '#101D35',
      description: 'Clean enterprise white with dark navy headers and sky blue accents.',
    },
    {
      id: 'dark_professional',
      name: '2. Dark Professional',
      primaryColor: '#38BDF8',
      bgPreview: '#0B1120',
      cardPreview: '#152238',
      textColor: '#F8FAFC',
      description: 'Deep navy-slate dark mode tailored for high-focus operational teams.',
    },
    {
      id: 'ocean_blue',
      name: '3. Ocean Blue',
      primaryColor: '#00D8F6',
      bgPreview: '#0A192F',
      cardPreview: '#142B4D',
      textColor: '#E2E8F0',
      description: 'High-contrast oceanic azure and cyan accents on deep navy.',
    },
    {
      id: 'midnight',
      name: '4. Midnight',
      primaryColor: '#60A5FA',
      bgPreview: '#050811',
      cardPreview: '#101726',
      textColor: '#FFFFFF',
      description: 'Ultra-dark OLED black palette with vibrant sky-blue highlights.',
    },
    {
      id: 'royal_purple',
      name: '5. Royal Purple',
      primaryColor: '#C084FC',
      bgPreview: '#0F0A1E',
      cardPreview: '#201740',
      textColor: '#FAF5FF',
      description: 'Deep indigo and majestic violet accents for luxury commerce.',
    },
    {
      id: 'sunset',
      name: '6. Sunset',
      primaryColor: '#F97316',
      bgPreview: '#14121E',
      cardPreview: '#29243E',
      textColor: '#FFF7ED',
      description: 'Warm dusk navy with energizing coral and amber elements.',
    },
    {
      id: 'minimal_bw',
      name: '7. Minimal Black & White',
      primaryColor: '#18181B',
      bgPreview: '#FFFFFF',
      cardPreview: '#FAFAFA',
      textColor: '#09090B',
      description: 'Crisp editorial monochrome with strict typographical contrast.',
    },
  ];

  const handleApplyTheme = (themeId: ThemeId) => {
    storageService.setTheme(themeId);
    setCurrentTheme(themeId);
    setPreviewTheme(themeId);
    storageService.addAuditLog({
      actor: 'Ghufran King (Super Admin)',
      role: 'super_admin',
      action: 'UPDATE_THEME',
      target: `Applied global theme: ${themeId}`,
      ipAddress: '127.0.0.1',
      status: 'Success',
    });
    setNotification(`Theme applied globally: ${themeId.replace('_', ' ').toUpperCase()}`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRestoreDefaults = () => {
    storageService.setTheme('premium_white');
    setCurrentTheme('premium_white');
    setPreviewTheme('premium_white');
    setNotification('Restored to default: Premium White');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">E. Theme & Appearance Settings</h2>
          <p className="text-xs text-slate-400">
            Configure global visual styles, typography contrast, and choose from seven high-contrast themes.
          </p>
        </div>

        <button
          onClick={handleRestoreDefaults}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restore Default Theme</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* 7 Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {themeList.map((t) => {
          const isCurrent = currentTheme === t.id;
          const isSelected = previewTheme === t.id;
          return (
            <div
              key={t.id}
              onClick={() => setPreviewTheme(t.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-4 relative ${
                isSelected
                  ? 'border-[#55B9F5] bg-slate-800/90 shadow-lg ring-1 ring-[#55B9F5]'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              {isCurrent && (
                <span className="absolute top-3.5 right-3.5 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500 text-slate-900 shadow">
                  Current Global
                </span>
              )}

              <div className="space-y-1">
                <h3 className="font-bold text-sm text-white">{t.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{t.description}</p>
              </div>

              {/* Color Swatch Preview Box */}
              <div
                style={{ backgroundColor: t.bgPreview }}
                className="p-3.5 rounded-xl border border-slate-700/60 space-y-2"
              >
                <div
                  style={{ backgroundColor: t.cardPreview, color: t.textColor }}
                  className="p-2.5 rounded-lg border border-slate-600/40 text-[11px] font-bold flex items-center justify-between"
                >
                  <span>Sample Card</span>
                  <span
                    style={{ backgroundColor: t.primaryColor }}
                    className="w-3 h-3 rounded-full"
                  />
                </div>
                <div className="flex items-center gap-2 text-[10px]" style={{ color: t.textColor }}>
                  <span className="opacity-80">Background & Contrast preview</span>
                </div>
              </div>

              {/* Apply Button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">{t.primaryColor}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApplyTheme(t.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-slate-700 text-slate-300 cursor-default'
                      : 'bg-[#55B9F5] hover:bg-[#38A9F3] text-[#101D35] shadow-xs'
                  }`}
                >
                  {isCurrent ? 'Active' : 'Apply Theme'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Brand Asset URLs */}
      <div className="bg-slate-900/70 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-white">Logo & Favicon Asset Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Custom SVG Logo Endpoint</label>
            <input
              type="text"
              readOnly
              value="/src/components/common/RdxLogo.tsx (Vector SVGs)"
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 font-mono text-[11px]"
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Browser Favicon Data URI</label>
            <input
              type="text"
              readOnly
              value="data:image/svg+xml;utf8 (Embedded in index.html)"
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 font-mono text-[11px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
