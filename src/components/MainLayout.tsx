import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PiggyBank,
  Target,
  Wallet,
  CreditCard,
  Shield,
  Mail,
  Settings,
} from "lucide-react";
import { cn } from "../lib/utils";

export function MainLayout() {
  const location = useLocation();

  const navItems = [
    { path: "/app/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/app/piggybank", icon: PiggyBank, label: "Piggybank" },
    { path: "/app/goals", icon: Target, label: "Goals" },
    { path: "/app/envelopes", icon: Wallet, label: "Envelopes" },
    { path: "/app/debt", icon: CreditCard, label: "Debt" },
    { path: "/app/emergency-fund", icon: Shield, label: "Emergency" },
    { path: "/app/future-notes", icon: Mail, label: "Notes" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white/90 backdrop-blur-sm border-r border-yellow-200 shadow-lg p-6">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <PiggyBank className="w-8 h-8 text-yellow-600" />
          <span className="text-2xl font-bold text-yellow-900">TipidCore</span>
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
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                  isActive
                    ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-yellow-100 hover:text-yellow-900"
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
