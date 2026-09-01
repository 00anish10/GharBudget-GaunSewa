import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, ShieldCheck, Sparkles, Unlock } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, adminLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as { from?: Location })?.from?.pathname || '/dashboard';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (isAdminLogin) {
        await adminLogin(email, password);
        navigate('/admin/dashboard', { replace: true });
      } else {
        await login(email, password);
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F5F2] via-white to-[#E8F2EE] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in-50">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#005B48] flex items-center justify-center">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold text-slate-900">GharBudget</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isAdminLogin ? 'Admin Sign In' : 'Welcome Back'}
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              {isAdminLogin 
                ? 'Access the admin dashboard' 
                : 'Sign in to your GharBudget account'}
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E2EAE5] shadow-xl shadow-slate-200/50 animate-in fade-in-50 zoom-in-95">
          {/* Admin/User Toggle */}
          <div className="mb-6">
            <div className="flex bg-slate-100 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setIsAdminLogin(false)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${
                  !isAdminLogin 
                    ? 'bg-white text-[#005B48] shadow-md' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Unlock className="w-4 h-4 inline mr-1" /> User Login
              </button>
              <button
                type="button"
                onClick={() => setIsAdminLogin(true)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${
                  isAdminLogin 
                    ? 'bg-[#005B48] text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4 inline mr-1" /> Admin Login
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 animate-in shake" role="alert">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white focus:ring-1 focus:ring-[#005B48] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setError('Password reset not implemented in demo')}
                  className="text-xs font-semibold text-[#005B48] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete={isAdminLogin ? 'off' : 'current-password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-12 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white focus:ring-1 focus:ring-[#005B48] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
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
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#005B48] hover:bg-[#004A3A] text-white text-base font-bold shadow-md shadow-[#005B48]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>{isAdminLogin ? 'Access Admin Dashboard' : 'Sign In to Dashboard'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          {!isAdminLogin && (
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-3 animate-in fade-in-50 delay-200">
              <span className="text-[11px] font-semibold text-slate-400 block text-center uppercase tracking-wider">
                Quick Demo Accounts
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setEmail('user@test.com'); setPassword('password123'); }}
                  className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-[12px] font-bold text-emerald-800 text-center transition-all"
                >
                  Test User (user@test.com)
                </button>
                <button
                  type="button"
                  onClick={() => { setIsAdminLogin(true); setEmail('admin@gharbudget.app'); setPassword('Admin@12345'); }}
                  className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-[12px] font-bold text-amber-900 text-center transition-all"
                >
                  Admin (admin@gharbudget.app)
                </button>
              </div>
            </div>
          )}

          {/* Signup Prompt */}
          {!isAdminLogin && (
            <div className="mt-6 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/signup" className="font-bold text-[#005B48] hover:underline">
                Create your free account
              </Link>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#005B48]" />
            <span>Secure JWT authentication · bcrypt hashed passwords</span>
          </div>
        </div>
      </div>
    </div>
  );
};