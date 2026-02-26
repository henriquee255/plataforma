import React from 'react';
import { Badge } from '@/components/ui/badge';

/**
 * StatusBadge - Badge component for status indicators
 * Pre-configured variants for common statuses
 *
 * @param {string} status - Status type (active, inactive, pending, success, warning, error)
 * @param {React.ReactNode} children - Badge content
 */
const StatusBadge = ({ status = 'default', children, className = '', ...props }) => {
  const statusConfig = {
    active: {
      variant: 'default',
      className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    },
    inactive: {
      variant: 'secondary',
      className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700',
    },
    pending: {
      variant: 'outline',
      className: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    },
    success: {
      variant: 'default',
      className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    },
    warning: {
      variant: 'outline',
      className: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    },
    error: {
      variant: 'destructive',
      className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    },
    default: {
      variant: 'default',
      className: '',
    },
  };

  const config = statusConfig[status] || statusConfig.default;

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} ${className}`}
      {...props}
    >
      {children}
    </Badge>
  );
};

export default StatusBadge;
