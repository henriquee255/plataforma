import React from 'react';
import { FaSpinner } from 'react-icons/fa';

/**
 * LoadingSpinner - Spinner de loading reutilizável
 */
const LoadingSpinner = ({
  size = 'md',
  text,
  variant = 'default',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const variantClasses = {
    default: 'text-primary',
    muted: 'text-muted-foreground',
    white: 'text-white',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      role="status"
      aria-live="polite"
    >
      <FaSpinner
        className={`animate-spin ${sizeClasses[size]} ${variantClasses[variant]}`}
        aria-hidden="true"
      />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
      <span className="sr-only">Carregando...</span>
    </div>
  );
};

export default LoadingSpinner;
