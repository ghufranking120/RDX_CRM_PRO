import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Percent,
  Search,
  RefreshCw,
  Copy,
} from 'lucide-react';
import { Coupon } from '../../types';

export const AdminCouponsSection: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  // Form states
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('20');
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [maxUsage, setMaxUsage] = useState('100');

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('rdx_session_token');
      const res = await fetch('/api/admin/coupons', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setCoupons(data);
      }
    } catch {
      // Ignored
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    try {
      const token = localStorage.getItem('rdx_session_token');
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          code: code.trim(),
          discountPercent: parseInt(discountPercent) || 10,
          expiryDate,
          maxUsage: parseInt(maxUsage) || 100,
        }),
      });

      if (res.ok) {
        setActionMsg('Coupon created and active.');
        setShowAddModal(false);
        setCode('');
        fetchCoupons();
      }
    } catch {
      setActionMsg('Failed to create coupon.');
    }
    setTimeout(() => setActionMsg(''), 4000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setActionMsg(`Coupon code "${text}" copied to clipboard!`);
    setTimeout(() => setActionMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#101D35] flex items-center gap-2">
            <span>Coupons & Discount Promotions</span>
            <span className="text-xs bg-[#25D366]/10 text-[#128C7E] font-semibold px-2 py-0.5 rounded-full border border-[#25D366]/30">
              Subscription Discounts
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage promotional discount vouchers, coupon validity periods, and subscription redemption caps.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {actionMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-xs text-[#101D35] uppercase tracking-wider">Active Promotional Codes</h3>
          <button
            onClick={fetchCoupons}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Expiration Date</th>
                <th className="py-3 px-4">Usage Counter</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading promotional coupons...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No active discount codes found. Click "Create Coupon" to launch your first promotional code.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#101D35]">
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {c.code}
                        </span>
                        <button
                          onClick={() => copyToClipboard(c.code)}
                          className="p-1 text-slate-400 hover:text-slate-700"
                          title="Copy Code"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-emerald-600 font-bold">
                      {c.discountPercent}% OFF
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {c.expiryDate}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-semibold">
                      {c.usageCount} / {c.maxUsage || '∞'} used
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => copyToClipboard(c.code)}
                        className="px-2.5 py-1 text-slate-600 hover:text-[#101D35] bg-slate-100 rounded-lg text-xs font-semibold"
                      >
                        Copy
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#101D35]">Create Coupon Code</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coupon Code (e.g. SUMMER30)</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="RDXPRO20"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase focus:outline-none focus:border-[#25D366]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#25D366]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Redemptions</label>
                  <input
                    type="number"
                    min="1"
                    value={maxUsage}
                    onChange={(e) => setMaxUsage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#25D366]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#25D366]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-semibold shadow-xs"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
