'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image, Plus, Download, Share2, QrCode, Palette, Type, Upload,
  Store, Church, Truck, Tv, Music, ShoppingBag, X, Check,
  Printer, FileImage, FileText, Copy
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { generateId } from '@/lib/utils';

interface DigitalPlate {
  id: string;
  name: string;
  theme: string;
  businessName: string;
  pixKey: string;
  amount?: number;
  logo?: string;
  socialLinks: { platform: string; url: string }[];
  createdAt: Date;
}

const themes = [
  { id: 'neon-blue', name: 'Neon Azul', gradient: 'from-gopay-blue to-blue-600' },
  { id: 'neon-purple', name: 'Neon Roxo', gradient: 'from-gopay-purple to-purple-600' },
  { id: 'dark', name: 'Dark Premium', gradient: 'from-gray-800 to-black' },
  { id: 'green', name: 'PIX Green', gradient: 'from-gopay-success to-green-600' },
  { id: 'gold', name: 'Gold', gradient: 'from-yellow-500 to-yellow-700' },
  { id: 'red', name: 'Red Fire', gradient: 'from-red-500 to-red-700' },
];

const plateTypes = [
  { id: 'loja', name: 'Loja Física', icon: <Store className="w-8 h-8" /> },
  { id: 'balcao', name: 'Balcão', icon: <ShoppingBag className="w-8 h-8" /> },
  { id: 'evento', name: 'Eventos', icon: <Music className="w-8 h-8" /> },
  { id: 'igreja', name: 'Igreja', icon: <Church className="w-8 h-8" /> },
  { id: 'delivery', name: 'Delivery', icon: <Truck className="w-8 h-8" /> },
  { id: 'streaming', name: 'Streaming', icon: <Tv className="w-8 h-8" /> },
  { id: 'online', name: 'Vendas Online', icon: <ShoppingBag className="w-8 h-8" /> },
];

