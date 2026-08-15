import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FinancialGoal } from '../../types';
import { formatNepaliNumber } from '../../utils/formatters';
import { IconResolver, getCategoryIconStyle } from '../common/IconResolver';
import {
  Plus,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Lightbulb,
  ArrowRight,
  MoreVertical,
  Trash2,
  Coins,
} from 'lucide-react';
import { motion } from 'motion/react';

interface GoalsViewProps {
  onOpenNewGoal: () => void;
  onOpenDeposit: (goal: FinancialGoal) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  onOpenNewGoal,
  onOpenDeposit,
}) => {
  const { goals, deleteGoal, addGoalDeposit } = useApp();
  const [selectedGoalForMenu, setSelectedGoalForMenu] = useState<string | null>(null);

  // Total saved across all active goals
  const totalSavedInGoals = goals.reduce((sum, g) => sum + g.currentAmount, 0);

  return (
    <div className="space-y-7 animate-in fade-in-50 duration-300">
      {/* Header (Image 5 exact match) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Financial Goals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track your savings for future plans
          </p>
        </div>

        <button
          id="btn-new-goal"
          onClick={onOpenNewGoal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#005B48] text-white text-xs font-semibold hover:bg-[#004A3A] transition-all shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Goal Cards Grid (Image 5 exact 2x2 grid) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {goals.map((goal) => {
            const isBehind = goal.status === 'behind' || goal.category.toLowerCase().includes('behind');
            const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            const iconStyle = getCategoryIconStyle(isBehind ? 'behind' : goal.iconName || goal.category);
            const isCompleted = goal.currentAmount >= goal.targetAmount;

            return (
              <motion.div
                key={goal.id}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className={`bg-white rounded-2xl p-5 border shadow-xs flex flex-col justify-between relative transition-all ${
                  isBehind
                    ? 'border-rose-200 ring-1 ring-rose-100'
                    : 'border-[#E2EAE5]'
                }`}
              >
                <div>
                  {/* Top row: Icon + Title + Menu */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconStyle.bg} ${iconStyle.text}`}
                      >
                        <IconResolver
                          nameOrCategory={goal.iconName || goal.title}
                          className="w-5 h-5"
                        />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-800 tracking-tight leading-tight">
                          {goal.title}
                        </h3>
                        <span
                          className={`text-[11px] font-semibold block mt-0.5 ${
                            isBehind ? 'text-rose-600' : 'text-slate-500'
                          }`}
                        >
                          {goal.category}
                        </span>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setSelectedGoalForMenu(
                            selectedGoalForMenu === goal.id ? null : goal.id
                          )
                        }
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        aria-label="Goal options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {selectedGoalForMenu === goal.id && (
                        <div className="absolute right-0 top-7 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-30 animate-in fade-in-50 text-left">
                          <button
                            onClick={() => {
                              onOpenDeposit(goal);
                              setSelectedGoalForMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                          >
                            <Coins className="w-3.5 h-3.5 text-amber-500" />
                            <span>Add Money</span>
                          </button>
                          <button
                            onClick={() => {
                              deleteGoal(goal.id);
                              setSelectedGoalForMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress amounts */}
                  <div className="mt-2 space-y-1">
                    <div className="flex items-baseline gap-1 text-slate-800">
                      <span className="text-xl font-extrabold tracking-tight">
                        रु {formatNepaliNumber(goal.currentAmount)}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        of रु {formatNepaliNumber(goal.targetAmount)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 space-y-1.5">
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            isBehind
                              ? 'bg-rose-500'
                              : isCompleted
                              ? 'bg-emerald-500'
                              : 'bg-[#E5A93B]'
                          }`}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-semibold">
                        <span
                          className={
                            isBehind
                              ? 'text-rose-600'
                              : isCompleted
                              ? 'text-emerald-700'
                              : 'text-slate-600'
                          }
                        >
                          {percent}% Achieved
                        </span>
                        {isCompleted && (
                          <span className="text-emerald-600 flex items-center gap-1 text-[10px]">
                            <CheckCircle2 className="w-3 h-3" /> Goal Met!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card footer: Quick deposit button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    {goal.deadline ? `Target: ${goal.deadline}` : 'Target: Ongoing'}
                  </span>
                  <button
                    onClick={() => onOpenDeposit(goal)}
                    className="text-xs font-bold text-[#005B48] hover:text-[#004A3A] hover:underline inline-flex items-center gap-1"
                  >
                    <span>+ Deposit</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right 4 Cols: Goal Insights & Savings Tips Cards (Image 5 exact match) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Goal Insights Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2EAE5] shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-emerald-800">
              <Sparkles className="w-4 h-4 text-[#005B48]" />
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Goal Insights
              </h3>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-xl p-4 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                TOTAL SAVED FOR GOALS
              </span>
              <span className="text-2xl font-extrabold text-[#005B48] block tracking-tight">
                रु {formatNepaliNumber(totalSavedInGoals || 230000)}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Great progress! You are on track to meet your{' '}
              <strong className="text-slate-800 font-semibold">Dashain Trip</strong> goal on time for the upcoming festival season.
            </p>
          </div>

          {/* Savings Tips Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2EAE5] shadow-xs space-y-3.5">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Savings Tips
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-800 block mb-1">
                  1. Automate Bank Deposits
                </span>
                <p className="text-slate-500 leading-relaxed">
                  Transfer 20% of remittance or salary into your emergency fund on day 1 of the month.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-800 block mb-1">
                  2. Festival Buffer (Dashain & Tihar)
                </span>
                <p className="text-slate-500 leading-relaxed">
                  Start pooling Rs. 5,000 each month 6 months ahead to avoid sudden financial strain during holidays.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
