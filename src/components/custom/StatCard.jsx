import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * StatCard - Card de métrica/estatística
 */
const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendLabel,
  description,
  onClick,
  className = '',
}) => {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  const cardProps = onClick
    ? {
        onClick,
        className: `cursor-pointer hover:shadow-lg transition-shadow ${className}`,
        role: 'button',
        tabIndex: 0,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        },
      }
    : { className };

  return (
    <Card {...cardProps}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(trend !== undefined || description) && (
          <div className="flex items-center gap-2 mt-1">
            {trend !== undefined && (
              <span
                className={`text-xs font-medium ${
                  isPositive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : isNegative
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-muted-foreground'
                }`}
              >
                {isPositive && '↑ '}
                {isNegative && '↓ '}
                {Math.abs(trend)}%
              </span>
            )}
            {trendLabel && (
              <span className="text-xs text-muted-foreground">
                {trendLabel}
              </span>
            )}
            {description && !trendLabel && (
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
