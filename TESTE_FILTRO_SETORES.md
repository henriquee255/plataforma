# Guia de Testes - Filtro de Atalhos por Setor

## Instruções de Teste

### Configuração Inicial

O sistema está configurado com:
- **Usuário atual:** Henrique de Oliveira
- **Role:** admin
- **Setor padrão:** geral

---

## Cenário 1: Testando como ADMIN

### Passo a Passo:
1. Navegue até a página "Atalhos" (Shortcuts)
2. Observe o banner azul com a mensagem:
   > "Como **Admin**, você vê todos os atalhos de todos os setores."

3. Verifique que vê **15 atalhos no total**:
   - 2 de Geral
   - 3 de Vendas
   - 3 de Suporte
   - 3 de Financeiro
   - 3 de RH
   - 1 Individual

4. Use o dropdown "Todos os Setores":
   - Selecione "Vendas" → Vê apenas 3 atalhos de vendas
   - Selecione "Suporte" → Vê apenas 3 atalhos de suporte
   - Selecione "Financeiro" → Vê apenas 3 atalhos
   - Selecione "RH" → Vê apenas 3 atalhos
   - Selecione "Geral" → Vê apenas 2 atalhos
   - Volte para "Todos os Setores" → Vê todos os 15

### Resultado Esperado:
✅ Admin vê TODOS os atalhos independente do setor
✅ Filtro manual funciona corretamente
✅ Sem banner de restrição

---

## Cenário 2: Testando como USUÁRIO DE VENDAS

### Configuração:
No arquivo `src/contexts/AppContext.jsx`, mude:
```javascript
role: 'user',  // Mudou de 'admin' para 'user'
setor: 'vendas'  // Mudou de 'geral' para 'vendas'
```

### Passo a Passo:
1. Recarregue a página (F5)
2. Navegue até "Atalhos"
3. Observe o banner azul:
   > "Você está no setor **Vendas** e vê apenas atalhos do seu setor + **Geral**."

4. Observe a info strip azul:
   > "Você está vendo atalhos do setor **Vendas** e **Geral**."

5. Verifique que vê **5 atalhos**:
   - ✅ 2 de Geral (ola, horario)
   - ✅ 3 de Vendas (proposta, desconto, fechamento)
   - ❌ 0 de Suporte
   - ❌ 0 de Financeiro
   - ❌ 0 de RH

6. Use o dropdown para explorar outros setores:
   - Selecione "Suporte" → Vê 3 atalhos de suporte
   - Selecione "Financeiro" → Vê 3 atalhos
   - Selecione "Vendas" → Volta a ver os 3 de vendas
   - Selecione "Geral" → Vê os 2 de geral
   - Selecione "Todos os Setores" → Volta a ver 5 (vendas + geral)

### Resultado Esperado:
✅ Usuário vê apenas atalhos do SEU setor + Geral
✅ Filtro manual permite explorar outros setores
✅ Banner informativo mostra setor atual

---

## Cenário 3: Testando como USUÁRIO DE SUPORTE

### Configuração:
```javascript
role: 'user',
setor: 'suporte'  // Mudou para 'suporte'
```

### Verificação:
- Vê **5 atalhos**: 2 Geral + 3 Suporte
- Banner mostra: "Você está no setor **Suporte**..."
- Atalhos visíveis:
  - ✅ /ola (Geral)
  - ✅ /horario (Geral)
  - ✅ /ticket (Suporte)
  - ✅ /tutorial (Suporte)
  - ✅ /resolvido (Suporte)

---

## Cenário 4: Criar Novo Atalho

### Passo a Passo:
1. Como **Admin**, clique em "Nova Resposta"
2. Preencha:
   - **Atalho:** `contrato`
   - **Título:** `Enviar Contrato`
   - **Conteúdo:** `Segue o contrato para assinatura...`
   - **Visibilidade:** Global
   - **Setor do Atalho:** Vendas

3. Clique em "Salvar"

4. Observe que o novo atalho aparece com:
   - Badge roxo "Global"
   - Badge azul "Vendas"

5. Mude userData para usuário de Vendas
6. Recarregue → Vê o novo atalho `/contrato`

