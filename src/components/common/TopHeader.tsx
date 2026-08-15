import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, Bell, Plus, Check } from 'lucide-react';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
  onOpenNewEntry?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenMobileMenu,
  onOpenNewEntry,
}) => {
  const { activeApp, setActiveApp, budgetUsagePercent } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 'n-1',
      title: 'Dashain Festival Budget Alert',
      desc: 'You have completed 75% of your Dashain Travel goal!',
      time: '10m ago',
      unread: true,
    },
    {
      id: 'n-2',
      title: 'Electricity NEA Due',
      desc: 'October bill of NPR 1,200 is marked paid.',
      time: '2h ago',
      unread: false,
    },
    {
      id: 'n-3',
      title: 'New Jobs Near You',
      desc: '3 local farming & carpentry tasks posted in Chitwan.',
      time: 'Yesterday',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#F8FAF9]/90 backdrop-blur-md border-b border-[#E2EAE5] px-4 md:px-8 py-3 flex items-center justify-between">
      {/* Left: Mobile toggle + App Badge */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* App switcher pill */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setActiveApp('gharbudget')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeApp === 'gharbudget'
                ? 'bg-[#005B48] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#005B48]'
            }`}
          >
            GharBudget
          </button>
          <button
            onClick={() => setActiveApp('gaunsewa')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeApp === 'gaunsewa'
                ? 'bg-[#005B48] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#005B48]'
            }`}
          >
            GaunSewa
          </button>
        </div>

        {budgetUsagePercent > 80 && activeApp === 'gharbudget' && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Monthly Budget: {budgetUsagePercent}% Used
          </span>
        )}
      </div>

      {/* Right: Notifications & Quick actions */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-600 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200 transition-all relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in-50 zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-semibold text-sm text-slate-800">Notifications</span>
                <span className="text-[11px] text-[#005B48] font-medium cursor-pointer hover:underline">
                  Mark all as read
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div key={item.id} className="py-2.5 text-left">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                      {item.unread && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#005B48]"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{item.desc}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{item.time}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 mt-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-[#005B48] font-medium hover:underline inline-flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* New Entry Button */}
        {activeApp === 'gharbudget' && onOpenNewEntry && (
          <button
            onClick={onOpenNewEntry}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#005B48] text-white text-xs font-semibold shadow-xs hover:bg-[#004A3A] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Entry</span>
          </button>
        )}
      </div>
    </header>
  );
};
