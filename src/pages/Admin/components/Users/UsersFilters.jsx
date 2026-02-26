import React from 'react';
import { useAdminContext } from '../../context/AdminContext';
import { FILTER_OPTIONS } from '../../utils/constants';
import FilterBar from '../Shared/FilterBar';
import SearchInput from '../Shared/SearchInput';

/**
 * Filtros da seção de Usuários
 * Busca + 3 filtros (Plano, Status, Tipo)
 */
export const UsersFilters = () => {
  const { filters, updateFilter, resetFilters, updateSearchTerm } = useAdminContext();

  const filterConfigs = [
    {
      key: 'plano',
      value: filters.plano,
      options: FILTER_OPTIONS.planos
    },
    {
      key: 'status',
      value: filters.status,
      options: FILTER_OPTIONS.status
    },
    {
      key: 'tipo',
      value: filters.tipo,
      options: FILTER_OPTIONS.tipos
    }
  ];

  const hasActiveFilters =
    filters.plano !== 'todos' ||
    filters.status !== 'todos' ||
    filters.tipo !== 'todos';

  return (
    <div className="space-y-4">
      {/* Busca */}
      <SearchInput
        value={filters.searchTerm}
        onChange={updateSearchTerm}
        placeholder="Buscar por nome, email..."
        className="w-full md:w-96"
      />

      {/* Filtros */}
      <FilterBar
        filters={filterConfigs}
        onFilterChange={updateFilter}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
};

export default React.memo(UsersFilters);
