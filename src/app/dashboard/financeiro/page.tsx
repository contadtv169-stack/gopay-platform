'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet, DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  CreditCard, QrCode, Download, Calendar, Filter, AlertCircle, Check,
  Clock, RefreshCw, Zap
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatDate, calculateFee } from '@/lib/utils';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const PLAN_PRICE = 2990;

export default function FinanceiroPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [pendingBalance, setPendingBalance] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalFees, setTotalFees] = useState(0);
  const [hasEnoughBalance, setHasEnoughBalance] = useState(true);
  const [planPaid, setPlanPaid] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUser(session.user);

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (profile) {
        setBalance(profile.balance || 0);
        setAvailableBalance(profile.available_balance || 0);
        setPendingBalance(profile.pending_balance || 0);
        setTotalRevenue(profile.total_revenue || 0);
        setHasEnoughBalance((profile.balance || 0) >= PLAN_PRICE);
      }

      const { data: txs } = await supabase.from('transactions').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(50);
      setTransactions(txs || []);

      const fees = (txs || []).filter(t => t.type === 'fee').reduce((a, t) => a + Math.abs(t.amount), 0);
      setTotalFees(fees);

      // Monthly data
      const { data: allTxs } = await supabase.from('transactions').select('amount, created_at').eq('user_id', session.user.id).eq('type', 'income').eq('status', 'completed').order('created_at', { ascending: true });
      if (allTxs && allTxs.length > 0) {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const grouped: Record<string, number> = {};
        allTxs.forEach(tx => {
          const m = months[new Date(tx.created_at).getMonth()];
          grouped[m] = (grouped[m] || 0) + tx.amount;
        });
        setRevenueData(Object.entries(grouped).map(([name, revenue]) => ({ name, revenue, net: revenue * 0.95 })));
      }

      setLoading(false);
    };
    init();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-gopay-blue border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Financeiro</h1>
        <p className="text-gray-400 text-sm mt-1">Gerencie seus ganhos, taxas e pagamentos</p>
      </div>

      {!hasEnoughBalance && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-gopay-warning/10 border border-gopay-warning/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-gopay-warning flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gopay-warning">Saldo insuficiente para o plano Pro</h3>
            <p className="text-sm text-gray-400 mt-1">Sua conta precisa de {formatCurrency(PLAN_PRICE)} para manter todos os recursos. No momento, você pode criar links e vender. Quando tiver saldo, o plano será ativado.</p>
          </div>
        </motion.div>
      )}

      {hasEnoughBalance && planPaid && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-gopay-success/10 border border-gopay-success/20 flex items-start gap-3">
          <Check className="w-5 h-5 text-gopay-success flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gopay-success">Plano Pro ativo</h3>
            <p className="text-sm text-gray-400 mt-1">Próxima cobrança: {formatCurrency(PLAN_PRICE)}. Todos os recursos disponíveis.</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="card-premium">
          <div className="flex items-center gap-3">
            <div className="p-2 lg:p-3 rounded-xl bg-gopay-blue/10 text-gopay-blue"><Wallet className="w-5 h-5 lg:w-6 lg:h-6" /></div>
            <div><p className="text-lg lg:text-2xl font-bold">{formatCurrency(balance)}</p><p className="text-xs lg:text-sm text-gray-500">Saldo Total</p></div>
          </div>
        </div>
        <div className="card-premium">
          <div className="flex items-center gap-3">
            <div className="p-2 lg:p-3 rounded-xl bg-gopay-success/10 text-gopay-success"><DollarSign className="w-5 h-5 lg:w-6 lg:h-6" /></div>
            <div><p className="text-lg lg:text-2xl font-bold">{formatCurrency(availableBalance)}</p><p className="text-xs lg:text-sm text-gray-500">Disponível</p></div>
          </div>
        </div>
        <div className="card-premium">
          <div className="flex items-center gap-3">
            <div className="p-2 lg:p-3 rounded-xl bg-gopay-warning/10 text-gopay-warning"><Clock className="w-5 h-5 lg:w-6 lg:h-6" /></div>
            <div><p className="text-lg lg:text-2xl font-bold">{formatCurrency(pendingBalance)}</p><p className="text-xs lg:text-sm text-gray-500">Pendente</p></div>
          </div>
        </div>
        <div className="card-premium">
          <div className="flex items-center gap-3">
            <div className="p-2 lg:p-3 rounded-xl bg-gopay-purple/10 text-gopay-purple"><TrendingUp className="w-5 h-5 lg:w-6 lg:h-6" /></div>
            <div><p className="text-lg lg:text-2xl font-bold">{formatCurrency(totalFees)}</p><p className="text-xs lg:text-sm text-gray-500">Taxas GoPay (5%)</p></div>
          </div>
        </div>
      </div>

      {revenueData.length > 0 && (
        <div className="card-premium">
          <h2 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">Receita vs Líquido</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
              <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(v) => `R$${v / 1000}k`} />
              <Tooltip contentStyle={{ backgroundColor: '#12121A', border: '1px solid #1E1E2E', borderRadius: '12px' }} formatter={(value: number) => formatCurrency(value)} />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRev)" name="Receita" />
              <Area type="monotone" dataKey="net" stroke="#00D4FF" fillOpacity={0} name="Líquido" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card-premium">
        <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Como funcionam as taxas</h2>
        <div className="grid sm:grid-cols-3 gap-3 lg:gap-6">
          <div className="p-3 lg:p-4 rounded-xl bg-gopay-dark/50">
            <div className="flex items-center gap-2 mb-2"><Zap className="w-4 h-4 lg:w-5 lg:h-5 text-gopay-blue" /><h3 className="font-medium text-sm lg:text-base">Taxa por Transação</h3></div>
            <p className="text-xs lg:text-sm text-gray-400">5% de cada venda é direcionado para a GoPay.</p>
          </div>
          <div className="p-3 lg:p-4 rounded-xl bg-gopay-dark/50">
            <div className="flex items-center gap-2 mb-2"><RefreshCw className="w-4 h-4 lg:w-5 lg:h-5 text-gopay-purple" /><h3 className="font-medium text-sm lg:text-base">Plano Mensal</h3></div>
            <p className="text-xs lg:text-sm text-gray-400">{formatCurrency(PLAN_PRICE)}/mês. Cobrado quando há saldo.</p>
          </div>
          <div className="p-3 lg:p-4 rounded-xl bg-gopay-dark/50">
            <div className="flex items-center gap-2 mb-2"><AlertCircle className="w-4 h-4 lg:w-5 lg:h-5 text-gopay-warning" /><h3 className="font-medium text-sm lg:text-base">Sem Saldo?</h3></div>
            <p className="text-xs lg:text-sm text-gray-400">Conta limitada: só cria links até vender e pagar.</p>
          </div>
        </div>
      </div>

      <div className="card-premium">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h2 className="text-lg lg:text-xl font-semibold">Histórico de Transações</h2>
          <div className="flex gap-2">
            <button className="btn-secondary text-xs lg:text-sm py-2 flex items-center gap-1 lg:gap-2"><Filter className="w-3 h-3 lg:w-4 lg:h-4" /> <span className="hidden sm:inline">Filtrar</span></button>
            <button className="btn-secondary text-xs lg:text-sm py-2 flex items-center gap-1 lg:gap-2"><Download className="w-3 h-3 lg:w-4 lg:h-4" /> <span className="hidden sm:inline">Exportar</span></button>
          </div>
        </div>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-2 lg:py-3 border-b border-gopay-border last:border-0">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className={`p-2 rounded-lg ${tx.type === 'income' ? 'bg-gopay-success/10 text-gopay-success' : tx.type === 'fee' ? 'bg-gopay-purple/10 text-gopay-purple' : 'bg-gopay-warning/10 text-gopay-warning'}`}>
                  {tx.type === 'income' ? <ArrowUpRight className="w-3 h-3 lg:w-4 lg:h-4" /> : tx.type === 'fee' ? <TrendingDown className="w-3 h-3 lg:w-4 lg:h-4" /> : <CreditCard className="w-3 h-3 lg:w-4 lg:h-4" />}
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
          {transactions.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">Nenhuma transação ainda.</div>
          )}
        </div>
      </div>
    </div>
  );
}
