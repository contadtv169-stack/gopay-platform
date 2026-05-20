import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ content: 'API key não configurada. Adicione GROQ_API_KEY no .env.local' }, { status: 500 });
    }

    const systemPrompt = `Você é o assistente IA da GoPay, uma plataforma de pagamentos digitais brasileira. 
Responda em português do Brasil. Seja útil, direto e prático.
Ajude com: sugestão de preços, criação de copy, estratégias de vendas, otimização de checkout, análise de dados.
Sempre dê dicas práticas e acionáveis.`;

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || 'Não consegui processar sua solicitação.';

    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ content: 'Erro ao conectar com a IA. Tente novamente.' }, { status: 500 });
  }
}
