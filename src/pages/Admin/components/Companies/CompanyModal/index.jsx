import React, { useEffect } from 'react';
import { FaTimes, FaBuilding, FaUsers, FaCreditCard, FaCog, FaMoneyBillWave, FaHistory } from 'react-icons/fa';
import { useAdminContext } from '../../../context/AdminContext';
import DetailsTab from './DetailsTab';
import MembersTab from './MembersTab';
import PlanActionsTab from './PlanActionsTab';
import SettingsTab from './SettingsTab';
import BillingTab from './BillingTab';
import AuditLogsTab from './AuditLogsTab';

/**
 * Modal de Empresa
 * 4 tabs: Detalhes, Membros, Plano & Ações, Configurações
 */
const CompanyModal = () => {
  const { companyModal, closeCompanyModal, updateCompanyModalTab } = useAdminContext();

  // Prevenir scroll do body quando modal está aberto
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (companyModal.detailsOpen || companyModal.editOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = originalOverflow || '';
    };
  }, [companyModal.detailsOpen, companyModal.editOpen]);

  if (!companyModal.detailsOpen && !companyModal.editOpen) return null;

  const { company, activeTab } = companyModal;
  const isEditMode = companyModal.editOpen;

  // Tabs disponíveis
  const tabs = [
    { id: 'detalhes', label: 'Detalhes', icon: FaBuilding },
    { id: 'membros', label: 'Membros', icon: FaUsers },
    { id: 'plano', label: 'Plano & Ações', icon: FaCreditCard },
    { id: 'configuracoes', label: 'Configurações', icon: FaCog },
    { id: 'billing', label: 'Billing', icon: FaMoneyBillWave },
    { id: 'audit', label: 'Audit Logs', icon: FaHistory },
  ];

  // Renderizar tab ativa
  const renderActiveTab = () => {
    const props = { company, isEditMode };

    switch (activeTab) {
      case 'detalhes':
        return <DetailsTab {...props} />;
      case 'membros':
        return <MembersTab {...props} />;
      case 'plano':
        return <PlanActionsTab {...props} />;
      case 'configuracoes':
        return <SettingsTab {...props} />;
      case 'billing':
        return <BillingTab company={company} />;
      case 'audit':
        return <AuditLogsTab company={company} />;
      default:
        return <DetailsTab {...props} />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm animate-fade-in"
        style={{ zIndex: 9998 }}
        onClick={closeCompanyModal}
      />

      {/* Modal Container */}
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: 9999, pointerEvents: 'none' }}
      >
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          style={{ pointerEvents: 'auto' }}
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              {company?.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <FaBuilding className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {company?.name || 'Nova Empresa'}
              </h2>
              {company?.cnpj && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  CNPJ: {company.cnpj}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={closeCompanyModal}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Fechar modal"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => updateCompanyModalTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap
                  ${
                    isActive
                      ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-800/50'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderActiveTab()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <button
            onClick={closeCompanyModal}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                       text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
                       transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              // TODO: Save changes
              console.log('Save company changes');
              closeCompanyModal();
            }}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600
                       text-white hover:from-purple-600 hover:to-purple-700
                       transition-all shadow-lg shadow-purple-500/30 font-medium"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default React.memo(CompanyModal);
