import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatNepaliNumber } from '../../utils/formatters';
import { X, Download, FileText, Check, Copy } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { transactions, totalReceived, totalSpent, totalSaved, currentUser, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const downloadCSV = () => {
    const headers = 'ID,Date,Description,Category,Type,Amount(NPR),PaymentMethod,Notes\n';
    const rows = transactions
      .map(
        (t) =>
          `"${t.id}","${t.date.split('T')[0]}","${t.description.replace(/"/g, '""')}","${t.category}","${t.type}","${t.amount}","${t.paymentMethod || ''}","${(t.notes || '').replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `GharBudget_Statement_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV statement downloaded successfully!');
  };

  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(transactions, null, 2));
    setCopied(true);
    showToast('Data copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg p-6 z-10 animate-in fade-in-50 zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-[#005B48]">
            <Download className="w-5 h-5" />
            <h3 className="text-lg font-bold text-slate-900">Export Financial Records</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Statement Preview */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <span className="font-bold text-[#005B48] block text-sm">GharBudget Nepal</span>
              <span className="text-[10px] text-slate-500">Statement for: {currentUser.name}</span>
            </div>
            <span className="text-[10px] text-slate-400">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center py-1">
            <div className="bg-white p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Total Received</span>
              <span className="font-bold text-emerald-600">NPR {formatNepaliNumber(totalReceived)}</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Total Spent</span>
              <span className="font-bold text-[#9C3E0E]">NPR {formatNepaliNumber(totalSpent)}</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Net Saved</span>
              <span className="font-bold text-[#005B48]">NPR {formatNepaliNumber(totalSaved)}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            Total records ready for export: <strong>{transactions.length} transactions</strong>
          </p>
        </div>

        {/* Actions */}
        <div className="mt-5 space-y-2.5">
          <button
            onClick={downloadCSV}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#005B48] hover:bg-[#004A3A] text-white text-xs font-bold shadow-md transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Download CSV Statement (.csv)</span>
          </button>

          <button
            onClick={copyJSON}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy JSON Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
