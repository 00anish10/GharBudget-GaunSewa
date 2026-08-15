import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { TopHeader } from './components/common/TopHeader';
import { ToastContainer } from './components/common/ToastContainer';
import { OverviewView } from './components/gharbudget/OverviewView';
import { HistoryView } from './components/gharbudget/HistoryView';
import { GoalsView } from './components/gharbudget/GoalsView';
import { NewTransactionModal } from './components/gharbudget/NewTransactionModal';
import { NewGoalModal } from './components/gharbudget/NewGoalModal';
import { DepositModal } from './components/gharbudget/DepositModal';
import { ExportModal } from './components/gharbudget/ExportModal';
import { GaunSewaHome } from './components/gaunsewa/GaunSewaHome';
import { GaunSewaJobs } from './components/gaunsewa/GaunSewaJobs';
import { PostJobView } from './components/gaunsewa/PostJobView';
import { MyStatusView } from './components/gaunsewa/MyStatusView';
import { SettingsView } from './components/settings/SettingsView';
import { LoginView } from './components/auth/LoginView';
import { SignUpView } from './components/auth/SignUpView';
import { FinancialGoal, Transaction } from './types';

const MainAppContent: React.FC = () => {
  const {
    isAuthenticated,
    authView,
    activeApp,
    activeGBView,
    activeGSView,
    setActiveGSView,
  } = useApp();

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals state
  const [newTxOpen, setNewTxOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [newGoalOpen, setNewGoalOpen] = useState(false);
  const [depositGoal, setDepositGoal] = useState<FinancialGoal | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  // If not authenticated, render Login or Signup screen
  if (!isAuthenticated) {
    if (authView === 'signup') {
      return <SignUpView />;
    }
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col md:flex-row text-slate-800 antialiased font-sans selection:bg-[#005B48]/20 selection:text-[#005B48]">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Sticky Header */}
        <TopHeader
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenNewEntry={() => {
            setEditingTx(null);
            setNewTxOpen(true);
          }}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeApp === 'gharbudget' ? (
            <>
              {activeGBView === 'overview' && (
                <OverviewView
                  onOpenNewEntry={() => {
                    setEditingTx(null);
                    setNewTxOpen(true);
                  }}
                  onOpenExport={() => setExportOpen(true)}
                />
              )}
              {activeGBView === 'history' && (
                <HistoryView
                  onOpenAddExpense={() => {
                    setEditingTx(null);
                    setNewTxOpen(true);
                  }}
                  onEditTransaction={(tx) => {
                    setEditingTx(tx);
                    setNewTxOpen(true);
                  }}
                />
              )}
              {activeGBView === 'goals' && (
                <GoalsView
                  onOpenNewGoal={() => setNewGoalOpen(true)}
                  onOpenDeposit={(goal) => setDepositGoal(goal)}
                />
              )}
              {activeGBView === 'settings' && <SettingsView />}
            </>
          ) : (
            <>
              {activeGSView === 'home' && <GaunSewaHome />}
              {activeGSView === 'jobs' && (
                <GaunSewaJobs onOpenPostJob={() => setActiveGSView('post-job')} />
              )}
              {activeGSView === 'post-job' && <PostJobView />}
              {activeGSView === 'status' && <MyStatusView />}
              {activeGSView === 'settings' && <SettingsView />}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <NewTransactionModal
        isOpen={newTxOpen}
        onClose={() => {
          setNewTxOpen(false);
          setEditingTx(null);
        }}
        initialData={editingTx}
      />

      <NewGoalModal
        isOpen={newGoalOpen}
        onClose={() => setNewGoalOpen(false)}
      />

      <DepositModal
        goal={depositGoal}
        onClose={() => setDepositGoal(null)}
      />

      <ExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
      />

      {/* Toast alerts */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
