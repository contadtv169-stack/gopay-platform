'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, DollarSign, CreditCard, Users, ArrowUpRight, ArrowDownRight,
  QrCode, Link2, ShoppingCart, Zap, Plus, Copy, ExternalLink, Clock,
  FileText, Image
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0, transactions: 0, customers: 0, conversionRate: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [paymentLinks, setPaymentLinks] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUser(session.user);
      const uid = session.user.id;

      // Fetch profile stats
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', uid).single();
      if (profile) {
        setStats({
          revenue: profile.total_revenue || 0,
          transactions: profile.total_transactions || 0,
          customers: 0,
          conversionRate: 0
        });
      }

      // Fetch payment links
      const { data: links } = await supabase.from('payment_links').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(5);
      setPaymentLinks(links || []);

      // Fetch transactions
      const { data: txs } = await supabase.from('transactions').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(5);
      setRecentTransactions(txs || []);

      // Monthly revenue
      const { data: allTxs } = await supabase.from('transactions').select('amount, created_at, type').eq('user_id', uid).eq('type', 'income').eq('status', 'completed').order('created_at', { ascending: true });
      if (allTxs) {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const grouped: Record<string, number> = {};
        allTxs.forEach(tx => {
          const m = months[new Date(tx.created_at).getMonth()];
          grouped[m] = (grouped[m] || 0) + tx.amount;
        });
        setRevenueData(Object.entries(grouped).map(([name, revenue]) => ({ name, revenue })));
      }

      // Payment methods distribution
      const methods = [
        { name: 'PIX', value: 55, color: '#10B981' },
        { name: 'Cartão Crédito', value: 30, color: '#7C3AED' },
        { name: 'Cartão Débito', value: 10, color: '#00D4FF' },
        { name: 'Outros', value: 5, color: '#F59E0B' },
      ];
      setPaymentMethods(methods);

      setLoading(false);
    };
    init();
  }, []);

  const statCards = [
    { icon: <DollarSign className="w-6 h-6" />, label: 'Receita Total', value: formatCurrency(stats.revenue), change: '+23.5%', trend: 'up' as const, color: 'text-gopay-blue' },
    { icon: <CreditCard className="w-6 h-6" />, label: 'Transações', value: stats.transactions.toLocaleString(), change: '+18.2%', trend: 'up' as const, color: 'text-gopay-purple' },
    { icon: <Users className="w-6 h-6" />, label: 'Clientes Ativos', value: stats.customers.toLocaleString(), change: '+31.4%', trend: 'up' as const, color: 'text-gopay-success' },
    { icon: <TrendingUp className="w-6 h-6" />, label: 'Taxa de Conversão', value: `${stats.conversionRate}%`, change: '+5.1%', trend: 'up' as const, color: 'text-gopay-warning' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-gopay-blue border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">
          Olá, {user?.user_metadata?.name || 'Usuário'} 👋
        </h1>
        <p className="text-gray-400 text-sm lg:text-base">Resumo da sua conta hoje.</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card-premium">
            <div className="flex items-start justify-between">
              <div className={`p-2 lg:p-3 rounded-xl bg-white/5 ${stat.color}`}>{stat.icon}</div>
              <div className={`flex items-center gap-1 text-xs lg:text-sm ${stat.trend === 'up' ? 'text-gopay-success' : 'text-gopay-danger'}`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 lg:w-4 lg:h-4" /> : <ArrowDownRight className="w-3 h-3 lg:w-4 lg:h-4" />}
                {stat.change}
              </div>
            </div>
            <p className="text-lg lg:text-2xl font-bold mt-3 lg:mt-4">{stat.value}</p>
            <p className="text-xs lg:text-sm text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 card-premium">
          <h2 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">Receita Mensal</h2>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(v) => `R$${v / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#12121A', border: '1px solid #1E1E2E', borderRadius: '12px' }} formatter={(value: number) => formatCurrency(value)} />
                <Area type="monotone" dataKey="revenue" stroke="#00D4FF" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              <p>Sem dados ainda. Crie links de pagamento para começar!</p>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card-premium">
          <h2 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">Métodos de Pagamento</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={paymentMethods} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                {paymentMethods.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {paymentMethods.map((method, i) => (
              <div key={i} className="flex items-center justify-between text-xs lg:text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: method.color }} />
                  <span className="text-gray-400">{method.name}</span>
                </div>
                <span className="font-medium">{method.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card-premium">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-semibold">Transações Recentes</h2>
            <a href="/dashboard/financeiro" className="text-gopay-blue text-sm hover:underline">Ver todas</a>
          </div>
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 lg:py-3 border-b border-gopay-border last:border-0">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className={`p-2 rounded-lg ${tx.method === 'PIX' ? 'bg-gopay-success/10 text-gopay-success' : 'bg-gopay-purple/10 text-gopay-purple'}`}>
                      {tx.type === 'income' ? <ArrowUpRight className="w-3 h-3 lg:w-4 lg:h-4" /> : <ArrowDownRight className="w-3 h-3 lg:w-4 lg:h-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{tx.description}</p>
                      <p className="text-xs text-gray-500">{formatDate(tx.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${tx.amount >= 0 ? 'text-gopay-success' : 'text-gopay-danger'}`}>
                      {tx.amount >= 0 ? '+' : ''}{formatCurrency(tx.amount)}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${tx.status === 'completed' ? 'bg-gopay-success/10 text-gopay-success' : 'bg-gopay-warning/10 text-gopay-warning'}`}>
                      {tx.status === 'completed' ? 'Concluído' : 'Pendente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-500 text-sm">Nenhuma transação ainda.</div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="card-premium">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-semibold">Links de Pagamento</h2>
            <a href="/dashboard/links" className="btn-primary text-sm py-2 px-3 lg:px-4 flex items-center gap-1 lg:gap-2">
              <Plus className="w-3 h-3 lg:w-4 lg:h-4" /> Novo
            </a>
          </div>
          {paymentLinks.length > 0 ? (
            <div className="space-y-3">
              {paymentLinks.map((link) => (
                <div key={link.id} className="p-3 lg:p-4 rounded-xl bg-gopay-dark/50 border border-gopay-border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-sm lg:text-base">{link.name}</h3>
                      <p className="text-xs text-gray-500">gopay.com/pay/{link.slug}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => navigator.clipboard.writeText(`https://gopay.com/pay/${link.slug}`)} className="p-1.5 rounded-lg hover:bg-white/5">
                        <Copy className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs lg:text-sm">
                    <span className="text-gopay-blue font-semibold">{formatCurrency(link.amount)}</span>
                    <div className="flex gap-3 text-gray-500">
                      <span>{link.clicks} cliques</span>
                      <span>{link.conversions} vendas</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-500 text-sm">Nenhum link criado. Crie seu primeiro!</div>
          )}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="card-premium">
        <h2 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">Ações Rápidas</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {[
            { icon: <Link2 className="w-5 h-5 lg:w-6 lg:h-6" />, label: 'Criar Link', href: '/dashboard/links', color: 'from-gopay-blue/20 to-gopay-blue/5' },
            { icon: <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />, label: 'Novo Checkout', href: '/dashboard/checkouts', color: 'from-gopay-purple/20 to-gopay-purple/5' },
            { icon: <FileText className="w-5 h-5 lg:w-6 lg:h-6" />, label: 'Landing Page', href: '/dashboard/landing-pages', color: 'from-gopay-success/20 to-gopay-success/5' },
            { icon: <Image className="w-5 h-5 lg:w-6 lg:h-6" />, label: 'Placa Digital', href: '/dashboard/placas', color: 'from-gopay-warning/20 to-gopay-warning/5' },
          ].map((action, i) => (
            <a key={i} href={action.href} className={`p-4 lg:p-6 rounded-xl bg-gradient-to-br ${action.color} border border-gopay-border hover:border-gopay-blue/30 transition-all group`}>
              <div className="text-gopay-blue mb-2 lg:mb-3 group-hover:scale-110 transition-transform">{action.icon}</div>
              <p className="font-medium text-sm lg:text-base">{action.label}</p>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
