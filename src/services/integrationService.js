/**
 * Integration Service - Kiwify, Hotmart, Stripe
 * Gerencia integrações com plataformas de pagamento
 */

// Configuração
const USE_MOCK = false; // Usar backend real
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Delay para simular latência de rede (modo mock)
 */
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fazer requisição à API
 */
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Pegar token do localStorage
  const accessToken = localStorage.getItem('accessToken');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Erro na requisição');
    }

    return data;
  } catch (error) {
    console.error(`Erro em ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Conectar integração (OAuth)
 * @param {string} platform - kiwify, hotmart, stripe
 * @param {Object} credentials - Credenciais da plataforma
 */
export const connectIntegration = async (platform, credentials) => {
  console.log('📡 connectIntegration chamado');
  console.log('Platform:', platform);
  console.log('Credentials:', Object.keys(credentials));
  console.log('URL:', `${API_BASE_URL}/api/integrations/${platform}/connect`);

  return fetchAPI(`/api/integrations/${platform}/connect`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

/**
 * Sincronizar dados de uma integração
 * @param {string} platform - kiwify, hotmart, stripe
 */
export const syncIntegration = async (platform) => {
  return fetchAPI(`/api/integrations/${platform}/sync`, {
    method: 'GET',
  });
};

/**
 * Buscar estatísticas de uma integração
 * @param {string} platform - kiwify, hotmart, stripe
 */
export const getIntegrationStats = async (platform) => {
  return fetchAPI(`/api/integrations/${platform}/stats`, {
    method: 'GET',
  });
};

/**
 * Desconectar integração
 * @param {string} platform - kiwify, hotmart, stripe
 */
export const disconnectIntegration = async (platform) => {
  return fetchAPI(`/api/integrations/${platform}/disconnect`, {
    method: 'POST',
  });
};

/**
 * Listar todas as integrações
 */
export const listIntegrations = async () => {
  return fetchAPI('/api/integrations', {
    method: 'GET',
  });
};

/**
 * Validar credenciais antes de conectar
 * @param {string} platform - kiwify, hotmart, stripe
 * @param {Object} credentials - Credenciais da plataforma
 */
export const validateCredentials = async (platform, credentials) => {
  return fetchAPI(`/api/integrations/${platform}/validate`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

/**
 * MOCK: Sincronizar dados Kiwify
 */
const mockSyncKiwify = async () => {
  await mockDelay(1500);

  return {
    success: true,
    data: {
      totalClients: 1247,
      totalRevenue: 284650.50,
      totalRefunds: 12890.00,
      refundCount: 15,
      products: [
        {
          id: 1,
          name: 'Super Links - Plano Vitalício',
          price: 497.00,
          type: 'vitalicia',
          category: 'Digital',
          autoTag: 'Super Links'
        },
        {
          id: 2,
          name: 'Super Presell - Assinatura Mensal',
          price: 97.00,
          type: 'mensal',
          category: 'Digital',
          autoTag: 'Super Presell'
        },
        {
          id: 3,
          name: 'Pacote Completo - Anual',
          price: 1497.00,
          type: 'anual',
          category: 'Bundle',
          autoTag: 'Pacote Completo'
        }
      ],
      recentClients: [
        {
          id: 1,
          nome: 'João Silva',
          email: 'joao.silva@email.com',
          cpf: '123.456.789-00',
          telefone: '+55 11 98765-4321',
          produto: 'Super Links - Plano Vitalício',
          tipoPagamento: 'vitalicia',
          valor: 497.00,
          dataCompra: '2026-02-23',
          horaCompra: '14:30',
          status: 'approved',
          reembolsado: false
        },
        {
          id: 2,
          nome: 'Maria Santos',
          email: 'maria.santos@email.com',
          cpf: '234.567.890-11',
          telefone: '+55 11 98765-4322',
          produto: 'Super Presell - Assinatura Mensal',
          tipoPagamento: 'mensal',
          valor: 97.00,
          dataCompra: '2026-02-23',
          horaCompra: '13:15',
          status: 'approved',
          reembolsado: false
        },
        {
          id: 3,
          nome: 'Pedro Costa',
          email: 'pedro.costa@email.com',
          cpf: '345.678.901-22',
          telefone: '+55 11 98765-4323',
          produto: 'Pacote Completo - Anual',
          tipoPagamento: 'anual',
          valor: 1497.00,
          dataCompra: '2026-02-23',
          horaCompra: '12:45',
          status: 'approved',
          reembolsado: false
        },
        {
          id: 4,
          nome: 'Ana Paula',
          email: 'ana.paula@email.com',
          cpf: '456.789.012-33',
          telefone: '+55 11 98765-4324',
          produto: 'Super Links - Plano Vitalício',
          tipoPagamento: 'vitalicia',
          valor: 497.00,
          dataCompra: '2026-02-23',
          horaCompra: '11:20',
          status: 'refunded',
          reembolsado: true
        },
        {
          id: 5,
          nome: 'Carlos Eduardo',
          email: 'carlos.eduardo@email.com',
          cpf: '567.890.123-44',
          telefone: '+55 11 98765-4325',
          produto: 'Super Presell - Assinatura Mensal',
          tipoPagamento: 'mensal',
          valor: 97.00,
          dataCompra: '2026-02-23',
          horaCompra: '10:05',
          status: 'approved',
          reembolsado: false
        }
      ],
      lastSync: new Date().toISOString()
    }
  };
};

// Fallback para mock se backend não disponível
export const syncIntegrationWithFallback = async (platform) => {
  if (USE_MOCK && platform === 'kiwify') {
    return mockSyncKiwify();
  }

  try {
    return await syncIntegration(platform);
  } catch (error) {
    console.warn('Backend indisponível, usando dados mock:', error.message);
    if (platform === 'kiwify') {
      return mockSyncKiwify();
    }
    throw error;
  }
};

export default {
  connectIntegration,
  syncIntegration,
  syncIntegrationWithFallback,
  getIntegrationStats,
  disconnectIntegration,
  listIntegrations,
  validateCredentials,
};
