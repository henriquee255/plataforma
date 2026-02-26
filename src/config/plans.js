/**
 * Configuração de Planos de Assinatura
 * Define limitações, features e preços de cada plano
 */

export const PLAN_TYPES = {
  FREE: 'free',
  STARTER: 'starter',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise',
};

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  CANCELED: 'canceled',
  PAST_DUE: 'past_due',
  TRIAL: 'trial',
};

/**
 * Definição completa dos planos
 */
export const PLANS = {
  [PLAN_TYPES.FREE]: {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    billingPeriod: null,
    badge: '🆓',
    color: 'gray',

    limits: {
      maxCompanies: 0,        // ❌ Não pode criar empresas
      maxMembers: Infinity,   // ✅ Pode ser convidado (ilimitado)
      maxStorage: '500MB',
      maxIntegrations: 0,
      maxAutomations: 0,
      maxContacts: 100,
      maxMessages: 50,
    },

    features: {
      // Básico
      dashboard: true,
      profile: true,

      // Desabilitado
      crm: false,
      contacts: false,
      inbox: false,
      integrations: false,
      reports: false,
      automations: false,
      ia: false,
      whitelabel: false,
      api: false,
      priority_support: false,
      custom_domain: false,
    },

    description: 'Plano gratuito com funcionalidades limitadas',
    ctaText: 'Criar Conta Grátis',
  },

  [PLAN_TYPES.STARTER]: {
    id: 'starter',
    name: 'Starter',
    price: 47,
    billingPeriod: 'monthly',
    badge: '🚀',
    color: 'blue',

    limits: {
      maxCompanies: 1,        // ✅ 1 empresa
      maxMembers: Infinity,   // ✅ Membros ilimitados
      maxStorage: '10GB',
      maxIntegrations: 2,
      maxAutomations: 10,
      maxContacts: 1000,
      maxMessages: 500,
    },

    features: {
      // Básico
      dashboard: true,
      profile: true,

      // Starter
      crm: true,
      contacts: true,
      inbox: true,
      team: true,

      // Limitado
      integrations: 'limited', // Máximo 2
      reports: 'basic',

      // Desabilitado
      automations: false,
      ia: false,
      whitelabel: false,
      api: false,
      priority_support: false,
      custom_domain: false,
    },

    description: 'Ideal para começar com 1 empresa e recursos essenciais',
    ctaText: 'Começar com Starter',
    popular: false,
  },

  [PLAN_TYPES.PROFESSIONAL]: {
    id: 'professional',
    name: 'Professional',
    price: 97,
    billingPeriod: 'monthly',
    badge: '⭐',
    color: 'purple',

    limits: {
      maxCompanies: 3,        // ✅ 3 empresas
      maxMembers: Infinity,   // ✅ Membros ilimitados
      maxStorage: '50GB',
      maxIntegrations: 10,
      maxAutomations: 100,
      maxContacts: 10000,
      maxMessages: 5000,
    },

    features: {
      // Básico
      dashboard: true,
      profile: true,

      // Starter
      crm: true,
      contacts: true,
      inbox: true,
      team: true,

      // Professional
      integrations: true,      // Até 10
      reports: 'advanced',
      automations: true,       // Até 100
      analytics: true,
      webhooks: true,
      tags: true,

      // Desabilitado
      ia: false,
      whitelabel: false,
      api: false,
      priority_support: false,
      custom_domain: false,
    },

    description: 'Para times que precisam de múltiplas empresas e automações',
    ctaText: 'Escolher Professional',
    popular: true, // Badge "Mais Popular"
  },

  [PLAN_TYPES.ENTERPRISE]: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 297,
    billingPeriod: 'monthly',
    badge: '👑',
    color: 'gradient',

    limits: {
      maxCompanies: 5,        // ✅ 5 empresas
      maxMembers: Infinity,   // ✅ Membros ilimitados
      maxStorage: '500GB',
      maxIntegrations: Infinity,
      maxAutomations: Infinity,
      maxContacts: Infinity,
      maxMessages: Infinity,
    },

    features: {
      // Tudo do Professional +
      dashboard: true,
      profile: true,
      crm: true,
      contacts: true,
      inbox: true,
      team: true,
      integrations: true,
      reports: 'advanced',
      automations: true,
      analytics: true,
      webhooks: true,
      tags: true,

      // Enterprise exclusivo
      ia: true,
      whitelabel: true,
      api: true,
      priority_support: true,
      custom_domain: true,
      sso: true,
      audit_logs: true,
      advanced_permissions: true,
      dedicated_manager: true,
    },

    description: 'Solução completa com IA, Whitelabel e suporte prioritário',
    ctaText: 'Falar com Vendas',
    popular: false,
  },
};

/**
 * Helper para verificar se usuário pode criar empresa
 */
export const canCreateCompany = (userPlan, currentCompaniesCount) => {
  const plan = PLANS[userPlan];
  if (!plan) return false;

  return currentCompaniesCount < plan.limits.maxCompanies;
};

/**
 * Helper para verificar se feature está disponível
 */
export const hasFeature = (userPlan, featureName) => {
  const plan = PLANS[userPlan];
  if (!plan) return false;

  return plan.features[featureName] === true || plan.features[featureName] === 'limited' || plan.features[featureName] === 'basic' || plan.features[featureName] === 'advanced';
};

/**
 * Helper para obter mensagem de limite
 */
export const getLimitMessage = (userPlan, limitType) => {
  const plan = PLANS[userPlan];
  if (!plan) return '';

  const limit = plan.limits[limitType];

  if (limit === 0) {
    return 'Não disponível neste plano';
  }

  if (limit === Infinity) {
    return 'Ilimitado';
  }

  return `Máximo: ${limit}`;
};

/**
 * Helper para upgrade suggestion
 */
export const suggestUpgrade = (currentPlan) => {
  const planOrder = [PLAN_TYPES.FREE, PLAN_TYPES.STARTER, PLAN_TYPES.PROFESSIONAL, PLAN_TYPES.ENTERPRISE];
  const currentIndex = planOrder.indexOf(currentPlan);

  if (currentIndex < planOrder.length - 1) {
    return PLANS[planOrder[currentIndex + 1]];
  }

  return null; // Já está no plano mais alto
};

/**
 * Helper para formatar preço
 */
export const formatPrice = (price) => {
  if (price === 0) return 'Grátis';
  return `R$ ${price.toFixed(2).replace('.', ',')}`;
};

export default PLANS;
