# ✅ Checklist de Testes Completos - Plataforma

## 📋 **Funcionalidades Críticas (P0)**

### 1. **Integrações - Kiwify e Hotmart**
- [ ] Acessar página de Integrações
- [ ] Verificar se Kiwify aparece na lista
- [ ] Verificar se Hotmart aparece na lista
- [ ] Clicar em "Conectar" no Kiwify
- [ ] Preencher credenciais e conectar
- [ ] Verificar validação de credenciais inválidas
- [ ] Desconectar integração

### 2. **Inbox - Enviar para CRM**
- [ ] Abrir Inbox e selecionar um contato
- [ ] Clicar nos 3 pontinhos (⋮) no header
- [ ] Verificar opção "Enviar para CRM"
- [ ] Selecionar Pipeline
- [ ] Selecionar Stage
- [ ] Verificar se contato foi adicionado ao CRM
- [ ] Ir ao CRM e confirmar card criado

### 3. **Inbox - Anexos**
- [ ] Verificar mensagem com imagem (preview)
- [ ] Clicar na imagem para ampliar (modal)
- [ ] Verificar mensagem com áudio
- [ ] Clicar em play no player de áudio
- [ ] Verificar controles (pause/play)
- [ ] Verificar mensagem com documento PDF
- [ ] Clicar para download do documento
- [ ] Anexar nova imagem via botão de clipe
- [ ] Anexar novo documento
- [ ] Anexar novo vídeo

### 4. **Contacts - CSV Import/Export**
- [ ] Abrir página de Contatos
- [ ] Clicar em "Exportar CSV"
- [ ] Verificar arquivo baixado
- [ ] Abrir arquivo e verificar dados
- [ ] Criar arquivo CSV de teste
- [ ] Clicar em "Importar CSV"
- [ ] Selecionar arquivo
- [ ] Verificar contatos importados na tabela
- [ ] Verificar notificação toast de sucesso

### 5. **CRM - Persistência**
- [ ] Abrir página de CRM
- [ ] Criar nova pipeline
- [ ] Adicionar novo card/lead
- [ ] Recarregar página (F5)
- [ ] Verificar se pipeline permanece
- [ ] Verificar se cards permanecem
- [ ] Arrastar card entre stages
- [ ] Recarregar e verificar persistência

### 6. **Integrações - Validação de Credenciais**
- [ ] Tentar conectar Kiwify com API Key inválida
- [ ] Verificar mensagem de erro
- [ ] Ver loading spinner durante validação
- [ ] Conectar com credenciais válidas
- [ ] Verificar toast de sucesso

### 7. **Sistema de Toast Global**
- [ ] Realizar ação que gera toast de sucesso
- [ ] Verificar toast verde aparece
- [ ] Verificar auto-dismiss após 4 segundos
- [ ] Realizar ação que gera toast de erro
- [ ] Verificar toast vermelho
- [ ] Realizar ação que gera toast de warning
- [ ] Verificar toast amarelo
- [ ] Verificar múltiplos toasts simultâneos

---

## 🎨 **Componentes UX (P1)**

### 8. **LoadingSpinner**
- [ ] Verificar spinner em validação de credenciais
- [ ] Verificar tamanhos (sm, md, lg)
- [ ] Verificar cores (purple, white, gray)
- [ ] Verificar animação de rotação suave

### 9. **SkeletonLoader**
- [ ] Testar variant="text"
- [ ] Testar variant="card"
- [ ] Testar variant="avatar"
- [ ] Testar variant="table"
- [ ] Verificar animação de pulso

### 10. **Tooltip**
- [ ] Hover sobre botão com tooltip
- [ ] Verificar aparecer tooltip
- [ ] Verificar posições (top, bottom, left, right)
- [ ] Verificar desaparecer ao remover hover
- [ ] Testar com teclado (focus/blur)

### 11. **EmptyState**
- [ ] Ir para página sem dados
- [ ] Verificar ícone apropriado
- [ ] Verificar mensagem descritiva
- [ ] Verificar botão de ação (se houver)

### 12. **Badge**
- [ ] Verificar badges de tags
- [ ] Verificar cores (primary, success, warning, danger, info, gray)
- [ ] Verificar tamanhos (sm, md, lg)
- [ ] Verificar badge com dot

