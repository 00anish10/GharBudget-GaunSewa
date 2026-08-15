import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatNepaliNumber } from '../../utils/formatters';
import { SpendingDonut } from './SpendingDonut';
import { CategoryBadge } from '../common/CategoryBadge';
import { IconResolver, getCategoryIconStyle } from '../common/IconResolver';
import {
  Download,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  PiggyBank,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'motion/react';

interface OverviewViewProps {
  onOpenNewEntry: () => void;
  onOpenExport: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onOpenNewEntry,
  onOpenExport,
}) => {
  const {
    totalReceived,
    totalSpent,
    totalSaved,
    transactions,
    currentUser,
    setActiveGBView,
  } = useApp();

  const savingsTarget = currentUser.savingsTarget || 100000;
  const savingsProgressPercent = Math.min(
    100,
    Math.round((totalSaved / savingsTarget) * 100)
  );

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-7 animate-in fade-in-50 duration-300">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 block tracking-wide">
            Welcome back,
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-export-overview"
            onClick={onOpenExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#D5DFDA] text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export</span>
          </button>

          <button
            id="btn-new-entry-overview"
            onClick={onOpenNewEntry}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#005B48] text-white text-xs font-semibold hover:bg-[#004A3A] transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Entry</span>
          </button>
        </div>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Received */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl p-5 border border-[#E2EAE5] shadow-xs relative flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Total Received</span>
            <div className="w-7 h-7 rounded-full bg-[#EBF3FB] text-[#2563EB] flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatCurrency(totalReceived, currentUser.currencyPreference)}
            </h2>
            <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12% from last month</span>
            </div>
          </div>
        </motion.div>

        {/* Total Spent */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl p-5 border border-[#E2EAE5] shadow-xs relative flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Total Spent</span>
            <div className="w-7 h-7 rounded-full bg-[#FEECE6] text-[#C2410C] flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatCurrency(totalSpent, currentUser.currencyPreference)}
            </h2>
            <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-[#9C3E0E]">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>-3% from last month</span>
            </div>
          </div>
        </motion.div>

        {/* Total Saved (Dark Green Accent Card) */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-[#005B48] text-white rounded-2xl p-5 border border-[#004A3A] shadow-md relative flex flex-col justify-between overflow-hidden"
        >
          {/* Subtle decorative background pattern */}
          <div className="absolute right-0 bottom-0 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between mb-2">
            <span className="text-xs font-medium text-emerald-100/80">Total Saved</span>
            <div className="w-7 h-7 rounded-full bg-white/10 text-emerald-200 flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {formatCurrency(totalSaved, currentUser.currencyPreference)}
            </h2>
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] font-medium text-emerald-100/90 mb-1.5">
                <span>Goal: {formatCurrency(savingsTarget, currentUser.currencyPreference)}</span>
                <span>{savingsProgressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-emerald-950/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${savingsProgressPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-[#E5A93B] rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Section: Spending Donut + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Spending Breakdown */}
        <div className="lg:col-span-4">
          <SpendingDonut />
        </div>

        {/* Right Column: Recent Transactions Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E2EAE5] shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Recent Transactions
              </h3>
              <button
                onClick={() => setActiveGBView('history')}
                className="text-xs font-semibold text-[#005B48] hover:text-[#004A3A] inline-flex items-center gap-1 hover:underline transition-all"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="pb-3 font-semibold w-[40%]">Description</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentTransactions.map((tx) => {
                    const iconStyle = getCategoryIconStyle(tx.category);
                    const isIncome = tx.type === 'income' || tx.amount > 0;

                    return (
                      <tr
                        key={tx.id}
                        className="group hover:bg-slate-50/80 transition-colors"
                      >
                        {/* Description with Icon */}
                        <td className="py-3.5 pr-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iconStyle.bg} ${iconStyle.text}`}
                            >
                              <IconResolver
                                nameOrCategory={tx.category || tx.description}
                                className="w-4 h-4"
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-slate-800 block truncate">
                                {tx.description}
                              </span>
                              {tx.notes && (
                                <span className="text-[10px] text-slate-400 truncate block">
                                  {tx.notes}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 text-slate-500 whitespace-nowrap">
                          {tx.displayDate || tx.date.split('T')[0]}
                        </td>

                        {/* Category badge */}
                        <td className="py-3.5">
                          <CategoryBadge category={tx.category} size="sm" />
                        </td>

                        {/* Amount */}
                        <td
                          className={`py-3.5 text-right font-bold whitespace-nowrap ${
                            isIncome ? 'text-emerald-600' : 'text-slate-800'
                          }`}
                        >
                          {isIncome ? '+ ' : '- '}
                          {currentUser.currencyPreference}{' '}
                          {formatNepaliNumber(Math.abs(tx.amount))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick info footer */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Showing latest {recentTransactions.length} of {transactions.length} records</span>
            <span className="text-[#005B48] font-medium">Auto-synced with Nepal banking formats</span>
          </div>
        </div>
      </div>
    </div>
  );
};
