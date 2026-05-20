'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, LayoutDashboard, Link2, ShoppingCart, FileText, Wallet,
  Image, Bot, Settings, LogOut, Menu, X, Bell, Search, Home
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bottomNavOpen, setBottomNavOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/login');
      else setUser(session.user);
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
    { icon: <Link2 className="w-5 h-5" />, label: 'Links', href: '/dashboard/links' },
    { icon: <ShoppingCart className="w-5 h-5" />, label: 'Checkouts', href: '/dashboard/checkouts' },
    { icon: <FileText className="w-5 h-5" />, label: 'Landing Pages', href: '/dashboard/landing-pages' },
    { icon: <Wallet className="w-5 h-5" />, label: 'Financeiro', href: '/dashboard/financeiro' },
    { icon: <Image className="w-5 h-5" />, label: 'Placas', href: '/dashboard/placas' },
    { icon: <Bot className="w-5 h-5" />, label: 'IA', href: '/dashboard/ia' },
    { icon: <Settings className="w-5 h-5" />, label: 'Config', href: '/dashboard/configuracoes' },
  ];

  const bottomItems = [
    { icon: <LayoutDashboard className="w-6 h-6" />, label: 'Home', href: '/dashboard' },
    { icon: <Link2 className="w-6 h-6" />, label: 'Links', href: '/dashboard/links' },
    { icon: <Wallet className="w-6 h-6" />, label: 'Financeiro', href: '/dashboard/financeiro' },
    { icon: <Bot className="w-6 h-6" />, label: 'IA', href: '/dashboard/ia' },
    { icon: <Settings className="w-6 h-6" />, label: 'Config', href: '/dashboard/configuracoes' },
  ];

  const isActive = (href: string) => pathname === href;

  if (!user) {
    return <div className="min-h-screen bg-gopay-darker flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-gopay-blue border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="min-h-screen bg-gopay-darker flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed h-full bg-gopay-card border-r border-gopay-border w-64">
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gopay-blue to-gopay-purple flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold">Go<span className="gradient-text">Pay</span></span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive(item.href) ? 'bg-gradient-to-r from-gopay-blue/20 to-gopay-purple/20 text-gopay-blue' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-gopay-border">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 w-full transition-all">
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: -300 }} animate={{ x: 0 }} className="absolute left-0 top-0 bottom-0 w-64 bg-gopay-card border-r border-gopay-border">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gopay-blue to-gopay-purple flex items-center justify-center"><Zap className="w-6 h-6 text-white" /></div>
                  <span className="text-xl font-bold">Go<span className="gradient-text">Pay</span></span>
                </div>
                <button onClick={() => setSidebarOpen(false)}><X className="w-6 h-6" /></button>
              </div>
              <nav className="px-3 py-4 space-y-1">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive(item.href) ? 'bg-gradient-to-r from-gopay-blue/20 to-gopay-purple/20 text-gopay-blue' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
                <button onClick={() => { handleLogout(); setSidebarOpen(false); }} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 w-full transition-all">
                  <LogOut className="w-5 h-5" />
                  <span>Sair</span>
                </button>
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 glass border-b border-gopay-border">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-white/5">
                <Menu className="w-6 h-6" />
              </button>
              <Link href="/" className="lg:hidden flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gopay-blue to-gopay-purple flex items-center justify-center"><Zap className="w-5 h-5 text-white" /></div>
                <span className="font-bold">Go<span className="gradient-text">Pay</span></span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-white/5 relative">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-gopay-blue rounded-full" />
              </button>
              <div className="flex items-center gap-2 pl-2 border-l border-gopay-border">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gopay-blue to-gopay-purple flex items-center justify-center font-semibold text-sm">
                  {user?.email?.charAt(0).toUpperCase()}
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

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass border-t border-gopay-border z-40 safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          {bottomItems.map((item) => (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all min-w-[56px] ${isActive(item.href) ? 'text-gopay-blue' : 'text-gray-500'}`}>
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
