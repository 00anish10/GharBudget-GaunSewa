import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Settings,
  DollarSign,
  Bell,
  RefreshCw,
  LogOut,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    resetToDefaultData,
    logout,
    activeApp,
  } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [currency, setCurrency] = useState(currentUser.currencyPreference);
  const [budget, setBudget] = useState(currentUser.monthlyBudget.toString());
  const [savingsTarget, setSavingsTarget] = useState(
    currentUser.savingsTarget.toString()
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      currencyPreference: currency,
      monthlyBudget: parseFloat(budget) || 60000,
      savingsTarget: parseFloat(savingsTarget) || 100000,
    });
  };

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in-50">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal profile, monthly budget caps, and Nepal currency preferences.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Details Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2EAE5] shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-[#005B48] pb-2 border-b border-slate-100">
            <User className="w-5 h-5" />
            <h2 className="text-sm font-bold text-slate-900">User Profile</h2>
          </div>

          <div className="flex items-center gap-4 py-2">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-[#005B48]/20"
            />
            <div>
              <span className="text-sm font-bold text-slate-900 block">{currentUser.name}</span>
              <span className="text-xs text-slate-500 block">{currentUser.role || 'Member'}</span>
              <span className="text-[11px] font-semibold text-[#005B48] block mt-0.5">
                Verified Nepal Account
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#005B48]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#005B48]"
              />
            </div>
          </div>
        </div>

        {/* Currency & Financial Configuration Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2EAE5] shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-[#005B48] pb-2 border-b border-slate-100">
            <DollarSign className="w-5 h-5" />
            <h2 className="text-sm font-bold text-slate-900">
              Financial Defaults & Currency Format
            </h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Currency Symbol Display
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['NPR', 'Rs.', 'रु'] as const).map((curr) => (
                <button
                  type="button"
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    currency === curr
                      ? 'border-[#005B48] bg-emerald-50 text-[#005B48] font-bold shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base block">{curr}</span>
                  <span className="text-[10px] text-slate-400">e.g. {curr} 1,25,000</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Monthly Spending Budget ({currency})
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#005B48]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Savings Target Goal ({currency})
              </label>
              <input
                type="number"
                value={savingsTarget}
                onChange={(e) => setSavingsTarget(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#005B48]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#005B48] hover:bg-[#004A3A] text-white text-xs font-bold shadow-xs transition-all"
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* Data & Security Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2EAE5] shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-700 pb-2 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-sm font-bold text-slate-900">Data & Session</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <span className="font-bold text-slate-800 text-xs block">
                Reset Sample Data
              </span>
              <span className="text-[11px] text-slate-500 block">
                Restore default transactions, goals, and jobs matching initial demo state.
              </span>
            </div>
            <button
              type="button"
              onClick={resetToDefaultData}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold shrink-0"
            >
              Reset to Defaults
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
