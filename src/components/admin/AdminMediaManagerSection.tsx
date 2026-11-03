import React, { useState } from 'react';
import { Image, Upload, Trash2, Edit2, AlertCircle, Check, X } from 'lucide-react';
import { MediaItem } from '../../types';
import { storageService } from '../../services/storage';

export const AdminMediaManagerSection: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>(storageService.getMediaItems());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<{
    name: string;
    url: string;
    altText: string;
    category: 'logo' | 'banner' | 'feature' | 'avatar';
  }>({
    name: '',
    url: '',
    altText: '',
    category: 'banner',
  });

  const loadData = () => {
    setMediaList(storageService.getMediaItems());
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate size < 5MB
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds the 5MB maximum limit.');
      return;
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      setUploadError('Invalid file format. Only JPEG, PNG, WEBP, and SVG are accepted.');
      return;
    }

    // Convert to Data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setNewItem((prev) => ({
        ...prev,
        url: result,
        name: prev.name || file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.url) {
      setUploadError('Please provide a valid image file or URL.');
      return;
    }

    const created: MediaItem = {
      id: `med_${Date.now()}`,
      name: newItem.name,
      url: newItem.url,
      altText: newItem.altText || newItem.name,
      type: 'image/png',
      sizeBytes: 154000,
      category: newItem.category,
      uploadedAt: new Date().toISOString().substring(0, 10),
    };

    storageService.addMediaItem(created);
    setShowUploadModal(false);
    setNewItem({ name: '', url: '', altText: '', category: 'banner' });
    loadData();
  };

  const handleDelete = (id: string) => {
    storageService.deleteMediaItem(id);
    loadData();
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">F. Media Asset Manager</h2>
          <p className="text-xs text-slate-400">
            Upload, preview, validate, and manage brand logos, banners, and feature graphics.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#55B9F5] hover:bg-[#38A9F3] text-[#101D35] text-xs font-bold transition-colors shadow-xs"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Media Asset</span>
        </button>
      </div>

      {/* Grid of Media */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {mediaList.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div className="h-44 bg-slate-950 flex items-center justify-center relative overflow-hidden">
              <img
                src={item.url}
                alt={item.altText}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2 left-2 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                {item.category}
              </span>
            </div>

            <div className="p-4 space-y-2">
              <h4 className="font-bold text-xs text-white truncate">{item.name}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-1">Alt: {item.altText}</p>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                <span>{(item.sizeBytes / 1024).toFixed(1)} KB</span>
                <span>{item.uploadedAt}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-800/40 border-t border-slate-800 flex items-center justify-end">
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                title="Remove Asset"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-700 space-y-4 text-white text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm">Upload New Asset</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleSaveItem} className="space-y-3.5">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Choose Image File (Max 5MB)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 file:mr-3 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-[#55B9F5] file:text-[#101D35] file:font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Asset Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Header Promotional Banner"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="banner">Banner</option>
                  <option value="logo">Logo</option>
                  <option value="feature">Feature Preview</option>
                  <option value="avatar">Avatar</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Descriptive Alt Text</label>
                <input
                  type="text"
                  placeholder="Accessible description for screen readers"
                  value={newItem.altText}
                  onChange={(e) => setNewItem({ ...newItem, altText: e.target.value })}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#55B9F5] text-[#101D35] font-bold rounded-lg hover:bg-[#38A9F3]"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
