import React from 'react';
import { FaStar, FaRocket, FaBriefcase, FaCrown } from 'react-icons/fa';
import { useAdminData } from '../../hooks/useAdminData';
import { formatNumber } from '../../utils/formatters';
import { PLAN_INFO } from '../../utils/constants';

/**
 * Distribuição de Planos
 * Mostra quantos usuários em cada plano
 */
export const PlanDistribution = () => {
  const { planDistribution, loading } = useAdminData();

  if (loading || !planDistribution) return null;

  const plans = [
    { key: 'free', icon: FaStar, color: 'gray' },
    { key: 'starter', icon: FaRocket, color: 'blue' },
    { key: 'professional', icon: FaBriefcase, color: 'purple' },
    { key: 'enterprise', icon: FaCrown, color: 'yellow' }
  ];

  const total = Object.values(planDistribution).reduce((acc, val) => acc + val, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Distribuição de Assinaturas
      </h3>

      <div className="space-y-4">
        {plans.map(({ key, icon: Icon, color }) => {
          const count = planDistribution[key] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;
          const planInfo = PLAN_INFO[key];

          const colorClasses = {
            gray: 'bg-gray-500',
            blue: 'bg-blue-500',
            purple: 'bg-purple-500',
            yellow: 'bg-yellow-500'
          };

          return (
            <div key={key}>
              {/* Header com ícone e valores */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${colorClasses[color]} rounded-lg`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {planInfo.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatNumber(count)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>

              {/* Barra de progresso */}
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${colorClasses[color]} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900 dark:text-white">
            Total de Assinaturas
          </span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatNumber(total)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PlanDistribution);
