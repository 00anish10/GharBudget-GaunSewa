import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Target } from 'lucide-react';

interface NewGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewGoalModal: React.FC<NewGoalModalProps> = ({ isOpen, onClose }) => {
  const { addGoal, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Travel');
  const [targetAmount, setTargetAmount] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [iconName, setIconName] = useState('plane');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    const initial = parseFloat(initialAmount) || 0;
    if (isNaN(target) || target <= 0) return;

    addGoal({
      title: title.trim() || 'New Goal',
      category: category.trim() || 'General',
      targetAmount: target,
      currentAmount: initial,
      deadline: deadline || undefined,
      status: 'normal',
      iconName,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 z-10 animate-in fade-in-50 zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-[#005B48]">
            <Target className="w-5 h-5" />
            <h3 className="text-lg font-bold text-slate-900">Create Financial Goal</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Goal Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dashain Trip, Emergency Fund, Land Deposit"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category Tag
              </label>
              <input
                type="text"
                placeholder="e.g. Travel, Safety Net"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Icon
              </label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white"
              >
                <option value="plane">Plane (Travel/Dashain)</option>
                <option value="shield">Shield (Emergency)</option>
                <option value="bike">Bike / Scooter</option>
                <option value="laptop">Laptop / Education</option>
                <option value="home">Home / Land</option>
                <option value="wallet">General Savings</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Amount (रु) *
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 60000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Starting Amount (रु)
              </label>
              <input
                type="number"
                placeholder="e.g. 10000"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Completion Date
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#005B48] hover:bg-[#004A3A] text-white text-xs font-bold shadow-md transition-all"
            >
              Create Savings Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
