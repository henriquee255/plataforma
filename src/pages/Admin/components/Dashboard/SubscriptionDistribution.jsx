import React from 'react';
import { FaCrown, FaRocket, FaStar, FaDiamond, FaInfinity } from 'react-icons/fa6';

/**
 * Distribuição de Assinaturas - Cards em Linha Horizontal
 * Mostra total de usuários, percentual e receita por plano
 */
const SubscriptionDistribution = () => {
  // Mock data - substituir por dados reais do backend
  const subscriptionData = {
    free: {
      totalUsers: 1245,
      percentage: 62.25,
      revenue: 0,
      color: 'gray',
      gradient: 'from-gray-500 to-gray-600',
      icon: FaCrown,
    },
    starter: {
      totalUsers: 423,
      percentage: 21.15,
      revenue: 4653.00,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      icon: FaRocket,
    },
    professional: {
      totalUsers: 218,
      percentage: 10.90,
      revenue: 21146.00,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      icon: FaStar,
    },
    enterprise: {
      totalUsers: 95,
      percentage: 4.75,
      revenue: 47405.00,
      color: 'yellow',
      gradient: 'from-yellow-500 to-yellow-600',
      icon: FaDiamond,
    },
    lifetime: {
      totalUsers: 19,
      percentage: 0.95,
      totalSold: 19,
      revenue: 94905.00,
      color: 'emerald',
      gradient: 'from-emerald-500 to-emerald-600',
      icon: FaInfinity,
    },
  };

  const totalUsers = Object.values(subscriptionData).reduce((sum, plan) => sum + plan.totalUsers, 0);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const plans = [
    { key: 'free', label: 'Free', price: 'R$ 0/mês' },
    { key: 'starter', label: 'Starter', price: 'R$ 11/mês' },
    { key: 'professional', label: 'Professional', price: 'R$ 97/mês' },
    { key: 'enterprise', label: 'Enterprise', price: 'R$ 499/mês' },
    { key: 'lifetime', label: 'Vitalício', price: 'Pgto Único' },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          Distribuição de Assinaturas
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Total de {totalUsers.toLocaleString('pt-BR')} usuários cadastrados
        </p>
      </div>

      {/* Cards em Linha Horizontal */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {plans.map((plan) => {
          const data = subscriptionData[plan.key];
          const Icon = data.icon;

          return (
            <div
              key={plan.key}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-all"
            >
              {/* Header do Card */}
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${data.gradient} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {data.percentage.toFixed(1)}%
                </span>
              </div>

              {/* Nome do Plano */}
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                {plan.label}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {plan.price}
              </p>

              {/* Total de Usuários */}
              <div className="mb-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Total de Usuários
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.totalUsers.toLocaleString('pt-BR')}
                </p>
              </div>

              {/* Receita ou Total Vendido */}
              {plan.key === 'free' ? (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Plano Gratuito
                  </p>
                </div>
              ) : plan.key === 'lifetime' ? (
                <>
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Total Vendido
                    </p>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {data.totalSold}
                    </p>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Receita Acumulada
                    </p>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(data.revenue)}
                    </p>
                  </div>
                </>
              ) : (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Receita Mensal
                  </p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(data.revenue)}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(SubscriptionDistribution);
