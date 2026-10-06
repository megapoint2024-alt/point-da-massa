import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Home from './components/Home'
import Menu from './components/Menu'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Location from './components/Location'
import AdminLogin from './components/admin/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'
import './index.css'

function AppContent() {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [menuData, setMenuData] = useState(null)
  const [adminUser, setAdminUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMenuData()
    checkAdminSession()
  }, [])

  const loadMenuData = async () => {
    try {
      const { data: categories } = await supabase
        .from('categorias')
        .select('*')
        .order('nome')

      const { data: items } = await supabase
        .from('itens_cardapio')
        .select('*')
        .eq('disponivel', true)
        .order('nome')

      if (categories && items) {
        const formattedMenu = {
          categories: categories.map(cat => ({
            id: cat.id_categoria,
            name: cat.nome,
            icon: cat.icone || '🧃',
            imageUrl: cat.imagem_url,
            weekendOnly: cat.fim_de_semana,
            hasSizes: cat.tem_tamanhos,
            sizes: cat.tamanhos,
            basePrice: cat.preco_base,
            items: items
              .filter(item => item.categoria_id === cat.id)
              .map(item => ({
                id: item.id,
                name: item.nome,
                description: item.descricao,
                price: parseFloat(item.preco),
                image: item.imagem,
                special: item.especial
              }))
          }))
        }
        setMenuData(formattedMenu)
      }
    } catch (error) {
      console.error('Erro ao carregar cardápio:', error)
      // Fallback para dados JSON em caso de erro
      import('./data/menu.json').then(data => {
        setMenuData(data.default)
      })
    } finally {
      setLoading(false)
    }
  }

  const checkAdminSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      setAdminUser(session.user)
    }
  }

  const addToCart = (item, size = null, observation = '', quantity = 1) => {
    const cartItem = {
      ...item,
      cartId: Date.now(),
      size: size,
      observation: observation,
      quantity: quantity,
      finalPrice: size ? (item.price * size.multiplier * quantity) : (item.price * quantity)
    }
    setCart([...cart, cartItem])
  }

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId))
  }

  const clearCart = () => {
    setCart([])
  }

  const navigateTo = (page, category = null) => {
    if (category) setSelectedCategory(category)
    const path = page === 'home' ? '/' : `/${page}`
    navigate(path)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm to-orange-50 flex items-center justify-center">
        <div className="text-2xl text-primary font-semibold">Carregando cardápio...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm to-orange-50">
      <Routes>
        <Route 
          path="/" 
          element={<Home navigateTo={navigateTo} menuData={menuData} />} 
        />
        <Route 
          path="/menu" 
          element={
            <Menu 
              navigateTo={navigateTo} 
              menuData={menuData} 
              addToCart={addToCart}
              selectedCategory={selectedCategory}
            />
          } 
        />
        <Route 
          path="/cart" 
          element={
            <Cart 
              navigateTo={navigateTo} 
              cart={cart} 
              removeFromCart={removeFromCart}
            />
          } 
        />
        <Route
          path="/checkout"
          element={
            <Checkout
              navigateTo={navigateTo}
              cart={cart}
              clearCart={clearCart}
            />
          }
        />
        <Route
          path="/location"
          element={
            <Location
              navigateTo={navigateTo}
            />
          }
        />
        <Route 
          path="/admin" 
          element={
            adminUser ? (
              <AdminDashboard 
                user={adminUser} 
                onLogout={() => {
                  setAdminUser(null)
                  navigate('/')
                }}
                onRefresh={loadMenuData}
              />
            ) : (
              <AdminLogin 
                onLogin={(user) => {
                  setAdminUser(user)
                  navigate('/admin')
                }}
              />
            )
          } 
        />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
