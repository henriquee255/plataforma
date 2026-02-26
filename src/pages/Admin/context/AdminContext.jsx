import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_FILTERS, DEFAULT_THEME } from '../utils/constants';

/**
 * Context do Admin - Gerencia estado global do painel
 */
const AdminContext = createContext();

/**
 * Provider do AdminContext
 * Centraliza estado e elimina prop drilling
 */
export const AdminProvider = ({ children }) => {
  // ===== NAVEGAÇÃO =====
  const [activeTab, setActiveTab] = useState('dashboard');

  // ===== TEMA =====
  const [adminTheme, setAdminTheme] = useState(() => {
    return localStorage.getItem('adminTheme') || DEFAULT_THEME;
  });

  // ===== MODAIS - USER =====
  const [userModal, setUserModal] = useState({
    open: false,
    user: null,
    activeTab: 'info',
    editingRole: 'comum'
  });

  // ===== MODAIS - COMPANY =====
  const [companyModal, setCompanyModal] = useState({
    detailsOpen: false,
    editOpen: false,
    company: null,
    activeTab: 'detalhes'
  });

  // ===== FILTROS =====
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // ===== CONFIGURAÇÕES DA PLATAFORMA =====
  const [platformSettings, setPlatformSettings] = useState(() => {
    const saved = localStorage.getItem('platformSettings');
    return saved ? JSON.parse(saved) : {
      branding: {
        logo: null,
        favicon: null,
        name: 'Plataforma'
      },
      theme: {
        primary: '#9333ea',
        secondary: '#a855f7',
        gradient: {
          start: '#9333ea',
          end: '#a855f7'
        }
      },
      banners: []
    };
  });

  // ===== APLICAR TEMA AO MONTAR =====
  useEffect(() => {
    // Salvar tema global antes de aplicar tema admin
    const hadDarkClass = document.documentElement.classList.contains('dark');
    localStorage.setItem('globalThemeBeforeAdmin', hadDarkClass ? 'dark' : 'light');

    // Aplicar tema admin
    applyThemeToDOM(adminTheme);

    // Cleanup: restaurar tema global ao desmontar
    return () => {
      const savedGlobalTheme = localStorage.getItem('globalThemeBeforeAdmin');
      if (savedGlobalTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    };
  }, []); // Apenas na montagem/desmontagem

  // ===== REAGIR A MUDANÇAS NO TEMA =====
  useEffect(() => {
    applyThemeToDOM(adminTheme);
  }, [adminTheme]);

  // ===== HELPERS - TEMA =====
  const applyThemeToDOM = useCallback((theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = adminTheme === 'light' ? 'dark' : 'light';
    setAdminTheme(newTheme);
    localStorage.setItem('adminTheme', newTheme);

    // Aplicar imediatamente
    setTimeout(() => {
      applyThemeToDOM(newTheme);
    }, 10);
  }, [adminTheme]);

  // ===== HELPERS - USER MODAL =====
  const openUserModal = useCallback((user, tab = 'info') => {
    setUserModal({
      open: true,
      user,
      activeTab: tab,
      editingRole: user?.role || 'comum'
    });
  }, []);

  const closeUserModal = useCallback(() => {
    setUserModal({
      open: false,
      user: null,
      activeTab: 'info',
      editingRole: 'comum'
    });
  }, []);

  const updateUserModalTab = useCallback((tab) => {
    setUserModal(prev => ({ ...prev, activeTab: tab }));
  }, []);

  // ===== HELPERS - COMPANY MODAL =====
  const openCompanyDetails = useCallback((company, tab = 'detalhes') => {
    setCompanyModal({
      detailsOpen: true,
      editOpen: false,
      company,
      activeTab: tab
    });
  }, []);

  const openCompanyEdit = useCallback((company) => {
    setCompanyModal({
      detailsOpen: false,
      editOpen: true,
      company,
      activeTab: 'detalhes'
    });
  }, []);

  const closeCompanyModal = useCallback(() => {
    setCompanyModal({
      detailsOpen: false,
      editOpen: false,
      company: null,
      activeTab: 'detalhes'
    });
  }, []);

  const updateCompanyModalTab = useCallback((tab) => {
    setCompanyModal(prev => ({ ...prev, activeTab: tab }));
  }, []);

  // ===== HELPERS - FILTROS =====
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const updateSearchTerm = useCallback((term) => {
    setFilters(prev => ({ ...prev, searchTerm: term }));
  }, []);

  // ===== HELPERS - PLATFORM SETTINGS =====
  const updatePlatformSettings = useCallback((updates) => {
    setPlatformSettings(prev => {
      const newSettings = { ...prev, ...updates };
      localStorage.setItem('platformSettings', JSON.stringify(newSettings));
      return newSettings;
    });
  }, []);

  const updateBranding = useCallback((branding) => {
    updatePlatformSettings({ branding: { ...platformSettings.branding, ...branding } });

    // Atualizar título se nome mudou
    if (branding.name) {
      document.title = branding.name;
    }

    // Atualizar favicon se mudou
    if (branding.favicon) {
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = branding.favicon;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [platformSettings, updatePlatformSettings]);

  const updateThemeColors = useCallback((colors) => {
    updatePlatformSettings({ theme: { ...platformSettings.theme, ...colors } });

    // Aplicar CSS variables
    if (colors.primary) {
      document.documentElement.style.setProperty('--color-primary', colors.primary);
    }
    if (colors.secondary) {
      document.documentElement.style.setProperty('--color-secondary', colors.secondary);
    }
  }, [platformSettings, updatePlatformSettings]);

  const addBanner = useCallback((banner) => {
    const newBanner = {
      ...banner,
      id: `banner-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    setPlatformSettings(prev => {
      const newSettings = {
        ...prev,
        banners: [...prev.banners, newBanner]
      };
      localStorage.setItem('platformSettings', JSON.stringify(newSettings));
      return newSettings;
    });
  }, []);

  const updateBanner = useCallback((id, updates) => {
    setPlatformSettings(prev => {
      const newSettings = {
        ...prev,
        banners: prev.banners.map(b => b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b)
      };
      localStorage.setItem('platformSettings', JSON.stringify(newSettings));
      return newSettings;
    });
  }, []);

  const deleteBanner = useCallback((id) => {
    setPlatformSettings(prev => {
      const newSettings = {
        ...prev,
        banners: prev.banners.filter(b => b.id !== id)
      };
      localStorage.setItem('platformSettings', JSON.stringify(newSettings));
      return newSettings;
    });
  }, []);

  // ===== VALUE =====
  const value = {
    // Navegação
    activeTab,
    setActiveTab,

    // Tema
    adminTheme,
    toggleTheme,
    setAdminTheme,

    // User Modal
    userModal,
    openUserModal,
    closeUserModal,
    updateUserModalTab,
    setUserModal,

    // Company Modal
    companyModal,
    openCompanyDetails,
    openCompanyEdit,
    closeCompanyModal,
    updateCompanyModalTab,
    setCompanyModal,

    // Filtros
    filters,
    updateFilter,
    resetFilters,
    updateSearchTerm,
    setFilters,

    // Platform Settings
    platformSettings,
    updatePlatformSettings,
    updateBranding,
    updateThemeColors,
    addBanner,
    updateBanner,
    deleteBanner
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

/**
 * Hook para usar AdminContext
 * @returns {Object} Admin context
 */
export const useAdminContext = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error('useAdminContext must be used within AdminProvider');
  }

  return context;
};

export default AdminContext;
