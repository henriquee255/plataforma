import { useMemo } from 'react';
import { useAdminContext } from '../context/AdminContext';
import { matchesSearch } from '../utils/adminHelpers';

/**
 * Hook para filtrar dados do Admin
 * Otimizado com useMemo para evitar recálculos desnecessários
 *
 * @param {Array} data - Array de dados para filtrar
 * @param {Object} options - Opções de configuração
 * @param {string[]} options.searchFields - Campos para busca (padrão: ['nome', 'email'])
 * @returns {Object} Dados filtrados e metadados
 */
export const useAdminFilters = (data, options = {}) => {
  const { filters } = useAdminContext();
  const { searchFields = ['nome', 'email', 'name'] } = options;

  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    return data.filter(item => {
      // Filtro de busca
      const matchesSearchTerm = matchesSearch(item, filters.searchTerm, searchFields);

      // Filtro por plano
      const matchesPlano =
        filters.plano === 'todos' ||
        item.plano?.toLowerCase() === filters.plano.toLowerCase() ||
        item.plan?.toLowerCase() === filters.plano.toLowerCase();

      // Filtro por status
      const matchesStatus =
        filters.status === 'todos' ||
        item.status === filters.status;

      // Filtro por tipo (superadmin vs comum)
      let matchesTipo = true;
      if (filters.tipo === 'superadmin') {
        matchesTipo = item.role === 'Admin' || item.role === 'admin' || item.role === 'superadmin';
      } else if (filters.tipo === 'comum') {
        matchesTipo = item.role !== 'Admin' && item.role !== 'admin' && item.role !== 'superadmin';
      }

      return matchesSearchTerm && matchesPlano && matchesStatus && matchesTipo;
    });
  }, [data, filters, searchFields]);

  const resultCount = filteredData.length;
  const totalCount = data?.length || 0;

  const hasActiveFilters =
    filters.plano !== 'todos' ||
    filters.status !== 'todos' ||
    filters.tipo !== 'todos' ||
    (filters.searchTerm && filters.searchTerm.trim() !== '');

  const filtersApplied = {
    search: filters.searchTerm && filters.searchTerm.trim() !== '',
    plano: filters.plano !== 'todos',
    status: filters.status !== 'todos',
    tipo: filters.tipo !== 'todos'
  };

  return {
    filteredData,
    resultCount,
    totalCount,
    hasActiveFilters,
    filtersApplied,
    filters,
    isFiltering: hasActiveFilters
  };
};

export default useAdminFilters;
