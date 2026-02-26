import React, { useState } from 'react';
import {
  FaUserPlus,
  FaUserMinus,
  FaEdit,
  FaCog,
  FaCreditCard,
  FaLock,
  FaUnlock,
  FaFilter,
  FaCalendarAlt,
} from 'react-icons/fa';
import { formatDate } from '../../../utils/formatters';

/**
 * Tab de Audit Logs da Empresa
 * Histórico completo de ações e modificações
 */
const AuditLogsTab = ({ company }) => {
  const [filterType, setFilterType] = useState('all');

  // Mock data - substituir por dados reais
  const auditLogs = [
    {
      id: 'log-001',
      timestamp: '2024-02-25T10:30:00Z',
      action: 'member_added',
      actor: 'João Silva',
      actorEmail: 'joao@empresa.com',
      description: 'Adicionou Maria Santos como Admin',
      details: 'Role: Admin, Department: Vendas',
      ipAddress: '192.168.1.100',
    },
    {
      id: 'log-002',
      timestamp: '2024-02-24T15:45:00Z',
      action: 'settings_updated',
      actor: 'João Silva',
      actorEmail: 'joao@empresa.com',
      description: 'Atualizou configurações da empresa',
      details: 'Mudou logo e cores do tema',
      ipAddress: '192.168.1.100',
    },
    {
      id: 'log-003',
      timestamp: '2024-02-23T09:15:00Z',
      action: 'plan_upgraded',
      actor: 'João Silva',
      actorEmail: 'joao@empresa.com',
      description: 'Fez upgrade de Starter para Professional',
      details: 'Novo plano: Professional (R$ 97/mês)',
      ipAddress: '192.168.1.100',
    },
    {
      id: 'log-004',
      timestamp: '2024-02-20T14:20:00Z',
      action: 'member_removed',
      actor: 'João Silva',
      actorEmail: 'joao@empresa.com',
      description: 'Removeu Pedro Costa da equipe',
      details: 'Ex-role: Member',
      ipAddress: '192.168.1.100',
    },
    {
      id: 'log-005',
      timestamp: '2024-02-15T11:00:00Z',
      action: 'company_created',
      actor: 'Sistema',
      actorEmail: 'system@plataforma.com',
      description: 'Empresa criada',
      details: 'Owner: João Silva',
      ipAddress: '192.168.1.100',
    },
  ];

  const getActionIcon = (action) => {
    const icons = {
      member_added: <FaUserPlus className="text-green-500" />,
      member_removed: <FaUserMinus className="text-red-500" />,
      settings_updated: <FaCog className="text-blue-500" />,
      plan_upgraded: <FaCreditCard className="text-purple-500" />,
      plan_downgraded: <FaCreditCard className="text-orange-500" />,
      company_suspended: <FaLock className="text-red-500" />,
      company_activated: <FaUnlock className="text-green-500" />,
      company_created: <FaEdit className="text-blue-500" />,
    };
    return icons[action] || <FaEdit className="text-gray-400" />;
  };

  const getActionLabel = (action) => {
    const labels = {
      member_added: 'Membro Adicionado',
      member_removed: 'Membro Removido',
      settings_updated: 'Configurações Atualizadas',
      plan_upgraded: 'Upgrade de Plano',
      plan_downgraded: 'Downgrade de Plano',
      company_suspended: 'Empresa Suspensa',
      company_activated: 'Empresa Ativada',
      company_created: 'Empresa Criada',
    };
    return labels[action] || action;
  };

  const getActionColor = (action) => {
    const colors = {
      member_added: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      member_removed: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      settings_updated: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      plan_upgraded: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      plan_downgraded: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      company_suspended: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      company_activated: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      company_created: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    };
    return colors[action] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
  };

  const filteredLogs = filterType === 'all'
    ? auditLogs
    : auditLogs.filter(log => log.action.includes(filterType));

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <FaFilter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filtrar por:
          </span>
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">Todos</option>
          <option value="member">Membros</option>
          <option value="settings">Configurações</option>
          <option value="plan">Plano</option>
          <option value="company">Empresa</option>
        </select>

        <div className="ml-auto flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <FaCalendarAlt className="w-4 h-4" />
          <span>{filteredLogs.length} eventos</span>
        </div>
      </div>

      {/* Audit Logs Timeline */}
      <div className="space-y-4">
        {filteredLogs.map((log, index) => (
          <div
            key={log.id}
            className="relative pl-8 pb-6 border-l-2 border-gray-200 dark:border-gray-700 last:border-l-0 last:pb-0"
          >
            {/* Timeline Dot */}
            <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-purple-600 border-2 border-white dark:border-gray-800" />

            {/* Log Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-750 flex items-center justify-center">
                    {getActionIcon(log.action)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {log.description}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getActionColor(
                          log.action
                        )}`}
                      >
                        {getActionLabel(log.action)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      por <span className="font-medium">{log.actor}</span> ({log.actorEmail})
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(log.timestamp, true)}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {log.ipAddress}
                  </p>
                </div>
              </div>

              {/* Details */}
              {log.details && (
                <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-3 mt-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Detalhes:</span> {log.details}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <FaFilter className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Nenhum log encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Tente ajustar os filtros
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(AuditLogsTab);
