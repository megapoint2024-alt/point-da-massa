# Configuração do Supabase - Point da Massa

## 📋 Pré-requisitos

Você precisará criar uma conta gratuita no Supabase em https://supabase.com

## 🚀 Passo a Passo para Configuração

### 1. Criar Projeto Supabase

1. Acesse https://supabase.com
2. Clique em "Start your project"
3. Faça login ou crie uma conta
4. Clique em "New Project"
5. Preencha:
   - **Name**: Point da Massa
   - **Database Password**: (escolha uma senha segura e anote)
   - **Region**: South America (São Paulo) - recomendado para melhor performance
6. Clique em "Create new project"
7. Aguarde o projeto ser criado (pode levar 2-3 minutos)

### 2. Obter Credenciais

Após o projeto ser criado:

1. Vá em **Settings** → **API**
2. Copie os seguintes valores:
   - **Project URL**: algo como `https://xxxxx.supabase.co`
   - **anon public**: chave pública que começa com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Configurar Variáveis de Ambiente

No arquivo `.env` na raiz do projeto, substitua:

```env
VITE_SUPABASE_URL=seu-project-url-aqui
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

Exemplo:
```env
VITE_SUPABASE_URL=https://abcdefgh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Executar Script SQL

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em "New Query"
3. Copie o conteúdo do arquivo `supabase-setup.sql`
4. Cole no editor e clique em "Run"
5. Isso criará todas as tabelas necessárias

### 5. Migrar Dados do Cardápio

Após configurar as variáveis de ambiente:

```bash
node scripts/migrate-menu.js
```

Isso irá migrar todos os dados do `menu.json` para as tabelas do Supabase.

### 6. Configurar Autenticação Admin (Opcional)

Para um painel admin mais seguro, você pode:

1. No Supabase, vá em **Authentication** → **Providers**
2. Habilite **Email** provider
3. Crie um usuário admin manualmente ou através do código

## 📊 Estrutura das Tabelas

### categorias
- id (UUID)
- nome (TEXT)
- id_categoria (TEXT) - identificador único
- fim_de_semana (BOOLEAN)
- tem_tamanhos (BOOLEAN)
- tamanhos (JSONB)
- preco_base (DECIMAL)

### itens_cardapio
- id (UUID)
- categoria_id (UUID)
- nome (TEXT)
- descricao (TEXT)
- preco (DECIMAL)
- imagem (TEXT)
- especial (BOOLEAN)
- disponivel (BOOLEAN)

### clientes
- id (UUID)
- nome (TEXT)
- telefone (TEXT) - único
- endereco (TEXT)
- total_pedidos (INTEGER)
- ultimo_pedido (TIMESTAMP)

### pedidos
- id (UUID)
- cliente_id (UUID)
- numero_pedido (INTEGER)
- itens (JSONB)
- total (DECIMAL)
- tipo_entrega (TEXT)
- endereco_entrega (TEXT)
- forma_pagamento (TEXT)
- status (TEXT)
- observacoes (TEXT)

## 🔐 Segurança

As políticas de segurança (RLS) estão configuradas para:
- Leitura pública de categorias e itens (para o site funcionar)
- Inserção e atualização de clientes (para cadastro)
- Inserção de pedidos (para finalização)

Para o painel admin, você pode adicionar autenticação mais robusta posteriormente.

## 🚨 Troubleshooting

### Erro de conexão
- Verifique se as variáveis de ambiente estão corretas
- Certifique-se que o projeto Supabase está ativo

### Erro de permissão
- Verifique as políticas RLS no SQL Editor
- Execute o script `supabase-setup.sql` novamente

### Migração falha
- Verifique se as tabelas foram criadas
- Certifique-se que as variáveis de ambiente estão configuradas
- Execute o script de migração novamente

## 📝 Próximos Passos

Após configurar o Supabase:
1. Execute a migração dos dados
2. Teste o site carregando do Supabase
3. Configure o painel admin
4. Teste o cadastro de clientes