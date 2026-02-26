import React from 'react';
import { FaBuilding, FaEye, FaCheckCircle, FaBan } from 'react-icons/fa';
import { useAdminContext } from '../../context/AdminContext';

/**
 * Empresas Criadas Recentemente
 * Tabela com últimas empresas cadastradas
 */
const RecentCompanies = () => {
  const { openCompanyModal } = useAdminContext();

  // Mock data - substituir por dados reais do backend
  const recentCompanies = [
    {
      id: 'comp-001',
      name: 'Tech Solutions Ltda',
      owner: 'João Silva',
      ownerEmail: 'joao@techsolutions.com',
      plan: 'professional',
      status: 'active',
      createdAt: '2026-02-25T10:30:00Z',
      members: 12,
    },
    {
      id: 'comp-002',
      name: 'Marketing Digital Pro',
      owner: 'Maria Santos',
      ownerEmail: 'maria@marketingpro.com',
      plan: 'starter',
      status: 'active',
      createdAt: '2026-02-24T15:45:00Z',
      members: 5,
    },
    {
      id: 'comp-003',
      name: 'E-commerce Brasil',
      owner: 'Carlos Mendes',
      ownerEmail: 'carlos@ecommerce.com.br',
      plan: 'enterprise',
      status: 'active',
      createdAt: '2026-02-24T09:20:00Z',
      members: 28,
    },
    {
      id: 'comp-004',
      name: 'Consultoria Empresarial',
      owner: 'Ana Costa',
      ownerEmail: 'ana@consultoria.com',
      plan: 'professional',
      status: 'suspended',
      createdAt: '2026-02-23T14:15:00Z',
      members: 8,
    },
    {
      id: 'comp-005',
      name: 'Vendas Online Mega',
      owner: 'Roberto Lima',
      ownerEmail: 'roberto@vendasmega.com',
      plan: 'starter',
      status: 'active',
      createdAt: '2026-02-23T11:00:00Z',
      members: 3,
    },
  ];

  const getPlanBadge = (plan) => {
    const badges = {
      free: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
      starter: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      professional: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      enterprise: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    };
    return badges[plan] || badges.free;
  };

  const getPlanLabel = (plan) => {
    const labels = {
      free: 'Free',
      starter: 'Starter',
      professional: 'Professional',
      enterprise: 'Enterprise',
    };
    return labels[plan] || plan;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewCompany = (company) => {
    openCompanyModal(company, 'view');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Empresas Criadas Recentemente
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Últimas {recentCompanies.length} empresas cadastradas
          </p>
        </div>
        <FaBuilding className="w-6 h-6 text-purple-500" />
      </div>

      {/* Tabela */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nome da Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Proprietário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Plano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data de Criação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentCompanies.map((company) => (
                <tr
                  key={company.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  {/* Nome da Empresa */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                        <FaBuilding className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {company.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {company.members} membros
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Proprietário */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {company.owner}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {company.ownerEmail}
                      </p>
                    </div>
                  </td>

                  {/* Plano */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanBadge(
                        company.plan
                      )}`}
                    >
                      {getPlanLabel(company.plan)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {company.status === 'active' ? (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <FaCheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Ativa</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <FaBan className="w-4 h-4" />
                        <span className="text-sm font-medium">Suspensa</span>
                      </div>
                    )}
                  </td>

                  {/* Data de Criação */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(company.createdAt)}
                    </p>
                  </td>

                  {/* Ação */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewCompany(company)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm font-medium"
                    >
                      <FaEye className="w-4 h-4" />
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RecentCompanies);
