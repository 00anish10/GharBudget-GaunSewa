import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ActiveApp,
  AuthView,
  Category,
  FinancialGoal,
  GaunSewaView,
  GharBudgetView,
  JobListing,
  Transaction,
  UserProfile,
} from '../types';
import {
  gaunSewaUser,
  initialGoals,
  initialJobs,
  initialTransactions,
  initialUser,
} from '../data/initialData';
import confetti from 'canvas-confetti';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  // Auth & Session
  isAuthenticated: boolean;
  authView: AuthView;
  setAuthView: (view: AuthView) => void;
  currentUser: UserProfile;
  login: (email?: string, password?: string, asUser?: 'aarav' | 'hari') => void;
  signup: (fullName: string, email: string, password?: string) => void;
  logout: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // App Switching (Ecosystem)
  activeApp: ActiveApp;
  setActiveApp: (app: ActiveApp) => void;

  // Navigation
  activeGBView: GharBudgetView;
  setActiveGBView: (view: GharBudgetView) => void;
  activeGSView: GaunSewaView;
  setActiveGSView: (view: GaunSewaView) => void;

  // GharBudget State
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  goals: FinancialGoal[];
  addGoal: (goal: Omit<FinancialGoal, 'id'>) => void;
  updateGoal: (id: string, goal: Partial<FinancialGoal>) => void;
  addGoalDeposit: (id: string, amount: number) => void;
  deleteGoal: (id: string) => void;

  // Computed Financial Metrics
  totalReceived: number;
  totalSpent: number;
  totalSaved: number;
  monthlyBudget: number;
  remainingBudget: number;
  budgetUsagePercent: number;
  spendingByCategory: { category: Category; amount: number; percentage: number; color: string }[];

  // GaunSewa State
  jobs: JobListing[];
  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedJobCategory: string | null;
  setSelectedJobCategory: (cat: string | null) => void;
  applyToJob: (jobId: string) => void;
  postNewJob: (job: Omit<JobListing, 'id' | 'applied'>) => void;

  // Global UI & Feedback
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  triggerConfetti: () => void;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  AUTH: 'ghargaun_auth',
  USER: 'ghargaun_user',
  APP: 'ghargaun_active_app',
  TRANSACTIONS: 'ghargaun_transactions_v2',
  GOALS: 'ghargaun_goals_v2',
  JOBS: 'ghargaun_jobs_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved ? JSON.parse(saved) : true; // default logged in for seamless preview
  });
  const [authView, setAuthView] = useState<AuthView>('login');

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : initialUser;
  });

  const [activeApp, setActiveApp] = useState<ActiveApp>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APP);
    return (saved as ActiveApp) || 'gharbudget';
  });

  const [activeGBView, setActiveGBView] = useState<GharBudgetView>('overview');
  const [activeGSView, setActiveGSView] = useState<GaunSewaView>('home');

  // GharBudget Data
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
    return saved ? JSON.parse(saved) : initialGoals;
  });

  // GaunSewa Data
  const [jobs, setJobs] = useState<JobListing[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
    return saved ? JSON.parse(saved) : initialJobs;
  });
  const [selectedJobId, setSelectedJobId] = useState<string | null>(initialJobs[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedJobCategory, setSelectedJobCategory] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APP, activeApp);
  }, [activeApp]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  }, [jobs]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#005B48', '#10B981', '#E69635', '#2563EB', '#F59E0B'],
    });
  };

  // Auth functions
  const login = (email?: string, _password?: string, asUser?: 'aarav' | 'hari') => {
    if (asUser === 'hari' || email?.includes('hari')) {
      setCurrentUser(gaunSewaUser);
      setActiveApp('gaunsewa');
    } else {
      setCurrentUser(initialUser);
      setActiveApp('gharbudget');
    }
    setIsAuthenticated(true);
    showToast(`Welcome back, ${asUser === 'hari' ? 'Hari' : 'Aarav'}!`);
  };

  const signup = (fullName: string, email: string) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: fullName.trim() || 'New User',
      email: email.trim() || 'user@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Family Budget Manager',
      currencyPreference: 'NPR',
      monthlyBudget: 60000,
      savingsTarget: 100000,
    };
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    showToast('Account created successfully! Welcome to GharBudget.');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAuthView('login');
    showToast('You have logged out safely.', 'info');
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...profile }));
    showToast('Profile settings updated.');
  };

  // GharBudget CRUD
  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      displayDate: tx.displayDate || 'Just now',
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`${tx.type === 'income' ? 'Income' : 'Expense'} of NPR ${Math.abs(tx.amount)} added!`);
  };

  const updateTransaction = (id: string, updated: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
    showToast('Transaction updated successfully.');
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaction removed.', 'info');
  };

  const addGoal = (goal: Omit<FinancialGoal, 'id'>) => {
    const newGoal: FinancialGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
    };
    setGoals((prev) => [...prev, newGoal]);
    showToast(`New savings goal "${goal.title}" created!`);
  };

  const updateGoal = (id: string, updated: Partial<FinancialGoal>) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const next = { ...g, ...updated };
          if (next.currentAmount >= next.targetAmount && g.currentAmount < g.targetAmount) {
            triggerConfetti();
            showToast(`🎉 Congratulations! You reached your goal for ${next.title}!`);
          }
          return next;
        }
        return g;
      })
    );
  };

  const addGoalDeposit = (id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const newCurrent = g.currentAmount + amount;
          if (newCurrent >= g.targetAmount && g.currentAmount < g.targetAmount) {
            triggerConfetti();
            showToast(`🎉 Congratulations! Goal "${g.title}" achieved!`);
          } else {
            showToast(`Added Rs. ${amount} to ${g.title}!`);
          }
          return { ...g, currentAmount: newCurrent };
        }
        return g;
      })
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    showToast('Goal deleted.', 'info');
  };

  // GaunSewa actions
  const applyToJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, applied: true } : j))
    );
    triggerConfetti();
    showToast('Application sent successfully to employer! They will call or SMS you shortly.');
  };

  const postNewJob = (job: Omit<JobListing, 'id' | 'applied'>) => {
    const newJob: JobListing = {
      ...job,
      id: `job-${Date.now()}`,
      applied: false,
    };
    setJobs((prev) => [newJob, ...prev]);
    setSelectedJobId(newJob.id);
    setActiveGSView('jobs');
    showToast(`Job listing "${job.title}" published!`);
  };

  const resetToDefaultData = () => {
    setTransactions(initialTransactions);
    setGoals(initialGoals);
    setJobs(initialJobs);
    setCurrentUser(initialUser);
    localStorage.clear();
    showToast('All sample data restored to initial state.', 'info');
  };

  // Computed Financial Metrics matching Image 1 & 3:
  // Total Received: 125,000
  // Total Spent: 45,300 (or calculated from expenses)
  const totalReceived = transactions
    .filter((t) => t.type === 'income' || t.amount > 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalSpent = transactions
    .filter((t) => t.type === 'expense' || t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalSaved = Math.max(0, totalReceived - totalSpent);
  const monthlyBudget = currentUser.monthlyBudget || 60000;
  const remainingBudget = Math.max(0, monthlyBudget - totalSpent);
  const budgetUsagePercent = Math.min(100, Math.round((totalSpent / monthlyBudget) * 100));

  // Spending Breakdown for Donut Chart (Groceries: 40%, Rent: 35%, Utilities: 15%, etc.)
  const categoryTotals: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense' || t.amount < 0)
    .forEach((t) => {
      const cat = t.category;
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(t.amount);
    });

  const categoryColors: Record<string, string> = {
    Groceries: '#005B48',
    Rent: '#F59E0B',
    Utilities: '#9C3E0E',
    Travel: '#3B82F6',
    Education: '#8B5CF6',
    Healthcare: '#EC4899',
    Entertainment: '#10B981',
    Other: '#64748B',
  };

  const spendingByCategory = Object.entries(categoryTotals).map(([category, amount]) => {
    const percentage = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
    return {
      category: category as Category,
      amount,
      percentage,
      color: categoryColors[category] || '#64748B',
    };
  });

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        authView,
        setAuthView,
        currentUser,
        login,
        signup,
        logout,
        updateUserProfile,
        activeApp,
        setActiveApp,
        activeGBView,
        setActiveGBView,
        activeGSView,
        setActiveGSView,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        goals,
        addGoal,
        updateGoal,
        addGoalDeposit,
        deleteGoal,
        totalReceived,
        totalSpent,
        totalSaved,
        monthlyBudget,
        remainingBudget,
        budgetUsagePercent,
        spendingByCategory,
        jobs,
        selectedJobId,
        setSelectedJobId,
        searchQuery,
        setSearchQuery,
        selectedJobCategory,
        setSelectedJobCategory,
        applyToJob,
        postNewJob,
        toasts,
        showToast,
        removeToast,
        triggerConfetti,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
