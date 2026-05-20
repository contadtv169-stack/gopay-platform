'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap, QrCode, CreditCard, Copy, Check, Shield, Clock, DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { QRCodeSVG } from 'qrcode.react';
import { formatCurrency } from '@/lib/utils';

export default function PaymentPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [link, setLink] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [customAmount, setCustomAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const loadLink = async () => {
      const { data, error } = await supabase.from('payment_links').select('*, profiles(name, business_name)').eq('slug', slug).eq('status', 'active').single();
      if (data) setLink(data);
      setLoading(false);
    };
    loadLink();
  }, [slug]);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(link?.profiles?.pix_key || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayment = async () => {
    setProcessing(true);
    const amount = link.type === 'variable' ? Math.round(parseFloat(customAmount) * 100) : link.amount;

    const { data: { session } } = await supabase.auth.getSession();

    const { error } = await supabase.from('transactions').insert({
      user_id: link.user_id,
      type: 'income',
      description: `Pagamento via ${paymentMethod === 'pix' ? 'PIX' : 'Cartão'} - ${link.name}`,
      amount,
      status: 'completed',
      payment_method: paymentMethod === 'pix' ? 'PIX' : 'CARD',
      reference_id: link.id,
    });

    if (!error) {
      await supabase.from('payment_links').update({
        conversions: (link.conversions || 0) + 1,
        revenue: (link.revenue || 0) + amount,
      }).eq('id', link.id);
      setPaymentSuccess(true);
    }
    setProcessing(false);
  };

  if (loading) return <div className="min-h-screen bg-gopay-darker flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-gopay-blue border-t-transparent rounded-full" /></div>;

  if (!link) return (
    <div className="min-h-screen bg-gopay-darker flex items-center justify-center p-4">
      <div className="text-center">
        <Zap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-400">Link não encontrado</h1>
        <p className="text-gray-500 mt-2">Este link de pagamento não existe ou foi desativado.</p>
      </div>
    </div>
  );

  const finalAmount = link.type === 'variable' ? (customAmount ? Math.round(parseFloat(customAmount) * 100) : 0) : link.amount;

  if (paymentSuccess) return (
    <div className="min-h-screen bg-gopay-darker flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-3xl p-8 text-center max-w-md w-full">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gopay-success/20 flex items-center justify-center">
          <Check className="w-10 h-10 text-gopay-success" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Pagamento Confirmado!</h1>
        <p className="text-gray-400 mb-6">Seu pagamento de {formatCurrency(finalAmount)} foi processado com sucesso.</p>
        <div className="p-4 rounded-xl bg-gopay-dark/50 mb-6">
          <p className="text-sm text-gray-500">Produto</p>
          <p className="font-semibold">{link.name}</p>
        </div>
        <a href="/" className="btn-primary w-full block">Voltar ao início</a>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gopay-darker flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gopay-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gopay-purple/5 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="glass rounded-3xl p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gopay-blue to-gopay-purple flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">GoPay</h1>
              <p className="text-gray-500 text-sm">Pagamento seguro</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gopay-dark/50 mb-6">
            <h2 className="font-semibold text-lg">{link.name}</h2>
            {link.description && <p className="text-gray-400 text-sm mt-1">{link.description}</p>}
            <p className="text-sm text-gray-500 mt-2">Por: {link.profiles?.business_name || link.profiles?.name}</p>
          </div>

          {link.type === 'variable' && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-300">Valor (R$)</label>
              <input type="number" step="0.01" value={customAmount} onChange={(e) => setCustomAmount(e.target.value)} className="input-premium text-center text-2xl font-bold" placeholder="0,00" />
            </div>
          )}

          {link.type === 'fixed' && (
            <div className="text-center mb-6">
              <p className="text-4xl font-bold gradient-text">{formatCurrency(link.amount)}</p>
            </div>
          )}

          <div className="flex gap-2 mb-6">
            <button onClick={() => setPaymentMethod('pix')} className={`flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${paymentMethod === 'pix' ? 'bg-gopay-success/20 text-gopay-success border border-gopay-success/30' : 'bg-gopay-dark/50 text-gray-400 border border-gopay-border'}`}>
              <QrCode className="w-4 h-4" /> PIX
            </button>
            <button onClick={() => setPaymentMethod('card')} className={`flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${paymentMethod === 'card' ? 'bg-gopay-blue/20 text-gopay-blue border border-gopay-blue/30' : 'bg-gopay-dark/50 text-gray-400 border border-gopay-border'}`}>
              <CreditCard className="w-4 h-4" /> Cartão
            </button>
          </div>

          {paymentMethod === 'pix' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-6">
              <div className="bg-white rounded-2xl p-4 inline-block mb-4">
                <QRCodeSVG value={`pix://pay?merchant=${link.profiles?.business_name || 'GoPay'}&amount=${finalAmount / 100}`} size={200} />
              </div>
              <p className="text-sm text-gray-400 mb-3">Escaneie o QR Code ou copie a chave PIX</p>
              <button onClick={handleCopyPix} className="btn-secondary w-full flex items-center justify-center gap-2">
                {copied ? <><Check className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar Chave PIX</>}
              </button>
            </motion.div>
          )}

          {paymentMethod === 'card' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 mb-6">
              <input type="text" className="input-premium" placeholder="Número do cartão" />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" className="input-premium" placeholder="MM/AA" />
                <input type="text" className="input-premium" placeholder="CVV" />
              </div>
              <input type="text" className="input-premium" placeholder="Nome no cartão" />
            </motion.div>
          )}

          <button onClick={handlePayment} disabled={processing || (link.type === 'variable' && !customAmount)} className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2">
            {processing ? (<><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Processando...</>) : (<><DollarSign className="w-5 h-5" /> Pagar {formatCurrency(finalAmount)}</>)}
          </button>

          <div className="flex items-center justify-center gap-4 mt-6 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Pagamento seguro</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Processamento instantâneo</span>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">Powered by GoPay • Pagamentos inteligentes</p>
      </motion.div>
    </div>
  );
}
