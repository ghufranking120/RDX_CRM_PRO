import React, { useState } from 'react';
import { RdxLogo } from '../../common/RdxLogo';
import { Mail, Lock, Building, Phone, User as UserIcon, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PublicPageId } from '../PublicNavbar';
import { storageService, OFFICIAL_WHATSAPP_LINK } from '../../../services/storage';
import { User, BusinessTenant } from '../../../types';

interface RegisterPageProps {
  onNavigate: (page: PublicPageId) => void;
  onRegisterSuccess: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    fullName: '',
    email: '',
    whatsappPhone: '',
    password: '',
    plan: 'growth' as 'starter' | 'growth' | 'enterprise',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.email || !formData.fullName) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: formData.businessName.trim(),
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          password: formData.password || 'BusinessOwner2026!',
          phone: formData.whatsappPhone || '+1 (555) 000-1122',
          planId: formData.plan,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          localStorage.setItem('rdx_session_token', data.token);
        }
        if (data.user) {
          storageService.setCurrentUser(data.user);
          setIsLoading(false);
          onRegisterSuccess();
          return;
        }
      } else {
        const errData = await res.json().catch(() => null);
        if (errData?.error) {
          setErrorMsg(errData.error);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Fallback to client persistence
    }

    const newBizId = `biz_${Date.now()}`;
    const newUserId = `user_${Date.now()}`;

    const newBiz: BusinessTenant = {
      id: newBizId,
      name: formData.businessName,
      whatsappPhone: formData.whatsappPhone || '+1 (555) 000-1122',
      ownerEmail: formData.email,
      planId: formData.plan,
      status: 'active',
      connectedSince: new Date().toISOString(),
      messagesSentThisMonth: 0,
      messageLimit: formData.plan === 'starter' ? 2500 : formData.plan === 'growth' ? 12000 : 60000,
      agentSeatsUsed: 1,
      agentSeatsLimit: formData.plan === 'starter' ? 3 : formData.plan === 'growth' ? 10 : 35,
      features: {
        aiReplies: formData.plan !== 'starter',
        pipeline: true,
        webhooks: formData.plan !== 'starter',
        customTemplates: formData.plan !== 'starter',
      },
    };

    const newUser: User = {
      id: newUserId,
      name: formData.fullName,
      email: formData.email,
      role: 'Business Owner',
      businessId: newBizId,
      businessName: formData.businessName,
      status: 'active',
      phone: formData.whatsappPhone,
      createdAt: new Date().toISOString(),
      lastActive: 'Just now',
    };

    // Persist new business and user
    const businesses = storageService.getBusinesses();
    storageService.saveBusinesses([newBiz, ...businesses]);

    const users = storageService.getUsers();
    storageService.saveUsers([newUser, ...users]);

    storageService.setCurrentUser(newUser);

    storageService.addAuditLog({
      actor: `${newUser.name} (${newUser.email})`,
      role: 'Business Owner',
      action: 'BUSINESS_REGISTRATION',
      target: `${newBiz.name} (${newBiz.planId.toUpperCase()})`,
      ipAddress: '127.0.0.1',
      status: 'Success',
    });

    setIsLoading(false);
    onRegisterSuccess();
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-14 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-3">
          <RdxLogo size="lg" />
        </div>
        <h1 className="text-2xl font-bold text-[#101D35]">Start Your WhatsApp CRM Workspace</h1>
        <p className="text-xs text-slate-500">
          Connect your team to the official WhatsApp Business Platform. 14-day full feature trial.
        </p>
      </div>

      <div className="bg-white p-7 sm:p-9 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg">
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#101D35]">Company / Business Name *</label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Apex Global Trade"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#55B9F5]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#101D35]">Full Name *</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#55B9F5]/40"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#101D35]">Work Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="sarah@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#55B9F5]/40"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#101D35]">Business WhatsApp Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+1 (555) 234-5678"
                  value={formData.whatsappPhone}
                  onChange={(e) => setFormData({ ...formData, whatsappPhone: e.target.value })}
                  className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#55B9F5]/40"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#101D35]">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Create secure password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#55B9F5]/40"
                />
              </div>
            </div>
          </div>

          {/* Plan Choice Selector */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-[#101D35]">Initial Subscription Tier</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'starter', label: 'Starter', price: '$29/mo' },
                { id: 'growth', label: 'Growth', price: '$79/mo (Popular)' },
                { id: 'enterprise', label: 'Enterprise', price: '$199/mo' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, plan: p.id as any })}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    formData.plan === p.id
                      ? 'border-[#55B9F5] bg-[#EAF6FF] text-[#101D35] font-bold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <p>{p.label}</p>
                  <p className="text-[10px] text-slate-500 font-normal">{p.price}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 leading-relaxed">
            By creating an account, you agree to our{' '}
            <button
              type="button"
              onClick={() => onNavigate('terms')}
              className="text-[#101D35] underline font-semibold"
            >
              Terms of Service
            </button>{' '}
            and{' '}
            <button
              type="button"
              onClick={() => onNavigate('privacy')}
              className="text-[#101D35] underline font-semibold"
            >
              Privacy Policy
            </button>
            .
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-[#101D35] hover:bg-slate-900 text-white font-semibold py-3.5 rounded-xl text-xs shadow transition-all duration-150 disabled:opacity-50"
          >
            <span>{isLoading ? 'Creating Workspace...' : 'Create Account & Enter Dashboard'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#55B9F5]" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
          Already registered?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="font-bold text-[#101D35] hover:text-[#55B9F5] hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};
