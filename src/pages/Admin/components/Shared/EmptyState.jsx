import React from 'react';
import { FaInbox } from 'react-icons/fa';

/**
 * Estado Vazio
 * Componente para quando não há dados para exibir
 *
 * @param {Object} props
 * @param {string} props.message - Mensagem principal
 * @param {string} props.description - Descrição opcional
 * @param {React.Component} props.icon - Ícone customizado
 * @param {React.ReactNode} props.action - Botão de ação opcional
 * @returns {JSX.Element}
 */
export const EmptyState = ({
  message = 'Nenhum item encontrado',
  description,
  icon: Icon = FaInbox,
  action,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      {/* Ícone */}
      <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
      </div>

      {/* Mensagem */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {message}
      </h3>

      {/* Descrição */}
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
          {description}
        </p>
      )}

      {/* Ação */}
      {action && <div>{action}</div>}
    </div>
  );
};

export default React.memo(EmptyState);
