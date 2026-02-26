import React from 'react';
import { FaUserPlus, FaDownload, FaSync } from 'react-icons/fa';
import AdminHeader from '../Shared/AdminHeader';

/**
 * Header da seção de Usuários
 * Com botões de ação
 */
export const UsersHeader = ({ onAddUser, onExport, onRefresh }) => {
  return (
    <AdminHeader
      title="Gerenciamento de Usuários"
      subtitle="Gerencie todos os usuários da plataforma"
      actions={
        <>
          {/* Refresh */}
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                       bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                       hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            title="Atualizar"
          >
            <FaSync className="w-4 h-4" />
          </button>

          {/* Exportar */}
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                       bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                       hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          >
            <FaDownload className="w-4 h-4" />
            <span className="font-medium">Exportar</span>
          </button>

          {/* Adicionar Usuário */}
          <button
            onClick={onAddUser}
            className="flex items-center gap-2 px-4 py-2 rounded-xl
                       bg-gradient-to-r from-purple-500 to-purple-600 text-white
                       hover:from-purple-600 hover:to-purple-700
                       shadow-lg shadow-purple-500/30
                       transition-all"
          >
            <FaUserPlus className="w-4 h-4" />
            <span className="font-medium">Adicionar Usuário</span>
          </button>
        </>
      }
    />
  );
};

export default React.memo(UsersHeader);
