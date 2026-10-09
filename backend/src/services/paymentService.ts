import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env';
import {
  PaymentTransaction,
  PaymentStatus,
  PixSubscriptionInput,
  PixSubscriptionResponseData,
  PixSubscriptionErrorResponse
} from '../types';

const transactionStore: PaymentTransaction[] = [];
const seenWebhookIds = new Set<string>();

export class PaymentService {
  createCheckout(userId: string, planId: string, amount: number, currency = 'BRL') {
    const tx: PaymentTransaction = {
      id: uuidv4(),
      externalId: `pay_${Date.now()}`,
      userId,
      planId,
      amount,
      currency,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    transactionStore.push(tx);

    return {
      transactionId: tx.id,
      externalId: tx.externalId,
      checkoutUrl: `${env.poseidonpayApiUrl || 'https://payments.example.com'}/checkout/${tx.externalId}`,
      status: 'created'
    };
  }

  async createPixSubscription(data: PixSubscriptionInput): Promise<PixSubscriptionResponseData> {
    const publicKey = env.poseidonpayPublicKey || env.poseidonpayApiKey;
    const secretKey = env.poseidonpaySecretKey || env.poseidonpayApiSecret;
    const baseUrl = env.poseidonpayApiUrl || 'https://app.poseidonpay.site';
    const targetUrl = `${baseUrl.replace(/\/$/, '')}/api/v1/gateway/pix/subscription`;

    // Fallback for development/testing when credentials are not supplied
    if ((!publicKey || !secretKey) && env.nodeEnv === 'test') {
      const mockTxId = `clwuwmn4i${uuidv4().replace(/-/g, '').slice(0, 16)}`;
      const mockSubId = `cm9hf2cly${uuidv4().replace(/-/g, '').slice(0, 16)}`;
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const pixCode = `00020101021126530014BR.GOV.BCB.PIX0136254e-7f7b-4f4a-8e4b-2b5b3d3b3d3d5204000053039865404${data.amount.toFixed(2)}5802BR5923Nome do Beneficiario6008Brasilia62070503***6304A8E3`;

      const mockResponse: PixSubscriptionResponseData = {
        transactionId: mockTxId,
        status: 'OK',
        transactionStatus: 'PENDING',
        fee: Math.round(data.amount * 0.05 * 100) / 100,
        webhookToken: `wh_${uuidv4().slice(0, 16)}`,
        order: {
          id: `order_${data.product.id}`,
          url: `${baseUrl}/checkout/${data.identifier}`
        },
        pix: {
          code: pixCode,
          image: `${baseUrl}/pix/qr/${mockTxId}`,
          base64: '',
          expiresAt
        },
        subscription: {
          id: mockSubId,
          periodicity: data.subscription.periodicity,
          periodicityType: data.subscription.periodicityType,
          nextChargeAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          startAt: new Date().toISOString(),
          status: 'INACTIVE'
        }
      };

      transactionStore.push({
        id: mockTxId,
        externalId: data.identifier,
        userId: data.client.email,
        planId: data.product.id,
        amount: data.amount,
        currency: 'BRL',
        status: 'pending',
        rawEvent: data as unknown as Record<string, unknown>,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return mockResponse;
    }

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'x-public-key': publicKey,
          'x-secret-key': secretKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorObj = responseData as PixSubscriptionErrorResponse;
        const err = new Error(errorObj.message || 'Erro ao processar assinatura Pix na PoseidonPay');
        (err as unknown as { statusCode: number }).statusCode = response.status || errorObj.statusCode || 400;
        (err as unknown as { errorCode: string }).errorCode = errorObj.errorCode || 'GATEWAY_ERROR';
        (err as unknown as { details?: unknown }).details = errorObj.details;
        throw err;
      }

      const result = responseData as PixSubscriptionResponseData;

      transactionStore.push({
        id: result.transactionId,
        externalId: data.identifier,
        userId: data.client.email,
        planId: data.product.id,
        amount: data.amount,
        currency: 'BRL',
        status: result.status === 'OK' ? 'pending' : 'failed',
        rawEvent: result as unknown as Record<string, unknown>,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return result;
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      const connErr = new Error('Falha na comunicação com o gateway PoseidonPay.');
      (connErr as unknown as { statusCode: number }).statusCode = 502;
      (connErr as unknown as { errorCode: string }).errorCode = 'GATEWAY_CONNECTION_ERROR';
      (connErr as unknown as { details: string }).details = error instanceof Error ? error.message : String(error);
      throw connErr;
    }
  }

  verifyWebhookSignature(rawBody: string, signature?: string) {
    const configuredSecret = env.poseidonpayWebhookSecret;
    if (!configuredSecret) {
      return true;
    }

    const candidateSignatures = [
      signature,
      process.env.POSEIDONPAY_WEBHOOK_SIGNATURE || undefined,
      process.env.POSEIDONPAY_WEBHOOK_SECRET || undefined
    ].filter(Boolean) as string[];

    const hash = crypto.createHmac('sha256', configuredSecret).update(rawBody).digest('hex');
    return candidateSignatures.some((value) => value === hash || value === `sha256=${hash}`);
  }

  processWebhook(rawBody: string, payload: Record<string, unknown>, signature?: string) {
    const eventId = String(payload.event_id ?? payload.id ?? payload.transaction_id ?? `${Date.now()}`);
    if (seenWebhookIds.has(eventId)) {
      return { accepted: true, duplicate: true };
    }

    const validSignature = this.verifyWebhookSignature(rawBody, signature);
    if (!validSignature) {
      throw new Error('Assinatura do webhook inválida.');
    }

    seenWebhookIds.add(eventId);

    const externalId = String(payload.external_id ?? payload.id ?? eventId);
    const planId = String(payload.plan_id ?? 'STARTER');
    const userId = String(payload.user_id ?? 'unknown-user');
    const status = this.normalizeStatus(String(payload.status ?? 'paid')) as PaymentStatus;

    const tx = transactionStore.find((item) => item.externalId === externalId) ?? {
      id: uuidv4(),
      externalId,
      userId,
      planId,
      amount: Number(payload.amount ?? 0),
      currency: String(payload.currency ?? 'BRL'),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    tx.status = status;
    tx.amount = Number(payload.amount ?? tx.amount ?? 0);
    tx.currency = String(payload.currency ?? tx.currency ?? 'BRL');
    tx.rawEvent = payload;
    tx.updatedAt = new Date().toISOString();

    if (!transactionStore.some((item) => item.id === tx.id)) {
      transactionStore.push(tx);
    }

    return {
      accepted: true,
      duplicate: false,
      transaction: tx
    };
  }

  private normalizeStatus(status: string): PaymentStatus {
    const normalized = status.toLowerCase();
    if (normalized.includes('paid') || normalized.includes('approved')) return 'paid';
    if (normalized.includes('fail') || normalized.includes('cancel')) return 'failed';
    if (normalized.includes('refund')) return 'refunded';
    return 'pending';
  }
}
