import { Router } from 'express';
import { z } from 'zod';
import { AIService } from '../services/aiService';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { supabase } from '../db/supabase';

const router = Router();
const aiService = new AIService();

const analyzeSchema = z.object({
  adName: z.string().min(2),
  product: z.string().min(2),
  price: z.string().min(1),
  country: z.string().min(2),
  audience: z.string().min(2),
  goal: z.string().min(2),
  dailyBudget: z.string().min(1),
  headline: z.string().min(2),
  primaryText: z.string().min(2),
  description: z.string().min(2),
  cta: z.string().min(2),
  landingPageUrl: z.string().url().optional()
});

router.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'socialdash-backend', status: 'running' });
});

router.post('/analyze', requireAuth, async (req, res, next) => {
  try {
    const payload = analyzeSchema.parse(req.body);
    const result = await aiService.analyzeAd(payload);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/optimize', requireAuth, async (req, res, next) => {
  try {
    const payload = analyzeSchema.parse(req.body);
    const result = await aiService.optimizeAd(payload);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/history', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { data, error } = await supabase.from('analyses').select('id,payload,created_at').eq('user_id', req.userId!).order('created_at', { ascending: false }).limit(200);
    if (error) throw error;
    res.json((data || []).map(row => row.payload));
  } catch (error) { next(error); }
});
router.post('/history', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const item = req.body;
    if (!item || typeof item.id !== 'string' || typeof item.name !== 'string' || item.name.length > 200) return res.status(400).json({ message: 'Histórico inválido.' });
    const { error } = await supabase.from('analyses').insert({ user_id: req.userId!, name: item.name, product: item.product || '', country: item.country || '', objective: item.objective || '', status: 'completed', payload: item });
    if (error) throw error;
    res.status(201).json({ ok: true });
  } catch (error) { next(error); }
});
router.delete('/history', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { error } = await supabase.from('analyses').delete().eq('user_id', req.userId!);
    if (error) throw error;
    res.json({ ok: true });
  } catch (error) { next(error); }
});
export default router;
