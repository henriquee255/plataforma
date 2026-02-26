import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../hooks/useAuth';
import {
  FaChartLine,
  FaUsers,
  FaUser,
  FaPlug,
  FaCog,
  FaFileAlt,
  FaChartBar,
  FaShieldAlt,
  FaArrowUp,
  FaArrowDown,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaChevronLeft,
  FaUserShield,
  FaServer,
  FaDollarSign,
  FaBuilding,
  FaCalendar,
  FaStar,
  FaInfinity,
  FaClock,
  FaSearch,
  FaUserPlus,
  FaEye,
  FaEdit,
  FaBan,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaCircle,
  FaKey,
  FaBell,
  FaPalette,
  FaDatabase,
  FaFilter,
  FaDownload,
  FaSync,
  FaCreditCard,
  FaSun,
  FaMoon,
  FaBriefcase,
  FaUserTie,
  FaCrown,
  FaShieldAlt as FaShield,
  FaGlobe,
  FaComments,
  FaLink,
  FaAddressBook,
  FaHistory
} from 'react-icons/fa';

const AdminNew = ({ onNavigate }) => {
  const { userData } = useAppContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Dark mode fix: aplicando em HTML e BODY
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlano, setFilterPlano] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userModalTab, setUserModalTab] = useState('info'); // info, config, actions
  const [editingUserRole, setEditingUserRole] = useState('comum'); // comum, superadmin

  // Estados para modais de empresa
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showCompanyDetailsModal, setShowCompanyDetailsModal] = useState(false);
  const [showCompanyEditModal, setShowCompanyEditModal] = useState(false);
  const [companyModalTab, setCompanyModalTab] = useState('detalhes'); // Tab ativa no modal de empresa

  // Estados para modal de edição de membro
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberEditModal, setShowMemberEditModal] = useState(false);

  // Estados para gerenciamento de Cargos/Setores/Roles
  const [showAddCargoModal, setShowAddCargoModal] = useState(false);
  const [showAddSetorModal, setShowAddSetorModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [editingCargo, setEditingCargo] = useState(null);
  const [editingSetor, setEditingSetor] = useState(null);
  const [editingRole, setEditingRole] = useState(null);

  // Estado do tema admin (independente do tema global)
  const [adminTheme, setAdminTheme] = useState(() => {
    const saved = localStorage.getItem('adminTheme');
    return saved || 'light';
  });

  // Salvar tema global na montagem e restaurar na desmontagem
  useEffect(() => {
    // Salvar tema global ao montar
    const hadDarkClass = document.documentElement.classList.contains('dark');
    localStorage.setItem('globalThemeBeforeAdmin', hadDarkClass ? 'dark' : 'light');
    console.log('📌 Tema global salvo:', hadDarkClass ? 'dark' : 'light');

    // Aplicar tema admin inicial
    if (adminTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }

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
      console.log('🔄 Restaurando tema global:', savedGlobalTheme);
    };
  }, []); // Roda apenas na montagem/desmontagem

  // Reagir a mudanças no adminTheme
  useEffect(() => {
    console.log('🔄 useEffect disparado - adminTheme mudou para:', adminTheme);
    if (adminTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      console.log('📘 useEffect: Classe dark adicionada ao HTML e BODY');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      console.log('📘 useEffect: Classe dark removida do HTML e BODY');
    }
  }, [adminTheme]);

  // Função para alternar tema
  const toggleTheme = () => {
    const newTheme = adminTheme === 'light' ? 'dark' : 'light';
    console.log('🎨 Alternando tema:', adminTheme, '→', newTheme);

    // PRIMEIRO: Atualizar estado (isso força re-render)
    setAdminTheme(newTheme);

    // SEGUNDO: Aplicar tema no DOM após pequeno delay para garantir que React processou
    setTimeout(() => {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
        console.log('✅ Classe dark ADICIONADA ao HTML e BODY');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        console.log('✅ Classe dark REMOVIDA do HTML e BODY');
      }
      console.log('HTML classes:', document.documentElement.className);
      console.log('BODY classes:', document.body.className);

      // Forçar repaint do browser
      document.body.style.display = 'none';
      document.body.offsetHeight; // Trigger reflow
      document.body.style.display = '';
    }, 10);

    // Salvar no localStorage
    localStorage.setItem('adminTheme', newTheme);
  };

  // PROTEÇÃO: Apenas usuários com role 'admin' podem acessar
  useEffect(() => {
    if (user && user.role !== 'admin') {
      // Redirecionar para página não autorizada
      navigate('/unauthorized');
    }
  }, [user, navigate]);

  // Dados mockados - Estatísticas
  const stats = {
    totalUsers: 1247,
    totalCompanies: 389,
    mrr: 156480,
    arr: 1877760,
    activeUsers: 892,
    totalRevenue: 284650.50,
    activeIntegrations: 15,
    systemUptime: '99.8%',
    avgResponseTime: '125ms',
    errorRate: '0.2%',
    newUsersThisMonth: 89,
    churnRate: 2.8,
    estimatedCancellations: 11
  };

  // Distribuição de planos
  const planDistribution = {
    free: 189,
    starter: 389,
    professional: 542,
    enterprise: 127
  };

  // Cores e labels dos planos
  const planInfo = {
    free: { label: 'Gratuito', color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700', icon: FaClock },
    trial: { label: 'Trial', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: FaClock },
    starter: { label: 'Starter', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: FaCalendar },
    professional: { label: 'Professional', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: FaStar },
    enterprise: { label: 'Enterprise', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: FaInfinity }
  };

  // Dados mockados - Usuários
  const users = [
    { id: 1, nome: 'João Silva', email: 'joao.silva@email.com', telefone: '+55 11 98765-4321', plano: 'professional', status: 'Ativo', dataCadastro: '2025-01-15', ultimoAcesso: '2026-02-24 14:30', faturamento: 2980.00, role: 'Admin' },
    { id: 2, nome: 'Maria Santos', email: 'maria.santos@email.com', telefone: '+55 11 98765-4322', plano: 'starter', status: 'Ativo', dataCadastro: '2025-02-10', ultimoAcesso: '2026-02-24 12:15', faturamento: 497.00, role: 'User' },
    { id: 3, nome: 'Pedro Costa', email: 'pedro.costa@email.com', telefone: '+55 11 98765-4323', plano: 'enterprise', status: 'Ativo', dataCadastro: '2024-11-20', ultimoAcesso: '2026-02-24 09:45', faturamento: 7490.00, role: 'Admin' },
    { id: 4, nome: 'Ana Paula', email: 'ana.paula@email.com', telefone: '+55 11 98765-4324', plano: 'professional', status: 'Suspenso', dataCadastro: '2025-03-05', ultimoAcesso: '2026-02-20 16:00', faturamento: 1490.00, role: 'User' },
    { id: 5, nome: 'Carlos Eduardo', email: 'carlos.eduardo@email.com', telefone: '+55 11 98765-4325', plano: 'trial', status: 'Trial', dataCadastro: '2026-02-20', ultimoAcesso: '2026-02-24 11:20', faturamento: 0.00, role: 'User' }
  ];

  // Dados mockados - Integrações
  const systemIntegrations = [
    { id: 1, name: 'Kiwify', type: 'Pagamento', status: 'Ativo', users: 342, lastSync: '2026-02-24 14:00' },
    { id: 2, name: 'Hotmart', type: 'Pagamento', status: 'Ativo', users: 218, lastSync: '2026-02-24 13:45' },
    { id: 3, name: 'Stripe', type: 'Pagamento', status: 'Ativo', users: 156, lastSync: '2026-02-24 14:15' },
    { id: 4, name: 'WhatsApp Business', type: 'Comunicação', status: 'Ativo', users: 892, lastSync: '2026-02-24 14:20' },
    { id: 5, name: 'Instagram', type: 'Social', status: 'Ativo', users: 567, lastSync: '2026-02-24 14:10' },
    { id: 6, name: 'Email SMTP', type: 'Email', status: 'Ativo', users: 1247, lastSync: '2026-02-24 14:05' }
  ];

  // Dados mockados - Logs
  const systemLogs = [
    { id: 1, timestamp: '2026-02-24 14:30:15', level: 'INFO', module: 'Auth', message: 'Login bem-sucedido: joao.silva@email.com', ip: '192.168.1.100' },
    { id: 2, timestamp: '2026-02-24 14:28:42', level: 'WARNING', module: 'Payment', message: 'Tentativa de pagamento duplicado detectada', ip: '192.168.1.105' },
    { id: 3, timestamp: '2026-02-24 14:25:10', level: 'ERROR', module: 'Integration', message: 'Falha na sincronização Kiwify - timeout', ip: '10.0.0.50' },
    { id: 4, timestamp: '2026-02-24 14:20:33', level: 'INFO', module: 'User', message: 'Novo usuário registrado: carlos.eduardo@email.com', ip: '192.168.1.110' },
    { id: 5, timestamp: '2026-02-24 14:15:05', level: 'INFO', module: 'System', message: 'Backup automático concluído com sucesso', ip: 'SYSTEM' },
    { id: 6, timestamp: '2026-02-24 14:10:28', level: 'WARNING', module: 'Security', message: 'Múltiplas tentativas de login falhadas: admin@test.com', ip: '203.45.67.89' },
    { id: 7, timestamp: '2026-02-24 14:05:12', level: 'ERROR', module: 'Database', message: 'Timeout na consulta de usuários - otimização necessária', ip: 'DB-SERVER' },
    { id: 8, timestamp: '2026-02-24 14:00:45', level: 'INFO', module: 'Analytics', message: 'Relatório mensal gerado e enviado', ip: 'SYSTEM' }
  ];

  // Empresas recentes
  const recentCompanies = [
    { id: 1000, name: 'Tech Solutions Ltda', email: 'contato@techsolutions.com', plan: 'enterprise', owner: 'João Silva', createdAt: '2026-02-20' },
    { id: 1001, name: 'Marketing Digital Pro', email: 'info@marketingpro.com', plan: 'professional', owner: 'Maria Santos', createdAt: '2026-02-19' },
    { id: 1002, name: 'Vendas Online Inc', email: 'vendas@vendasinc.com', plan: 'starter', owner: 'Pedro Costa', createdAt: '2026-02-18' },
    { id: 1003, name: 'E-commerce Global', email: 'admin@ecommerceglobal.com', plan: 'professional', owner: 'Ana Paula', createdAt: '2026-02-17' },
    { id: 1004, name: 'Infoprodutos Plus', email: 'contato@infoprodutosplus.com', plan: 'free', owner: 'Carlos Eduardo', createdAt: '2026-02-16' }
  ];

  // Dados mockados de membros por empresa
  const companyMembers = {
    1000: [ // Tech Solutions Ltda
      { id: 1, name: 'João Silva', email: 'joao.silva@techsolutions.com', cargo: 'CEO', setor: 'Executivo', role: 'owner', status: 'active', lastAccess: '2 horas atrás' },
      { id: 2, name: 'Maria Santos', email: 'maria.santos@techsolutions.com', cargo: 'Gerente de Vendas', setor: 'Comercial', role: 'admin', status: 'active', lastAccess: '5 horas atrás' },
      { id: 3, name: 'Pedro Oliveira', email: 'pedro.oliveira@techsolutions.com', cargo: 'Desenvolvedor Senior', setor: 'TI', role: 'member', status: 'active', lastAccess: '1 dia atrás' },
      { id: 4, name: 'Ana Costa', email: 'ana.costa@techsolutions.com', cargo: 'Analista de Marketing', setor: 'Marketing', role: 'member', status: 'active', lastAccess: '3 horas atrás' },
      { id: 5, name: 'Carlos Ferreira', email: 'carlos.ferreira@techsolutions.com', cargo: 'Diretor Financeiro', setor: 'Financeiro', role: 'admin', status: 'active', lastAccess: '1 hora atrás' },
      { id: 6, name: 'Julia Mendes', email: 'julia.mendes@techsolutions.com', cargo: 'Analista de Suporte', setor: 'Atendimento', role: 'member', status: 'inactive', lastAccess: '2 semanas atrás' }
    ],
    1001: [ // Marketing Digital Pro
      { id: 1, name: 'Maria Santos', email: 'maria@marketingpro.com', cargo: 'Diretora', setor: 'Executivo', role: 'owner', status: 'active', lastAccess: '30 minutos atrás' },
      { id: 2, name: 'Roberto Lima', email: 'roberto@marketingpro.com', cargo: 'Gestor de Mídias', setor: 'Marketing', role: 'admin', status: 'active', lastAccess: '2 horas atrás' },
      { id: 3, name: 'Fernanda Rocha', email: 'fernanda@marketingpro.com', cargo: 'Designer Gráfico', setor: 'Criação', role: 'member', status: 'active', lastAccess: '1 hora atrás' }
    ],
    1002: [ // Vendas Online Inc
      { id: 1, name: 'Pedro Costa', email: 'pedro@vendasinc.com', cargo: 'Fundador', setor: 'Executivo', role: 'owner', status: 'active', lastAccess: 'Agora' },
      { id: 2, name: 'Beatriz Alves', email: 'beatriz@vendasinc.com', cargo: 'Gerente Comercial', setor: 'Vendas', role: 'admin', status: 'active', lastAccess: '4 horas atrás' }
    ],
    1003: [ // E-commerce Global
      { id: 1, name: 'Ana Paula', email: 'ana@ecommerceglobal.com', cargo: 'CEO', setor: 'Executivo', role: 'owner', status: 'active', lastAccess: '1 hora atrás' }
    ],
    1004: [] // Infoprodutos Plus - sem membros ainda
  };

  // Configurações personalizadas por empresa (Cargos, Setores, Roles)
  const companySettings = {
    1000: { // Tech Solutions Ltda
      cargos: [
        { id: 1, name: 'CEO' },
        { id: 2, name: 'Gerente de Vendas' },
        { id: 3, name: 'Desenvolvedor Senior' },
        { id: 4, name: 'Analista de Marketing' },
        { id: 5, name: 'Diretor Financeiro' },
        { id: 6, name: 'Analista de Suporte' }
      ],
      setores: [
        { id: 1, name: 'Executivo' },
        { id: 2, name: 'Comercial' },
        { id: 3, name: 'TI' },
        { id: 4, name: 'Marketing' },
        { id: 5, name: 'Financeiro' },
        { id: 6, name: 'Atendimento' }
      ],
      roles: [
        {
          id: 1,
          name: 'Owner',
          color: 'purple',
          permissions: ['all'] // Acesso total
        },
        {
          id: 2,
          name: 'Administrador',
          color: 'blue',
          permissions: ['gerenciar_membros', 'editar_configuracoes', 'visualizar_relatorios', 'gerenciar_integrações']
        },
        {
          id: 3,
          name: 'Membro',
          color: 'gray',
          permissions: ['visualizar_dashboard', 'editar_perfil']
        }
      ]
    },
    1001: { // Marketing Digital Pro
      cargos: [
        { id: 1, name: 'Diretora' },
        { id: 2, name: 'Gestor de Mídias' },
        { id: 3, name: 'Designer Gráfico' }
      ],
      setores: [
        { id: 1, name: 'Executivo' },
        { id: 2, name: 'Marketing' },
        { id: 3, name: 'Criação' }
      ],
      roles: [
        { id: 1, name: 'Owner', color: 'purple', permissions: ['all'] },
        { id: 2, name: 'Gestor', color: 'blue', permissions: ['gerenciar_campanhas', 'visualizar_relatorios'] },
        { id: 3, name: 'Criativo', color: 'green', permissions: ['criar_conteudo', 'editar_design'] }
      ]
    },
    1002: { // Vendas Online Inc
      cargos: [
        { id: 1, name: 'Fundador' },
        { id: 2, name: 'Gerente Comercial' }
      ],
      setores: [
        { id: 1, name: 'Executivo' },
        { id: 2, name: 'Vendas' }
      ],
      roles: [
        { id: 1, name: 'Owner', color: 'purple', permissions: ['all'] },
        { id: 2, name: 'Vendedor', color: 'green', permissions: ['acessar_crm', 'criar_propostas'] }
      ]
    },
    1003: { // E-commerce Global
      cargos: [{ id: 1, name: 'CEO' }],
      setores: [{ id: 1, name: 'Executivo' }],
      roles: [{ id: 1, name: 'Owner', color: 'purple', permissions: ['all'] }]
    },
    1004: { // Infoprodutos Plus
      cargos: [],
      setores: [],
      roles: [{ id: 1, name: 'Owner', color: 'purple', permissions: ['all'] }]
    }
  };

  // Permissões REAIS do sistema (mesmas do painel principal Team.jsx)
  const permissoesDoSistema = {
    dashboard: {
      nome: 'Dashboard',
      permissoes: [
        { id: 'dashboard_visualizar', nome: 'Visualizar Dashboard Principal' },
        { id: 'dashboard_editar', nome: 'Editar Dashboard' },
        { id: 'dashboard_integracoes', nome: 'Ver Dashboard de Integrações' },
        { id: 'dashboard_exportar', nome: 'Exportar Dados' }
      ]
    },
    inbox: {
      nome: 'Inbox',
      permissoes: [
        { id: 'inbox_visualizar', nome: 'Visualizar Conversas' },
        { id: 'inbox_responder', nome: 'Responder Mensagens' },
        { id: 'inbox_editar', nome: 'Editar Mensagens' },
        { id: 'inbox_deletar', nome: 'Deletar Mensagens' },
        { id: 'inbox_arquivar', nome: 'Arquivar Conversas' },
        { id: 'inbox_exportar', nome: 'Exportar Conversas' },
        { id: 'inbox_importar', nome: 'Importar Conversas' }
      ]
    },
    crm: {
      nome: 'CRM',
      permissoes: [
        { id: 'crm_visualizar', nome: 'Visualizar Pipeline' },
        { id: 'crm_editar', nome: 'Editar Leads' },
        { id: 'crm_criar', nome: 'Criar Leads' },
        { id: 'crm_deletar', nome: 'Deletar Leads' },
        { id: 'crm_valores', nome: 'Ver Valores de Todos Pipelines' },
        { id: 'crm_valores_proprios', nome: 'Ver Apenas Valores Próprios' },
        { id: 'crm_exportar', nome: 'Exportar Dados' },
        { id: 'crm_importar', nome: 'Importar Dados' }
      ]
    },
    contatos: {
      nome: 'Contatos',
      permissoes: [
        { id: 'contatos_visualizar', nome: 'Visualizar Contatos' },
        { id: 'contatos_editar', nome: 'Editar Contatos' },
        { id: 'contatos_criar', nome: 'Criar Contatos' },
        { id: 'contatos_deletar', nome: 'Deletar Contatos' },
        { id: 'contatos_exportar', nome: 'Exportar Contatos' },
        { id: 'contatos_importar', nome: 'Importar Contatos' }
      ]
    },
    relatorios: {
      nome: 'Relatórios',
      permissoes: [
        { id: 'relatorios_visualizar', nome: 'Visualizar Relatórios' },
        { id: 'relatorios_editar', nome: 'Editar Relatórios' },
        { id: 'relatorios_criar', nome: 'Criar Relatórios' },
        { id: 'relatorios_exportar', nome: 'Exportar Relatórios' },
        { id: 'relatorios_deletar', nome: 'Deletar Relatórios' }
      ]
    },
    equipe: {
      nome: 'Equipe',
      permissoes: [
        { id: 'equipe_visualizar', nome: 'Visualizar Equipe' },
        { id: 'equipe_editar', nome: 'Editar Membros' },
        { id: 'equipe_criar', nome: 'Adicionar Membros' },
        { id: 'equipe_deletar', nome: 'Remover Membros' },
        { id: 'equipe_permissoes', nome: 'Gerenciar Permissões' },
        { id: 'equipe_exportar', nome: 'Exportar Dados' }
      ]
    },
    integracoes: {
      nome: 'Integrações',
      permissoes: [
        { id: 'integracoes_visualizar', nome: 'Visualizar Integrações' },
        { id: 'integracoes_conectar', nome: 'Conectar/Desconectar' },
        { id: 'integracoes_configurar', nome: 'Configurar Integrações' },
        { id: 'integracoes_dashboard', nome: 'Ver Dashboard de Integrações' }
      ]
    },
    conexoes: {
      nome: 'Conexões',
      permissoes: [
        { id: 'conexoes_visualizar', nome: 'Visualizar Conexões' },
        { id: 'conexoes_conectar', nome: 'Conectar/Desconectar Canais' },
        { id: 'conexoes_editar', nome: 'Editar Conexões' },
        { id: 'conexoes_criar', nome: 'Criar Novas Conexões' },
        { id: 'conexoes_deletar', nome: 'Deletar Conexões' },
        { id: 'conexoes_configurar', nome: 'Configurar Conexões' }
      ]
    },
    configuracoes: {
      nome: 'Configurações',
      permissoes: [
        { id: 'config_visualizar', nome: 'Visualizar Configurações' },
        { id: 'config_editar', nome: 'Editar Configurações' },
        { id: 'config_acesso_total', nome: 'Acesso Total às Configurações' }
      ]
    }
  };

  // Permissões de SuperAdmin (Painel Administrativo)
  const permissoesSuperAdmin = {
    dashboard: {
      nome: 'Dashboard Geral',
      permissoes: [
        { id: 'admin_dashboard_visualizar', nome: 'Visualizar Dashboard Administrativo' },
        { id: 'admin_dashboard_metricas', nome: 'Ver Métricas e Estatísticas' },
        { id: 'admin_dashboard_exportar', nome: 'Exportar Dados' }
      ]
    },
    empresas: {
      nome: 'Gerenciar Empresas',
      permissoes: [
        { id: 'admin_empresas_visualizar', nome: 'Visualizar Empresas' },
        { id: 'admin_empresas_editar', nome: 'Editar Empresas' },
        { id: 'admin_empresas_criar', nome: 'Criar Empresas' },
        { id: 'admin_empresas_deletar', nome: 'Deletar Empresas' },
        { id: 'admin_empresas_suspender', nome: 'Suspender Empresas' },
        { id: 'admin_empresas_planos', nome: 'Gerenciar Planos' }
      ]
    },
    usuarios: {
      nome: 'Gerenciar Usuários',
      permissoes: [
        { id: 'admin_usuarios_visualizar', nome: 'Visualizar Usuários' },
        { id: 'admin_usuarios_editar', nome: 'Editar Usuários' },
        { id: 'admin_usuarios_criar', nome: 'Criar Usuários' },
        { id: 'admin_usuarios_deletar', nome: 'Deletar Usuários' },
        { id: 'admin_usuarios_suspender', nome: 'Suspender Usuários' },
        { id: 'admin_usuarios_permissoes', nome: 'Gerenciar Permissões' }
      ]
    },
    integracoes: {
      nome: 'Integrações do Sistema',
      permissoes: [
        { id: 'admin_integracoes_visualizar', nome: 'Visualizar Integrações' },
        { id: 'admin_integracoes_gerenciar', nome: 'Gerenciar Integrações' },
        { id: 'admin_integracoes_configurar', nome: 'Configurar Sistema' }
      ]
    },
    logs: {
      nome: 'Logs de Atividade',
      permissoes: [
        { id: 'admin_logs_visualizar', nome: 'Visualizar Logs' },
        { id: 'admin_logs_exportar', nome: 'Exportar Logs' },
        { id: 'admin_logs_deletar', nome: 'Deletar Logs' }
      ]
    },
    analytics: {
      nome: 'Analytics e Relatórios',
      permissoes: [
        { id: 'admin_analytics_visualizar', nome: 'Visualizar Analytics' },
        { id: 'admin_analytics_relatorios', nome: 'Gerar Relatórios' },
        { id: 'admin_analytics_exportar', nome: 'Exportar Dados' }
      ]
    },
    configuracoes: {
      nome: 'Configurações Globais',
      permissoes: [
        { id: 'admin_config_visualizar', nome: 'Visualizar Configurações' },
        { id: 'admin_config_editar', nome: 'Editar Configurações' },
        { id: 'admin_config_sistema', nome: 'Configurações do Sistema' }
      ]
    }
  };

  // Menu items
  const menuItems = [
    { id: 'dashboard', icon: FaChartLine, label: 'Geral' },
    { id: 'companies', icon: FaBuilding, label: 'Empresas' },
    { id: 'users', icon: FaUsers, label: 'Usuários & Admins' },
    { id: 'integrations', icon: FaPlug, label: 'Integrações' },
    { id: 'logs', icon: FaFileAlt, label: 'Logs de Atividade' },
    { id: 'analytics', icon: FaChartBar, label: 'Analytics' },
    { id: 'settings', icon: FaCog, label: 'Configurações Globais' }
  ];

  // Filtros avançados
  const filteredUsers = users.filter(user => {
    // Filtro de busca por texto
    const matchesSearch =
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planInfo[user.plano]?.label.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por plano
    const matchesPlano = filterPlano === 'todos' || user.plano === filterPlano;

    // Filtro por status
    const matchesStatus = filterStatus === 'todos' || user.status === filterStatus;

    // Filtro por tipo (SuperAdmin vs Usuário Comum)
    const matchesTipo =
      filterTipo === 'todos' ||
      (filterTipo === 'superadmin' && user.role === 'Admin') ||
      (filterTipo === 'comum' && user.role !== 'Admin');

    return matchesSearch && matchesPlano && matchesStatus && matchesTipo;
  });

  // Handlers
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
    setUserModalTab('info'); // Reset para tab inicial
    // Inicializar role corretamente
    setEditingUserRole(user.role === 'Admin' ? 'superadmin' : 'comum');
  };

  // Helper functions
  const getStatusColor = (status) => {
    const colors = {
      'Ativo': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Suspenso': 'bg-red-100 text-red-700 border-red-200',
      'Trial': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Inativo': 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700';
  };

  const getLogLevelColor = (level) => {
    const colors = {
      'INFO': 'bg-blue-100 text-blue-700 border-blue-200',
      'WARNING': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'ERROR': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[level] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700';
  };

  // Card de Estatística
  const StatCard = ({ label, value, sub, icon: Icon, color, bg, trend, trendValue }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        {trendValue && trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold ${
            trend === 'up' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' :
            trend === 'down' ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400' :
            'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}>
            {trend === 'up' ? <FaArrowUp className="w-3 h-3" /> :
             trend === 'down' ? <FaArrowDown className="w-3 h-3" /> : null}
            {trendValue}
          </div>
        )}
      </div>
      <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{value}</h3>
      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">{sub}</p>
    </div>
  );

  const displayName = userData.name || userData.email || 'Admin';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar Admin - Responsiva ao Dark Mode */}
      <aside className="w-64 bg-white dark:bg-[#0f172a] border-r border-gray-200 dark:border-gray-800 text-gray-700 dark:text-slate-300 flex flex-col shadow-xl z-50">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex-shrink-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <FaShieldAlt className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-gray-900 dark:text-white font-black tracking-tight leading-none uppercase text-lg">Super Admin</h1>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-1">Platform Control</p>
            </div>
            {/* Botão Toggle Tema */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center transition-all duration-200 group"
              title={adminTheme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            >
              {adminTheme === 'light' ? (
                <FaMoon className="w-4 h-4 text-gray-600 group-hover:text-gray-900 transition" />
              ) : (
                <FaSun className="w-4 h-4 text-yellow-400 group-hover:text-yellow-500 transition" />
              )}
            </button>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('dashboard')}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition group border border-gray-200 dark:border-white/5 w-full"
          >
            <FaChevronLeft className="w-4 h-4 text-gray-400 dark:text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition" />
            Voltar ao Painel
          </button>
        </div>

        {/* Scrollable Nav */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-1 pb-4 sidebar-scrollbar">
          {menuItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 group w-full text-left ${
                  active
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 scale-[1.02]'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 transition-transform ${
                  active ? 'text-white' : 'text-gray-400 dark:text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white group-hover:scale-110'
                }`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 p-5 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-black/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-xs font-black text-white shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{displayName}</p>
                {userData.role === 'admin' && (
                  <span className="shrink-0 px-1.5 py-0.5 bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 text-[9px] font-black rounded uppercase tracking-wider">GOD</span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 dark:text-gray-400 truncate">{userData.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="p-6 md:p-8 pb-16 max-w-screen-xl mx-auto">

          {/* TAB: Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="animate-fade-in">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Dashboard Global</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Visão executiva da plataforma em tempo real.</p>
              </div>

              {/* Métricas Principais */}
              <section className="mb-8">
                <h2 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Métricas Principais</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    label="Total de Usuários"
                    value={stats.totalUsers.toLocaleString('pt-BR')}
                    sub="Todos os usuários ativos"
                    icon={FaUsers}
                    color="text-indigo-600"
                    bg="bg-indigo-50"
                    trend="up"
                    trendValue="+12%"
                  />
                  <StatCard
                    label="Total de Empresas"
                    value={stats.totalCompanies.toLocaleString('pt-BR')}
                    sub="Contas na plataforma"
                    icon={FaBuilding}
                    color="text-blue-600"
                    bg="bg-blue-50"
                    trend="up"
                    trendValue="+8%"
                  />
                  <StatCard
                    label="MRR"
                    value={`R$ ${stats.mrr.toLocaleString('pt-BR')}`}
                    sub="Receita Mensal Recorrente"
                    icon={FaDollarSign}
                    color="text-purple-600"
                    bg="bg-purple-50"
                    trend="up"
                    trendValue="+23%"
                  />
                  <StatCard
                    label="ARR"
                    value={`R$ ${stats.arr.toLocaleString('pt-BR')}`}
                    sub="Receita Anual Projetada"
                    icon={FaArrowUp}
                    color="text-purple-700"
                    bg="bg-purple-100"
                    trend="up"
                    trendValue="+23%"
                  />
                </div>
              </section>

              {/* Distribuição de Assinaturas */}
              <section className="mb-8">
                <h2 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Distribuição de Assinaturas</h2>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {Object.entries(planDistribution).map(([key, count]) => {
                      const plan = planInfo[key];
                      const PlanIcon = plan.icon;
                      const pct = stats.totalCompanies > 0 ? Math.round((count / stats.totalCompanies) * 100) : 0;
                      return (
                        <div key={key} className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <PlanIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{plan.label}</span>
                            </div>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${plan.color}`}>
                              {count}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                key === 'free' ? 'bg-slate-400' :
                                key === 'starter' ? 'bg-blue-500' :
                                key === 'professional' ? 'bg-purple-500' : 'bg-purple-600'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{pct}% do total</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Saúde da Plataforma */}
              <section className="mb-8">
                <h2 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Saúde da Plataforma</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Cancelamentos */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                        <FaExclamationTriangle className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Cancelamentos</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Mês atual (estimado)</p>
                      </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.estimatedCancellations}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">empresas canceladas</p>
                  </div>

                  {/* Uptime */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <FaServer className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Uptime</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Sistema operacional</p>
                      </div>
                    </div>
                    <p className="text-3xl font-black text-emerald-600">{stats.systemUptime}</p>
                    <p className="text-xs text-emerald-600 mt-1 font-medium">Excelente performance</p>
                  </div>

                  {/* Taxa de Churn */}
                  <div className={`rounded-2xl p-6 border shadow-sm ${
                    stats.churnRate > 3.5 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'
                  }`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        stats.churnRate > 3.5 ? 'bg-red-100' : 'bg-emerald-100'
                      }`}>
                        {stats.churnRate > 3.5
                          ? <FaArrowDown className="w-5 h-5 text-red-600" />
                          : <FaCheckCircle className="w-5 h-5 text-emerald-600" />
                        }
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Taxa de Churn</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Média mercado: 3.5%</p>
                      </div>
                    </div>
                    <p className={`text-3xl font-black ${
                      stats.churnRate > 3.5 ? 'text-red-700' : 'text-emerald-700'
                    }`}>
                      {stats.churnRate}%
                    </p>
                    <p className={`text-xs mt-1 font-medium ${
                      stats.churnRate > 3.5 ? 'text-red-600' : 'text-emerald-600'
                    }`}>
                      {stats.churnRate > 3.5 ? 'Acima da média — atenção requerida' : 'Abaixo da média — ótimo!'}
                    </p>
                  </div>
                </div>
              </section>

              {/* Tabelas: Empresas e Usuários */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Últimas Empresas */}
                <section>
                  <h2 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Últimas Empresas Criadas</h2>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left px-5 py-3 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Empresa</th>
                          <th className="text-left px-4 py-3 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest hidden sm:table-cell">Dono</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {recentCompanies.map((c) => (
                          <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                                  <FaBuilding className="w-4 h-4 text-purple-600" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white truncate max-w-[120px]">{c.name}</p>
                                  <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[120px]">{c.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{c.owner}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Últimos Usuários */}
                <section>
                  <h2 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Últimos Usuários</h2>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left px-5 py-3 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Usuário</th>
                          <th className="text-left px-4 py-3 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest hidden sm:table-cell">Plano</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {users.slice(0, 5).map((u) => (
                          <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
                                  <span className="text-white text-[11px] font-bold">
                                    {u.nome.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white truncate max-w-[120px]">{u.nome}</p>
                                  <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[120px]">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${planInfo[u.plano]?.color}`}>
                                {planInfo[u.plano]?.label}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* TAB: Companies */}
          {activeTab === 'companies' && (
            <div className="animate-fade-in space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Empresas</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Gerenciar todas as empresas cadastradas na plataforma.</p>
                </div>
                <button className="px-5 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/30 flex items-center gap-2">
                  <FaBuilding className="w-4 h-4" /> Nova Empresa
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total de Empresas</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{recentCompanies.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Ativas</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">{recentCompanies.filter(c => c.owner).length}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Enterprise</p>
                  <p className="text-2xl font-black text-purple-600 mt-1">{recentCompanies.filter(c => c.plan === 'enterprise').length}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">MRR Total</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">R$ 45k</p>
                </div>
              </div>

              {/* Filtros e Busca */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar empresa por nome, email ou dono..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  />
                </div>
                <select className="px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm font-medium">
                  <option>Todos os Planos</option>
                  <option>Free</option>
                  <option>Starter</option>
                  <option>Professional</option>
                  <option>Enterprise</option>
                </select>
                <button className="px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2">
                  <FaFilter className="w-4 h-4" /> Filtros
                </button>
              </div>

              {/* Tabela de Empresas */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Empresa</th>
                        <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Dono</th>
                        <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Plano</th>
                        <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status</th>
                        <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Usuários</th>
                        <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">MRR</th>
                        <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Criada em</th>
                        <th className="text-right px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {recentCompanies.map((company) => (
                        <tr key={company.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                                <FaBuilding className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 dark:text-white">{company.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{company.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{company.owner}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full border ${planInfo[company.plan]?.color}`}>
                              {planInfo[company.plan]?.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              <FaCheckCircle className="w-3 h-3" />
                              Ativo
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{Math.floor(Math.random() * 50) + 5}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              R$ {(Math.random() * 5000 + 500).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                            {new Date(company.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setSelectedCompany(company);
                                  setCompanyModalTab('detalhes'); // Reset para tab inicial
                                  setShowCompanyDetailsModal(true);
                                }}
                                className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all"
                                title="Ver Detalhes"
                              >
                                <FaEye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedCompany(company);
                                  setShowCompanyEditModal(true);
                                }}
                                className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all"
                                title="Editar"
                              >
                                <FaEdit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Deseja realmente suspender ${company.name}?`)) {
                                    alert('Empresa suspensa com sucesso!');
                                  }
                                }}
                                className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
                                title="Suspender"
                              >
                                <FaBan className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Users */}
          {activeTab === 'users' && (
            <div className="animate-fade-in space-y-6">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Usuários & Admins</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Gerenciar usuários e permissões.</p>
              </div>

              {/* Barra de Pesquisa e Filtros */}
              <div className="space-y-4">
                {/* Linha 1: Busca e Botão */}
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar usuário por nome, email ou plano..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    />
                  </div>
                  <button className="px-5 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/30 flex items-center gap-2">
                    <FaUserPlus /> Novo Usuário
                  </button>
                </div>

                {/* Linha 2: Filtros Avançados */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <FaFilter className="text-gray-400 w-4 h-4" />
                    <span className="text-gray-600 dark:text-gray-400 font-semibold">Filtros:</span>
                  </div>

                  {/* Filtro: Plano */}
                  <select
                    value={filterPlano}
                    onChange={(e) => setFilterPlano(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  >
                    <option value="todos">Todos os Planos</option>
                    <option value="free">Free</option>
                    <option value="starter">Starter</option>
                    <option value="professional">Professional</option>
                    <option value="enterprise">Enterprise</option>
                  </select>

                  {/* Filtro: Status */}
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  >
                    <option value="todos">Todos os Status</option>
                    <option value="Ativo">Ativo</option>
                    <option value="Suspenso">Suspenso</option>
                    <option value="Inativo">Inativo</option>
                  </select>

                  {/* Filtro: Tipo de Usuário */}
                  <select
                    value={filterTipo}
                    onChange={(e) => setFilterTipo(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  >
                    <option value="todos">Todos os Tipos</option>
                    <option value="superadmin">SuperAdmin</option>
                    <option value="comum">Usuário Comum</option>
                  </select>

                  {/* Botão Limpar Filtros */}
                  {(filterPlano !== 'todos' || filterStatus !== 'todos' || filterTipo !== 'todos') && (
                    <button
                      onClick={() => {
                        setFilterPlano('todos');
                        setFilterStatus('todos');
                        setFilterTipo('todos');
                      }}
                      className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center gap-2"
                    >
                      <FaTimes className="w-3 h-3" />
                      Limpar
                    </button>
                  )}
                </div>
              </div>

              {/* Tabela de Usuários */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Usuário</th>
                        <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Contato</th>
                        <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Plano</th>
                        <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status</th>
                        <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                {user.nome.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white">{user.nome}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <FaEnvelope className="text-xs text-purple-600" />
                                {user.email}
                              </p>
                              <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <FaPhone className="text-xs text-purple-600" />
                                {user.telefone}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${planInfo[user.plano]?.color}`}>
                              {planInfo[user.plano]?.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewUser(user)}
                                className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
                                title="Visualizar"
                              >
                                <FaEye />
                              </button>
                              <button
                                onClick={() => {
                                  handleViewUser(user);
                                  setUserModalTab('info'); // Abrir direto na tab de edição
                                }}
                                className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all"
                                title="Editar"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Suspender usuário "${user.nome}"?`)) {
                                    alert('Usuário suspenso! (funcionalidade simulada)');
                                  }
                                }}
                                className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-all"
                                title="Suspender"
                              >
                                <FaBan />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`DELETAR PERMANENTEMENTE o usuário "${user.nome}"? Esta ação NÃO pode ser desfeita!`)) {
                                    alert('Usuário deletado! (funcionalidade simulada)');
                                  }
                                }}
                                className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                                title="Excluir"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Integrations */}
          {activeTab === 'integrations' && (
            <div className="animate-fade-in space-y-6">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Integrações do Sistema</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Status de todas as integrações da plataforma.</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                <div className="space-y-4">
                  {systemIntegrations.map((integration) => (
                    <div key={integration.id} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {integration.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">{integration.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{integration.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Usuários</p>
                          <p className="font-bold text-gray-900 dark:text-white">{integration.users}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Última Sync</p>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{integration.lastSync}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                          integration.status === 'Ativo'
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                          <FaCircle className="text-[6px]" />
                          {integration.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: Logs */}
          {activeTab === 'logs' && (
            <div className="animate-fade-in space-y-6">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Logs de Atividade</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Monitoramento de eventos do sistema.</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Logs do Sistema</h2>
                  <div className="flex items-center gap-2">
                    <select className="px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm">
                      <option>Todos os Níveis</option>
                      <option>INFO</option>
                      <option>WARNING</option>
                      <option>ERROR</option>
                    </select>
                    <button className="px-4 py-2 bg-purple-100 text-purple-600 rounded-xl font-semibold hover:bg-purple-200 transition-all">
                      <FaFilter />
                    </button>
                  </div>
                </div>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {systemLogs.map((log) => (
                    <div key={log.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getLogLevelColor(log.level)}`}>
                            {log.level}
                          </span>
                          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{log.module}</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <FaClock className="text-[10px]" />
                          {log.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-700 dark:text-gray-300 mb-2">{log.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">IP: {log.ip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: Analytics */}
          {activeTab === 'analytics' && (
            <div className="animate-fade-in space-y-6">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Analytics</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Métricas avançadas e insights da plataforma.</p>
              </div>

              {/* Cards de Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Novos Usuários (Mês)</h3>
                  <p className="text-3xl font-bold text-purple-600">{stats.newUsersThisMonth}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Taxa de Crescimento</h3>
                  <p className="text-3xl font-bold text-emerald-600">+23%</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Uptime do Sistema</h3>
                  <p className="text-3xl font-bold text-blue-600">{stats.systemUptime}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tempo de Resposta</h3>
                  <p className="text-3xl font-bold text-orange-600">{stats.avgResponseTime}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Settings */}
          {activeTab === 'settings' && (
            <div className="animate-fade-in space-y-6">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Configurações Globais</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Ajustes e preferências da plataforma.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Segurança */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FaShieldAlt className="text-purple-600" />
                    Segurança
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Autenticação 2FA</span>
                      <button className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg font-semibold hover:bg-purple-200 transition-all">
                        Configurar
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Chaves API</span>
                      <button className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg font-semibold hover:bg-purple-200 transition-all flex items-center gap-2">
                        <FaKey />
                        Gerenciar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notificações */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FaBell className="text-purple-600" />
                    Notificações
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Novos Usuários</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 accent-purple-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Erros do Sistema</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 accent-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Aparência */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FaPalette className="text-purple-600" />
                    Aparência
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Tema Escuro</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 accent-purple-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Cor Principal</span>
                      <input type="color" defaultValue="#e11d48" className="w-12 h-8 rounded cursor-pointer" />
                    </div>
                  </div>
                </div>

                {/* Sistema */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FaDatabase className="text-purple-600" />
                    Sistema
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Backup Automático</span>
                      <button className="px-4 py-2 bg-emerald-100 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-200 transition-all">
                        Ativo
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Cache</span>
                      <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition-all">
                        Limpar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Modal de Detalhes do Usuário */}
      {showUserModal && selectedUser && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            style={{ zIndex: 9998 }}
            onClick={() => {
              setShowUserModal(false);
              setSelectedUser(null);
              setUserModalTab('info');
            }}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999, pointerEvents: 'none' }}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 animate-scale-in flex flex-col" style={{ pointerEvents: 'auto' }}>
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl">
                    {selectedUser.nome.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Editar Usuário</h2>
                    <p className="text-purple-100 text-sm">{selectedUser.nome}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    setSelectedUser(null);
                    setUserModalTab('info');
                  }}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
                {[
                  { key: 'info', label: 'Informações', icon: FaUser },
                  { key: 'config', label: 'Configurações', icon: FaCog },
                  { key: 'actions', label: 'Ações', icon: FaExclamationTriangle }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setUserModalTab(tab.key)}
                    className={`flex-1 py-3 px-4 text-sm font-bold uppercase tracking-widest transition-all border-b-2 flex items-center justify-center gap-2 ${
                      userModalTab === tab.key
                        ? 'text-gray-900 dark:text-white border-purple-500 bg-white dark:bg-gray-800/50'
                        : 'text-gray-500 dark:text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/30'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content Container with Scroll */}
              <div className="flex-1 overflow-y-auto">
                {/* TAB: Informações */}
                {userModalTab === 'info' && (
                  <div className="p-6 space-y-5">
                    {/* Nome */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nome Completo</label>
                      <input
                        type="text"
                        defaultValue={selectedUser.nome}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue={selectedUser.email}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      />
                    </div>

                    {/* Telefone */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Telefone</label>
                      <input
                        type="tel"
                        defaultValue={selectedUser.telefone}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      />
                    </div>

                    {/* Senha */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nova Senha</label>
                        <input
                          type="password"
                          placeholder="Deixe em branco para não alterar"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Confirmar Senha</label>
                        <input
                          type="password"
                          placeholder="Confirme a nova senha"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* Info Card */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mt-4">
                      <div className="flex items-start gap-3">
                        <FaUser className="w-4 h-4 text-blue-400 mt-0.5" />
                        <div>
                          <p className="text-blue-300 text-sm font-semibold mb-1">Informações do Usuário</p>
                          <p className="text-blue-300/80 text-xs">
                            Data de cadastro: {selectedUser.dataCadastro} • Último acesso: {selectedUser.ultimoAcesso}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Botão Salvar */}
                    <button
                      onClick={() => alert('Informações atualizadas! (simulado)')}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
                    >
                      <FaCheckCircle /> Salvar Informações
                    </button>
                  </div>
                )}

                {/* TAB: Configurações */}
                {userModalTab === 'config' && (
                  <div className="p-6 space-y-6">
                    {/* Plano */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Plano</label>
                      <select
                        defaultValue={selectedUser.plano}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      >
                        <option value="free">Free</option>
                        <option value="starter">Starter</option>
                        <option value="professional">Professional</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                      <select
                        defaultValue={selectedUser.status}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      >
                        <option value="Ativo">Ativo</option>
                        <option value="Suspenso">Suspenso</option>
                        <option value="Inativo">Inativo</option>
                      </select>
                    </div>

                    {/* Role (Tipo de Usuário) */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tipo de Usuário</label>
                      <select
                        value={editingUserRole}
                        onChange={(e) => setEditingUserRole(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      >
                        <option value="comum">Usuário Comum</option>
                        <option value="superadmin">SuperAdmin</option>
                      </select>
                    </div>

                    {/* Permissões de SuperAdmin (aparece apenas se SuperAdmin) */}
                    {editingUserRole === 'superadmin' && (
                      <div className="border-t border-gray-800 pt-5">
                        <label className="block text-sm font-bold text-gray-300 mb-3">Permissões de SuperAdmin</label>
                        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 space-y-4 max-h-[400px] overflow-y-auto">
                          {/* Acesso Total */}
                          <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg hover:bg-gray-800/80 transition-all">
                            <input type="checkbox" className="w-5 h-5 mt-0.5 accent-purple-600" />
                            <div>
                              <p className="text-white font-bold group-hover:text-purple-300 transition-colors">✨ Acesso Total ao Painel Admin</p>
                              <p className="text-gray-500 text-xs">Todas as permissões administrativas</p>
                            </div>
                          </label>

                          <div className="border-t border-gray-700 pt-3">
                            {/* Permissões por Módulo Admin */}
                            {Object.entries(permissoesSuperAdmin).map(([moduloKey, modulo]) => (
                              <div key={moduloKey} className="mb-4 last:mb-0">
                                <p className="text-xs font-black uppercase tracking-widest text-purple-400 mb-2 flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                  {modulo.nome}
                                </p>
                                <div className="space-y-1.5 ml-4">
                                  {modulo.permissoes.map(permissao => (
                                    <label key={permissao.id} className="flex items-start gap-2.5 cursor-pointer group p-2 rounded-lg hover:bg-gray-800/60 transition-all">
                                      <input type="checkbox" className="w-4 h-4 mt-0.5 accent-purple-600" />
                                      <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                        {permissao.nome}
                                      </p>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          💡 Permissões de SuperAdmin controlam o acesso ao painel administrativo
                        </p>
                      </div>
                    )}

                    {/* Botão Salvar */}
                    <button
                      onClick={() => alert('Configurações atualizadas! (simulado)')}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 mt-4"
                    >
                      <FaCheckCircle /> Salvar Configurações
                    </button>
                  </div>
                )}

                {/* TAB: Ações */}
                {userModalTab === 'actions' && (
                  <div className="p-6 space-y-4">
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                      <p className="text-amber-300 text-sm">
                        ⚠️ <strong>Atenção:</strong> Estas ações são irreversíveis ou impactam diretamente o acesso do usuário.
                      </p>
                    </div>

                    {/* Faturamento */}
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
                      <h3 className="text-white font-bold mb-2">Faturamento Total</h3>
                      <p className="text-3xl font-black text-emerald-400">
                        R$ {selectedUser.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">Receita gerada por este usuário</p>
                    </div>

                    {/* Suspender Usuário */}
                    <button
                      onClick={() => {
                        if (confirm(`Suspender usuário "${selectedUser.nome}"?`)) {
                          alert('Usuário suspenso! (simulado)');
                        }
                      }}
                      className="w-full flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all"
                    >
                      <FaBan className="w-5 h-5" />
                      <div className="text-left flex-1">
                        <p className="font-bold">Suspender Usuário</p>
                        <p className="text-xs opacity-80">Bloquear acesso temporariamente</p>
                      </div>
                    </button>

                    {/* Deletar Usuário */}
                    <button
                      onClick={() => {
                        if (confirm(`DELETAR PERMANENTEMENTE o usuário "${selectedUser.nome}"? Esta ação NÃO pode ser desfeita!`)) {
                          alert('Usuário deletado! (simulado)');
                        }
                      }}
                      className="w-full flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-bold bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 transition-all"
                    >
                      <FaTrash className="w-5 h-5" />
                      <div className="text-left flex-1">
                        <p className="font-bold">Deletar Permanentemente</p>
                        <p className="text-xs opacity-80">Remove todos os dados do usuário</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal de Detalhes da Empresa - REDESENHADO */}
      {showCompanyDetailsModal && selectedCompany && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm animate-fade-in"
            onClick={() => {
              setShowCompanyDetailsModal(false);
              setSelectedCompany(null);
              setActiveTab('detalhes');
            }}
          />

          {/* Modal Sidebar */}
          <div className="fixed right-0 top-0 h-full w-[600px] bg-gray-900 border-l border-gray-800 z-50 shadow-2xl flex flex-col animate-slide-in-right">
            {/* Header Sticky */}
            <div className="p-5 border-b border-gray-800 flex items-center justify-between flex-shrink-0 bg-gray-900">
              <div className="flex items-center gap-3">
                {/* Avatar da empresa com gradiente */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-purple-500/30">
                  {selectedCompany.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-white font-black text-lg leading-none">{selectedCompany.name}</h2>
                  <p className="text-gray-500 text-xs font-mono mt-1">ID: {selectedCompany.id}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowCompanyDetailsModal(false);
                  setSelectedCompany(null);
                  setActiveTab('detalhes');
                }}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs Sticky */}
            <div className="flex border-b border-gray-800 flex-shrink-0 bg-gray-900">
              {[
                { key: 'detalhes', label: 'Detalhes', count: null },
                { key: 'membros', label: 'Membros', count: companyMembers[selectedCompany.id]?.length || 0 },
                { key: 'plano', label: 'Plano & Ações', count: null },
                { key: 'configuracoes', label: 'Configurações', count: null }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setCompanyModalTab(tab.key)}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
                    companyModalTab === tab.key
                      ? 'text-white border-purple-500'
                      : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-gray-800/50'
                  }`}
                >
                  {tab.label} {tab.count !== null && `(${tab.count})`}
                </button>
              ))}
            </div>

            {/* Content Scrollable */}
            <div className="flex-1 overflow-y-auto">
              {/* TAB: DETALHES */}
              {companyModalTab === 'detalhes' && (
                <div className="p-6 space-y-6">
                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <FaCheckCircle className="w-3 h-3" />
                      Ativa
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest ${
                      selectedCompany.plan === 'enterprise' ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/40' :
                      selectedCompany.plan === 'professional' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30' :
                      selectedCompany.plan === 'starter' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' :
                      'bg-gray-700 text-gray-400 border border-gray-600'
                    }`}>
                      <FaCreditCard className="w-3 h-3" />
                      {selectedCompany.plan.toUpperCase()}
                    </span>
                  </div>

                  {/* Informações Gerais */}
                  <div>
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-3">Informações Gerais</p>
                    <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden divide-y divide-gray-700/50">
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                          <FaBuilding className="w-3.5 h-3.5" />
                          Nome
                        </div>
                        <span className="text-white text-sm font-medium">{selectedCompany.name}</span>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                          <FaEnvelope className="w-3.5 h-3.5" />
                          Email
                        </div>
                        <span className="text-white text-sm font-medium">{selectedCompany.email}</span>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                          <FaCalendar className="w-3.5 h-3.5" />
                          Criada em
                        </div>
                        <span className="text-white text-sm font-medium">
                          {new Date(selectedCompany.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Proprietário */}
                  <div>
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-3">Proprietário</p>
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center font-black text-white text-sm flex-shrink-0 shadow-lg shadow-purple-500/30">
                        {selectedCompany.owner?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-bold leading-none mb-1">{selectedCompany.owner}</p>
                        <p className="text-gray-400 text-xs">{selectedCompany.email}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-widest bg-gradient-to-r from-purple-500/20 to-purple-500/20 text-purple-300 border border-purple-500/40">
                        <FaCrown className="w-3 h-3" />
                        Owner
                      </span>
                    </div>
                  </div>

                  {/* Estatísticas */}
                  <div>
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-3">Estatísticas</p>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center hover:border-purple-500/30 transition-all group">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-500/20 transition-all">
                          <FaUsers className="w-4 h-4" />
                        </div>
                        <p className="text-white text-xl font-black leading-none">{companyMembers[selectedCompany.id]?.length || 0}</p>
                        <p className="text-gray-600 text-xs uppercase tracking-widest mt-1">Membros</p>
                      </div>
                      <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center hover:border-purple-500/30 transition-all group">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-2 group-hover:bg-purple-500/20 transition-all">
                          <FaLink className="w-4 h-4" />
                        </div>
                        <p className="text-white text-xl font-black leading-none">{Math.floor(Math.random() * 10) + 2}</p>
                        <p className="text-gray-600 text-xs uppercase tracking-widest mt-1">Integrações</p>
                      </div>
                      <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center hover:border-purple-500/30 transition-all group">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2 group-hover:bg-emerald-500/20 transition-all">
                          <FaAddressBook className="w-4 h-4" />
                        </div>
                        <p className="text-white text-xl font-black leading-none">{Math.floor(Math.random() * 500) + 50}</p>
                        <p className="text-gray-600 text-xs uppercase tracking-widest mt-1">Contatos</p>
                      </div>
                      <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center hover:border-purple-500/30 transition-all group">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto mb-2 group-hover:bg-orange-500/20 transition-all">
                          <FaComments className="w-4 h-4" />
                        </div>
                        <p className="text-white text-xl font-black leading-none">{Math.floor(Math.random() * 2000) + 200}</p>
                        <p className="text-gray-600 text-xs uppercase tracking-widest mt-1">Mensagens</p>
                      </div>
                    </div>
                  </div>

                  {/* Métricas de Uso */}
                  <div>
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-3">Métricas de Uso</p>
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs font-medium">Último acesso</span>
                        <span className="text-white text-sm font-bold">Há 2 horas</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs font-medium">Mensagens/mês</span>
                        <span className="text-white text-sm font-bold">1.234</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs font-medium">Taxa de resposta</span>
                        <span className="text-emerald-400 text-sm font-bold">94%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: MEMBROS */}
              {companyModalTab === 'membros' && (
                <div className="p-4">
                  {/* Stats dos Membros */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="bg-gray-800 rounded-lg p-3 text-center border border-gray-700">
                      <p className="text-xl font-black text-white">{companyMembers[selectedCompany.id]?.length || 0}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Total</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-center border border-gray-700">
                      <p className="text-xl font-black text-purple-400">{companyMembers[selectedCompany.id]?.filter(m => m.role === 'owner').length || 0}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Owner</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-center border border-gray-700">
                      <p className="text-xl font-black text-blue-400">{companyMembers[selectedCompany.id]?.filter(m => m.role === 'admin').length || 0}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Admin</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-center border border-gray-700">
                      <p className="text-xl font-black text-gray-400">{companyMembers[selectedCompany.id]?.filter(m => m.role === 'member').length || 0}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Membros</p>
                    </div>
                  </div>

                  {/* Lista de Membros */}
                  {!companyMembers[selectedCompany.id] || companyMembers[selectedCompany.id].length === 0 ? (
                    <div className="text-center py-16">
                      <FaUsers className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                      <p className="text-gray-500 font-bold text-sm mb-2">Nenhum membro cadastrado</p>
                      <p className="text-gray-600 text-xs mb-4">Esta empresa ainda não possui membros.</p>
                      <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-bold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all">
                        + Convidar Membro
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {companyMembers[selectedCompany.id].map((member, index) => {
                        // Avatar gradiente baseado na primeira letra
                        const firstLetter = member.name[0].toUpperCase();
                        const gradients = {
                          A: 'from-purple-500 to-purple-700', B: 'from-blue-500 to-blue-700', C: 'from-cyan-500 to-cyan-700',
                          D: 'from-emerald-500 to-emerald-700', E: 'from-teal-500 to-teal-700', F: 'from-indigo-500 to-indigo-700',
                          G: 'from-violet-500 to-violet-700', H: 'from-fuchsia-500 to-fuchsia-700', I: 'from-pink-500 to-pink-700',
                          J: 'from-purple-500 to-purple-700', K: 'from-red-500 to-red-700', L: 'from-orange-500 to-orange-700',
                          M: 'from-amber-500 to-amber-700', N: 'from-yellow-500 to-yellow-700', O: 'from-lime-500 to-lime-700',
                          P: 'from-green-500 to-green-700', Q: 'from-sky-500 to-sky-700', R: 'from-blue-500 to-indigo-700',
                          S: 'from-purple-500 to-pink-700', T: 'from-purple-500 to-orange-700', U: 'from-cyan-500 to-blue-700',
                          V: 'from-teal-500 to-emerald-700', W: 'from-violet-500 to-purple-700', X: 'from-fuchsia-500 to-pink-700',
                          Y: 'from-amber-500 to-orange-700', Z: 'from-indigo-500 to-purple-700'
                        };
                        const gradient = gradients[firstLetter] || 'from-gray-500 to-gray-700';

                        return (
                          <div
                            key={member.id}
                            className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/40 border border-gray-700/50 hover:bg-gray-800/60 hover:border-purple-500/30 transition-all group"
                            style={{ animationDelay: `${index * 30}ms` }}
                          >
                            {/* Avatar com gradiente */}
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center font-black text-white text-sm flex-shrink-0 shadow-lg`}>
                              {firstLetter}
                            </div>

                            {/* Info do Membro */}
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-bold leading-none mb-1 truncate">{member.name}</p>
                              <p className="text-gray-500 text-xs truncate mb-2">{member.email}</p>

                              {/* Cargo e Setor */}
                              <div className="flex gap-2 flex-wrap">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-bold">
                                  <FaBriefcase className="w-2.5 h-2.5" />
                                  {member.cargo}
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/30 text-xs font-bold">
                                  <FaBuilding className="w-2.5 h-2.5" />
                                  {member.setor}
                                </span>
                              </div>
                            </div>

                            {/* Status e Role */}
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                              {/* Role Badge */}
                              <span className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                                member.role === 'owner' ? 'bg-gradient-to-r from-purple-500/20 to-purple-500/20 text-purple-300 border border-purple-500/40' :
                                member.role === 'admin' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                'bg-gray-700 text-gray-400 border border-gray-600'
                              }`}>
                                {member.role === 'owner' ? <FaCrown className="inline w-2.5 h-2.5 mr-0.5" /> : null}
                                {member.role === 'admin' ? <FaShield className="inline w-2.5 h-2.5 mr-0.5" /> : null}
                                {member.role}
                              </span>

                              {/* Status Indicator */}
                              <div className="flex items-center gap-1.5">
                                <div className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-gray-600'}`} />
                                <span className="text-xs text-gray-500">{member.lastAccess}</span>
                              </div>

                              {/* Botões de Ação (aparecem no hover) */}
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => {
                                    setSelectedMember(member);
                                    setShowMemberEditModal(true);
                                  }}
                                  className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 transition-all"
                                  title="Editar membro"
                                >
                                  <FaEdit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Remover ${member.name} da empresa?`)) {
                                      // Lógica de remoção aqui
                                      alert('Membro removido! (funcionalidade simulada)');
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all"
                                  title="Remover membro"
                                >
                                  <FaTrash className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: PLANO & AÇÕES */}
              {companyModalTab === 'plano' && (
                <div className="p-6 space-y-6">
                  {/* Plano Atual */}
                  <div>
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3">Plano Atual</p>
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-black uppercase tracking-widest ${
                          selectedCompany.plan === 'enterprise' ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/40' :
                          selectedCompany.plan === 'professional' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30' :
                          selectedCompany.plan === 'starter' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' :
                          'bg-gray-700 text-gray-400 border border-gray-600'
                        }`}>
                          <FaCreditCard className="w-4 h-4" />
                          {selectedCompany.plan}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-500 text-xs mb-1">MRR</p>
                          <p className="text-emerald-400 text-xl font-black">
                            R$ {(Math.random() * 5000 + 500).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Faturamento Total</p>
                          <p className="text-white text-xl font-black">
                            R$ {(Math.random() * 50000 + 10000).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alterar Plano */}
                  <div>
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3">Alterar Plano</p>
                    <div className="flex gap-2">
                      <select className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
                        <option value="free">Free</option>
                        <option value="starter">Starter</option>
                        <option value="professional">Professional</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                      <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-all">
                        Salvar
                      </button>
                    </div>
                  </div>

                  {/* Histórico de Planos */}
                  <div>
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                      <FaHistory className="w-3 h-3" />
                      Histórico de Planos
                    </p>
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Jan 2026:</span>
                        <span className="text-white font-bold">Upgrade para Enterprise</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Dez 2025:</span>
                        <span className="text-white font-bold">Professional</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Out 2025:</span>
                        <span className="text-white font-bold">Trial → Professional</span>
                      </div>
                    </div>
                  </div>

                  {/* Ações Administrativas */}
                  <div className="border-t border-gray-800 pt-5">
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3">Ações</p>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setShowCompanyDetailsModal(false);
                          setShowCompanyEditModal(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-lg shadow-purple-500/30"
                      >
                        <FaEdit className="w-4 h-4" />
                        Editar Empresa
                      </button>

                      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-all">
                        <FaBell className="w-4 h-4" />
                        Enviar Notificação
                      </button>

                      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all">
                        <FaChartBar className="w-4 h-4" />
                        Relatório de Uso
                      </button>

                      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all">
                        <FaBan className="w-4 h-4" />
                        Suspender Empresa
                      </button>

                      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900/50 transition-all">
                        <FaTrash className="w-4 h-4" />
                        Deletar Permanentemente
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Configurações - Gerenciamento de Cargos, Setores e Roles */}
              {companyModalTab === 'configuracoes' && (
                <div className="p-6 space-y-6">
                  {/* Seção Cargos */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-gray-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <FaBriefcase className="w-3 h-3" />
                        Cargos Personalizados
                      </p>
                      <button
                        onClick={() => setShowAddCargoModal(true)}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1"
                      >
                        <FaUserPlus className="w-3 h-3" />
                        Adicionar
                      </button>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
                      {companySettings[selectedCompany.id]?.cargos?.length > 0 ? (
                        <div className="space-y-2">
                          {companySettings[selectedCompany.id].cargos.map(cargo => (
                            <div key={cargo.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/60 border border-gray-700/50 hover:bg-gray-800 transition-all group">
                              <span className="text-white font-semibold text-sm">{cargo.name}</span>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => setEditingCargo(cargo)}
                                  className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-all"
                                >
                                  <FaEdit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Remover cargo "${cargo.name}"?`)) {
                                      alert('Cargo removido! (funcionalidade simulada)');
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all"
                                >
                                  <FaTrash className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm text-center py-4">Nenhum cargo cadastrado</p>
                      )}
                    </div>
                  </div>

                  {/* Seção Setores */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-gray-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <FaBuilding className="w-3 h-3" />
                        Setores Personalizados
                      </p>
                      <button
                        onClick={() => setShowAddSetorModal(true)}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1"
                      >
                        <FaUserPlus className="w-3 h-3" />
                        Adicionar
                      </button>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
                      {companySettings[selectedCompany.id]?.setores?.length > 0 ? (
                        <div className="space-y-2">
                          {companySettings[selectedCompany.id].setores.map(setor => (
                            <div key={setor.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/60 border border-gray-700/50 hover:bg-gray-800 transition-all group">
                              <span className="text-white font-semibold text-sm">{setor.name}</span>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => setEditingSetor(setor)}
                                  className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-all"
                                >
                                  <FaEdit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Remover setor "${setor.name}"?`)) {
                                      alert('Setor removido! (funcionalidade simulada)');
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all"
                                >
                                  <FaTrash className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm text-center py-4">Nenhum setor cadastrado</p>
                      )}
                    </div>
                  </div>

                  {/* Seção Roles/Permissões */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-gray-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <FaShield className="w-3 h-3" />
                        Roles & Permissões
                      </p>
                      <button
                        onClick={() => setShowAddRoleModal(true)}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1"
                      >
                        <FaUserPlus className="w-3 h-3" />
                        Adicionar
                      </button>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
                      {companySettings[selectedCompany.id]?.roles?.length > 0 ? (
                        <div className="space-y-3">
                          {companySettings[selectedCompany.id].roles.map(role => (
                            <div key={role.id} className="p-4 rounded-lg bg-gray-800/60 border border-gray-700/50 hover:bg-gray-800 transition-all group">
                              <div className="flex items-center justify-between mb-2">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${
                                  role.color === 'purple' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                                  role.color === 'blue' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                                  role.color === 'green' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                                  'bg-gray-700 text-gray-300 border border-gray-600'
                                }`}>
                                  <FaShield className="w-3 h-3" />
                                  {role.name}
                                </span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => setEditingRole(role)}
                                    className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-all"
                                  >
                                    <FaEdit className="w-3 h-3" />
                                  </button>
                                  {role.name !== 'Owner' && (
                                    <button
                                      onClick={() => {
                                        if (confirm(`Remover role "${role.name}"?`)) {
                                          alert('Role removida! (funcionalidade simulada)');
                                        }
                                      }}
                                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all"
                                    >
                                      <FaTrash className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {role.permissions[0] === 'all' ? (
                                  <span className="text-xs px-2 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30">
                                    ✨ Acesso Total
                                  </span>
                                ) : (
                                  role.permissions.map((perm, idx) => (
                                    <span key={idx} className="text-xs px-2 py-1 rounded-md bg-gray-700/50 text-gray-300 border border-gray-600/50">
                                      {perm.replace(/_/g, ' ')}
                                    </span>
                                  ))
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm text-center py-4">Nenhuma role cadastrada</p>
                      )}
                    </div>
                  </div>

                  {/* Info Card */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <p className="text-blue-300 text-xs font-semibold">
                      💡 <strong>Dica:</strong> Personalize cargos, setores e permissões de acordo com a estrutura da sua empresa.
                      As alterações serão aplicadas apenas aos novos membros ou quando você editar membros existentes.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Modal de Editar Empresa */}
      {showCompanyEditModal && selectedCompany && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <FaEdit className="text-2xl text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Editar Empresa</h2>
                  <p className="text-purple-100 text-sm">{selectedCompany.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowCompanyEditModal(false);
                  setSelectedCompany(null);
                }}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
              >
                <FaTimes />
              </button>
            </div>

            {/* Formulário */}
            <div className="p-6 space-y-6">
              {/* Nome da Empresa */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-700 dark:text-gray-300 mb-2">
                  Nome da Empresa
                </label>
                <input
                  type="text"
                  defaultValue={selectedCompany.name}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  placeholder="Nome da empresa"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={selectedCompany.email}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  placeholder="email@empresa.com"
                />
              </div>

              {/* Proprietário */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-700 dark:text-gray-300 mb-2">
                  Proprietário
                </label>
                <input
                  type="text"
                  defaultValue={selectedCompany.owner}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  placeholder="Nome do proprietário"
                />
              </div>

              {/* Plano */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-700 dark:text-gray-300 mb-2">
                  Plano
                </label>
                <select
                  defaultValue={selectedCompany.plan}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                >
                  <option value="free">Gratuito</option>
                  <option value="starter">Starter</option>
                  <option value="professional">Professional</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  defaultValue="active"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                >
                  <option value="active">Ativo</option>
                  <option value="suspended">Suspenso</option>
                  <option value="trial">Trial</option>
                </select>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-700 dark:text-gray-300 mb-2">
                  Observações
                </label>
                <textarea
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none"
                  placeholder="Notas internas sobre a empresa..."
                ></textarea>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    alert('Empresa atualizada com sucesso!');
                    setShowCompanyEditModal(false);
                    setSelectedCompany(null);
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
                >
                  <FaCheckCircle /> Salvar Alterações
                </button>
                <button
                  onClick={() => {
                    setShowCompanyEditModal(false);
                    setSelectedCompany(null);
                  }}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Editar Membro */}
      {showMemberEditModal && selectedMember && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm animate-fade-in"
            onClick={() => {
              setShowMemberEditModal(false);
              setSelectedMember(null);
            }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-800 pointer-events-auto animate-scale-in">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <FaUserTie className="text-2xl text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Editar Membro</h2>
                    <p className="text-purple-100 text-sm">{selectedMember.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowMemberEditModal(false);
                    setSelectedMember(null);
                  }}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Formulário */}
              <div className="p-6 space-y-6">
                {/* Nome Completo */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedMember.name}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    placeholder="Nome completo do membro"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={selectedMember.email}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    placeholder="email@empresa.com"
                  />
                </div>

                {/* Cargo e Setor - DROPDOWNS COM OPÇÕES DA EMPRESA */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      <FaBriefcase className="inline w-3.5 h-3.5 mr-1.5 text-purple-400" />
                      Cargo
                    </label>
                    <select
                      defaultValue={selectedMember.cargo}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    >
                      <option value="">Selecione um cargo</option>
                      {companySettings[selectedCompany.id]?.cargos?.map(cargo => (
                        <option key={cargo.id} value={cargo.name}>{cargo.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setShowAddCargoModal(true)}
                      className="mt-2 text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      <FaUserPlus className="w-3 h-3" />
                      Criar novo cargo
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      <FaBuilding className="inline w-3.5 h-3.5 mr-1.5 text-blue-400" />
                      Setor
                    </label>
                    <select
                      defaultValue={selectedMember.setor}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    >
                      <option value="">Selecione um setor</option>
                      {companySettings[selectedCompany.id]?.setores?.map(setor => (
                        <option key={setor.id} value={setor.name}>{setor.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setShowAddSetorModal(true)}
                      className="mt-2 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <FaUserPlus className="w-3 h-3" />
                      Criar novo setor
                    </button>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    defaultValue={selectedMember.status}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>

                {/* Observações */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Observações
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none"
                    placeholder="Notas sobre este membro..."
                  ></textarea>
                </div>

                {/* Botões */}
                <div className="flex gap-3 pt-4 border-t border-gray-800">
                  <button
                    onClick={() => {
                      alert('Membro atualizado com sucesso! (funcionalidade simulada)');
                      setShowMemberEditModal(false);
                      setSelectedMember(null);
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
                  >
                    <FaCheckCircle /> Salvar Alterações
                  </button>
                  <button
                    onClick={() => {
                      setShowMemberEditModal(false);
                      setSelectedMember(null);
                    }}
                    className="px-6 py-3 bg-gray-800 text-gray-300 font-semibold rounded-xl hover:bg-gray-700 transition-all border border-gray-700"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal: Adicionar/Editar Cargo */}
      {(showAddCargoModal || editingCargo) && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm animate-fade-in" onClick={() => { setShowAddCargoModal(false); setEditingCargo(null); }} />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-gray-900 rounded-2xl max-w-md w-full border border-gray-800 pointer-events-auto animate-scale-in">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-5 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaBriefcase className="text-xl text-white" />
                  <h3 className="text-lg font-bold text-white">
                    {editingCargo ? 'Editar Cargo' : 'Adicionar Cargo'}
                  </h3>
                </div>
                <button onClick={() => { setShowAddCargoModal(false); setEditingCargo(null); }} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all">
                  <FaTimes />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nome do Cargo</label>
                  <input
                    type="text"
                    defaultValue={editingCargo?.name || ''}
                    placeholder="Ex: Gerente de Vendas"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      alert(`Cargo ${editingCargo ? 'atualizado' : 'adicionado'} com sucesso! (funcionalidade simulada)`);
                      setShowAddCargoModal(false);
                      setEditingCargo(null);
                    }}
                    className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <FaCheckCircle /> {editingCargo ? 'Atualizar' : 'Adicionar'}
                  </button>
                  <button
                    onClick={() => { setShowAddCargoModal(false); setEditingCargo(null); }}
                    className="px-4 py-3 bg-gray-800 text-gray-300 font-semibold rounded-xl hover:bg-gray-700 transition-all border border-gray-700"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal: Adicionar/Editar Setor */}
      {(showAddSetorModal || editingSetor) && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm animate-fade-in" onClick={() => { setShowAddSetorModal(false); setEditingSetor(null); }} />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-gray-900 rounded-2xl max-w-md w-full border border-gray-800 pointer-events-auto animate-scale-in">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-5 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaBuilding className="text-xl text-white" />
                  <h3 className="text-lg font-bold text-white">
                    {editingSetor ? 'Editar Setor' : 'Adicionar Setor'}
                  </h3>
                </div>
                <button onClick={() => { setShowAddSetorModal(false); setEditingSetor(null); }} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all">
                  <FaTimes />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nome do Setor</label>
                  <input
                    type="text"
                    defaultValue={editingSetor?.name || ''}
                    placeholder="Ex: Comercial, TI, Financeiro"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      alert(`Setor ${editingSetor ? 'atualizado' : 'adicionado'} com sucesso! (funcionalidade simulada)`);
                      setShowAddSetorModal(false);
                      setEditingSetor(null);
                    }}
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <FaCheckCircle /> {editingSetor ? 'Atualizar' : 'Adicionar'}
                  </button>
                  <button
                    onClick={() => { setShowAddSetorModal(false); setEditingSetor(null); }}
                    className="px-4 py-3 bg-gray-800 text-gray-300 font-semibold rounded-xl hover:bg-gray-700 transition-all border border-gray-700"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal: Adicionar/Editar Role */}
      {(showAddRoleModal || editingRole) && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm animate-fade-in" onClick={() => { setShowAddRoleModal(false); setEditingRole(null); }} />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-gray-900 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-gray-800 pointer-events-auto animate-scale-in">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-5 rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <FaShield className="text-xl text-white" />
                  <h3 className="text-lg font-bold text-white">
                    {editingRole ? 'Editar Role' : 'Adicionar Role'}
                  </h3>
                </div>
                <button onClick={() => { setShowAddRoleModal(false); setEditingRole(null); }} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all">
                  <FaTimes />
                </button>
              </div>
              <div className="p-5 space-y-5">
                {/* Nome da Role */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nome da Role</label>
                  <input
                    type="text"
                    defaultValue={editingRole?.name || ''}
                    placeholder="Ex: Administrador, Gestor, Vendedor"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  />
                </div>

                {/* Cor da Badge */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Cor da Badge</label>
                  <select
                    defaultValue={editingRole?.color || 'purple'}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  >
                    <option value="purple">Roxo (Purple)</option>
                    <option value="blue">Azul (Blue)</option>
                    <option value="green">Verde (Green)</option>
                    <option value="amber">Âmbar (Amber)</option>
                    <option value="gray">Cinza (Gray)</option>
                  </select>
                </div>

                {/* Permissões REAIS do Sistema */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-3">Permissões do Sistema</label>
                  <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 space-y-4 max-h-[400px] overflow-y-auto">
                    {/* Acesso Total */}
                    <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg hover:bg-gray-800/80 transition-all">
                      <input type="checkbox" defaultChecked={editingRole?.permissions.includes('all')} className="w-5 h-5 mt-0.5 accent-purple-600" />
                      <div>
                        <p className="text-white font-bold group-hover:text-purple-300 transition-colors">✨ Acesso Total</p>
                        <p className="text-gray-500 text-xs">Todas as permissões do sistema</p>
                      </div>
                    </label>

                    <div className="border-t border-gray-700 pt-3">
                      {/* Permissões por Módulo */}
                      {Object.entries(permissoesDoSistema).map(([moduloKey, modulo]) => (
                        <div key={moduloKey} className="mb-4 last:mb-0">
                          {/* Cabeçalho do Módulo */}
                          <p className="text-xs font-black uppercase tracking-widest text-purple-400 mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                            {modulo.nome}
                          </p>
                          {/* Permissões do Módulo */}
                          <div className="space-y-1.5 ml-4">
                            {modulo.permissoes.map(permissao => (
                              <label key={permissao.id} className="flex items-start gap-2.5 cursor-pointer group p-2 rounded-lg hover:bg-gray-800/60 transition-all">
                                <input
                                  type="checkbox"
                                  defaultChecked={editingRole?.permissions.includes(permissao.id)}
                                  className="w-4 h-4 mt-0.5 accent-purple-600"
                                />
                                <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                  {permissao.nome}
                                </p>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Permissões são as mesmas do painel principal (Gerenciar Equipe)
                  </p>
                </div>

                {/* Botões */}
                <div className="flex gap-3 pt-2 border-t border-gray-800">
                  <button
                    onClick={() => {
                      alert(`Role ${editingRole ? 'atualizada' : 'adicionada'} com sucesso! (funcionalidade simulada)`);
                      setShowAddRoleModal(false);
                      setEditingRole(null);
                    }}
                    className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <FaCheckCircle /> {editingRole ? 'Atualizar' : 'Adicionar'}
                  </button>
                  <button
                    onClick={() => { setShowAddRoleModal(false); setEditingRole(null); }}
                    className="px-4 py-3 bg-gray-800 text-gray-300 font-semibold rounded-xl hover:bg-gray-700 transition-all border border-gray-700"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminNew;
