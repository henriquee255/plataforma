const Stripe = require('stripe');

class StripeService {
  constructor() {
    this.stripeClients = new Map(); // Armazena instâncias de Stripe por usuário
  }

  /**
   * Cria ou recupera um cliente Stripe
   * @param {string} secret_key - Secret Key da Stripe
   * @returns {Object} Cliente Stripe
   */
  getStripeClient(secret_key) {
    if (!this.stripeClients.has(secret_key)) {
      this.stripeClients.set(secret_key, Stripe(secret_key));
    }
    return this.stripeClients.get(secret_key);
  }

  /**
   * Valida a Secret Key da Stripe
   * @param {string} secret_key - Secret Key da Stripe
   * @returns {Promise<Object>} Resultado da validação
   */
  async authenticate(secret_key) {
    try {
      const stripe = this.getStripeClient(secret_key);

      // Tenta recuperar o saldo para validar a chave
      const balance = await stripe.balance.retrieve();

      return {
        success: true,
        message: 'Secret key válida',
        account_currency: balance.available[0]?.currency || 'usd',
        test_mode: secret_key.startsWith('sk_test_')
      };
    } catch (error) {
      console.error('Erro ao autenticar com Stripe:', error.message);

      return {
        success: false,
        error: error.message || 'Secret key inválida',
        status: error.statusCode || 500
      };
    }
  }

  /**
   * Busca lista de charges (pagamentos)
   * @param {string} secret_key - Secret Key da Stripe
   * @param {Object} filters - Filtros de busca
   * @returns {Promise<Object>} Lista de charges
   */
  async getCharges(secret_key, filters = {}) {
    try {
      const stripe = this.getStripeClient(secret_key);

      const charges = await stripe.charges.list({
        limit: filters.limit || 100,
        starting_after: filters.starting_after,
        ending_before: filters.ending_before,
        created: filters.created
      });

      return {
        success: true,
        charges: charges.data,
        has_more: charges.has_more,
        total: charges.data.length
      };
    } catch (error) {
      console.error('Erro ao buscar charges:', error.message);

      return {
        success: false,
        error: error.message || 'Erro ao buscar pagamentos'
      };
    }
  }

  /**
   * Busca clientes da Stripe
   * @param {string} secret_key - Secret Key da Stripe
   * @param {Object} filters - Filtros de busca
   * @returns {Promise<Object>} Lista de clientes
   */
  async getCustomers(secret_key, filters = {}) {
    try {
      const stripe = this.getStripeClient(secret_key);

      const customers = await stripe.customers.list({
        limit: filters.limit || 100,
        email: filters.email,
        starting_after: filters.starting_after
      });

      return {
        success: true,
        customers: customers.data,
        has_more: customers.has_more,
        total: customers.data.length
      };
    } catch (error) {
      console.error('Erro ao buscar clientes:', error.message);

      return {
        success: false,
        error: error.message || 'Erro ao buscar clientes'
      };
    }
  }

  /**
   * Busca assinaturas ativas
   * @param {string} secret_key - Secret Key da Stripe
   * @param {Object} filters - Filtros de busca
   * @returns {Promise<Object>} Lista de assinaturas
   */
  async getSubscriptions(secret_key, filters = {}) {
    try {
      const stripe = this.getStripeClient(secret_key);

      const subscriptions = await stripe.subscriptions.list({
        limit: filters.limit || 100,
        status: filters.status || 'active',
        customer: filters.customer_id
      });

      return {
        success: true,
        subscriptions: subscriptions.data,
        has_more: subscriptions.has_more,
        total: subscriptions.data.length
      };
    } catch (error) {
      console.error('Erro ao buscar assinaturas:', error.message);

      return {
        success: false,
        error: error.message || 'Erro ao buscar assinaturas'
      };
    }
  }