---

## 🌗 **Tema e Acessibilidade**

### 13. **Dark Mode**
- [ ] Alternar para dark mode
- [ ] Verificar todas as páginas (Dashboard, Inbox, CRM, Contacts, etc)
- [ ] Verificar contraste adequado
- [ ] Verificar ícones visíveis
- [ ] Alternar para light mode
- [ ] Verificar todas as páginas novamente

### 14. **Responsividade**
- [ ] Testar em mobile (375px)
- [ ] Testar em tablet (768px)
- [ ] Testar em desktop (1920px)
- [ ] Verificar menu responsivo
- [ ] Verificar tabelas responsivas
- [ ] Verificar modais responsivos

### 15. **Acessibilidade (WCAG 2.1 AA)**
- [ ] Navegar com Tab entre elementos
- [ ] Testar leitores de tela (ARIA labels)
- [ ] Verificar skip links
- [ ] Fechar modais com ESC
- [ ] Verificar contraste de cores
- [ ] Verificar foco visível

---

## 📊 **Páginas Principais**

### 16. **Dashboard**
- [ ] Verificar métricas exibidas
- [ ] Verificar gráficos renderizados
- [ ] Verificar cards clicáveis
- [ ] Verificar navegação para outras páginas

### 17. **Inbox**
- [ ] Listar conversas
- [ ] Selecionar conversa
- [ ] Enviar mensagem
- [ ] Gravar áudio
- [ ] Anexar arquivo
- [ ] Filtrar conversas
- [ ] Buscar conversas
- [ ] Atribuir conversa

### 18. **CRM**
- [ ] Criar pipeline
- [ ] Adicionar stage
- [ ] Criar lead/card
- [ ] Drag and drop entre stages
- [ ] Editar lead
- [ ] Deletar lead
- [ ] Filtrar leads
- [ ] Buscar leads

### 19. **Contacts**
- [ ] Listar contatos
- [ ] Adicionar contato
- [ ] Editar contato
- [ ] Deletar contato
- [ ] Importar CSV
- [ ] Exportar CSV
- [ ] Filtrar contatos
- [ ] Buscar contatos

### 20. **Integrações**
- [ ] Listar integrações disponíveis
- [ ] Conectar integração
- [ ] Ver status (conectado/desconectado)
- [ ] Desconectar integração
- [ ] Ver instruções de configuração

### 21. **Team**
- [ ] Listar membros
- [ ] Adicionar membro
- [ ] Editar permissões
- [ ] Remover membro
- [ ] Filtrar por setor

### 22. **Companies**
- [ ] Listar empresas
- [ ] Criar empresa
- [ ] Editar empresa
- [ ] Deletar empresa
- [ ] Acessar empresa
- [ ] Ver "Já conectado" na empresa atual

### 23. **IA**
- [ ] Acessar assistente IA
- [ ] Enviar mensagem
- [ ] Receber resposta
- [ ] Ver histórico

### 24. **Knowledge Base**
- [ ] Listar artigos
- [ ] Criar artigo
- [ ] Editar artigo
- [ ] Deletar artigo
- [ ] Buscar artigos

### 25. **Perfil**
- [ ] Editar informações pessoais
- [ ] Alterar foto
- [ ] Alterar senha
- [ ] Salvar alterações

---

## 🔧 **Performance e Build**

### 26. **Build Production**
- [ ] Executar `npm run build`
- [ ] Verificar sem erros
- [ ] Verificar tamanho dos bundles
- [ ] Testar versão de produção

### 27. **Performance**
- [ ] Verificar carregamento rápido (<3s)
- [ ] Verificar transições suaves
- [ ] Verificar sem memory leaks
- [ ] Verificar lazy loading de imagens

---

## 📝 **Resumo Final**

**Total de Testes:** ~150 checklist items

**Status:**
- ⏳ Em andamento
- ✅ Completo quando todos os itens marcados

**Próximos Passos:**
1. Executar todos os testes manualmente
2. Documentar bugs encontrados
3. Corrigir bugs críticos
4. Re-testar funcionalidades corrigidas
5. Deploy para produção

---

**Última atualização:** 2026-02-24
**Responsável:** Claude Code + Henrique
