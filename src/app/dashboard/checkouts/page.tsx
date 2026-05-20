'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Plus, Copy, ExternalLink, Trash2, Edit2,
  Settings, Tag, Package, X, Check, CreditCard, QrCode
} from 'lucide-react';
import { formatCurrency, generateId } from '@/lib/utils';

interface Checkout {
  id: string;
  name: string;
  products: { name: string; price: number }[];
  orderBump: { name: string; price: number } | null;
  upsell: { name: string; price: number } | null;
  status: 'active' | 'draft';
  conversions: number;
  revenue: number;
}

export default function CheckoutsPage() {
  const [checkouts, setCheckouts] = useState<Checkout[]>([
    {
      id: '1', name: 'Checkout - Curso Premium',
      products: [{ name: 'Curso Premium', price: 29900 }],
      orderBump: { name: 'Mentoria em Grupo', price: 9700 },
      upsell: { name: 'Acesso VIP', price: 19700 },
      status: 'active', conversions: 45, revenue: 1345500
    },
    {
      id: '2', name: 'Checkout - Pacote Consultoria',
      products: [{ name: 'Consultoria 5h', price: 50000 }],
      orderBump: null, upsell: { name: 'Consultoria 10h', price: 90000 },
      status: 'active', conversions: 12, revenue: 600000
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newCheckout, setNewCheckout] = useState({
    name: '', productName: '', productPrice: '',
    orderBumpName: '', orderBumpPrice: '',
    upsellName: '', upsellPrice: ''
  });

  const handleCreate = () => {
    if (!newCheckout.name || !newCheckout.productName) return;

    const checkout: Checkout = {
      id: generateId(), name: newCheckout.name,
      products: [{ name: newCheckout.productName, price: parseInt(newCheckout.productPrice) * 100 }],
      orderBump: newCheckout.orderBumpName ? { name: newCheckout.orderBumpName, price: parseInt(newCheckout.orderBumpPrice) * 100 } : null,
      upsell: newCheckout.upsellName ? { name: newCheckout.upsellName, price: parseInt(newCheckout.upsellPrice) * 100 } : null,
      status: 'active', conversions: 0, revenue: 0
    };

    setCheckouts([checkout, ...checkouts]);
    setShowModal(false);
    setNewCheckout({ name: '', productName: '', productPrice: '', orderBumpName: '', orderBumpPrice: '', upsellName: '', upsellPrice: '' });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Checkouts Inteligentes</h1>
          <p className="text-gray-400 mt-1">Crie checkouts otimizados com order bump e upsell</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Novo Checkout
        </button>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: <Package className="w-6 h-6" />, title: 'Order Bump', desc: 'Ofereça produtos adicionais no checkout' },
          { icon: <Tag className="w-6 h-6" />, title: 'Upsell', desc: 'Aumente o ticket médio com ofertas premium' },
          { icon: <Settings className="w-6 h-6" />, title: 'Personalização', desc: 'Customize cores, textos e layout' },
        ].map((feature, i) => (
          <div key={i} className="card-premium">
            <div className="text-gopay-blue mb-3">{feature.icon}</div>
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Checkouts List */}
      <div className="grid gap-4">
        {checkouts.map((checkout) => (
          <motion.div key={checkout.id} layout className="card-premium">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-gopay-purple/20 to-gopay-blue/20">
                  <ShoppingCart className="w-6 h-6 text-gopay-purple" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{checkout.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {checkout.products.map((p, i) => (
                      <span key={i} className="px-2 py-1 rounded-lg bg-gopay-dark text-xs">{p.name} - {formatCurrency(p.price)}</span>
                    ))}
                    {checkout.orderBump && (
                      <span className="px-2 py-1 rounded-lg bg-gopay-warning/10 text-gopay-warning text-xs flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Order Bump: {checkout.orderBump.name}
                      </span>
                    )}
                    {checkout.upsell && (
                      <span className="px-2 py-1 rounded-lg bg-gopay-success/10 text-gopay-success text-xs flex items-center gap-1">
                        <ArrowUp className="w-3 h-3" /> Upsell: {checkout.upsell.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-lg font-bold">{checkout.conversions}</p>
                  <p className="text-xs text-gray-500">Vendas</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gopay-success">{formatCurrency(checkout.revenue)}</p>
                  <p className="text-xs text-gray-500">Receita</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg hover:bg-white/5"><Copy className="w-4 h-4 text-gray-400" /></button>
                  <button className="p-2 rounded-lg hover:bg-white/5"><ExternalLink className="w-4 h-4 text-gray-400" /></button>
                  <button className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative glass rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Novo Checkout</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/5"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Nome do Checkout</label>
                  <input type="text" value={newCheckout.name} onChange={(e) => setNewCheckout({ ...newCheckout, name: e.target.value })} className="input-premium" placeholder="Ex: Checkout Curso Premium" />
                </div>

                <div className="p-4 rounded-xl bg-gopay-dark/50 border border-gopay-border">
                  <h3 className="font-medium mb-3 flex items-center gap-2"><Package className="w-4 h-4" /> Produto Principal</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={newCheckout.productName} onChange={(e) => setNewCheckout({ ...newCheckout, productName: e.target.value })} className="input-premium" placeholder="Nome do produto" />
                    <input type="number" value={newCheckout.productPrice} onChange={(e) => setNewCheckout({ ...newCheckout, productPrice: e.target.value })} className="input-premium" placeholder="Preço (R$)" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gopay-dark/50 border border-gopay-border">
                  <h3 className="font-medium mb-3 flex items-center gap-2"><Tag className="w-4 h-4" /> Order Bump (Opcional)</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={newCheckout.orderBumpName} onChange={(e) => setNewCheckout({ ...newCheckout, orderBumpName: e.target.value })} className="input-premium" placeholder="Nome" />
                    <input type="number" value={newCheckout.orderBumpPrice} onChange={(e) => setNewCheckout({ ...newCheckout, orderBumpPrice: e.target.value })} className="input-premium" placeholder="Preço (R$)" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gopay-dark/50 border border-gopay-border">
                  <h3 className="font-medium mb-3 flex items-center gap-2"><ArrowUp className="w-4 h-4" /> Upsell (Opcional)</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={newCheckout.upsellName} onChange={(e) => setNewCheckout({ ...newCheckout, upsellName: e.target.value })} className="input-premium" placeholder="Nome" />
                    <input type="number" value={newCheckout.upsellPrice} onChange={(e) => setNewCheckout({ ...newCheckout, upsellPrice: e.target.value })} className="input-premium" placeholder="Preço (R$)" />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancelar</button>
                  <button onClick={handleCreate} className="btn-primary flex-1 flex items-center justify-center gap-2"><Check className="w-4 h-4" /> Criar Checkout</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ArrowUp(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
  );
}