  /**
   * Busca produtos
   * @param {string} secret_key - Secret Key da Stripe
   * @returns {Promise<Object>} Lista de produtos
   */
  async getProducts(secret_key) {
    try {
      const stripe = this.getStripeClient(secret_key);

      const products = await stripe.products.list({
        limit: 100,
        active: true
      });

      // Busca os preços de cada produto
      const productsWithPrices = await Promise.all(
        products.data.map(async (product) => {
          const prices = await stripe.prices.list({
            product: product.id,
            active: true
          });

          return {
            ...product,
            prices: prices.data
          };
        })
      );

      return {
        success: true,
        products: productsWithPrices,
        total: productsWithPrices.length
      };
    } catch (error) {
      console.error('Erro ao buscar produtos:', error.message);

      return {
        success: false,
        error: error.message || 'Erro ao buscar produtos'
      };
    }
  }

  /**
   * Busca detalhes de um pagamento específico
   * @param {string} secret_key - Secret Key da Stripe
   * @param {string} charge_id - ID do charge
   * @returns {Promise<Object>} Detalhes do pagamento
   */
  async getChargeDetails(secret_key, charge_id) {
    try {
      const stripe = this.getStripeClient(secret_key);

      const charge = await stripe.charges.retrieve(charge_id);

      return {
        success: true,
        charge
      };
    } catch (error) {
      console.error('Erro ao buscar detalhes do pagamento:', error.message);

      return {
        success: false,
        error: error.message || 'Erro ao buscar detalhes'
      };
    }
  }

  /**
   * Verifica se a chave é válida
   * @param {string} secret_key - Secret Key da Stripe
   * @returns {Promise<boolean>} True se válida
   */
  async verifyKey(secret_key) {
    try {
      const stripe = this.getStripeClient(secret_key);
      await stripe.balance.retrieve();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Processa webhook da Stripe
   * @param {string} payload - Raw body do webhook
   * @param {string} signature - Assinatura do header stripe-signature
   * @param {string} webhook_secret - Webhook secret configurado
   * @returns {Object} Evento processado
   */
  processWebhook(payload, signature, webhook_secret) {
    try {
      const stripe = Stripe(process.env.STRIPE_SECRET_KEY || '');

      // Verifica a assinatura do webhook
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        webhook_secret
      );

      const data = event.data.object;

      switch (event.type) {
        case 'charge.succeeded':
          return {
            event: 'payment_succeeded',
            customer: {
              id: data.customer,
              email: data.billing_details?.email || '',
              name: data.billing_details?.name || ''
            },
            payment: {
              id: data.id,
              amount: data.amount / 100, // Stripe usa centavos
              currency: data.currency,
              status: data.status,
              created_at: new Date(data.created * 1000)
            }
          };

        case 'charge.refunded':
          return {
            event: 'payment_refunded',
            charge_id: data.id,
            amount_refunded: data.amount_refunded / 100,
            refund_reason: data.refunds?.data[0]?.reason || '',
            refunded_at: new Date()
          };

        case 'customer.created':
          return {
            event: 'customer_created',
            customer: {
              id: data.id,
              email: data.email,
              name: data.name,
              created_at: new Date(data.created * 1000)
            }
          };

        case 'customer.subscription.created':
          return {
            event: 'subscription_created',
            subscription: {
              id: data.id,
              customer_id: data.customer,
              status: data.status,
              current_period_end: new Date(data.current_period_end * 1000)
            }
          };

        case 'customer.subscription.deleted':
          return {
            event: 'subscription_canceled',
            subscription_id: data.id,
            canceled_at: new Date(data.canceled_at * 1000)
          };

        case 'invoice.payment_succeeded':
          return {
            event: 'invoice_paid',
            invoice: {
              id: data.id,
              customer_id: data.customer,
              amount_paid: data.amount_paid / 100,
              currency: data.currency
            }
          };

        case 'invoice.payment_failed':
          return {
            event: 'invoice_failed',
            invoice_id: data.id,
            customer_id: data.customer,
            attempt_count: data.attempt_count
          };

        default:
          return {
            event: 'unknown',
            type: event.type,
            data
          };
      }
    } catch (error) {
      console.error('Erro ao processar webhook Stripe:', error.message);

      return {
        success: false,
        error: error.message,
        valid: false
      };
    }
  }

  /**
   * Limpa cliente da memória (quando desconectar)
   * @param {string} secret_key - Secret Key da Stripe
   */
  clearClient(secret_key) {
    this.stripeClients.delete(secret_key);
  }
}

module.exports = new StripeService();
