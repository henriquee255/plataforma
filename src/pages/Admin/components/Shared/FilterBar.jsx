import React from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';

/**
 * Barra de Filtros Reutilizável
 * Componente para múltiplos selects de filtro
 *
 * @param {Object} props
 * @param {Array} props.filters - Array de configs de filtro
 * @param {Function} props.onFilterChange - Callback (key, value)
 * @param {Function} props.onReset - Callback para resetar filtros
 * @param {boolean} props.hasActiveFilters - Se há filtros ativos
 * @param {string} props.className - Classes adicionais
 * @returns {JSX.Element}
 */
export const FilterBar = ({
  filters = [],
  onFilterChange,
  onReset,
  hasActiveFilters = false,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-3 flex-wrap ${className}`}>
      {/* Ícone */}
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <FaFilter className="w-4 h-4 text-gray-400" />
        <span>Filtros:</span>
      </div>

      {/* Filtros */}
      {filters.map((filter) => {
        const filterKey = filter.key || filter.id;
        return (
          <select
            key={filterKey}
            value={filter.value}
            onChange={(e) => onFilterChange(filterKey, e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       text-sm font-medium
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       transition-colors cursor-pointer
                       hover:bg-gray-50 dark:hover:bg-gray-750"
          >
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            )) || null}
          </select>
        );
      })}

      {/* Botão Resetar */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl
                     bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
                     border border-gray-200 dark:border-gray-700
                     text-sm font-medium
                     hover:bg-gray-200 dark:hover:bg-gray-750
                     transition-colors"
        >
          <FaTimes className="w-3 h-3" />
          <span>Limpar Filtros</span>
        </button>
      )}
    </div>
  );
};

export default React.memo(FilterBar);
