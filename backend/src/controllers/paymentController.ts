import { Request, Response } from 'express';
import { PaymentService } from '../services/paymentService';
import { pixSubscriptionSchema } from '../utils/validators';
import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';
import { AuthRequest } from '../middleware/auth';
import { randomUUID } from 'crypto';

const paymentService = new PaymentService();

export const createCheckout = async (_req: Request, res: Response) => {
  return res.status(501).json({ message: 'Checkout não disponível até a integração real do provedor ser validada.' });
};

export const createPixSubscription = async (req: Request, res: Response) => {
  const parseResult = pixSubscriptionSchema.safeParse(req.body);

  if (!parseResult.success) {
    const details = parseResult.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      error: {
        message: issue.message
      }
    }));

    return res.status(400).json({
      statusCode: 400,
      errorCode: 'GATEWAY_INVALID_DATA',
      message: "Dados da requisição inválidos, verifique 'details' para mais informações",
      details
    });
  }

  try {
    const result = await paymentService.createPixSubscription(parseResult.data);
    return res.status(200).json(result);
  } catch (error: any) {
    const statusCode = error.statusCode || 400;
    return res.status(statusCode).json({
      statusCode,
      errorCode: error.errorCode || 'GATEWAY_ERROR',
      message: error.message || 'Erro ao processar assinatura Pix',
      ...(error.details ? { details: error.details } : {})
    });
  }
};

export const handlePoseidonWebhook = (req: Request, res: Response) => {
  const rawBody = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : JSON.stringify(req.body ?? {});
  const payload = (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) ? req.body : JSON.parse(rawBody || '{}');
  const signature = req.headers['x-poseidonpay-signature']?.toString();

  try {
    const result = paymentService.processWebhook(rawBody, payload, signature);
    return res.status(200).json({ ok: true, ...result });
  } catch (error) {
    return res.status(401).json({ error: error instanceof Error ? error.message : 'Webhook inválido.' });
  }
};

// Checkout simples: o cliente escolhe apenas o plano. Identidade e preço vêm do servidor.
const PLANS = {
  STARTER: { amount: 15.99, name: 'Plano STARTER' },
  PRO: { amount: 20.99, name: 'Plano PRO' },
  AGENCY: { amount: 49.99, name: 'Plano AGENCY' }
} as const;

export const createSimplePix = async (req: AuthRequest, res: Response) => {
  const planId = String(req.body?.planId || '').toUpperCase();
  if (!(planId in PLANS)) return res.status(400).json({ message: 'Selecione um plano válido.' });
  if (!req.userId || !env.supabaseUrl || !env.supabaseAnonKey) return res.status(401).json({ message: 'Entre na sua conta para gerar o Pix.' });
  try {
    const token = /^Bearer (.+)$/i.exec(req.header('authorization') || '')?.[1];
    const client = createClient(env.supabaseUrl, env.supabaseAnonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await client.auth.getUser(token);
    if (error || !data.user || data.user.id !== req.userId) return res.status(401).json({ message: 'Sessão inválida.' });
    const user = data.user;
    const email = user.email;
    const name = String(user.user_metadata?.full_name || user.user_metadata?.name || '').trim();
    if (!email || !name) return res.status(422).json({ message: 'Complete seu nome no cadastro antes de gerar o Pix.' });
    const plan = PLANS[planId as keyof typeof PLANS];
    const result = await paymentService.createPixSubscription({
      identifier: `sub_${randomUUID()}`,
      amount: plan.amount,
      product: { id: `${planId.toLowerCase()}_plan`, name: plan.name, quantity: 1, price: plan.amount },
      subscription: { periodicityType: 'MONTHS', periodicity: 1, firstChargeIn: 0 },
      client: { name, email }
    });
    return res.json(result);
  } catch (error: any) {
    return res.status(error.statusCode || 502).json({ message: error.message || 'Não foi possível gerar o Pix.' });
  }
};
