import heroImg from '../assets/hero.png'

function Home({ navigateTo, menuData }) {
  const featuredItems = menuData.categories.flatMap(cat => 
    cat.items.slice(0, 2).map(item => ({ ...item, category: cat.name }))
  ).slice(0, 6)

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm to-orange-50">
      {/* Header */}
      <header className="bg-primary text-white py-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-4 border-secondary shadow-md">
              <span className="text-2xl">🍽️</span>
            </div>
            <h1 className="text-2xl font-bold font-rounded">Point da Massa</h1>
          </div>
          <button 
            onClick={() => navigateTo('cart')}
            className="relative bg-secondary hover:bg-accent text-white px-4 py-2 rounded-full font-semibold transition-colors"
          >
            🛒 Carrinho
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 text-center">
        <div className="relative rounded-3xl shadow-xl overflow-hidden mb-8 border-4 border-primary">
          <div 
            className="absolute inset-0 bg-cover bg-center scale-150"
            style={{ backgroundImage: `url(${heroImg})` }}
          ></div>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 p-12">
            <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center border-8 border-accent shadow-2xl">
              <span className="text-6xl">🍽️</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2 font-rounded">
              Point da Massa
            </h2>
            <p className="text-xl text-white mb-4">
              O melhor sabor de Boqueirão, Paraíba
            </p>
            <button 
              onClick={() => navigateTo('menu')}
              className="bg-primary hover:bg-accent text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg transform hover:scale-105 transition-all"
            >
              Ver Cardápio Completo
            </button>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="container mx-auto px-4 py-8">
        <h3 className="text-3xl font-bold text-primary mb-6 text-center font-rounded">
          Destaques do Cardápio
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-orange-200 hover:border-primary transition-all transform hover:scale-105 cursor-pointer"
              onClick={() => navigateTo('menu')}
            >
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Sem+Imagem'
                  }}
                />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-2 font-rounded">
                  {item.name}
                </h4>
                <p className="text-gray-600 mb-3 text-sm">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">
                    R$ {item.price.toFixed(2)}
                  </span>
                  <span className="text-xs bg-secondary text-white px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Preview */}
      <section className="container mx-auto px-4 py-8 mb-8">
        <h3 className="text-3xl font-bold text-primary mb-6 text-center font-rounded">
          Nossas Categorias
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {menuData.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => navigateTo('menu', category.id)}
              className="bg-white rounded-xl shadow-md p-4 border-2 border-orange-200 hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-2">
                {category.id === 'pasteis-fritos' ? '🥟' :
                 category.id === 'pasteis-forno' ? '🥐' :
                 category.id === 'pizzas' ? '🍕' :
                 category.id === 'esfihas' ? '🥙' :
                 category.id === 'hamburgueres' ? '🍔' :
                 category.id === 'fim-de-semana' ? '🍽️' : '🧃'}
              </div>
              <span className="text-sm font-semibold text-gray-700 font-rounded">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <a 
            href="https://wa.me/5583991377547" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-rounded hover:text-orange-200 transition-colors"
          >
            📍 Boqueirão, Paraíba | 📱 Peça pelo WhatsApp
          </a>
          <p className="text-sm mt-2 opacity-80">
            © 2024 Point da Massa - Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home