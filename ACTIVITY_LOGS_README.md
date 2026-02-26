# Activity Logs - Logs de Atividade para Admin

## Visão Geral

A seção de **Activity Logs** é uma funcionalidade completa de auditoria e segurança para administradores da plataforma. Ela fornece uma timeline detalhada de todas as ações realizadas na plataforma, com filtros avançados, alertas de segurança e capacidade de exportação.

## Localização

- **Arquivo**: `C:\Users\dinnh\Desktop\plataforma\src\pages\ActivityLogs.jsx`
- **Rota**: `/activity-logs` (integrado no MainLayout)
- **Acesso**: Através da página Admin, clicando no botão "Logs de Atividade"

## Funcionalidades Principais

### 1. Timeline de Atividades

Exibe todas as ações realizadas na plataforma em ordem cronológica reversa (mais recentes primeiro):

- **Timestamp**: Data e hora da ação
- **Usuário**: Nome e email do usuário que executou a ação
- **Ação**: Tipo de ação executada (login, logout, criação de conta, etc.)
- **Severidade**: Classificação da ação (Sucesso, Info, Aviso, Erro)
- **IP**: Endereço IP de origem
- **Dispositivo**: Navegador e sistema operacional
- **Detalhes**: Descrição detalhada da ação

### 2. Filtros Avançados

#### Busca por Texto
- Buscar por nome de usuário
- Buscar por email
- Buscar por endereço IP
- Buscar por tipo de ação
- Buscar em detalhes da ação

#### Filtro por Tipo de Ação
- **Todas**: Exibe todas as ações
- **Login**: Logins bem-sucedidos
- **Logout**: Saídas do sistema
- **Criação de Conta**: Novos usuários
- **Edição de Perfil**: Alterações em dados de perfil
- **Exclusão**: Remoções de contas
- **Troca de Plano**: Mudanças de assinatura
- **Troca de Senha**: Alterações de senha
- **API Call**: Chamadas à API
- **Login Falho**: Tentativas de login falhadas
- **Atividade Suspeita**: Ações potencialmente maliciosas

#### Filtro por Severidade
- **Sucesso** (verde): Ações completadas com êxito
- **Info** (azul): Ações informativas
- **Aviso** (amarelo): Ações que requerem atenção
- **Erro** (vermelho): Ações com falha ou suspeitas

#### Filtro por Data
- **Data Início**: Filtrar logs a partir de uma data específica
- **Data Fim**: Filtrar logs até uma data específica

### 3. Alertas de Atividades Suspeitas

Card destacado no topo da página que exibe:
- Número de atividades suspeitas detectadas
- Lista das 5 atividades mais recentes classificadas como "Erro"
- Detalhes da ação suspeita
- Timestamp e IP de origem

### 4. Exportação de Logs

#### Formato CSV
Exporta logs filtrados em formato CSV com as colunas:
- Timestamp
- Usuário
- Email
- Ação
- Severidade
- IP
- Dispositivo
- Detalhes

#### Formato JSON
Exporta logs filtrados em formato JSON completo para integração com outras ferramentas.

### 5. Estatísticas Resumidas

Cards de métricas no rodapé da página:
- **Sucessos**: Total de ações bem-sucedidas (verde)
- **Informações**: Total de ações informativas (azul)
- **Avisos**: Total de ações com aviso (amarelo)
- **Erros**: Total de erros ou atividades suspeitas (vermelho)

### 6. Paginação

A tabela inclui paginação automática:
- 20 registros por página (configurável)
- Navegação entre páginas
- Indicador de total de registros encontrados

## Tipos de Ação Registrados

### Ações de Autenticação
- **Login**: Login bem-sucedido
- **Logout**: Saída do sistema
- **Login Falho**: Tentativa de login sem sucesso

### Ações de Usuário
- **Criação de Conta**: Novo usuário registrado
- **Edição de Perfil**: Alteração de dados pessoais
- **Exclusão de Conta**: Remoção de usuário do sistema
- **Troca de Senha**: Alteração de credenciais

### Ações de Assinatura
- **Troca de Plano**: Mudança de nível de assinatura

### Ações de API
- **API Call**: Chamadas realizadas à API da plataforma

### Ações de Segurança
- **Atividade Suspeita**: Comportamentos anormais detectados

## Sistema de Cores

O sistema utiliza cores para facilitar a identificação visual:

### Severidade
- **Verde**: Sucesso - Ações completadas com êxito
- **Azul**: Info - Ações informativas normais
- **Amarelo**: Aviso - Ações que requerem atenção
- **Vermelho**: Erro - Falhas ou atividades suspeitas

