import { useState } from 'react'
import { supabase } from '../lib/supabase'

function Checkout({ navigateTo, cart, clearCart }) {
  const [deliveryOption, setDeliveryOption] = useState('pickup')
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('pix')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.finalPrice, 0)
  }

  const formatItemName = (item) => {
    let name = `${item.quantity}x ${item.name}`
    if (item.size) {
      name += ` (${item.size.name})`
    }
    if (item.observation) {
      name += ` - Obs: ${item.observation}`
    }
    return name
  }

  const generateWhatsAppMessage = () => {
    // Arquivo salvo em UTF-8 para garantir que emojis sejam exibidos corretamente no WhatsApp
    const orderNumber = Math.floor(Math.random() * 10000)
    const timestamp = new Date().toLocaleString('pt-BR')
    
    let message = `🍽️ *NOVO PEDIDO - POINT DA MASSA*\n`
    message += `📅 ${timestamp}\n`
    message += `🔢 Pedido #${orderNumber}\n\n`
    
    message += `👤 *Cliente:* ${customerName}\n`
    message += `📱 *Telefone:* ${customerPhone}\n\n`
    
    message += `📦 *ITENS DO PEDIDO:*\n`
    cart.forEach((item, index) => {
      message += `${index + 1}. ${formatItemName(item)} - R$ ${item.finalPrice.toFixed(2)}\n`
    })
    
    message += `\n💰 *TOTAL: R$ ${calculateTotal().toFixed(2)}*\n\n`
    
    message += `🚚 *ENTREGA:*\n`
    if (deliveryOption === 'pickup') {
      message += `✅ Retirada no local\n`
    } else {
      message += `✅ Delivery\n`
      message += `📍 Endereço: ${address}\n`
    }
    
    message += `\n💳 *PAGAMENTO:*\n`
    if (paymentMethod === 'pix') {
      message += `✅ PIX\n`
      message += `🔑 Chave PIX: 83991377547\n`
    } else {
      message += `✅ Cartão (na entrega/retirada)\n`
    }
    
    message += `\n🙏 Aguardando confirmação!`
    
    return encodeURIComponent(message)
  }

  const handleWhatsAppOrder = async () => {
    if (!customerName || !customerPhone) {
      alert('Por favor, preencha seu nome e telefone.')
      return
    }
    
    if (deliveryOption === 'delivery' && !address) {
      alert('Por favor, informe o endereço para entrega.')
      return
    }

    // Salvar/atualizar cliente no Supabase
    try {
      // Verificar se cliente já existe
      const { data: existingClient } = await supabase
        .from('clientes')
        .select('*')
        .eq('telefone', customerPhone)
        .single()

      const clientData = {
        nome: customerName,
        telefone: customerPhone,
        endereco: deliveryOption === 'delivery' ? address : null,
        total_pedidos: existingClient ? (existingClient.total_pedidos || 0) + 1 : 1,
        ultimo_pedido: new Date().toISOString()
      }

      if (existingClient) {
        // Atualizar cliente existente
        await supabase
          .from('clientes')
          .update(clientData)
          .eq('id', existingClient.id)
      } else {
        // Criar novo cliente
        await supabase
          .from('clientes')
          .insert(clientData)
      }

      // Salvar pedido
      const orderNumber = Math.floor(Math.random() * 10000)
      const { data: clientRecord } = await supabase
        .from('clientes')
        .select('id')
        .eq('telefone', customerPhone)
        .single()

      await supabase
        .from('pedidos')
        .insert({
          cliente_id: clientRecord?.id,
          numero_pedido: orderNumber,
          itens: cart.map(item => ({
            nome: item.name,
            quantidade: item.quantity || 1,
            tamanho: item.size?.name || null,
            observacao: item.observation || null,
            preco: item.finalPrice
          })),
          total: calculateTotal(),
          tipo_entrega: deliveryOption,
          endereco_entrega: deliveryOption === 'delivery' ? address : null,
          forma_pagamento: paymentMethod,
          status: 'pendente'
        })

    } catch (error) {
      console.error('Erro ao salvar cliente/pedido:', error)
      // Continuar mesmo se houver erro no salvamento
    }
    
    const message = generateWhatsAppMessage()
    const whatsappNumber = '5583991377547' // Número da lanchonete Point da Massa
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
    
    window.open(whatsappUrl, '_blank')
    clearCart()
    navigateTo('home')
  }

  const generatePixQRCode = () => {
    const pixKey = '83991377547'
    const merchantName = 'POINT DA MASSA'
    const merchantCity = 'BOQUEIRAO'
    const amount = calculateTotal().toFixed(2)
    
    // Função para calcular CRC16-CCITT (0xFFFF)
    const calculateCRC16 = (data) => {
      let crc = 0xFFFF
      for (let i = 0; i < data.length; i++) {
        crc ^= data.charCodeAt(i) << 8
        for (let j = 0; j < 8; j++) {
          if (crc & 0x8000) {
            crc = (crc << 1) ^ 0x1021
          } else {
            crc = crc << 1
          }
          crc &= 0xFFFF
        }
      }
      return crc.toString(16).toUpperCase().padStart(4, '0')
    }
    
    // Função para criar campo EMV
    const createEMVField = (id, content) => {
      const length = content.length.toString().padStart(2, '0')
      return id + length + content
    }
    
    // Payload Format Indicator (00)
    const payloadFormat = createEMVField('00', '01')
    
    // Merchant Account Information (26)
    const gui = createEMVField('00', 'br.gov.bcb.pix')
    const key = createEMVField('01', pixKey)
    const merchantAccountInfo = createEMVField('26', gui + key)
    
    // Merchant Category Code (52)
    const merchantCategoryCode = createEMVField('52', '0000')
    
    // Transaction Currency (53)
    const transactionCurrency = createEMVField('53', '986')
    
    // Transaction Amount (54)
    const transactionAmount = createEMVField('54', amount)
    
    // Country Code (58)
    const countryCode = createEMVField('58', 'BR')
    
    // Merchant Name (59)
    const merchantNameField = createEMVField('59', merchantName)
    
    // Merchant City (60)
    const merchantCityField = createEMVField('60', merchantCity)
    
    // Additional Data Field Template (62)
    const txid = createEMVField('05', '***')
    const additionalDataField = createEMVField('62', txid)
    
    // Montar o payload completo (sem CRC)
    const payloadWithoutCRC = (
      payloadFormat +
      merchantAccountInfo +
      merchantCategoryCode +
      transactionCurrency +
      transactionAmount +
      countryCode +
      merchantNameField +
      merchantCityField +
      additionalDataField
    )
    
    // Calcular CRC16
    const crc16 = calculateCRC16(payloadWithoutCRC)
    
    // Adicionar CRC16 (63)
    const crcField = createEMVField('63', crc16)
    
    // Payload final
    return '000201' + payloadWithoutCRC + crcField
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm to-orange-50">
      {/* Header */}
      <header className="bg-primary text-white py-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <button 
            onClick={() => navigateTo('cart')}
            className="flex items-center gap-2 hover:text-orange-200 transition-colors"
          >
            <span className="text-2xl">←</span>
            <span className="font-semibold">Voltar</span>
          </button>
          <h1 className="text-xl font-bold font-rounded">Finalizar Pedido</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Checkout Content */}
      <div className="container mx-auto px-4 py-6 pb-32">
        {/* Customer Information */}
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-orange-200 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 font-rounded">
            👤 Seus Dados
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Telefone/WhatsApp *
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                placeholder="(83) 99999-9999"
              />
            </div>
          </div>
        </div>

        {/* Delivery Option */}
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-orange-200 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 font-rounded">
            🚚 Opção de Entrega
          </h3>
          <div className="space-y-3">
            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary">
              <input
                type="radio"
                value="pickup"
                checked={deliveryOption === 'pickup'}
                onChange={(e) => setDeliveryOption(e.target.value)}
                className="mr-3"
              />
              <div>
                <div className="font-semibold text-gray-800">🏪 Retirar no Local</div>
                <div className="text-sm text-gray-600">Vá até nossa loja para retirar</div>
              </div>
            </label>
            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary">
              <input
                type="radio"
                value="delivery"
                checked={deliveryOption === 'delivery'}
                onChange={(e) => setDeliveryOption(e.target.value)}
                className="mr-3"
              />
              <div>
                <div className="font-semibold text-gray-800">🛵 Delivery</div>
                <div className="text-sm text-gray-600">Entregamos no seu endereço</div>
              </div>
            </label>
          </div>

          {deliveryOption === 'delivery' && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Endereço de Entrega *
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                rows="3"
                placeholder="Rua, número, bairro, complemento..."
              />
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-orange-200 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 font-rounded">
            💳 Forma de Pagamento
          </h3>
          <div className="space-y-3">
            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary">
              <input
                type="radio"
                value="pix"
                checked={paymentMethod === 'pix'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <div>
                <div className="font-semibold text-gray-800">📱 PIX</div>
                <div className="text-sm text-gray-600">Pagamento instantâneo</div>
              </div>
            </label>
            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary">
              <input
                type="radio"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <div>
                <div className="font-semibold text-gray-800">💳 Cartão</div>
                <div className="text-sm text-gray-600">Pagamento na entrega/retirada</div>
              </div>
            </label>
          </div>

          {paymentMethod === 'pix' && (
            <div className="mt-4 bg-green-50 p-4 rounded-lg text-center">
              <div className="text-sm font-semibold text-green-800 mb-2">
                QR Code PIX
              </div>
              <div className="bg-white p-4 rounded-lg inline-block border-2 border-green-200">
                <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-4xl">
                  📱
                </div>
              </div>
              <div className="text-xs text-green-700 mt-2">
                Chave PIX: 83991377547
              </div>
              <div className="text-xs text-green-600 mt-1">
                <button 
                  onClick={() => {
                    const pixCode = generatePixQRCode()
                    navigator.clipboard.writeText(pixCode)
                    alert('Código PIX copiado para a área de transferência!')
                  }}
                  className="text-green-700 underline hover:text-green-800"
                >
                  Copiar código PIX
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-primary mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 font-rounded">
            📋 Resumo do Pedido
          </h3>
          <div className="space-y-2 mb-4">
            {cart.map((item, index) => (
              <div key={item.cartId} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {index + 1}. {formatItemName(item)}
                </span>
                <span className="font-semibold">R$ {item.finalPrice.toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t-2 border-orange-200 pt-2 mt-2">
              <div className="flex justify-between text-xl font-bold text-primary">
                <span>Total</span>
                <span>R$ {calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Send Order Button */}
        <button
          onClick={handleWhatsAppOrder}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-full font-bold text-xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <span className="text-2xl">📱</span>
          Enviar Pedido pelo WhatsApp
        </button>
      </div>
    </div>
  )
}

export default Checkout