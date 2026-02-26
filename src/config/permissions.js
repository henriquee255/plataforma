/**
 * Sistema de Permissões Granulares
 * Define o que cada role/departamento pode fazer
 */

/**
 * Permissões disponíveis na plataforma
 */
export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: 'dashboard.view',
  DASHBOARD_EDIT: 'dashboard.edit',

  // CRM
  CRM_VIEW: 'crm.view',
  CRM_CREATE: 'crm.create',
  CRM_EDIT: 'crm.edit',
  CRM_DELETE: 'crm.delete',
  CRM_EXPORT: 'crm.export',

  // Contacts
  CONTACTS_VIEW: 'contacts.view',
  CONTACTS_CREATE: 'contacts.create',
  CONTACTS_EDIT: 'contacts.edit',
  CONTACTS_DELETE: 'contacts.delete',
  CONTACTS_IMPORT: 'contacts.import',
  CONTACTS_EXPORT: 'contacts.export',

  // Inbox
  INBOX_VIEW: 'inbox.view',
  INBOX_SEND: 'inbox.send',
  INBOX_DELETE: 'inbox.delete',
  INBOX_ASSIGN: 'inbox.assign',

  // Team
  TEAM_VIEW: 'team.view',
  TEAM_INVITE: 'team.invite',
  TEAM_EDIT: 'team.edit',
  TEAM_REMOVE: 'team.remove',
  TEAM_MANAGE_ROLES: 'team.manage_roles',

  // Integrations
  INTEGRATIONS_VIEW: 'integrations.view',
  INTEGRATIONS_CREATE: 'integrations.create',
  INTEGRATIONS_EDIT: 'integrations.edit',
  INTEGRATIONS_DELETE: 'integrations.delete',

  // Reports
  REPORTS_VIEW: 'reports.view',
  REPORTS_CREATE: 'reports.create',
  REPORTS_EXPORT: 'reports.export',

  // Automations
  AUTOMATIONS_VIEW: 'automations.view',
  AUTOMATIONS_CREATE: 'automations.create',
  AUTOMATIONS_EDIT: 'automations.edit',
  AUTOMATIONS_DELETE: 'automations.delete',

  // IA
  IA_VIEW: 'ia.view',
  IA_USE: 'ia.use',
  IA_CONFIGURE: 'ia.configure',

  // Settings
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_GENERAL: 'settings.general',
  SETTINGS_BILLING: 'settings.billing',
  SETTINGS_SECURITY: 'settings.security',
  SETTINGS_WHITELABEL: 'settings.whitelabel',
  SETTINGS_API: 'settings.api',

  // Company
  COMPANY_VIEW: 'company.view',
  COMPANY_EDIT: 'company.edit',
  COMPANY_DELETE: 'company.delete',
};

/**
 * Permissões por ROLE
 */
