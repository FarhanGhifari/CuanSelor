"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  WalletCards, 
  MessageCircle, 
  Smile, 
  Menu,
  X,
  LogOut,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ROUTES } from "@/lib/constants/routes";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

const navItems = [
  {
    name: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    name: "Tanya FindSor!",
    href: "/dashboard/projection",
    icon: MessageCircle,
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: Smile,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push(ROUTES.HOME);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans selection:bg-[#10B981]/30">
      {/* Mobile Navbar */}
      <nav className="lg:hidden fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-white font-bold text-sm">
            CS
          </div>
          <span className="font-extrabold text-xl tracking-tight text-gray-900">CuanSelor</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Sidebar (Desktop) & Mobile Drawer */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Brand */}
        <div className="h-20 flex items-center gap-3 px-8">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/20">
            CS
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-gray-900">CuanSelor</span>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-2xl font-medium transition-all duration-200 group relative overflow-hidden",
                  isActive 
                    ? "text-[#10B981] bg-emerald-50/50" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#10B981] rounded-r-full" />
                )}
                <item.icon 
                  size={22} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={cn(
                    "transition-transform duration-300",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )} 
                />
                <span className="text-[15px]">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* User / Logout */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={22} strokeWidth={2} />
            <span className="text-[15px]">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-72 pt-16 lg:pt-0 min-h-screen flex flex-col">
        {/* Top Header (Desktop only) */}
        <header className="hidden lg:flex h-20 items-center justify-between px-10 bg-white/50 backdrop-blur-xl sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Hi, Gen Z! 👋</h1>
            <p className="text-sm text-gray-500 font-medium">Ready to rule your finances today?</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2.5 rounded-full bg-white hover:bg-gray-50 border border-gray-100 transition-colors">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>
            </button>
            <div className="h-10 w-10 rounded-full bg-linear-to-tr from-emerald-400 to-[#10B981] p-0.5 cursor-pointer">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center border-2 border-white">
                <Smile className="text-[#10B981]" size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
