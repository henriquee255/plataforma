# 📚 Quick Reference - Painel Superadmin

> **Versão:** 1.0.0
> **Data:** 2026-02-25
> **Responsável:** @ux-design-expert
> **Para:** Desenvolvedores (@dev)

---

## 🎨 Design Tokens

### Cores Purple Theme

```javascript
// Tailwind Classes - Purple (Primary)
'bg-purple-50'    // #faf5ff - Backgrounds muito claros
'bg-purple-100'   // #f3e8ff - Backgrounds de badges
'bg-purple-500'   // #a855f7 - Primary color
'bg-purple-600'   // #9333ea - Primary dark
'bg-purple-900'   // #581c87 - Dark mode backgrounds

// Gradientes
'from-purple-500 to-purple-600'  // Botões primários
'from-purple-500 to-indigo-600'  // Banners especiais
```

### Cores Semânticas

```javascript
// Success (Emerald)
'bg-emerald-100 dark:bg-emerald-900/30'
'text-emerald-700 dark:text-emerald-400'
'border-emerald-200 dark:border-emerald-800'

// Warning (Amber)
'bg-amber-100 dark:bg-amber-900/20'
'text-amber-700 dark:text-amber-400'
'border-amber-200 dark:border-amber-800'

// Error (Red)
'bg-red-100 dark:bg-red-900/30'
'text-red-700 dark:text-red-400'
'border-red-200 dark:border-red-800'

// Info (Blue)
'bg-blue-100 dark:bg-blue-900/30'
'text-blue-700 dark:text-blue-400'
'border-blue-200 dark:border-blue-800'
```

---

## 🧩 Componentes Copy-Paste

### 1. Status Badge

```jsx
import StatusBadge from '@/components/custom/StatusBadge';

// Uso
<StatusBadge status="active">Ativo</StatusBadge>
<StatusBadge status="inactive">Inativo</StatusBadge>
<StatusBadge status="pending">Pendente</StatusBadge>
<StatusBadge status="error">Erro</StatusBadge>
```

### 2. Plan Badge

```jsx
const PlanBadge = ({ plan }) => {
  const config = {
    free: { label: 'Free', icon: FaGift, className: 'bg-gray-100 text-gray-700 border-gray-200' },
    starter: { label: 'Starter', icon: FaRocket, className: 'bg-blue-100 text-blue-700 border-blue-200' },
    professional: { label: 'Professional', icon: FaStar, className: 'bg-purple-100 text-purple-700 border-purple-200' },
    enterprise: { label: 'Enterprise', icon: FaInfinity, className: 'bg-purple-100 text-purple-700 border-purple-200' }
  };

  const { label, icon: Icon, className } = config[plan] || config.free;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${className}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};
```

### 3. Stat Card

```jsx
<div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800 transition-all">
  {/* Icon */}
  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
    <FaUsers className="text-white text-xl" />
  </div>

  {/* Label */}
  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
    Total de Usuários
  </p>

  {/* Value */}
  <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
    1,247
  </p>

  {/* Trend (opcional) */}
  <div className="flex items-center gap-1 mt-2">
    <FaArrowUp className="w-3 h-3 text-emerald-500" />
    <span className="text-xs font-semibold text-emerald-500">+12.5%</span>
    <span className="text-xs text-gray-500">vs mês anterior</span>
  </div>
</div>
```

### 4. Search Input

```jsx
<div className="relative">
  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
  <input
    type="text"
    placeholder="Buscar por nome, email ou CPF..."
    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  {searchTerm && (
    <button
      onClick={() => setSearchTerm('')}
      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
    >
      <FaTimes className="w-4 h-4 text-gray-400" />
    </button>
  )}
</div>
```

### 5. Empty State

```jsx
<div className="flex flex-col items-center justify-center py-16">
  <div className="w-24 h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
    <FaUsers className="w-12 h-12 text-gray-400" />
  </div>
  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
    Nenhum resultado encontrado
  </h3>
  <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
    Não encontramos nenhum usuário com os filtros aplicados. Tente ajustar sua busca.
  </p>
  <button
    onClick={clearFilters}
    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/30"
  >
    Limpar filtros
  </button>
</div>
```

