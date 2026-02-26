import React, { useState } from 'react';
import { FaBuilding, FaPlus, FaChevronDown, FaCheck, FaCrown, FaExclamationTriangle } from 'react-icons/fa';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useToast } from '../contexts/ToastContext';
import CreateCompanyModal from './Modals/CreateCompanyModal';

/**
 * Company Switcher
 * Dropdown para trocar entre empresas + criar nova com validação de plano
 */
const CompanySwitcher = ({ className = '' }) => {
  const {
    companies,
    currentCompany,
    switchCompany,
    canCreateCompany,
    plan,
  } = useSubscription();

  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Limites por plano
  const planLimits = {
    free: 0,
    starter: 1,
    professional: 3,
    enterprise: 5
  };

  const currentLimit = planLimits[plan] || 0;
  const ownedCompanies = companies.filter(c => c.role === 'owner');
  const currentCount = ownedCompanies.length;
  const usagePercent = currentLimit > 0 ? (currentCount / currentLimit) * 100 : 100;

  // Cor do indicador baseado no uso
  const getLimitColor = () => {
    if (usagePercent >= 100) return 'text-red-600 dark:text-red-400';
    if (usagePercent >= 70) return 'text-amber-600 dark:text-amber-400';
    return 'text-emerald-600 dark:text-emerald-400';
  };

  const handleCreateClick = () => {
    setIsOpen(false);

    if (!canCreateCompany) {
      toast.warning('Limite de empresas atingido!', {
        description: `Seu plano ${plan === 'free' ? 'Free' : plan.charAt(0).toUpperCase() + plan.slice(1)} permite apenas ${currentLimit} ${currentLimit === 1 ? 'empresa' : 'empresas'}. Faça upgrade para criar mais!`
      });
      return;
    }

    setShowCreateModal(true);
  };

  const handleSwitchCompany = (companyId) => {
    switchCompany(companyId);
    setIsOpen(false);
  };

  if (!currentCompany) {
    return (
      <div className={`p-4 ${className}`}>
        <button
          onClick={handleCreateClick}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/30"
        >
          <FaPlus className="inline mr-2" />
          Criar Primeira Empresa
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={`relative ${className}`}>
        {/* Current Company Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Logo/Icon */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
              {currentCompany.logo ? (
                <img
                  src={currentCompany.logo}
                  alt={currentCompany.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <FaBuilding className="w-5 h-5 text-white" />
              )}
            </div>

            {/* Name + Role */}
            <div className="flex-1 min-w-0 text-left">
              <div className="font-semibold text-gray-900 dark:text-white truncate">
                {currentCompany.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                {currentCompany.role === 'owner' && (
                  <>
                    <FaCrown className="w-3 h-3 text-yellow-500" />
                    <span>Owner</span>
                  </>
                )}
                {currentCompany.role === 'admin' && <span>Admin</span>}
                {currentCompany.role === 'member' && <span>Membro</span>}
              </div>
            </div>
          </div>

          {/* Chevron */}
          <FaChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-20 overflow-hidden max-h-96 overflow-y-auto">
              {/* Companies List */}
              <div className="py-2">
                {companies.map((company) => (
                  <button
                    key={company._id}
                    onClick={() => handleSwitchCompany(company._id)}
                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${
                      company._id === currentCompany._id
                        ? 'bg-purple-50 dark:bg-purple-900/20'
                        : ''
                    }`}
                  >
                    {/* Logo */}
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <FaBuilding className="w-4 h-4 text-white" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {company.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {company.role === 'owner' && '👑 Owner'}
                        {company.role === 'admin' && 'Admin'}
                        {company.role === 'member' && 'Membro'}
                      </div>
                    </div>

                    {/* Check */}
                    {company._id === currentCompany._id && (
                      <FaCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    )}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700" />

              {/* Create New */}
              <div className="p-2">
                <button
                  onClick={handleCreateClick}
                  disabled={!canCreateCompany}
                  className={`w-full px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                    canCreateCompany
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 hover:shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                  }`}
                  title={!canCreateCompany ? `Limite atingido (${currentCount}/${currentLimit})` : ''}
                >
                  {canCreateCompany ? (
                    <>
                      <FaPlus className="w-4 h-4" />
                      <span>Nova Empresa</span>
                    </>
                  ) : (
                    <>
                      <FaExclamationTriangle className="w-4 h-4" />
                      <span>Limite Atingido</span>
                    </>
                  )}
                </button>

                {/* Limite Info com Indicador Visual */}
                <div className={`mt-2 text-xs text-center font-semibold ${getLimitColor()}`}>
                  {plan === 'free' && (
                    <div>
                      <div>Plano Free</div>
                      <div className="text-gray-500 dark:text-gray-400 text-[10px] mt-0.5">
                        Não permite criar empresas
                      </div>
                    </div>
                  )}
                  {plan !== 'free' && (
                    <div>
                      <div className="flex items-center justify-center gap-1">
                        {usagePercent >= 100 && <FaExclamationTriangle className="w-3 h-3" />}
                        <span>{currentCount}/{currentLimit} empresas</span>
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-[10px] mt-0.5 capitalize">
                        Plano {plan === 'professional' ? 'Pro' : plan.charAt(0).toUpperCase() + plan.slice(1)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create Company Modal */}
      {showCreateModal && (
        <CreateCompanyModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
};

export default CompanySwitcher;
