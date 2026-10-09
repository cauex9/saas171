# Configurar Supabase

Project URL: https://xetextnyxmkfxnyvokmc.supabase.co

A chave pública já está preenchida nos arquivos .env.example. Copie cada .env.example para .env no frontend e no backend.

No backend, configure SUPABASE_SERVICE_ROLE_KEY somente no ambiente privado (Render), usando uma chave de servidor válida conforme o SDK e a versão do projeto. Não envie a chave por chat nem a coloque em ZIP, repositório ou frontend. A chave enviada anteriormente foi exposta e precisa ser revogada.

ATENÇÃO: este ZIP é baseado na versão pré-produção enviada. O frontend/src/utils/history.ts ainda usa localStorage; o histórico na nuvem exige integração adicional e testes ponta a ponta. Não publique para clientes antes disso.
