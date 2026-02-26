const axios = require('axios');
const kiwifyMockService = require('./kiwifyMockService');

const KIWIFY_API_URL = 'https://public-api.kiwify.com';
const USE_MOCK = process.env.KIWIFY_USE_MOCK === 'true';

class KiwifyService {
  /**
   * Autentica com Kiwify usando OAuth 2.0
   * @param {string} client_id - Client ID da Kiwify
   * @param {string} client_secret - Client Secret da Kiwify
   * @returns {Promise<Object>} Access token e informações
   */
  async authenticate(client_id, client_secret, account_id) {
    // Usar mock se configurado
    if (USE_MOCK) {
      console.log('🔧 Modo MOCK ativado para Kiwify');
      return await kiwifyMockService.authenticate(client_id, client_secret, account_id);
    }

    try {
      // Autenticação OAuth conforme documentação oficial da Kiwify
      console.log('🔑 Autenticando com Kiwify OAuth...');
      console.log('📍 URL:', `${KIWIFY_API_URL}/v1/oauth/token`);
      console.log('🔐 Account ID:', account_id);

      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', client_id);
      params.append('client_secret', client_secret);

      const response = await axios.post(`${KIWIFY_API_URL}/v1/oauth/token`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 10000
      });

      console.log('✅ Token OAuth recebido com sucesso!');
      console.log('🔐 Access Token:', response.data.access_token ? 'Recebido' : 'Não recebido');

      return {
        success: true,
        access_token: response.data.access_token,
        token_type: response.data.token_type || 'Bearer',
        expires_in: response.data.expires_in || 3600,
        expires_at: new Date(Date.now() + ((response.data.expires_in || 3600) * 1000))
      };
    } catch (error) {
      console.error('❌ Erro completo:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        message: error.message
      });

      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Credenciais inválidas',
        status: error.response?.status || 500
      };
    }
  }

  /**
   * Busca lista de compras/vendas
   * @param {string} access_token - Token de acesso OAuth
   * @param {Object} filters - Filtros de busca
   * @returns {Promise<Object>} Lista de compras
   */
  async getPurchases(access_token, filters = {}) {
    // Usar mock se configurado
    if (USE_MOCK) {
      return await kiwifyMockService.getSales(access_token, filters);
    }

    try {
      const params = new URLSearchParams({
        page: filters.page || 1,
        limit: filters.limit || 100,
        start_date: filters.start_date || '',
        end_date: filters.end_date || ''
      });

      const response = await axios.get(`${KIWIFY_API_URL}/api/v1/sales?${params}`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'x-kiwify-account-id': process.env.KIWIFY_ACCOUNT_ID,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      return {
        success: true,
        data: response.data,
        total: response.data.total || 0,
        purchases: response.data.purchases || []
      };
    } catch (error) {
      console.error('Erro ao buscar compras Kiwify:', error.response?.data || error.message);

      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao buscar compras',
        status: error.response?.status || 500
      };
    }
  }

  /**
   * Busca produtos da conta
   * @param {string} access_token - Token de acesso OAuth
   * @returns {Promise<Object>} Lista de produtos
   */
  async getProducts(access_token) {
    // Usar mock se configurado
    if (USE_MOCK) {
      return await kiwifyMockService.getProducts(access_token);
    }

    try {
      const response = await axios.get(`${KIWIFY_API_URL}/v1/products`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      return {
        success: true,
        products: response.data.products || []
      };
    } catch (error) {
      console.error('Erro ao buscar produtos Kiwify:', error.response?.data || error.message);

      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao buscar produtos'
      };
    }
  }

  /**
   * Busca informações de uma compra específica
   * @param {string} access_token - Token de acesso OAuth
   * @param {string} purchase_id - ID da compra
   * @returns {Promise<Object>} Detalhes da compra
   */
  async getPurchaseDetails(access_token, purchase_id) {
    try {
      const response = await axios.get(`${KIWIFY_API_URL}/v1/purchases/${purchase_id}`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      return {
        success: true,
        purchase: response.data
      };
    } catch (error) {
      console.error('Erro ao buscar detalhes da compra:', error.response?.data || error.message);

      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao buscar detalhes'
      };
    }
  }

  /**
   * Verifica se o token ainda é válido
   * @param {string} access_token - Token de acesso OAuth
   * @returns {Promise<boolean>} True se válido
   */
  async verifyToken(access_token) {
    try {
      const response = await axios.get(`${KIWIFY_API_URL}/v1/account`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });

      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   * Processa webhook da Kiwify
   * @param {Object} payload - Dados do webhook
   * @returns {Object} Dados processados
   */
  processWebhook(payload) {
    const eventType = payload.type || payload.event;

    switch (eventType) {
      case 'purchase':
      case 'PURCHASE_COMPLETE':
        return {
          event: 'purchase',
          customer: {
            name: payload.customer?.name || '',
            email: payload.customer?.email || '',
            cpf: payload.customer?.cpf || '',
            phone: payload.customer?.phone || ''
          },
          product: {
            id: payload.product?.id || '',
            name: payload.product?.name || ''
          },
          sale: {
            id: payload.sale?.id || '',
            value: payload.sale?.value || 0,
            currency: payload.sale?.currency || 'BRL',
            status: payload.sale?.status || 'approved',
            payment_type: payload.sale?.payment_type || '',
            created_at: payload.sale?.created_at || new Date()
          }
        };

      case 'refund':
      case 'PURCHASE_REFUNDED':
        return {
          event: 'refund',
          sale_id: payload.sale?.id || '',
          refund_amount: payload.refund?.amount || 0,
          refund_reason: payload.refund?.reason || '',
          refunded_at: payload.refund?.created_at || new Date()
        };

      case 'subscription':
        return {
          event: 'subscription',
          subscription_id: payload.subscription?.id || '',
          status: payload.subscription?.status || '',
          customer_email: payload.customer?.email || ''
        };

      default:
        return {
          event: 'unknown',
          payload
        };
    }
  }
}

module.exports = new KiwifyService();