7. Mude userData para usuário de Suporte
8. Recarregue → NÃO vê o atalho `/contrato`

### Resultado Esperado:
✅ Novo atalho criado com setor correto
✅ Badges aparecem corretamente
✅ Filtro por setor funciona

---

## Cenário 5: Editar Atalho Existente

### Passo a Passo:
1. Como **Admin**, localize o atalho `/proposta`
2. Clique no ícone de editar (lápis)
3. Mude o **Setor do Atalho** de "Vendas" para "Financeiro"
4. Clique em "Salvar"
5. Observe que o badge muda de azul para amarelo

6. Mude userData para usuário de Vendas
7. Recarregue → NÃO vê mais `/proposta` (agora é do Financeiro)

8. Mude userData para usuário de Financeiro
9. Recarregue → VÊ o atalho `/proposta`

### Resultado Esperado:
✅ Atalho editado com sucesso
✅ Setor mudado reflete imediatamente
✅ Filtro atualizado corretamente

---

## Cenário 6: Busca + Filtro Combinados

### Passo a Passo:
1. Como **Admin**, veja todos os 15 atalhos
2. Digite na busca: `suporte`
3. Deve ver apenas atalhos que contenham "suporte" no título/conteúdo
4. Agora, no dropdown, selecione "Vendas"
5. Busca + filtro trabalham juntos

### Resultado Esperado:
✅ Busca funciona
✅ Filtro funciona
✅ Combinação busca + filtro funciona

---

## Cenário 7: Persistência no localStorage

### Passo a Passo:
1. Crie 2 novos atalhos com setores diferentes
2. Abra DevTools (F12) → Application → Local Storage
3. Verifique a chave `shortcutsData`
4. Observe o JSON com todos os atalhos incluindo os novos
5. Recarregue a página (F5)
6. Verifique que os 2 novos atalhos ainda estão lá

### Resultado Esperado:
✅ Dados salvos no localStorage
✅ Dados persistem após reload
✅ Estrutura JSON correta

---

## Cenário 8: Testar com Diferentes Setores

### Teste Rápido para Cada Setor:

| Setor do Usuário | Atalhos Visíveis (auto) | Total |
|------------------|-------------------------|-------|
| **Admin** | TODOS | 15 |
| **Vendas** | Geral + Vendas | 5 |
| **Suporte** | Geral + Suporte | 5 |
| **Financeiro** | Geral + Financeiro | 5 |
| **RH** | Geral + RH | 5 |
| **Geral** | Geral | 2 |

---

## Badges de Cores por Setor

Verifique que os badges têm as cores corretas:

| Setor | Cor do Badge | Classe CSS |
|-------|-------------|------------|
| **Vendas** | Azul | `text-blue-600` |
| **Suporte** | Verde | `text-green-600` |
| **Financeiro** | Amarelo | `text-yellow-600` |
| **RH** | Rosa | `text-pink-600` |
| **Geral** | Roxo | `text-purple-600` |

---

## Checklist Final

Antes de dar como concluído, verifique:

- [ ] Filtro automático funciona (usuário vê seu setor + geral)
- [ ] Filtro manual funciona (dropdown muda os resultados)
- [ ] Admin vê todos os atalhos
- [ ] Usuário comum vê apenas seu setor + geral
- [ ] Criar novo atalho com setor funciona
- [ ] Editar setor de atalho existente funciona
- [ ] Badges de setor aparecem com cores corretas
- [ ] Persistência no localStorage funciona
- [ ] Banner informativo aparece
- [ ] Info strip aparece para não-admins
- [ ] Busca + filtro trabalham juntos
- [ ] UI responsiva e bonita

---

## Troubleshooting

### Problema: "Vejo todos os atalhos mesmo sendo usuário comum"
**Solução:** Verifique se `userData.role` está como `'user'` e não `'admin'`

### Problema: "Filtro manual não funciona"
**Solução:** Verifique se o dropdown está mudando o estado `filterSetor`

### Problema: "Atalhos não persistem"
**Solução:** Verifique o localStorage e o `useEffect` que salva os dados

### Problema: "Badges não aparecem"
**Solução:** Verifique se todos os atalhos têm o campo `setor` preenchido

---

**Teste concluído com sucesso!** ✅
