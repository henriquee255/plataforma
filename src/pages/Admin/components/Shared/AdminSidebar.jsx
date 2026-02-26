import React from 'react';
import {
  FaChartLine,
  FaBuilding,
  FaUsers,
  FaPlug,
  FaFileAlt,
  FaChartBar,
  FaCog,
  FaSun,
  FaMoon,
  FaChevronLeft
} from 'react-icons/fa';
import { useAdminContext } from '../../context/AdminContext';

/**
 * Sidebar de Navegação do Admin
 * Menu lateral com tabs e toggle de tema
 */
export const AdminSidebar = ({ onBack }) => {
  const { activeTab, setActiveTab, adminTheme, toggleTheme, platformSettings } = useAdminContext();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
    { id: 'companies', label: 'Empresas', icon: FaBuilding },
    { id: 'users', label: 'Usuários', icon: FaUsers },
    { id: 'integrations', label: 'Integrações', icon: FaPlug },
    { id: 'logs', label: 'Logs', icon: FaFileAlt },
    { id: 'analytics', label: 'Analytics', icon: FaChartBar },
    { id: 'settings', label: 'Configurações', icon: FaCog }
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        {/* Logo e Nome */}
        <div className="flex items-center gap-3 mb-4">
          {platformSettings.branding.logo ? (
            <img
              src={platformSettings.branding.logo}
              alt="Logo"
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {platformSettings.branding.name?.charAt(0) || 'P'}
              </span>
            </div>
          )}
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">
              {platformSettings.branding.name || 'Plataforma'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Painel Admin
            </p>
          </div>
        </div>

        {/* Botão Voltar */}
        <button
          onClick={onBack}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-xl
                     bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                     hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <FaChevronLeft className="w-4 h-4" />
          <span className="font-medium">Voltar ao Sistema</span>
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer com Toggle de Tema */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl
                     bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                     hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {adminTheme === 'light' ? (
            <>
              <FaMoon className="w-5 h-5" />
              <span className="font-medium">Modo Escuro</span>
            </>
          ) : (
            <>
              <FaSun className="w-5 h-5" />
              <span className="font-medium">Modo Claro</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default React.memo(AdminSidebar);
