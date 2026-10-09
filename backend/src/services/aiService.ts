import { env } from '../config/env';
import { AiAnalysisInput, AiAnalysisResult, PolicyIssue } from '../types';

export class AIService {
  getApiKey(): string {
    return env.aiApiKey || process.env.AI_API_KEY || '';
  }

  private getOpenRouterUrl(): string {
    return 'https://openrouter.ai/api/v1/chat/completions';
  }

  async analyzeAd(input: AiAnalysisInput): Promise<AiAnalysisResult> {
    const apiKey = this.getApiKey();

    if (apiKey) {
      try {
        const systemPrompt = `Você é um especialista sênior em tráfego pago, análise de cópia e auditor de políticas de anúncios da Meta (Facebook Ads) e Google Ads.
Seu objetivo é analisar os dados do anúncio fornecido e retornar estritamente um objeto JSON com a análise detalhada.

Responda APENAS no seguinte formato JSON (sem markdown, sem explicações adicionais):
{
  "score": 85,
  "classification": "Excelente" | "Bom, mas pode melhorar" | "Atenção necessária" | "Alto Risco de Reprovação",
  "summary": "Resumo detalhado da análise...",
  "risks": ["Risco 1", "Risco 2"],
  "policyIssues": [
    {
      "phrase": "termo ou trecho problemático",
      "risk": "Alto" | "Médio" | "Baixo",
      "reason": "motivo segundo as diretrizes das plataformas de anúncios",
      "alternative": "sugestão de reescrita segura"
    }
  ],
  "predictions": {
    "ctrRange": "1.8% - 2.5%",
    "cpcRange": "R$ 0.80 - R$ 1.50",
    "conversionRange": "3% - 5%",
    "cpaRange": "R$ 15 - R$ 25"
  },
  "categories": [
    { "name": "Criativo", "score": 85, "note": "explicação..." },
    { "name": "Copy", "score": 80, "note": "explicação..." },
    { "name": "Oferta", "score": 88, "note": "explicação..." },
    { "name": "Público", "score": 82, "note": "explicação..." },
    { "name": "Landing Page", "score": 75, "note": "explicação..." },
    { "name": "Risco de política", "score": 90, "note": "explicação..." }
  ]
}`;

        const userPrompt = `Analise este anúncio:
- Nome do Anúncio: ${input.adName}
- Produto: ${input.product} (Preço: ${input.price})
- País: ${input.country}
- Público Alvo: ${input.audience}
- Objetivo: ${input.goal}
- Orçamento Diário: ${input.dailyBudget}
- Título (Headline): ${input.headline}
- Texto Principal (Primary Text): ${input.primaryText}
- Descrição: ${input.description}
- Chamada para Ação (CTA): ${input.cta}
- Landing Page URL: ${input.landingPageUrl || 'Não informada'}`;

        const response = await fetch(this.getOpenRouterUrl(), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://adpilot.ai',
            'X-Title': 'AdPilot AI'
          },
          body: JSON.stringify({
            model: 'google/gemini-2.0-flash-001',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.3,
            response_format: { type: 'json_object' }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const content = data?.choices?.[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content.replace(/```json|```/g, '').trim());
            return parsed as AiAnalysisResult;
          }
        }
      } catch (error) {
        console.error('Erro ao chamar OpenRouter AI para análise:', error);
      }
    }

    throw new Error('AI_UNAVAILABLE: Não foi possível obter uma análise real. Verifique a configuração e disponibilidade da IA.');
  }

  async optimizeAd(input: AiAnalysisInput) {
    const apiKey = this.getApiKey();

    if (apiKey) {
      try {
        const systemPrompt = `Você é um copywriter de elite especializado em anúncios de alta conversão (Meta Ads, Google Ads e TikTok Ads).
Seu objetivo é criar 3 variações otimizadas do anúncio fornecido, ajustando os textos para contornar problemas de política de anúncios e maximizar o ROI.

Responda APENAS no seguinte formato JSON (sem markdown):
{
  "variants": [
    {
      "name": "Versão A - Foco em Conversão Rápida",
      "focus": "Foco em Benefício & Solução",
      "headline": "Título chamativo e seguro...",
      "primaryText": "Texto principal engajante...",
      "description": "Descrição do anúncio...",
      "cta": "Saiba mais",
      "angle": "Explicação do ângulo persuasivo...",
      "reason": "Por que esta versão converte melhor e é mais segura nas políticas..."
    },
    {
      "name": "Versão B - Foco em Dor & Transformação",
      "focus": "Foco em Dor do Cliente",
      "headline": "Título focado no problema...",
      "primaryText": "Texto humanizado e persuasivo...",
      "description": "Descrição complementar...",
      "cta": "Garantir agora",
      "angle": "Ângulo focado na dor imediata...",
      "reason": "Elimina frição e foca no resultado..."
    },
    {
      "name": "Versão C - Foco em Prova Social & Autoridade",
      "focus": "Foco em Confiança",
      "headline": "Título com autoridade...",
      "primaryText": "Texto com prova e dados...",
      "description": "Descrição...",
      "cta": "Ver detalhes",
      "angle": "Ângulo de prova social...",
      "reason": "Reduz desconfiança de novos compradores..."
    }
  ]
}`;

        const userPrompt = `Crie variações otimizadas para este anúncio:
- Produto: ${input.product} (Preço: ${input.price})
- Público Alvo: ${input.audience}
- Objetivo: ${input.goal}
- Título Atual: ${input.headline}
- Texto Principal Atual: ${input.primaryText}
- CTA Atual: ${input.cta}`;

        const response = await fetch(this.getOpenRouterUrl(), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://adpilot.ai',
            'X-Title': 'AdPilot AI'
          },
          body: JSON.stringify({
            model: 'google/gemini-2.0-flash-001',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const content = data?.choices?.[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content.replace(/```json|```/g, '').trim());
            return parsed;
          }
        }
      } catch (error) {
        console.error('Erro ao chamar OpenRouter AI para otimização:', error);
      }
    }

    throw new Error('AI_UNAVAILABLE: Não foi possível gerar otimizações reais.');
  }
}
