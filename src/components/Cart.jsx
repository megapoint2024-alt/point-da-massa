function Cart({ navigateTo, cart, removeFromCart }) {
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.finalPrice, 0)
  }

  const formatItemName = (item) => {
    let name = `${item.quantity}x ${item.name}`
    if (item.size) {
      name += ` (${item.size.name})`
    }
    if (item.observation) {
      name += ` - ${item.observation}`
    }
    return name
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm to-orange-50">
      {/* Header */}
      <header className="bg-primary text-white py-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <button 
            onClick={() => navigateTo('menu')}
            className="flex items-center gap-2 hover:text-orange-200 transition-colors"
          >
            <span className="text-2xl">←</span>
            <span className="font-semibold">Voltar</span>
          </button>
          <h1 className="text-xl font-bold font-rounded">Carrinho</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Cart Content */}
      <div className="container mx-auto px-4 py-6 pb-32">
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2 font-rounded">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-600 mb-6">
              Adicione itens deliciosos do nosso cardápio!
            </p>
            <button
              onClick={() => navigateTo('menu')}
              className="bg-primary hover:bg-accent text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all"
            >
              Ver Cardápio
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div
                  key={item.cartId}
                  className="bg-white rounded-xl shadow-md p-4 border-2 border-orange-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover object-center"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x300?text=Sem+Imagem'
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 font-rounded">
                            {item.quantity}x {item.name}
                          </h3>
                          {item.size && (
                            <span className="text-sm text-gray-600">
                              Tamanho: {item.size.name}
                            </span>
                          )}
                        </div>
                      </div>
                      {item.observation && (
                        <p className="text-sm text-gray-600 bg-orange-50 p-2 rounded mb-2">
                          <span className="font-semibold">Obs:</span> {item.observation}
                        </p>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-primary">
                          R$ {item.finalPrice.toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          className="text-red-500 hover:text-red-700 font-semibold text-sm"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-primary mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-rounded">
                Resumo do Pedido
              </h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Itens ({cart.length})</span>
                  <span>R$ {calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxa de entrega</span>
                  <span className="text-green-600">A combinar</span>
                </div>
                <div className="border-t-2 border-orange-200 pt-2 mt-2">
                  <div className="flex justify-between text-xl font-bold text-primary">
                    <span>Total</span>
                    <span>R$ {calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigateTo('checkout')}
              className="w-full bg-primary hover:bg-accent text-white py-4 rounded-full font-bold text-xl shadow-lg transition-all transform hover:scale-105"
            >
              Finalizar Pedido
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Cart