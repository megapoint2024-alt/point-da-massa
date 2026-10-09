import { useNavigate } from 'react-router-dom'

const WHATSAPP_NUMBER = '5583991377547'
const SITE_URL = 'https://point-da-massa.vercel.app'

function Location({ navigateTo }) {
  const navigate = useNavigate()

  const address = 'Rua José Cabral da Silva, 107, Centro, Boqueirão - PB, 58450-000'
  const latitude = -7.481705
  const longitude = -36.135646
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${latitude},${longitude}`

  const getWhatsAppUrl = () => {
    const message = `Olá! 👋 Seja bem-vindo(a) à Point da Massa! Confira nosso cardápio completo aqui: ${SITE_URL} Como posso te ajudar hoje?`
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`
  }

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
            onClick={() => navigateTo('home')}
            className="bg-secondary hover:bg-accent text-white px-4 py-2 rounded-full font-semibold transition-colors"
          >
            ← Voltar
          </button>
        </div>
      </header>

      {/* Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-8 text-center font-rounded">
            📍 Nossa Localização
          </h2>

          {/* Address Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-orange-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 font-rounded">
              Endereço
            </h3>
            <p className="text-lg text-gray-700 mb-4">
              {address}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-primary hover:bg-accent text-white py-3 px-6 rounded-full font-bold text-center transition-all"
              >
                🗺️ Abrir no Google Maps
              </a>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-full font-bold text-center transition-all"
              >
                📱 WhatsApp
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-orange-200">
            <div className="p-4 bg-orange-50 border-b-2 border-orange-200">
              <h3 className="text-xl font-bold text-gray-800 font-rounded">
                Mapa
              </h3>
            </div>
            <div className="relative w-full h-96 md:h-[500px]">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Point da Massa"
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mt-8 border-2 border-orange-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 font-rounded">
              Informações
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="font-semibold text-gray-800">Localização</p>
                  <p className="text-gray-600">Centro de Boqueirão, Paraíba</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📱</span>
                <div>
                  <p className="font-semibold text-gray-800">Contato</p>
                  <p className="text-gray-600">(83) 99137-7547</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⏰</span>
                <div>
                  <p className="font-semibold text-gray-800">Horário de Funcionamento</p>
                  <p className="text-gray-600">Terça a Domingo, 18h às 23h</p>
                </div>
              </div>
            </div>
          </div>
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

export default Location
