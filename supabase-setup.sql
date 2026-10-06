-- Script SQL para configurar as tabelas do Supabase para o Point da Massa
-- Execute este script no SQL Editor do Supabase

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  id_categoria TEXT UNIQUE NOT NULL,
  icone TEXT DEFAULT '🧃',
  imagem_url TEXT,
  fim_de_semana BOOLEAN DEFAULT FALSE,
  tem_tamanhos BOOLEAN DEFAULT FALSE,
  tamanhos JSONB,
  preco_base DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de itens do cardápio
CREATE TABLE IF NOT EXISTS itens_cardapio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  imagem TEXT DEFAULT '🍽️',
  especial BOOLEAN DEFAULT FALSE,
  disponivel BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT UNIQUE NOT NULL,
  endereco TEXT,
  total_pedidos INTEGER DEFAULT 0,
  ultimo_pedido TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  numero_pedido INTEGER NOT NULL,
  itens JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  tipo_entrega TEXT NOT NULL, -- 'pickup' ou 'delivery'
  endereco_entrega TEXT,
  forma_pagamento TEXT NOT NULL, -- 'pix' ou 'card'
  status TEXT DEFAULT 'pendente', -- 'pendente', 'confirmado', 'preparando', 'entregando', 'concluido'
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_itens_categoria ON itens_cardapio(categoria_id);
CREATE INDEX IF NOT EXISTS idx_clientes_telefone ON clientes(telefone);
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_pedidos_data ON pedidos(created_at);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON categorias
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_itens_updated_at BEFORE UPDATE ON itens_cardapio
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON pedidos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Policy de segurança (RLS) - você pode ajustar conforme necessário
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_cardapio ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Políticas básicas para leitura pública (para o site funcionar)
CREATE POLICY "Public read categorias" ON categorias
    FOR SELECT USING (true);

CREATE POLICY "Public read itens" ON itens_cardapio
    FOR SELECT USING (true);

-- Políticas para clientes (leitura e inserção)
CREATE POLICY "Public read clientes" ON clientes
    FOR SELECT USING (true);

CREATE POLICY "Public insert clientes" ON clientes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update clientes" ON clientes
    FOR UPDATE USING (true);

-- Políticas para pedidos (inserção pública)
CREATE POLICY "Public insert pedidos" ON pedidos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read pedidos" ON pedidos
    FOR SELECT USING (true);

-- Políticas para admin (você precisará configurar autenticação admin)
-- Estas políticas serão ajustadas após configurar a autenticação