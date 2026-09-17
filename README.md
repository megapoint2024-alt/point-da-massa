# Point da Massa - Cardápio Digital

Site de cardápio digital e pedidos para a lanchonete "Point da Massa", localizada em Boqueirão, Paraíba.

## 🚀 Tecnologias Utilizadas

- **React + Vite** - Framework JavaScript moderno e rápido
- **TailwindCSS** - Framework CSS para estilização
- **React Router** - Navegação entre páginas
- **Supabase** - Backend como serviço (banco de dados e autenticação)
- **Mobile-First** - Design responsivo focado em dispositivos móveis

## 🎨 Identidade Visual

- **Cores quentes**: Vermelho (#DC2626), Laranja (#EA580C), Terracota (#C2410C)
- **Tipografia**: Nunito (fonte arredondada e amigável)
- **Logo**: Formato de selo/carimbo circular

## 📱 Funcionalidades

### Páginas
- **Home**: Destaques do cardápio com botão para ver cardápio completo
- **Cardápio**: Abas por categoria com todos os itens (carregado do Supabase)
- **Carrinho**: Gerenciamento de itens selecionados
- **Finalizar Pedido**: Formulário completo com opções de entrega e pagamento (salva clientes no Supabase)
- **Painel Admin** (`/admin`): Gerenciamento do cardápio e visualização de clientes

### Categorias do Cardápio
- Pastéis Fritos (tradicionais e especiais)
- Pastéis de Forno
- Pizzas (4 tamanhos: brotinho, pequena, média, grande)
- Esfihas (mesmos sabores das pizzas)
- Hambúrgueres (tradicionais e especiais)
- Cardápio de Fim de Semana (sábados e domingos)
- Bebidas/Açaí/Sorvetes

### Funcionalidades Especiais
- **Cardápio de fim de semana**: Itens disponíveis apenas sábados e domingos
- **Seleção de tamanho**: Para pizzas e esfihas
- **Observações**: Campo para observações em cada item
- **Opções de entrega**: Retirada no local ou Delivery
- **Formas de pagamento**: PIX (com QR Code) e Cartão na entrega/retirada
- **Integração WhatsApp**: Pedido formatado enviado automaticamente

## 📝 Configuração

### Supabase (Backend)

Este projeto utiliza Supabase como backend. Siga as instruções em `SUPABASE-SETUP.md` para configurar:

1. Crie um projeto em https://supabase.com
2. Configure as variáveis de ambiente no arquivo `.env`
3. Execute o script SQL `supabase-setup.sql` no SQL Editor do Supabase
4. Execute `node scripts/migrate-menu.js` para migrar os dados do cardápio

### Número do WhatsApp

O número do WhatsApp já está configurado para a lanchonete:
- **Número**: (83) 99137-7547
- **Formato internacional**: 5583991377547

Para alterar, edite o arquivo `src/components/Checkout.jsx` (linha ~75):

```javascript
const whatsappNumber = '5583991377547' // Número da lanchonete Point da Massa
```

### Chave PIX

A chave PIX já está configurada e gera o payload BR Code corretamente:
- **Chave PIX**: 83991377547
- **Nome do beneficiário**: POINT DA MASSA
- **Cidade**: BOQUEIRAO

O sistema calcula automaticamente o CRC16 e gera o código PIX completo conforme as especificações do Banco Central.

## 🛠️ Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

## 📁 Estrutura do Projeto

```
PointDaMassa/
├── src/
│   ├── components/
│   │   ├── Home.jsx              # Página inicial
│   │   ├── Menu.jsx              # Cardápio com categorias
│   │   ├── Cart.jsx              # Carrinho de compras
│   │   ├── Checkout.jsx          # Finalização do pedido
│   │   └── admin/
│   │       ├── AdminLogin.jsx     # Login do painel admin
│   │       └── AdminDashboard.jsx # Dashboard do admin
│   ├── data/
│   │   └── menu.json             # Dados do cardápio (backup)
│   ├── lib/
│   │   └── supabase.js           # Cliente Supabase
│   ├── App.jsx                   # Componente principal
│   └── index.css                 # Estilos globais
├── scripts/
│   └── migrate-menu.js           # Script de migração para Supabase
├── supabase-setup.sql            # Script SQL para criar tabelas
├── .env                          # Variáveis de ambiente
├── tailwind.config.js            # Configuração do TailwindCSS
├── postcss.config.js             # Configuração do PostCSS
└── package.json                  # Dependências do projeto
```

## 🍽️ Personalização do Cardápio

O cardápio é configurado através do arquivo `src/data/menu.json`. Você pode:

- Adicionar/remover categorias
- Modificar preços e descrições
- Adicionar novos itens
- Alterar imagens (emojis)
- Configurar itens especiais

### Estrutura de um Item

```json
{
  "id": "pf-queijo",
  "name": "Pastel de Queijo",
  "description": "Pastel frito crocante recheado com queijo",
  "price": 8.00,
  "image": "🥟",
  "special": true  // Opcional: marca como item especial
}
```

## 🎯 Próximas Melhorias

- [ ] Sistema de autenticação para pedidos recorrentes
- [ ] Histórico de pedidos
- [ ] Avaliação de itens
- [ ] Cupons de desconto
- [ ] Notificações de status do pedido
- [ ] Integração com sistema de pagamento real

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato através do WhatsApp da lanchonete.

---

© 2024 Point da Massa - Boqueirão, Paraíba