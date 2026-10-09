# Checklist para publicação (pendências obrigatórias)

1. Configure o Supabase Authentication, URL e anon key no frontend. Nunca exponha service role no frontend.
2. Execute `database/schema.sql` em projeto de teste e revise as políticas RLS. A tabela `analyses` é acessada no backend com chave service role, sempre filtrando por usuário autenticado.
3. Configure no Render: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `AI_API_KEY`, `FRONTEND_URL`, e chaves do provedor. Configure no Netlify as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
4. Atualize `netlify.toml` com o domínio REAL do Render antes do deploy. Verifique CORS.
5. IMPORTANTE: cobrança real NÃO está pronta. O checkout fictício foi bloqueado. O endpoint Pix depende de teste de integração, confirmação do webhook e gravação transacional persistente; não libere cobranças sem isso.
6. A UI ainda possui dados demonstrativos em dashboard/campanhas e o histórico local. Migrar todas as telas para consultas autenticadas à API e remover números de exemplo antes de vender.
7. Validar login, confirmação de e-mail, análise real, histórico, isolamento de contas, exclusão, logout, política de privacidade, termos, rate limits, backup, webhooks e testes de pagamento ponta a ponta.
8. Não declare produção pronta sem testes reais e revisão de segurança.
