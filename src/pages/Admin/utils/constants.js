/**
 * Constantes do Painel Admin
 * Centralizadas para facilitar manutenção
 */

// Informações dos Planos
export const PLAN_INFO = {
  free: {
    name: 'Free',
    color: 'gray',
    price: 0,
    limits: {
      users: 5,
      contacts: 100,
      integrations: 2
    }
  },
  starter: {
    name: 'Starter',
    color: 'blue',
    price: 29,
    limits: {
      users: 15,
      contacts: 1000,
      integrations: 5
    }
  },
  professional: {
    name: 'Professional',
    color: 'purple',
    price: 99,
    limits: {
      users: 50,
      contacts: 10000,
      integrations: 15
    }
  },
  enterprise: {
    name: 'Enterprise',
    color: 'yellow',
    price: 299,
    limits: {
      users: -1, // Ilimitado
      contacts: -1,
      integrations: -1
    }
  }
};

// Status possíveis
export const USER_STATUS = {
  ACTIVE: 'Ativo',
  SUSPENDED: 'Suspenso',
  INACTIVE: 'Inativo',
  PENDING: 'Pendente'
};

export const COMPANY_STATUS = {
  ACTIVE: 'Ativa',
  SUSPENDED: 'Suspensa',
  TRIAL: 'Trial',
  CANCELED: 'Cancelada'
};

// Roles/Tipos
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  SUPERADMIN: 'superadmin'
};

// Tabs do Admin
export const ADMIN_TABS = {
  DASHBOARD: 'dashboard',
  COMPANIES: 'companies',
  USERS: 'users',
  INTEGRATIONS: 'integrations',
  LOGS: 'logs',
  ANALYTICS: 'analytics',
  SETTINGS: 'settings'
};

// Tabs do User Modal
export const USER_MODAL_TABS = {
  INFO: 'info',
  CONFIG: 'config',
  ACTIONS: 'actions'
};

// Tabs do Company Modal
export const COMPANY_MODAL_TABS = {
  DETAILS: 'detalhes',
  MEMBERS: 'membros',
  PLAN: 'plano',
  SETTINGS: 'configuracoes'
};

// Níveis de Log
export const LOG_LEVELS = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success'
};

// Filtros padrão
export const DEFAULT_FILTERS = {
  searchTerm: '',
  plano: 'todos',
  status: 'todos',
  tipo: 'todos'
};

// Opções de filtro
export const FILTER_OPTIONS = {
  planos: [
    { value: 'todos', label: 'Todos os Planos' },
    { value: 'free', label: 'Free' },
    { value: 'starter', label: 'Starter' },
    { value: 'professional', label: 'Professional' },
    { value: 'enterprise', label: 'Enterprise' }
  ],
  status: [
    { value: 'todos', label: 'Todos os Status' },
    { value: 'Ativo', label: 'Ativo' },
    { value: 'Suspenso', label: 'Suspenso' },
    { value: 'Inativo', label: 'Inativo' }
  ],
  tipos: [
    { value: 'todos', label: 'Todos os Tipos' },
    { value: 'superadmin', label: 'Super Admins' },
    { value: 'comum', label: 'Usuários Comuns' }
  ]
};

// Permissões do Sistema
export const SYSTEM_PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: { id: 'view_dashboard', name: 'Ver Dashboard', category: 'Dashboard' },
  VIEW_ANALYTICS: { id: 'view_analytics', name: 'Ver Analytics', category: 'Dashboard' },

  // Usuários
  VIEW_USERS: { id: 'view_users', name: 'Ver Usuários', category: 'Usuários' },
  CREATE_USERS: { id: 'create_users', name: 'Criar Usuários', category: 'Usuários' },
  EDIT_USERS: { id: 'edit_users', name: 'Editar Usuários', category: 'Usuários' },
  DELETE_USERS: { id: 'delete_users', name: 'Deletar Usuários', category: 'Usuários' },

  // Empresas
  VIEW_COMPANIES: { id: 'view_companies', name: 'Ver Empresas', category: 'Empresas' },
  CREATE_COMPANIES: { id: 'create_companies', name: 'Criar Empresas', category: 'Empresas' },
  EDIT_COMPANIES: { id: 'edit_companies', name: 'Editar Empresas', category: 'Empresas' },
  DELETE_COMPANIES: { id: 'delete_companies', name: 'Deletar Empresas', category: 'Empresas' },

  // Integrações
  VIEW_INTEGRATIONS: { id: 'view_integrations', name: 'Ver Integrações', category: 'Integrações' },
  MANAGE_INTEGRATIONS: { id: 'manage_integrations', name: 'Gerenciar Integrações', category: 'Integrações' },

  // Configurações
  VIEW_SETTINGS: { id: 'view_settings', name: 'Ver Configurações', category: 'Configurações' },
  EDIT_SETTINGS: { id: 'edit_settings', name: 'Editar Configurações', category: 'Configurações' },

  // Logs
  VIEW_LOGS: { id: 'view_logs', name: 'Ver Logs', category: 'Logs' },
  EXPORT_LOGS: { id: 'export_logs', name: 'Exportar Logs', category: 'Logs' }
};

// Permissões de Super Admin (todas)
export const SUPERADMIN_PERMISSIONS = Object.values(SYSTEM_PERMISSIONS).map(p => p.id);

// Tema padrão
export const DEFAULT_THEME = 'light';

// Cache TTL (em milissegundos)
export const CACHE_TTL = {
  STATS: 5 * 60 * 1000,        // 5 minutos
  USERS: 2 * 60 * 1000,        // 2 minutos
  COMPANIES: 2 * 60 * 1000,    // 2 minutos
  INTEGRATIONS: 10 * 60 * 1000 // 10 minutos
};

// Paginação
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
};

// Configurações de Upload
export const UPLOAD_CONFIG = {
  LOGO: {
    maxSize: 2 * 1024 * 1024, // 2MB
    acceptedFormats: ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'],
    dimensions: {
      recommended: '200x200',
      aspectRatio: '1:1 ou 16:9'
    }
  },
  FAVICON: {
    maxSize: 500 * 1024, // 500KB
    acceptedFormats: ['image/x-icon', 'image/png'],
    dimensions: {
      recommended: '32x32'
    }
  }
};

// Tipos de Banner
export const BANNER_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Cores dos Banners
export const BANNER_COLORS = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-800 dark:text-blue-200'
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-800 dark:text-yellow-200'
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-800 dark:text-green-200'
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-800 dark:text-red-200'
  }
};