### 6. Toast Notification

```jsx
const Toast = ({ type = 'success', title, message, onClose }) => {
  const config = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-500',
      icon: <FaCheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      textColor: 'text-emerald-800 dark:text-emerald-300'
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-500',
      icon: <FaExclamationTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />,
      textColor: 'text-red-800 dark:text-red-300'
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-500',
      icon: <FaExclamationTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      textColor: 'text-amber-800 dark:text-amber-300'
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-500',
      icon: <FaInfoCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      textColor: 'text-blue-800 dark:text-blue-300'
    }
  };

  const { bg, border, icon, textColor } = config[type];

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`${bg} border-l-4 ${border} rounded-lg p-4 shadow-lg max-w-md`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">{icon}</div>
          <div className="flex-1">
            <p className={`font-semibold ${textColor}`}>{title}</p>
            <p className={`text-sm ${textColor}`}>{message}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-current opacity-60 hover:opacity-100 transition-opacity"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Uso
<Toast
  type="success"
  title="Sucesso!"
  message="Logo atualizada com sucesso."
  onClose={() => setShowToast(false)}
/>
```

### 7. Loading Skeleton (StatCard)

```jsx
<div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-800 animate-pulse">
  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl mb-4" />
  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-2" />
  <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
</div>
```

### 8. Progress Bar

```jsx
<div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
  <div
    className="bg-gradient-to-r from-purple-500 to-purple-600 h-full transition-all duration-300"
    style={{ width: `${uploadProgress}%` }}
  />
</div>
<p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
  {uploadProgress}% concluído
</p>
```

### 9. Banner Component

```jsx
const Banner = ({ type = 'info', title, message, action, dismissible = true, onClose }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const typeConfig = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      icon: FaInfoCircle
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-800 dark:text-amber-200',
      icon: FaExclamationTriangle
    },
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800',
      text: 'text-emerald-800 dark:text-emerald-200',
      icon: FaCheckCircle
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      icon: FaTimes
    }
  };

  const { bg, border, text, icon: Icon } = typeConfig[type];

  const handleClose = () => {
    setDismissed(true);
    onClose?.();
  };

  return (
    <div
      className={`border-l-4 p-4 ${bg} ${border} relative animate-slide-down`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-6 h-6 ${text} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          {title && <h4 className={`font-bold ${text} mb-1`}>{title}</h4>}
          <p className={`${text} text-sm`}>{message}</p>
          {action && (
            <button
              onClick={() => window.location.href = action.link}
              className={`mt-2 underline font-semibold ${text} hover:opacity-80 transition-opacity`}
            >
              {action.text}
            </button>
          )}
        </div>
        {dismissible && (
          <button
            onClick={handleClose}
            className={`flex-shrink-0 ${text} opacity-60 hover:opacity-100 transition-opacity`}
            aria-label="Fechar banner"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

// Uso
<Banner
  type="warning"
  title="Manutenção programada"
  message="A plataforma ficará em manutenção no dia 01/03."
  action={{ text: 'Saiba mais', link: '/maintenance' }}
  dismissible={true}
  onClose={() => console.log('Banner fechado')}
/>
```

### 10. Tab Navigation

```jsx
const [activeTab, setActiveTab] = useState('info');

const tabs = [
  { id: 'info', label: 'Informações', icon: FaUser },
  { id: 'config', label: 'Configurações', icon: FaCog },
  { id: 'actions', label: 'Ações', icon: FaBolt }
];

<div className="flex gap-2 border-b-2 border-gray-200 dark:border-gray-800">
  {tabs.map(tab => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`px-4 py-3 font-semibold transition-all ${
        activeTab === tab.id
          ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 -mb-[2px]'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      <tab.icon className="inline-block w-4 h-4 mr-2" />
      {tab.label}
    </button>
  ))}
</div>
```

---

## 🎭 Estados de UI

### Loading Button

```jsx
<button
  disabled={isLoading}
  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
>
  {isLoading && (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )}
  {isLoading ? 'Salvando...' : 'Salvar'}
</button>
```

### Input com Validação

```jsx
const [email, setEmail] = useState('');
const [error, setError] = useState('');

