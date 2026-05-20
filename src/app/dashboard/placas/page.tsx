'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image, Plus, Download, Share2, QrCode, Palette, Upload,
  Store, Church, Truck, Tv, Music, ShoppingBag, X, Check,
  Printer, FileImage, FileText, Copy
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '@/lib/supabase';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface DigitalPlate {
  id: string;
  name: string;
  business_name: string;
  pix_key: string;
  theme: string;
  amount: number | null;
  plate_type: string;
  status: string;
  created_at: string;
}

const themes = [
  { id: 'neon-blue', name: 'Neon Azul', bg: 'linear-gradient(135deg, #00D4FF 0%, #0066CC 100%)' },
  { id: 'neon-purple', name: 'Neon Roxo', bg: 'linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)' },
  { id: 'dark', name: 'Dark Premium', bg: 'linear-gradient(135deg, #1F2937 0%, #000000 100%)' },
  { id: 'green', name: 'PIX Green', bg: 'linear-gradient(135deg, #10B981 0%, #047857 100%)' },
  { id: 'gold', name: 'Gold', bg: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)' },
  { id: 'red', name: 'Red Fire', bg: 'linear-gradient(135deg, #EF4444 0%, #991B1B 100%)' },
];

const plateTypes = [
  { id: 'loja', name: 'Loja Física', icon: <Store className="w-6 h-6" /> },
  { id: 'balcao', name: 'Balcão', icon: <ShoppingBag className="w-6 h-6" /> },
  { id: 'evento', name: 'Eventos', icon: <Music className="w-6 h-6" /> },
  { id: 'igreja', name: 'Igreja', icon: <Church className="w-6 h-6" /> },
  { id: 'delivery', name: 'Delivery', icon: <Truck className="w-6 h-6" /> },
  { id: 'streaming', name: 'Streaming', icon: <Tv className="w-6 h-6" /> },
  { id: 'online', name: 'Vendas Online', icon: <ShoppingBag className="w-6 h-6" /> },
];

