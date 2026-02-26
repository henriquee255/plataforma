import React from 'react';
import { Button } from '@/components/ui/button';

/**
 * EmptyState - Estado vazio com ícone, mensagem e ação
 */
const EmptyState = ({
  icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-12 ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* Icon */}
      {icon && (
        <div className="mb-4 text-6xl text-muted-foreground opacity-50">
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      )}

      {/* Action */}
      {(action || (actionLabel && onAction)) && (
        <div>
          {action || (
            <Button onClick={onAction}>{actionLabel}</Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
