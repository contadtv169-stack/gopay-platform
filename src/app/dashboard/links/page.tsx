'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Link2, Copy, ExternalLink, Trash2, QrCode,
  DollarSign, Tag, Globe, Check, X, Eye
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';

interface PaymentLink {
  id: string;
  name: string;
  description: string;
  amount: number;
  type: string;
  slug: string;
  clicks: number;
  conversions: number;
  status: string;
  created_at: string;
}

export default function LinksPage() {
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newLink, setNewLink] = useState({ name: '', description: '', amount: '', type: 'fixed', slug: '' });

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data } = await supabase.from('payment_links').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
    setLinks(data || []);
    setLoading(false);
  };

  const handleCreateLink = async () => {
    if (!newLink.name || !newLink.amount) return;
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const slug = newLink.slug || newLink.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now().toString(36);

    const { error } = await supabase.from('payment_links').insert({
      user_id: session.user.id,
      name: newLink.name,
      description: newLink.description,
      amount: Math.round(parseFloat(newLink.amount) * 100),
      type: newLink.type,
      slug,
    });

    if (!error) {
      await loadLinks();
      setShowModal(false);
      setNewLink({ name: '', description: '', amount: '', type: 'fixed', slug: '' });
    }
    setSaving(false);
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    await supabase.from('payment_links').update({ status: currentStatus === 'active' ? 'inactive' : 'active' }).eq('id', id);
    await loadLinks();
  };

  const deleteLink = async (id: string) => {
    await supabase.from('payment_links').delete().eq('id', id);
    await loadLinks();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-gopay-blue border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Links de Pagamento</h1>
          <p className="text-gray-400 text-sm mt-1">Crie e gerencie seus links de pagamento</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm lg:text-base">
          <Plus className="w-4 h-4 lg:w-5 lg:h-5" /> Novo Link
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
        <div className="card-premium">
          <div className="flex items-center gap-3">
            <div className="p-2 lg:p-3 rounded-xl bg-gopay-blue/10 text-gopay-blue"><Link2 className="w-5 h-5 lg:w-6 lg:h-6" /></div>
            <div><p className="text-xl lg:text-2xl font-bold">{links.filter(l => l.status === 'active').length}</p><p className="text-xs lg:text-sm text-gray-500">Links Ativos</p></div>
          </div>
        </div>
        <div className="card-premium">
          <div className="flex items-center gap-3">
            <div className="p-2 lg:p-3 rounded-xl bg-gopay-purple/10 text-gopay-purple"><Globe className="w-5 h-5 lg:w-6 lg:h-6" /></div>
            <div><p className="text-xl lg:text-2xl font-bold">{links.reduce((a, l) => a + l.clicks, 0).toLocaleString()}</p><p className="text-xs lg:text-sm text-gray-500">Total de Cliques</p></div>
          </div>
        </div>
        <div className="card-premium">
          <div className="flex items-center gap-3">
            <div className="p-2 lg:p-3 rounded-xl bg-gopay-success/10 text-gopay-success"><DollarSign className="w-5 h-5 lg:w-6 lg:h-6" /></div>
            <div><p className="text-xl lg:text-2xl font-bold">{links.reduce((a, l) => a + l.conversions, 0)}</p><p className="text-xs lg:text-sm text-gray-500">Conversões</p></div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 lg:gap-4">
        {links.map((link) => (
          <motion.div key={link.id} layout className="card-premium">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3 lg:gap-4">
                <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-br from-gopay-blue/20 to-gopay-purple/20">
                  <Link2 className="w-5 h-5 lg:w-6 lg:h-6 text-gopay-blue" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-base lg:text-lg truncate">{link.name}</h3>
                  <p className="text-gray-500 text-xs lg:text-sm truncate">{link.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 truncate">gopay.com/pay/{link.slug}</span>
                    <button onClick={() => { navigator.clipboard.writeText(`https://gopay.com/pay/${link.slug}`); }} className="p-1 hover:bg-white/5 rounded flex-shrink-0">
                      <Copy className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 lg:gap-6">
                <div className="text-center"><p className="text-base lg:text-lg font-bold text-gopay-blue">{formatCurrency(link.amount)}</p><p className="text-xs text-gray-500">{link.type === 'fixed' ? 'Fixo' : 'Livre'}</p></div>
                <div className="text-center hidden sm:block"><p className="text-base lg:text-lg font-bold">{link.clicks}</p><p className="text-xs text-gray-500">Cliques</p></div>
                <div className="text-center hidden sm:block"><p className="text-base lg:text-lg font-bold">{link.conversions}</p><p className="text-xs text-gray-500">Vendas</p></div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleStatus(link.id, link.status)} className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${link.status === 'active' ? 'bg-gopay-success/10 text-gopay-success' : 'bg-gray-500/10 text-gray-500'}`}>
                    {link.status === 'active' ? 'Ativo' : 'Inativo'}
                  </button>
                  <button onClick={() => deleteLink(link.id)} className="p-1.5 lg:p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400">
                    <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {links.length === 0 && (
          <div className="card-premium text-center py-12">
            <Link2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400">Nenhum link criado</h3>
            <p className="text-gray-500 text-sm mt-1">Crie seu primeiro link de pagamento</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative glass rounded-2xl lg:rounded-3xl p-6 lg:p-8 w-full max-w-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl lg:text-2xl font-bold">Novo Link de Pagamento</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/5"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-4 lg:space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Nome do Produto/Serviço</label>
                  <input type="text" value={newLink.name} onChange={(e) => setNewLink({ ...newLink, name: e.target.value })} className="input-premium" placeholder="Ex: Curso Premium" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Descrição</label>
                  <input type="text" value={newLink.description} onChange={(e) => setNewLink({ ...newLink, description: e.target.value })} className="input-premium" placeholder="Breve descrição" />
                </div>
                <div className="grid grid-cols-2 gap-3 lg:gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Valor (R$)</label>
                    <input type="number" step="0.01" value={newLink.amount} onChange={(e) => setNewLink({ ...newLink, amount: e.target.value })} className="input-premium" placeholder="99.90" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Tipo</label>
                    <select value={newLink.type} onChange={(e) => setNewLink({ ...newLink, type: e.target.value })} className="input-premium">
                      <option value="fixed">Valor Fixo</option>
                      <option value="variable">Valor Livre</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">URL Personalizada</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">gopay.com/pay/</span>
                    <input type="text" value={newLink.slug} onChange={(e) => setNewLink({ ...newLink, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} className="input-premium flex-1" placeholder="seu-link" />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancelar</button>
                  <button onClick={handleCreateLink} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    {saving ? (<><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Salvando...</>) : (<><Check className="w-4 h-4" /> Criar Link</>)}
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
