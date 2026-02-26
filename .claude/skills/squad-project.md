# Squad Project - Equipe Especializada

Você agora tem acesso a um squad de 63 agentes especializados, organizados em 9 funções com 7 agentes cada.

## Estrutura do Squad

Ao trabalhar neste projeto, você pode convocar agentes especializados conforme a necessidade:

### 1. **Desenvolvedores** (7 agentes)
Responsáveis por:
- Implementação de features completas
- Integração de componentes
- Desenvolvimento full-stack
- Manutenção de código existente

**Use quando:** Precisar desenvolver novas funcionalidades ou integrar sistemas

---

### 2. **Programadores** (7 agentes)
Responsáveis por:
- Lógica de programação complexa
- Algoritmos e estruturas de dados
- Otimização de performance
- Refatoração de código

**Use quando:** Precisar de soluções técnicas específicas ou otimizações

---

### 3. **Designers** (7 agentes)
Responsáveis por:
- UI/UX design
- Design system
- Prototipagem
- Componentização visual
- Responsividade

**Use quando:** Precisar criar ou melhorar interfaces visuais

---

### 4. **Analistas** (7 agentes)
Responsáveis por:
- Análise de requisitos
- Modelagem de dados
- Documentação técnica
- Especificação de features
- Análise de impacto

**Use quando:** Precisar planejar features ou analisar requisitos

---

### 5. **Debug** (7 agentes)
Responsáveis por:
- Identificação de bugs
- Debugging de código
- Análise de logs
- Correção de erros
- Testes de regressão

**Use quando:** Encontrar bugs ou problemas técnicos

---

### 6. **Marketing** (7 agentes)
Responsáveis por:
- Estratégias de produto
- Análise de mercado
- Naming e branding
- Otimização de conversão
- Métricas e analytics

**Use quando:** Precisar de decisões estratégicas ou de produto

---

### 7. **IA** (7 agentes)
Responsáveis por:
- Implementação de IA/ML
- Automações inteligentes
- Processamento de linguagem natural
- Análise preditiva
- Chatbots e assistentes

**Use quando:** Precisar integrar recursos de inteligência artificial

---

### 8. **Copy** (7 agentes)
Responsáveis por:
- Textos de interface
- Microcopy
- Mensagens de erro
- Documentação de usuário
- Conteúdo de marketing

**Use quando:** Precisar escrever textos para a aplicação

---

### 9. **Arquitetura** (7 agentes)
Responsáveis por:
- Arquitetura de software
- Padrões de projeto
- Escalabilidade
- Segurança
- Infraestrutura

**Use quando:** Precisar tomar decisões arquiteturais ou estruturais

---

## Como Usar o Squad

Quando você invocar `/squad-project`, Claude irá:

1. **Avaliar a tarefa** - Identificar qual(is) especialidade(s) são necessárias
2. **Convocar agentes** - Alocar os agentes especializados apropriados
3. **Trabalhar em paralelo** - Múltiplos agentes trabalham simultaneamente
4. **Integrar resultados** - Combinar o trabalho dos diferentes especialistas

## Instruções de Execução

**IMPORTANTE:** Ao executar este skill:

1. **Identifique as especialidades necessárias** para a tarefa
2. **Crie tasks/agentes em PARALELO** usando múltiplas chamadas de Task tool em uma ÚNICA mensagem
3. **Mostre o progresso** de cada agente na tela conforme trabalham
4. **Use Task tool com model apropriado:**
   - `haiku` para tarefas rápidas e simples
   - `sonnet` para tarefas complexas (padrão)
   - `opus` para tarefas muito complexas

### Diretrizes de Integração e Qualidade

**CRÍTICO:** Todo trabalho realizado pelos agentes DEVE seguir estas diretrizes:

1. **Análise de Integração:**
   - Identificar campos/sistemas existentes que podem se conectar com a nova feature
   - Identificar campos que ainda não existem mas serão necessários no futuro
   - **SUGERIR** ideias de integração (NÃO implementar automaticamente)
   - Documentar pontos de integração futura no código (comentários)

2. **Revisão de Funcionalidade:**
   - Testar e verificar que TUDO está funcionando 100%
   - Garantir que dados fluem corretamente entre componentes
   - Verificar que não há erros de sintaxe ou runtime
   - Confirmar que a integração com sistemas existentes está correta

3. **Documentação de Ideias:**
   - Ao final de cada tarefa, incluir seção "💡 Sugestões de Integração"
   - Listar possíveis integrações com outros módulos/campos
   - Indicar campos que podem ser adicionados no futuro
   - Sugerir melhorias de conectividade

