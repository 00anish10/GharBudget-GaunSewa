import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FinancialGoal } from '../../types';
import { formatNepaliNumber } from '../../utils/formatters';
import { X, Coins } from 'lucide-react';

interface DepositModalProps {
  goal: FinancialGoal | null;
  onClose: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ goal, onClose }) => {
  const { addGoalDeposit, currentUser } = useApp();
  const [depositAmount, setDepositAmount] = useState('');

  if (!goal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    addGoalDeposit(goal.id, amount);
    onClose();
  };

  const quickAmounts = [1000, 2500, 5000, 10000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-sm p-6 z-10 animate-in fade-in-50 zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-[#005B48]">
            <Coins className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">Add Deposit</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-3 p-3 bg-slate-50 rounded-xl">
          <p className="text-xs font-semibold text-slate-800">{goal.title}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Current: रु {formatNepaliNumber(goal.currentAmount)} / रु {formatNepaliNumber(goal.targetAmount)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deposit Amount (रु)
            </label>
            <input
              type="number"
              required
              autoFocus
              placeholder="e.g. 5000"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white"
            />
          </div>

          {/* Quick amount pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {quickAmounts.map((q) => (
              <button
                type="button"
                key={q}
                onClick={() => setDepositAmount(q.toString())}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#005B48] rounded-lg text-xs font-semibold transition-colors"
              >
                +रु {formatNepaliNumber(q)}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#005B48] hover:bg-[#004A3A] text-white text-xs font-bold shadow-md transition-all"
          >
            Confirm Deposit
          </button>
        </form>
      </div>
    </div>
  );
};
