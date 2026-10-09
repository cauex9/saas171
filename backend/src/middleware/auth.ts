import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';
export interface AuthRequest extends Request { userId?: string }
export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = /^Bearer (.+)$/i.exec(req.header('authorization') || '')?.[1];
  if (!token || !env.supabaseUrl || !env.supabaseAnonKey) return res.status(401).json({ message: 'Faça login para continuar.' });
  try {
    const client = createClient(env.supabaseUrl, env.supabaseAnonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await client.auth.getUser(token);
    if (error || !data.user) return res.status(401).json({ message: 'Sessão inválida ou expirada.' });
    req.userId = data.user.id;
    next();
  } catch { res.status(503).json({ message: 'Serviço de autenticação indisponível.' }); }
}
