import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { createCheckout, createPixSubscription, createSimplePix } from '../controllers/paymentController';

const router = Router();

router.post('/pix/plan', requireAuth, createSimplePix);
router.post('/checkout', requireAuth, createCheckout);
router.post('/pix/subscription', requireAuth, createPixSubscription);

export default router;
