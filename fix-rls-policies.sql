-- Script para corrigir as políticas RLS do Supabase
-- Execute este script no SQL Editor do Supabase
-- Isso permitirá que a migração e o site funcionem corretamente

-- Desabilitar RLS temporariamente para migração
ALTER TABLE categorias DISABLE ROW LEVEL SECURITY;
ALTER TABLE itens_cardapio DISABLE ROW LEVEL SECURITY;
ALTER TABLE clientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos DISABLE ROW LEVEL SECURITY;

-- Reabilitar RLS com políticas mais permissivas
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_cardapio ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes
DROP POLICY IF EXISTS "Public read categorias" ON categorias;
DROP POLICY IF EXISTS "Public read itens" ON itens_cardapio;
DROP POLICY IF EXISTS "Public read clientes" ON clientes;
DROP POLICY IF EXISTS "Public insert clientes" ON clientes;
DROP POLICY IF EXISTS "Public update clientes" ON clientes;
DROP POLICY IF EXISTS "Public insert pedidos" ON pedidos;
DROP POLICY IF EXISTS "Public read pedidos" ON pedidos;

-- Criar novas políticas mais permissivas

-- Políticas para categorias (leitura e inserção pública)
CREATE POLICY "Enable all access for categorias" ON categorias
    FOR ALL USING (true) WITH CHECK (true);

-- Políticas para itens_cardapio (leitura e inserção pública)
CREATE POLICY "Enable all access for itens" ON itens_cardapio
    FOR ALL USING (true) WITH CHECK (true);

-- Políticas para clientes (leitura, inserção e atualização pública)
CREATE POLICY "Enable all access for clientes" ON clientes
    FOR ALL USING (true) WITH CHECK (true);

-- Políticas para pedidos (leitura e inserção pública)
CREATE POLICY "Enable all access for pedidos" ON pedidos
    FOR ALL USING (true) WITH CHECK (true);

-- Nota: Estas políticas são permissivas para permitir funcionamento do site
-- Para produção, considere implementar autenticação mais robusta