import React from 'react';
import { FaBuilding, FaSync, FaDownload, FaPlus } from 'react-icons/fa';
import AdminHeader from '../Shared/AdminHeader';

/**
 * Cabeçalho da página de Empresas
 * @param {Function} onAddCompany - Handler para adicionar empresa
 * @param {Function} onExport - Handler para exportar
 * @param {Function} onRefresh - Handler para atualizar dados
 */
const CompaniesHeader = ({ onAddCompany, onExport, onRefresh }) => {
  const actions = (
    <div className="flex items-center gap-3">
      {/* Botão Refresh */}
      <button
        onClick={onRefresh}
        className="flex items-center gap-2 px-4 py-2 rounded-lg
                   bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                   text-gray-700 dark:text-gray-300
                   hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
        aria-label="Atualizar dados"
      >
        <FaSync className="w-4 h-4" />
        <span className="hidden sm:inline font-medium">Atualizar</span>
      </button>

      {/* Botão Exportar */}
      <button
        onClick={onExport}
        className="flex items-center gap-2 px-4 py-2 rounded-lg
                   bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                   text-gray-700 dark:text-gray-300
                   hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
        aria-label="Exportar empresas"
      >
        <FaDownload className="w-4 h-4" />
        <span className="hidden sm:inline font-medium">Exportar</span>
      </button>

      {/* Botão Adicionar Empresa */}
      <button
        onClick={onAddCompany}
        className="flex items-center gap-2 px-4 py-2 rounded-lg
                   bg-gradient-to-r from-purple-500 to-purple-600
                   text-white hover:from-purple-600 hover:to-purple-700
                   transition-all shadow-lg shadow-purple-500/30"
        aria-label="Adicionar nova empresa"
      >
        <FaPlus className="w-4 h-4" />
        <span className="font-medium">Adicionar Empresa</span>
      </button>
    </div>
  );

  return (
    <AdminHeader
      title="Empresas"
      subtitle="Gerencie todas as empresas cadastradas na plataforma"
      icon={FaBuilding}
      actions={actions}
    />
  );
};

export default React.memo(CompaniesHeader);
