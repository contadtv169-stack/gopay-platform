'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Send, Sparkles, MessageSquare, Mic, MicOff,
  User, Zap, Lightbulb, TrendingUp, DollarSign, X,
  Headphones, Copy
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const aiSuggestions = [
  { icon: <TrendingUp className="w-5 h-5" />, text: 'Como aumentar minhas vendas?', prompt: 'Como posso aumentar minhas vendas usando a GoPay?' },
  { icon: <DollarSign className="w-5 h-5" />, text: 'Sugerir preço para meu produto', prompt: 'Me ajude a definir o preço ideal para meu produto digital' },
  { icon: <Lightbulb className="w-5 h-5" />, text: 'Criar copy para landing page', prompt: 'Crie uma copy persuasiva para uma landing page de curso online' },
  { icon: <Sparkles className="w-5 h-5" />, text: 'Melhorar meu checkout', prompt: 'Como posso otimizar meu checkout para mais conversões?' },
];

const aiResponses: Record<string, string> = {
  'vendas': `🚀 **Dicas para aumentar suas vendas com GoPay:**

1. **Use Order Bump** - Adicione produtos complementares no checkout para aumentar o ticket médio em até 30%
2. **Crie Urgência** - Use timers de contagem regressiva nas suas landing pages
3. **Placas Digitais** - Exiba QR Codes em pontos estratégicos para receber PIX instantaneamente
4. **Links de Pagamento** - Compartilhe links otimizados nas redes sociais
5. **Upsell Inteligente** - Ofereça versões premium após a compra inicial

Quer que eu crie uma estratégia personalizada para seu negócio?`,

  'preço': `💰 **Guia de Precificação Inteligente:**

Para produtos digitais, considere:

📊 **E-book:** R$ 27 - R$ 97
📊 **Curso Online:** R$ 197 - R$ 997
📊 **Mentoria:** R$ 500 - R$ 5.000
📊 **Consultoria:** R$ 150 - R$ 500/hora
📊 **Assinatura:** R$ 29,90 - R$ 197/mês

**Dica:** Teste diferentes preços e use A/B testing nos seus checkouts para encontrar o sweet spot!

Quer que eu analise seu produto específico?`,

  'copy': `✨ **Copy para Landing Page de Curso:**

---

**HEADLINE:**
"Domine [Habilidade] em 30 dias e Transforme sua Carreira"

**SUBHEADLINE:**
"O método comprovado que já ajudou +2.000 alunos a alcançarem resultados extraordinários"

**CTA:**
"QUERO COMEÇAR AGORA →"

**SEÇÃO DE PROVA SOCIAL:**
"⭐⭐⭐⭐⭐ 'Mudou minha vida profissional!' - Maria S."

**GARANTIA:**
"7 dias de garantia incondicional. Se não gostar, devolvemos 100%."

**URGENCY:**
"⏰ Oferta especial expira em 24h"

---

Quer que eu personalize para seu nicho?`,

  'checkout': `🛒 **Otimização de Checkout:**

1. **Reduza campos** - Peça apenas o essencial (email + pagamento)
2. **Order Bump** - Adicione um produto complementar por 30-50% do valor principal
3. **Prova social** - Mostre "X pessoas compraram hoje"
4. **Garantia visível** - Exiba selo de garantia próximo ao botão
5. **Múltiplos métodos** - PIX + Cartão = +40% conversão
6. **1-Click Upsell** - Ofereça upgrade imediato após pagamento

**Resultado esperado:** +25-40% de conversão!`,
};

export default function IAPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1', role: 'assistant',
      content: 'Olá! Sou o assistente IA da GoPay. Posso te ajudar com:\n\n💰 Sugestão de preços\n📝 Criação de copy\n🚀 Estratégias de vendas\n🛒 Otimização de checkout\n📊 Análise de dados\n\nComo posso te ajudar hoje?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();
    if (lower.includes('venda') || lower.includes('vender') || lower.includes('aumentar')) return aiResponses['vendas'];
    if (lower.includes('preço') || lower.includes('preco') || lower.includes('valor') || lower.includes('cobrar')) return aiResponses['preço'];
    if (lower.includes('copy') || lower.includes('texto') || lower.includes('landing') || lower.includes('página')) return aiResponses['copy'];
    if (lower.includes('checkout') || lower.includes('pagamento') || lower.includes('conversão')) return aiResponses['checkout'];
    return `Entendi sua pergunta sobre "${userMessage}". 

Aqui estão algumas sugestões:

1. **Analise seus dados** - Veja quais produtos têm melhor performance no dashboard
2. **Teste A/B** - Experimente diferentes preços e layouts
3. **Use IA** - Gere copies e landing pages otimizadas
4. **Placas Digitais** - Expanda seus pontos de venda

Quer que eu aprofunde em algum desses tópicos?`;
  };

  const sendMessage = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(), role: 'user',
      content: messageText, timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(), role: 'assistant',
        content: getAIResponse(messageText), timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gopay-blue to-gopay-purple flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          Assistente IA GoPay
        </h1>
        <p className="text-gray-400 mt-1">Powered by Groq AI • Suporte inteligente 24/7</p>
      </div>

      <div className="flex-1 grid lg:grid-cols-4 gap-6 min-h-0">
        {/* Suggestions Sidebar */}
        <div className="hidden lg:block card-premium h-fit">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-gopay-blue" /> Sugestões</h3>
          <div className="space-y-3">
            {aiSuggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => sendMessage(suggestion.prompt)}
                className="w-full text-left p-3 rounded-xl bg-gopay-dark/50 hover:bg-gopay-dark border border-gopay-border hover:border-gopay-blue/30 transition-all"
              >
                <div className="text-gopay-blue mb-1">{suggestion.icon}</div>
                <p className="text-sm">{suggestion.text}</p>
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-gopay-dark/50 border border-gopay-border">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2"><Headphones className="w-4 h-4" /> Suporte Humano</h4>
            <p className="text-xs text-gray-500">Precisa de ajuda personalizada?</p>
            <button className="btn-primary text-sm w-full mt-3 py-2">Falar com Humano</button>
          </div>
        </div>

        {/* Chat */}
        <div className="lg:col-span-3 card-premium flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pb-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'assistant' ? 'bg-gradient-to-br from-gopay-blue to-gopay-purple' : 'bg-gopay-dark border border-gopay-border'
                }`}>
                  {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === 'user' ? 'bg-gopay-blue/20 text-white' : 'bg-gopay-dark/50 text-gray-300'
                }`}>
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  {msg.role === 'assistant' && (
                    <button className="mt-2 text-xs text-gray-500 hover:text-white flex items-center gap-1">
                      <Copy className="w-3 h-3" /> Copiar
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gopay-blue to-gopay-purple flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl bg-gopay-dark/50">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-gopay-blue animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gopay-blue animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gopay-blue animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gopay-border pt-4">
            <div className="flex gap-3">
              <button
                onClick={() => setVoiceMode(!voiceMode)}
                className={`p-3 rounded-xl transition-all ${voiceMode ? 'bg-red-500/20 text-red-400' : 'bg-gopay-dark/50 text-gray-400 hover:text-white'}`}
              >
                {voiceMode ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Pergunte algo ao assistente IA..."
                className="input-premium flex-1"
              />
              <button onClick={() => sendMessage()} className="btn-primary px-4">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
