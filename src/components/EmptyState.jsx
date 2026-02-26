import React from 'react';
import { FaInbox, FaUsers, FaChartLine, FaFileAlt, FaSearch } from 'react-icons/fa';

/**
 * Componente de Empty State - Quando não há dados
 * @param {string} icon - Tipo de ícone: 'inbox', 'users', 'chart', 'file', 'search'
 * @param {string} title - Título principal
 * @param {string} description - Descrição/subtítulo
 * @param {ReactNode} action - Botão ou ação (opcional)
 * @param {string} className - Classes CSS adicionais
 */
const EmptyState = ({
  icon = 'inbox',
  title = 'Nenhum dado encontrado',
  description = '',
  action = null,
  className = ''
}) => {
  const icons = {
    inbox: FaInbox,
    users: FaUsers,
    chart: FaChartLine,
    file: FaFileAlt,
    search: FaSearch
  };

  const Icon = icons[icon] || FaInbox;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="w-20 h-20 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <Icon className="text-3xl text-gray-400 dark:text-gray-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          {description}
        </p>
      )}
      {action}
    </div>
  );
};

export default EmptyState;
