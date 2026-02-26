# Admin Analytics - Documentação

## Visão Geral

A seção de Analytics do painel administrativo fornece visualizações detalhadas e métricas sobre o desempenho da plataforma, incluindo receita, crescimento de usuários, conversões e engajamento.

## Localização

**Caminho:** Admin > Analytics (aba)
**Arquivo:** `src/pages/AdminAnalytics.jsx`
**Permissões:** Apenas administradores (role: 'admin')

## Recursos Principais

### 1. KPIs Principais

Quatro cartões de métricas principais exibidos no topo:

- **MRR (Monthly Recurring Revenue)**
  - Receita mensal recorrente
  - Tendência vs. mês anterior
  - Formato: R$ valor

- **ARR (Annual Recurring Revenue)**
  - Receita anual recorrente
  - Calculado como MRR × 12
  - Formato: R$ valor

- **Usuários Ativos**
  - Total de usuários ativos no período
  - Quantidade de novos usuários
  - Tendência percentual

- **Taxa de Conversão**
  - Conversão de Trial para Pago
  - Formato: percentual

### 2. Gráficos de Crescimento

#### Crescimento de Usuários
- **Tipo:** Gráfico de Área (AreaChart)
- **Dados:** Evolução de usuários nos últimos N dias
- **Eixo X:** Datas
- **Eixo Y:** Número de usuários
- **Cor:** Purple gradient (#a855f7)

#### Crescimento de Receita
- **Tipo:** Gráfico de Linha (LineChart)
- **Dados:** MRR ao longo do tempo
- **Eixo X:** Datas
- **Eixo Y:** Receita (R$)
- **Cor:** Verde (#10b981)

### 3. Distribuição de Planos

- **Tipo:** Gráfico de Pizza (PieChart)
- **Planos:**
  - Free (cinza)
  - Basic (azul)
  - Pro (roxo)
  - Enterprise (âmbar)
- **Dados:** Número de usuários por plano
- **Formato:** Nome: X% do total

### 4. Integrações Mais Usadas

- **Tipo:** Gráfico de Barras Horizontal
- **Plataformas:**
  - Kiwify (verde)
  - Hotmart (âmbar)
  - Stripe (índigo)
  - PayPal (azul)
  - Mercado Pago (teal)
- **Métrica:** Número de usuários conectados

### 5. Canais Mais Populares

- **Tipo:** Gráfico de Barras Duplo
- **Canais:**
  - WhatsApp
  - Instagram
  - Email
  - Telegram
  - Facebook
- **Métricas:**
  - Número de usuários (roxo)
  - Taxa de engajamento % (verde)

### 6. Uso de Features por Plano

- **Tipo:** Gráfico de Barras Empilhadas
- **Features:**
  - CRM
  - Automações
  - Integrações
  - Relatórios
  - IA Assistant
- **Segmentação:** Percentual de uso por plano (Free, Basic, Pro, Enterprise)

### 7. Funil de Conversão

- **Tipo:** Barras de Progresso
- **Estágios:**
  1. Visitantes (100%)
  2. Cadastros (45%)
  3. Trial (28%)
  4. Pagantes (9.8%)
- **Visual:** Barras horizontais com largura proporcional à taxa de conversão

### 8. Métricas de Engajamento

Três cartões coloridos com métricas de atividade:

- **Tempo Médio de Sessão**
  - Em minutos
  - Card roxo

- **Features Utilizadas**
  - Média de features por usuário
  - Card azul

- **Taxa de Atividade**
  - Percentual de usuários ativos
  - Card verde

## Filtros e Controles

### Período de Tempo

Seletor de período disponível:
- Últimos 7 dias
- Últimos 30 dias
- Últimos 90 dias
- Último ano

### Botão Atualizar

Permite recarregar os dados manualmente.

## Navegação

### Breadcrumbs
```
Dashboard > Admin > Analytics
```

### Abas
- **Usuários:** Gerenciamento de usuários
- **Analytics:** Visualizações e métricas (aba atual)

## Tecnologias Utilizadas

### Biblioteca de Gráficos
- **Recharts** (v3.7.0)
  - AreaChart
  - LineChart
  - BarChart
  - PieChart
  - ResponsiveContainer
  - Tooltip customizado
  - Legend

### Componentes UI
- shadcn/ui Card
- shadcn/ui Badge
- shadcn/ui Select
- shadcn/ui Button
- React Icons

## Paleta de Cores

```javascript
const COLORS = {
  primary: '#a855f7',    // Purple
  secondary: '#8b5cf6',  // Purple light
  accent: '#f59e0b',     // Amber
  success: '#10b981',    // Green
  danger: '#ef4444',     // Red
  info: '#0ea5e9',       // Blue
};
```

## Dados Mock

Atualmente, a página utiliza dados mock para demonstração. Para integração com dados reais:

1. Substituir `mockUsers` e outros arrays por chamadas à API
2. Implementar endpoint `/api/analytics` no backend
3. Atualizar `loadAnalytics()` para fazer fetch dos dados
4. Adicionar tratamento de erros e loading states

### Estrutura da API Esperada

```typescript
GET /api/analytics?timeRange=30

Response:
{
  revenue: {
    mrr: number,
    arr: number,
    growth: number
  },
  users: {
    total: number,
    new: number,
    active: number,
    trial: number,
    paid: number
  },
  conversion: {
    rate: number,
    trialToPaid: number
  },
  engagement: {
    avgSessionTime: number,
    featuresUsed: number,
    activeRate: number
  },
  growthData: Array<{
    date: string,
    users: number,
    revenue: number
  }>,
  planDistribution: Array<{
    name: string,
    value: number
  }>,
  integrationStats: Array<{
    name: string,
    users: number
  }>,
  channelStats: Array<{
    name: string,
    users: number,
    engagement: number
  }>,
  featureUsage: Array<{
    feature: string,
    free: number,
    basic: number,
    pro: number,
    enterprise: number
  }>,
  conversionFunnel: Array<{
    stage: string,
    users: number,
    rate: number
  }>
}
```

## Responsividade

- **Desktop (lg+):** 2 colunas para gráficos
- **Tablet (md):** 1-2 colunas adaptativas
- **Mobile:** 1 coluna

## Acessibilidade

- Labels ARIA em todos os botões
- Navegação por teclado
- Tooltips informativos nos gráficos
- Alto contraste em modo escuro
- Breadcrumbs para contexto de navegação

## Testes

Arquivo: `src/tests/AdminAnalytics.test.jsx`

Cobertura:
- Renderização do componente
- Exibição de KPIs
- Presença de todos os gráficos
- Funcionalidade de filtros
- Navegação por breadcrumbs
- Botão de atualização

Execute:
```bash
npm test AdminAnalytics.test.jsx
```

## Próximos Passos

1. Integrar com API real de analytics
2. Adicionar exportação de dados (CSV, PDF)
3. Implementar gráficos interativos com drill-down
4. Adicionar comparação de períodos
5. Criar alertas para métricas críticas
6. Implementar cache de dados para performance
7. Adicionar filtros avançados (por plano, região, etc.)

## Manutenção

### Adicionar Novo Gráfico

1. Adicionar estado para os dados:
```javascript
const [newChartData, setNewChartData] = useState([]);
```

2. Criar Card com gráfico:
```jsx
<Card>
  <CardHeader>
    <CardTitle>Título do Gráfico</CardTitle>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={300}>
      {/* Seu gráfico aqui */}
    </ResponsiveContainer>
  </CardContent>
</Card>
```

3. Atualizar `loadAnalytics()` para carregar os novos dados

### Customizar Tooltip

```javascript
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded shadow">
        <p className="font-bold">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};
```

## Suporte

Para dúvidas ou problemas:
- Abra uma issue no repositório
- Contate o time de desenvolvimento
- Consulte a documentação do Recharts: https://recharts.org/

---

**Última atualização:** 2026-02-24
**Versão:** 1.0.0
**Autor:** Plataforma Dev Team
