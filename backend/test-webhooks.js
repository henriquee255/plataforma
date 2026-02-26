/**
 * Script de Teste de Webhooks
 *
 * Envia webhooks de exemplo para testar o sistema
 */

// Webhook de exemplo da Kiwify
const kiwifyWebhookExample = {
  event: 'order.paid',
  order_id: 'kw_123456789',
  order_amount: 49700, // R$ 497,00 em centavos
  order_status: 'paid',
  subscription_id: null, // null = vitalício
  commissions_amount: 24850, // R$ 248,50
  Customer: {
    full_name: 'João da Silva',
    email: 'joao.silva@email.com',
    CPF: '123.456.789-00',
    phone: '+55 11 98765-4321'
  },
  Product: {
    product_id: 'prod_001',
    product_name: 'Super Links - Plano Vitalício'
  }
};

// Webhook de exemplo da Hotmart
const hotmartWebhookExample = {
  event: 'PURCHASE_COMPLETE',
  data: {
    purchase: {
      transaction: 'hot_987654321',
      status: 'approved',
      price: {
        value: 97.00,
        currency_code: 'BRL'
      },
      buyer: {
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
        phone: '+55 11 98765-4322'
      },
      product: {
        id: 'prod_002',
        name: 'Super Presell - Assinatura Mensal'
      },
      subscription: {
        plan: {
          name: 'Plano Mensal'
        }
      },
      commissions: [
        {
          value: 48.50
        }
      ]
    }
  }
};

async function testWebhooks() {
  console.log('🧪 Iniciando testes de webhooks...\n');

  // Teste 1: Webhook Kiwify
  console.log('📨 Teste 1: Enviando webhook Kiwify...');
  try {
    const response = await fetch('http://localhost:3001/api/webhooks/kiwify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(kiwifyWebhookExample)
    });

    const data = await response.json();
    console.log('✅ Resposta Kiwify:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Erro Kiwify:', error.message);
  }

  console.log('\n---\n');

  // Teste 2: Webhook Hotmart
  console.log('📨 Teste 2: Enviando webhook Hotmart...');
  try {
    const response = await fetch('http://localhost:3001/api/webhooks/hotmart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(hotmartWebhookExample)
    });

    const data = await response.json();
    console.log('✅ Resposta Hotmart:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Erro Hotmart:', error.message);
  }

  console.log('\n---\n');

  // Teste 3: Listar Integrações
  console.log('📋 Teste 3: Listando integrações...');
  try {
    const response = await fetch('http://localhost:3001/api/integrations');
    const data = await response.json();
    console.log('✅ Integrações:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }

  console.log('\n---\n');

  // Teste 4: Dados da Kiwify
  console.log('📊 Teste 4: Consultando dados da Kiwify...');
  try {
    const response = await fetch('http://localhost:3001/api/integrations/kiwify/data');
    const data = await response.json();
    console.log('✅ Dados Kiwify:');
    console.log('  - Total de Clientes:', data.data?.stats?.totalClients || 0);
    console.log('  - Total de Vendas:', data.data?.stats?.totalSales || 0);
    console.log('  - Receita Total: R$', data.data?.stats?.totalRevenue?.toFixed(2) || '0.00');
    console.log('  - Produtos:', data.data?.products?.length || 0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }

  console.log('\n---\n');

  // Teste 5: Dados da Hotmart
  console.log('📊 Teste 5: Consultando dados da Hotmart...');
  try {
    const response = await fetch('http://localhost:3001/api/integrations/hotmart/data');
    const data = await response.json();
    console.log('✅ Dados Hotmart:');
    console.log('  - Total de Clientes:', data.data?.stats?.totalClients || 0);
    console.log('  - Total de Vendas:', data.data?.stats?.totalSales || 0);
    console.log('  - Receita Total: R$', data.data?.stats?.totalRevenue?.toFixed(2) || '0.00');
    console.log('  - Produtos:', data.data?.products?.length || 0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }

  console.log('\n✅ Testes concluídos!\n');
}

// Executar testes
testWebhooks().catch(console.error);
