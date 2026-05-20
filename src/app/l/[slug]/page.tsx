'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Check, Star, Clock, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LandingPageView() {
  const params = useParams();
  const slug = params.slug as string;
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
      const { data, error } = await supabase.from('landing_pages').select('*, profiles(name, business_name)').eq('slug', slug).eq('status', 'published').single();
      if (data) {
        setPage(data);
        await supabase.from('landing_pages').update({ views: (data.views || 0) + 1 }).eq('id', data.id);
      }
      setLoading(false);
    };
    loadPage();
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-gopay-darker flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-gopay-blue border-t-transparent rounded-full" /></div>;

  if (!page) return (
    <div className="min-h-screen bg-gopay-darker flex items-center justify-center p-4">
      <div className="text-center">
        <Zap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-400">Página não encontrada</h1>
      </div>
    </div>
  );

  const content = page.content || {};

  return (
    <div className="min-h-screen bg-gopay-darker">
      {/* Hero */}
      <section className="relative py-20 lg:py-32 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gopay-blue/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gopay-purple/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              {content.headline || page.name}
            </h1>
            <p className="text-lg lg:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              {content.subheadline || `Por ${page.profiles?.business_name || page.profiles?.name}`}
            </p>
            <a href={`/pay/${page.slug}`} className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
              {content.cta || 'Começar Agora'} <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      {content.features && content.features.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {content.features.map((feature: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-premium">
                  <Check className="w-8 h-8 text-gopay-blue mb-4" />
                  <h3 className="font-semibold mb-2">{feature.title || feature}</h3>
                  <p className="text-gray-400 text-sm">{feature.description || ''}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {content.testimonials && content.testimonials.length > 0 && (
        <section className="py-16 px-4 bg-gopay-dark/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">O que dizem nossos clientes</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {content.testimonials.map((testimonial: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card-premium">
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-gopay-warning fill-current" />)}
                  </div>
                  <p className="text-gray-300 mb-4">&quot;{testimonial.text || testimonial}&quot;</p>
                  <p className="font-semibold text-sm">{testimonial.name || 'Cliente'}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing */}
      {content.price && (
        <section className="py-16 px-4">
          <div className="max-w-md mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card-premium border-gopay-blue/30 glow-blue text-center">
              <h3 className="text-xl font-semibold mb-2">{page.name}</h3>
              <div className="text-4xl font-bold gradient-text mb-4">{content.price}</div>
              <ul className="space-y-3 mb-8 text-left">
                {(content.includes || ['Acesso completo', 'Suporte premium', 'Atualizações gratuitas']).map((item: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-gray-400"><Check className="w-4 h-4 text-gopay-success" />{item}</li>
                ))}
              </ul>
              <a href={`/pay/${page.slug}`} className="btn-primary w-full block py-4 text-lg">{content.cta || 'Comprar Agora'}</a>
              {content.guarantee && <p className="text-sm text-gray-500 mt-4 flex items-center justify-center gap-2"><Shield className="w-4 h-4" />{content.guarantee}</p>}
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-gray-400 mb-8">Junte-se a milhares de clientes satisfeitos.</p>
          <a href={`/pay/${page.slug}`} className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
            Garantir Minha Vaga <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gopay-border py-8 text-center text-sm text-gray-600">
        <p>&copy; 2026 {page.profiles?.business_name || page.profiles?.name}. Powered by GoPay.</p>
      </footer>
    </div>
  );
}
