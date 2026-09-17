# Point da Massa - Informações do Projeto

## 🚀 Comandos de Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview

# Migrar dados do menu.json para Supabase
node scripts/migrate-menu.js
```

## 🎨 Design System

### Cores
- Primary: #DC2626 (Vermelho)
- Secondary: #EA580C (Laranja)
- Accent: #C2410C (Terracota)
- Warm: #FEF3C7 (Amarelo claro)

### Tipografia
- Fonte principal: Nunito (Google Fonts)
- Estilo: Arredondada e amigável

### Componentes Visuais
- Logo circular em formato de selo/carimbo
- Botões arredondados com gradientes
- Cards com bordas arredondadas e sombras
- Ícones emoji para identificação visual dos itens

## 📱 Estrutura de Páginas

### Home (/)
- Destaques do cardápio
- Logo circular estilizado
- Botão para cardápio completo
- Preview de categorias

### Menu (/menu)
- Abas por categoria (scroll horizontal)
- Cards de itens com seleção
- Modal para personalização (tamanho, observações)
- Lógica de fim de semana para itens especiais

### Cart (/cart)
- Lista de itens selecionados
- Resumo do pedido
- Cálculo automático do total
- Botão para finalizar

### Checkout (/checkout)
- Formulário de dados do cliente
- Opção de entrega (Retirar/Delivery)
- Seleção de pagamento (PIX/Cartão)
- Geração de mensagem para WhatsApp

## 🔧 Configurações Importantes

### WhatsApp
Arquivo: `src/components/Checkout.jsx` (linha ~75)
```javascript
const whatsappNumber = '5583991377547' // Número da lanchonete Point da Massa
```
- **Número configurado**: (83) 99137-7547

### Chave PIX
Arquivo: `src/components/Checkout.jsx` (linha ~84)
```javascript
const pixKey = '83991377547'
```
- **Chave configurada**: 83991377547
- **Beneficiário**: POINT DA MASSA
- **Cidade**: BOQUEIRAO
- **CRC16**: Calculado automaticamente conforme especificações do BCB

### Supabase
Arquivo: `.env`
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
- **Status**: Configuração necessária
- **Documentação**: Ver `SUPABASE-SETUP.md` para instruções detalhadas
- **Script SQL**: `supabase-setup.sql` para criar tabelas
- **Migração**: `scripts/migrate-menu.js` para migrar dados

## 📊 Estrutura de Dados

### Cardápio (menu.json)
- Categorias com itens
- Suporte a tamanhos (pizzas, esfihas)
- Itens especiais com destaque visual
- Itens de fim de semana (lógica automática)

### Carrinho
- Itens com ID único
- Suporte a tamanho e observações
- Preço final calculado automaticamente

## 🎯 Funcionalidades Especiais

### Cardápio de Fim de Semana
- Verificação automática do dia da semana
- Bloqueio visual de itens não disponíveis
- Aviso informativo para usuários

### Tamanhos para Pizzas/Esfihas
- Brotinho (0.6x)
- Pequena (0.8x)
- Média (1.0x)
- Grande (1.3x)

### Integração WhatsApp
- Formatação automática do pedido
- Inclui todos os detalhes do cliente
- Resumo completo dos itens
- Opções de entrega e pagamento

## 🐛 Troubleshooting

### Erro de TailwindCSS
Se aparecer erro sobre PostCSS:
```bash
npm install -D @tailwindcss/postcss
```
E atualizar `postcss.config.js`:
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### Import CSS
Certifique-se que o `@import` de fontes vem antes das diretivas Tailwind no `index.css`.

## 📝 Próximas Melhorias Sugeridas

1. Sistema de autenticação
2. Histórico de pedidos
3. Avaliação de itens
4. Cupons de desconto
5. Notificações em tempo real
6. Integração com gateway de pagamento
7. Painel administrativo
8. Analytics de pedidos