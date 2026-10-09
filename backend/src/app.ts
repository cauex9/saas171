import express, { NextFunction, Request, Response } from 'express';
import { applySecurityMiddleware } from './middleware/security';
import { errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes';
import paymentsRoutes from './routes/payments';
import webhookRoutes from './routes/webhooks';

const app = express();

app.use('/api/webhooks/poseidonpay', express.raw({ type: 'application/json' }));
applySecurityMiddleware(app);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/webhooks', webhookRoutes);

app.get('/', (_req, res) => {
  res.json({ name: 'SocialDash API', status: 'online' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  errorHandler(err, _req, res, _next);
});

export default app;