export const ROLE_PERMISSIONS = {
  owner: [
    'all', // Owner tem TODAS as permissões
  ],

  admin: [
    // Dashboard
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_EDIT,

    // CRM
    PERMISSIONS.CRM_VIEW,
    PERMISSIONS.CRM_CREATE,
    PERMISSIONS.CRM_EDIT,
    PERMISSIONS.CRM_DELETE,
    PERMISSIONS.CRM_EXPORT,

    // Contacts
    PERMISSIONS.CONTACTS_VIEW,
    PERMISSIONS.CONTACTS_CREATE,
    PERMISSIONS.CONTACTS_EDIT,
    PERMISSIONS.CONTACTS_DELETE,
    PERMISSIONS.CONTACTS_IMPORT,
    PERMISSIONS.CONTACTS_EXPORT,

    // Inbox
    PERMISSIONS.INBOX_VIEW,
    PERMISSIONS.INBOX_SEND,
    PERMISSIONS.INBOX_DELETE,
    PERMISSIONS.INBOX_ASSIGN,

    // Team
    PERMISSIONS.TEAM_VIEW,
    PERMISSIONS.TEAM_INVITE,
    PERMISSIONS.TEAM_EDIT,
    PERMISSIONS.TEAM_REMOVE,
    PERMISSIONS.TEAM_MANAGE_ROLES,

    // Integrations
    PERMISSIONS.INTEGRATIONS_VIEW,
    PERMISSIONS.INTEGRATIONS_CREATE,
    PERMISSIONS.INTEGRATIONS_EDIT,
    PERMISSIONS.INTEGRATIONS_DELETE,

    // Reports
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_CREATE,
    PERMISSIONS.REPORTS_EXPORT,

    // Automations
    PERMISSIONS.AUTOMATIONS_VIEW,
    PERMISSIONS.AUTOMATIONS_CREATE,
    PERMISSIONS.AUTOMATIONS_EDIT,
    PERMISSIONS.AUTOMATIONS_DELETE,

    // IA
    PERMISSIONS.IA_VIEW,
    PERMISSIONS.IA_USE,
    PERMISSIONS.IA_CONFIGURE,

    // Settings
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_GENERAL,
    PERMISSIONS.SETTINGS_SECURITY,

    // Company
    PERMISSIONS.COMPANY_VIEW,
    PERMISSIONS.COMPANY_EDIT,

    // Não tem acesso a billing, whitelabel, API, company delete (apenas owner)
  ],

  member: [
    // Dashboard
    PERMISSIONS.DASHBOARD_VIEW,

    // CRM (limitado)
    PERMISSIONS.CRM_VIEW,
    PERMISSIONS.CRM_CREATE,
    PERMISSIONS.CRM_EDIT,

    // Contacts
    PERMISSIONS.CONTACTS_VIEW,
    PERMISSIONS.CONTACTS_CREATE,
    PERMISSIONS.CONTACTS_EDIT,

    // Inbox
    PERMISSIONS.INBOX_VIEW,
    PERMISSIONS.INBOX_SEND,

    // Team (apenas visualizar)
    PERMISSIONS.TEAM_VIEW,

    // Reports (apenas visualizar)
    PERMISSIONS.REPORTS_VIEW,

    // Company (apenas visualizar)
    PERMISSIONS.COMPANY_VIEW,
  ],
};

/**
 * Permissões por DEPARTAMENTO (sobrescreve/adiciona às do role)
 */
export const DEPARTMENT_PERMISSIONS = {
  vendas: [
    // Adiciona às permissões do role
    PERMISSIONS.CRM_VIEW,
    PERMISSIONS.CRM_CREATE,
    PERMISSIONS.CRM_EDIT,
    PERMISSIONS.CRM_DELETE,
    PERMISSIONS.CRM_EXPORT,
    PERMISSIONS.CONTACTS_VIEW,
    PERMISSIONS.CONTACTS_CREATE,
    PERMISSIONS.CONTACTS_EDIT,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
  ],

  suporte: [
    PERMISSIONS.INBOX_VIEW,
    PERMISSIONS.INBOX_SEND,
    PERMISSIONS.INBOX_DELETE,
    PERMISSIONS.INBOX_ASSIGN,
    PERMISSIONS.CONTACTS_VIEW,
    PERMISSIONS.CONTACTS_EDIT,
  ],

  marketing: [
    PERMISSIONS.CONTACTS_VIEW,
    PERMISSIONS.CONTACTS_CREATE,
    PERMISSIONS.CONTACTS_IMPORT,
    PERMISSIONS.CONTACTS_EXPORT,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_CREATE,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.AUTOMATIONS_VIEW,
    PERMISSIONS.AUTOMATIONS_CREATE,
    PERMISSIONS.AUTOMATIONS_EDIT,
    PERMISSIONS.IA_VIEW,
    PERMISSIONS.IA_USE,
  ],

  financeiro: [
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.SETTINGS_BILLING,
  ],

  ti: [
    PERMISSIONS.INTEGRATIONS_VIEW,
    PERMISSIONS.INTEGRATIONS_CREATE,
    PERMISSIONS.INTEGRATIONS_EDIT,
    PERMISSIONS.INTEGRATIONS_DELETE,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_GENERAL,
    PERMISSIONS.SETTINGS_SECURITY,
    PERMISSIONS.SETTINGS_API,
  ],
};

/**
 * Helper para verificar se usuário tem permissão
 */
export const hasPermission = (userPermissions, requiredPermission) => {
  // Owner tem tudo
  if (userPermissions.includes('all')) return true;

  // Verificar permissão específica
  return userPermissions.includes(requiredPermission);
};

