import React, { useState } from 'react';
import { FaPlay, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

/**
 * Página de Teste de Integrações
 *
 * Permite testar webhooks e APIs das integrações
 */
const IntegrationsTest = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const API_URL = 'http://localhost:3001/api';

  // Payloads de exemplo
  const kiwifyPayload = {
    event: 'order.paid',
    order_id: `kw_${Date.now()}`,
    order_amount: 49700,
    order_status: 'paid',
    subscription_id: null,
    commissions_amount: 24850,
    Customer: {
      full_name: 'João da Silva (Teste)',
      email: `joao.teste${Date.now()}@email.com`,
      CPF: '123.456.789-00',
      phone: '+55 11 98765-4321'
    },
    Product: {
      product_id: 'prod_001',
      product_name: 'Super Links - Plano Vitalício'
    }
  };

  const hotmartPayload = {
    event: 'PURCHASE_COMPLETE',
    data: {
      purchase: {
        transaction: `hot_${Date.now()}`,
        status: 'approved',
        price: {
          value: 97.00,
          currency_code: 'BRL'
        },
        buyer: {
          name: 'Maria Santos (Teste)',
          email: `maria.teste${Date.now()}@email.com`,
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

  const addResult = (test, success, message, data = null) => {
    setResults(prev => [...prev, {
      id: Date.now(),
      test,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runTest = async (testName, url, method = 'GET', body = null) => {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok) {
        addResult(testName, true, data.message || 'Sucesso', data);
      } else {
        addResult(testName, false, data.message || 'Erro', data);
      }
    } catch (error) {
      addResult(testName, false, error.message);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setResults([]);

    // Teste 1: Health Check
    await runTest('Health Check', `${API_URL.replace('/api', '')}/health`);

    // Teste 2: Webhook Test
    await runTest('Teste Webhooks', `${API_URL}/webhooks/test`);

    // Teste 3: Listar Integrações
    await runTest('Listar Integrações', `${API_URL}/integrations`);

    // Teste 4: Webhook Kiwify
    await runTest('Webhook Kiwify', `${API_URL}/webhooks/kiwify`, 'POST', kiwifyPayload);

    // Teste 5: Webhook Hotmart
    await runTest('Webhook Hotmart', `${API_URL}/webhooks/hotmart`, 'POST', hotmartPayload);

    // Teste 6: Dados Kiwify
    await runTest('Dados Kiwify', `${API_URL}/integrations/kiwify/data`);

    // Teste 7: Dados Hotmart
    await runTest('Dados Hotmart', `${API_URL}/integrations/hotmart/data`);

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate && onNavigate('dashboard')}
            className="mb-4 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
          >
            ← Voltar
          </button>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🧪 Teste de Integrações
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Teste webhooks e APIs das integrações Kiwify e Hotmart
          </p>
        </div>

        {/* Botão de Teste */}
        <div className="mb-8">
          <button
            onClick={runAllTests}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Executando Testes...
              </>
            ) : (
              <>
                <FaPlay />
                Executar Todos os Testes
              </>
            )}
          </button>
        </div>

        {/* Resultados */}
        {results.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              📊 Resultados ({results.length} testes)
            </h2>

            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className={`p-4 rounded-xl border-2 ${
                    result.success
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                      : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {result.success ? (
                        <FaCheck className="text-green-600 dark:text-green-400" />
                      ) : (
                        <FaTimes className="text-red-600 dark:text-red-400" />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {result.test}
                        </h3>
                        <p className={`text-sm ${
                          result.success
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-red-700 dark:text-red-300'
                        }`}>
                          {result.message}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {result.timestamp}
                    </span>
                  </div>

                  {/* Dados do resultado */}
                  {result.data && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600">
                        Ver dados completos
                      </summary>
                      <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-900 rounded-lg text-xs overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>

            {/* Resumo */}
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300 font-semibold">
                  Resumo:
                </span>
                <div className="flex gap-4">
                  <span className="text-green-600 dark:text-green-400 font-bold">
                    ✓ {results.filter(r => r.success).length} Sucesso
                  </span>
                  <span className="text-red-600 dark:text-red-400 font-bold">
                    ✗ {results.filter(r => !r.success).length} Falha
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payloads de Exemplo */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              🥝 Payload Kiwify
            </h3>
            <pre className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg text-xs overflow-x-auto">
              {JSON.stringify(kiwifyPayload, null, 2)}
            </pre>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              🔥 Payload Hotmart
            </h3>
            <pre className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg text-xs overflow-x-auto">
              {JSON.stringify(hotmartPayload, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsTest;
