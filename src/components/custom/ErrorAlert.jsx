import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FaExclamationTriangle } from 'react-icons/fa';

/**
 * ErrorAlert - Alert de erro consistente
 */
const ErrorAlert = ({
  title = 'Erro',
  message,
  onClose,
  className = '',
}) => {
  return (
    <Alert variant="destructive" className={className}>
      <FaExclamationTriangle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      {message && <AlertDescription>{message}</AlertDescription>}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-md hover:bg-destructive/20 transition-colors"
          aria-label="Fechar alerta"
        >
          ×
        </button>
      )}
    </Alert>
  );
};

export default ErrorAlert;
