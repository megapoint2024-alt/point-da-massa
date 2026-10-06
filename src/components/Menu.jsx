import { useState, useEffect } from 'react'

function Menu({ navigateTo, menuData, addToCart, selectedCategory }) {
  const [activeCategory, setActiveCategory] = useState(selectedCategory || (menuData?.categories?.[0]?.id))
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [observation, setObservation] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isWeekend, setIsWeekend] = useState(false)

  useEffect(() => {
    const checkWeekend = () => {
      const today = new Date()
      const day = today.getDay()
      setIsWeekend(day === 0 || day === 6) // 0 = domingo, 6 = sábado
    }
    checkWeekend()
  }, [])

  const activeCategoryData = menuData?.categories?.find(cat => cat.id === activeCategory)

  const handleAddToCart = () => {
    if (!selectedItem || !activeCategoryData) return
    
    // Verificar se é categoria de fim de semana e se não é fim de semana
    if (activeCategoryData.weekendOnly && !isWeekend) {
      alert('⚠️ Este item só pode ser pedido aos sábados e domingos!')
      return
    }
    
    const size = activeCategoryData.hasSizes ? selectedSize : null
    addToCart(selectedItem, size, observation, quantity)
    
    setSelectedItem(null)
    setSelectedSize(null)
    setObservation('')
    setQuantity(1)
    
    alert('Item adicionado ao carrinho!')
  }

  const handleItemClick = (item) => {
    setSelectedItem(item)
    if (activeCategoryData?.hasSizes) {
      setSelectedSize(activeCategoryData.sizes[0])
    }
  }

  const getObservationPlaceholder = (item) => {
    const itemName = item.name.toLowerCase()
    const categoryName = activeCategoryData?.name.toLowerCase() || ''
    const categoryId = activeCategoryData?.id || ''
    
    // Bebidas/Suco/Açaí/Sorvetes
    if (categoryId === 'bebidas' || categoryName.includes('bebidas') || categoryName.includes('açai') || categoryName.includes('sorvete')) {
      if (itemName.includes('suco') || itemName.includes('polpa')) {
        return 'Ex: goiaba, limão, maracujá, etc.'
      } else if (itemName.includes('açai')) {
        return 'Ex: banana, granola, mel, etc.'
      } else if (itemName.includes('sorvete')) {
        return 'Ex: misto, morango, chocolate, etc.'
      } else if (itemName.includes('refrigerante')) {
        return 'Ex: cola, guaraná, laranja, etc.'
      } else if (itemName.includes('água') || itemName.includes('agua')) {
        return 'Ex: com gás, sem gás, gelada, etc.'
      } else {
        return 'Ex: gelado, bem gelado, etc.'
      }
    }
    
    // Pizzas
    if (categoryId === 'pizzas' || categoryName.includes('pizza')) {
      if (itemName.includes('4 queijos')) {
        return 'Ex: sem parmesão, extra mussarela, etc.'
      } else if (itemName.includes('frango') || itemName.includes('catupiry')) {
        return 'Ex: sem catupiry, extra frango, etc.'
      } else if (itemName.includes('calabresa') || itemName.includes('bacon')) {
        return 'Ex: sem bacon, extra calabresa, etc.'
      } else if (itemName.includes('carne de sol') || itemName.includes('charque')) {
        return 'Ex: menos sal, sem queijo, etc.'
      } else if (itemName.includes('romeu') || itemName.includes('julieta') || itemName.includes('goiabada')) {
        return 'Ex: sem goiabada, extra queijo, etc.'
      } else {
        return 'Ex: sem cebola, borda recheada, etc.'
      }
    }
    
    // Hambúrgueres
    if (categoryId === 'hamburgueres' || categoryName.includes('hambúrguer')) {
      if (itemName.includes('tradicional')) {
        return 'Ex: sem picles, extra queijo, etc.'
      } else if (itemName.includes('costela')) {
        return 'Ex: sem molho, extra carne, etc.'
      } else if (itemName.includes('cupim')) {
        return 'Ex: bem passado, sem sal, etc.'
      } else if (itemName.includes('picanha')) {
        return 'Ex: mal passada, extra bacon, etc.'
      } else {
        return 'Ex: sem picles, extra queijo, etc.'
      }
    }
    
    // Pastéis Fritos
    if (categoryId === 'pasteis-fritos' || categoryName.includes('pastel')) {
      if (itemName.includes('queijo')) {
        return 'Ex: extra queijo, bem passado, etc.'
      } else if (itemName.includes('frango')) {
        return 'Ex: sem cebola, extra frango, etc.'
      } else if (itemName.includes('carne')) {
        return 'Ex: bem passado, pouco sal, etc.'
      } else if (itemName.includes('pizza')) {
        return 'Ex: sem azeitona, extra queijo, etc.'
      } else if (itemName.includes('calabresa')) {
        return 'Ex: sem cebola, extra calabresa, etc.'
      } else if (itemName.includes('catupiry')) {
        return 'Ex: sem catupiry, extra frango, etc.'
      } else if (itemName.includes('charque') || itemName.includes('queijo') && itemName.includes('charque')) {
        return 'Ex: sem charque, pouco sal, etc.'
      } else if (itemName.includes('carne de sol') || itemName.includes('queijo') && itemName.includes('sol')) {
        return 'Ex: menos sal, sem queijo, etc.'
      } else {
        return 'Ex: extra queijo, bem passado, etc.'
      }
    }
    
    // Pastéis de Forno
    if (categoryId === 'pasteis-forno' || categoryName.includes('forno')) {
      if (itemName.includes('queijo')) {
        return 'Ex: extra queijo, bem assado, etc.'
      } else if (itemName.includes('carne')) {
        return 'Ex: bem assado, pouco sal, etc.'
      } else if (itemName.includes('frango')) {
        return 'Ex: sem cebola, extra frango, etc.'
      } else {
        return 'Ex: extra queijo, bem assado, etc.'
      }
    }
    
    // Esfihas
    if (categoryId === 'esfihas' || categoryName.includes('esfiha')) {
      if (itemName.includes('4 queijos')) {
        return 'Ex: sem parmesão, extra mussarela, etc.'
      } else if (itemName.includes('frango') || itemName.includes('catupiry')) {
        return 'Ex: sem catupiry, extra frango, etc.'
      } else if (itemName.includes('calabresa') || itemName.includes('bacon')) {
        return 'Ex: sem bacon, extra calabresa, etc.'
      } else if (itemName.includes('carne de sol') || itemName.includes('charque')) {
        return 'Ex: menos sal, sem queijo, etc.'
      } else if (itemName.includes('romeu') || itemName.includes('julieta') || itemName.includes('goiabada')) {
        return 'Ex: sem goiabada, extra queijo, etc.'
      } else {
        return 'Ex: sem cebola, recheio extra, etc.'
      }
    }
    
    // Lanches na Chapa
    if (categoryId === 'lanches-chapa' || categoryName.includes('chapa')) {
      if (itemName.includes('cachorro') || itemName.includes('quente')) {
        return 'Ex: sem queijo, bem assado, etc.'
      } else {
        return 'Ex: sem queijo, bem assado, etc.'
      }
    }
    
    // Combo
    if (categoryId === 'combo' || categoryName.includes('combo')) {
      if (itemName.includes('pizza')) {
        return 'Ex: trocar sabor, sem refrigerante, etc.'
      } else if (itemName.includes('hambúrguer') || itemName.includes('batata')) {
        return 'Ex: sem batata, trocar bebida, etc.'
      } else if (itemName.includes('batata')) {
        return 'Ex: sem cheddar, pouco sal, etc.'
      } else {
        return 'Ex: sem batata, trocar bebida, etc.'
      }
    }
    
    // Promoção
    if (categoryId === 'promocao' || categoryName.includes('promoção') || categoryName.includes('promocao')) {
      if (itemName.includes('macaxeira') || itemName.includes('carne de sol')) {
        return 'Ex: pouco sal, sem nata, etc.'
      } else {
        return 'Ex: pouco sal, sem molho, etc.'
      }
    }
    
    // Cardápio de fim de semana
    if (categoryId === 'fim-de-semana' || categoryName.includes('fim de semana')) {
      if (itemName.includes('panqueca')) {
        if (itemName.includes('carne')) {
          return 'Ex: pouco sal, sem molho, etc.'
        } else if (itemName.includes('frango')) {
          return 'Ex: sem queijo, pouco molho, etc.'
        } else {
          return 'Ex: pouco sal, sem molho, etc.'
        }
      } else if (itemName.includes('lasanha')) {
        if (itemName.includes('carne')) {
          return 'Ex: pouco sal, sem queijo, etc.'
        } else if (itemName.includes('frango')) {
          return 'Ex: sem queijo, pouco molho, etc.'
        } else {
          return 'Ex: pouco sal, sem queijo, etc.'
        }
      } else if (itemName.includes('torta')) {
        return 'Ex: sem massa, pouco recheio, etc.'
      } else if (itemName.includes('cuscuz')) {
        return 'Ex: pouco sal, sem carne, etc.'
      } else if (itemName.includes('macaxeira')) {
        return 'Ex: pouco sal, sem queijo, etc.'
      } else {
        return 'Ex: pouco sal, sem molho, etc.'
      }
    }
    
    // Padrão
    return 'Ex: Sem cebola, pouco sal, etc.'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm to-orange-50">
      {/* Header */}
      <header className="bg-primary text-white py-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <button 
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 hover:text-orange-200 transition-colors"
          >
            <span className="text-2xl">←</span>
            <span className="font-semibold">Voltar</span>
          </button>
          <h1 className="text-xl font-bold font-rounded">Cardápio</h1>
          <button 
            onClick={() => navigateTo('cart')}
            className="relative bg-secondary hover:bg-accent text-white px-4 py-2 rounded-full font-semibold transition-colors"
          >
            🛒 Carrinho
          </button>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {menuData.categories.map((category) => {
            const isWeekendItem = category.weekendOnly
            
            return (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id)
                  setSelectedItem(null)
                  setSelectedSize(null)
                  setObservation('')
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === category.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-orange-100'
                }`}
              >
                {category.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Weekend Notice */}
      {activeCategoryData.weekendOnly && !isWeekend && (
        <div className="container mx-auto px-4 mb-4">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-yellow-700 font-semibold">
              ⚠️ Pedidos desta categoria apenas aos sábados e domingos
            </p>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="container mx-auto px-4 py-4 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeCategoryData.items.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`bg-white rounded-xl shadow-md overflow-hidden border-2 cursor-pointer transition-all transform hover:scale-105 ${
                selectedItem?.id === item.id
                  ? 'border-primary shadow-lg'
                  : 'border-orange-200 hover:border-primary'
              } ${item.special ? 'border-accent' : ''}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Sem+Imagem'
                  }}
                />
                {item.special && (
                  <span className="absolute top-2 right-2 bg-accent text-white text-xs px-2 py-1 rounded-full">
                    Especial
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-1 font-rounded">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-primary">
                    R$ {item.price.toFixed(2)}
                  </span>
                  {activeCategoryData.weekendOnly && !isWeekend && (
                    <span className="text-xs text-orange-600 font-semibold">
                      🔒 Apenas fim de semana
                    </span>
                  )}
                  {activeCategoryData.hasSizes && (
                    <span className="text-xs text-gray-500">
                      Tamanhos disponíveis
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Item Selection Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.name}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Sem+Imagem'
                    }}
                  />
                </div>
                <button
                  onClick={() => {
                    setSelectedItem(null)
                    setSelectedSize(null)
                    setObservation('')
                    setQuantity(1)
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2 font-rounded">
                {selectedItem.name}
              </h3>
              <p className="text-gray-600 mb-4">{selectedItem.description}</p>

              {/* Size Selection */}
              {activeCategoryData.hasSizes && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Selecione o tamanho:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {activeCategoryData.sizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedSize?.id === size.id
                            ? 'border-primary bg-orange-50'
                            : 'border-gray-200 hover:border-primary'
                        }`}
                      >
                        <div className="font-semibold">{size.name}</div>
                        <div className="text-sm text-gray-600">
                          R$ {(selectedItem.price * size.multiplier).toFixed(2)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantidade:
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-primary text-white font-bold text-xl hover:bg-accent transition-colors"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-gray-800 w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-primary text-white font-bold text-xl hover:bg-accent transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Observation */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Observações (opcional):
                </label>
                <textarea
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  placeholder={getObservationPlaceholder(selectedItem)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  rows="3"
                />
              </div>

              {/* Price Display */}
              <div className="bg-orange-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    R$ {(
                      (selectedSize 
                        ? selectedItem.price * selectedSize.multiplier
                        : selectedItem.price) * quantity
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={activeCategoryData.hasSizes && !selectedSize}
                className="w-full bg-primary hover:bg-accent text-white py-3 rounded-full font-bold text-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Menu