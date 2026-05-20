'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Link2, Copy, ExternalLink, Trash2, Edit2, QrCode,
  CreditCard, DollarSign, Tag, Globe, Check, X, Eye
} from 'lucide-react';
import { formatCurrency, generateId } from '@/lib/utils';

interface PaymentLink {
  id: string;
  name: string;
  description: string;
  amount: number;
  type: 'fixed' | 'variable';
  slug: string;
  clicks: number;
  conversions: number;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export default function LinksPage() {
  const [links, setLinks] = useState<PaymentLink[]>([
    {
      id: '1', name: 'Curso Premium de Marketing', description: 'Acesso completo ao curso',
      amount: 29900, type: 'fixed', slug: 'curso-premium', clicks: 234, conversions: 45, status: 'active', createdAt: new Date()
    },
    {
      id: '2', name: 'Consultoria Individual', description: '1 hora de consultoria',
      amount: 15000, type: 'fixed', slug: 'consultoria', clicks: 156, conversions: 23, status: 'active', createdAt: new Date()
    },
    {
      id: '3', name: 'E-book Marketing Digital', description: 'Guia completo',
      amount: 4900, type: 'fixed', slug: 'ebook-marketing', clicks: 567, conversions: 89, status: 'active', createdAt: new Date()
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newLink, setNewLink] = useState({
    name: '', description: '', amount: '', type: 'fixed' as 'fixed' | 'variable', slug: ''
  });

  const handleCreateLink = () => {
    if (!newLink.name || !newLink.amount) return;

    const link: PaymentLink = {
      id: generateId(),
      name: newLink.name,
      description: newLink.description,
      amount: parseInt(newLink.amount) * 100,
      type: newLink.type,
      slug: newLink.slug || newLink.name.toLowerCase().replace(/\s+/g, '-'),
      clicks: 0,
      conversions: 0,
      status: 'active',
      createdAt: new Date(),
    };

    setLinks([link, ...links]);
    setShowModal(false);
    setNewLink({ name: '', description: '', amount: '', type: 'fixed', slug: '' });
  };

  const toggleStatus = (id: string) => {
    setLinks(links.map(l => l.id === id ? { ...l, status: l.status === 'active' ? 'inactive' : 'active' } : l));
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Links de Pagamento</h1>
          <p className="text-gray-400 mt-1">Crie e gerencie seus links de pagamento personalizados</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Novo Link
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-premium">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gopay-blue/10 text-gopay-blue"><Link2 className="w-6 h-6" /></div>
            <div>
              <p className="text-2xl font-bold">{links.length}</p>
              <p className="text-sm text-gray-500">Links Ativos</p>
            </div>
          </div>
        </div>
        <div className="card-premium">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gopay-purple/10 text-gopay-purple"><Globe className="w-6 h-6" /></div>
            <div>
              <p className="text-2xl font-bold">{links.reduce((a, l) => a + l.clicks, 0).toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total de Cliques</p>
            </div>
          </div>
        </div>
        <div className="card-premium">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gopay-success/10 text-gopay-success"><DollarSign className="w-6 h-6" /></div>
            <div>
              <p className="text-2xl font-bold">{links.reduce((a, l) => a + l.conversions, 0)}</p>
              <p className="text-sm text-gray-500">Conversões</p>
            </div>
          </div>
        </div>
      </div>

      {/* Links List */}
      <div className="grid gap-4">
        {links.map((link) => (
          <motion.div
            key={link.id}
            layout
            className="card-premium"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-gopay-blue/20 to-gopay-purple/20">
                  <Link2 className="w-6 h-6 text-gopay-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{link.name}</h3>
                  <p className="text-gray-500 text-sm">{link.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">gopay.com/pay/{link.slug}</span>
                    <button className="p-1 hover:bg-white/5 rounded">
                      <Copy className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-lg font-bold text-gopay-blue">{formatCurrency(link.amount)}</p>
                  <p className="text-xs text-gray-500">{link.type === 'fixed' ? 'Valor fixo' : 'Valor variável'}</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">{link.clicks}</p>
                  <p className="text-xs text-gray-500">Cliques</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">{link.conversions}</p>
                  <p className="text-xs text-gray-500">Vendas</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleStatus(link.id)} className={`px-3 py-1 rounded-full text-xs font-medium ${
                    link.status === 'active' ? 'bg-gopay-success/10 text-gopay-success' : 'bg-gray-500/10 text-gray-500'
                  }`}>
                    {link.status === 'active' ? 'Ativo' : 'Inativo'}
                  </button>
                  <button onClick={() => deleteLink(link.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Link Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative glass rounded-3xl p-8 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Novo Link de Pagamento</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/5">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Nome do Produto/Serviço</label>
                  <input
                    type="text" value={newLink.name} onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                    className="input-premium" placeholder="Ex: Curso Premium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Descrição</label>
                  <input
                    type="text" value={newLink.description} onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                    className="input-premium" placeholder="Breve descrição do produto"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Valor (R$)</label>
                    <input
                      type="number" value={newLink.amount} onChange={(e) => setNewLink({ ...newLink, amount: e.target.value })}
                      className="input-premium" placeholder="99.90"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Tipo</label>
                    <select
                      value={newLink.type} onChange={(e) => setNewLink({ ...newLink, type: e.target.value as 'fixed' | 'variable' })}
                      className="input-premium"
                    >
                      <option value="fixed">Valor Fixo</option>
                      <option value="variable">Valor Livre</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">URL Personalizada</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">gopay.com/pay/</span>
                    <input
                      type="text" value={newLink.slug} onChange={(e) => setNewLink({ ...newLink, slug: e.target.value })}
                      className="input-premium flex-1" placeholder="seu-link"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancelar</button>
                  <button onClick={handleCreateLink} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Criar Link
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
