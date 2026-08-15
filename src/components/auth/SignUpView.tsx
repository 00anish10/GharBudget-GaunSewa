import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';

export const SignUpView: React.FC = () => {
  const { signup, setAuthView } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password && confirmPassword && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    signup(fullName, email, password);
  };

  return (
    <div className="min-h-screen bg-[#F0F5F2] flex flex-col items-center justify-center p-4 selection:bg-[#005B48]/20">
      {/* Centered Sign Up Card (Image 10 exact match) */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#E2EAE5] shadow-xl shadow-slate-200/50 space-y-6 animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#005B48] text-white flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Account
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Join your community and start managing remittances with ease.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Ram Bahadur"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white transition-all"
              />
            </div>
          </div>

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
                placeholder="ram@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>
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

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Create Account Button (Image 10 exact match) */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#005B48] hover:bg-[#004A3A] text-white text-sm font-bold shadow-md transition-all active:scale-[0.99] mt-2"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Login prompt */}
        <div className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <button
            onClick={() => setAuthView('login')}
            className="font-bold text-[#005B48] hover:underline"
          >
            Log in instead
          </button>
        </div>
      </div>
    </div>
  );
};
