import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { UserPublic } from '../types/api';
import { Mail, Lock, User, ShieldCheck, Bell, Menu, X, ChevronDown, LogOut, Settings, CreditCard, Target, TrendingUp, ArrowRight, Shield, Users, Sparkles } from 'lucide-react';

export const UserDashboardPage: React.FC = () => {
  const { user, logout, isAdmin, refreshUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'settings'>('overview');
  const [profileData, setProfileData] = useState({ full_name: '' });
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.full_name) {
      setProfileData({ full_name: user.full_name });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await api.put('/v1/me', profileData);
      // The AuthContext will update the user via the refreshUser call in the API interceptor
      // For now, we'll manually update
      localStorage.setItem('user', JSON.stringify({ ...user, ...profileData }));
      setSuccess('Profile updated successfully!');
} catch (err: any) {
    setError(err.response?.data?.detail || 'Failed to update profile');
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (passwordData.new !== passwordData.confirm) {
      setError('New passwords do not match');
      return;
    }
    if (passwordData.new.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }
    try {
      await api.put('/v1/me/password', {
        current_password: passwordData.current,
        new_password: passwordData.new,
      });
      setPasswordData({ current: '', new: '', confirm: '' });
      setSuccess('Password changed successfully!');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to change password');
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-100">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#005B48] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-slate-900">GharBudget</span>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#005B48]/10 flex items-center justify-center">
                <User className="w-6 h-6 text-[#005B48]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.full_name || 'User'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${
                  user?.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                  user?.role === 'user' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {user?.role === 'admin' && <Shield className="w-3 h-3" />}
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Sparkles },
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'settings', label: 'Security', icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#005B48] text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Bottom - Logout */}
          <div className="p-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 font-semibold transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white shadow-lg border border-slate-200"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 text-slate-700" />
      </button>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">{tabs.find(t => t.id === activeTab)?.label || 'Dashboard'}</h1>
                <p className="text-sm text-slate-500">Manage your {activeTab === 'overview' ? 'budget & goals' : activeTab === 'profile' ? 'profile information' : 'security settings'}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Online</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 animate-in shake" role="alert">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 animate-in fade-in" role="status">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div className="text-sm text-emerald-700">{success}</div>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="animate-in fade-in-50">
              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-slate-900">Welcome back, {user?.full_name?.split(' ')[0] || 'User'}! 👋</h2>
                <p className="text-slate-600 mt-1">Here's a quick overview of your financial health.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Received', value: '125,000', icon: TrendingUp, color: 'bg-[#005B48]/10 text-[#005B48]', prefix: '₨' },
                  { label: 'Total Spent', value: '45,300', icon: TrendingUp, color: 'bg-amber-100 text-amber-700', prefix: '₨' },
                  { label: 'Saved', value: '79,700', icon: Target, color: 'bg-emerald-100 text-emerald-700', prefix: '₨' },
                  { label: 'Budget Used', value: '75%', icon: Target, color: 'bg-blue-100 text-blue-700', prefix: '' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-slate-500" />
                      </div>
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900">{stat.prefix}{stat.value}</div>
                    <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
                  {[
                    { label: 'Add Expense', icon: TrendingUp, color: 'bg-red-100 text-red-600', href: '#' },
                    { label: 'Add Income', icon: TrendingUp, color: 'bg-emerald-100 text-emerald-600', href: '#' },
                    { label: 'New Goal', icon: Target, color: 'bg-blue-100 text-blue-600', href: '#' },
                    { label: 'View Reports', icon: Sparkles, color: 'bg-purple-100 text-purple-600', href: '#' },
                  ].map((action, i) => (
                    <Link key={i} href={action.href} className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-slate-50 hover:bg-white border border-slate-100 transition-all hover:border-[#005B48]/20 hover:shadow-md">
                      <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-[#005B48] transition-colors">{action.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl animate-in fade-in-50">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-slate-900">Profile Settings</h2>
              <p className="text-slate-600 mt-1">Manage your personal information</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ full_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#005B48] focus:bg-white focus:ring-1 focus:ring-[#005B48] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-400 mt-1">Email cannot be changed. Contact support if needed.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                  <input
                    type="text"
                    value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'User'}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#005B48] hover:bg-[#004A3A] text-white font-bold transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl animate-in fade-in-50">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-slate-900">Security Settings</h2>
              <p className="text-slate-600 mt-1">Manage your password and security settings</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Change Password</h3>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    name="current"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#005B48] focus:bg-white focus:ring-1 focus:ring-[#005B48] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                  <input
                    type="password"
                    name="new"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#005B48] focus:bg-white focus:ring-1 focus:ring-[#005B48] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirm"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#005B48] focus:bg-white focus:ring-1 focus:ring-[#005B48] transition-all"
                  />
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#005B48] hover:bg-[#004A3A] text-white font-bold transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>

            {/* Security Info */}
            <div className="mt-8 bg-white rounded-2xl border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Security Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-semibold text-slate-900">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-500">Not enabled</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-semibold text-[#005B48] hover:bg-emerald-50 rounded-xl transition-colors">
                    Enable
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="font-semibold text-slate-900">Active Sessions</p>
                      <p className="text-sm text-slate-500">1 active session</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                    View All
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        </div>
      </main>
    </div>
  );
};