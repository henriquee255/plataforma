// ✅ OTIMIZAÇÃO: Code-splitting implementado com React.lazy()
// Cada página será carregada apenas quando necessária
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useAppContext } from './contexts/AppContext';

// Componentes que sempre são necessários (não lazy)
import Sidebar from './Sidebar';

// Lazy loading de todas as páginas
const Dashboard = lazy(() => import('./Dashboard'));
const Reports = lazy(() => import('./Reports'));
const Profile = lazy(() => import('./Profile'));
const Inbox = lazy(() => import('./Inbox'));
const CRM = lazy(() => import('./CRM'));
const Contacts = lazy(() => import('./Contacts'));
const Team = lazy(() => import('./Team'));
const Connections = lazy(() => import('./Connections'));
const Integrations = lazy(() => import('./Integrations'));
const Companies = lazy(() => import('./Companies'));
const IA = lazy(() => import('./IA'));
const KnowledgeBase = lazy(() => import('./KnowledgeBase'));
const HelpCenter = lazy(() => import('./HelpCenter'));
const Shortcuts = lazy(() => import('./Shortcuts'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/LoginNew'));
const Register = lazy(() => import('./pages/Register'));
const Admin = lazy(() => import('./pages/Admin/index'));
const ActivityLogs = lazy(() => import('./pages/ActivityLogs'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const IntegrationsTest = lazy(() => import('./pages/IntegrationsTest'));
const Subscription = lazy(() => import('./pages/Subscription'));

// Loading component para Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400 font-semibold">Carregando...</p>
    </div>
  </div>
);

const MainLayout = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { subscriptionStatus, integrationsData, updateIntegrations } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Função de navegação para manter compatibilidade com código existente
  const handleNavigate = (page, params = {}) => {
    navigate(`/${page}`, { state: params });
  };

  // Salvar última página visitada (exceto login/register/subscription)
  useEffect(() => {
    const currentPath = location.pathname.slice(1) || 'dashboard';
    if (!['login', 'register', 'subscription', ''].includes(currentPath)) {
      localStorage.setItem('lastPage', currentPath);
    }
  }, [location.pathname]);

  // Verificar autenticação e redirecionar
  useEffect(() => {
    if (!authLoading) {
      const currentPath = location.pathname.slice(1);

      // Se não autenticado e não está em login/register, redirecionar para login
      if (!isAuthenticated && currentPath !== 'login' && currentPath !== 'register') {
        navigate('/login', { replace: true });
      }
      // Se autenticado e está em login/register, ir para dashboard ou última página
      else if (isAuthenticated && (currentPath === 'login' || currentPath === 'register' || currentPath === '')) {
        const lastPage = localStorage.getItem('lastPage') || 'dashboard';
        navigate(`/${lastPage}`, { replace: true });
      }
    }
  }, [isAuthenticated, authLoading, navigate, location.pathname]);

  // Páginas que não devem mostrar Sidebar principal
  const pagesWithoutSidebar = ['/login', '/register', '/subscription', '/unauthorized', '/help-center', '/admin'];
  const showSidebar = !pagesWithoutSidebar.includes(location.pathname);

  // Obter página atual da URL
  const getCurrentPage = () => {
    return location.pathname.slice(1) || 'dashboard';
  };

  // Mostrar loading enquanto verifica autenticação
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-semibold">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {showSidebar && (
        <Sidebar
          currentPage={getCurrentPage()}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
      )}
      <main
        id="main-content"
        className={`flex-1 transition-all duration-300 overflow-y-auto ${
          showSidebar ? (sidebarOpen ? 'lg:ml-64' : 'lg:ml-20') : ''
        }`}
        role="main"
        aria-label="Conteúdo principal"
      >
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Rota raiz redireciona para dashboard ou login */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Rotas autenticadas */}
            <Route path="/dashboard" element={<Dashboard onNavigate={handleNavigate} integrations={integrationsData.integrations} />} />
            <Route path="/companies" element={<Companies onNavigate={handleNavigate} />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/inbox" element={<Inbox selectedChatId={location.state?.chatId} />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/ia" element={<IA />} />
            <Route path="/contacts" element={<Contacts onNavigate={handleNavigate} />} />
            <Route path="/team" element={<Team onNavigate={handleNavigate} />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/integrations" element={<Integrations integrations={integrationsData.integrations} setIntegrations={(newIntegrations) => updateIntegrations({ integrations: newIntegrations })} />} />
            <Route path="/integrations-test" element={<IntegrationsTest onNavigate={handleNavigate} />} />
            <Route path="/knowledge" element={<KnowledgeBase onNavigate={handleNavigate} />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/shortcuts" element={<Shortcuts />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings onNavigate={handleNavigate} />} />
            <Route path="/admin" element={<Admin onNavigate={handleNavigate} />} />
            <Route path="/activity-logs" element={<ActivityLogs onNavigate={handleNavigate} />} />

            {/* Rotas públicas */}
            <Route path="/login" element={<Login onNavigate={handleNavigate} />} />
            <Route path="/register" element={<Register onNavigate={handleNavigate} />} />
            <Route path="/subscription" element={<Subscription onNavigate={handleNavigate} />} />
            <Route path="/unauthorized" element={<Unauthorized onNavigate={handleNavigate} />} />

            {/* Rota 404 - redireciona para dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default MainLayout;
