export type ScoreCategory = {
  label: string;
  value: number;
  tone: 'good' | 'medium' | 'risk';
};

export type PolicyIssue = {
  phrase: string;
  risk: string;
  reason: string;
  alternative: string;
};

export type AnalysisResult = {
  id: string;
  name: string;
  product: string;
  price?: string;
  country: string;
  score: number;
  status: string;
  createdAt: string;
  objective: string;
  summary: string;
  risk: string;
  predictions: {
    ctr: string;
    cpc: string;
    conversion: string;
    cpa: string;
  };
  scoreBreakdown: ScoreCategory[];
  policyIssues?: PolicyIssue[];
  risks?: string[];
  headline?: string;
  primaryText?: string;
  description?: string;
  cta?: string;
};

export type Campaign = {
  id: string;
  name: string;
  status: 'Rascunho' | 'Analisando' | 'Pronto para teste' | 'Em execução' | 'Finalizada';
  budget: string;
  spend: string;
  roas: string;
  createdAt: string;
};

export type Plan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  featured?: boolean;
};

export type OptimizationVariant = {
  id: string;
  name: string;
  angle: string;
  headline: string;
  primaryText: string;
  description: string;
  cta: string;
  reason: string;
};
