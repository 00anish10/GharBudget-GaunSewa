import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-lg border text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-[#005B48] text-white border-[#004A3A]'
                : toast.type === 'error'
                ? 'bg-rose-600 text-white border-rose-700'
                : toast.type === 'warning'
                ? 'bg-amber-600 text-white border-amber-700'
                : 'bg-slate-800 text-white border-slate-700'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-300" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0 text-rose-200" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 shrink-0 text-amber-200" />}
            {toast.type === 'info' && <Info className="w-5 h-5 shrink-0 text-sky-300" />}

            <span className="flex-1 text-xs leading-relaxed">{toast.message}</span>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
