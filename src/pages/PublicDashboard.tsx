import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, Target, TrendingUp, Lock, Sparkles } from 'lucide-react';

export const PublicDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F5F2] via-white to-[#E8F2EE]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-[#005B48] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-slate-900">GharBudget</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-[#005B48] transition-colors">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 rounded-xl bg-[#005B48] hover:bg-[#004A3A] text-white text-sm font-bold transition-all">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left animate-in fade-in-50 zoom-in-95">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#005B48]/10 text-[#005B48] text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                <span>New: Admin Dashboard & Role-Based Access Control</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                Your Household Budget & Community Marketplace
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0">
                Track expenses, achieve savings goals, and connect with local services — all in one secure, beautifully designed platform built for Nepalese households.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-8">
                <Link to="/signup" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#005B48] hover:bg-[#004A3A] text-white text-base font-bold shadow-lg shadow-[#005B48]/25 transition-all active:scale-[0.99]">
                  Create Free Account
                </Link>
                <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#005B48] text-base font-bold transition-all active:scale-[0.99]">
                  Sign In
                </Link>
              </div>
              <p className="mt-6 text-sm text-slate-500">
                No credit card required · 14-day free trial · Cancel anytime
              </p>
            </div>

            {/* Right - Dashboard Preview */}
            <div className="relative animate-in fade-in-50 slide-in-from-right-50 duration-700">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[#005B48]/5 rounded-2xl p-4 text-center">
                      <div className="text-3xl font-extrabold text-[#005B48]">125,000</div>
                      <div className="text-xs text-slate-500 mt-1">Total Received</div>
                    </div>
                    <div className="bg-amber-50 rounded-2xl p-4 text-center">
                      <div className="text-3xl font-extrabold text-amber-700">45,300</div>
                      <div className="text-xs text-slate-500 mt-1">Total Spent</div>
                    </div>
                    <div className="bg-emerald-50 rounded-2xl p-4 text-center">
                      <div className="text-3xl font-extrabold text-emerald-700">79,700</div>
                      <div className="text-xs text-slate-500 mt-1">Saved</div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-600">Monthly Budget</span>
                      <span className="text-xs font-bold text-slate-400">75% used</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#005B48] to-[#10B981] rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-3 border border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-[#005B48]" />
                        <span className="text-xs font-semibold text-slate-700">Groceries</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-extrabold text-slate-900">18,200</span>
                        <span className="text-xs text-slate-400 ml-1">40%</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-xs font-semibold text-slate-700">Rent</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-extrabold text-slate-900">15,800</span>
                        <span className="text-xs text-slate-400 ml-1">35%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 hidden lg:block">
                <div className="bg-white rounded-2xl p-4 shadow-xl shadow-slate-200/50 border border-slate-100 animate-in fade-in slide-in-from-top-10 duration-700 delay-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-[#005B48]" />
                    <span className="text-sm font-bold text-slate-700">Bank-grade Security</span>
                  </div>
                  <p className="text-xs text-slate-500">256-bit encryption & secure JWT auth</p>
                </div>
              </div>
              <div className="absolute bottom-4 -left-4 hidden lg:block">
                <div className="bg-white rounded-2xl p-4 shadow-xl shadow-slate-200/50 border border-slate-100 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-[#005B48]" />
                    <span className="text-sm font-bold text-slate-700">Community Marketplace</span>
                  </div>
                  <p className="text-xs text-slate-500">Find local jobs & services nearby</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Everything you need to manage money & community
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful features for household budgeting and community connection, all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: 'Smart Budgeting',
                desc: 'Track income & expenses with Nepali number formatting. Set monthly budgets and get real-time alerts.',
              },
              {
                icon: TrendingUp,
                title: 'Savings Goals',
                desc: 'Create visual savings goals with progress tracking. Celebrate milestones with confetti animations!',
              },
              {
                icon: Users,
                title: 'GaunSewa Marketplace',
                desc: 'Post jobs, find local services, and connect with trusted providers in your community.',
              },
              {
                icon: Lock,
                title: 'Bank-Grade Security',
                desc: 'JWT authentication, bcrypt password hashing, and role-based access control (RBAC).',
              },
              {
                icon: Sparkles,
                title: 'Admin Dashboard',
                desc: 'Full user management: view, create, edit, deactivate users. Search, filter, and assign roles.',
              },
              {
                icon: TrendingUp,
                title: 'Nepali Localization',
                desc: 'Nepali number formatting (1,25,000), NPR currency, and Nepali calendar support.',
              },
            ].map((feature, index) => (
              <div key={index} className="group bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-100 transition-all duration-300 hover:shadow-xl hover:border-[#005B48]/20">
                <div className="w-12 h-12 rounded-xl bg-[#005B48]/10 flex items-center justify-center mb-4 group-hover:bg-[#005B48] group-hover:text-white transition-colors">
                  <feature.icon className="w-6 h-6 text-[#005B48] group-hover:text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Features Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F0F5F2]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
                  Powerful Admin Dashboard
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  Complete user management with search, filters, role assignment, and bulk actions. Built with security-first RBAC.
                </p>
                <ul className="space-y-3">
                  {[
                    'View all registered users with pagination',
                    'Search & filter by name, email, role, status',
                    'Create, edit, activate/deactivate users',
                    'Assign roles: User, Admin',
                    'Secure RBAC protects all admin routes',
                    'Audit trail for admin actions',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 rounded-full bg-[#005B48]/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-[#005B48]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M9 9h6v6H9z" />
                      <path d="M12 15h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Admin Dashboard Preview</h3>
                  <p className="text-slate-500 text-sm">Search, filter, manage users with ease</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Ready to take control of your finances?
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
            Join thousands of households managing their budgets smarter. Free to start, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#005B48] hover:bg-[#004A3A] text-white text-base font-bold shadow-lg shadow-[#005B48]/25 transition-all">
              Create Free Account
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#005B48] text-base font-bold transition-all">
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#005B48] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <span className="text-xl font-extrabold text-white">GharBudget</span>
              </div>
              <p className="text-sm text-slate-500">Smart budgeting for Nepalese households. Community marketplace included.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/signup" className="hover:text-white transition-colors">Get Started</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/admin/login" className="hover:text-white transition-colors">Admin Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li>Budget Tracking</li>
                <li>Savings Goals</li>
                <li>GaunSewa Marketplace</li>
                <li>Admin Dashboard</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>© 2024 GharBudget & GaunSewa. Built for Nepalese households.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};