import { useState, useEffect, useCallback } from 'react';
import { CACHE_TTL } from '../utils/constants';

/**
 * Hook para gerenciar dados gerais do Admin
 * Implementa cache com TTL e invalidação manual
 *
 * @returns {Object} Dados, loading state e funções
 */
export const useAdminData = () => {
  const [stats, setStats] = useState(null);
  const [planDistribution, setPlanDistribution] = useState(null);
  const [platformHealth, setPlatformHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  /**
   * Busca dados do backend (ou usa mock)
   */
  const fetchData = useCallback(async (forceRefresh = false) => {
    // Verificar cache
    const cached = sessionStorage.getItem('admin_stats');
    const cacheTimestamp = sessionStorage.getItem('admin_stats_timestamp');

    if (!forceRefresh && cached && cacheTimestamp) {
      const age = Date.now() - parseInt(cacheTimestamp, 10);

      // Se cache ainda é válido, usar
      if (age < CACHE_TTL.STATS) {
        const data = JSON.parse(cached);
        setStats(data.stats);
        setPlanDistribution(data.planDistribution);
        setPlatformHealth(data.platformHealth);
        setLastFetch(new Date(parseInt(cacheTimestamp, 10)));
        setLoading(false);
        return;
      }
    }

    // Buscar dados frescos
    setLoading(true);
    setError(null);

    try {
      // TODO: Substituir por chamada real à API
      // const response = await fetch('/api/admin/stats');
      // const data = await response.json();

      // Mock data por enquanto
      const data = {
        stats: {
          totalUsers: 1247,
          totalCompanies: 389,
          mrr: 156480,
          arr: 1877760,
          activeUsers: 892,
          totalRevenue: 284650.50,
          activeIntegrations: 15,
          systemUptime: '99.8%',
          avgResponseTime: '125ms',
          errorRate: '0.2%',
          newUsersThisMonth: 89,
          churnRate: 2.8,
          estimatedCancellations: 11
        },
        planDistribution: {
          free: 487,
          starter: 312,
          professional: 256,
          enterprise: 192
        },
        platformHealth: {
          uptime: 99.8,
          avgResponseTime: 125,
          errorRate: 0.2
        }
      };

      setStats(data.stats);
      setPlanDistribution(data.planDistribution);
      setPlatformHealth(data.platformHealth);

      // Salvar no cache
      const timestamp = Date.now();
      sessionStorage.setItem('admin_stats', JSON.stringify(data));
      sessionStorage.setItem('admin_stats_timestamp', timestamp.toString());
      setLastFetch(new Date(timestamp));
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setError(err.message || 'Erro ao buscar estatísticas');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch inicial
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Invalida cache e recarrega dados
   */
  const refetch = useCallback(() => {
    sessionStorage.removeItem('admin_stats');
    sessionStorage.removeItem('admin_stats_timestamp');
    fetchData(true);
  }, [fetchData]);

  /**
   * Limpa cache
   */
  const clearCache = useCallback(() => {
    sessionStorage.removeItem('admin_stats');
    sessionStorage.removeItem('admin_stats_timestamp');
  }, []);

  return {
    stats,
    planDistribution,
    platformHealth,
    loading,
    error,
    lastFetch,
    refetch,
    clearCache
  };
};

export default useAdminData;