### Ícones
Cada tipo de ação possui um ícone específico:
- 🔑 Login (FaSignInAlt)
- 🚪 Logout (FaSignOutAlt)
- ➕ Criação de Conta (FaUserPlus)
- ✏️ Edição de Perfil (FaEdit)
- 🗑️ Exclusão (FaTrash)
- 💳 Troca de Plano (FaCreditCard)
- 🔐 Troca de Senha (FaKey)
- 💾 API Call (FaDatabase)
- ⚠️ Erro/Suspeito (FaExclamationTriangle)

## Mock Data

O componente inclui **150 logs mock** realistas que simulam:
- 5 usuários diferentes
- 10 tipos de ação
- Últimos 30 dias de atividade
- 6 endereços IP diferentes
- 6 tipos de dispositivos/navegadores

## Integração

### Acesso via Admin
Na página Admin (`/admin`), há um botão "Logs de Atividade" no header que navega para esta seção.

### Roteamento
A rota `activity-logs` está registrada no `MainLayout.jsx`:

```javascript
case 'activity-logs':
  return <ActivityLogs onNavigate={handleNavigate} />;
```

### Permissões
Apenas usuários com `role === 'admin'` podem acessar esta seção. Usuários não autorizados são redirecionados para `/unauthorized`.

## Uso

### Navegação
1. Faça login como administrador
2. Acesse a página "Admin"
3. Clique em "Logs de Atividade" no header
4. Ou navegue diretamente via sidebar (se configurado)

### Filtrar Logs
1. Use a barra de busca para procurar por texto
2. Selecione um tipo de ação no dropdown
3. Selecione uma severidade no dropdown
4. Defina datas de início e fim
5. Clique em "Limpar Filtros" para resetar

### Exportar Dados
1. Aplique os filtros desejados
2. Clique em "Exportar CSV" para formato CSV
3. Ou clique em "Exportar JSON" para formato JSON
4. O arquivo será baixado automaticamente

## Componentes Utilizados

### UI Components (shadcn/ui)
- `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription`
- `Badge`
- `Button`
- `Input`
- `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`

### Custom Components
- `PageHeader`: Header com breadcrumbs e ações
- `DataTable`: Tabela com ordenação e paginação

### Hooks
- `useAuth`: Autenticação e verificação de permissões
- `useNotification`: Notificações toast
- `useState`, `useEffect`: Gerenciamento de estado

## Próximas Melhorias

### Backend Integration
Substituir mock data por chamadas reais à API:

```javascript
const response = await fetch('http://localhost:3001/api/admin/activity-logs', {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

### Notificações em Tempo Real
Implementar WebSocket para alertas de atividades suspeitas em tempo real.

### Análise de Padrões
Adicionar gráficos de tendências:
- Logins por hora do dia
- Ações por usuário
- Distribuição geográfica (por IP)

### Ações Administrativas
Permitir que admins tomem ações diretas:
- Bloquear IP suspeito
- Suspender usuário
- Resetar senha
- Enviar notificação de segurança

## Acessibilidade

O componente segue as diretrizes WCAG 2.1 AA:
- Labels em todos os inputs
- Aria-labels descritivos
- Navegação por teclado
- Contraste adequado de cores
- Texto alternativo em ícones

## Performance

### Otimizações Implementadas
- Filtros aplicados no lado do cliente (para mock data)
- Lazy loading de dados
- Paginação para limitar DOM
- Memoização de cálculos pesados

### Otimizações Futuras
- Infinite scroll
- Virtualização de lista para grandes volumes
- Cache de filtros no localStorage
- Debounce na busca por texto

## Segurança

### Controle de Acesso
- Verificação de role admin
- Redirecionamento automático para unauthorized
- Tokens JWT para chamadas API

### Dados Sensíveis
- IPs são registrados mas não divulgados publicamente
- Senhas nunca são logadas
- Detalhes de API calls não incluem payloads sensíveis

## Troubleshooting

### Logs não aparecem
- Verifique se você está logado como admin
- Verifique se os filtros não estão muito restritivos
- Limpe os filtros e tente novamente

### Exportação não funciona
- Verifique se há logs filtrados para exportar
- Verifique permissões de download no navegador
- Tente em modo anônimo para descartar extensões

### Performance lenta
- Reduza o range de datas
- Use filtros mais específicos
- Limpe cache do navegador

## Contato

Para dúvidas ou sugestões sobre esta funcionalidade:
- Email: suporte@plataforma.com
- Documentação: /help-center

---

**Última atualização**: 2026-02-24
**Versão**: 1.0.0
**Autor**: Synkra AIOS Development Team
