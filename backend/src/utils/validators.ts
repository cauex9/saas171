import { z } from 'zod';

export const pixSubscriptionSchema = z.object({
  identifier: z.string().min(1, 'identifier é obrigatório'),
  amount: z.number().min(0.01, 'amount deve ser maior ou igual a 0.01'),
  product: z.object({
    id: z.string().min(1, 'product.id é obrigatório'),
    name: z.string().min(1, 'product.name é obrigatório'),
    price: z.number().min(0.01, 'product.price deve ser maior ou igual a 0.01'),
    quantity: z.number().int().positive('product.quantity deve ser maior que 0').optional()
  }),
  subscription: z.object({
    periodicityType: z.enum(['DAYS', 'WEEKS', 'MONTHS', 'YEARS'], {
      errorMap: () => ({ message: 'periodicityType deve ser DAYS, WEEKS, MONTHS ou YEARS' })
    }),
    periodicity: z.number().int().positive('periodicity deve ser um número inteiro positivo'),
    firstChargeIn: z.number().int().min(0, 'firstChargeIn deve ser maior ou igual a 0').optional().default(0)
  }),
  client: z.object({
    name: z.string().min(1, 'client.name é obrigatório'),
    email: z.string().email('client.email deve ser um e-mail válido'),
    phone: z.string().optional(),
    document: z.string().optional()
  }),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'dueDate deve estar no formato YYYY-MM-DD').optional(),
  metadata: z.union([z.record(z.unknown()), z.string()]).optional(),
  callbackUrl: z.string().url('callbackUrl deve ser uma URL válida').optional()
});

export type PixSubscriptionSchemaInput = z.infer<typeof pixSubscriptionSchema>;
