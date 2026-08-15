export type Category = 
  | 'Groceries'
  | 'Rent'
  | 'Utilities'
  | 'Income'
  | 'Travel'
  | 'Education'
  | 'Healthcare'
  | 'Entertainment'
  | 'Other';

export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string; // ISO or human format like '2023-10-24'
  displayDate?: string;
  notes?: string;
  paymentMethod?: string;
}

export interface FinancialGoal {
  id: string;
  title: string;
  category: string;
  currentAmount: number;
  targetAmount: number;
  deadline?: string;
  status?: 'normal' | 'behind' | 'achieved';
  statusNote?: string;
  iconName?: string;
}

export interface JobListing {
  id: string;
  title: string;
  budget: string;
  budgetNumeric: number;
  rateType: 'daily' | 'total' | 'monthly';
  location: string;
  distance: string;
  timeline: string;
  tags: string[];
  postedBy: string;
  posterRole?: string;
  posterAvatar?: string;
  duration: string;
  description: string;
  perks?: string[];
  contactPhone?: string;
  applied?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role?: string;
  currencyPreference: 'NPR' | 'Rs.' | 'रु';
  monthlyBudget: number;
  savingsTarget: number;
}

export type ActiveApp = 'gharbudget' | 'gaunsewa';

export type GharBudgetView = 'overview' | 'history' | 'goals' | 'settings';
export type GaunSewaView = 'home' | 'jobs' | 'post-job' | 'status' | 'settings';
export type AuthView = 'login' | 'signup' | 'forgot';
