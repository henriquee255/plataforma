import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Hook customizado para usar o contexto
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [savingStatus, setSavingStatus] = useState(''); // '', 'saving', 'saved'
  const [lastSaved, setLastSaved] = useState(null);

  // LIMPAR LOCALSTORAGE NA INICIALIZAÇÃO (remover dados antigos mockados)
  useEffect(() => {
    // Limpar dados mockados antigos mantendo apenas autenticação
    const keysToRemove = [
      'userData',
      'contactsData',
      'crmData',
      'teamData',
      'companiesData',
      'iaData',
      'integrationsData',
      'subscriptionStatus'
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }, []);

  // Estado global do usuário (VAZIO por padrão)
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    avatar: '',
    role: '',
    cargo: '',
    setor: '',
    telefone: '',
    empresa: '',
    bio: ''
  });

  // Estado global de assinatura - ACESSO COMPLETO PARA TODOS
  const [subscriptionStatus, setSubscriptionStatus] = useState('enterprise');

  // Estado global de configurações
  const [appSettings, setAppSettings] = useState(() => {
    const settings = {
      theme: 'dark',
      notifications: true,
      autoSave: true,
      language: 'pt-BR'
    };

    // APLICAR TEMA IMEDIATAMENTE ao carregar
    const root = window.document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    return settings;
  });

  // Estado global do CRM
  const [crmData, setCrmData] = useState({
    pipelines: [],
    leads: [],
    stages: []
  });

  // Estado global de Contatos
  const [contactsData, setContactsData] = useState({
    contacts: [],
    groups: [],
    tags: []
  });

  // Estado global da Equipe
  const [teamData, setTeamData] = useState({
    members: [],
    departments: [],
    roles: []
  });

  // Estado global de Empresas
  const [companiesData, setCompaniesData] = useState({
    companies: []
  });

  // Estado global da IA
  const [iaData, setIaData] = useState({
    config: {},
    sources: [],
    conversations: [],
    learningDatabase: []
  });

  // Estado global de Integrações (VAZIO por padrão)
  const [integrationsData, setIntegrationsData] = useState({
    integrations: []
  });

  // Função para salvar automaticamente
  const saveData = (key, data) => {
    setSavingStatus('saving');
    localStorage.setItem(key, JSON.stringify(data));

    setTimeout(() => {
      setSavingStatus('saved');
      setLastSaved(new Date());

      setTimeout(() => {
        setSavingStatus('');
      }, 2000);
    }, 300);
  };

  // Aplicar tema ao documento - EXECUTA SEMPRE QUE MUDAR
  useEffect(() => {
    const root = window.document.documentElement;
    const body = document.body;

    // Remover ambas as classes primeiro
    root.classList.remove('dark', 'light');
    body.classList.remove('dark', 'light');

    if (appSettings.theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else if (appSettings.theme === 'light') {
      root.classList.add('light');
      body.classList.add('light');
    } else if (appSettings.theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
        body.classList.add('dark');
      } else {
        root.classList.add('light');
        body.classList.add('light');
      }
    }
  }, [appSettings.theme]); // FIX BUG #2: Removida duplicidade - appSettings.theme já inclui o valor necessário

  // Auto-save quando dados mudam
  useEffect(() => {
    if (appSettings.autoSave) {
      saveData('userData', userData);
    }
  }, [userData, appSettings.autoSave]);

  useEffect(() => {
    saveData('appSettings', appSettings);
  }, [appSettings]);

  useEffect(() => {
    if (appSettings.autoSave) {
      saveData('crmData', crmData);
    }
  }, [crmData, appSettings.autoSave]);

  useEffect(() => {
    if (appSettings.autoSave) {
      saveData('contactsData', contactsData);
    }
  }, [contactsData, appSettings.autoSave]);

  useEffect(() => {
    if (appSettings.autoSave) {
      saveData('teamData', teamData);
    }
  }, [teamData, appSettings.autoSave]);

  useEffect(() => {
    if (appSettings.autoSave) {
      saveData('companiesData', companiesData);
    }
  }, [companiesData, appSettings.autoSave]);

  useEffect(() => {
    if (appSettings.autoSave) {
      saveData('iaData', iaData);
    }
  }, [iaData, appSettings.autoSave]);

  useEffect(() => {
    if (appSettings.autoSave) {
      saveData('integrationsData', integrationsData);
    }
  }, [integrationsData, appSettings.autoSave]);

  // Função para atualizar usuário
  const updateUser = (updates) => {
    setUserData(prev => ({ ...prev, ...updates }));
  };

  // Função para atualizar configurações
  const updateSettings = (updates) => {
    setAppSettings(prev => ({ ...prev, ...updates }));
  };

  // Função para atualizar CRM
  const updateCRM = (updates) => {
    setCrmData(prev => ({ ...prev, ...updates }));
  };

  // Função para atualizar Contatos
  const updateContacts = (updates) => {
    setContactsData(prev => ({ ...prev, ...updates }));
  };

  // Função para atualizar Equipe
  const updateTeam = (updates) => {
    setTeamData(prev => ({ ...prev, ...updates }));
  };

  // Função para atualizar Empresas
  const updateCompanies = (updates) => {
    setCompaniesData(prev => ({ ...prev, ...updates }));
  };

  // Função para atualizar IA
  const updateIA = (updates) => {
    setIaData(prev => ({ ...prev, ...updates }));
  };

  // Função para atualizar Integrações
  const updateIntegrations = (updates) => {
    setIntegrationsData(prev => ({ ...prev, ...updates }));
  };

  // Função para limpar todos os dados
  const clearAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Função para exportar dados
  const exportData = () => {
    const allData = {
      userData,
      appSettings,
      crmData,
      contactsData,
      teamData,
      companiesData,
      iaData,
      integrationsData,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `plataforma-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  // Função para importar dados
  const importData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);

          if (data.userData) setUserData(data.userData);
          if (data.appSettings) setAppSettings(data.appSettings);
          if (data.crmData) setCrmData(data.crmData);
          if (data.contactsData) setContactsData(data.contactsData);
          if (data.teamData) setTeamData(data.teamData);
          if (data.companiesData) setCompaniesData(data.companiesData);
          if (data.iaData) setIaData(data.iaData);
          if (data.integrationsData) setIntegrationsData(data.integrationsData);

          resolve('Dados importados com sucesso!');
        } catch (error) {
          reject('Erro ao importar dados: ' + error.message);
        }
      };
      reader.readAsText(file);
    });
  };

  // Mapeamento de features por plano
  const planFeatures = {
    trial: {
      canEdit: false,
      maxIntegrations: 0,
      maxChannels: 0,
      maxTeamMembers: 1,
      hasAdvancedReports: false,
      hasIA: false,
      hasWhatsAppAPI: false,
      hasWidget: false,
      hasHelpCenter: false,
      hasAutoTags: false,
      hasMultipleCompanies: false,
      hasWebhooks: false,
      hasPrioritySupport: false,
      hasVIPSupport: false,
      features: []
    },
    starter: {
      canEdit: true,
      maxIntegrations: 2,
      maxChannels: 1,
      maxTeamMembers: 3,
      hasAdvancedReports: false,
      hasIA: false,
      hasWhatsAppAPI: false,
      hasWidget: false,
      hasHelpCenter: false,
      hasAutoTags: false,
      hasMultipleCompanies: false,
      hasWebhooks: false,
      hasPrioritySupport: false,
      hasVIPSupport: false,
      features: [
        'contacts_unlimited',
        'dashboard',
        'crm',
        'inbox',
        'basic_reports',
        'quick_replies_limited'
      ]
    },
    professional: {
      canEdit: true,
      maxIntegrations: -1, // ilimitado
      maxChannels: -1, // ilimitado
      maxTeamMembers: -1, // ilimitado
      hasAdvancedReports: true,
      hasIA: false,
      hasWhatsAppAPI: true,
      hasWidget: true,
      hasHelpCenter: false,
      hasAutoTags: false,
      hasMultipleCompanies: false,
      hasWebhooks: false,
      hasPrioritySupport: true,
      hasVIPSupport: false,
      features: [
        'contacts_unlimited',
        'dashboard',
        'crm',
        'inbox',
        'integrations_unlimited',
        'channels_all',
        'whatsapp_api',
        'quick_replies_unlimited',
        'widget',
        'team_unlimited',
        'advanced_reports',
        'purchase_tracking'
      ]
    },
    enterprise: {
      canEdit: true,
      maxIntegrations: -1,
      maxChannels: -1,
      maxTeamMembers: -1,
      hasAdvancedReports: true,
      hasIA: true,
      hasWhatsAppAPI: true,
      hasWidget: true,
      hasHelpCenter: true,
      hasAutoTags: true,
      hasMultipleCompanies: true,
      hasWebhooks: true,
      hasPrioritySupport: true,
      hasVIPSupport: true,
      features: [
        'contacts_unlimited',
        'dashboard',
        'crm',
        'inbox',
        'integrations_unlimited',
        'channels_all',
        'whatsapp_api',
        'quick_replies_unlimited',
        'widget',
        'team_unlimited',
        'advanced_reports',
        'purchase_tracking',
        'ia_automation',
        'auto_tags',
        'help_center',
        'custom_dashboards',
        'multiple_companies',
        'webhooks',
        'custom_api',
        'sla_999',
        'vip_support'
      ]
    }
  };

  // TODAS AS RESTRIÇÕES REMOVIDAS - ACESSO COMPLETO PARA TODOS

  // Função para verificar se usuário tem permissão - SEMPRE TRUE
  const canEdit = () => {
    return true; // Acesso completo liberado
  };

  // Função para verificar se tem acesso a uma feature específica - SEMPRE TRUE
  const hasFeature = (featureName) => {
    return true; // Todas as features liberadas
  };

  // Função para verificar limite de integrações - SEMPRE TRUE (ilimitado)
  const canAddIntegration = (currentCount) => {
    return true; // Integrações ilimitadas
  };

  // Função para verificar limite de canais - SEMPRE TRUE (ilimitado)
  const canAddChannel = (currentCount) => {
    return true; // Canais ilimitados
  };

  // Função para verificar limite de membros da equipe - SEMPRE TRUE (ilimitado)
  const canAddTeamMember = (currentCount) => {
    return true; // Membros ilimitados
  };

  // Função para obter informações do plano atual - SEMPRE ENTERPRISE
  const getCurrentPlan = () => {
    return planFeatures.enterprise; // Sempre retorna plano Enterprise completo
  };

  // Função para atualizar assinatura
  const updateSubscription = (status) => {
    setSubscriptionStatus(status);
    localStorage.setItem('subscriptionStatus', status);
  };

  const value = {
    // Estados
    userData,
    appSettings,
    crmData,
    contactsData,
    teamData,
    companiesData,
    iaData,
    integrationsData,
    subscriptionStatus,

    // Status de salvamento
    savingStatus,
    lastSaved,

    // Funções de atualização
    updateUser,
    updateSettings,
    updateCRM,
    updateContacts,
    updateTeam,
    updateCompanies,
    updateIA,
    updateIntegrations,
    updateSubscription,

    // Funções de permissão e features
    canEdit,
    hasFeature,
    canAddIntegration,
    canAddChannel,
    canAddTeamMember,
    getCurrentPlan,

    // Funções utilitárias
    clearAllData,
    exportData,
    importData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
