import React from 'react';
import { FaUser, FaEnvelope, FaCrown, FaCalendarAlt } from 'react-icons/fa';
import { formatDate } from '../../../utils/formatters';

/**
 * Tab de Membros da Empresa
 * Lista todos os usuários vinculados à empresa
 */
const MembersTab = ({ company }) => {
  // Mock members (substituir por dados reais)
  const members = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@empresa.com',
      role: 'owner',
      joinedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@empresa.com',
      role: 'admin',
      joinedAt: '2024-01-20T14:30:00Z',
    },
    {
      id: '3',
      name: 'Pedro Costa',
      email: 'pedro@empresa.com',
      role: 'member',
      joinedAt: '2024-02-01T09:15:00Z',
    },
  ];

  const getRoleBadge = (role) => {
    const configs = {
      owner: { label: 'Proprietário', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
      admin: { label: 'Administrador', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
      member: { label: 'Membro', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
    };

    const config = configs[role] || configs.member;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Membros da Empresa
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {members.length} {members.length === 1 ? 'membro' : 'membros'}
          </p>
        </div>
      </div>

      {/* Lista de Membros */}
      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="p-4 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <FaUser className="w-5 h-5 text-white" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {member.name}
                    </p>
                    {member.role === 'owner' && (
                      <FaCrown className="w-4 h-4 text-yellow-500" title="Proprietário" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <FaEnvelope className="w-3.5 h-3.5" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {getRoleBadge(member.role)}
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <FaCalendarAlt className="w-3 h-3" />
                      <span>Desde {formatDate(member.joinedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-750 dark:to-gray-700 rounded-xl">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {members.filter(m => m.role === 'owner').length}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Proprietário</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {members.filter(m => m.role === 'admin').length}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Admins</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {members.filter(m => m.role === 'member').length}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Membros</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MembersTab);
