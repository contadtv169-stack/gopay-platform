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
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const revenueData = [
  { name: 'Jan', revenue: 12000, transactions: 120 },
  { name: 'Fev', revenue: 18000, transactions: 180 },
  { name: 'Mar', revenue: 15000, transactions: 150 },
  { name: 'Abr', revenue: 25000, transactions: 250 },
  { name: 'Mai', revenue: 32000, transactions: 320 },
  { name: 'Jun', revenue: 28000, transactions: 280 },
  { name: 'Jul', revenue: 42000, transactions: 420 },
];

const paymentMethods = [
  { name: 'PIX', value: 55, color: '#10B981' },
  { name: 'Cartão Crédito', value: 30, color: '#7C3AED' },
  { name: 'Cartão Débito', value: 10, color: '#00D4FF' },
  { name: 'Outros', value: 5, color: '#F59E0B' },
];

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 47890,
    transactions: 1247,
    customers: 892,
    conversionRate: 94.2,
  });

  const [recentTransactions, setRecentTransactions] = useState([
    { id: 'tx_001', customer: 'Carlos Silva', amount: 29900, method: 'PIX', status: 'completed', date: new Date() },
    { id: 'tx_002', customer: 'Maria Santos', amount: 14900, method: 'Cartão', status: 'completed', date: new Date(Date.now() - 3600000) },
    { id: 'tx_003', customer: 'João Oliveira', amount: 59900, method: 'PIX', status: 'pending', date: new Date(Date.now() - 7200000) },
    { id: 'tx_004', customer: 'Ana Costa', amount: 9900, method: 'Cartão', status: 'completed', date: new Date(Date.now() - 10800000) },
    { id: 'tx_005', customer: 'Pedro Lima', amount: 19900, method: 'PIX', status: 'completed', date: new Date(Date.now() - 14400000) },
  ]);

  const [paymentLinks, setPaymentLinks] = useState([
    { id: 'link_001', name: 'Curso Premium', amount: 29900, clicks: 234, conversions: 45, url: 'gopay.com/pay/curso-premium' },
    { id: 'link_002', name: 'Consultoria', amount: 15000, clicks: 156, conversions: 23, url: 'gopay.com/pay/consultoria' },
    { id: 'link_003', name: 'E-book Marketing', amount: 4900, clicks: 567, conversions: 89, url: 'gopay.com/pay/ebook-marketing' },
  ]);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUser(session.user);
      setLoading(false);
    };
    init();
  }, []);

  const statCards = [
    { icon: <DollarSign className="w-6 h-6" />, label: 'Receita Total', value: formatCurrency(stats.revenue), change: '+23.5%', trend: 'up', color: 'text-gopay-blue' },
    { icon: <CreditCard className="w-6 h-6" />, label: 'Transações', value: stats.transactions.toLocaleString(), change: '+18.2%', trend: 'up', color: 'text-gopay-purple' },
    { icon: <Users className="w-6 h-6" />, label: 'Clientes Ativos', value: stats.customers.toLocaleString(), change: '+31.4%', trend: 'up', color: 'text-gopay-success' },
    { icon: <TrendingUp className="w-6 h-6" />, label: 'Taxa de Conversão', value: `${stats.conversionRate}%`, change: '+5.1%', trend: 'up', color: 'text-gopay-warning' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-gopay-blue border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">
          Olá, {user?.user_metadata?.name || 'Usuário'} 👋
        </h1>
        <p className="text-gray-400">Aqui está o resumo da sua conta hoje.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-premium"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-gopay-success' : 'text-gopay-danger'}`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-bold mt-4">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 card-premium"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Receita Mensal</h2>
            <select className="bg-gopay-dark border border-gopay-border rounded-lg px-3 py-2 text-sm">
              <option>Últimos 7 meses</option>
              <option>Último ano</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" tickFormatter={(v) => `R$${v / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#12121A', border: '1px solid #1E1E2E', borderRadius: '12px' }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Area type="monotone" dataKey="revenue" stroke="#00D4FF" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card-premium"
        >
          <h2 className="text-xl font-semibold mb-6">Métodos de Pagamento</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={paymentMethods}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {paymentMethods.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {paymentMethods.map((method, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
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

      {/* Recent Transactions & Payment Links */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card-premium"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Transações Recentes</h2>
            <button className="text-gopay-blue text-sm hover:underline">Ver todas</button>
          </div>
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gopay-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tx.method === 'PIX' ? 'bg-gopay-success/10 text-gopay-success' : 'bg-gopay-purple/10 text-gopay-purple'}`}>
                    {tx.method === 'PIX' ? <QrCode className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-medium">{tx.customer}</p>
                    <p className="text-xs text-gray-500">{formatDate(tx.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(tx.amount)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    tx.status === 'completed' ? 'bg-gopay-success/10 text-gopay-success' : 'bg-gopay-warning/10 text-gopay-warning'
                  }`}>
                    {tx.status === 'completed' ? 'Concluído' : 'Pendente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Payment Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card-premium"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Links de Pagamento</h2>
            <button className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Novo Link
            </button>
          </div>
          <div className="space-y-4">
            {paymentLinks.map((link) => (
              <div key={link.id} className="p-4 rounded-xl bg-gopay-dark/50 border border-gopay-border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{link.name}</h3>
                    <p className="text-sm text-gray-500">{link.url}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg hover:bg-white/5">
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/5">
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gopay-blue font-semibold">{formatCurrency(link.amount)}</span>
                  <div className="flex gap-4 text-gray-500">
                    <span>{link.clicks} cliques</span>
                    <span>{link.conversions} vendas</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card-premium"
      >
        <h2 className="text-xl font-semibold mb-6">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Link2 className="w-6 h-6" />, label: 'Criar Link', href: '/dashboard/links', color: 'from-gopay-blue/20 to-gopay-blue/5' },
            { icon: <ShoppingCart className="w-6 h-6" />, label: 'Novo Checkout', href: '/dashboard/checkouts', color: 'from-gopay-purple/20 to-gopay-purple/5' },
            { icon: <FileText className="w-6 h-6" />, label: 'Landing Page', href: '/dashboard/landing-pages', color: 'from-gopay-success/20 to-gopay-success/5' },
            { icon: <Image className="w-6 h-6" />, label: 'Placa Digital', href: '/dashboard/placas', color: 'from-gopay-warning/20 to-gopay-warning/5' },
          ].map((action, i) => (
            <a
              key={i}
              href={action.href}
              className={`p-6 rounded-xl bg-gradient-to-br ${action.color} border border-gopay-border hover:border-gopay-blue/30 transition-all group`}
            >
              <div className="text-gopay-blue mb-3 group-hover:scale-110 transition-transform">{action.icon}</div>
              <p className="font-medium">{action.label}</p>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
