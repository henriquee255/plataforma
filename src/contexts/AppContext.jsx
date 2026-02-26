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

  // Estado global do usuário
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('userData');
    return saved ? JSON.parse(saved) : {
      name: 'Henrique de Oliveira',
      email: 'eu.henriquee2501@gmail.com',
      avatar: 'https://ui-avatars.com/api/?name=Henrique+Oliveira&background=9333ea&color=fff&size=128',
      role: 'admin',
      cargo: 'Administrador',
      setor: 'geral', // Campo de setor adicionado: vendas, suporte, financeiro, rh, geral
      telefone: '',
      empresa: 'Minha Empresa',
      bio: ''
      // Senha removida por segurança - usar backend para autenticação
    };
  });

  // Estado global de assinatura - ACESSO COMPLETO PARA TODOS
  const [subscriptionStatus, setSubscriptionStatus] = useState(() => {
    // Sempre retorna 'enterprise' para acesso completo
    const saved = localStorage.getItem('subscriptionStatus');
    if (!saved) {
      localStorage.setItem('subscriptionStatus', 'enterprise');
      return 'enterprise';
    }
    return saved;
  });

  // Estado global de configurações
  const [appSettings, setAppSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    const settings = saved ? JSON.parse(saved) : {
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
  const [crmData, setCrmData] = useState(() => {
    const saved = localStorage.getItem('crmData');
    return saved ? JSON.parse(saved) : {
      pipelines: [],
      leads: [],
      stages: []
    };
  });

  // Estado global de Contatos
  const [contactsData, setContactsData] = useState(() => {
    const saved = localStorage.getItem('contactsData');
    return saved ? JSON.parse(saved) : {
      contacts: [],
      groups: [],
      tags: []
    };
  });

  // Estado global da Equipe
  const [teamData, setTeamData] = useState(() => {
    const saved = localStorage.getItem('teamData');
    return saved ? JSON.parse(saved) : {
      members: [],
      departments: [],
      roles: []
    };
  });

  // Estado global de Empresas
  const [companiesData, setCompaniesData] = useState(() => {
    const saved = localStorage.getItem('companiesData');
    return saved ? JSON.parse(saved) : {
      companies: []
    };
  });

  // Estado global da IA
  const [iaData, setIaData] = useState(() => {
    const saved = localStorage.getItem('iaData');
    return saved ? JSON.parse(saved) : {
      config: {},
      sources: [],
      conversations: [],
      learningDatabase: []
    };
  });

  // Estado global de Integrações
  const [integrationsData, setIntegrationsData] = useState(() => {
    const saved = localStorage.getItem('integrationsData');
    const defaultData = {
      integrations: [
        // PAGAMENTOS
        {
          id: 'kiwify',
          platform: 'kiwify',
          name: 'Kiwify',
          category: 'payments',
          status: 'connected',
          description: 'Plataforma completa de vendas digitais',
          lastSync: new Date().toISOString(),
          hasData: true,
          fields: [
            { name: 'client_id', label: 'Client ID', type: 'text', required: true, placeholder: 'Cole o Client ID da Kiwify' },
            { name: 'client_secret', label: 'Client Secret (Chave de API)', type: 'password', required: true, placeholder: 'Cole o Client Secret da Kiwify (mínimo 20 caracteres)' },
            { name: 'account_id', label: 'Account ID', type: 'text', required: true, placeholder: 'Cole o Account ID da Kiwify' },
            { name: 'webhookUrl', label: 'Webhook URL', type: 'text', readonly: true, value: 'https://api.plataforma.com/webhooks/kiwify' }
          ],
          instructions: [
            'Acesse o painel da Kiwify em dashboard.kiwify.com.br',
            'Vá em Configurações > API no menu lateral',
            'Clique em "Criar API Key"',
            'Copie os 3 campos: Client ID, Client Secret e Account ID',
            'Cole cada um no campo correspondente abaixo',
            'O Client Secret é sua chave de autenticação (mínimo 20 caracteres)',
            'Configure o Webhook URL no painel da Kiwify se desejar receber dados em tempo real'
          ],
          // DADOS MOCKADOS COMPLETOS
          products: [
            { id: 1, name: 'Super Links', price: 97.00, type: 'vitalicia' },
            { id: 2, name: 'Super Presell', price: 147.00, type: 'vitalicia' },
            { id: 3, name: 'Mentoria Elite', price: 497.00, type: 'mensal' },
            { id: 4, name: 'Pack Completo', price: 997.00, type: 'anual' }
          ],
          customers: [
            {
              id: 1,
              nome: 'João Pedro Silva',
              email: 'joao.pedro@email.com',
              cpf: '123.456.789-00',
              telefone: '+55 (11) 98765-4321',
              produto: 'Super Links',
              valor: 97.00,
              tipoPagamento: 'vitalicia',
              dataCompra: '2026-02-24T10:30:00',
              horaCompra: '10:30',
              status: 'approved',
              reembolsado: false
            },
            {
              id: 2,
              nome: 'Maria Oliveira Santos',
              email: 'maria.santos@email.com',
              cpf: '234.567.890-11',
              telefone: '+55 (11) 98765-4322',
              produto: 'Super Presell',
              valor: 147.00,
              tipoPagamento: 'vitalicia',
              dataCompra: '2026-02-24T14:15:00',
              horaCompra: '14:15',
              status: 'approved',
              reembolsado: false
            },
            {
              id: 3,
              nome: 'Carlos Eduardo Mendes',
              email: 'carlos.mendes@email.com',
              cpf: '345.678.901-22',
              telefone: '+55 (21) 98765-4323',
              produto: 'Mentoria Elite',
              valor: 497.00,
              tipoPagamento: 'mensal',
              dataCompra: '2026-02-23T16:45:00',
              horaCompra: '16:45',
              status: 'approved',
              reembolsado: false
            },
            {
              id: 4,
              nome: 'Ana Paula Costa',
              email: 'ana.costa@email.com',
              cpf: '456.789.012-33',
              telefone: '+55 (31) 98765-4324',
              produto: 'Pack Completo',
              valor: 997.00,
              tipoPagamento: 'anual',
              dataCompra: '2026-02-23T09:20:00',
              horaCompra: '09:20',
              status: 'approved',
              reembolsado: false
            },
            {
              id: 5,
              nome: 'Roberto Alves Lima',
              email: 'roberto.lima@email.com',
              cpf: '567.890.123-44',
              telefone: '+55 (41) 98765-4325',
              produto: 'Super Links',
              valor: 97.00,
              tipoPagamento: 'vitalicia',
              dataCompra: '2026-02-22T11:10:00',
              horaCompra: '11:10',
              status: 'refunded',
              reembolsado: true
            },
            {
              id: 6,
              nome: 'Fernanda Souza Rodrigues',
              email: 'fernanda.souza@email.com',
              cpf: '678.901.234-55',
              telefone: '+55 (51) 98765-4326',
              produto: 'Super Presell',
              valor: 147.00,
              tipoPagamento: 'vitalicia',
              dataCompra: '2026-02-21T13:30:00',
              horaCompra: '13:30',
              status: 'approved',
              reembolsado: false
            },
            {
              id: 7,
              nome: 'Paulo Henrique Dias',
              email: 'paulo.dias@email.com',
              cpf: '789.012.345-66',
              telefone: '+55 (61) 98765-4327',
              produto: 'Mentoria Elite',
              valor: 497.00,
              tipoPagamento: 'mensal',
              dataCompra: '2026-02-20T15:00:00',
              horaCompra: '15:00',
              status: 'refunded',
              reembolsado: true
            },
            {
              id: 8,
              nome: 'Juliana Ferreira Nunes',
              email: 'juliana.nunes@email.com',
              cpf: '890.123.456-77',
              telefone: '+55 (71) 98765-4328',
              produto: 'Pack Completo',
              valor: 997.00,
              tipoPagamento: 'anual',
              dataCompra: '2026-02-20T10:45:00',
              horaCompra: '10:45',
              status: 'approved',
              reembolsado: false
            }
          ],
          stats: {
            totalClientes: 8,
            totalVendas: 3476.00,
            totalReembolsos: 594.00,
            clientesAtivos: 6,
            clientesReembolsados: 2,
            vendasVitalicia: 4,
            vendasMensal: 2,
            vendasAnual: 2
          }
        },
        {
          id: 'hotmart',
          platform: 'hotmart',
          name: 'Hotmart',
          category: 'payments',
          status: 'connected',
          description: 'Marketplace de produtos digitais',
          lastSync: new Date().toISOString(),
          hasData: true,
          fields: [
            { name: 'client_id', label: 'Client ID', type: 'text', required: true, placeholder: 'Ex: abc123-def456...' },
            { name: 'client_secret', label: 'Client Secret', type: 'password', required: true, placeholder: 'Ex: secret_...' },
            { name: 'basic_token', label: 'Basic Token', type: 'password', required: true, placeholder: 'Ex: Basic abc123...' },
            { name: 'webhookUrl', label: 'Webhook URL (Postback)', type: 'text', readonly: true, value: 'https://api.plataforma.com/webhooks/hotmart' }
          ],
          instructions: [
            'Faça login na Hotmart em app.hotmart.com',
            'Vá em "Gerenciar meu negócio"',
            'Acesse Produtos > Ferramentas',
            'Clique em "Credenciais Hotmart"',
            'Clique em "Criar Credencial" > "API Hotmart"',
            'Copie client_id, client_secret e basic_token',
            'Configure o Postback (webhook) com a URL fornecida'
          ],
          // DADOS MOCKADOS COMPLETOS
          products: [
            { id: 1, name: 'Curso de Marketing Digital', price: 197.00, type: 'vitalicia' },
            { id: 2, name: 'Treinamento de Vendas', price: 397.00, type: 'vitalicia' },
            { id: 3, name: 'Assinatura Premium', price: 97.00, type: 'mensal' },
            { id: 4, name: 'Pacote Anual VIP', price: 1497.00, type: 'anual' }
          ],
          customers: [
            {
              id: 1,
              nome: 'Ricardo Santos Oliveira',
              email: 'ricardo.santos@email.com',
              cpf: '111.222.333-44',
              telefone: '+55 (11) 97777-1111',
              produto: 'Curso de Marketing Digital',
              valor: 197.00,
              tipoPagamento: 'vitalicia',
              dataCompra: '2026-02-24T09:15:00',
              horaCompra: '09:15',
              status: 'approved',
              reembolsado: false
            },
            {
              id: 2,
              nome: 'Patricia Lima Costa',
              email: 'patricia.lima@email.com',
              cpf: '222.333.444-55',
              telefone: '+55 (21) 97777-2222',
              produto: 'Treinamento de Vendas',
              valor: 397.00,
              tipoPagamento: 'vitalicia',
              dataCompra: '2026-02-24T11:30:00',
              horaCompra: '11:30',
              status: 'approved',
              reembolsado: false
            },
            {
              id: 3,
              nome: 'Marcos Paulo Silva',
              email: 'marcos.silva@email.com',
              cpf: '333.444.555-66',
              telefone: '+55 (31) 97777-3333',
              produto: 'Assinatura Premium',
              valor: 97.00,
              tipoPagamento: 'mensal',
              dataCompra: '2026-02-23T14:20:00',
              horaCompra: '14:20',
              status: 'approved',
              reembolsado: false
            },
            {
              id: 4,
              nome: 'Luciana Ferreira Alves',
              email: 'luciana.alves@email.com',
              cpf: '444.555.666-77',
              telefone: '+55 (41) 97777-4444',
              produto: 'Pacote Anual VIP',
              valor: 1497.00,
              tipoPagamento: 'anual',
              dataCompra: '2026-02-23T08:45:00',
              horaCompra: '08:45',
              status: 'approved',
              reembolsado: false
            },
            {
              id: 5,
              nome: 'Thiago Rodrigues Souza',
              email: 'thiago.souza@email.com',
              cpf: '555.666.777-88',
              telefone: '+55 (51) 97777-5555',
              produto: 'Curso de Marketing Digital',
              valor: 197.00,
              tipoPagamento: 'vitalicia',
              dataCompra: '2026-02-22T16:10:00',
              horaCompra: '16:10',
              status: 'refunded',
              reembolsado: true
            },
            {
              id: 6,
              nome: 'Camila Martins Dias',
              email: 'camila.dias@email.com',
              cpf: '666.777.888-99',
              telefone: '+55 (61) 97777-6666',
              produto: 'Assinatura Premium',
              valor: 97.00,
              tipoPagamento: 'mensal',
              dataCompra: '2026-02-21T10:00:00',
              horaCompra: '10:00',
              status: 'approved',
              reembolsado: false
            },
            {
              id: 7,
              nome: 'Bruno Henrique Nunes',
              email: 'bruno.nunes@email.com',
              cpf: '777.888.999-00',
              telefone: '+55 (71) 97777-7777',
              produto: 'Treinamento de Vendas',
              valor: 397.00,
              tipoPagamento: 'vitalicia',
              dataCompra: '2026-02-20T12:30:00',
              horaCompra: '12:30',
              status: 'approved',
              reembolsado: false
            },
            {
              id: 8,
              nome: 'Renata Oliveira Santos',
              email: 'renata.santos@email.com',
              cpf: '888.999.000-11',
              telefone: '+55 (81) 97777-8888',
              produto: 'Pacote Anual VIP',
              valor: 1497.00,
              tipoPagamento: 'anual',
              dataCompra: '2026-02-19T15:45:00',
              horaCompra: '15:45',
              status: 'refunded',
              reembolsado: true
            },
            {
              id: 9,
              nome: 'Diego Costa Pereira',
              email: 'diego.pereira@email.com',
              cpf: '999.000.111-22',
              telefone: '+55 (85) 97777-9999',
              produto: 'Curso de Marketing Digital',
              valor: 197.00,
              tipoPagamento: 'vitalicia',
              dataCompra: '2026-02-19T09:00:00',
              horaCompra: '09:00',
              status: 'approved',
              reembolsado: false
            },
            {
              id: 10,
              nome: 'Amanda Silva Rodrigues',
              email: 'amanda.rodrigues@email.com',
              cpf: '000.111.222-33',
              telefone: '+55 (91) 97777-0000',
              produto: 'Assinatura Premium',
              valor: 97.00,
              tipoPagamento: 'mensal',
              dataCompra: '2026-02-18T13:20:00',
              horaCompra: '13:20',
              status: 'approved',
              reembolsado: false
            }
          ],
          stats: {
            totalClientes: 10,
            totalVendas: 4170.00,
            totalReembolsos: 1694.00,
            clientesAtivos: 8,
            clientesReembolsados: 2,
            vendasVitalicia: 5,
            vendasMensal: 3,
            vendasAnual: 2
          }
        }
      ]
    };

    // Verifica se existe dados salvos E se o array de integrations não está vazio
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.integrations && Array.isArray(parsed.integrations) && parsed.integrations.length > 0) {
          return parsed;
        }
      } catch (error) {
        console.error('Erro ao carregar integrações salvas:', error);
      }
    }

    // Retorna dados padrão se não houver dados válidos salvos
    return defaultData;
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
