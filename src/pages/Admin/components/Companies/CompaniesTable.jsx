import React, { useMemo } from 'react';
import {
  FaBuilding,
  FaEye,
  FaEdit,
  FaBan,
  FaCheckCircle,
  FaUsers,
  FaCalendarAlt,
} from 'react-icons/fa';
import StatusBadge from '../Shared/StatusBadge';
import EmptyState from '../Shared/EmptyState';
import { formatDate, formatNumber } from '../../utils/formatters';

/**
 * Tabela de Empresas
 * @param {Array} companies - Lista de empresas
 * @param {Function} onCompanyClick - Handler para visualizar empresa
 * @param {Function} onSuspend - Handler para suspender empresa
 * @param {Function} onActivate - Handler para ativar empresa
 */
const CompaniesTable = ({ companies = [], onCompanyClick, onSuspend, onActivate }) => {
  // Ordenar empresas por data de cadastro (mais recentes primeiro)
  const sortedCompanies = useMemo(() => {
    return [...companies].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    });
  }, [companies]);

  // Empty state
  if (!companies || companies.length === 0) {
    return (
      <EmptyState
        icon={FaBuilding}
        message="Nenhuma empresa encontrada"
        description="Não há empresas cadastradas ou os filtros não retornaram resultados."
      />
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Empresa
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Dono
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Membros
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Cadastro
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedCompanies.map((company) => (
              <tr
                key={company.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                {/* Empresa */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar/Logo */}
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <FaBuilding className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white truncate">
                        {company.name}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Dono */}
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {company.ownerName || 'Não definido'}
                    </div>
                    {company.ownerEmail && (
                      <div className="text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {company.ownerEmail}
                      </div>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <StatusBadge status={company.status} />
                </td>

                {/* Membros */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm">
                    <FaUsers className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatNumber(company.membersCount || 0)}
                    </span>
                  </div>
                </td>

                {/* Cadastro */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <FaCalendarAlt className="w-3.5 h-3.5" />
                    <span>{formatDate(company.createdAt)}</span>
                  </div>
                </td>

                {/* Ações */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {/* Ver Detalhes */}
                    <button
                      onClick={() => onCompanyClick(company, 'detalhes')}
                      className="p-2 rounded-lg text-gray-600 dark:text-gray-400
                                 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Ver detalhes"
                      title="Ver detalhes"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>

                    {/* Editar */}
                    <button
                      onClick={() => onCompanyClick(company, 'configuracoes')}
                      className="p-2 rounded-lg text-blue-600 dark:text-blue-400
                                 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      aria-label="Editar empresa"
                      title="Editar"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>

                    {/* Suspender/Ativar */}
                    {company.status === 'Ativo' ? (
                      <button
                        onClick={() => onSuspend(company.id)}
                        className="p-2 rounded-lg text-red-600 dark:text-red-400
                                   hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        aria-label="Suspender empresa"
                        title="Suspender"
                      >
                        <FaBan className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onActivate(company.id)}
                        className="p-2 rounded-lg text-green-600 dark:text-green-400
                                   hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                        aria-label="Ativar empresa"
                        title="Ativar"
                      >
                        <FaCheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer com contador */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Exibindo <span className="font-semibold text-gray-900 dark:text-white">{companies.length}</span>{' '}
          {companies.length === 1 ? 'empresa' : 'empresas'}
        </p>
      </div>
    </div>
  );
};

export default React.memo(CompaniesTable);
