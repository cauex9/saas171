import { NextFunction, Request, Response } from 'express';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  const status = 'status' in err ? Number((err as any).status) || 500 : 500;
  res.status(status).json({
    error: err.message || 'Erro interno do servidor.'
  });
}