const validateEmail = (value) => {
  if (!value) return 'Email é obrigatório';
  if (!/\S+@\S+\.\S+/.test(value)) return 'Email inválido';
  return '';
};

<div className="space-y-1">
  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Email <span className="text-red-500">*</span>
  </label>
  <input
    id="email"
    type="email"
    value={email}
    onChange={(e) => {
      setEmail(e.target.value);
      setError(validateEmail(e.target.value));
    }}
    className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all ${
      error
        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
        : 'border-gray-200 dark:border-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
    }`}
    aria-invalid={!!error}
    aria-describedby={error ? 'email-error' : undefined}
  />
  {error && (
    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
      <FaExclamationTriangle className="w-4 h-4" />
      <p id="email-error" className="text-sm">{error}</p>
    </div>
  )}
</div>
```

---

## 🔧 Utilitários JavaScript

### 1. Upload de Arquivo com Validação

```javascript
const handleFileUpload = async (file) => {
  // Validações
  const maxSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];

  if (!allowedTypes.includes(file.type)) {
    setError('Formato não suportado. Use PNG, JPG ou SVG.');
    return;
  }

  if (file.size > maxSize) {
    setError(`Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Máximo: 2MB.`);
    return;
  }

  // Upload
  setIsUploading(true);
  setUploadProgress(0);

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/admin/upload/logo', {
      method: 'POST',
      body: formData,
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      }
    });

    if (!response.ok) throw new Error('Upload falhou');

    const data = await response.json();
    setLogoUrl(data.url);
    setError('');
    showToast('success', 'Sucesso!', 'Logo atualizada com sucesso.');
  } catch (err) {
    setError('Erro ao fazer upload. Tente novamente.');
  } finally {
    setIsUploading(false);
    setUploadProgress(0);
  }
};
```

### 2. Atualizar Favicon Dinamicamente

```javascript
const updateFavicon = (faviconUrl) => {
  // Remove favicon antigo
  const existingFavicon = document.querySelector("link[rel*='icon']");
  if (existingFavicon) {
    existingFavicon.remove();
  }

  // Adiciona novo favicon
  const link = document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = faviconUrl;
  document.getElementsByTagName('head')[0].appendChild(link);
};

// Atualizar título
const updateTitle = (name) => {
  document.title = name;
};
```

### 3. Aplicar Tema Customizado

```javascript
const applyTheme = async (colors) => {
  const root = document.documentElement;

  // Aplicar cores primárias
  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--gradient-start', colors.gradientStart);
  root.style.setProperty('--gradient-end', colors.gradientEnd);

  // Gerar shades automaticamente (usando biblioteca como chroma-js)
  ['50', '100', '500', '600', '700', '900'].forEach(shade => {
    const color = generateShade(colors.primary, shade);
    root.style.setProperty(`--color-primary-${shade}`, color);
  });

  // Salvar no backend
  try {
    await fetch('/api/admin/settings/theme', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: colors })
    });

    showToast('success', 'Tema aplicado!', 'As alterações foram salvas.');
  } catch (err) {
    showToast('error', 'Erro', 'Não foi possível salvar o tema.');
  }
};
```

### 4. Sistema de Toast (Hook)

```javascript
// hooks/useToast.js
import { useState } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (type, title, message, duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast = { id, type, title, message };

    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return { toasts, showToast, removeToast };
};

// Uso
const { toasts, showToast, removeToast } = useToast();

showToast('success', 'Sucesso!', 'Operação concluída.');
```

---

## 🎨 Classes CSS Customizadas

### Animações (adicionar ao tailwind.config.js)

```javascript
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 150ms ease-out',
        'scale-in': 'scaleIn 150ms ease-out',
        'slide-in-right': 'slideInRight 200ms ease-out',
        'slide-down': 'slideDown 200ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
};
```

---

## ♿ Acessibilidade Checklist

### Botões

```jsx
// ✅ BOM
<button
  onClick={handleDelete}
  aria-label="Excluir usuário João Silva"
  className="p-2 hover:bg-red-100 rounded-lg"
>
  <FaTrash className="w-4 h-4 text-red-600" aria-hidden="true" />
</button>

// ❌ RUIM
<button onClick={handleDelete}>
  <FaTrash />
</button>
```