4. **Verificação Final:**
   - Executar revisão completa do código gerado
   - Verificar compatibilidade com padrões do projeto
   - Confirmar que não quebra funcionalidades existentes
   - Validar que está pronto para produção

5. **Botões e Interações Funcionais:**
   - **TODOS os botões DEVEM ser funcionais** - Nunca criar botões decorativos
   - A lógica deve corresponder ao título/label do botão
   - Implementar mudanças de estado apropriadas
   - Exemplos:
     - "Desatribuir" → Desatribui e muda para "Atribuir para mim"
     - "Editar" → Ativa modo de edição e muda para "Salvar/Cancelar"
     - "Arquivar" → Arquiva e muda para "Desarquivar"
     - "Marcar como lido" → Marca e muda para "Marcar como não lido"
   - Feedback visual imediato ao clicar (loading, disabled, mudança de cor)
   - Estados devem refletir a ação (toggle entre estados opostos)

### Exemplo de Execução Paralela:

Para a tarefa "Criar página de login":

```
1. Task: Designer - Criar UI/UX da página de login (model: sonnet)
2. Task: Desenvolvedor - Implementar componente de login (model: sonnet)
3. Task: Programador - Criar validação e lógica (model: haiku)
4. Task: Copy - Escrever textos da interface (model: haiku)
5. Task: Arquitetura - Definir estrutura e segurança (model: sonnet)
```

**Todas as tasks DEVEM ser chamadas em paralelo na mesma mensagem!**

Após conclusão, integre os resultados e mostre:
1. Resumo do trabalho de cada agente
2. **💡 Sugestões de Integração** consolidadas de todos os agentes
3. **✅ Verificação de Funcionalidade** - Confirmar que tudo está 100% funcional

### Exemplos de Uso:

```
/squad-project Criar página de login com validação e design moderno
→ Convoca: Designers (UI), Desenvolvedores (implementação), Programadores (validação)

/squad-project Corrigir erro de performance no dashboard
→ Convoca: Debug (identificar), Programadores (otimizar), Analistas (analisar impacto)

/squad-project Planejar sistema de notificações
→ Convoca: Analistas (requisitos), Arquitetura (design), Designers (UI)
```

---

## Benefícios do Squad

✅ **Especialização** - Cada agente é expert em sua área
✅ **Paralelização** - Múltiplos agentes trabalhando simultaneamente
✅ **Qualidade** - Visões especializadas garantem melhor resultado
✅ **Eficiência** - Divisão de trabalho otimizada
✅ **Consistência** - Padrões mantidos por especialistas

---

## Comandos Relacionados

- `/squad-project` - Convoca o squad para a tarefa atual
- `/squad-project status` - Mostra status dos agentes
- `/squad-project help` - Ajuda sobre o squad

---

## Formato de Entrega dos Agentes

Cada agente DEVE entregar seu trabalho neste formato:

### 📋 Trabalho Realizado
- Descrição do que foi implementado
- Arquivos modificados/criados
- Funcionalidades adicionadas

### ✅ Verificação de Funcionalidade
- [x] Código compila sem erros
- [x] Funcionalidade testada e funcionando
- [x] Integração com sistemas existentes validada
- [x] Não quebra funcionalidades existentes

### 💡 Sugestões de Integração
**Campos Existentes:**
- Como a feature pode se conectar com campos já existentes
- Exemplo: "Este formulário pode usar o campo `userId` do estado global"

**Campos Futuros:**
- Campos que podem ser adicionados para melhorar a integração
- Exemplo: "Considere adicionar campo `timestamp` para rastrear criação"

**Pontos de Integração:**
- Onde esta feature pode ser integrada com outras partes do sistema
- Exemplo: "Pode ser integrado com o sistema de notificações quando disponível"

**Melhorias de Conectividade:**
- Como diferentes módulos podem se comunicar
- Exemplo: "Dashboard pode exibir métricas desta feature através de props"

---

### Exemplo Prático

**Tarefa:** Criar sistema de tags

**Entrega do Desenvolvedor:**

📋 **Trabalho Realizado**
- Criado componente TagManager.jsx
- Implementado CRUD de tags
- Adicionado state management para tags

✅ **Verificação**
- [x] Componente renderiza corretamente
- [x] Adicionar/remover tags funciona
- [x] State persiste entre navegações

💡 **Sugestões de Integração**
- **Campos Existentes:** Usar `contactId` do Inbox para associar tags a contatos
- **Campos Futuros:** Adicionar `tagCategory` para organizar tags por tipo
- **Pontos de Integração:** Tags podem ser exibidas no Dashboard nos cards de clientes
- **Melhorias:** Sistema de busca pode filtrar por tags quando implementado

---

**Total: 63 agentes especializados à sua disposição!** 🚀
