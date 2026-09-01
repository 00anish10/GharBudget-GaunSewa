import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, ShieldCheck, Sparkles, Shield, Unlock, Key } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as { from?: Location })?.from?.pathname || '/admin/dashboard';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await adminLogin(email, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid admin credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in-50">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/25">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-white">GharBudget Admin</span>
          </Link>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600/20 text-emerald-300 text-sm font-semibold mb-4">
              <Shield className="w-4 h-4" />
              <span>Admin Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Admin Sign In
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Secure access to the admin dashboard
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 sm:p-10 border border-slate-700/50 shadow-2xl shadow-slate-900/50 animate-in fade-in-50 zoom-in-95">
          {/* Admin Badge */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600/20 text-emerald-400 text-sm font-semibold">
              <Shield className="w-4 h-4" />
              <span>Admin Portal</span>
            </div>
            <div className="mt-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Admin Sign In
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                Secure access to the admin dashboard
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-700/50 flex items-start gap-3 animate-in shake" role="alert">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-300">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@yourdomain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 focus:bg-slate-800 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl pl-10 pr-12 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 focus:bg-slate-800 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold shadow-md shadow-emerald-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Accessing dashboard...</span>
                </>
              ) : (
                <>
                  <span>Access Admin Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-slate-700/50 space-y-3 animate-in fade-in-50 delay-200">
            <span className="text-[11px] font-semibold text-slate-500 block text-center uppercase tracking-wider">
              Demo Credentials
            </span>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Email:</span>
                  <code className="bg-slate-800 px-2 py-1 rounded text-emerald-300 font-mono text-xs">
                    admin@gharbudget.app
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Password:</span>
                  <code className="bg-slate-800 px-2 py-1 rounded text-emerald-300 font-mono text-xs">
                    Admin@12345
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Back to User Login */}
          <div className="mt-6 text-center text-sm text-slate-500">
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              ← Back to User Login
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-slate-700/50 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Secure admin portal · RBAC protected · JWT authenticated</span>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center animate-in fade-in-50 delay-300">
          <Link to="/" className="text-slate-500 hover:text-slate-400 text-sm flex items-center justify-center gap-1.5">
            <Unlock className="w-4 h-4" />
            <span>Back to GharBudget</span>
          </Link>
        </div>
      </div>
    </div>
  );
};