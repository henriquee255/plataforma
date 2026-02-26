/**
 * Kiwify Webhook Handler
 *
 * Processa webhooks da Kiwify e cria/atualiza:
 * - Vendas
 * - Clientes
 * - Tags automáticas
 */

import crypto from 'crypto';
import { Sale, SaleModel } from '../models/Sale.js';
import { Customer, CustomerModel } from '../models/Customer.js';
import { IntegrationModel } from '../models/Integration.js';

/**
 * Processa webhook da Kiwify
 *
 * Eventos suportados:
 * - order.paid (compra aprovada)
 * - order.refunded (reembolso)
 * - order.chargeback (chargeback)
 *
 * @param {Object} webhookData - Dados do webhook
 * @returns {Object} Resultado do processamento
 */
async function processKiwifyWebhook(webhookData) {
  try {
    console.log('📥 Processando webhook Kiwify:', webhookData.event);

    // Verificar se é um evento de venda
    if (!isValidSaleEvent(webhookData.event)) {
      return {
        success: true,
        message: `Evento ${webhookData.event} ignorado`,
        ignored: true
      };
    }

    // Verificar se a venda já existe
    const existingSale = SaleModel.findByExternalId('kiwify', webhookData.order_id);

    if (existingSale && webhookData.event === 'order.paid') {
      return {
        success: true,
        message: 'Venda já processada',
        sale: existingSale
      };
    }

    // Criar venda a partir do webhook
    const sale = Sale.fromKiwifyWebhook(webhookData);

    // Salvar venda
    const savedSale = existingSale
      ? SaleModel.update(existingSale.id, sale)
      : SaleModel.create(sale);

    // Criar/atualizar cliente
    const customerData = Customer.fromKiwifyWebhook(webhookData);
    const customer = CustomerModel.upsertFromSale(savedSale, customerData);

    // Atualizar estatísticas da integração
    IntegrationModel.updateStats('kiwify', 1, savedSale.value);

    console.log('✅ Webhook Kiwify processado:', {
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
    console.error('❌ Erro ao processar webhook Kiwify:', error);
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
    'order.paid',
    'order.refunded',
    'order.chargeback',
    'order.canceled'
  ];
  return validEvents.includes(event);
}

/**
 * Valida assinatura do webhook (segurança)
 *
 * Kiwify envia um header X-Kiwify-Signature com HMAC
 *
 * @param {string} signature - Assinatura recebida
 * @param {Object} payload - Dados do webhook
 * @param {string} secret - Secret da integração
 * @returns {boolean}
 */
function validateSignature(signature, payload, secret) {
  if (!signature || !secret) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return signature === expectedSignature;
}

/**
 * Extrai dados do produto para tags automáticas
 */
function extractProductData(webhookData) {
  const product = webhookData.Product || {};

  return {
    id: product.product_id,
    name: product.product_name,
    autoTag: product.product_name?.split('-')[0]?.trim() || product.product_name
  };
}

export {
  processKiwifyWebhook,
  validateSignature,
  isValidSaleEvent,
  extractProductData
};