export default function PlacasPage() {
  const [plates, setPlates] = useState<DigitalPlate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [previewPlate, setPreviewPlate] = useState<DigitalPlate | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [newPlate, setNewPlate] = useState({ name: '', theme: 'neon-blue', business_name: '', pix_key: '', amount: '', plate_type: 'loja' });
  const plateRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadPlates(); }, []);

  const loadPlates = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data } = await supabase.from('digital_plates').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
    setPlates(data || []);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newPlate.name || !newPlate.business_name || !newPlate.pix_key) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase.from('digital_plates').insert({
      user_id: session.user.id,
      name: newPlate.name,
      business_name: newPlate.business_name,
      pix_key: newPlate.pix_key,
      theme: newPlate.theme,
      amount: newPlate.amount ? Math.round(parseFloat(newPlate.amount) * 100) : null,
      plate_type: newPlate.plate_type,
    });

    if (!error) {
      await loadPlates();
      setShowModal(false);
      setNewPlate({ name: '', theme: 'neon-blue', business_name: '', pix_key: '', amount: '', plate_type: 'loja' });
    }
  };

  const deletePlate = async (id: string) => {
    await supabase.from('digital_plates').delete().eq('id', id);
    await loadPlates();
  };

  const downloadPNG = async (plate: DigitalPlate) => {
    setDownloading(true);
    if (!plateRef.current) return;
    const canvas = await html2canvas(plateRef.current, { scale: 2, useCORS: true, backgroundColor: null });
    const link = document.createElement('a');
    link.download = `placa-${plate.name.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setDownloading(false);
  };

  const downloadPDF = async (plate: DigitalPlate) => {
    setDownloading(true);
    if (!plateRef.current) return;
    const canvas = await html2canvas(plateRef.current, { scale: 2, useCORS: true, backgroundColor: null });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`placa-${plate.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    setDownloading(false);
  };

  const getThemeBg = (themeId: string) => {
    return themes.find(t => t.id === themeId)?.bg || themes[0].bg;
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-gopay-blue border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Placas Digitais</h1>
          <p className="text-gray-400 text-sm mt-1">Crie placas de pagamento com QR Code PIX</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4 lg:w-5 lg:h-5" /> Nova Placa
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 lg:gap-3">
        {plateTypes.map((type) => (
          <button key={type.id} onClick={() => { setNewPlate({ ...newPlate, plate_type: type.id }); setShowModal(true); }} className="card-premium text-center py-3 lg:py-4 hover:border-gopay-blue/30 transition-all">
            <div className="text-gopay-blue flex justify-center mb-2">{type.icon}</div>
            <p className="text-xs font-medium">{type.name}</p>
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {plates.map((plate) => (
          <motion.div key={plate.id} layout className="card-premium overflow-hidden">
            <div className="rounded-xl mb-4 overflow-hidden" style={{ background: getThemeBg(plate.theme) }}>
              <div className="bg-white/10 backdrop-blur-sm p-4 lg:p-6 text-center">
                <div className="w-14 h-14 lg:w-16 lg:h-16 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center">
                  <QrCode className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-white mb-1">{plate.business_name}</h3>
                <p className="text-white/70 text-xs lg:text-sm mb-3">Escaneie para pagar via PIX</p>
                <div className="bg-white rounded-xl p-3 inline-block">
                  <QRCodeSVG value={`pix://${plate.pix_key}`} size={100} />
                </div>
                {plate.amount && <p className="text-xl lg:text-2xl font-bold text-white mt-3">R${(plate.amount / 100).toFixed(2)}</p>}
                <p className="text-white/50 text-[10px] lg:text-xs mt-3">PROIBIDA A REVENDA DAS PLACAS DIGITAIS</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm lg:text-base">{plate.name}</h3>
                <p className="text-xs text-gray-500">{plate.business_name}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setPreviewPlate(plate); }} className="p-1.5 lg:p-2 rounded-lg hover:bg-white/5"><Image className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400" /></button>
                <button onClick={() => downloadPNG(plate)} className="p-1.5 lg:p-2 rounded-lg hover:bg-white/5"><Download className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400" /></button>
                <button onClick={() => deletePlate(plate.id)} className="p-1.5 lg:p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400"><X className="w-3 h-3 lg:w-4 lg:h-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
        {plates.length === 0 && (
          <div className="col-span-full card-premium text-center py-12">
            <Image className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400">Nenhuma placa criada</h3>
            <p className="text-gray-500 text-sm mt-1">Crie sua primeira placa digital com QR Code PIX</p>
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
                <h2 className="text-xl lg:text-2xl font-bold">Nova Placa Digital</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/5"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4 lg:space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Nome da Placa</label>
                  <input type="text" value={newPlate.name} onChange={(e) => setNewPlate({ ...newPlate, name: e.target.value })} className="input-premium" placeholder="Ex: Placa Balcão Principal" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Nome do Negócio</label>
                  <input type="text" value={newPlate.business_name} onChange={(e) => setNewPlate({ ...newPlate, business_name: e.target.value })} className="input-premium" placeholder="Ex: Minha Loja" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Chave PIX</label>
                  <input type="text" value={newPlate.pix_key} onChange={(e) => setNewPlate({ ...newPlate, pix_key: e.target.value })} className="input-premium" placeholder="Sua chave PIX" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Valor (opcional)</label>
                  <input type="number" step="0.01" value={newPlate.amount} onChange={(e) => setNewPlate({ ...newPlate, amount: e.target.value })} className="input-premium" placeholder="Deixe vazio para valor livre" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Tema</label>
                  <div className="grid grid-cols-3 gap-2 lg:gap-3">
                    {themes.map((theme) => (
                      <button key={theme.id} onClick={() => setNewPlate({ ...newPlate, theme: theme.id })} className={`p-2 lg:p-3 rounded-xl text-white text-xs lg:text-sm font-medium transition-all ${newPlate.theme === theme.id ? 'ring-2 ring-white scale-105' : 'opacity-60 hover:opacity-100'}`} style={{ background: theme.bg }}>
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gopay-warning/10 border border-gopay-warning/20">
                  <p className="text-xs text-gopay-warning">⚠ PROIBIDA A REVENDA DAS PLACAS DIGITAIS GoPay.</p>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancelar</button>
                  <button onClick={handleCreate} className="btn-primary flex-1 flex items-center justify-center gap-2"><Check className="w-4 h-4" /> Criar Placa</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview/Download Modal */}
      <AnimatePresence>
        {previewPlate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => setPreviewPlate(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative glass rounded-2xl lg:rounded-3xl p-6 lg:p-8 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Preview da Placa</h2>
                <button onClick={() => setPreviewPlate(null)} className="p-2 rounded-lg hover:bg-white/5"><X className="w-5 h-5" /></button>
              </div>
              <div ref={plateRef} className="rounded-xl overflow-hidden" style={{ background: getThemeBg(previewPlate.theme) }}>
                <div className="bg-white/10 backdrop-blur-sm p-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                    <QrCode className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{previewPlate.business_name}</h3>
                  <p className="text-white/70 text-sm mb-4">Escaneie para pagar via PIX</p>
                  <div className="bg-white rounded-xl p-4 inline-block">
                    <QRCodeSVG value={`pix://${previewPlate.pix_key}`} size={150} />
                  </div>
                  {previewPlate.amount && <p className="text-3xl font-bold text-white mt-4">R${(previewPlate.amount / 100).toFixed(2)}</p>}
                  <p className="text-white/50 text-xs mt-4">PROIBIDA A REVENDA DAS PLACAS DIGITAIS</p>
                </div>
              </div>
              <div className="flex gap-2 lg:gap-3 mt-6">
                <button onClick={() => downloadPNG(previewPlate)} disabled={downloading} className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm">
                  <FileImage className="w-4 h-4" /> PNG
                </button>
                <button onClick={() => downloadPDF(previewPlate)} disabled={downloading} className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm">
                  <FileText className="w-4 h-4" /> PDF
                </button>
                <button onClick={() => downloadPNG(previewPlate)} disabled={downloading} className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm">
                  <Printer className="w-4 h-4" /> Imprimir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
