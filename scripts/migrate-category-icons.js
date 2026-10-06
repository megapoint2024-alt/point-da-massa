// Script para adicionar campo 'icone' na tabela categorias e migrar dados existentes
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY devem estar definidos no .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrateCategoryIcons() {
  try {
    console.log('Iniciando migração de ícones de categorias...')

    // 1. Adicionar campo 'icone' na tabela categorias (se não existir)
    console.log('Adicionando campo icone na tabela categorias...')
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE categorias ADD COLUMN IF NOT EXISTS icone TEXT DEFAULT '🧃'`
    })

    // Se a função exec_sql não existir, tentamos usando SQL direto via Supabase
    if (alterError) {
      console.log('Nota: Não foi possível executar ALTER TABLE via RPC. Você precisará executar manualmente no SQL Editor do Supabase:')
      console.log("ALTER TABLE categorias ADD COLUMN IF NOT EXISTS icone TEXT DEFAULT '🧃';")
    } else {
      console.log('Campo icone adicionado com sucesso!')
    }

    // 2. Buscar todas as categorias
    const { data: categories, error: fetchError } = await supabase
      .from('categorias')
      .select('*')

    if (fetchError) {
      throw fetchError
    }

    console.log(`Encontradas ${categories.length} categorias`)

    // 3. Mapeamento de emojis padrão baseado no id_categoria
    const emojiMap = {
      'pasteis-fritos': '🥟',
      'pasteis-forno': '🥐',
      'pizzas': '🍕',
      'esfihas': '🥙',
      'hamburgueres': '🍔',
      'fim-de-semana': '🍽️'
    }

    // 4. Atualizar cada categoria com o emoji correspondente
    for (const category of categories) {
      const defaultEmoji = emojiMap[category.id_categoria] || '🧃'

      const { error: updateError } = await supabase
        .from('categorias')
        .update({ icone: defaultEmoji })
        .eq('id', category.id)

      if (updateError) {
        console.error(`Erro ao atualizar categoria ${category.nome}:`, updateError)
      } else {
        console.log(`✓ ${category.nome} (${category.id_categoria}) → ${defaultEmoji}`)
      }
    }

    console.log('Migração concluída com sucesso!')
  } catch (error) {
    console.error('Erro durante a migração:', error)
    process.exit(1)
  }
}

migrateCategoryIcons()
