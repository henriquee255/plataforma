import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AdminProvider, useAdminContext } from './context/AdminContext';

// Shared Components
import AdminSidebar from './components/Shared/AdminSidebar';
import LoadingSpinner from './components/Shared/LoadingSpinner';

// Dashboard Components
import MetricsSection from './components/Dashboard/MetricsSection';
import PlanDistribution from './components/Dashboard/PlanDistribution';
import SubscriptionDistribution from './components/Dashboard/SubscriptionDistribution';
import RecentCompanies from './components/Dashboard/RecentCompanies';
import RecentUsers from './components/Dashboard/RecentUsers';

// Users Components
import UsersHeader from './components/Users/UsersHeader';
import UsersFilters from './components/Users/UsersFilters';
import UsersTable from './components/Users/UsersTable';
import UserModal from './components/Users/UserModal';

// Companies Components
import CompaniesHeader from './components/Companies/CompaniesHeader';
import CompaniesFilters from './components/Companies/CompaniesFilters';
import CompaniesTable from './components/Companies/CompaniesTable';
import CompanyModal from './components/Companies/CompanyModal';

// Settings Components
import BrandingSettings from './components/System/SettingsTab/BrandingSettings';
import BannersManagement from './components/System/SettingsTab/BannersManagement';
import ThemeCustomization from './components/System/SettingsTab/ThemeCustomization';
import EmailSettings from './components/System/SettingsTab/EmailSettings';
import SecuritySettings from './components/System/SettingsTab/SecuritySettings';

// Hooks
import { useUserManagement } from './hooks/useUserManagement';
import { useCompanyManagement } from './hooks/useCompanyManagement';
import { useAdminFilters } from './hooks/useAdminFilters';

/**
 * Conteúdo Principal do Admin
 * Renderiza o conteúdo baseado na tab ativa
 */
const AdminContent = () => {
  const { activeTab, openUserModal, openCompanyDetails } = useAdminContext();

  // Users
  const { users, loading: usersLoading, suspendUser, activateUser, refetch: refetchUsers } = useUserManagement();
  const { filteredData: filteredUsers } = useAdminFilters(users);

  // Companies
  const { companies, loading: companiesLoading, suspendCompany, activateCompany, refetch: refetchCompanies } = useCompanyManagement();
  const { filteredData: filteredCompanies } = useAdminFilters(companies);

  // User Handlers
  const handleAddUser = () => {
    openUserModal(null, 'info');
  };

  const handleUserClick = (user, tab = 'info') => {
    openUserModal(user, tab);
  };

  const handleSuspendUser = async (userId) => {
    await suspendUser(userId);
  };

  const handleActivateUser = async (userId) => {
    await activateUser(userId);
  };

  const handleExportUsers = () => {
    console.log('Exportar usuários...');
    // TODO: Implementar exportação
  };

  // Company Handlers
  const handleAddCompany = () => {
    openCompanyDetails(null);
  };

  const handleCompanyClick = (company, tab = 'detalhes') => {
    openCompanyDetails(company, tab);
  };

  const handleSuspendCompany = async (companyId) => {
    await suspendCompany(companyId);
  };

  const handleActivateCompany = async (companyId) => {
    await activateCompany(companyId);
  };

  const handleExportCompanies = () => {
    console.log('Exportar empresas...');
    // TODO: Implementar exportação
  };

  // Renderizar conteúdo baseado na tab ativa
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Dashboard Admin
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Visão geral da plataforma
              </p>
            </div>

            <MetricsSection />

            {/* Cards de Distribuição de Assinaturas em Linha */}
            <SubscriptionDistribution />

            {/* Tabelas de Empresas e Usuários Recentes */}
            <div className="space-y-6">
              <RecentCompanies />
              <RecentUsers />
            </div>
          </div>
        );

      case 'companies':
        return (
          <div className="space-y-6">
            <CompaniesHeader
              onAddCompany={handleAddCompany}
              onExport={handleExportCompanies}
              onRefresh={refetchCompanies}
            />

            <CompaniesFilters />

            {companiesLoading ? (
              <LoadingSpinner message="Carregando empresas..." />
            ) : (
              <CompaniesTable
                companies={filteredCompanies}
                onCompanyClick={handleCompanyClick}
                onSuspend={handleSuspendCompany}
                onActivate={handleActivateCompany}
              />
            )}
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <UsersHeader
              onAddUser={handleAddUser}
              onExport={handleExportUsers}
              onRefresh={refetchUsers}
            />

            <UsersFilters />

            {usersLoading ? (
              <LoadingSpinner message="Carregando usuários..." />
            ) : (
              <UsersTable
                users={filteredUsers}
                onUserClick={handleUserClick}
                onSuspend={handleSuspendUser}
                onActivate={handleActivateUser}
              />
            )}
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Integrações
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Status das integrações da plataforma
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Componentes de Integrações em desenvolvimento...
              </p>
            </div>
          </div>
        );

      case 'logs':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Logs do Sistema
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Histórico de eventos e ações
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Componentes de Logs em desenvolvimento...
              </p>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Métricas avançadas e relatórios
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Componentes de Analytics em desenvolvimento...
              </p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Configurações da Plataforma
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Configure branding, tema, banners e mais
              </p>
            </div>

            {/* Branding */}
            <BrandingSettings />

            {/* Banners */}
            <BannersManagement />

            {/* Theme Customization */}
            <ThemeCustomization />

            {/* Email Settings */}
            <EmailSettings />

            {/* Security Settings */}
            <SecuritySettings />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-gray-900">
      {renderContent()}
    </div>
  );
};

/**
 * Componente Principal do Admin
 * Wrapper que fornece AdminProvider
 */
const AdminPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Proteção: apenas admins podem acessar
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/unauthorized');
    }
  }, [user, navigate]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (!user || user.role !== 'admin') {
    return <LoadingSpinner fullScreen message="Verificando permissões..." />;
  }

  return (
    <AdminProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        <AdminSidebar onBack={handleBack} />
        <AdminContent />

        {/* Modais */}
        <UserModal />
        <CompanyModal />
      </div>
    </AdminProvider>
  );
};

export default AdminPage;
