'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Send, Sparkles, MessageSquare, Mic, MicOff,
  User, Lightbulb, TrendingUp, DollarSign, X,
  Headphones, Copy
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const aiSuggestions = [
  { icon: <TrendingUp className="w-5 h-5" />, text: 'Como aumentar minhas vendas?', prompt: 'Como posso aumentar minhas vendas usando a GoPay? Dê dicas práticas.' },
  { icon: <DollarSign className="w-5 h-5" />, text: 'Sugerir preço para meu produto', prompt: 'Me ajude a definir o preço ideal para meu produto digital no Brasil.' },
  { icon: <Lightbulb className="w-5 h-5" />, text: 'Criar copy para landing page', prompt: 'Crie uma copy persuasiva para uma landing page de curso online em português.' },
  { icon: <Sparkles className="w-5 h-5" />, text: 'Melhorar meu checkout', prompt: 'Como posso otimizar meu checkout para mais conversões? Dê dicas práticas.' },
];

export default function IAPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1', role: 'assistant',
      content: 'Olá! Sou o assistente IA da GoPay, powered by Groq AI. Posso te ajudar com:\n\n💰 Sugestão de preços\n📝 Criação de copy\n🚀 Estratégias de vendas\n🛒 Otimização de checkout\n📊 Análise de dados\n\nComo posso te ajudar hoje?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(), role: 'user',
      content: messageText, timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setIsTyping(false); return; }

      const chatHistory = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      chatHistory.push({ role: 'user', content: messageText });

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory }),
      });

      const data = await res.json();
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(), role: 'assistant',
        content: data.content || 'Desculpe, não consegui processar sua solicitação.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(), role: 'assistant',
        content: 'Erro ao conectar com a IA. Verifique sua conexão.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }

    setIsTyping(false);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-4 lg:mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gopay-blue to-gopay-purple flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          Assistente IA GoPay
        </h1>
        <p className="text-gray-400 text-sm mt-1">Powered by Groq AI • Suporte inteligente 24/7</p>
      </div>

      <div className="flex-1 grid lg:grid-cols-4 gap-4 lg:gap-6 min-h-0">
        <div className="hidden lg:block card-premium h-fit">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-gopay-blue" /> Sugestões</h3>
          <div className="space-y-3">
            {aiSuggestions.map((suggestion, i) => (
              <button key={i} onClick={() => sendMessage(suggestion.prompt)} className="w-full text-left p-3 rounded-xl bg-gopay-dark/50 hover:bg-gopay-dark border border-gopay-border hover:border-gopay-blue/30 transition-all">
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

        <div className="lg:col-span-3 card-premium flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 pb-4">
            {messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-gradient-to-br from-gopay-blue to-gopay-purple' : 'bg-gopay-dark border border-gopay-border'}`}>
                  {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className={`max-w-[85%] lg:max-w-[80%] p-3 lg:p-4 rounded-2xl ${msg.role === 'user' ? 'bg-gopay-blue/20 text-white' : 'bg-gopay-dark/50 text-gray-300'}`}>
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  {msg.role === 'assistant' && (
                    <button onClick={() => navigator.clipboard.writeText(msg.content)} className="mt-2 text-xs text-gray-500 hover:text-white flex items-center gap-1">
                      <Copy className="w-3 h-3" /> Copiar
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gopay-blue to-gopay-purple flex items-center justify-center"><Bot className="w-4 h-4" /></div>
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

          <div className="border-t border-gopay-border pt-3 lg:pt-4">
            <div className="flex gap-2 lg:gap-3">
              <button onClick={() => sendMessage()} className="btn-primary px-3 lg:px-4">
                <Send className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Pergunte algo ao assistente IA..." className="input-premium flex-1 text-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
