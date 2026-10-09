import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Express } from 'express';

export function applySecurityMiddleware(app: Express) {
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(
    cors({
      origin: (origin, callback) => {
        const allowed = (process.env.FRONTEND_URL || '').split(',').map(s => s.trim()).filter(Boolean);
        if (!origin || allowed.includes(origin) || (process.env.NODE_ENV !== 'production' && /^http:\/\/localhost:\d+$/.test(origin))) return callback(null, true);
        return callback(new Error('CORS: origem não autorizada'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-PoseidonPay-Signature']
    })
  );
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 120,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Muitas requisições. Tente novamente em instantes.' }
    })
  );
}
