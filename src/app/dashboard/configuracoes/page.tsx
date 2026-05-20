'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, User, Bell, Shield, Key, Palette, Globe,
  CreditCard, Webhook, Database, Trash2, Save, Check,
  Eye, EyeOff, Copy, RefreshCw, Zap, Moon, Sun
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const [profile, setProfile] = useState({
    name: '', email: '', businessName: '', phone: '', document: ''
  });

  const [notifications, setNotifications] = useState({
    email: true, push: true, sms: false, webhook: true
  });

  const [security, setSecurity] = useState({
    twoFactor: false, sessionTimeout: '30'
  });

  const [integrations, setIntegrations] = useState({
    abacatepay: false, pixgo: false, mercadopago: false
  });

  const [apiKey] = useState('gopay_sk_' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2));

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setProfile({
          name: session.user.user_metadata?.name || '',
          email: session.user.email || '',
          businessName: session.user.user_metadata?.business_name || '',
          phone: session.user.user_metadata?.phone || '',
          document: session.user.user_metadata?.document || ''
        });
      }
    };
    init();
  }, []);

  const handleSave = async () => {
    setSaved(true);
    if (user) {
      await supabase.auth.updateUser({
        data: {
          name: profile.name,
          business_name: profile.businessName,
          phone: profile.phone,
          document: profile.document,
        }
      });
    }
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'profile', icon: <User className="w-5 h-5" />, label: 'Perfil' },
    { id: 'notifications', icon: <Bell className="w-5 h-5" />, label: 'Notificações' },
    { id: 'security', icon: <Shield className="w-5 h-5" />, label: 'Segurança' },
    { id: 'integrations', icon: <Zap className="w-5 h-5" />, label: 'Integrações' },
    { id: 'api', icon: <Key className="w-5 h-5" />, label: 'API' },
    { id: 'appearance', icon: <Palette className="w-5 h-5" />, label: 'Aparência' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings className="w-8 h-8" /> Configurações
          </h1>
          <p className="text-gray-400 mt-1">Gerencie sua conta e preferências</p>
        </div>
        {saved && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-gopay-success">
            <Check className="w-5 h-5" /> Salvo com sucesso!
          </motion.div>
        )}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="card-premium p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  activeTab === tab.id ? 'bg-gradient-to-r from-gopay-blue/20 to-gopay-purple/20 text-gopay-blue' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-4 card-premium">
          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Informações do Perfil</h2>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Nome completo</label>
                  <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="input-premium" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                  <input type="email" value={profile.email} disabled className="input-premium opacity-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Nome do negócio</label>
                  <input type="text" value={profile.businessName} onChange={(e) => setProfile({ ...profile, businessName: e.target.value })} className="input-premium" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Telefone</label>
                  <input type="text" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="input-premium" placeholder="(11) 99999-9999" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">CPF/CNPJ</label>
                  <input type="text" value={profile.document} onChange={(e) => setProfile({ ...profile, document: e.target.value })} className="input-premium" placeholder="000.000.000-00" />
                </div>
              </div>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2"><Save className="w-4 h-4" /> Salvar Alterações</button>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Notificações</h2>
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Notificações por Email', desc: 'Receba atualizações por email' },
                  { key: 'push', label: 'Notificações Push', desc: 'Alertas no navegador' },
                  { key: 'sms', label: 'Notificações SMS', desc: 'Receba SMS para transações importantes' },
                  { key: 'webhook', label: 'Webhooks', desc: 'Notificações automáticas via webhook' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-gopay-dark/50">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                      className={`w-12 h-6 rounded-full transition-all ${notifications[item.key as keyof typeof notifications] ? 'bg-gopay-blue' : 'bg-gopay-border'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-all ${notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2"><Save className="w-4 h-4" /> Salvar</button>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Segurança</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gopay-dark/50 flex items-center justify-between">
                  <div>
                    <p className="font-medium">Autenticação em 2 passos</p>
                    <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
                  </div>
                  <button
                    onClick={() => setSecurity({ ...security, twoFactor: !security.twoFactor })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${security.twoFactor ? 'bg-gopay-success/10 text-gopay-success' : 'bg-gopay-border text-gray-400'}`}
                  >
                    {security.twoFactor ? 'Ativado' : 'Ativar'}
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Tempo de sessão (minutos)</label>
                  <select value={security.sessionTimeout} onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })} className="input-premium">
                    <option value="15">15 minutos</option>
                    <option value="30">30 minutos</option>
                    <option value="60">1 hora</option>
                    <option value="120">2 horas</option>
                  </select>
                </div>
                <div className="p-4 rounded-xl bg-gopay-dark/50">
                  <h3 className="font-medium mb-3">Alterar Senha</h3>
                  <div className="space-y-3">
                    <input type="password" className="input-premium" placeholder="Senha atual" />
                    <input type="password" className="input-premium" placeholder="Nova senha" />
                    <input type="password" className="input-premium" placeholder="Confirmar nova senha" />
                  </div>
                </div>
              </div>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2"><Save className="w-4 h-4" /> Salvar</button>
            </div>
          )}

          {/* Integrations */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Integrações de Pagamento</h2>
              <div className="space-y-4">
                {[
                  { key: 'abacatepay', name: 'AbacatePay', desc: 'PIX, Cartão, Checkout, Assinaturas', status: 'Conectar' },
                  { key: 'pixgo', name: 'PixGo', desc: 'PIX automático, QR Code, Carteira digital', status: 'Conectar' },
                  { key: 'mercadopago', name: 'Mercado Pago', desc: 'PIX, Cartão, Parcelamento, Assinaturas', status: 'Conectar' },
                ].map((integration) => (
                  <div key={integration.key} className="p-4 rounded-xl bg-gopay-dark/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gopay-blue/20 to-gopay-purple/20 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-gopay-blue" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{integration.name}</h3>
                        <p className="text-sm text-gray-500">{integration.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIntegrations({ ...integrations, [integration.key]: !integrations[integration.key as keyof typeof integrations] })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        integrations[integration.key as keyof typeof integrations] ? 'bg-gopay-success/10 text-gopay-success' : 'btn-primary text-sm py-2'
                      }`}
                    >
                      {integrations[integration.key as keyof typeof integrations] ? 'Conectado' : integration.status}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* API */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Chaves de API</h2>
              <div className="p-4 rounded-xl bg-gopay-dark/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Chave Secreta</h3>
                  <button onClick={() => setShowApiKey(!showApiKey)} className="p-2 rounded-lg hover:bg-white/5">
                    {showApiKey ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-3 rounded-lg bg-gopay-card text-sm font-mono">
                    {showApiKey ? apiKey : '••••••••••••••••••••••••'}
                  </code>
                  <button className="p-3 rounded-lg bg-gopay-card hover:bg-gopay-border" onClick={() => navigator.clipboard.writeText(apiKey)}>
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gopay-dark/50">
                <h3 className="font-medium mb-3">Webhooks</h3>
                <div className="space-y-3">
                  <input type="text" className="input-premium" placeholder="https://seusite.com/webhook/gopay" />
                  <button className="btn-secondary text-sm flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Testar Webhook</button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gopay-dark/50">
                <h3 className="font-medium mb-3">Documentação da API</h3>
                <p className="text-sm text-gray-500 mb-3">Acesse a documentação completa para integrar a GoPay no seu sistema.</p>
                <button className="btn-primary text-sm">Ver Documentação</button>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Aparência</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <button className="p-6 rounded-xl bg-gopay-dark border-2 border-gopay-blue text-center">
                  <Moon className="w-8 h-8 mx-auto mb-3 text-gopay-blue" />
                  <p className="font-semibold">Dark Mode</p>
                  <p className="text-sm text-gray-500">Ativo</p>
                </button>
                <button className="p-6 rounded-xl bg-white text-gray-900 text-center opacity-50">
                  <Sun className="w-8 h-8 mx-auto mb-3" />
                  <p className="font-semibold">Light Mode</p>
                  <p className="text-sm text-gray-500">Em breve</p>
                </button>
              </div>
              <div>
                <h3 className="font-medium mb-3">Idioma</h3>
                <select className="input-premium">
                  <option>Português (Brasil)</option>
                  <option>English</option>
                  <option>Español</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
