import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, setAuthView } = useApp();
  const [email, setEmail] = useState('aarav@example.com');
  const [password, setPassword] = useState('nepal123');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="min-h-screen bg-[#F0F5F2] flex flex-col items-center justify-center p-4 selection:bg-[#005B48]/20">
      {/* Centered Login Card (Image 8 exact match) */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#E2EAE5] shadow-xl shadow-slate-200/50 space-y-7 animate-in fade-in-50 zoom-in-95">
        {/* Logo and Greeting Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#005B48] text-white flex items-center justify-center mx-auto shadow-md">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              GharBudget
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Welcome home. Please sign in to continue.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="namaste@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Demo accounts: Click the quick login buttons below!')}
                className="text-[11px] font-semibold text-[#005B48] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Login Button (Image 8 exact match) */}
          <button
            type="submit"
            id="btn-login-submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#005B48] hover:bg-[#004A3A] text-white text-sm font-bold shadow-md transition-all active:scale-[0.99] mt-2"
          >
            <span>Login to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* One-click Demo Accounts */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 block text-center uppercase tracking-wider">
            Quick Demo Profiles
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => login('aarav@example.com', '123456', 'aarav')}
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-[11px] font-bold text-[#005B48] text-center transition-all"
            >
              Aarav (GharBudget)
            </button>
            <button
              type="button"
              onClick={() => login('hari.sharma@example.com', '123456', 'hari')}
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-[11px] font-bold text-amber-900 text-center transition-all"
            >
              Hari (GaunSewa)
            </button>
          </div>
        </div>

        {/* Sign up prompt */}
        <div className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <button
            onClick={() => setAuthView('signup')}
            className="font-bold text-[#005B48] hover:underline"
          >
            Sign up for GharBudget
          </button>
        </div>

        {/* Footer */}
        <div className="text-center pt-2 text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#005B48]" />
          <span>Secure login provided by the Ghar & Gaun ecosystem</span>
        </div>
      </div>
    </div>
  );
};
