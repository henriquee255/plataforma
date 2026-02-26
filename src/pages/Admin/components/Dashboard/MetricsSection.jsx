import React from 'react';
import { FaUsers, FaBuilding, FaDollarSign, FaChartLine } from 'react-icons/fa';
import StatCard from '../Shared/StatCard';
import { useAdminData } from '../../hooks/useAdminData';
import LoadingSpinner from '../Shared/LoadingSpinner';

/**
 * Seção de Métricas Principais
 * 4 cards com estatísticas chave do dashboard
 */
export const MetricsSection = () => {
  const { stats, loading } = useAdminData();

  if (loading) {
    return <LoadingSpinner message="Carregando métricas..." />;
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total de Usuários */}
      <StatCard
        title="Total de Usuários"
        value={stats.totalUsers}
        type="number"
        icon={FaUsers}
        trend={{
          value: 12.5,
          isPositive: true
        }}
      />

      {/* Total de Empresas */}
      <StatCard
        title="Total de Empresas"
        value={stats.totalCompanies}
        type="number"
        icon={FaBuilding}
        trend={{
          value: 8.3,
          isPositive: true
        }}
      />

      {/* MRR */}
      <StatCard
        title="MRR (Receita Mensal)"
        value={stats.mrr}
        type="currency"
        icon={FaDollarSign}
        trend={{
          value: 15.2,
          isPositive: true
        }}
      />

      {/* ARR */}
      <StatCard
        title="ARR (Receita Anual)"
        value={stats.arr}
        type="currency"
        icon={FaChartLine}
        trend={{
          value: 18.7,
          isPositive: true
        }}
      />
    </div>
  );
};

export default React.memo(MetricsSection);
