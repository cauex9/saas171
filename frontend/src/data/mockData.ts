import { AnalysisResult, Campaign, Plan, OptimizationVariant } from '../types';

export const dashboardStats = [
  { label: 'Anúncios analisados', value: '184', trend: '+12%' },
  { label: 'Anúncios otimizados', value: '86', trend: '+8%' },
  { label: 'Score médio', value: '82/100', trend: '+6 pts' },
  { label: 'Campanhas analisadas', value: '29', trend: '+4' },
  { label: 'CTR médio real', value: '2.8%', trend: '+0.6%' },
  { label: 'CPC médio real', value: 'US$ 0.64', trend: '-12%' },
  { label: 'Conversão média real', value: '4.1%', trend: '+0.5%' },
  { label: 'CPA médio real', value: 'US$ 14', trend: '-8%' }
];

export const recentAnalyses: AnalysisResult[] = [
  {
    id: 'an-1024',
    name: 'Campanha B2B SaaS',
    product: 'Plataforma de automação',
    country: 'Brasil',
    score: 82,
    status: 'Pronto',
    createdAt: '2026-10-07',
    objective: 'Conversão',
    summary: 'Bom equilíbrio entre proposta de valor e CTA. Há risco em elementos de urgência e inconsistência na página.',
    risk: 'Requer revisão',
    predictions: {
      ctr: '1,5% - 2,4%',
      cpc: 'US$ 0,70 - US$ 1,10',
      conversion: '2% - 4%',
      cpa: 'US$ 12 - US$ 22'
    },
    scoreBreakdown: [
      { label: 'Criativo', value: 86, tone: 'good' },
      { label: 'Copy', value: 80, tone: 'good' },
      { label: 'Oferta', value: 78, tone: 'medium' },
      { label: 'Público', value: 83, tone: 'good' },
      { label: 'Landing Page', value: 74, tone: 'medium' },
      { label: 'CTA', value: 88, tone: 'good' },
      { label: 'Clareza', value: 81, tone: 'good' },
      { label: 'Risco de política', value: 70, tone: 'risk' }
    ]
  },
  {
    id: 'an-1023',
    name: 'Lançamento eBook',
    product: 'Ebook de copywriting',
    country: 'Portugal',
    score: 76,
    status: 'Precisa melhorar',
    createdAt: '2026-10-03',
    objective: 'Lead',
    summary: 'Hook forte e promessa clara. Faltam prova social e maior clareza na oferta.',
    risk: 'Pode apresentar risco de reprovação',
    predictions: {
      ctr: '1,7% - 2,6%',
      cpc: 'US$ 0,80 - US$ 1,20',
      conversion: '2,5% - 4,5%',
      cpa: 'US$ 13 - US$ 24'
    },
    scoreBreakdown: [
      { label: 'Criativo', value: 79, tone: 'good' },
      { label: 'Copy', value: 75, tone: 'good' },
      { label: 'Oferta', value: 72, tone: 'medium' },
      { label: 'Público', value: 81, tone: 'good' },
      { label: 'Landing Page', value: 69, tone: 'medium' },
      { label: 'CTA', value: 77, tone: 'good' },
      { label: 'Clareza', value: 80, tone: 'good' },
      { label: 'Risco de política', value: 64, tone: 'risk' }
    ]
  }
];

export const campaignHistory: Campaign[] = [
  { id: 'cmp-201', name: 'Campanha SaaS v1', status: 'Finalizada', budget: 'US$ 420', spend: 'US$ 410', roas: '3.6x', createdAt: '2026-09-15' },
  { id: 'cmp-202', name: 'Lançamento eBook', status: 'Em execução', budget: 'US$ 240', spend: 'US$ 120', roas: '2.9x', createdAt: '2026-10-02' },
  { id: 'cmp-203', name: 'Lead Gen Serviços', status: 'Pronto para teste', budget: 'US$ 180', spend: 'US$ 0', roas: '—', createdAt: '2026-10-08' }
];

export const planOptions: Plan[] = [
  { name: 'FREE', price: 'R$ 0', description: 'Para testar o produto e validar ideias', features: ['3 análises por mês', '3 otimizações', 'Histórico limitado'] },
  { name: 'STARTER', price: 'R$ 15,99', description: 'Ideal para empreendedores e pequenas equipes', features: ['Mais análises', 'Mais otimizações', 'Histórico completo'], featured: true },
  { name: 'PRO', price: 'R$ 20,99', description: 'Para startups que querem escalar campanhas', features: ['Análises avançadas', 'Gerações com IA', 'Comparador completo'] },
  { name: 'AGENCY', price: 'R$ 49,99', description: 'Para agências e gestão multi-cliente', features: ['Projetos múltiplos', 'Limites maiores', 'Relatórios de clientes'] }
];

export const optimizationVariants: OptimizationVariant[] = [
  {
    id: 'a',
    name: 'Versão A',
    angle: 'Foco em conversão',
    headline: 'Automatize seu funil com IA em menos de 7 dias',
    primaryText: 'Transforme leads em clientes com fluxos de automação com menos retrabalho e mais previsibilidade.',
    description: 'O texto reforça urgência operacional e benefício direto em ROI.',
    cta: 'Agendar demonstração',
    reason: 'Ajusta o texto para maior clareza de benefício e chamada final mais direta.'
  },
  {
    id: 'b',
    name: 'Versão B',
    angle: 'Foco em benefício',
    headline: 'Mais produtividade, menos risco de perder oportunidades',
    primaryText: 'A IA ajuda sua equipe a identificar gargalos, priorizar tarefas e reduzir fricção no processo comercial.',
    description: 'Esta variação enfatiza o ganho prático para o usuário e reduz o foco em recursos técnicos.',
    cta: 'Ver como funciona',
    reason: 'Conecta a oferta ao problema real do público e melhora a relevância emocional.'
  },
  {
    id: 'c',
    name: 'Versão C',
    angle: 'Foco em curiosidade',
    headline: 'Seu time está perdendo conversões por falta de automação?',
    primaryText: 'O problema não é a quantidade de leads — é a qualidade da operação por trás da conversão.',
    description: 'A mensagem provoca identificação com o problema e aumenta a curiosidade sem exagerar em promessas.',
    cta: 'Descobrir como',
    reason: 'Ideal para despertar atenção e aumentar o clique em públicos mais sensíveis ao diagnóstico.'
  },
  {
    id: 'd',
    name: 'Versão D',
    angle: 'Mais conservadora em relação às políticas',
    headline: 'Organize melhor seu processo de vendas',
    primaryText: 'Uma plataforma para reduzir retrabalho, melhorar a previsibilidade e centralizar o acompanhamento de oportunidades.',
    description: 'Versão mais neutra, com foco em utilidade e menos elementos de urgência ou exagero.',
    cta: 'Conhecer a plataforma',
    reason: 'Aumenta a segurança e reduz risco de interpretação agressiva nas políticas da plataforma.'
  }
];
