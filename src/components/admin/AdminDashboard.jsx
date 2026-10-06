import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

function AdminDashboard({ user, onLogout, onRefresh }) {
  const [activeTab, setActiveTab] = useState('menu')
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCategoryModal, setShowCategoryModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      console.log('Carregando dados do admin...')
      // Carregar categorias
      const { data: categoriesData } = await supabase
        .from('categorias')
        .select('*')
        .order('nome')
      
      // Carregar itens
      const { data: itemsData } = await supabase
        .from('itens_cardapio')
        .select('*')
        .order('nome')
      
      // Carregar clientes
      const { data: clientsData } = await supabase
        .from('clientes')
        .select('*')
        .order('ultimo_pedido', { ascending: false })

      console.log('Dados carregados:', { 
        categorias: categoriesData?.length, 
        itens: itemsData?.length, 
        clientes: clientsData?.length 
      })

      setCategories(categoriesData || [])
      setItems(itemsData || [])
      setClients(clientsData || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    onLogout()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm to-orange-50 flex items-center justify-center">
        <div className="text-2xl text-primary font-semibold">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm to-orange-50">
      {/* Header */}
      <header className="bg-primary text-white py-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-4 border-secondary shadow-md">
              <span className="text-xl">🔐</span>
            </div>
            <div>
              <h1 className="text-xl font-bold font-rounded">Painel Admin</h1>
              <p className="text-xs opacity-80">Point da Massa</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-secondary hover:bg-accent text-white px-4 py-2 rounded-full font-semibold transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-2 bg-white rounded-xl p-2 shadow-md">
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'menu'
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-orange-100'
            }`}
          >
            🍽️ Cardápio
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'clients'
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-orange-100'
            }`}
          >
            👥 Clientes
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {activeTab === 'menu' && (
          <MenuManagement 
            categories={categories} 
            items={items} 
            onRefresh={loadData}
          />
        )}
        {activeTab === 'clients' && (
          <ClientManagement 
            clients={clients} 
            onRefresh={loadData}
          />
        )}
      </div>
    </div>
  )
}

