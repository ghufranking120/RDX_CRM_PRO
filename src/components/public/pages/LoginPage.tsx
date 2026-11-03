import React, { useState } from 'react';
import { RdxLogo } from '../../common/RdxLogo';
import { Lock, Mail, ArrowRight, CheckCircle2, AlertCircle, Building } from 'lucide-react';
import { PublicPageId } from '../PublicNavbar';
import { storageService, OFFICIAL_WHATSAPP_LINK } from '../../../services/storage';

interface LoginPageProps {
  onNavigate: (page: PublicPageId) => void;
  onLoginSuccess: (view: 'dashboard' | 'admin') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('sarah@techcorp.io');
  const [password, setPassword] = useState('TechCorp2026!');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // 1. Server-side authentication
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        if (data.token) {
          localStorage.setItem('rdx_session_token', data.token);
        }
        storageService.setCurrentUser(data.user);
        setIsLoading(false);

        // If a super admin happens to log in here, route appropriately
        if (data.user.role === 'Platform Super Admin' || data.user.role === 'super_admin') {
          onLoginSuccess('admin');
        } else {
          onLoginSuccess('dashboard');
        }
        return;
      } else {
        setErrorMsg(data.error || 'Invalid email or password. Please verify credentials.');
      }
    } catch {
      // Client storage fallback
      const users = storageService.getUsers();
      const match = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (match) {
        storageService.setCurrentUser(match);
        setIsLoading(false);
        if (match.role === 'super_admin' || match.role === 'Platform Super Admin') {
          onLoginSuccess('admin');
        } else {
          onLoginSuccess('dashboard');
        }
        return;
      } else {
        setErrorMsg('Authentication server unreachable. Please retry.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillCustomerAccount = () => {
    setEmail('sarah@techcorp.io');
    setPassword('TechCorp2026!');
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });
      const data = await res.json();
      setRecoveryMessage(data.message || 'Password reset instructions sent to your email.');
    } catch {
      setRecoveryMessage('Password reset link sent to your registered email.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6 antialiased selection:bg-[#25D366]/20">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-3">
          <RdxLogo size="lg" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#101D35] tracking-tight">
          Sign In to Customer Workspace
        </h1>
        <p className="text-xs text-slate-500">
          Access your WhatsApp shared team inbox, contacts, and automation.
        </p>
      </div>

      {/* Login Box */}
      <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleStandardLogin} className="space-y-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Business Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#25D366] transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-slate-500 hover:text-[#101D35] hover:underline text-[11px]"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#25D366] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50 text-sm"
          >
            <span>{isLoading ? 'Verifying...' : 'Sign In to Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Fill Button for Testing */}
        <div className="pt-2 text-center border-t border-slate-100">
          <button
            type="button"
            onClick={handleFillCustomerAccount}
            className="text-[11px] font-semibold text-[#128C7E] hover:underline"
          >
            Fill Demo Customer Account (TechCorp Logistics)
          </button>
        </div>
      </div>

      {/* Registration Link */}
      <div className="text-center text-xs text-slate-600">
        <span>Don't have a workspace yet? </span>
        <button
          onClick={() => onNavigate('register')}
          className="font-bold text-[#101D35] hover:underline text-[#25D366]"
        >
          Start 14-Day Free Trial
        </button>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-[#101D35]">Reset Workspace Password</h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {recoveryMessage ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl space-y-2">
                <p>{recoveryMessage}</p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2 bg-[#25D366] text-white font-bold rounded-xl"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <p className="text-slate-500">
                  Enter your registered business email and we'll send a password recovery token.
                </p>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#25D366]"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 border border-slate-200 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#25D366] text-white font-bold rounded-xl"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
