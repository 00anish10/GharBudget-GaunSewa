import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Category, Transaction } from '../../types';
import { formatNepaliNumber } from '../../utils/formatters';
import { CategoryBadge } from '../common/CategoryBadge';
import {
  Plus,
  Calendar,
  MoreVertical,
  Search,
  Trash2,
  Edit2,
  Filter,
  Download,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HistoryViewProps {
  onOpenAddExpense: () => void;
  onEditTransaction: (tx: Transaction) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  onOpenAddExpense,
  onEditTransaction,
}) => {
  const {
    transactions,
    deleteTransaction,
    totalSpent,
    monthlyBudget,
    remainingBudget,
    budgetUsagePercent,
    currentUser,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('Oct 2023');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesCategory =
      selectedCategory === 'All' || tx.category === selectedCategory;
    const matchesSearch =
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Groceries', 'Rent', 'Utilities', 'Income', 'Education'];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: This Month Budget Card (Image 3 exact match) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#E2EAE5] shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-4">
              This Month
            </h2>

            {/* Total Spent */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                TOTAL SPENT
              </span>
              <span className="text-3xl font-extrabold text-[#9C3E0E] block tracking-tight">
                Rs. {formatNepaliNumber(totalSpent > 0 ? totalSpent : 45200)}
              </span>
            </div>

            <hr className="my-5 border-slate-100" />

            {/* Remaining Budget */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                REMAINING BUDGET
              </span>
              <span className="text-2xl font-bold text-slate-800 block tracking-tight">
                Rs. {formatNepaliNumber(remainingBudget > 0 ? remainingBudget : 14800)}
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-4 space-y-1.5">
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${budgetUsagePercent || 75}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-[#9C3E0E] rounded-full"
                />
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-500">
                  {budgetUsagePercent || 75}% Used
                </span>
              </div>
            </div>
          </div>

          {/* Add Expense Button (Rust / Terracotta matching screenshot) */}
          <button
            id="btn-add-expense-history"
            onClick={onOpenAddExpense}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#9C3E0E] hover:bg-[#85340B] text-white text-sm font-semibold transition-all shadow-sm active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>

          {/* Mini tip */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 leading-relaxed">
            <span className="font-semibold block mb-0.5">Budget Alert</span>
            You have Rs. {formatNepaliNumber(remainingBudget)} left for the remaining 7 days of this month.
          </div>
        </div>

        {/* Right Column: Filter Bar & Transactions Table */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filter Bar (Matching screenshot Image 3) */}
          <div className="bg-white rounded-2xl p-4 border border-[#E2EAE5] shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      isActive
                        ? cat === 'All'
                          ? 'bg-[#005B48] text-white'
                          : cat === 'Groceries'
                          ? 'bg-[#EBF3FB] text-[#2563EB] ring-1 ring-blue-300'
                          : cat === 'Rent'
                          ? 'bg-[#FEECE6] text-[#C2410C] ring-1 ring-orange-300'
                          : cat === 'Utilities'
                          ? 'bg-[#5C3214] text-white ring-1 ring-amber-700'
                          : 'bg-[#005B48] text-white'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Date Range Selector Dropdown */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="appearance-none bg-white border border-[#D5DFDA] rounded-xl px-3.5 py-1.5 pr-8 text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#005B48] cursor-pointer"
                >
                  <option value="Oct 2023">Oct 1 - Oct 31, 2023</option>
                  <option value="Sep 2023">Sep 1 - Sep 30, 2023</option>
                  <option value="All Time">All History</option>
                </select>
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Search input if wanted */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search expenses, vendors, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E2EAE5] rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005B48] shadow-xs"
            />
          </div>

          {/* Table Container (Image 3 exact match) */}
          <div className="bg-white rounded-2xl border border-[#E2EAE5] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F4F8F6] text-slate-500 border-b border-[#E2EAE5]">
                    <th className="py-3 px-4 font-semibold w-[20%]">Date</th>
                    <th className="py-3 px-4 font-semibold w-[40%]">Description</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold text-right">Amount</th>
                    <th className="py-3 px-3 font-semibold text-center w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        No transactions found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => {
                      const isIncome = tx.type === 'income' || tx.amount > 0;
                      const isMenuOpen = activeMenuId === tx.id;

                      return (
                        <tr
                          key={tx.id}
                          className="hover:bg-slate-50/80 transition-colors relative"
                        >
                          {/* Date */}
                          <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                            {tx.displayDate || tx.date.split('T')[0]}
                          </td>

                          {/* Description */}
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-800 block">
                              {tx.description}
                            </span>
                            {tx.notes && (
                              <span className="text-[10px] text-slate-400 block truncate">
                                {tx.notes}
                              </span>
                            )}
                          </td>

                          {/* Category Badge */}
                          <td className="py-3.5 px-4">
                            <CategoryBadge category={tx.category} size="sm" />
                          </td>

                          {/* Amount */}
                          <td
                            className={`py-3.5 px-4 text-right font-bold whitespace-nowrap ${
                              isIncome ? 'text-emerald-600' : 'text-slate-800'
                            }`}
                          >
                            Rs. {formatNepaliNumber(Math.abs(tx.amount))}
                          </td>

                          {/* Three Dots Action Menu */}
                          <td className="py-3.5 px-3 text-center relative">
                            <button
                              onClick={() =>
                                setActiveMenuId(isMenuOpen ? null : tx.id)
                              }
                              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              aria-label="Actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                              <div className="absolute right-4 top-8 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-30 animate-in fade-in-50 text-left">
                                <button
                                  onClick={() => {
                                    onEditTransaction(tx);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => {
                                    deleteTransaction(tx.id);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
