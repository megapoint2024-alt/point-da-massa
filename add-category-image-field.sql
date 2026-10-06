-- Execute este comando no SQL Editor do Supabase
-- Adiciona o campo 'imagem_url' na tabela categorias
ALTER TABLE categorias ADD COLUMN IF NOT EXISTS imagem_url TEXT;
