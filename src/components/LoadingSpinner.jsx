import React from 'react';

/**
 * Componente de Loading Spinner reutilizável
 * @param {string} size - Tamanho: 'sm', 'md', 'lg'
 * @param {string} color - Cor: 'purple', 'white', 'gray'
 * @param {string} className - Classes CSS adicionais
 */
const LoadingSpinner = ({ size = 'md', color = 'purple', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  const colors = {
    purple: 'border-purple-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-400 border-t-transparent'
  };

  return (
    <div
      className={`${sizes[size]} ${colors[color]} rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Carregando"
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
};

export default LoadingSpinner;
