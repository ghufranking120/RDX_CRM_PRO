import React, { useState } from 'react';
import { RdxLogo } from '../common/RdxLogo';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Key } from 'lucide-react';
import { storageService } from '../../services/storage';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToPublic: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onBackToPublic,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        if (data.user.role === 'Platform Super Admin' || data.user.role === 'super_admin') {
          if (data.token) {
            localStorage.setItem('rdx_session_token', data.token);
          }
          storageService.setCurrentUser(data.user);
          setIsLoading(false);
          onLoginSuccess();
          return;
        } else {
          setErrorMsg('Access Denied: Your account does not possess Super Administrator privileges.');
          setIsLoading(false);
          return;
        }
      } else {
        setErrorMsg(data.error || 'Invalid administrator email or password.');
      }
    } catch {
      setErrorMsg('Authentication service unavailable. Please check backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-4 antialiased selection:bg-[#25D366]/20">
      <div className="w-full max-w-md space-y-6">
        {/* Portal Shield Badge */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#1E293B] border border-slate-700 shadow-xl mb-2">
            <ShieldCheck className="w-8 h-8 text-[#25D366]" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            RDX CRM PRO — Super Admin Portal
          </h1>
          <p className="text-xs text-slate-400">
            Restricted System Access. Verified Root Administrator Authentication Required.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-[#1E293B] rounded-2xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-700/80 text-red-200 text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Administrator Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@rdxcrm.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#25D366] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#25D366] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold rounded-xl shadow-md transition-all text-sm disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Authenticate Super Admin'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center border-t border-slate-700/60">
            <button
              onClick={onBackToPublic}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              &larr; Return to Public Website
            </button>
          </div>
        </div>

        {/* Security Fineprint */}
        <p className="text-[11px] text-center text-slate-500">
          All administrative access events, sessions, and IP addresses are audited in real-time.
        </p>
      </div>
    </div>
  );
};
