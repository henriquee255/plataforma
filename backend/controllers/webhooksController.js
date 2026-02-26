const kiwifyService = require('../services/kiwifyService');
const hotmartService = require('../services/hotmartService');
const stripeService = require('../services/stripeService');
const Integration = require('../models/Integration');
const Customer = require('../models/Customer');
const Sale = require('../models/Sale');
const Tag = require('../models/Tag');

class WebhooksController {
  /**
   * Webhook da Kiwify
   */
  async handleKiwifyWebhook(req, res) {
    try {
      console.log('📥 Webhook Kiwify recebido:', req.body);

      // Processa o payload
      const processedData = kiwifyService.processWebhook(req.body);

      // Busca a integração correspondente
      // TODO: Validar o account_id do webhook com as integrações cadastradas
      const integration = await Integration.findOne({
        platform: 'kiwify',
        status: 'active'
      });

      if (!integration) {
        console.warn('⚠️ Nenhuma integração Kiwify ativa encontrada');
        return res.status(200).json({ received: true }); // Retorna 200 para não receber retry
      }

      // Processa baseado no tipo de evento
      switch (processedData.event) {
        case 'purchase':
          await this.processPurchase(integration.userId, 'kiwify', processedData);
          break;

        case 'refund':
          await this.processRefund(integration.userId, processedData);
          break;

        case 'subscription':
          await this.processSubscription(integration.userId, processedData);
          break;

        default:
          console.log('ℹ️ Evento desconhecido:', processedData.event);
      }

      // Atualiza última sincronização
      integration.lastSync = new Date();
      await integration.save();

      res.status(200).json({
        success: true,
        message: 'Webhook processado com sucesso'
      });
    } catch (error) {
      console.error('❌ Erro ao processar webhook Kiwify:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao processar webhook'
      });
    }
  }

  /**
   * Webhook da Hotmart
   */
  async handleHotmartWebhook(req, res) {
    try {
      console.log('📥 Webhook Hotmart recebido:', req.body);

      // Valida assinatura do webhook (se configurado)
      const hottok = req.headers['x-hotmart-hottok'];
      if (hottok) {
        // TODO: Validar o hottok com hash HMAC
        console.log('🔐 Hottok recebido:', hottok);
      }

      // Processa o payload
      const processedData = hotmartService.processWebhook(req.body);

      // Busca a integração correspondente
      const integration = await Integration.findOne({
        platform: 'hotmart',
        status: 'active'
      });

      if (!integration) {
        console.warn('⚠️ Nenhuma integração Hotmart ativa encontrada');
        return res.status(200).json({ received: true });
      }

      // Processa baseado no tipo de evento
      switch (processedData.event) {
        case 'purchase':
          await this.processPurchase(integration.userId, 'hotmart', processedData);
          break;

        case 'refund':
          await this.processRefund(integration.userId, processedData);
          break;

        case 'canceled':
          await this.processCancellation(integration.userId, processedData);
          break;

        case 'subscription_canceled':
          await this.processSubscriptionCancellation(integration.userId, processedData);
          break;

        case 'chargeback':
          await this.processChargeback(integration.userId, processedData);
          break;

        default:
          console.log('ℹ️ Evento desconhecido:', processedData.event);
      }

      // Atualiza última sincronização
      integration.lastSync = new Date();
      await integration.save();

      res.status(200).json({
        success: true,
        message: 'Webhook processado com sucesso'
      });
    } catch (error) {
      console.error('❌ Erro ao processar webhook Hotmart:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao processar webhook'
      });
    }
  }

  /**
   * Webhook do Stripe
   */
  async handleStripeWebhook(req, res) {
    try {
      const signature = req.headers['stripe-signature'];

      console.log('📥 Webhook Stripe recebido');

      // Busca a integração Stripe ativa
      const integration = await Integration.findOne({
        platform: 'stripe',
        status: 'active'
      });

      if (!integration) {
        console.warn('⚠️ Nenhuma integração Stripe ativa encontrada');
        return res.status(200).json({ received: true });
      }

      const webhook_secret = integration.credentials.get('webhook_secret');

      // Processa e valida o webhook
      const processedData = stripeService.processWebhook(
        req.body,
        signature,
        webhook_secret
      );

      if (!processedData.success && processedData.valid === false) {
        console.error('❌ Assinatura do webhook Stripe inválida');
        return res.status(400).json({
          success: false,
          message: 'Assinatura inválida'
        });
      }

      // Processa baseado no tipo de evento
      switch (processedData.event) {
        case 'payment_succeeded':
          await this.processPurchase(integration.userId, 'stripe', processedData);
          break;

        case 'payment_refunded':
          await this.processRefund(integration.userId, processedData);
          break;

        case 'customer_created':
          await this.processCustomerCreation(integration.userId, processedData);
          break;

        case 'subscription_created':
          await this.processSubscription(integration.userId, processedData);
          break;

        case 'subscription_canceled':
          await this.processSubscriptionCancellation(integration.userId, processedData);
          break;

        case 'invoice_paid':
          await this.processInvoicePayment(integration.userId, processedData);
          break;

        case 'invoice_failed':
          await this.processInvoiceFailure(integration.userId, processedData);
          break;

        default:
          console.log('ℹ️ Evento desconhecido:', processedData.event);
      }

      // Atualiza última sincronização
      integration.lastSync = new Date();
      await integration.save();

      res.status(200).json({
        success: true,
        message: 'Webhook processado com sucesso'
      });
    } catch (error) {
      console.error('❌ Erro ao processar webhook Stripe:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao processar webhook'
      });
    }
  }

  // ========== PROCESSADORES DE EVENTOS ==========

  /**
   * Processa uma compra/venda
   */
  async processPurchase(userId, platform, data) {
    try {
      console.log('💰 Processando compra:', data);

      // Cria ou atualiza cliente
      let customer = await Customer.findOne({
        userId,
        email: data.customer.email
      });

      // Criar tag automaticamente baseada no produto
      const productName = data.product?.name || 'Produto';
      const tagName = productName.split('-')[0].trim(); // "Super Links - Plano" -> "Super Links"

      // Usar Tag.findOrCreate para garantir que a tag existe
      const tag = await Tag.findOrCreate(userId, tagName, platform, data.product?.id || '');

      if (!customer) {
        customer = new Customer({
          userId,
          name: data.customer.name,
          email: data.customer.email,
          phone: data.customer.phone || '',
          document: data.customer.cpf || data.customer.document || '',
          source: platform,
          tags: [tagName] // Tag formatada
        });

        await customer.save();
        console.log(`✅ Cliente criado: ${customer.email} com tag "${tagName}"`);
      } else {
        // Adiciona tag usando o método do modelo
        customer.addTag(tagName);
        await customer.save();
        console.log(`🏷️ Tag "${tagName}" adicionada ao cliente: ${customer.email}`);
      }

      // Atualizar contagem de clientes na tag
      await tag.updateCustomerCount();

      // Cria registro de venda
      const sale = new Sale({
        userId,
        customerId: customer._id,
        platform,
        externalId: data.sale.id,
        productName,
        productId: data.product?.id || '',
        amount: data.sale.value,
        currency: data.sale.currency || 'BRL',
        status: data.sale.status,
        paymentType: data.sale.payment_type || '',
        saleDate: data.sale.created_at || new Date()
      });

      await sale.save();
      console.log(`✅ Venda registrada: ${sale.externalId} - ${productName}`);

      return { customer, sale, tag };
    } catch (error) {
      console.error('❌ Erro ao processar compra:', error);
      throw error;
    }
  }

  /**
   * Processa um reembolso
   */
  async processRefund(userId, data) {
    try {
      console.log('💸 Processando reembolso:', data);

      // Busca a venda original
      const sale = await Sale.findOne({
        userId,
        externalId: data.sale_id || data.charge_id
      });

      if (sale) {
        sale.status = 'refunded';
        sale.refundedAt = data.refunded_at || new Date();
        sale.refundAmount = data.refund_amount || sale.amount;
        sale.refundReason = data.refund_reason || '';

        await sale.save();
        console.log('✅ Reembolso processado:', sale.externalId);
      } else {
        console.warn('⚠️ Venda não encontrada para reembolso:', data.sale_id || data.charge_id);
      }
    } catch (error) {
      console.error('❌ Erro ao processar reembolso:', error);
      throw error;
    }
  }

  /**
   * Processa cancelamento de compra
   */
  async processCancellation(userId, data) {
    try {
      console.log('❌ Processando cancelamento:', data);

      const sale = await Sale.findOne({
        userId,
        externalId: data.sale_id
      });

      if (sale) {
        sale.status = 'canceled';
        sale.canceledAt = data.canceled_at || new Date();
        await sale.save();
        console.log('✅ Cancelamento processado:', sale.externalId);
      }
    } catch (error) {
      console.error('❌ Erro ao processar cancelamento:', error);
      throw error;
    }
  }

  /**
   * Processa assinatura
   */
  async processSubscription(userId, data) {
    try {
      console.log('🔄 Processando assinatura:', data);

      // TODO: Criar model de Subscription
      // Por enquanto, apenas loga
      console.log('ℹ️ Subscription data:', data);
    } catch (error) {
      console.error('❌ Erro ao processar assinatura:', error);
      throw error;
    }
  }

  /**
   * Processa cancelamento de assinatura
   */
  async processSubscriptionCancellation(userId, data) {
    try {
      console.log('❌ Processando cancelamento de assinatura:', data);

      // TODO: Atualizar status da subscription
      console.log('ℹ️ Subscription canceled:', data.subscription_id);
    } catch (error) {
      console.error('❌ Erro ao processar cancelamento de assinatura:', error);
      throw error;
    }
  }

  /**
   * Processa chargeback
   */
  async processChargeback(userId, data) {
    try {
      console.log('⚠️ Processando chargeback:', data);

      const sale = await Sale.findOne({
        userId,
        externalId: data.sale_id
      });

      if (sale) {
        sale.status = 'chargeback';
        sale.chargebackAt = new Date();
        await sale.save();
        console.log('✅ Chargeback processado:', sale.externalId);
      }
    } catch (error) {
      console.error('❌ Erro ao processar chargeback:', error);
      throw error;
    }
  }

  /**
   * Processa criação de cliente (Stripe)
   */
  async processCustomerCreation(userId, data) {
    try {
      console.log('👤 Processando criação de cliente:', data);

      const customer = new Customer({
        userId,
        name: data.customer.name || '',
        email: data.customer.email,
        source: 'stripe',
        externalId: data.customer.id,
        tags: ['stripe']
      });

      await customer.save();
      console.log('✅ Cliente Stripe criado:', customer.email);
    } catch (error) {
      console.error('❌ Erro ao processar criação de cliente:', error);
      throw error;
    }
  }

  /**
   * Processa pagamento de invoice
   */
  async processInvoicePayment(userId, data) {
    try {
      console.log('📄 Processando pagamento de invoice:', data);

      // TODO: Criar registro de invoice
      console.log('ℹ️ Invoice paid:', data.invoice.id);
    } catch (error) {
      console.error('❌ Erro ao processar pagamento de invoice:', error);
      throw error;
    }
  }

  /**
   * Processa falha de invoice
   */
  async processInvoiceFailure(userId, data) {
    try {
      console.log('⚠️ Processando falha de invoice:', data);

      // TODO: Notificar sobre falha
      console.log('ℹ️ Invoice failed:', data.invoice_id);
    } catch (error) {
      console.error('❌ Erro ao processar falha de invoice:', error);
      throw error;
    }
  }
}

module.exports = new WebhooksController();
