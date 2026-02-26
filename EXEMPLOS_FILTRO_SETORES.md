# Exemplos de Código - Sistema de Filtro por Setores

## Índice
1. [Adicionar Novo Setor](#1-adicionar-novo-setor)
2. [Criar Atalho Programaticamente](#2-criar-atalho-programaticamente)
3. [Mudar Setor do Usuário](#3-mudar-setor-do-usuário)
4. [Buscar Atalhos de um Setor](#4-buscar-atalhos-de-um-setor)
5. [Exportar Atalhos por Setor](#5-exportar-atalhos-por-setor)
6. [Importar Atalhos](#6-importar-atalhos)
7. [Validações](#7-validações)
8. [Hooks Personalizados](#8-hooks-personalizados)

---

## 1. Adicionar Novo Setor

### Passo 1: Adicionar no array de setores (Shortcuts.jsx)

```javascript
const [sectors] = useState([
  { id: 'vendas', name: 'Vendas', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30' },
  { id: 'suporte', name: 'Suporte', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/30' },
  { id: 'financeiro', name: 'Financeiro', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/30' },
  { id: 'rh', name: 'RH', color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-900/30' },
  { id: 'geral', name: 'Geral', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/30' },

  // NOVO SETOR ⬇️
  { id: 'marketing', name: 'Marketing', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/30' }
]);
```

### Passo 2: Criar atalhos para o novo setor

```javascript
const [replies, setReplies] = useState(() => {
  const saved = localStorage.getItem('shortcutsData');
  return saved ? JSON.parse(saved) : [
    // ... atalhos existentes

    // Marketing
    {
      id: '16',
      shortcut: 'campanha',
      title: 'Lançamento de Campanha',
      content: '🚀 Nova campanha ativa!\n\nPeríodo: {{periodo}}\nDesconto: {{desconto}}%\n\nAproveite!',
      scope: 'sector',
      user_id: null,
      sector_id: 'marketing',
      setor: 'marketing'
    },
    {
      id: '17',
      shortcut: 'social',
      title: 'Promoção Redes Sociais',
      content: '📱 Estamos com promoção especial nas redes sociais!\n\nSiga-nos para não perder as ofertas.',
      scope: 'sector',
      user_id: null,
      sector_id: 'marketing',
      setor: 'marketing'
    }
  ];
});
```

**Resultado:** Novo setor "Marketing" com 2 atalhos criado! 🎉

---

## 2. Criar Atalho Programaticamente

### Função auxiliar para criar atalho

```javascript
// Adicionar em Shortcuts.jsx

function createShortcut(data) {
  const newShortcut = {
    id: Date.now().toString(),
    shortcut: data.shortcut.toLowerCase().trim(),
    title: data.title,
    content: data.content,
    scope: data.scope || 'global',
    user_id: data.scope === 'individual' ? 'user-1' : null,
    sector_id: data.scope === 'sector' ? data.sector_id : null,
    setor: data.setor || 'geral'
  };

  setReplies(prev => [...prev, newShortcut]);
  return newShortcut;
}

// Uso:
const atalho = createShortcut({
  shortcut: 'promo',
  title: 'Promoção do Dia',
  content: '🎁 Promoção especial válida até {{data}}!',
  scope: 'global',
  setor: 'vendas'
});
```

---

## 3. Mudar Setor do Usuário

### Via Interface (Settings ou Profile)

```javascript
import { useAppContext } from './contexts/AppContext';

function ProfileSettings() {
  const { userData, updateUser } = useAppContext();

  const handleSetorChange = (newSetor) => {
    updateUser({ setor: newSetor });
    // Usuário será redirecionado ou dados serão recarregados automaticamente
  };

  return (
    <select value={userData.setor} onChange={e => handleSetorChange(e.target.value)}>
      <option value="geral">Geral</option>
      <option value="vendas">Vendas</option>
      <option value="suporte">Suporte</option>
      <option value="financeiro">Financeiro</option>
      <option value="rh">RH</option>
    </select>
  );
}
```

### Programaticamente (para testes)

```javascript
// No console do navegador (DevTools)
const userData = JSON.parse(localStorage.getItem('userData'));
userData.setor = 'vendas'; // Muda para Vendas
localStorage.setItem('userData', JSON.stringify(userData));
window.location.reload(); // Recarrega a página
```

---

## 4. Buscar Atalhos de um Setor

### Função de busca

```javascript
function getShortcutsBySetor(setor) {
  return replies.filter(reply => reply.setor === setor);
}

// Uso:
const atalhosVendas = getShortcutsBySetor('vendas');
console.log(`Total de atalhos de Vendas: ${atalhosVendas.length}`);
atalhosVendas.forEach(a => console.log(`/${a.shortcut} - ${a.title}`));
```

### Buscar atalhos visíveis para um usuário específico

```javascript
function getVisibleShortcuts(userRole, userSetor) {
  if (userRole === 'admin') {
    return replies; // Admin vê tudo
  }

  return replies.filter(reply =>
    reply.setor === userSetor || reply.setor === 'geral'
  );
}

// Uso:
const visibleForSales = getVisibleShortcuts('user', 'vendas');
console.log(`Atalhos visíveis para Vendas: ${visibleForSales.length}`);
```

---

## 5. Exportar Atalhos por Setor

### Exportar como JSON

```javascript
function exportShortcutsBySetor(setor) {
  const shortcuts = replies.filter(reply => reply.setor === setor);
  const data = JSON.stringify(shortcuts, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `atalhos-${setor}-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
}

// Uso:
exportShortcutsBySetor('vendas'); // Baixa atalhos-vendas-2026-02-24.json
```

### Exportar como CSV

```javascript
function exportShortcutsAsCSV(setor) {
  const shortcuts = setor
    ? replies.filter(reply => reply.setor === setor)
    : replies;

  const csv = [
    ['Atalho', 'Título', 'Conteúdo', 'Setor', 'Scope'].join(','),
    ...shortcuts.map(s => [
      s.shortcut,
      `"${s.title}"`,
      `"${s.content.replace(/"/g, '""')}"`,
      s.setor,
      s.scope
    ].join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `atalhos${setor ? '-' + setor : ''}.csv`;
  link.click();
}

// Uso:
exportShortcutsAsCSV('vendas'); // CSV apenas de Vendas
exportShortcutsAsCSV(); // CSV de todos os atalhos
```

---

## 6. Importar Atalhos

### Importar de JSON

```javascript
function importShortcuts(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedShortcuts = JSON.parse(e.target.result);

        // Validar estrutura
        if (!Array.isArray(importedShortcuts)) {
          throw new Error('Arquivo inválido: deve ser um array de atalhos');
        }

        // Mesclar com atalhos existentes (evitar duplicatas por ID)
        const existingIds = new Set(replies.map(r => r.id));
        const newShortcuts = importedShortcuts.filter(s => !existingIds.has(s.id));

        setReplies(prev => [...prev, ...newShortcuts]);
        resolve(`${newShortcuts.length} atalhos importados com sucesso!`);
      } catch (error) {
        reject('Erro ao importar: ' + error.message);
      }
    };
    reader.readAsText(file);
  });
}

// Uso:
<input type="file" accept=".json" onChange={(e) => {
  importShortcuts(e.target.files[0])
    .then(msg => alert(msg))
    .catch(err => alert(err));
}} />
```

---

## 7. Validações

### Validar atalho antes de salvar

```javascript
function validateShortcut(shortcut) {
  const errors = [];

  // 1. Shortcut obrigatório
  if (!shortcut.shortcut || shortcut.shortcut.trim() === '') {
    errors.push('Atalho é obrigatório');
  }

  // 2. Shortcut sem espaços
  if (shortcut.shortcut && /\s/.test(shortcut.shortcut)) {
    errors.push('Atalho não pode conter espaços');
  }

  // 3. Shortcut único
  const duplicate = replies.find(
    r => r.shortcut === shortcut.shortcut && r.id !== shortcut.id
  );
  if (duplicate) {
    errors.push(`Atalho "/${shortcut.shortcut}" já existe`);
  }

  // 4. Título obrigatório
  if (!shortcut.title || shortcut.title.trim() === '') {
    errors.push('Título é obrigatório');
  }

  // 5. Conteúdo obrigatório
  if (!shortcut.content || shortcut.content.trim() === '') {
    errors.push('Conteúdo é obrigatório');
  }

  // 6. Setor válido
  const validSetores = ['vendas', 'suporte', 'financeiro', 'rh', 'geral'];
  if (!validSetores.includes(shortcut.setor)) {
    errors.push('Setor inválido');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Uso na função save():
function save() {
  const validation = validateShortcut(editing);

  if (!validation.valid) {
    alert('Erros de validação:\n' + validation.errors.join('\n'));
    return;
  }

  // Prosseguir com salvamento...
}
```

---

## 8. Hooks Personalizados

### useShortcuts - Hook para gerenciar atalhos

```javascript
// hooks/useShortcuts.js
import { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';

export function useShortcuts() {
  const { userData } = useAppContext();
  const [shortcuts, setShortcuts] = useState([]);

  // Carregar do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('shortcutsData');
    setShortcuts(saved ? JSON.parse(saved) : []);
  }, []);

  // Salvar no localStorage
  useEffect(() => {
    localStorage.setItem('shortcutsData', JSON.stringify(shortcuts));
  }, [shortcuts]);

  // Filtrar por setor do usuário
  const getVisibleShortcuts = () => {
    if (userData.role === 'admin') return shortcuts;
    return shortcuts.filter(s => s.setor === userData.setor || s.setor === 'geral');
  };

  // Adicionar atalho
  const addShortcut = (shortcut) => {
    const newShortcut = {
      id: Date.now().toString(),
      ...shortcut,
      setor: shortcut.setor || userData.setor || 'geral'
    };
    setShortcuts(prev => [...prev, newShortcut]);
    return newShortcut;
  };

  // Atualizar atalho
  const updateShortcut = (id, updates) => {
    setShortcuts(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  // Deletar atalho
  const deleteShortcut = (id) => {
    setShortcuts(prev => prev.filter(s => s.id !== id));
  };

  // Buscar por setor
  const getBySetor = (setor) => {
    return shortcuts.filter(s => s.setor === setor);
  };

  // Estatísticas
  const stats = {
    total: shortcuts.length,
    bySetor: {
      vendas: shortcuts.filter(s => s.setor === 'vendas').length,
      suporte: shortcuts.filter(s => s.setor === 'suporte').length,
      financeiro: shortcuts.filter(s => s.setor === 'financeiro').length,
      rh: shortcuts.filter(s => s.setor === 'rh').length,
      geral: shortcuts.filter(s => s.setor === 'geral').length
    }
  };

  return {
    shortcuts,
    visibleShortcuts: getVisibleShortcuts(),
    addShortcut,
    updateShortcut,
    deleteShortcut,
    getBySetor,
    stats
  };
}

// Uso:
function Shortcuts() {
  const { visibleShortcuts, addShortcut, stats } = useShortcuts();

  return (
    <div>
      <p>Total: {stats.total} atalhos</p>
      <p>Vendas: {stats.bySetor.vendas}</p>
      {/* ... */}
    </div>
  );
}
```

### useSetorFilter - Hook para filtro de setor

```javascript
// hooks/useSetorFilter.js
import { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';

export function useSetorFilter(items, filterBy = 'setor') {
  const { userData } = useAppContext();
  const [manualFilter, setManualFilter] = useState('todos');

  const filtered = useMemo(() => {
    let result = items;

    // Filtro automático (baseado no setor do usuário)
    if (userData.role !== 'admin' && manualFilter === 'todos') {
      const userSetor = userData.setor || 'geral';
      result = result.filter(item =>
        item[filterBy] === userSetor || item[filterBy] === 'geral'
      );
    }

    // Filtro manual (sobrescreve automático)
    if (manualFilter !== 'todos') {
      result = result.filter(item => item[filterBy] === manualFilter);
    }

    return result;
  }, [items, userData.role, userData.setor, manualFilter, filterBy]);

  return {
    filtered,
    setManualFilter,
    manualFilter,
    isFiltered: manualFilter !== 'todos'
  };
}

// Uso:
function Shortcuts() {
  const { shortcuts } = useShortcuts();
  const { filtered, setManualFilter, manualFilter } = useSetorFilter(shortcuts);

  return (
    <div>
      <select value={manualFilter} onChange={e => setManualFilter(e.target.value)}>
        <option value="todos">Todos</option>
        <option value="vendas">Vendas</option>
        {/* ... */}
      </select>

      {filtered.map(shortcut => (
        <div key={shortcut.id}>{shortcut.title}</div>
      ))}
    </div>
  );
}
```

---

## Snippets Úteis

### Limpar todos os atalhos de um setor

```javascript
function clearSetorShortcuts(setor) {
  if (!confirm(`Excluir TODOS os atalhos do setor ${setor}?`)) return;

  setReplies(prev => prev.filter(r => r.setor !== setor));
  alert(`Atalhos do setor ${setor} excluídos!`);
}
```

### Duplicar atalho para outro setor

```javascript
function duplicateToSetor(shortcutId, targetSetor) {
  const original = replies.find(r => r.id === shortcutId);
  if (!original) return;

  const duplicate = {
    ...original,
    id: Date.now().toString(),
    setor: targetSetor,
    shortcut: `${original.shortcut}_${targetSetor}` // Evitar duplicata
  };

  setReplies(prev => [...prev, duplicate]);
}
```

### Contar atalhos por setor

```javascript
function countBySetor() {
  return replies.reduce((acc, reply) => {
    acc[reply.setor] = (acc[reply.setor] || 0) + 1;
    return acc;
  }, {});
}

// Uso:
const counts = countBySetor();
console.log(counts);
// { vendas: 3, suporte: 3, financeiro: 3, rh: 3, geral: 2 }
```

### Buscar atalho por comando

```javascript
function findByCommand(command) {
  const normalized = command.replace(/^\//, '').toLowerCase();
  return replies.find(r => r.shortcut === normalized);
}

// Uso:
const atalho = findByCommand('/ola');
console.log(atalho.content); // "Olá! 👋 Seja bem-vindo..."
```

---

## Debug no Console

```javascript
// Ver todos os atalhos
console.table(JSON.parse(localStorage.getItem('shortcutsData')));

// Ver setor do usuário
console.log('Setor:', JSON.parse(localStorage.getItem('userData')).setor);

// Ver atalhos por setor
const data = JSON.parse(localStorage.getItem('shortcutsData'));
const grouped = data.reduce((acc, s) => {
  acc[s.setor] = acc[s.setor] || [];
  acc[s.setor].push(s.shortcut);
  return acc;
}, {});
console.log(grouped);

// Resetar atalhos (voltar ao mock inicial)
localStorage.removeItem('shortcutsData');
location.reload();
```

---

**Exemplos Concluídos!** ✅

Esses exemplos cobrem os casos de uso mais comuns e facilitam a manutenção e extensão do sistema de filtros.
