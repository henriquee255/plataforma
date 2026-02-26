import React from 'react';

/**
 * Loading Spinner
 * Componente de carregamento reutilizável
 *
 * @param {Object} props
 * @param {string} props.size - Tamanho (sm, md, lg)
 * @param {boolean} props.fullScreen - Ocupar tela toda
 * @param {string} props.message - Mensagem de loading
 * @returns {JSX.Element}
 */
export const LoadingSpinner = ({
  size = 'md',
  fullScreen = false,
  message,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4'
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} border-purple-600 border-t-transparent rounded-full animate-spin`}
      />
      {message && (
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default React.memo(LoadingSpinner);
