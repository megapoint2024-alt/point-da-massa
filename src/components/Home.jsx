import heroImg from '../assets/hero.png'

const WHATSAPP_NUMBER = '5583991377547'
const SITE_URL = 'https://point-da-massa.vercel.app'

function Home({ navigateTo, menuData }) {
  const getWhatsAppUrl = () => {
    const message = `Olá! 👋 Seja bem-vindo(a) à Point da Massa! Confira nosso cardápio completo aqui: ${SITE_URL} Como posso te ajudar hoje?`
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`
  }
  const featuredItems = menuData?.categories?.flatMap(cat => 
    cat.items.slice(0, 2).map(item => ({ ...item, category: cat.name }))
  ).slice(0, 6) || []

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
          <div className="flex gap-2">
            <button
              onClick={() => navigateTo('location')}
              className="bg-secondary hover:bg-accent text-white px-4 py-2 rounded-full font-semibold transition-colors"
            >
              📍 Localização
            </button>
            <button
              onClick={() => navigateTo('cart')}
              className="relative bg-secondary hover:bg-accent text-white px-4 py-2 rounded-full font-semibold transition-colors"
            >
              🛒 Carrinho
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 text-center">
        <div className="relative rounded-3xl shadow-xl overflow-hidden mb-8 border-4 border-primary">
          <div 
            className="absolute inset-0 bg-cover bg-bottom scale-140"
            style={{ backgroundImage: `url(${heroImg})` }}
          ></div>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 p-12">
           
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
              <div className="w-16 h-16 mx-auto mb-2 rounded-lg overflow-hidden bg-gray-100">
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentElement.innerHTML = `<span class="text-3xl flex items-center justify-center h-full">${category.icon || '🧃'}</span>`
                    }}
                  />
                ) : (
                  <span className="text-3xl flex items-center justify-center h-full">
                    {category.icon || '🧃'}
                  </span>
                )}
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
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-2">
            <a
              href="/location"
              className="font-rounded hover:text-orange-200 transition-colors"
            >
              📍 Rua José Cabral da Silva, 107, Centro, Boqueirão - PB
            </a>
            <span className="hidden md:inline">|</span>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-rounded hover:text-orange-200 transition-colors"
            >
              📱 Peça pelo WhatsApp
            </a>
          </div>
          <p className="text-sm opacity-80">
            © 2024 Point da Massa - Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home