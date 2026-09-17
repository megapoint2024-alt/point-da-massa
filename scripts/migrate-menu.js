// Script para migrar dados do menu.json para o Supabase
// Execute com: node scripts/migrate-menu.js

import { createClient } from '@supabase/supabase-js'
import menuData from '../src/data/menu.json' with { type: 'json' }
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessárias')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrateMenu() {
  console.log('Iniciando migração do cardápio...')
  
  try {
    // Migrar categorias
    for (const category of menuData.categories) {
      console.log(`Migrando categoria: ${category.name}`)
      
      const { data: categoryData, error: categoryError } = await supabase
        .from('categorias')
        .upsert({
          nome: category.name,
          id_categoria: category.id,
          fim_de_semana: category.weekendOnly || false,
          tem_tamanhos: category.hasSizes || false,
          tamanhos: category.sizes || null,
          preco_base: category.basePrice || null
        }, {
          onConflict: 'id_categoria'
        })
        .select()
      
      if (categoryError) {
        console.error(`Erro ao migrar categoria ${category.name}:`, categoryError)
        continue
      }
      
      const categoryId = categoryData[0].id
      
      // Migrar itens da categoria
      for (const item of category.items) {
        console.log(`  - Migrando item: ${item.name}`)
        
        // Verificar se item já existe
        const { data: existingItem } = await supabase
          .from('itens_cardapio')
          .select('*')
          .eq('categoria_id', categoryId)
          .eq('nome', item.name)
          .single()
        
        if (existingItem) {
          // Atualizar item existente
          const { error: itemError } = await supabase
            .from('itens_cardapio')
            .update({
              descricao: item.description,
              preco: item.price,
              imagem: item.image || '🍽️',
              especial: item.special || false,
              disponivel: true
            })
            .eq('id', existingItem.id)
          
          if (itemError) {
            console.error(`    Erro ao atualizar item ${item.name}:`, itemError)
          } else {
            console.log(`    ✓ Item ${item.name} atualizado`)
          }
        } else {
          // Inserir novo item
          const { error: itemError } = await supabase
            .from('itens_cardapio')
            .insert({
              categoria_id: categoryId,
              nome: item.name,
              descricao: item.description,
              preco: item.price,
              imagem: item.image || '🍽️',
              especial: item.special || false,
              disponivel: true
            })
          
          if (itemError) {
            console.error(`    Erro ao migrar item ${item.name}:`, itemError)
          } else {
            console.log(`    ✓ Item ${item.name} inserido`)
          }
        }
      }
    }
    
    // Remover item antigo dos hambúrgueres (se ainda existir no Supabase)
    console.log('Verificando item antigo dos hambúrgueres no Supabase...')
    const { data: hamburgerCategory } = await supabase
      .from('categorias')
      .select('*')
      .eq('id_categoria', 'hamburgueres')
      .single()
    
    if (hamburgerCategory) {
      const { data: oldHotdogItem } = await supabase
        .from('itens_cardapio')
        .select('*')
        .eq('categoria_id', hamburgerCategory.id)
        .eq('nome', 'Cachorro-quente na Chapa')
        .single()
      
      if (oldHotdogItem) {
        await supabase
          .from('itens_cardapio')
          .delete()
          .eq('id', oldHotdogItem.id)
        console.log('✓ Item antigo removido dos hambúrgueres no Supabase')
      } else {
        console.log('✓ Item antigo não encontrado nos hambúrgueres (já removido)')
      }
    }
    
    console.log('✅ Migração concluída com sucesso!')
    console.log('📋 Resumo das alterações:')
    console.log('- Imagens reais adicionadas a todos os itens')
    console.log('- Seletor de quantidade implementado no modal')
    console.log('- Açaí agora com tamanhos (300ml, 400ml, Self Service)')
    console.log('- Nova categoria "Lanches na Chapa" criada')
    console.log('- Cachorro-quente movido para "Lanches na Chapa"')
    console.log('- Cuscuz Recheado e Macaxeira separados em 2 itens')
  } catch (error) {
    console.error('Erro durante migração:', error)
    process.exit(1)
  }
}

migrateMenu()