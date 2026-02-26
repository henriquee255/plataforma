import React from 'react';
import {
  FaCreditCard,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaDownload,
  FaCalendarAlt,
} from 'react-icons/fa';
import { formatDate, formatCurrency } from '../../../utils/formatters';

/**
 * Tab de Billing da Empresa
 * Histórico de pagamentos, faturas e transações
 */
const BillingTab = ({ company }) => {
  // Mock data - substituir por dados reais
  const billingHistory = [
    {
      id: 'inv-001',
      date: '2024-02-01',
      amount: 97.00,
      status: 'paid',
      description: 'Assinatura Professional - Fevereiro 2024',
      invoiceUrl: '#',
      paymentMethod: 'Cartão de Crédito',
      transactionId: 'txn_abc123',
    },
    {
      id: 'inv-002',
      date: '2024-01-01',
      amount: 97.00,
      status: 'paid',
      description: 'Assinatura Professional - Janeiro 2024',
      invoiceUrl: '#',
      paymentMethod: 'Cartão de Crédito',
      transactionId: 'txn_xyz789',
    },
    {
      id: 'inv-003',
      date: '2023-12-01',
      amount: 47.00,
      status: 'paid',
      description: 'Assinatura Starter - Dezembro 2023',
      invoiceUrl: '#',
      paymentMethod: 'PIX',
      transactionId: 'txn_pix456',
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <FaCheckCircle className="text-green-500" />;
      case 'pending':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'failed':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'failed':
        return 'Falhou';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Pago */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
              <FaCheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Total Pago
              </p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(241.00)}
              </p>
            </div>
          </div>
        </div>

        {/* Próximo Pagamento */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
              <FaCalendarAlt className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Próximo Pagamento
              </p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {formatDate('2024-03-01')}
              </p>
            </div>
          </div>
        </div>

        {/* Método de Pagamento */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
              <FaCreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                Método Padrão
              </p>
              <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                Cartão •••• 4242
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Histórico de Pagamentos
        </h3>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Método
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {billingHistory.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  {/* Data */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white font-medium">
                      {formatDate(payment.date)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {payment.transactionId}
                    </div>
                  </td>

                  {/* Descrição */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {payment.description}
                    </div>
                  </td>

                  {/* Método */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FaCreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {payment.paymentMethod}
                      </span>
                    </div>
                  </td>

                  {/* Valor */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency(payment.amount)}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          payment.status
                        )}`}
                      >
                        {getStatusText(payment.status)}
                      </span>
                    </div>
                  </td>

                  {/* Ações */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => window.open(payment.invoiceUrl, '_blank')}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                    >
                      <FaDownload className="w-3 h-3" />
                      Fatura
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Method Info */}
      <div className="bg-gray-50 dark:bg-gray-750 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Método de Pagamento
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <FaCreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Visa •••• 4242
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Expira em 12/2025
              </p>
            </div>
          </div>

          <button className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors font-medium">
            Atualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BillingTab);