export default function PlacasPage() {
  const [plates, setPlates] = useState<DigitalPlate[]>([
    {
      id: '1', name: 'Placa - Loja Principal', theme: 'neon-blue',
      businessName: 'TechStore', pixKey: 'techstore@gopay.com',
      amount: 0, socialLinks: [], createdAt: new Date()
    },
    {
      id: '2', name: 'Placa - Igreja Nova Vida', theme: 'gold',
      businessName: 'Igreja Nova Vida', pixKey: 'novavida@gopay.com',
      amount: 0, socialLinks: [], createdAt: new Date()
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [previewPlate, setPreviewPlate] = useState<DigitalPlate | null>(null);
  const [newPlate, setNewPlate] = useState({
    name: '', theme: 'neon-blue', businessName: '', pixKey: '', amount: '', type: 'loja'
  });
  const plateRef = useRef<HTMLDivElement>(null);

  const handleCreate = () => {
    if (!newPlate.name || !newPlate.businessName || !newPlate.pixKey) return;
    const plate: DigitalPlate = {
      id: generateId(), name: newPlate.name, theme: newPlate.theme,
      businessName: newPlate.businessName, pixKey: newPlate.pixKey,
      amount: newPlate.amount ? parseInt(newPlate.amount) * 100 : undefined,
      socialLinks: [], createdAt: new Date()
    };
    setPlates([plate, ...plates]);
    setShowModal(false);
    setNewPlate({ name: '', theme: 'neon-blue', businessName: '', pixKey: '', amount: '', type: 'loja' });
  };

  const getThemeGradient = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    return theme?.gradient || 'from-gopay-blue to-gopay-purple';
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Placas Digitais</h1>
          <p className="text-gray-400 mt-1">Crie placas de pagamento profissionais com QR Code PIX</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Nova Placa
        </button>
      </div>

      {/* Plate Types */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Tipos de Placa</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {plateTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => { setNewPlate({ ...newPlate, type: type.id }); setShowModal(true); }}
              className="card-premium text-center py-4 hover:border-gopay-blue/30 transition-all"
            >
              <div className="text-gopay-blue flex justify-center mb-2">{type.icon}</div>
              <p className="text-xs font-medium">{type.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Plates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plates.map((plate) => (
          <motion.div key={plate.id} layout className="card-premium overflow-hidden">
            {/* Plate Preview */}
            <div className={`bg-gradient-to-br ${getThemeGradient(plate.theme)} p-6 rounded-xl mb-4`}>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{plate.businessName}</h3>
                <p className="text-white/70 text-sm mb-4">Escaneie para pagar via PIX</p>
                <div className="bg-white rounded-xl p-4 inline-block">
                  <QRCodeSVG value={`pix://${plate.pixKey}`} size={120} />
                </div>
                {plate.amount && (
                  <p className="text-2xl font-bold text-white mt-4">
                    R${(plate.amount / 100).toFixed(2)}
                  </p>
                )}
                <p className="text-white/50 text-xs mt-4">PROIBIDA A REVENDA DAS PLACAS DIGITAIS</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{plate.name}</h3>
                <p className="text-xs text-gray-500">{plate.businessName}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setPreviewPlate(plate)} className="p-2 rounded-lg hover:bg-white/5"><Image className="w-4 h-4 text-gray-400" /></button>
                <button className="p-2 rounded-lg hover:bg-white/5"><Download className="w-4 h-4 text-gray-400" /></button>
                <button className="p-2 rounded-lg hover:bg-white/5"><Printer className="w-4 h-4 text-gray-400" /></button>
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
                <h2 className="text-2xl font-bold">Nova Placa Digital</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/5"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Nome da Placa</label>
                  <input type="text" value={newPlate.name} onChange={(e) => setNewPlate({ ...newPlate, name: e.target.value })} className="input-premium" placeholder="Ex: Placa Balcão Principal" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Nome do Negócio</label>
                  <input type="text" value={newPlate.businessName} onChange={(e) => setNewPlate({ ...newPlate, businessName: e.target.value })} className="input-premium" placeholder="Ex: Minha Loja" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Chave PIX</label>
                  <input type="text" value={newPlate.pixKey} onChange={(e) => setNewPlate({ ...newPlate, pixKey: e.target.value })} className="input-premium" placeholder="Sua chave PIX" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Valor (opcional)</label>
                  <input type="number" value={newPlate.amount} onChange={(e) => setNewPlate({ ...newPlate, amount: e.target.value })} className="input-premium" placeholder="Deixe vazio para valor livre" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Tema</label>
                  <div className="grid grid-cols-3 gap-3">
                    {themes.map((theme) => (
                      <button key={theme.id} onClick={() => setNewPlate({ ...newPlate, theme: theme.id })} className={`p-3 rounded-xl bg-gradient-to-br ${theme.gradient} ${newPlate.theme === theme.id ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'} transition-all`}>
                        <span className="text-white text-xs font-medium">{theme.name}</span>
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

      {/* Preview Modal */}
      <AnimatePresence>
        {previewPlate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => setPreviewPlate(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative glass rounded-3xl p-8 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Preview da Placa</h2>
                <button onClick={() => setPreviewPlate(null)} className="p-2 rounded-lg hover:bg-white/5"><X className="w-5 h-5" /></button>
              </div>
              <div ref={plateRef} className={`bg-gradient-to-br ${getThemeGradient(previewPlate.theme)} p-6 rounded-xl`}>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                    <QrCode className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{previewPlate.businessName}</h3>
                  <p className="text-white/70 text-sm mb-4">Escaneie para pagar via PIX</p>
                  <div className="bg-white rounded-xl p-4 inline-block">
                    <QRCodeSVG value={`pix://${previewPlate.pixKey}`} size={150} />
                  </div>
                  {previewPlate.amount && (
                    <p className="text-3xl font-bold text-white mt-4">
                      R${(previewPlate.amount / 100).toFixed(2)}
                    </p>
                  )}
                  <p className="text-white/50 text-xs mt-4">PROIBIDA A REVENDA DAS PLACAS DIGITAIS</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button className="btn-secondary flex-1 flex items-center justify-center gap-2"><Download className="w-4 h-4" /> PNG</button>
                <button className="btn-secondary flex-1 flex items-center justify-center gap-2"><FileText className="w-4 h-4" /> PDF</button>
                <button className="btn-secondary flex-1 flex items-center justify-center gap-2"><Printer className="w-4 h-4" /> Imprimir</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
