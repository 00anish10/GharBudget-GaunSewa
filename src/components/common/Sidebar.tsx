import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Clock,
  Target,
  Settings,
  Briefcase,
  PlusCircle,
  CheckSquare,
  LogOut,
  Repeat,
  User,
  Shield,
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  user?: { full_name?: string | null; email?: string; role?: string } | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile, user }) => {
  const {
    activeApp,
    setActiveApp,
    activeGBView,
    setActiveGBView,
    activeGSView,
    setActiveGSView,
  } = useApp();
  const { logout } = useAuth();

  const handleGBNav = (view: typeof activeGBView) => {
    setActiveGBView(view);
    if (onCloseMobile) onCloseMobile();
  };

  const handleGSNav = (view: typeof activeGSView) => {
    setActiveGSView(view);
    if (onCloseMobile) onCloseMobile();
  };

  const toggleApp = () => {
    if (activeApp === 'gharbudget') {
      setActiveApp('gaunsewa');
    } else {
      setActiveApp('gharbudget');
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-[#F8FAF9] border-r border-[#E2EAE5] px-4 py-6 select-none">
      {/* Top Header & Logo */}
      <div className="space-y-7">
        {activeApp === 'gharbudget' ? (
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-[#005B48] flex items-center justify-center text-white shadow-sm">
              {/* Custom Ghar Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold text-[#005B48] tracking-tight">GharBudget</span>
              <span className="block text-[10px] uppercase font-semibold tracking-wider text-slate-400">Nepal Finance</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between px-2">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#005B48] tracking-tight">GaunSewa</h1>
              <span className="block text-[10px] uppercase font-semibold tracking-wider text-emerald-700">Community Work</span>
            </div>
          </div>
        )}

        {/* Navigation items */}
        <nav className="space-y-1.5">
          {activeApp === 'gharbudget' ? (
            <>
              <button
                id="nav-gb-home"
                onClick={() => handleGBNav('overview')}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeGBView === 'overview'
                    ? 'bg-[#005B48] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-[#E8F2EC] hover:text-[#005B48]'
                }`}
              >
                <Home className="w-4 h-4 shrink-0" />
                <span>Home</span>
              </button>

              <button
                id="nav-gb-history"
                onClick={() => handleGBNav('history')}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeGBView === 'history'
                    ? 'bg-[#005B48] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-[#E8F2EC] hover:text-[#005B48]'
                }`}
              >
                <Clock className="w-4 h-4 shrink-0" />
                <span>History</span>
              </button>

              <button
                id="nav-gb-goals"
                onClick={() => handleGBNav('goals')}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeGBView === 'goals'
                    ? 'bg-[#005B48] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-[#E8F2EC] hover:text-[#005B48]'
                }`}
              >
                <Target className="w-4 h-4 shrink-0" />
                <span>Goals</span>
              </button>
            </>
          ) : (
            <>
              <button
                id="nav-gs-home"
                onClick={() => handleGSNav('home')}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeGSView === 'home'
                    ? 'bg-[#005B48] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-[#E8F2EC] hover:text-[#005B48]'
                }`}
              >
                <Home className="w-4 h-4 shrink-0" />
                <span>Home</span>
              </button>

              <button
                id="nav-gs-jobs"
                onClick={() => handleGSNav('jobs')}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeGSView === 'jobs'
                    ? 'bg-[#005B48] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-[#E8F2EC] hover:text-[#005B48]'
                }`}
              >
                <Briefcase className="w-4 h-4 shrink-0" />
                <span>Jobs</span>
              </button>

              <button
                id="nav-gs-post"
                onClick={() => handleGSNav('post-job')}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeGSView === 'post-job'
                    ? 'bg-[#005B48] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-[#E8F2EC] hover:text-[#005B48]'
                }`}
              >
                <PlusCircle className="w-4 h-4 shrink-0" />
                <span>Post Job</span>
              </button>

              <button
                id="nav-gs-status"
                onClick={() => handleGSNav('status')}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeGSView === 'status'
                    ? 'bg-[#005B48] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-[#E8F2EC] hover:text-[#005B48]'
                }`}
              >
                <CheckSquare className="w-4 h-4 shrink-0" />
                <span>My Status</span>
              </button>
            </>
          )}
        </nav>

        {/* Ecosystem Switcher Banner */}
        <div className="pt-2">
          <button
            onClick={toggleApp}
            className="w-full flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200/80 rounded-xl hover:bg-emerald-100/70 transition-all text-left group"
            title="Switch between Household Finance and Community Jobs"
          >
            <div className="flex items-center gap-2">
              <Repeat className="w-3.5 h-3.5 text-[#005B48] group-hover:rotate-180 transition-transform duration-300" />
              <div>
                <span className="text-[11px] font-semibold text-[#005B48] block">
                  {activeApp === 'gharbudget' ? 'Switch to GaunSewa' : 'Switch to GharBudget'}
                </span>
                <span className="text-[10px] text-slate-500">
                  {activeApp === 'gharbudget' ? 'Community Jobs & Help' : 'Personal & Remittance'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-[#005B48] text-white px-1.5 py-0.5 rounded">
              GO
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Section: Settings & User Profile */}
      <div className="space-y-2 pt-6 border-t border-[#E2EAE5]">
        <button
          id="nav-settings"
          onClick={() => {
            if (activeApp === 'gharbudget') {
              setActiveGBView('settings');
            } else {
              setActiveGSView('settings');
            }
            if (onCloseMobile) onCloseMobile();
          }}
          className={`w-full flex items-center gap-3.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            (activeApp === 'gharbudget' && activeGBView === 'settings') ||
            (activeApp === 'gaunsewa' && activeGSView === 'settings')
              ? 'bg-[#005B48] text-white'
              : 'text-slate-600 hover:bg-[#E8F2EC] hover:text-[#005B48]'
          }`}
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span>Settings</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3.5 px-4 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>

        {/* User Card */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white border border-[#E2EAE5] shadow-xs">
          <div className="w-9 h-9 rounded-full bg-[#005B48]/10 flex items-center justify-center ring-2 ring-[#005B48]/10">
            {user?.role === 'admin' ? (
              <Shield className="w-5 h-5 text-[#005B48]" />
            ) : (
              <User className="w-5 h-5 text-[#005B48]" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-800 truncate">{user?.full_name || 'User'}</p>
            <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
            {user?.role && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1 ${
                user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                user.role === 'user' ? 'bg-emerald-100 text-emerald-700' :
                'bg-slate-100 text-slate-600'
              }`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <motion.div
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-64 max-w-[80vw] h-full z-10"
          >
            {sidebarContent}
          </motion.div>
        </div>
      )}
    </>
  );
};
