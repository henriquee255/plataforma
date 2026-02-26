// ✅ OTIMIZAÇÃO: React.memo, useMemo e useCallback implementados
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaHome, FaChartBar, FaUsers, FaEnvelope, FaCog, FaBars, FaTimes, FaRocket, FaSignOutAlt, FaMoon, FaSun, FaUser, FaUserShield, FaChevronUp, FaHandshake, FaUserFriends, FaPlug, FaSync, FaBuilding, FaBrain, FaBook } from 'react-icons/fa';
import { useAppContext } from './contexts/AppContext';
import { useAuth } from './hooks/useAuth';
import CompanySwitcher from './components/CompanySwitcher';

const Sidebar = React.memo(({ currentPage = 'dashboard', onNavigate = () => {}, isOpen = true, setIsOpen = () => {} }) => {
  const { appSettings, updateSettings } = useAppContext();
  const { user, logout: authLogout, isAuthenticated, isLoading } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(appSettings.theme === 'dark');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Estado para largura redimensionável
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('sidebarWidth');
    return saved ? parseInt(saved) : 256; // 256px = 16rem padrão
  });
  const [isResizing, setIsResizing] = useState(false);

  // Sincronizar estado local com o contexto
  useEffect(() => {
    setIsDarkMode(appSettings.theme === 'dark');
  }, [appSettings.theme]);

  // Detectar tamanho da tela e fechar sidebar em mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    // Executar na montagem
    handleResize();

    // Adicionar listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsOpen]);

  // ✅ OTIMIZAÇÃO: useCallback para evitar recriar funções
  const handleLogout = useCallback(async () => {
    await authLogout();
    // Redirecionar para página de login
    onNavigate('login');
  }, [authLogout, onNavigate]);

  const toggleTheme = useCallback(() => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    updateSettings({ theme: newTheme });
  }, [isDarkMode, updateSettings]);

  // ✅ OTIMIZAÇÃO: useCallback para funções de redimensionamento
  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e) => {
    // Nota: Não verificamos isResizing aqui pois a função só é chamada quando isResizing é true
    const newWidth = e.clientX;
    const minWidth = 200; // Mínimo 200px
    const maxWidth = 400; // Máximo 400px

    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setSidebarWidth(newWidth);
      localStorage.setItem('sidebarWidth', newWidth.toString());
    }
  }, []);

  // Event listeners para redimensionamento
  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);

      return () => {
        window.removeEventListener('mousemove', resize);
        window.removeEventListener('mouseup', stopResizing);
      };
    }
  }, [isResizing]);

  // ✅ OTIMIZAÇÃO: useMemo para evitar recriar array de menu items
  const menuItems = useMemo(() => [
    { icon: <FaHome />, label: 'Dashboard', page: 'dashboard' },
    { icon: <FaBuilding />, label: 'Empresas', page: 'companies' },
    { icon: <FaChartBar />, label: 'Relatórios', page: 'reports' },
    { icon: <FaEnvelope />, label: 'Inbox', page: 'inbox' },
    { icon: <FaUsers />, label: 'Contatos', page: 'contacts' },
    { icon: <FaHandshake />, label: 'CRM', page: 'crm' },
    { icon: <FaBrain />, label: 'IA', page: 'ia' },
    { icon: <FaUserFriends />, label: 'Equipe', page: 'team' },
    { icon: <FaPlug />, label: 'Conexões', page: 'connections' },
    { icon: <FaSync />, label: 'Integrações', page: 'integrations' },
    { icon: <FaBook />, label: 'Base de Conhecimento', page: 'knowledge' },
    { icon: <FaRocket />, label: 'Atalhos', page: 'shortcuts' },
  ], []);

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r-3 border-gray-900 dark:border-gray-700 z-50 transition-all duration-300 ease-in-out flex flex-col"
        style={{
          width: isOpen ? `${sidebarWidth}px` : '80px',
          boxShadow: 'var(--shadow-layered)',
          userSelect: isResizing ? 'none' : 'auto'
        }}
        role="navigation"
        aria-label="Menu de navegação principal"
      >
        {/* Handle de Redimensionamento */}
        {isOpen && (
          <div
            onMouseDown={startResizing}
            className="absolute top-0 right-0 w-1 h-full cursor-ew-resize hover:w-2 hover:bg-purple-500 transition-all group z-50"
            style={{
              background: isResizing ? '#9333ea' : 'transparent'
            }}
          >
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-1 h-12 bg-purple-500 rounded-full" />
            </div>
          </div>
        )}
        {/* Logo e Nome da Plataforma - FIXO */}
        <div className="flex-shrink-0 p-6 border-b-2 border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-center">
            {isOpen ? (
              <div className="text-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                  Plataforma
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-600 font-semibold mt-1">Dashboard</p>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">P</span>
              </div>
            )}
          </div>
        </div>

        {/* Company Switcher */}
        {isOpen && isAuthenticated && (
          <div className="flex-shrink-0 px-4 pt-4 pb-2">
            <CompanySwitcher />
          </div>
        )}

        {/* Menu Items - SCROLLABLE */}
        <nav
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-40 space-y-2 scroll-smooth sidebar-scrollbar"
          aria-label="Menu principal"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(139, 92, 246, 0.3) transparent'
          }}
        >
          {menuItems.map((item, index) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={index}
                onClick={() => onNavigate(item.page)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={`text-xl shrink-0 ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} aria-hidden="true">
                  {item.icon}
                </span>
                {isOpen && (
                  <span className="font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-4 top-24 w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
          aria-label={isOpen ? 'Fechar menu lateral' : 'Abrir menu lateral'}
          aria-expanded={isOpen}
        >
          {isOpen ? <FaTimes className="text-sm" aria-hidden="true" /> : <FaBars className="text-sm" aria-hidden="true" />}
        </button>

        {/* Footer - Usuário */}
        <div className="absolute bottom-0 left-0 right-0 border-t-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="p-3 border-b-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              {/* Perfil */}
              <button
                onClick={() => {
                  onNavigate('profile');
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all group"
                aria-label="Meu perfil"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                  <FaUser className="text-purple-600 dark:text-purple-400" aria-hidden="true" />
                </div>
                {isOpen && (
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold">Meu Perfil</p>
                    <p className="text-xs text-gray-600 dark:text-gray-600">Editar informações</p>
                  </div>
                )}
              </button>

              {/* Admin (apenas se for admin) */}
              {user?.role === 'admin' && (
                <button
                  onClick={() => {
                    onNavigate('admin');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-all group mt-1"
                  aria-label="Painel administrativo"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50 transition-colors">
                    <FaUserShield className="text-amber-600 dark:text-amber-400" aria-hidden="true" />
                  </div>
                  {isOpen && (
                    <div className="flex-1 text-left">
                      <p className="text-sm font-bold">Admin</p>
                      <p className="text-xs text-gray-600 dark:text-gray-600">Painel administrativo</p>
                    </div>
                  )}
                </button>
              )}

              {/* Divisor */}
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />

              {/* Tema */}
              <button
                onClick={() => {
                  toggleTheme();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
                aria-label={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                  {isDarkMode ? <FaSun className="text-blue-600 dark:text-blue-400" aria-hidden="true" /> : <FaMoon className="text-blue-600 dark:text-blue-400" aria-hidden="true" />}
                </div>
                {isOpen && (
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold">{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-600">Alternar tema</p>
                  </div>
                )}
              </button>

              {/* Logout */}
              <button
                onClick={() => {
                  handleLogout();
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all group mt-1"
                aria-label="Sair da conta"
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                  <FaSignOutAlt className="text-red-600 dark:text-red-400" aria-hidden="true" />
                </div>
                {isOpen && (
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold">Sair</p>
                    <p className="text-xs text-gray-600 dark:text-gray-600">Encerrar sessão</p>
                  </div>
                )}
              </button>
            </div>
          )}

          {/* User Profile Button */}
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            aria-label="Menu do usuário"
            aria-expanded={showUserMenu}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full border-2 border-purple-500 dark:border-purple-400 object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full border-2 border-purple-500 dark:border-purple-400 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <FaUser className="text-white text-xl" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full" aria-label="Online" />
            </div>

            {isOpen && (
              <div className="flex-1 min-w-0 text-left">
                {/* Nome */}
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                    {user?.name || 'Usuário'}
                  </p>
                  {user?.role === 'admin' && (
                    <span className="px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold rounded">
                      ADMIN
                    </span>
                  )}
                </div>
                {/* Email */}
                <p className="text-xs text-gray-600 dark:text-gray-600 truncate flex items-center gap-1">
                  <FaEnvelope className="text-xs" aria-hidden="true" />
                  {user?.email || 'email@exemplo.com'}
                </p>
              </div>
            )}

            {isOpen && (
              <FaChevronUp className={`text-gray-600 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} aria-hidden="true" />
            )}
          </button>
        </div>
      </aside>

      {/* Botão de toggle para mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed top-4 left-4 z-30 lg:hidden w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl flex items-center justify-center shadow-lg ${
          isOpen ? 'hidden' : 'block'
        }`}
        aria-label="Abrir menu de navegação"
      >
        <FaBars className="text-xl" aria-hidden="true" />
      </button>
    </>
  );
}, (prevProps, nextProps) => {
  // ✅ OTIMIZAÇÃO: Comparação customizada para evitar re-renders desnecessários
  // Retorna true se props são iguais (evita re-render)
  return (
    prevProps.currentPage === nextProps.currentPage &&
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.onNavigate === nextProps.onNavigate &&
    prevProps.setIsOpen === nextProps.setIsOpen
  );
});

// Adicionar displayName para debugging
Sidebar.displayName = 'Sidebar';

export default Sidebar;
