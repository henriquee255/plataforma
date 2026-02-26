import React, { useState } from 'react';
import {
  FaCrown,
  FaCheck,
  FaRocket,
  FaStar,
  FaCreditCard,
  FaBuilding,
  FaUsers,
  FaChartLine,
  FaLock,
  FaPalette,
  FaBell,
} from 'react-icons/fa';
import { useSubscription } from '../contexts/SubscriptionContext';
import { PLANS, formatPrice } from '../config/plans';

/**
 * Página de Settings/Billing
 * Gerenciar assinatura, plano, empresas e configurações
 */
const Settings = ({ onNavigate }) => {
  const { subscription, companies, plan, canCreateCompany } = useSubscription();
  const [activeTab, setActiveTab] = useState('subscription'); // subscription | companies | billing | preferences

  // Tabs
  const tabs = [
    { id: 'subscription', label: 'Assinatura', icon: FaCrown },
    { id: 'companies', label: 'Empresas', icon: FaBuilding },
    { id: 'billing', label: 'Pagamentos', icon: FaCreditCard },
    { id: 'preferences', label: 'Preferências', icon: FaPalette },
  ];

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'subscription':
        return <SubscriptionTab subscription={subscription} currentPlan={plan} />;
      case 'companies':
        return <CompaniesTab companies={companies} canCreate={canCreateCompany} />;
      case 'billing':
        return <BillingTab subscription={subscription} />;
      case 'preferences':
        return <PreferencesTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Configurações
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie sua assinatura, empresas e preferências
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

/**
 * Tab: Assinatura
 */
const SubscriptionTab = ({ subscription, currentPlan }) => {
  const currentPlanConfig = PLANS[currentPlan];

  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Seu Plano Atual
        </h2>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{currentPlanConfig.badge}</span>
                <h3 className="text-3xl font-bold">{currentPlanConfig.name}</h3>
              </div>
              <p className="text-purple-100">{currentPlanConfig.description}</p>
            </div>

            <div className="text-right">
              <div className="text-5xl font-bold">
                {formatPrice(currentPlanConfig.price)}
              </div>
              {currentPlanConfig.price > 0 && (
                <div className="text-purple-100">por mês</div>
              )}
            </div>
          </div>

          {/* Limits */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-purple-400">
            <div>
              <div className="text-purple-100 text-sm mb-1">Empresas</div>
              <div className="text-2xl font-bold">
                {currentPlanConfig.limits.maxCompanies === 0
                  ? '0'
                  : currentPlanConfig.limits.maxCompanies === Infinity
                  ? '∞'
                  : currentPlanConfig.limits.maxCompanies}
              </div>
            </div>
            <div>
              <div className="text-purple-100 text-sm mb-1">Membros</div>
              <div className="text-2xl font-bold">∞</div>
            </div>
            <div>
              <div className="text-purple-100 text-sm mb-1">Storage</div>
              <div className="text-2xl font-bold">
                {currentPlanConfig.limits.maxStorage}
              </div>
            </div>
          </div>
        </div>

        {/* Usage */}
        {subscription?.usage && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <UsageCard
              icon={<FaBuilding />}
              label="Empresas Criadas"
              value={subscription.usage.companiesCreated}
              max={currentPlanConfig.limits.maxCompanies}
            />
            <UsageCard
              icon={<FaUsers />}
              label="Total de Membros"
              value={subscription.usage.totalMembers}
              max={Infinity}
            />
            <UsageCard
              icon={<FaChartLine />}
              label="Integrações Ativas"
              value={subscription.usage.integrationsActive}
              max={currentPlanConfig.limits.maxIntegrations}
            />
            <UsageCard
              icon={<FaLock />}
              label="Storage Usado"
              value={subscription.usage.storageUsed}
              max={currentPlanConfig.limits.maxStorage}
            />
          </div>
        )}
      </div>

      {/* Available Plans */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Planos Disponíveis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(PLANS).map((planConfig) => (
            <PlanCard
              key={planConfig.id}
              plan={planConfig}
              current={currentPlan === planConfig.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Usage Card Component
 */
const UsageCard = ({ icon, label, value, max }) => {
  const percentage = max === Infinity ? 0 : (value / max) * 100;

  return (
    <div className="bg-gray-50 dark:bg-gray-750 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {label}
          </div>
        </div>
      </div>

      {max !== Infinity && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
            {value} de {max}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Plan Card Component
 */
const PlanCard = ({ plan, current }) => {
  return (
    <div
      className={`rounded-2xl p-6 border-2 transition-all ${
        current
          ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-800'
      } ${plan.popular ? 'ring-2 ring-purple-400' : ''}`}
    >
      {/* Badge */}
      {plan.popular && (
        <div className="inline-block px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full mb-3">
          MAIS POPULAR
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">{plan.badge}</div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {plan.name}
        </h3>
        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
          {formatPrice(plan.price)}
        </div>
        {plan.price > 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400">/mês</div>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-2 mb-6">
        <li className="flex items-center gap-2 text-sm">
          <FaCheck className="text-green-500 flex-shrink-0" />
          <span className="text-gray-700 dark:text-gray-300">
            {plan.limits.maxCompanies === 0
              ? '0 empresas'
              : plan.limits.maxCompanies === Infinity
              ? 'Empresas ilimitadas'
              : `${plan.limits.maxCompanies} ${plan.limits.maxCompanies === 1 ? 'empresa' : 'empresas'}`}
          </span>
        </li>
        <li className="flex items-center gap-2 text-sm">
          <FaCheck className="text-green-500 flex-shrink-0" />
          <span className="text-gray-700 dark:text-gray-300">
            Membros ilimitados
          </span>
        </li>
        <li className="flex items-center gap-2 text-sm">
          <FaCheck className="text-green-500 flex-shrink-0" />
          <span className="text-gray-700 dark:text-gray-300">
            {plan.limits.maxStorage}
          </span>
        </li>
      </ul>

      {/* CTA */}
      <button
        className={`w-full py-3 rounded-lg font-medium transition-all ${
          current
            ? 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/30'
        }`}
        disabled={current}
      >
        {current ? 'Plano Atual' : plan.ctaText}
      </button>
    </div>
  );
};

/**
 * Tab: Companies
 */
const CompaniesTab = ({ companies, canCreate }) => {
  const ownedCompanies = companies.filter((c) => c.role === 'owner');
  const memberCompanies = companies.filter((c) => c.role !== 'owner');

  return (
    <div className="space-y-8">
      {/* Owned Companies */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Minhas Empresas ({ownedCompanies.length})
          </h2>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              canCreate
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!canCreate}
          >
            Nova Empresa
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ownedCompanies.map((company) => (
            <CompanyCard key={company._id} company={company} />
          ))}
        </div>
      </div>

      {/* Member Companies */}
      {memberCompanies.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Empresas que Participo ({memberCompanies.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memberCompanies.map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CompanyCard = ({ company }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-750 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <FaBuilding className="w-6 h-6 text-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate">
            {company.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${
                company.role === 'owner'
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                  : company.role === 'admin'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              {company.role === 'owner'
                ? 'Owner'
                : company.role === 'admin'
                ? 'Admin'
                : 'Membro'}
            </span>
            <span>•</span>
            <span>{company.members?.length || 0} membros</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Tab: Billing
 */
const BillingTab = ({ subscription }) => {
  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <FaCreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Histórico de Pagamentos
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Integração com gateway de pagamento em breve
        </p>
      </div>
    </div>
  );
};

/**
 * Tab: Preferences
 */
const PreferencesTab = () => {
  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <FaBell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Preferências
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Configurações de notificações e preferências em breve
        </p>
      </div>
    </div>
  );
};

export default Settings;
