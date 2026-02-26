/**
 * Serviço Mock da Kiwify
 * Simula dados reais enquanto a API oficial não está autenticando
 */

class KiwifyMockService {
  /**
   * Simula autenticação bem-sucedida
   */
  async authenticate(client_id, client_secret, account_id) {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      access_token: client_secret,
      account_data: {
        id: account_id,
        name: 'Conta Kiwify Demo',
        email: 'demo@kiwify.com',
        status: 'active'
      },
      expires_at: new Date(Date.now() + (96 * 60 * 60 * 1000)),
      mock: true // Flag indicando que são dados mockados
    };
  }

  /**
   * Retorna produtos mockados
   */
  async getProducts(access_token) {
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      success: true,
      data: {
        products: [
          {
            id: 'prod_001',
            name: 'Super Links - Gerador de Links',
            price: 197.00,
            currency: 'BRL',
            type: 'vitalicia',
            description: 'Ferramenta completa para criar links profissionais',
            active: true,
            sales_count: 145
          },
          {
            id: 'prod_002',
            name: 'Super Presell - Landing Pages',
            price: 297.00,
            currency: 'BRL',
            type: 'mensal',
            description: 'Crie páginas de pré-venda de alta conversão',
            active: true,
            sales_count: 87
          },
          {
            id: 'prod_003',
            name: 'Pack Completo - Links + Presell',
            price: 397.00,
            currency: 'BRL',
            type: 'anual',
            description: 'Todos os produtos com desconto especial',
            active: true,
            sales_count: 234
          }
        ],
        total: 3
      },
      mock: true
    };
  }

  /**
   * Retorna vendas mockadas
   */
  async getSales(access_token, filters = {}) {
    await new Promise(resolve => setTimeout(resolve, 400));

    const sales = [
      {
        id: 'sale_001',
        order_id: 'ORD-2026-001',
        product_id: 'prod_001',
        product_name: 'Super Links - Gerador de Links',
        customer: {
          id: 'cust_001',
          name: 'João Silva',
          email: 'joao.silva@email.com',
          cpf: '123.456.789-00',
          phone: '+55 11 99999-1111'
        },
        amount: 197.00,
        currency: 'BRL',
        status: 'approved',
        payment_type: 'credit_card',
        sale_date: '2026-02-20T14:30:00Z',
        subscription_type: 'vitalicia'
      },
      {
        id: 'sale_002',
        order_id: 'ORD-2026-002',
        product_id: 'prod_002',
        product_name: 'Super Presell - Landing Pages',
        customer: {
          id: 'cust_002',
          name: 'Maria Santos',
          email: 'maria.santos@email.com',
          cpf: '987.654.321-00',
          phone: '+55 21 98888-2222'
        },
        amount: 297.00,
        currency: 'BRL',
        status: 'approved',
        payment_type: 'pix',
        sale_date: '2026-02-21T10:15:00Z',
        subscription_type: 'mensal'
      },
      {
        id: 'sale_003',
        order_id: 'ORD-2026-003',
        product_id: 'prod_003',
        product_name: 'Pack Completo - Links + Presell',
        customer: {
          id: 'cust_003',
          name: 'Pedro Costa',
          email: 'pedro.costa@email.com',
          cpf: '456.789.123-00',
          phone: '+55 11 97777-3333'
        },
        amount: 397.00,
        currency: 'BRL',
        status: 'approved',
        payment_type: 'boleto',
        sale_date: '2026-02-22T16:45:00Z',
        subscription_type: 'anual'
      },
      {
        id: 'sale_004',
        order_id: 'ORD-2026-004',
        product_id: 'prod_001',
        product_name: 'Super Links - Gerador de Links',
        customer: {
          id: 'cust_004',
          name: 'Ana Oliveira',
          email: 'ana.oliveira@email.com',
          cpf: '321.654.987-00',
          phone: '+55 21 96666-4444'
        },
        amount: 197.00,
        currency: 'BRL',
        status: 'refunded',
        payment_type: 'credit_card',
        sale_date: '2026-02-18T09:20:00Z',
        refund_date: '2026-02-23T11:30:00Z',
        refund_amount: 197.00,
        refund_reason: 'Não atendeu às expectativas',
        subscription_type: 'vitalicia'
      },
      {
        id: 'sale_005',
        order_id: 'ORD-2026-005',
        product_id: 'prod_002',
        product_name: 'Super Presell - Landing Pages',
        customer: {
          id: 'cust_005',
          name: 'Carlos Mendes',
          email: 'carlos.mendes@email.com',
          cpf: '789.123.456-00',
          phone: '+55 11 95555-5555'
        },
        amount: 297.00,
        currency: 'BRL',
        status: 'approved',
        payment_type: 'pix',
        sale_date: '2026-02-24T13:10:00Z',
        subscription_type: 'mensal'
      }
    ];

    return {
      success: true,
      data: {
        sales,
        total: sales.length,
        total_amount: sales.reduce((sum, sale) =>
          sale.status === 'approved' ? sum + sale.amount : sum, 0
        ),
        total_refunded: sales.reduce((sum, sale) =>
          sale.status === 'refunded' ? sum + sale.refund_amount : sum, 0
        )
      },
      mock: true
    };
  }

  /**
   * Retorna estatísticas mockadas
   */
  async getStats(access_token) {
    await new Promise(resolve => setTimeout(resolve, 200));

    return {
      success: true,
      data: {
        total_sales: 1385.00,
        total_refunds: 197.00,
        net_revenue: 1188.00,
        total_customers: 5,
        avg_ticket: 277.00,
        conversion_rate: 15.5,
        sales_count: 5,
        refunds_count: 1,
        period: {
          start: '2026-02-18',
          end: '2026-02-25'
        }
      },
      mock: true
    };
  }

  /**
   * Simula processamento de webhook
   */
  processWebhook(payload) {
    const eventType = payload.type || payload.event;

    switch (eventType) {
      case 'purchase':
      case 'sale.approved':
        return {
          event: 'purchase',
          customer: {
            id: payload.customer?.id || `cust_${Date.now()}`,
            name: payload.customer?.name || 'Cliente Demo',
            email: payload.customer?.email || 'demo@example.com',
            cpf: payload.customer?.cpf || '000.000.000-00',
            phone: payload.customer?.phone || '+55 11 00000-0000'
          },
          product: {
            id: payload.product?.id || 'prod_demo',
            name: payload.product?.name || 'Produto Demo'
          },
          sale: {
            id: payload.sale?.id || `sale_${Date.now()}`,
            order_id: payload.sale?.order_id || `ORD-${Date.now()}`,
            value: payload.sale?.value || payload.amount || 0,
            status: 'approved',
            date: new Date().toISOString()
          },
          mock: true
        };

      case 'refund':
      case 'sale.refunded':
        return {
          event: 'refund',
          sale_id: payload.sale_id,
          refund_amount: payload.refund_amount || 0,
          refund_reason: payload.refund_reason || '',
          refund_date: new Date().toISOString(),
          mock: true
        };

      default:
        return {
          event: 'unknown',
          payload,
          mock: true
        };
    }
  }
}

module.exports = new KiwifyMockService();
