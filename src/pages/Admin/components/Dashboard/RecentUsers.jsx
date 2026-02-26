import React from 'react';
import { FaUser, FaEye, FaCheckCircle, FaBan, FaClock } from 'react-icons/fa';
import { useAdminContext } from '../../context/AdminContext';

/**
 * Usuários Cadastrados Recentemente
 * Tabela com últimos usuários cadastrados
 */
const RecentUsers = () => {
  const { openUserModal } = useAdminContext();

  // Mock data - substituir por dados reais do backend
  const recentUsers = [
    {
      id: 'user-001',
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@email.com',
      avatar: 'https://ui-avatars.com/api/?name=Pedro+Oliveira&background=9333ea&color=fff',
      mainCompany: 'Tech Solutions Ltda',
      plan: 'professional',
      createdAt: '2026-02-25T11:45:00Z',
      status: 'active',
    },
    {
      id: 'user-002',
      name: 'Juliana Santos',
      email: 'juliana.santos@email.com',
      avatar: 'https://ui-avatars.com/api/?name=Juliana+Santos&background=3b82f6&color=fff',
      mainCompany: 'Marketing Digital Pro',
      plan: 'starter',
      createdAt: '2026-02-25T09:30:00Z',
      status: 'active',
    },
    {
      id: 'user-003',
      name: 'Ricardo Ferreira',
      email: 'ricardo.ferreira@email.com',
      avatar: 'https://ui-avatars.com/api/?name=Ricardo+Ferreira&background=10b981&color=fff',
      mainCompany: 'E-commerce Brasil',
      plan: 'enterprise',
      createdAt: '2026-02-24T16:20:00Z',
      status: 'active',
    },
    {
      id: 'user-004',
      name: 'Fernanda Costa',
      email: 'fernanda.costa@email.com',
      avatar: 'https://ui-avatars.com/api/?name=Fernanda+Costa&background=f59e0b&color=fff',
      mainCompany: 'Consultoria Empresarial',
      plan: 'professional',
      createdAt: '2026-02-24T14:00:00Z',
      status: 'suspended',
    },
    {
      id: 'user-005',
      name: 'Thiago Alves',
      email: 'thiago.alves@email.com',
      avatar: 'https://ui-avatars.com/api/?name=Thiago+Alves&background=ef4444&color=fff',
      mainCompany: 'Vendas Online Mega',
      plan: 'starter',
      createdAt: '2026-02-24T10:15:00Z',
      status: 'pending',
    },
    {
      id: 'user-006',
      name: 'Camila Rodrigues',
      email: 'camila.rodrigues@email.com',
      avatar: 'https://ui-avatars.com/api/?name=Camila+Rodrigues&background=8b5cf6&color=fff',
      mainCompany: 'Tech Solutions Ltda',
      plan: 'professional',
      createdAt: '2026-02-23T18:30:00Z',
      status: 'active',
    },
    {
      id: 'user-007',
      name: 'Lucas Martins',
      email: 'lucas.martins@email.com',
      avatar: 'https://ui-avatars.com/api/?name=Lucas+Martins&background=6366f1&color=fff',
      mainCompany: 'Marketing Digital Pro',
      plan: 'starter',
      createdAt: '2026-02-23T15:45:00Z',
      status: 'active',
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return {
          icon: FaCheckCircle,
          label: 'Ativo',
          color: 'text-green-600 dark:text-green-400',
        };
      case 'suspended':
        return {
          icon: FaBan,
          label: 'Suspenso',
          color: 'text-red-600 dark:text-red-400',
        };
      case 'pending':
        return {
          icon: FaClock,
          label: 'Pendente',
          color: 'text-yellow-600 dark:text-yellow-400',
        };
      default:
        return {
          icon: FaUser,
          label: status,
          color: 'text-gray-600 dark:text-gray-400',
        };
    }
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

  const handleViewUser = (user) => {
    openUserModal(user);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Usuários Cadastrados Recentemente
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Últimos {recentUsers.length} usuários cadastrados
          </p>
        </div>
        <FaUser className="w-6 h-6 text-blue-500" />
      </div>

      {/* Tabela */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Empresa Principal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Plano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data de Cadastro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentUsers.map((user) => {
                const statusInfo = getStatusBadge(user.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    {/* Nome */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.email}
                      </p>
                    </td>

                    {/* Empresa Principal */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.mainCompany}
                      </p>
                    </td>

                    {/* Plano */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanBadge(
                          user.plan
                        )}`}
                      >
                        {getPlanLabel(user.plan)}
                      </span>
                    </td>

                    {/* Data de Cadastro */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(user.createdAt)}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center gap-2 ${statusInfo.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">{statusInfo.label}</span>
                      </div>
                    </td>

                    {/* Ação */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
                      >
                        <FaEye className="w-4 h-4" />
                        Ver
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RecentUsers);
