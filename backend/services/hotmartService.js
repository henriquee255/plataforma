const axios = require('axios');

const HOTMART_AUTH_URL = 'https://api-sec-vlc.hotmart.com';
const HOTMART_API_URL = 'https://developers.hotmart.com/payments/api/v1';

class HotmartService {
  /**
   * Autentica com Hotmart usando OAuth 2.0
   * @param {string} client_id - Client ID da Hotmart
   * @param {string} client_secret - Client Secret da Hotmart
   * @param {string} basic_token - Basic Token da Hotmart
   * @returns {Promise<Object>} Access token e informações
   */
  async authenticate(client_id, client_secret, basic_token) {
    try {
      console.log('🔑 Autenticando com Hotmart OAuth...');
      console.log('📍 URL:', `${HOTMART_AUTH_URL}/security/oauth/token`);

      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', client_id);
      params.append('client_secret', client_secret);

      const response = await axios.post(
        `${HOTMART_AUTH_URL}/security/oauth/token`,
        params,
        {
          headers: {
            'Authorization': `Basic ${basic_token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          timeout: 10000
        }
      );

      console.log('✅ Token Hotmart recebido com sucesso!');

      return {
        success: true,
        access_token: response.data.access_token,
        token_type: response.data.token_type,
        expires_in: response.data.expires_in,
        expires_at: new Date(Date.now() + (response.data.expires_in * 1000)),
        scope: response.data.scope
      };
    } catch (error) {
      console.error('Erro ao autenticar com Hotmart:', error.response?.data || error.message);

      return {
        success: false,
        error: error.response?.data?.message || 'Credenciais inválidas',
        status: error.response?.status || 500
      };
    }
  }

  /**
   * Busca vendas da Hotmart
   * @param {string} access_token - Token de acesso OAuth
   * @param {Object} filters - Filtros de busca
   * @returns {Promise<Object>} Lista de vendas
   */
  async getSales(access_token, filters = {}) {
    try {
      const params = new URLSearchParams({
        max_results: filters.limit || 100,
        page_token: filters.page_token || '',
        start_date: filters.start_date || '',
        end_date: filters.end_date || ''
      });

      const response = await axios.get(
        `${HOTMART_API_URL}/sales?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      return {
        success: true,
        data: response.data,
        total: response.data.page_info?.total_results || 0,
        sales: response.data.items || []
      };
    } catch (error) {
      console.error('Erro ao buscar vendas Hotmart:', error.response?.data || error.message);

      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao buscar vendas',
        status: error.response?.status || 500
      };
    }
  }

  /**
   * Busca informações de assinatura
   * @param {string} access_token - Token de acesso OAuth
   * @param {string} subscriber_code - Código do assinante
   * @returns {Promise<Object>} Dados da assinatura
   */
  async getSubscription(access_token, subscriber_code) {
    try {
      const response = await axios.get(
        `${HOTMART_API_URL}/subscriptions/${subscriber_code}`,
        {
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      return {
        success: true,
        subscription: response.data
      };
    } catch (error) {
      console.error('Erro ao buscar assinatura:', error.response?.data || error.message);

      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao buscar assinatura'
      };
    }
  }

  /**
   * Busca histórico de um comprador
   * @param {string} access_token - Token de acesso OAuth
   * @param {string} buyer_email - Email do comprador
   * @returns {Promise<Object>} Histórico de compras
   */
  async getBuyerHistory(access_token, buyer_email) {
    try {
      const response = await axios.get(
        `${HOTMART_API_URL}/sales/history?buyer_email=${encodeURIComponent(buyer_email)}`,
        {
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      return {
        success: true,
        history: response.data.items || []
      };
    } catch (error) {
      console.error('Erro ao buscar histórico:', error.response?.data || error.message);

      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao buscar histórico'
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
      // Fazemos uma requisição simples para verificar o token
      const response = await axios.get(
        `${HOTMART_API_URL}/sales?max_results=1`,
        {
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );

      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   * Processa webhook (Postback) da Hotmart
   * @param {Object} payload - Dados do webhook
   * @returns {Object} Dados processados
   */
  processWebhook(payload) {
    const eventType = payload.event;

    // Estrutura padrão da Hotmart
    const buyer = payload.data?.buyer || {};
    const product = payload.data?.product || {};
    const purchase = payload.data?.purchase || {};
    const commission = payload.data?.commission || {};
    const subscription = payload.data?.subscription || {};

    switch (eventType) {
      case 'PURCHASE_COMPLETE':
        return {
          event: 'purchase',
          customer: {
            name: buyer.name || '',
            email: buyer.email || '',
            document: buyer.document || '',
            phone: buyer.checkout_phone || ''
          },
          product: {
            id: product.id || '',
            name: product.name || '',
            price: purchase.price?.value || 0
          },
          sale: {
            id: purchase.transaction || '',
            status: purchase.status || 'approved',
            payment_type: purchase.payment?.type || '',
            value: purchase.price?.value || 0,
            currency: purchase.price?.currency_code || 'BRL',
            created_at: purchase.approved_date || new Date()
          },
          commission: {
            value: commission.value || 0,
            currency: commission.currency_code || 'BRL'
          }
        };

      case 'PURCHASE_REFUNDED':
        return {
          event: 'refund',
          sale_id: purchase.transaction || '',
          refund_amount: purchase.price?.value || 0,
          refund_reason: 'Cliente solicitou reembolso',
          refunded_at: new Date()
        };

      case 'PURCHASE_CANCELED':
        return {
          event: 'canceled',
          sale_id: purchase.transaction || '',
          canceled_at: new Date()
        };

      case 'SUBSCRIPTION_CANCELLATION':
        return {
          event: 'subscription_canceled',
          subscription_id: subscription.subscriber_code || '',
          customer_email: buyer.email || '',
          canceled_at: new Date()
        };

      case 'PURCHASE_PROTEST':
        return {
          event: 'chargeback',
          sale_id: purchase.transaction || '',
          reason: 'Contestação de compra'
        };

      default:
        return {
          event: 'unknown',
          type: eventType,
          payload
        };
    }
  }

  /**
   * Valida assinatura do webhook Hotmart
   * @param {string} receivedHash - Hash recebido no header
   * @param {string} calculatedHash - Hash calculado localmente
   * @returns {boolean} True se válido
   */
  validateWebhookSignature(receivedHash, calculatedHash) {
    // A Hotmart envia um hash HMAC no header X-Hotmart-Hottok
    return receivedHash === calculatedHash;
  }
}

module.exports = new HotmartService();
