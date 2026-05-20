'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Plus, Eye, Copy, ExternalLink, Trash2, Sparkles,
  Layout, Image, Type, Video, Timer, X, Check, Palette, Share2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface LandingPage {
  id: string;
  name: string;
  slug: string;
  template: string;
  status: string;
  views: number;
  conversions: number;
  created_at: string;
}

export default function LandingPagesPage() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [newPage, setNewPage] = useState({ name: '', template: 'saas' });

  useEffect(() => { loadPages(); }, []);

  const loadPages = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data } = await supabase.from('landing_pages').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
    setPages(data || []);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newPage.name) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const slug = newPage.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now().toString(36);

    const { error } = await supabase.from('landing_pages').insert({
      user_id: session.user.id,
      name: newPage.name,
      slug,
      template: newPage.template,
      content: { template: newPage.template },
    });

    if (!error) {
      await loadPages();
      setShowModal(false);
      setNewPage({ name: '', template: 'saas' });
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt) return;
    setAiGenerating(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: `Crie uma landing page para: ${aiPrompt}. Retorne apenas o JSON com: {headline, subheadline, cta, features: [], testimonials: [], price, guarantee}` }] }),
      });
      const data = await res.json();

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const slug = aiPrompt.slice(0, 30).toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString(36);
        await supabase.from('landing_pages').insert({
          user_id: session.user.id,
          name: `Página IA - ${aiPrompt.slice(0, 30)}`,
          slug,
          template: 'ai-generated',
          content: { template: 'ai-generated', prompt: aiPrompt, ai_content: data.content },
        });
        await loadPages();
      }
    } catch (err) {
      console.error('AI generation error:', err);
    }

    setAiGenerating(false);
    setShowAI(false);
    setShowModal(false);
    setAiPrompt('');
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    await supabase.from('landing_pages').update({ status: currentStatus === 'published' ? 'draft' : 'published' }).eq('id', id);
    await loadPages();
  };

  const deletePage = async (id: string) => {
    await supabase.from('landing_pages').delete().eq('id', id);
    await loadPages();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-gopay-blue border-t-transparent rounded-full" /></div>;

  const templates = [
    { id: 'saas', name: 'SaaS', icon: <Layout className="w-8 h-8" />, desc: 'Para produtos digitais' },
    { id: 'curso', name: 'Curso', icon: <Video className="w-8 h-8" />, desc: 'Para cursos' },
    { id: 'ebook', name: 'E-book', icon: <FileText className="w-8 h-8" />, desc: 'Para ebooks' },
    { id: 'servicos', name: 'Serviços', icon: <Type className="w-8 h-8" />, desc: 'Para serviços' },
    { id: 'loja', name: 'Loja', icon: <Image className="w-8 h-8" />, desc: 'Para produtos físicos' },
    { id: 'igreja', name: 'Igreja', icon: <Sparkles className="w-8 h-8" />, desc: 'Para igrejas' },
    { id: 'delivery', name: 'Delivery', icon: <Timer className="w-8 h-8" />, desc: 'Para delivery' },
    { id: 'iptv', name: 'IPTV', icon: <Video className="w-8 h-8" />, desc: 'Para streaming' },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Landing Pages</h1>
          <p className="text-gray-400 text-sm mt-1">Crie páginas de conversão com templates ou IA</p>
        </div>
        <div className="flex gap-2 lg:gap-3">
          <button onClick={() => setShowAI(true)} className="btn-secondary flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4" /> <span className="hidden sm:inline">Criar com IA</span>
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4 lg:w-5 lg:h-5" /> Nova Página
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Templates</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-4">
          {templates.map((t) => (
            <button key={t.id} onClick={() => { setNewPage({ ...newPage, template: t.id }); setShowModal(true); }} className="card-premium text-center py-3 lg:py-4 hover:border-gopay-blue/30 transition-all">
              <div className="text-gopay-blue flex justify-center mb-2">{t.icon}</div>
              <h3 className="font-medium text-sm">{t.name}</h3>
              <p className="text-xs text-gray-500 mt-1 hidden lg:block">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 lg:gap-4">
        {pages.map((page) => (
          <motion.div key={page.id} layout className="card-premium">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3 lg:gap-4">
                <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-br from-gopay-success/20 to-gopay-blue/20">
                  <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-gopay-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-base lg:text-lg">{page.name}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gopay-dark">{page.template}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${page.status === 'published' ? 'bg-gopay-success/10 text-gopay-success' : 'bg-gopay-warning/10 text-gopay-warning'}`}>
                      {page.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 lg:gap-6">
                <div className="text-center"><p className="text-lg font-bold">{page.views}</p><p className="text-xs text-gray-500">Views</p></div>
                <div className="text-center"><p className="text-lg font-bold">{page.conversions}</p><p className="text-xs text-gray-500">Conversões</p></div>
                <div className="flex gap-1 lg:gap-2">
                  <button onClick={() => toggleStatus(page.id, page.status)} className="p-1.5 lg:p-2 rounded-lg hover:bg-white/5"><Eye className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400" /></button>
                  <button onClick={() => deletePage(page.id)} className="p-1.5 lg:p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400"><Trash2 className="w-3 h-3 lg:w-4 lg:h-4" /></button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {pages.length === 0 && (
          <div className="card-premium text-center py-12">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400">Nenhuma landing page</h3>
            <p className="text-gray-500 text-sm mt-1">Crie sua primeira página de conversão</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative glass rounded-2xl lg:rounded-3xl p-6 lg:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl lg:text-2xl font-bold">Nova Landing Page</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/5"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4 lg:space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Nome da Página</label>
                  <input type="text" value={newPage.name} onChange={(e) => setNewPage({ ...newPage, name: e.target.value })} className="input-premium" placeholder="Ex: Página de Vendas Curso" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Template</label>
                  <div className="grid grid-cols-2 gap-2 lg:gap-3">
                    {templates.map((t) => (
                      <button key={t.id} onClick={() => setNewPage({ ...newPage, template: t.id })} className={`p-3 rounded-xl border text-left transition-all ${newPage.template === t.id ? 'border-gopay-blue bg-gopay-blue/10' : 'border-gopay-border hover:border-gopay-blue/30'}`}>
                        <span className="font-medium text-sm">{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancelar</button>
                  <button onClick={handleCreate} className="btn-primary flex-1 flex items-center justify-center gap-2"><Check className="w-4 h-4" /> Criar Página</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Modal */}
      <AnimatePresence>
        {showAI && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => setShowAI(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative glass rounded-2xl lg:rounded-3xl p-6 lg:p-8 w-full max-w-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gopay-blue to-gopay-purple flex items-center justify-center"><Sparkles className="w-5 h-5" /></div>
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold">Criar com IA</h2>
                  <p className="text-sm text-gray-500">Descreva sua página e a IA cria</p>
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Descreva sua página</label>
                  <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} className="input-premium min-h-[120px] resize-none" placeholder="Ex: Página de vendas para curso de marketing digital com depoimentos, timer de urgência e checkout integrado..." />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowAI(false)} className="btn-secondary flex-1">Cancelar</button>
                  <button onClick={handleAIGenerate} disabled={aiGenerating} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    {aiGenerating ? (<><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Gerando...</>) : (<><Sparkles className="w-4 h-4" /> Gerar com IA</>)}
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
