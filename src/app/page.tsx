'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Zap, Shield, Globe, CreditCard, QrCode,
  BarChart3, Sparkles, Check, Star, Menu, X, Play,
  Smartphone, Lock, Layers, TrendingUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: <QrCode className="w-6 h-6" />, title: 'PIX Instantâneo', desc: 'Receba pagamentos via PIX em tempo real com QR Code dinâmico' },
    { icon: <CreditCard className="w-6 h-6" />, title: 'Cartão de Crédito', desc: 'Aceite todas as bandeiras com parcelamento automático' },
    { icon: <Globe className="w-6 h-6" />, title: 'Links de Pagamento', desc: 'Crie links personalizados e compartilhe em qualquer lugar' },
    { icon: <Sparkles className="w-6 h-6" />, title: 'IA Integrada', desc: 'Inteligência artificial para otimizar suas vendas e suporte' },
    { icon: <Shield className="w-6 h-6" />, title: 'Anti-Fraude', desc: 'Proteção avançada contra fraudes e chargebacks' },
    { icon: <BarChart3 className="w-6 h-6" />, title: 'Analytics', desc: 'Dashboard completo com métricas e relatórios em tempo real' },
  ];

  const plans = [
    {
      name: 'Starter',
      price: '0',
      period: '/mês',
      features: ['Até 50 transações/mês', 'PIX e Cartão', 'Links de pagamento', 'Dashboard básico', 'Suporte por email'],
      cta: 'Começar Grátis',
      popular: false,
    },
    {
      name: 'Pro',
      price: '97',
      period: '/mês',
      features: ['Transações ilimitadas', 'Todos os métodos de pagamento', 'Landing pages com IA', 'Placas digitais', 'Split de pagamento', 'Suporte prioritário', 'API completa'],
      cta: 'Assinar Pro',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '297',
      period: '/mês',
      features: ['Tudo do Pro', 'Taxas reduzidas', 'Gerente dedicado', 'SLA 99.9%', 'White label', 'Integrações custom', 'Treinamento da equipe'],
      cta: 'Falar com Vendas',
      popular: false,
    },
  ];

  const testimonials = [
    { name: 'Carlos Silva', role: 'CEO, TechStore', text: 'A GoPay transformou completamente nosso checkout. Aumento de 40% nas conversões!', avatar: 'CS', rating: 5 },
    { name: 'Maria Santos', role: 'Fundadora, Digital Academy', text: 'As landing pages com IA são incríveis. Criei minha página de vendas em minutos.', avatar: 'MS', rating: 5 },
    { name: 'João Oliveira', role: 'Pastor, Igreja Nova Vida', text: 'As placas digitais com QR Code facilitaram muito os dízimos e ofertas.', avatar: 'JO', rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-gopay-darker overflow-hidden">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-3' : 'py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gopay-blue to-gopay-purple flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Go<span className="gradient-text">Pay</span></span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-400 hover:text-white transition-colors">Recursos</a>
              <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Preços</a>
              <a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Depoimentos</a>
              <Link href="/login" className="text-gray-400 hover:text-white transition-colors">Entrar</Link>
              <Link href="/register" className="btn-primary">Começar Agora</Link>
            </div>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass mt-3 mx-4 rounded-2xl p-6"
            >
              <div className="flex flex-col gap-4">
                <a href="#features" className="text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Recursos</a>
                <a href="#pricing" className="text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Preços</a>
                <a href="#testimonials" className="text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Depoimentos</a>
                <Link href="/login" className="text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Entrar</Link>
                <Link href="/register" className="btn-primary text-center" onClick={() => setMobileMenuOpen(false)}>Começar Agora</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gopay-blue/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gopay-purple/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-gopay-blue/5 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <Sparkles className="w-4 h-4 text-gopay-blue" />
              <span className="text-sm text-gray-300">Novo: IA integrada para criar landing pages</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
              Pagamentos{' '}
              <span className="gradient-text animate-gradient bg-gradient-to-r from-gopay-blue via-gopay-purple to-gopay-blue bg-[length:200%_auto]">
                inteligentes
              </span>
              <br />
              para negócios modernos
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Links de pagamento, checkouts inteligentes, landing pages com IA e placas digitais.
              Tudo em uma única plataforma premium.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                Começar Gratuitamente <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="btn-secondary text-lg px-8 py-4 flex items-center gap-2">
                <Play className="w-5 h-5" /> Ver Demo
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 mt-12 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-gopay-success" /> Sem cartão de crédito
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-gopay-success" /> Setup em 2 minutos
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Check className="w-4 h-4 text-gopay-success" /> Cancele quando quiser
              </div>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 relative"
          >
            <div className="glass rounded-2xl p-2 glow-blue">
              <div className="bg-gopay-card rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gopay-border">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-4 text-sm text-gray-500">app.gopay.com/dashboard</span>
                </div>
                <div className="p-6 grid grid-cols-4 gap-4">
                  {[
                    { label: 'Receita Total', value: 'R$ 47.890', change: '+23%', color: 'text-gopay-blue' },
                    { label: 'Transações', value: '1.247', change: '+18%', color: 'text-gopay-purple' },
                    { label: 'Taxa de Conversão', value: '94.2%', change: '+5%', color: 'text-gopay-success' },
                    { label: 'Clientes Ativos', value: '892', change: '+31%', color: 'text-gopay-warning' },
                  ].map((stat, i) => (
                    <div key={i} className="p-4 rounded-xl bg-gopay-dark/50">
                      <p className="text-xs text-gray-500">{stat.label}</p>
                      <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-gopay-success mt-1">{stat.change}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gopay-blue text-sm font-semibold uppercase tracking-wider">Recursos</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">
              Tudo que você precisa para <span className="gradient-text">vender mais</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Plataforma completa com as melhores ferramentas para receber pagamentos e escalar seu negócio.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-premium group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gopay-blue/20 to-gopay-purple/20 flex items-center justify-center text-gopay-blue mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-24 bg-gopay-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-gopay-purple text-sm font-semibold uppercase tracking-wider">Integrações</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">
              Conectado aos <span className="gradient-text">melhores gateways</span>
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {['AbacatePay', 'PixGo', 'Mercado Pago', 'Visa', 'Mastercard', 'Apple Pay', 'Google Pay', 'Pix'].map((name, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass px-8 py-4 rounded-xl font-semibold text-gray-300 hover:text-white hover:border-gopay-blue/30 transition-all cursor-default"
              >
                {name}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-gopay-blue text-sm font-semibold uppercase tracking-wider">Preços</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">
              Planos que <span className="gradient-text">escalam com você</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`card-premium relative ${plan.popular ? 'border-gopay-blue/50 glow-blue' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-gopay-blue to-gopay-purple rounded-full text-sm font-semibold">
                    Mais Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">R${plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-gray-400">
                      <Check className="w-4 h-4 text-gopay-success flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center py-3 rounded-xl font-semibold transition-all ${
                    plan.popular ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-gopay-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-gopay-purple text-sm font-semibold uppercase tracking-wider">Depoimentos</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-4">
              Quem usa <span className="gradient-text">recomenda</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-premium"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-gopay-warning fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gopay-blue to-gopay-purple flex items-center justify-center font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 glow-blue"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Pronto para <span className="gradient-text">começar</span>?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Crie sua conta gratuita e comece a receber pagamentos em menos de 2 minutos.
            </p>
            <Link href="/register" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
              Criar Conta Grátis <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gopay-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gopay-blue to-gopay-purple flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">Go<span className="gradient-text">Pay</span></span>
              </div>
              <p className="text-gray-500 text-sm">Pagamentos inteligentes para negócios modernos.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <div className="space-y-2 text-sm text-gray-500">
                <p>Links de Pagamento</p>
                <p>Checkout</p>
                <p>Landing Pages</p>
                <p>Placas Digitais</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <div className="space-y-2 text-sm text-gray-500">
                <p>Sobre</p>
                <p>Blog</p>
                <p>Carreiras</p>
                <p>Contato</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-sm text-gray-500">
                <p>Termos de Uso</p>
                <p>Privacidade</p>
                <p>LGPD</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gopay-border pt-8 text-center text-sm text-gray-600">
            &copy; 2026 GoPay. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