/**
 * Helper para obter permissões completas de um membro
 */
export const getMemberPermissions = (role, department = null, customPermissions = []) => {
  let permissions = [];

  // 1. Adicionar permissões do role
  if (ROLE_PERMISSIONS[role]) {
    permissions = [...ROLE_PERMISSIONS[role]];
  }

  // 2. Adicionar permissões do departamento
  if (department && DEPARTMENT_PERMISSIONS[department]) {
    permissions = [...permissions, ...DEPARTMENT_PERMISSIONS[department]];
  }

  // 3. Adicionar permissões customizadas
  if (customPermissions && customPermissions.length > 0) {
    permissions = [...permissions, ...customPermissions];
  }

  // Remover duplicatas
  return [...new Set(permissions)];
};

/**
 * Helper para verificar se pode acessar feature baseado no plano
 */
export const canAccessFeature = (plan, feature) => {
  const PLAN_FEATURES = {
    free: [],
    starter: ['dashboard', 'crm', 'contacts', 'inbox', 'team'],
    professional: [
      'dashboard',
      'crm',
      'contacts',
      'inbox',
      'team',
      'integrations',
      'reports',
      'automations',
    ],
    enterprise: [
      'dashboard',
      'crm',
      'contacts',
      'inbox',
      'team',
      'integrations',
      'reports',
      'automations',
      'ia',
      'whitelabel',
      'api',
    ],
  };

  return PLAN_FEATURES[plan]?.includes(feature) || false;
};

/**
 * Helper para formatar permissão para exibição
 */
export const formatPermission = (permission) => {
  const labels = {
    // Dashboard
    'dashboard.view': 'Visualizar Dashboard',
    'dashboard.edit': 'Editar Dashboard',

    // CRM
    'crm.view': 'Visualizar CRM',
    'crm.create': 'Criar no CRM',
    'crm.edit': 'Editar no CRM',
    'crm.delete': 'Deletar no CRM',
    'crm.export': 'Exportar CRM',

    // Contacts
    'contacts.view': 'Visualizar Contatos',
    'contacts.create': 'Criar Contatos',
    'contacts.edit': 'Editar Contatos',
    'contacts.delete': 'Deletar Contatos',
    'contacts.import': 'Importar Contatos',
    'contacts.export': 'Exportar Contatos',

    // Inbox
    'inbox.view': 'Visualizar Inbox',
    'inbox.send': 'Enviar Mensagens',
    'inbox.delete': 'Deletar Mensagens',
    'inbox.assign': 'Atribuir Conversas',

    // Team
    'team.view': 'Visualizar Equipe',
    'team.invite': 'Convidar Membros',
    'team.edit': 'Editar Membros',
    'team.remove': 'Remover Membros',
    'team.manage_roles': 'Gerenciar Roles',

    // Integrations
    'integrations.view': 'Visualizar Integrações',
    'integrations.create': 'Criar Integrações',
    'integrations.edit': 'Editar Integrações',
    'integrations.delete': 'Deletar Integrações',

    // Reports
    'reports.view': 'Visualizar Relatórios',
    'reports.create': 'Criar Relatórios',
    'reports.export': 'Exportar Relatórios',

    // Automations
    'automations.view': 'Visualizar Automações',
    'automations.create': 'Criar Automações',
    'automations.edit': 'Editar Automações',
    'automations.delete': 'Deletar Automações',

    // IA
    'ia.view': 'Visualizar IA',
    'ia.use': 'Usar IA',
    'ia.configure': 'Configurar IA',

    // Settings
    'settings.view': 'Visualizar Configurações',
    'settings.general': 'Configurações Gerais',
    'settings.billing': 'Billing',
    'settings.security': 'Segurança',
    'settings.whitelabel': 'Whitelabel',
    'settings.api': 'API',

    // Company
    'company.view': 'Visualizar Empresa',
    'company.edit': 'Editar Empresa',
    'company.delete': 'Deletar Empresa',

    // Especial
    all: 'Todas as Permissões',
  };

  return labels[permission] || permission;
};

export default {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  DEPARTMENT_PERMISSIONS,
  hasPermission,
  getMemberPermissions,
  canAccessFeature,
  formatPermission,
};
