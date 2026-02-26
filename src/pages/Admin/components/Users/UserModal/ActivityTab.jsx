import React, { useState } from 'react';
import {
  FaEnvelope,
  FaUserPlus,
  FaFileAlt,
  FaCog,
  FaSignInAlt,
  FaSignOutAlt,
  FaChartLine,
  FaFilter,
} from 'react-icons/fa';
import { formatDate } from '../../../utils/formatters';

/**
 * Tab de Atividades do Usuário
 * Histórico de ações recentes
 */
const ActivityTab = ({ user }) => {
  const [filterType, setFilterType] = useState('all');

  // Mock data - substituir por dados reais
  const activities = [
    {
      id: 'act-001',
      timestamp: '2024-02-25T10:30:00Z',
      action: 'login',
      description: 'Fez login na plataforma',
      device: 'Chrome no Windows',
      ipAddress: '192.168.1.100',
    },
    {
      id: 'act-002',
      timestamp: '2024-02-25T09:15:00Z',
      action: 'email_sent',
      description: 'Enviou 15 emails via Inbox',
      details: 'Campanhas de vendas',
    },
    {
      id: 'act-003',
      timestamp: '2024-02-24T16:45:00Z',
      action: 'contact_added',
      description: 'Adicionou 5 novos contatos',
      details: 'Importação via CSV',
    },
    {
      id: 'act-004',
      timestamp: '2024-02-24T14:20:00Z',
      action: 'report_generated',
      description: 'Gerou relatório de vendas',
      details: 'Relatório: Fevereiro 2024',
    },
    {
      id: 'act-005',
      timestamp: '2024-02-24T11:00:00Z',
      action: 'settings_updated',
      description: 'Atualizou configurações do perfil',
      details: 'Mudou foto e bio',
    },
    {
      id: 'act-006',
      timestamp: '2024-02-23T18:30:00Z',
      action: 'logout',
      description: 'Fez logout',
      device: 'Chrome no Windows',
    },
  ];

  const getActivityIcon = (action) => {
    const icons = {
      login: <FaSignInAlt className="text-green-500" />,
      logout: <FaSignOutAlt className="text-gray-500" />,
      email_sent: <FaEnvelope className="text-blue-500" />,
      contact_added: <FaUserPlus className="text-purple-500" />,
      report_generated: <FaChartLine className="text-orange-500" />,
      settings_updated: <FaCog className="text-blue-500" />,
    };
    return icons[action] || <FaFileAlt className="text-gray-400" />;
  };

  const getActivityLabel = (action) => {
    const labels = {
      login: 'Login',
      logout: 'Logout',
      email_sent: 'Email Enviado',
      contact_added: 'Contato Adicionado',
      report_generated: 'Relatório Gerado',
      settings_updated: 'Configurações Atualizadas',
    };
    return labels[action] || action;
  };

  const getActivityColor = (action) => {
    const colors = {
      login: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      logout: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
      email_sent: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      contact_added: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      report_generated: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      settings_updated: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    };
    return colors[action] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
  };

  const filteredActivities = filterType === 'all'
    ? activities
    : activities.filter(act => act.action.includes(filterType));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <FaSignInAlt className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Logins
              </p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                245
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <FaEnvelope className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Emails
              </p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                1.2k
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3">
            <FaUserPlus className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                Contatos
              </p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                450
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-3">
            <FaChartLine className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                Relatórios
              </p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                38
              </p>
            </div>
          </div>
        </div>
      </div>

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
          <option value="all">Todas</option>
          <option value="login">Login/Logout</option>
          <option value="email">Emails</option>
          <option value="contact">Contatos</option>
          <option value="report">Relatórios</option>
          <option value="settings">Configurações</option>
        </select>
      </div>

      {/* Activities Timeline */}
      <div className="space-y-3">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-750 flex items-center justify-center flex-shrink-0">
                {getActivityIcon(activity.action)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {activity.description}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getActivityColor(
                      activity.action
                    )}`}
                  >
                    {getActivityLabel(activity.action)}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{formatDate(activity.timestamp, true)}</span>
                  {activity.device && (
                    <>
                      <span>•</span>
                      <span>{activity.device}</span>
                    </>
                  )}
                  {activity.ipAddress && (
                    <>
                      <span>•</span>
                      <span>{activity.ipAddress}</span>
                    </>
                  )}
                </div>

                {activity.details && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {activity.details}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <FaFilter className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Nenhuma atividade encontrada
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Tente ajustar os filtros
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(ActivityTab);
