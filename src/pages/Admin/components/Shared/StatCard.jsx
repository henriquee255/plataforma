import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';

/**
 * Card de Estatística
 * Componente reutilizável para exibir métricas
 *
 * @param {Object} props
 * @param {string} props.title - Título da métrica
 * @param {number|string} props.value - Valor principal
 * @param {string} props.type - Tipo de valor (number, currency, percentage)
 * @param {React.Component} props.icon - Ícone (React Icon)
 * @param {Object} props.trend - Tendência { value: number, isPositive: boolean }
 * @param {string} props.className - Classes adicionais
 * @returns {JSX.Element}
 */
export const StatCard = ({
  title,
  value,
  type = 'number',
  icon: Icon,
  trend,
  className = ''
}) => {
  // Formatar valor baseado no tipo
  const formattedValue = React.useMemo(() => {
    if (value === null || value === undefined) return '-';

    switch (type) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      case 'number':
        return formatNumber(value);
      default:
        return value;
    }
  }, [value, type]);

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {/* Header com título e ícone */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        {Icon && (
          <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/30">
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Valor principal */}
      <div className="mb-2">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
          {formattedValue}
        </h3>
      </div>

      {/* Trend (se fornecido) */}
      {trend && (
        <div className="flex items-center gap-1">
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
              trend.isPositive
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {trend.isPositive ? (
              <FaArrowUp className="w-3 h-3" />
            ) : (
              <FaArrowDown className="w-3 h-3" />
            )}
            <span>{formatPercentage(trend.value, 1)}</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
            vs mês anterior
          </span>
        </div>
      )}
    </div>
  );
};

export default React.memo(StatCard);
