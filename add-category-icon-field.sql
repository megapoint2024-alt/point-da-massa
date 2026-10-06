-- Execute este comando no SQL Editor do Supabase
-- Adiciona o campo 'icone' na tabela categorias
ALTER TABLE categorias ADD COLUMN IF NOT EXISTS icone TEXT DEFAULT '🧃';
