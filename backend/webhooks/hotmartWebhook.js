/**
 * Hotmart Webhook Handler
 *
 * Processa webhooks da Hotmart e cria/atualiza:
 * - Vendas
 * - Clientes
 * - Tags automáticas
 */

import { Sale, SaleModel } from '../models/Sale.js';
import { Customer, CustomerModel } from '../models/Customer.js';
import { IntegrationModel } from '../models/Integration.js';

/**
 * Processa webhook da Hotmart
 *
 * Eventos suportados:
 * - PURCHASE_COMPLETE (compra aprovada)
 * - PURCHASE_REFUNDED (reembolso)
 * - PURCHASE_CHARGEBACK (chargeback)
 * - PURCHASE_CANCELED (cancelamento)
 *
 * @param {Object} webhookData - Dados do webhook
 * @returns {Object} Resultado do processamento
 */
async function processHotmartWebhook(webhookData) {
  try {
    console.log('📥 Processando webhook Hotmart:', webhookData.event);

    // Verificar se é um evento de venda
    if (!isValidSaleEvent(webhookData.event)) {
      return {
        success: true,
        message: `Evento ${webhookData.event} ignorado`,
        ignored: true
      };
    }

    const purchase = webhookData.data?.purchase || webhookData.data;

    // Verificar se a venda já existe
    const existingSale = SaleModel.findByExternalId('hotmart', purchase.transaction);

    if (existingSale && webhookData.event === 'PURCHASE_COMPLETE') {
      return {
        success: true,
        message: 'Venda já processada',
        sale: existingSale
      };
    }

    // Criar venda a partir do webhook
    const sale = Sale.fromHotmartWebhook(webhookData);

    // Salvar venda
    const savedSale = existingSale
      ? SaleModel.update(existingSale.id, sale)
      : SaleModel.create(sale);

    // Criar/atualizar cliente
    const customerData = Customer.fromHotmartWebhook(webhookData);
    const customer = CustomerModel.upsertFromSale(savedSale, customerData);

    // Atualizar estatísticas da integração
    IntegrationModel.updateStats('hotmart', 1, savedSale.value);

    console.log('✅ Webhook Hotmart processado:', {
      sale: savedSale.id,
      customer: customer.id,
      value: savedSale.value
    });

    return {
      success: true,
      message: 'Webhook processado com sucesso',
      data: {
        sale: savedSale,
        customer: customer
      }
    };
  } catch (error) {
    console.error('❌ Erro ao processar webhook Hotmart:', error);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
}

/**
 * Valida se o evento é um evento de venda válido
 */
function isValidSaleEvent(event) {
  const validEvents = [
    'PURCHASE_COMPLETE',
    'PURCHASE_APPROVED',
    'PURCHASE_REFUNDED',
    'PURCHASE_CHARGEBACK',
    'PURCHASE_CANCELED',
    'PURCHASE_DELAYED'
  ];
  return validEvents.includes(event);
}

/**
 * Valida assinatura do webhook (segurança)
 *
 * Hotmart envia um header X-Hotmart-Hottok para validação
 *
 * @param {string} hottok - Token recebido no header
 * @param {string} configuredToken - Token configurado na integração
 * @returns {boolean}
 */
function validateSignature(hottok, configuredToken) {
  if (!hottok || !configuredToken) {
    return false;
  }

  return hottok === configuredToken;
}

/**
 * Extrai dados do produto para tags automáticas
 */
function extractProductData(webhookData) {
  const product = webhookData.data?.purchase?.product || webhookData.data?.product;

  return {
    id: product?.id,
    name: product?.name,
    autoTag: product?.name?.split('-')[0]?.trim() || product?.name
  };
}

/**
 * Detecta tipo de assinatura
 */
function detectSubscriptionType(subscription) {
  if (!subscription) return 'Vitalício';

  const plan = subscription.plan?.name?.toLowerCase() || '';

  if (plan.includes('anual') || plan.includes('ano')) return 'Anual';
  if (plan.includes('trimestral')) return 'Trimestral';
  if (plan.includes('semestral')) return 'Semestral';

  return 'Mensal';
}

export {
  processHotmartWebhook,
  validateSignature,
  isValidSaleEvent,
  extractProductData,
  detectSubscriptionType
};
