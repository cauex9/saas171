import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  supabaseUrl: process.env.SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  aiApiKey: process.env.AI_API_KEY ?? '',
  poseidonpayApiUrl: process.env.POSEIDONPAY_API_URL ?? 'https://app.poseidonpay.site',
  poseidonpayApiKey: process.env.POSEIDONPAY_API_KEY ?? '',
  poseidonpayApiSecret: process.env.POSEIDONPAY_API_SECRET ?? '',
  poseidonpayPublicKey: process.env.POSEIDONPAY_PUBLIC_KEY ?? process.env.POSEIDONPAY_API_KEY ?? '',
  poseidonpaySecretKey: process.env.POSEIDONPAY_SECRET_KEY ?? process.env.POSEIDONPAY_API_SECRET ?? '',
  poseidonpayWebhookSecret: process.env.POSEIDONPAY_WEBHOOK_SECRET ?? ''
};

export const isProduction = env.nodeEnv === 'production';
