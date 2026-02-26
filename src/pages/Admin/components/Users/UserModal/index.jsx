import React, { useEffect } from 'react';
import { FaTimes, FaUser, FaCog, FaBolt, FaChartLine, FaShieldAlt, FaHistory } from 'react-icons/fa';
import { useAdminContext } from '../../../context/AdminContext';
import InfoTab from './InfoTab';
import ConfigTab from './ConfigTab';
import ActionsTab from './ActionsTab';
import ActivityTab from './ActivityTab';
import PermissionsTab from './PermissionsTab';
import AuditLogsTab from './AuditLogsTab';

/**
 * Modal de Usuário
 * 3 tabs: Informações, Configurações, Ações
 */
const UserModal = () => {
  const { userModal, closeUserModal, updateUserModalTab } = useAdminContext();

  // Prevenir scroll do body quando modal está aberto
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (userModal.open) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = originalOverflow || '';
    };
  }, [userModal.open]);

  if (!userModal.open) return null;

  const { user, activeTab } = userModal;
  const isNewUser = !user;

  // Tabs disponíveis
  const tabs = [
    { id: 'info', label: 'Informações', icon: FaUser },
    { id: 'config', label: 'Configurações', icon: FaCog },
    { id: 'actions', label: 'Ações', icon: FaBolt },
    { id: 'activity', label: 'Atividade', icon: FaChartLine },
    { id: 'permissions', label: 'Permissões', icon: FaShieldAlt },
    { id: 'audit', label: 'Audit Logs', icon: FaHistory },
  ];

  // Renderizar tab ativa
  const renderActiveTab = () => {
    const props = { user, isNewUser };

    switch (activeTab) {
      case 'info':
        return <InfoTab {...props} />;
      case 'config':
        return <ConfigTab {...props} />;
      case 'actions':
        return <ActionsTab {...props} />;
      case 'activity':
        return <ActivityTab user={user} />;
      case 'permissions':
        return <PermissionsTab {...props} />;
      case 'audit':
        return <AuditLogsTab user={user} />;
      default:
        return <InfoTab {...props} />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm animate-fade-in"
        style={{ zIndex: 9998 }}
        onClick={closeUserModal}
      />

      {/* Modal Container */}
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: 9999, pointerEvents: 'none' }}
      >
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
          style={{ pointerEvents: 'auto' }}
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <FaUser className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isNewUser ? 'Novo Usuário' : user.name}
              </h2>
              {!isNewUser && user.email && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={closeUserModal}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Fechar modal"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => updateUserModalTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
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
            onClick={closeUserModal}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                       text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
                       transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              // TODO: Save changes
              console.log('Save user changes');
              closeUserModal();
            }}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600
                       text-white hover:from-purple-600 hover:to-purple-700
                       transition-all shadow-lg shadow-purple-500/30 font-medium"
          >
            {isNewUser ? 'Criar Usuário' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default React.memo(UserModal);
