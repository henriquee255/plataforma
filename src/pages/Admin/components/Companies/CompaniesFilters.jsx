import React from 'react';
import { useAdminContext } from '../../context/AdminContext';
import SearchInput from '../Shared/SearchInput';
import FilterBar from '../Shared/FilterBar';
import { FILTER_OPTIONS } from '../../utils/constants';

/**
 * Filtros da página de Empresas
 * Search + Plano + Status
 */
const CompaniesFilters = () => {
  const { filters, updateFilter, resetFilters, updateSearchTerm } = useAdminContext();

  // Configuração dos filtros
  const filterConfigs = [
    {
      id: 'status',
      label: 'Status',
      value: filters.status,
      options: FILTER_OPTIONS.status,
    },
  ];

  // Verificar se há filtros ativos
  const hasActiveFilters =
    filters.searchTerm ||
    filters.status !== 'todos';

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <SearchInput
        value={filters.searchTerm}
        onChange={updateSearchTerm}
        placeholder="Buscar por nome da empresa, CNPJ ou domínio..."
      />

      {/* Filter Bars */}
      <FilterBar
        filters={filterConfigs}
        onFilterChange={updateFilter}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
};

export default React.memo(CompaniesFilters);
