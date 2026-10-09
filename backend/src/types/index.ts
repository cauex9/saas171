export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PlanName = 'FREE' | 'STARTER' | 'PRO' | 'AGENCY';

export interface AiAnalysisInput {
  adName: string;
  product: string;
  price: string;
  country: string;
  audience: string;
  goal: string;
  dailyBudget: string;
  headline: string;
  primaryText: string;
  description: string;
  cta: string;
  landingPageUrl?: string;
}

export interface PolicyIssue {
  phrase: string;
  risk: string;
  reason: string;
  alternative: string;
}

export interface AiAnalysisResult {
  score: number;
  classification: string;
  summary: string;
  risks: string[];
  policyIssues: PolicyIssue[];
  predictions: {
    ctrRange: string;
    cpcRange: string;
    conversionRange: string;
    cpaRange: string;
  };
  categories: Array<{
    name: string;
    score: number;
    note: string;
  }>;
}

export interface PaymentTransaction {
  id: string;
  externalId: string;
  userId: string;
  planId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  rawEvent?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookReceipt {
  id: string;
  eventId: string;
  source: string;
  payload: Record<string, unknown>;
  receivedAt: string;
}

export type PeriodicityType = 'DAYS' | 'WEEKS' | 'MONTHS' | 'YEARS';

export interface PixSubscriptionProduct {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}

export interface PixSubscriptionConfig {
  periodicityType: PeriodicityType;
  periodicity: number;
  firstChargeIn?: number;
}

export interface PixSubscriptionClient {
  name: string;
  email: string;
  phone?: string;
  document?: string;
}

export interface PixSubscriptionMetadata {
  provider?: string;
  orderId?: string;
  [key: string]: unknown;
}

export interface PixSubscriptionInput {
  identifier: string;
  amount: number;
  product: PixSubscriptionProduct;
  subscription: PixSubscriptionConfig;
  client: PixSubscriptionClient;
  dueDate?: string;
  metadata?: PixSubscriptionMetadata | string;
  callbackUrl?: string;
}

export type GatewayTransactionStatus = 'OK' | 'FAILED' | 'PENDING' | 'REJECTED' | 'CANCELED';
export type GatewayPersistedStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CHARGED_BACK' | 'EXPIRED';
export type GatewaySubscriptionStatus = 'ACTIVE' | 'INACTIVE' | 'CANCELED';

export interface PixSubscriptionResponseData {
  transactionId: string;
  status: GatewayTransactionStatus;
  transactionStatus?: GatewayPersistedStatus;
  webhookToken?: string;
  fee: number;
  order?: {
    id: string;
    url?: string;
  };
  subscription: {
    id: string;
    periodicityType: PeriodicityType;
    periodicity: number;
    nextChargeAt: string | number;
    startAt: string | number;
    status: GatewaySubscriptionStatus;
  };
  pix: {
    code: string;
    image?: string;
    base64?: string;
    expiresAt?: string;
  };
  details?: string;
  errorDescription?: string;
}

export interface PixSubscriptionErrorItem {
  path: string;
  error: {
    message: string;
    expected?: string;
    received?: string;
  };
}

export interface PixSubscriptionErrorResponse {
  statusCode: number;
  errorCode: string;
  message: string;
  details?: PixSubscriptionErrorItem[];
}

