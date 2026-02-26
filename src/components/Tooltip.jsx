import React, { useState } from 'react';

/**
 * Componente de Tooltip acessível
 * @param {ReactNode} children - Elemento que ativa o tooltip
 * @param {string} content - Texto do tooltip
 * @param {string} position - Posição: 'top', 'bottom', 'left', 'right'
 * @param {string} className - Classes CSS adicionais
 */
const Tooltip = ({ children, content, position = 'top', className = '' }) => {
  const [show, setShow] = useState(false);

  if (!content) return <>{children}</>;

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900 dark:border-t-gray-700',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900 dark:border-b-gray-700',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900 dark:border-l-gray-700',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900 dark:border-r-gray-700'
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className={`absolute z-50 ${positions[position]} pointer-events-none`}
          role="tooltip"
        >
          <div className="relative px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg whitespace-nowrap max-w-xs">
            {content}
            <div className={`absolute w-0 h-0 border-4 ${arrows[position]}`} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
