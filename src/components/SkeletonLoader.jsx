import React from 'react';

/**
 * Componente de Skeleton Loading para placeholders
 * @param {string} variant - Tipo: 'text', 'card', 'avatar', 'table'
 * @param {number} count - Número de elementos (para variant='text')
 * @param {string} className - Classes CSS adicionais
 */
const SkeletonLoader = ({ variant = 'text', count = 1, className = '' }) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';

  const variants = {
    text: (
      <div className={`space-y-2 ${className}`}>
        {[...Array(count)].map((_, i) => (
          <div key={i} className={`h-4 ${baseClasses} ${i === count - 1 ? 'w-3/4' : 'w-full'}`} />
        ))}
      </div>
    ),
    card: (
      <div className={`p-4 ${baseClasses} ${className}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded" />
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6" />
        </div>
      </div>
    ),
    avatar: (
      <div className={`w-10 h-10 rounded-full ${baseClasses} ${className}`} />
    ),
    table: (
      <div className={`space-y-3 ${className}`}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded ${baseClasses}`} />
            <div className={`flex-1 h-4 ${baseClasses}`} />
            <div className={`w-24 h-4 ${baseClasses}`} />
            <div className={`w-16 h-4 ${baseClasses}`} />
          </div>
        ))}
      </div>
    )
  };

  return variants[variant] || variants.text;
};

export default SkeletonLoader;
