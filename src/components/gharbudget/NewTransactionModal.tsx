import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Category, Transaction, TransactionType } from '../../types';
import { X, Plus, Check } from 'lucide-react';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Transaction | null;
  defaultType?: TransactionType;
}

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
  isOpen,
  onClose,
  initialData,
  defaultType = 'expense',
}) => {
  const { addTransaction, updateTransaction, currentUser } = useApp();

  const [type, setType] = useState<TransactionType>(defaultType);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Groceries');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('eSewa / QR');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setDescription(initialData.description);
      setAmount(Math.abs(initialData.amount).toString());
      setCategory(initialData.category);
      setDate(initialData.date.split('T')[0]);
      setPaymentMethod(initialData.paymentMethod || 'eSewa / QR');
      setNotes(initialData.notes || '');
    } else {
      setType(defaultType);
      setDescription('');
      setAmount('');
      setCategory(defaultType === 'income' ? 'Income' : 'Groceries');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('eSewa / QR');
      setNotes('');
    }
  }, [initialData, defaultType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    const finalAmount = type === 'expense' ? -numAmount : numAmount;

    if (initialData) {
      updateTransaction(initialData.id, {
        description: description.trim() || 'Transaction',
        amount: finalAmount,
        type,
        category,
        date: new Date(date).toISOString(),
        paymentMethod,
        notes,
      });
    } else {
      addTransaction({
        description: description.trim() || 'Transaction',
        amount: finalAmount,
        type,
        category,
        date: new Date(date).toISOString(),
        displayDate: 'Today',
        paymentMethod,
        notes,
      });
    }
    onClose();
  };

  const categories: Category[] = [
    'Groceries',
    'Rent',
    'Utilities',
    'Income',
    'Travel',
    'Education',
    'Healthcare',
    'Entertainment',
    'Other',
  ];

  const paymentMethods = [
    'eSewa / QR',
    'Khalti',
    'FonePay / Bank QR',
    'ConnectIPS',
    'Bank Transfer',
    'Cash',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 z-10 animate-in fade-in-50 zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">
            {initialData ? 'Edit Transaction' : 'Add New Transaction'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Type Toggle */}
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                if (category === 'Income') setCategory('Groceries');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'expense'
                  ? 'bg-[#9C3E0E] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('Income');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'income'
                  ? 'bg-[#005B48] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Income / Deposit (+)
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Amount ({currentUser.currencyPreference}) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                {currentUser.currencyPreference}
              </span>
              <input
                type="number"
                step="any"
                required
                placeholder="e.g. 4500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-14 pr-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description / Vendor *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bhat-Bhateni, House Rent, NEA Bill"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white"
            />
          </div>

          {/* Category & Date Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white"
            >
              {paymentMethods.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Monthly grocery staples"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white"
            />
          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit"
              className={`w-full py-3 rounded-xl text-white text-xs font-bold shadow-md transition-all ${
                type === 'expense'
                  ? 'bg-[#9C3E0E] hover:bg-[#85340B]'
                  : 'bg-[#005B48] hover:bg-[#004A3A]'
              }`}
            >
              {initialData ? 'Save Changes' : 'Record Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
