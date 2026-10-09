# Pix simplificado

O cliente autenticado escolhe STARTER, PRO ou AGENCY e clica em **Gerar Pix agora**. O frontend não solicita CPF, telefone ou e-mail.

O backend recupera o e-mail e nome do usuário autenticado pelo Supabase Auth, define o preço do plano no servidor e envia a cobrança para a PoseidonPay. É necessário cadastrar `full_name` ou `name` nos metadados do usuário no cadastro. Se o gateway exigir CPF ou telefone, será necessário coletar esses dados de maneira adequada antes de processar a cobrança; não inventar dados.

Configure a integração PoseidonPay no backend e valide o webhook de pagamento. Gerar Pix não ativa o plano: a ativação deve acontecer somente após confirmação autenticada do pagamento.

IMPORTANTE: o webhook/ativação de assinatura e o restante da aplicação ainda precisam de validação ponta a ponta antes de produção.
