import React, { useMemo } from 'react';
import { FaEye, FaEdit, FaBan, FaCheckCircle } from 'react-icons/fa';
import StatusBadge from '../Shared/StatusBadge';
import PlanBadge from '../Shared/PlanBadge';
import EmptyState from '../Shared/EmptyState';
import { formatDate, formatPhone } from '../../utils/formatters';

/**
 * Tabela de Usuários
 * Exibe lista de usuários com ações
 */
export const UsersTable = ({ users, onUserClick, onSuspend, onActivate }) => {
  // Ordenar usuários por data de criação (mais recentes primeiro)
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [users]);

  if (!users || users.length === 0) {
    return (
      <EmptyState
        message="Nenhum usuário encontrado"
        description="Tente ajustar os filtros ou adicione um novo usuário"
      />
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Contato
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Plano
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Empresa
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Cadastro
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer"
                onClick={() => onUserClick(user)}
              >
                {/* Usuário */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {user.nome?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {user.nome}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.role === 'Admin' && (
                          <span className="text-purple-600 dark:text-purple-400 font-medium">
                            Super Admin
                          </span>
                        )}
                        {user.role !== 'Admin' && 'Usuário Comum'}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Contato */}
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="text-gray-900 dark:text-white">
                      {user.email}
                    </div>
                    {user.telefone && (
                      <div className="text-gray-500 dark:text-gray-400">
                        {formatPhone(user.telefone)}
                      </div>
                    )}
                  </div>
                </td>

                {/* Plano */}
                <td className="px-6 py-4">
                  <PlanBadge plan={user.plano} />
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <StatusBadge status={user.status} />
                </td>

                {/* Empresa */}
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {user.empresa || '-'}
                  </span>
                </td>

                {/* Cadastro */}
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(user.createdAt)}
                  </span>
                </td>

                {/* Ações */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUserClick(user, 'info');
                      }}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title="Ver Detalhes"
                    >
                      <FaEye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUserClick(user, 'config');
                      }}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title="Editar"
                    >
                      <FaEdit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>

                    {user.status === 'Ativo' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSuspend(user.id);
                        }}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Suspender"
                      >
                        <FaBan className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onActivate(user.id);
                        }}
                        className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                        title="Ativar"
                      >
                        <FaCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer com total */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Exibindo <span className="font-semibold">{users.length}</span> usuário(s)
        </p>
      </div>
    </div>
  );
};

export default React.memo(UsersTable);
