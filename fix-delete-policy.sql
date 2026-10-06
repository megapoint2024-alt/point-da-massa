-- Script para corrigir especificamente a política de DELETE na tabela itens_cardapio
-- Execute este script no SQL Editor do Supabase

-- Remover política existente se houver
DROP POLICY IF EXISTS "Enable all access for itens" ON itens_cardapio;

-- Criar política explícita para permitir DELETE
CREATE POLICY "Enable delete for itens" ON itens_cardapio
    FOR DELETE USING (true);

-- Recriar política completa para todas as operações
CREATE POLICY "Enable all access for itens" ON itens_cardapio
    FOR ALL USING (true) WITH CHECK (true);

-- Verificar se a política foi criada corretamente
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'itens_cardapio';
