'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Zap, LayoutDashboard, Link2, ShoppingCart, FileText, Wallet,
  Image, Bot, Settings, LogOut, Menu, X, ChevronDown, Bell,
  Search, Sun, Moon, TrendingUp, Users, CreditCard, QrCode
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/login');
      else setUser(session?.user);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', href: '/dashboard' },
    { icon: <Link2 className="w-5 h-5" />, label: 'Links de Pagamento', href: '/dashboard/links' },
    { icon: <ShoppingCart className="w-5 h-5" />, label: 'Checkouts', href: '/dashboard/checkouts' },
    { icon: <FileText className="w-5 h-5" />, label: 'Landing Pages', href: '/dashboard/landing-pages' },
    { icon: <Wallet className="w-5 h-5" />, label: 'Financeiro', href: '/dashboard/financeiro' },
    { icon: <Image className="w-5 h-5" />, label: 'Placas Digitais', href: '/dashboard/placas' },
    { icon: <Bot className="w-5 h-5" />, label: 'Assistente IA', href: '/dashboard/ia' },
    { icon: <Settings className="w-5 h-5" />, label: 'Configurações', href: '/dashboard/configuracoes' },
  ];

  const isActive = (href: string) => pathname === href;

  if (!user) {
    return (
      <div className="min-h-screen bg-gopay-darker flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gopay-blue border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gopay-darker flex">
      {/* Sidebar Desktop */}
      <aside className={`hidden lg:flex flex-col fixed h-full bg-gopay-card border-r border-gopay-border transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gopay-blue to-gopay-purple flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-white" />
          </div>
          {sidebarOpen && <span className="text-xl font-bold">Go<span className="gradient-text">Pay</span></span>}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                isActive(item.href)
                  ? 'bg-gradient-to-r from-gopay-blue/20 to-gopay-purple/20 text-gopay-blue'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-gopay-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 w-full transition-all"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="absolute left-0 top-0 bottom-0 w-64 bg-gopay-card border-r border-gopay-border"
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gopay-blue to-gopay-purple flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Go<span className="gradient-text">Pay</span></span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="px-3 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-gopay-blue/20 to-gopay-purple/20 text-gopay-blue'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 glass border-b border-gopay-border">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/5"
              >
                <Menu className="w-6 h-6" />
              </button>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:block p-2 rounded-lg hover:bg-white/5"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden md:flex items-center gap-2 glass rounded-xl px-4 py-2">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="bg-transparent border-none outline-none text-sm w-48"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-white/5 relative">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-gopay-blue rounded-full" />
              </button>
              <div className="flex items-center gap-3 pl-3 border-l border-gopay-border">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gopay-blue to-gopay-purple flex items-center justify-center font-semibold text-sm">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user?.user_metadata?.name || 'Usuário'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
