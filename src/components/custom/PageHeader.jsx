import React from 'react';
import { FaChevronRight } from 'react-icons/fa';

/**
 * PageHeader - Header de página com título, breadcrumbs e ações
 */
const PageHeader = ({ title, subtitle, breadcrumbs = [], actions, className = '' }) => {
  return (
    <div className={`mb-6 ${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-2">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center gap-2">
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="hover:text-primary transition-colors"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-foreground font-medium">{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <FaChevronRight className="h-3 w-3" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