### Formulários

```jsx
// ✅ BOM
<label htmlFor="user-email" className="block text-sm font-medium mb-2">
  Email
</label>
<input
  id="user-email"
  type="email"
  aria-required="true"
  aria-invalid={!!error}
  aria-describedby={error ? 'email-error' : undefined}
/>
{error && (
  <p id="email-error" role="alert" className="text-sm text-red-600">
    {error}
  </p>
)}

// ❌ RUIM
<input type="email" placeholder="Email" />
{error && <p>{error}</p>}
```

### Modais

```jsx
// ✅ BOM
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  className="fixed inset-0 z-50"
>
  <h2 id="modal-title">Detalhes do Usuário</h2>
  {/* Content */}
</div>

// ❌ RUIM
<div className="fixed inset-0">
  <h2>Detalhes</h2>
</div>
```

### Loading States

```jsx
// ✅ BOM
<div role="status" aria-live="polite">
  {isLoading ? 'Carregando usuários...' : `${users.length} usuários carregados`}
</div>

// ❌ RUIM
{isLoading && <p>Loading...</p>}
```

---

## 📐 Breakpoints Responsivos

```javascript
// Tailwind Breakpoints
sm:  640px   // Mobile landscape
md:  768px   // Tablet portrait
lg:  1024px  // Tablet landscape / Desktop
xl:  1280px  // Desktop
2xl: 1536px  // Large desktop

// Exemplo de uso
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {/* Cards */}
</div>
```

---

## 🐛 Debug & Testing

### Validar Contraste

```javascript
// Verificar contraste WCAG
const getContrast = (color1, color2) => {
  // Implementar algoritmo WCAG
  // https://www.w3.org/TR/WCAG21/#contrast-minimum
};

// Purple-600 sobre branco
console.log(getContrast('#9333ea', '#ffffff')); // 4.6:1 ✅ (AA)

// Purple-400 sobre branco
console.log(getContrast('#c084fc', '#ffffff')); // 2.8:1 ❌ (falha)
```

### Testar Navegação por Teclado

```bash
# Checklist manual:
1. Tab - navega entre elementos focáveis
2. Shift+Tab - volta para elemento anterior
3. Enter - ativa botão/link
4. Esc - fecha modal/dropdown
5. Arrow Keys - navega em tabs/listas
```

### Validar Dark Mode

```javascript
// Forçar dark mode para teste
document.documentElement.classList.add('dark');

// Remover dark mode
document.documentElement.classList.remove('dark');
```

---

## 🔗 Links Rápidos

| Documento | Descrição |
|-----------|-----------|
| [[Admin-UX-Design-Guide]] | Guia completo de UX/UI |
| [[Admin-User-Flows]] | Fluxos de usuário detalhados |
| [[Admin-Refactoring-Plan]] | Plano de refatoração |
| [[Admin-New-Features]] | Novas funcionalidades |

---

## 💡 Dicas Rápidas

1. **Sempre usar dark mode classes:** `bg-white dark:bg-gray-900`
2. **Gradientes em botões primários:** `from-purple-500 to-purple-600`
3. **Sombras em cards:** `shadow-lg` + `hover:shadow-xl`
4. **Transições suaves:** `transition-all duration-200`
5. **Focus states:** `focus:ring-2 focus:ring-purple-500/20`
6. **ARIA labels obrigatórios** em ícones sem texto
7. **Loading states** em todas as operações assíncronas
8. **Validação inline** em formulários
9. **Toast para feedback** (sucesso/erro)
10. **Skeleton loading** para dados carregando

---

## ⚡ Performance

### React.memo

```javascript
export default React.memo(UsersTable, (prevProps, nextProps) => {
  return prevProps.users === nextProps.users;
});
```

### useMemo

```javascript
const filteredUsers = useMemo(() => {
  return users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [users, searchTerm]);
```

### React.lazy

```javascript
const UserModal = React.lazy(() => import('./UserModal'));

<Suspense fallback={<LoadingSpinner />}>
  {showUserModal && <UserModal user={selectedUser} />}
</Suspense>
```

---

**Última Atualização:** 2026-02-25
**Responsável:** @ux-design-expert
**Para:** @dev, @architect
