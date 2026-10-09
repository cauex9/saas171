# ADPILOT AI

Plataforma SaaS para análise, validação e otimização de anúncios antes da publicação em campanhas de mídia paga.

## Stack

- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Banco: Supabase + PostgreSQL + RLS
- Pagamentos: PoseidonPay (integração desacoplada via `PaymentService`)
- IA: camada separada no backend para trocas de provedor/modelo

## Estrutura

- `frontend/`: aplicação web
- `backend/`: API REST e serviços
- `database/`: SQL de referência para Supabase

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env` na raiz do projeto.
2. Preencha as variáveis de ambiente com as credenciais do Supabase e da IA.
3. Configure o Supabase e os webhooks da PoseidonPay.

## Executar localmente

```bash
npm run dev:frontend
npm run dev:backend
```

## Build

```bash
npm run build
```

## Supabase

Crie as tabelas com o SQL em `database/schema.sql` e ative RLS.

## IA

A camada de IA está separada em `backend/src/services/aiService.ts` e pode ser trocada por outro provedor sem impactar o restante da aplicação.

## PoseidonPay

A integração é preparada para receber a documentação oficial. Não invente endpoints nem assinaturas. O webhook foi implementado como um ponto de entrada desacoplado com validação idempotente.

## Deploy

- Frontend: Vercel / Netlify
- Backend: Railway / Render / VPS
- Banco: Supabase

## Observações

O produto foi desenhado para apresentar estimativas e riscos, não promessas de aprovação pela Meta ou de conversão garantida.
