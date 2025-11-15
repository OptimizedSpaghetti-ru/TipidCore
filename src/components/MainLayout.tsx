import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PiggyBank, Target, Wallet, CreditCard, Shield, Mail, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

export function MainLayout() {
  const location = useLocation();

  const navItems = [
    { path: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/app/piggybank', icon: PiggyBank, label: 'Piggybank' },
    { path: '/app/goals', icon: Target, label: 'Goals' },
    { path: '/app/envelopes', icon: Wallet, label: 'Envelopes' },
    { path: '/app/debt', icon: CreditCard, label: 'Debt' },
    { path: '/app/emergency-fund', icon: Shield, label: 'Emergency' },
    { path: '/app/future-notes', icon: Mail, label: 'Notes' },
    { path: '/app/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-r border-yellow-100 dark:border-gray-700 p-6">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <PiggyBank className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          <span className="text-yellow-900 dark:text-yellow-100">TipidCore</span>
        </Link>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  isActive
                    ? "bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40 text-yellow-900 dark:text-yellow-100"
                    : "text-yellow-600 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}