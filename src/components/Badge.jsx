import React from 'react';

/**
 * Componente de Badge para tags, status e labels
 * @param {string} variant - Estilo: 'primary', 'success', 'warning', 'danger', 'info', 'gray'
 * @param {string} size - Tamanho: 'sm', 'md', 'lg'
 * @param {ReactNode} children - Conteúdo do badge
 * @param {boolean} dot - Mostrar ponto indicador
 * @param {string} className - Classes CSS adicionais
 */
const Badge = ({
  variant = 'primary',
  size = 'md',
  children,
  dot = false,
  className = ''
}) => {
  const variants = {
    primary: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    gray: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  const dotColors = {
    primary: 'bg-purple-600 dark:bg-purple-400',
    success: 'bg-green-600 dark:bg-green-400',
    warning: 'bg-amber-600 dark:bg-amber-400',
    danger: 'bg-red-600 dark:bg-red-400',
    info: 'bg-blue-600 dark:bg-blue-400',
    gray: 'bg-gray-600 dark:bg-gray-400'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

export default Badge;
