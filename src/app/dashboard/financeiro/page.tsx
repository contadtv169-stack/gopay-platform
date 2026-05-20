'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet, DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  CreditCard, QrCode, Download, Calendar, Filter, AlertCircle, Check, X,
  Clock, RefreshCw, Zap
} from 'lucide-react';
import { formatCurrency, formatDate, calculateFee } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

const monthlyData = [
  { name: 'Jan', revenue: 8500, fees: 425, net: 8075 },
  { name: 'Fev', revenue: 12000, fees: 600, net: 11400 },
  { name: 'Mar', revenue: 9800, fees: 490, net: 9310 },
  { name: 'Abr', revenue: 15000, fees: 750, net: 14250 },
  { name: 'Mai', revenue: 18500, fees: 925, net: 17575 },
  { name: 'Jun', revenue: 22000, fees: 1100, net: 20900 },
  { name: 'Jul', revenue: 28500, fees: 1425, net: 27075 },
];

const PLAN_PRICE = 2990; // R$ 29,90

export default function FinanceiroPage() {
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState(47890);
  const [availableBalance, setAvailableBalance] = useState(42100);
  const [pendingBalance, setPendingBalance] = useState(5790);
  const [hasEnoughBalance, setHasEnoughBalance] = useState(true);
  const [planPaid, setPlanPaid] = useState(true);
  const [nextBillingDate, setNextBillingDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const [platformFee] = useState(5);

  const [transactions] = useState([
    { id: 'tx_001', type: 'income', description: 'Pagamento via PIX - Carlos Silva', amount: 29900, date: new Date(), status: 'completed' },
    { id: 'tx_002', type: 'income', description: 'Pagamento via Cartão - Maria Santos', amount: 14900, date: new Date(Date.now() - 3600000), status: 'completed' },
    { id: 'tx_003', type: 'fee', description: 'Taxa da plataforma GoPay (5%)', amount: -1495, date: new Date(Date.now() - 3600000), status: 'completed' },
    { id: 'tx_004', type: 'income', description: 'Pagamento via PIX - João Oliveira', amount: 59900, date: new Date(Date.now() - 7200000), status: 'pending' },
    { id: 'tx_005', type: 'plan', description: 'Plano GoPay Pro - Mensalidade', amount: -PLAN_PRICE, date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), status: 'completed' },
    { id: 'tx_006', type: 'income', description: 'Pagamento via Cartão - Ana Costa', amount: 9900, date: new Date(Date.now() - 10800000), status: 'completed' },
    { id: 'tx_007', type: 'fee', description: 'Taxa da plataforma GoPay (5%)', amount: -495, date: new Date(Date.now() - 10800000), status: 'completed' },
  ]);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const bal = session.user.user_metadata?.balance || 0;
        setBalance(bal);
        setHasEnoughBalance(bal >= PLAN_PRICE);
      }
    };
    init();
  }, []);

  const totalFees = transactions.filter(t => t.type === 'fee').reduce((a, t) => a + Math.abs(t.amount), 0);
  const totalIncome = transactions.filter(t => t.type === 'income' && t.status === 'completed').reduce((a, t) => a + t.amount, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Financeiro</h1>
        <p className="text-gray-400 mt-1">Gerencie seus ganhos, taxas e pagamentos</p>
      </div>

      {/* Billing Alert */}
      {!hasEnoughBalance && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-gopay-warning/10 border border-gopay-warning/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-gopay-warning flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gopay-warning">Saldo insuficiente para o plano Pro</h3>
            <p className="text-sm text-gray-400 mt-1">
              Sua conta precisa de {formatCurrency(PLAN_PRICE)} para manter todos os recursos ativos.
              No momento, você pode apenas criar links de pagamento e vender. Quando tiver saldo, o plano será ativado automaticamente.
            </p>
          </div>
        </motion.div>
      )}

      {hasEnoughBalance && planPaid && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-gopay-success/10 border border-gopay-success/20 flex items-start gap-3">
          <Check className="w-5 h-5 text-gopay-success flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gopay-success">Plano Pro ativo</h3>
            <p className="text-sm text-gray-400 mt-1">
              Próxima cobrança: {formatCurrency(PLAN_PRICE)} em {formatDate(nextBillingDate)}. Todos os recursos estão disponíveis.
            </p>
          </div>
        </motion.div>
      )}

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-premium">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gopay-blue/10 text-gopay-blue"><Wallet className="w-6 h-6" /></div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
              <p className="text-sm text-gray-500">Saldo Total</p>
            </div>
          </div>
        </div>
        <div className="card-premium">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gopay-success/10 text-gopay-success"><DollarSign className="w-6 h-6" /></div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(availableBalance)}</p>
              <p className="text-sm text-gray-500">Disponível</p>
            </div>
          </div>
        </div>
        <div className="card-premium">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gopay-warning/10 text-gopay-warning"><Clock className="w-6 h-6" /></div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(pendingBalance)}</p>
              <p className="text-sm text-gray-500">Pendente</p>
            </div>
          </div>
        </div>
        <div className="card-premium">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gopay-purple/10 text-gopay-purple"><TrendingUp className="w-6 h-6" /></div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(totalFees)}</p>
              <p className="text-sm text-gray-500">Taxas GoPay ({platformFee}%)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card-premium">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Receita vs Taxas</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-lg bg-gopay-dark text-sm">7 meses</button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
            <XAxis dataKey="name" stroke="#6B7280" />
            <YAxis stroke="#6B7280" tickFormatter={(v) => `R$${v / 1000}k`} />
            <Tooltip contentStyle={{ backgroundColor: '#12121A', border: '1px solid #1E1E2E', borderRadius: '12px' }} formatter={(value: number) => formatCurrency(value)} />
            <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRev)" name="Receita" />
            <Area type="monotone" dataKey="net" stroke="#00D4FF" fillOpacity={0} name="Líquido" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* How Fees Work */}
      <div className="card-premium">
        <h2 className="text-xl font-semibold mb-4">Como funcionam as taxas GoPay</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-gopay-dark/50">
            <div className="flex items-center gap-2 mb-2"><Zap className="w-5 h-5 text-gopay-blue" /><h3 className="font-medium">Taxa por Transação</h3></div>
            <p className="text-sm text-gray-400">{platformFee}% de cada venda é automaticamente direcionado para a GoPay como taxa de plataforma.</p>
          </div>
          <div className="p-4 rounded-xl bg-gopay-dark/50">
            <div className="flex items-center gap-2 mb-2"><RefreshCw className="w-5 h-5 text-gopay-purple" /><h3 className="font-medium">Plano Mensal</h3></div>
            <p className="text-sm text-gray-400">{formatCurrency(PLAN_PRICE)}/mês. Cobrado automaticamente quando há saldo na conta.</p>
          </div>
          <div className="p-4 rounded-xl bg-gopay-dark/50">
            <div className="flex items-center gap-2 mb-2"><AlertCircle className="w-5 h-5 text-gopay-warning" /><h3 className="font-medium">Sem Saldo?</h3></div>
            <p className="text-sm text-gray-400">Sua conta fica limitada a criar links de pagamento. Continue vendendo até ter saldo para o plano.</p>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="card-premium">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Histórico de Transações</h2>
          <div className="flex gap-2">
            <button className="btn-secondary text-sm py-2 flex items-center gap-2"><Filter className="w-4 h-4" /> Filtrar</button>
            <button className="btn-secondary text-sm py-2 flex items-center gap-2"><Download className="w-4 h-4" /> Exportar</button>
          </div>
        </div>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gopay-border last:border-0">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  tx.type === 'income' ? 'bg-gopay-success/10 text-gopay-success' :
                  tx.type === 'fee' ? 'bg-gopay-purple/10 text-gopay-purple' :
                  'bg-gopay-warning/10 text-gopay-warning'
                }`}>
                  {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : tx.type === 'fee' ? <TrendingDown className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                </div>
                <div>
                  <p className="font-medium text-sm">{tx.description}</p>
                  <p className="text-xs text-gray-500">{formatDate(tx.date)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${tx.amount >= 0 ? 'text-gopay-success' : 'text-gopay-danger'}`}>
                  {tx.amount >= 0 ? '+' : ''}{formatCurrency(tx.amount)}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  tx.status === 'completed' ? 'bg-gopay-success/10 text-gopay-success' : 'bg-gopay-warning/10 text-gopay-warning'
                }`}>
                  {tx.status === 'completed' ? 'Concluído' : 'Pendente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
