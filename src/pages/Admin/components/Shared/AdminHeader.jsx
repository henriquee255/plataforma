import React from 'react';

/**
 * Header Padrão do Admin
 * Título de seção com ações opcionais
 *
 * @param {Object} props
 * @param {string} props.title - Título da seção
 * @param {string} props.subtitle - Subtítulo opcional
 * @param {React.ReactNode} props.actions - Botões de ação
 * @param {React.Component} props.icon - Ícone opcional
 * @returns {JSX.Element}
 */
export const AdminHeader = ({
  title,
  subtitle,
  actions,
  icon: Icon,
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      {/* Título e subtítulo */}
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/30">
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Ações */}
      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
};

export default React.memo(AdminHeader);
