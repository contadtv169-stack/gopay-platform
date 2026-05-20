'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Plus, Eye, Copy, ExternalLink, Trash2, Sparkles,
  Layout, Image, Type, Video, Timer, MousePointer, X, Check,
  Palette, Download, Share2
} from 'lucide-react';
import { generateId } from '@/lib/utils';

interface LandingPage {
  id: string;
  name: string;
  template: string;
  status: 'draft' | 'published';
  views: number;
  conversions: number;
  createdAt: Date;
}

export default function LandingPagesPage() {
  const [pages, setPages] = useState<LandingPage[]>([
    { id: '1', name: 'Página - Curso Premium', template: 'SaaS', status: 'published', views: 1234, conversions: 89, createdAt: new Date() },
    { id: '2', name: 'Página - Consultoria', template: 'Serviços', status: 'draft', views: 0, conversions: 0, createdAt: new Date() },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [newPage, setNewPage] = useState({ name: '', template: 'saas' });

  const templates = [
    { id: 'saas', name: 'SaaS', icon: <Layout className="w-8 h-8" />, desc: 'Para produtos digitais e software' },
    { id: 'curso', name: 'Curso', icon: <Video className="w-8 h-8" />, desc: 'Para cursos e treinamentos' },
    { id: 'ebook', name: 'E-book', icon: <FileText className="w-8 h-8" />, desc: 'Para ebooks e materiais' },
    { id: 'servicos', name: 'Serviços', icon: <Type className="w-8 h-8" />, desc: 'Para serviços profissionais' },
    { id: 'loja', name: 'Loja', icon: <Image className="w-8 h-8" />, desc: 'Para produtos físicos' },
    { id: 'igreja', name: 'Igreja', icon: <Sparkles className="w-8 h-8" />, desc: 'Para igrejas e ministérios' },
    { id: 'delivery', name: 'Delivery', icon: <Timer className="w-8 h-8" />, desc: 'Para delivery e restaurantes' },
    { id: 'iptv', name: 'IPTV', icon: <Video className="w-8 h-8" />, desc: 'Para serviços de streaming' },
  ];

  const handleCreate = () => {
    if (!newPage.name) return;
    const page: LandingPage = {
      id: generateId(), name: newPage.name, template: newPage.template,
      status: 'draft', views: 0, conversions: 0, createdAt: new Date()
    };
    setPages([page, ...pages]);
    setShowModal(false);
    setNewPage({ name: '', template: 'saas' });
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt) return;
    setAiGenerating(true);
    // Simula geração IA
    await new Promise(r => setTimeout(r, 2000));
    const page: LandingPage = {
      id: generateId(), name: `Página IA - ${aiPrompt.slice(0, 30)}`, template: 'saas',
      status: 'draft', views: 0, conversions: 0, createdAt: new Date()
    };
    setPages([page, ...pages]);
    setAiGenerating(false);
    setShowAI(false);
    setShowModal(false);
    setAiPrompt('');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Landing Pages</h1>
          <p className="text-gray-400 mt-1">Crie páginas de conversão com templates ou IA</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowAI(true)} className="btn-secondary flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Criar com IA
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> Nova Página
          </button>
        </div>
      </div>

      {/* Templates */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Templates Disponíveis</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => { setNewPage({ ...newPage, template: t.id }); setShowModal(true); }}
              className="card-premium text-center group hover:border-gopay-blue/30 transition-all"
            >
              <div className="text-gopay-blue mb-3 flex justify-center group-hover:scale-110 transition-transform">{t.icon}</div>
              <h3 className="font-semibold">{t.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Pages List */}
      <div className="grid gap-4">
        {pages.map((page) => (
          <motion.div key={page.id} layout className="card-premium">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-gopay-success/20 to-gopay-blue/20">
                  <FileText className="w-6 h-6 text-gopay-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{page.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-1 rounded-full bg-gopay-dark">{page.template}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${page.status === 'published' ? 'bg-gopay-success/10 text-gopay-success' : 'bg-gopay-warning/10 text-gopay-warning'}`}>
                      {page.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center"><p className="text-lg font-bold">{page.views}</p><p className="text-xs text-gray-500">Views</p></div>
                <div className="text-center"><p className="text-lg font-bold">{page.conversions}</p><p className="text-xs text-gray-500">Conversões</p></div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg hover:bg-white/5"><Eye className="w-4 h-4 text-gray-400" /></button>
                  <button className="p-2 rounded-lg hover:bg-white/5"><Copy className="w-4 h-4 text-gray-400" /></button>
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative glass rounded-3xl p-8 w-full max-w-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Nova Landing Page</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/5"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Nome da Página</label>
                  <input type="text" value={newPage.name} onChange={(e) => setNewPage({ ...newPage, name: e.target.value })} className="input-premium" placeholder="Ex: Página de Vendas Curso" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Template</label>
                  <div className="grid grid-cols-2 gap-3">
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative glass rounded-3xl p-8 w-full max-w-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gopay-blue to-gopay-purple flex items-center justify-center"><Sparkles className="w-5 h-5" /></div>
                <div>
                  <h2 className="text-2xl font-bold">Criar com IA</h2>
                  <p className="text-sm text-gray-500">Descreva sua página e a IA cria para você</p>
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Descreva sua página</label>
                  <textarea
                    value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}
                    className="input-premium min-h-[120px] resize-none"
                    placeholder="Ex: Página de vendas para curso de marketing digital com depoimentos, timer de urgência e checkout integrado..."
                  />
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
