import { Router } from 'express';
import { handlePoseidonWebhook } from '../controllers/paymentController';

const router = Router();

router.post('/poseidonpay', handlePoseidonWebhook);

export default router;