function MenuManagement({ categories, items, onRefresh }) {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryFormData, setCategoryFormData] = useState({
    nome: '',
    id_categoria: '',
    imagem_url: '',
    fim_de_semana: false,
    tem_tamanhos: false,
    tamanhos: []
  })

  const categoryItems = selectedCategory 
    ? items.filter(item => item.categoria_id === selectedCategory.id)
    : []

  const handleSaveItem = async (itemData) => {
    try {
      if (editingItem) {
        await supabase
          .from('itens_cardapio')
          .update(itemData)
          .eq('id', editingItem.id)
      } else {
        await supabase
          .from('itens_cardapio')
          .insert(itemData)
      }
      setEditingItem(null)
      setShowAddModal(false)
      onRefresh()
    } catch (error) {
      console.error('Erro ao salvar item:', error)
      alert('Erro ao salvar item')
    }
  }

  const handleDeleteItem = async (itemId) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return
    
    try {
      console.log('Tentando excluir item:', itemId)
      
      // Primeiro verificar se o item existe
      const { data: existingItem } = await supabase
        .from('itens_cardapio')
        .select('*')
        .eq('id', itemId)
        .single()
      
      console.log('Item encontrado antes de excluir:', existingItem)
      
      if (!existingItem) {
        console.error('Item não encontrado no banco')
        alert('Item não encontrado no banco de dados')
        return
      }
      
      // Tentar excluir
      const { data, error } = await supabase
        .from('itens_cardapio')
        .delete()
        .eq('id', itemId)
        .select()
      
      console.log('Resultado da exclusão:', { data, error })
      
      if (error) {
        console.error('Erro Supabase ao excluir:', error)
        throw error
      }
      
      console.log('Item excluído com sucesso, recarregando dados...')
      await onRefresh()
      console.log('Dados recarregados')
      
      // Verificar se realmente foi excluído
      const { data: checkItem } = await supabase
        .from('itens_cardapio')
        .select('*')
        .eq('id', itemId)
        .single()
      
      console.log('Verificação após exclusão:', checkItem)
      
      if (checkItem) {
        console.error('Item ainda existe após exclusão!')
        alert('Erro: Item ainda existe no banco após tentativa de exclusão')
      }
    } catch (error) {
      console.error('Erro ao excluir item:', error)
      alert('Erro ao excluir item: ' + error.message)
    }
  }

  const handleSaveCategory = async (e) => {
    e.preventDefault()
    
    try {
      const categoryData = {
        nome: categoryFormData.nome,
        id_categoria: categoryFormData.id_categoria.toLowerCase().replace(/\s+/g, '-'),
        imagem_url: categoryFormData.imagem_url || null,
        fim_de_semana: categoryFormData.fim_de_semana,
        tem_tamanhos: categoryFormData.tem_tamanhos,
        tamanhos: categoryFormData.tem_tamanhos ? categoryFormData.tamanhos : null,
        preco_base: categoryFormData.tem_tamanhos ? 35 : null
      }
      
      console.log('Salvando categoria:', categoryData)
      console.log('Tamanhos sendo salvos:', categoryData.tamanhos)
      
      if (editingCategory) {
        // Atualizar categoria existente
        const { data, error } = await supabase
          .from('categorias')
          .update(categoryData)
          .eq('id', editingCategory.id)
          .select()
        
        if (error) {
          console.error('Erro ao atualizar categoria:', error)
          throw error
        }
        console.log('Categoria atualizada no Supabase:', data)
      } else {
        // Criar nova categoria
        await supabase
          .from('categorias')
          .insert(categoryData)
      }
      
      setShowCategoryModal(false)
      setEditingCategory(null)
      setCategoryFormData({
        nome: '',
        id_categoria: '',
        imagem_url: '',
        fim_de_semana: false,
        tem_tamanhos: false,
        tamanhos: []
      })
      onRefresh()
    } catch (error) {
      console.error('Erro ao salvar categoria:', error)
      alert('Erro ao salvar categoria: ' + error.message)
    }
  }

  const addSize = () => {
    setCategoryFormData({
      ...categoryFormData,
      tamanhos: [
        ...categoryFormData.tamanhos,
        { id: 'novo-' + Date.now(), name: 'Novo Tamanho', multiplier: 1.0 }
      ]
    })
  }

  const removeSize = (index) => {
    setCategoryFormData({
      ...categoryFormData,
      tamanhos: categoryFormData.tamanhos.filter((_, i) => i !== index)
    })
  }

  const updateSize = (index, field, value) => {
    const newTamanhos = [...categoryFormData.tamanhos]
    newTamanhos[index] = {
      ...newTamanhos[index],
      [field]: field === 'multiplier' ? parseFloat(value) : value
    }
    setCategoryFormData({
      ...categoryFormData,
      tamanhos: newTamanhos
    })
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="bg-white rounded-xl shadow-md p-6 border-2 border-orange-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 font-rounded">
            Categorias
          </h3>
          <button
            onClick={() => {
              setEditingCategory(null)
              setCategoryFormData({
                nome: '',
                id_categoria: '',
                imagem_url: '',
                fim_de_semana: false,
                tem_tamanhos: false,
                tamanhos: []
              })
              setShowCategoryModal(true)
            }}
            className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-full font-semibold transition-colors"
          >
            + Nova Categoria
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedCategory?.id === category.id
                  ? 'border-primary bg-orange-50'
                  : 'border-gray-200 hover:border-primary'
              }`}
            >
              <button
                onClick={() => setSelectedCategory(category)}
                className="w-full text-left"
              >
                <div className="font-semibold text-gray-800">{category.nome}</div>
                <div className="text-sm text-gray-600">
                  {items.filter(i => i.categoria_id === category.id).length} itens
                </div>
              </button>
              <button
                onClick={() => {
                  alert('BOTÃO EDITAR CLICADO - Categoria: ' + category.nome)
                  console.log('Editar clicado para categoria:', category.nome)
                  console.log('Tamanhos da categoria:', category.tamanhos)
                  setEditingCategory(category)
                  setCategoryFormData({
                    nome: category.nome,
                    id_categoria: category.id_categoria,
                    imagem_url: category.imagem_url || '',
                    fim_de_semana: category.fim_de_semana,
                    tem_tamanhos: category.tem_tamanhos,
                    tamanhos: category.tamanhos || []
                  })
                  console.log('FormData preenchido com:', {
                    nome: category.nome,
                    id_categoria: category.id_categoria,
                    fim_de_semana: category.fim_de_semana,
                    tem_tamanhos: category.tem_tamanhos,
                    tamanhos: category.tamanhos || []
                  })
                  setShowCategoryModal(true)
                }}
                className="mt-2 text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      {selectedCategory && (
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-orange-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800 font-rounded">
              {selectedCategory.nome}
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-full font-semibold transition-colors"
            >
              + Adicionar Item
            </button>
          </div>

          <div className="space-y-3">
            {categoryItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-primary transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.imagem.startsWith('http') ? (
                      <img 
                        src={item.imagem} 
                        alt={item.nome}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.parentElement.innerHTML = '🍽️'
                        }}
                      />
                    ) : (
                      <span className="text-3xl flex items-center justify-center w-full h-full">{item.imagem}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{item.nome}</div>
                    <div className="text-sm text-gray-600">
                      R$ {parseFloat(item.preco).toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <ItemModal
          item={editingItem}
          category={selectedCategory}
          onSave={handleSaveItem}
          onCancel={() => {
            setEditingItem(null)
            setShowAddModal(false)
          }}
        />
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 font-rounded">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              
              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome da Categoria *
                  </label>
                  <input
                    type="text"
                    value={categoryFormData.nome}
                    onChange={(e) => setCategoryFormData({...categoryFormData, nome: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ID da Categoria (para URL) *
                  </label>
                  <input
                    type="text"
                    value={categoryFormData.id_categoria}
                    onChange={(e) => setCategoryFormData({...categoryFormData, id_categoria: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="ex: lanches-chapa"
                    required
                    disabled={!!editingCategory}
                    {...(editingCategory && { className: "w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-100 focus:border-primary focus:outline-none" })}
                  />
                  {editingCategory && (
                    <p className="text-xs text-gray-500 mt-1">ID não pode ser alterado em edição</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL da Imagem
                  </label>
                  <input
                    type="text"
                    value={categoryFormData.imagem_url}
                    onChange={(e) => setCategoryFormData({...categoryFormData, imagem_url: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                  {categoryFormData.imagem_url && (
                    <div className="mt-2">
                      <img
                        src={categoryFormData.imagem_url}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={categoryFormData.fim_de_semana}
                      onChange={(e) => setCategoryFormData({...categoryFormData, fim_de_semana: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-semibold text-gray-700">Fim de Semana</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={categoryFormData.tem_tamanhos}
                      onChange={(e) => setCategoryFormData({...categoryFormData, tem_tamanhos: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-semibold text-gray-700">Tem Tamanhos</span>
                  </label>
                </div>

                {categoryFormData.tem_tamanhos && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Tamanhos
                      </label>
                      <button
                        type="button"
                        onClick={addSize}
                        className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                      >
                        + Adicionar Tamanho
                      </button>
                    </div>
                    {categoryFormData.tamanhos.map((size, index) => (
                      <div key={size.id} className="flex gap-2 mb-2 items-center">
                        <input
                          type="text"
                          value={size.name}
                          onChange={(e) => updateSize(index, 'name', e.target.value)}
                          className="flex-1 p-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none text-sm"
                          placeholder="Nome do tamanho"
                        />
                        <input
                          type="number"
                          step="0.1"
                          value={size.multiplier}
                          onChange={(e) => updateSize(index, 'multiplier', e.target.value)}
                          className="w-20 p-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none text-sm"
                          placeholder="Multiplicador"
                        />
                        <button
                          type="button"
                          onClick={() => removeSize(index)}
                          className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {categoryFormData.tamanhos.length === 0 && (
                      <p className="text-xs text-gray-500 italic">
                        Nenhum tamanho adicionado. Clique em "+ Adicionar Tamanho".
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryModal(false)
                      setEditingCategory(null)
                      setCategoryFormData({
                        nome: '',
                        id_categoria: '',
                        imagem_url: '',
                        fim_de_semana: false,
                        tem_tamanhos: false,
                        tamanhos: []
                      })
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-full font-bold transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-accent text-white py-3 rounded-full font-bold transition-all"
                  >
                    {editingCategory ? 'Salvar Alterações' : 'Criar Categoria'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ClientManagement({ clients, onRefresh }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border-2 border-orange-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 font-rounded">
        Clientes Cadastrados
      </h3>
      
      {clients.length === 0 ? (
        <p className="text-gray-600 text-center py-8">
          Nenhum cliente cadastrado ainda
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-orange-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Telefone</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Endereço</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Pedidos</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Último Pedido</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b border-gray-100 hover:bg-orange-50">
                  <td className="py-3 px-4 font-semibold text-gray-800">{client.nome}</td>
                  <td className="py-3 px-4 text-gray-600">{client.telefone}</td>
                  <td className="py-3 px-4 text-gray-600">{client.endereco || '-'}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                      {client.total_pedidos}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {client.ultimo_pedido 
                      ? new Date(client.ultimo_pedido).toLocaleDateString('pt-BR')
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function ItemModal({ item, category, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nome: item?.nome || '',
    descricao: item?.descricao || '',
    preco: item?.preco || '',
    imagem: item?.imagem || '🍽️',
    especial: item?.especial || false,
    disponivel: item?.disponivel !== false
  })

  // Reset form when item changes
  useEffect(() => {
    if (item) {
      setFormData({
        nome: item.nome || '',
        descricao: item.descricao || '',
        preco: item.preco || '',
        imagem: item.imagem || '🍽️',
        especial: item.especial || false,
        disponivel: item.disponivel !== false
      })
    }
  }, [item])

  const handleSubmit = (e) => {
    e.preventDefault()
    const itemData = {
      ...formData,
      categoria_id: category.id,
      preco: parseFloat(formData.preco)
    }
    onSave(itemData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 font-rounded">
            {item ? 'Editar Item' : 'Novo Item'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome *
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preço *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.preco}
                onChange={(e) => setFormData({...formData, preco: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                URL da Imagem
              </label>
              <input
                type="text"
                value={formData.imagem}
                onChange={(e) => setFormData({...formData, imagem: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.especial}
                  onChange={(e) => setFormData({...formData, especial: e.target.checked})}
                  className="w-5 h-5"
                />
                <span className="text-sm font-semibold text-gray-700">Item Especial</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.disponivel}
                  onChange={(e) => setFormData({...formData, disponivel: e.target.checked})}
                  className="w-5 h-5"
                />
                <span className="text-sm font-semibold text-gray-700">Disponível</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-full font-bold transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-accent text-white py-3 rounded-full font-bold transition-all"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard