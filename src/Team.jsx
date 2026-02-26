// TODO: Implementar autenticação e autorização real
// TODO: Adicionar auditoria de ações dos usuários
// TODO: Implementar convites por email
// TODO: Adicionar integração com Active Directory/LDAP
// TODO: Implementar gestão de turnos e escalas
// TODO: Adicionar métricas de produtividade por membro
import React, { useState, useEffect } from 'react';
import {
  FaSearch,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaChevronDown,
  FaChevronRight,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
  FaChartLine,
  FaComments,
  FaTrophy,
  FaSortAmountDown,
  FaSortAmountUp,
  FaUserTie,
  FaFilter,
  FaStar,
  FaUserCog,
  FaCrown,
  FaPlus,
  FaInbox,
  FaUsers,
  FaFileAlt,
  FaCog,
  FaDownload,
  FaEye,
  FaDollarSign,
  FaAddressBook
} from 'react-icons/fa';
import { useAppContext } from './contexts/AppContext';
import { useToast } from './contexts/ToastContext';
import UpgradeBanner from './components/UpgradeBanner';

const Team = ({ onNavigate = () => {} }) => {
  const toast = useToast();
  // Context
  const { getCurrentPlan, canAddTeamMember, teamData } = useAppContext();

  // Estados principais
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteCargo, setInviteCargo] = useState('');
  const [inviteSetor, setInviteSetor] = useState('');
  const [editingMember, setEditingMember] = useState(null);
  const [activeTab, setActiveTab] = useState('info'); // info, permissions, schedule

  // Estados de filtros
  const [filterRole, setFilterRole] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterDepartment, setFilterDepartment] = useState('todos');
  const [showFilterDropdown, setShowFilterDropdown] = useState(null);

  // Estados de visualização
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'

  // Estados de departamentos
  const [showDepartmentsModal, setShowDepartmentsModal] = useState(false);
  const [customDepartments, setCustomDepartments] = useState([]);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [newDepartmentColor, setNewDepartmentColor] = useState('text-gray-600 dark:text-gray-600');
  const [newDepartmentIcon, setNewDepartmentIcon] = useState('FaBuilding');

  // Modal de criar setor completo
  const [showCreateDepartmentModal, setShowCreateDepartmentModal] = useState(false);
  const [newDeptComplete, setNewDeptComplete] = useState({
    nome: '',
    cor: 'text-gray-600 dark:text-gray-600',
    icone: 'FaBuilding',
    permissoes: []
  });
  const [showIconDrawerDept, setShowIconDrawerDept] = useState(false);
  const [showColorDrawerDept, setShowColorDrawerDept] = useState(false);
  const [customColorDept, setCustomColorDept] = useState('#10b981');
  const [customHexDept, setCustomHexDept] = useState('');

  // Estados de permissões por departamento
  const [showPermissoesDepartamentoModal, setShowPermissoesDepartamentoModal] = useState(false);
  const [departamentoEditandoPermissoes, setDepartamentoEditandoPermissoes] = useState(null);
  const [permissoesPorDepartamento, setPermissoesPorDepartamento] = useState({
    atendimento: ['dashboard_visualizar', 'inbox_visualizar', 'inbox_responder', 'inbox_arquivar', 'contatos_visualizar', 'contatos_editar'],
    vendas: ['dashboard_visualizar', 'crm_visualizar', 'crm_editar', 'crm_criar', 'crm_valores_proprios', 'contatos_visualizar', 'contatos_editar', 'contatos_criar'],
    suporte: ['dashboard_visualizar', 'inbox_visualizar', 'inbox_responder', 'inbox_deletar', 'inbox_arquivar', 'contatos_visualizar', 'contatos_editar'],
    marketing: ['dashboard_visualizar', 'contatos_visualizar', 'contatos_exportar', 'relatorios_visualizar', 'relatorios_exportar'],
    administrativo: ['dashboard_visualizar', 'dashboard_editar', 'equipe_visualizar', 'relatorios_visualizar', 'relatorios_exportar', 'config_visualizar'],
    financeiro: ['dashboard_visualizar', 'crm_visualizar', 'crm_valores', 'relatorios_visualizar', 'relatorios_exportar', 'integracoes_visualizar', 'integracoes_dashboard']
  });

  // Estados de cargos
  const [showCargosModal, setShowCargosModal] = useState(false);
  const [customCargos, setCustomCargos] = useState([]);
  const [newCargoNome, setNewCargoNome] = useState('');
  const [newCargoColor, setNewCargoColor] = useState('text-gray-600 dark:text-gray-600');
  const [newCargoIcon, setNewCargoIcon] = useState('FaBriefcase');

  // Modal de criar cargo completo
  const [showCreateCargoModal, setShowCreateCargoModal] = useState(false);
  const [newCargoComplete, setNewCargoComplete] = useState({
    nome: '',
    cor: 'text-gray-600 dark:text-gray-600',
    icone: 'FaBriefcase',
    permissoes: []
  });
  const [showIconDrawerCargo, setShowIconDrawerCargo] = useState(false);
  const [showColorDrawerCargo, setShowColorDrawerCargo] = useState(false);
  const [customColorCargo, setCustomColorCargo] = useState('#6366f1');
  const [customHexCargo, setCustomHexCargo] = useState('');

  // Estados de permissões por cargo
  const [showPermissoesCargoModal, setShowPermissoesCargoModal] = useState(false);
  const [cargoEditandoPermissoes, setCargoEditandoPermissoes] = useState(null);
  const [permissoesPorCargo, setPermissoesPorCargo] = useState({
    dono: [
      // Dashboard
      'dashboard_visualizar', 'dashboard_editar', 'dashboard_integracoes', 'dashboard_exportar',
      // Inbox
      'inbox_visualizar', 'inbox_responder', 'inbox_editar', 'inbox_deletar', 'inbox_arquivar', 'inbox_exportar', 'inbox_importar',
      // CRM
      'crm_visualizar', 'crm_editar', 'crm_criar', 'crm_deletar', 'crm_valores', 'crm_valores_proprios', 'crm_exportar', 'crm_importar',
      // Contatos
      'contatos_visualizar', 'contatos_editar', 'contatos_criar', 'contatos_deletar', 'contatos_exportar', 'contatos_importar',
      // Relatórios
      'relatorios_visualizar', 'relatorios_editar', 'relatorios_criar', 'relatorios_exportar', 'relatorios_deletar',
      // Equipe
      'equipe_visualizar', 'equipe_editar', 'equipe_criar', 'equipe_deletar', 'equipe_permissoes', 'equipe_exportar',
      // Integrações
      'integracoes_visualizar', 'integracoes_conectar', 'integracoes_configurar', 'integracoes_dashboard',
      // Conexões
      'conexoes_visualizar', 'conexoes_conectar', 'conexoes_editar', 'conexoes_criar', 'conexoes_deletar', 'conexoes_configurar',
      // Configurações
      'config_visualizar', 'config_editar', 'config_acesso_total'
    ],
    admin: [
      // Dashboard
      'dashboard_visualizar', 'dashboard_editar', 'dashboard_integracoes', 'dashboard_exportar',
      // Inbox
      'inbox_visualizar', 'inbox_responder', 'inbox_editar', 'inbox_deletar', 'inbox_arquivar', 'inbox_exportar',
      // CRM
      'crm_visualizar', 'crm_editar', 'crm_criar', 'crm_deletar', 'crm_valores', 'crm_exportar',
      // Contatos
      'contatos_visualizar', 'contatos_editar', 'contatos_criar', 'contatos_deletar', 'contatos_exportar',
      // Relatórios
      'relatorios_visualizar', 'relatorios_editar', 'relatorios_exportar',
      // Equipe
      'equipe_visualizar', 'equipe_editar', 'equipe_criar', 'equipe_exportar',
      // Integrações
      'integracoes_visualizar', 'integracoes_dashboard',
      // Conexões
      'conexoes_visualizar', 'conexoes_conectar', 'conexoes_editar', 'conexoes_configurar',
      // Configurações
      'config_visualizar', 'config_editar'
    ],
    supervisor: [
      // Dashboard
      'dashboard_visualizar', 'dashboard_integracoes',
      // Inbox
      'inbox_visualizar', 'inbox_responder', 'inbox_arquivar', 'inbox_exportar',
      // CRM
      'crm_visualizar', 'crm_editar', 'crm_criar', 'crm_valores', 'crm_exportar',
      // Contatos
      'contatos_visualizar', 'contatos_editar', 'contatos_criar', 'contatos_exportar',
      // Relatórios
      'relatorios_visualizar', 'relatorios_exportar',
      // Equipe
      'equipe_visualizar',
      // Conexões
      'conexoes_visualizar'
    ],
    atendente: [
      // Dashboard
      'dashboard_visualizar',
      // Inbox
      'inbox_visualizar', 'inbox_responder',
      // Contatos
      'contatos_visualizar', 'contatos_editar'
    ],
    vendedor: [
      // Dashboard
      'dashboard_visualizar',
      // CRM
      'crm_visualizar', 'crm_editar', 'crm_criar', 'crm_valores_proprios', 'crm_exportar',
      // Contatos
      'contatos_visualizar', 'contatos_editar', 'contatos_criar', 'contatos_exportar'
    ],
    suporte: [
      // Dashboard
      'dashboard_visualizar',
      // Inbox
      'inbox_visualizar', 'inbox_responder', 'inbox_arquivar',
      // Contatos
      'contatos_visualizar', 'contatos_editar'
    ]
  });

  // Estados de membros (mutável)
  const [membersData, setMembersData] = useState([]);

  // Formulário novo membro
  const [newMember, setNewMember] = useState({
    nome: '',
    email: '',
    telefone: '',
    documento: '',
    cargo: 'Atendente',
    departamento: 'Atendimento',
    status: 'ativo',
    permissoes: [],
    permissoesGranulares: [],
    cargaHoraria: {
      segunda: [],
      terca: [],
      quarta: [],
      quinta: [],
      sexta: [],
      sabado: [],
      domingo: [],
      diaSimDiaNao: false,
      semanaSimSemanaNao: false
    }
  });

  // Cargos padrão
  const cargosPadrao = [
    { id: 'dono', nome: 'Dono', icon: <FaCrown />, color: 'text-yellow-600 dark:text-yellow-400', iconName: 'FaCrown', deletable: false },
    { id: 'admin', nome: 'Administrador', icon: <FaUserCog />, color: 'text-amber-600 dark:text-amber-400', iconName: 'FaUserCog', deletable: true },
    { id: 'supervisor', nome: 'Supervisor', icon: <FaUserTie />, color: 'text-blue-600 dark:text-blue-400', iconName: 'FaUserTie', deletable: true },
    { id: 'atendente', nome: 'Atendente', icon: <FaUser />, color: 'text-purple-600 dark:text-purple-400', iconName: 'FaUser', deletable: true },
    { id: 'vendedor', nome: 'Vendedor', icon: <FaBriefcase />, color: 'text-emerald-600 dark:text-emerald-400', iconName: 'FaBriefcase', deletable: true },
    { id: 'suporte', nome: 'Suporte', icon: <FaShieldAlt />, color: 'text-cyan-600 dark:text-cyan-400', iconName: 'FaShieldAlt', deletable: true }
  ];

  // Todos os cargos (padrão + customizados)
  const cargos = [...cargosPadrao, ...customCargos];

  // Departamentos padrão
  const departamentosPadrao = [
    { id: 'atendimento', nome: 'Atendimento', icon: <FaComments />, color: 'text-blue-600 dark:text-blue-400', iconName: 'FaComments', deletable: true },
    { id: 'vendas', nome: 'Vendas', icon: <FaDollarSign />, color: 'text-emerald-600 dark:text-emerald-400', iconName: 'FaDollarSign', deletable: true },
    { id: 'suporte', nome: 'Suporte Técnico', icon: <FaShieldAlt />, color: 'text-cyan-600 dark:text-cyan-400', iconName: 'FaShieldAlt', deletable: true },
    { id: 'marketing', nome: 'Marketing', icon: <FaChartLine />, color: 'text-pink-600 dark:text-pink-400', iconName: 'FaChartLine', deletable: true },
    { id: 'administrativo', nome: 'Administrativo', icon: <FaCog />, color: 'text-gray-600 dark:text-gray-600', iconName: 'FaCog', deletable: true },
    { id: 'financeiro', nome: 'Financeiro', icon: <FaDollarSign />, color: 'text-amber-600 dark:text-amber-400', iconName: 'FaDollarSign', deletable: true }
  ];

  // Todos os departamentos (padrão + customizados)
  const departamentos = [...departamentosPadrao, ...customDepartments];

  // Apenas nomes dos departamentos (para compatibilidade com select)
  const departamentosNomes = departamentos.map(d => typeof d === 'string' ? d : d.nome);

  // Permissões granulares por módulo
  const permissoesGranulares = {
    dashboard: {
      nome: 'Dashboard',
      icon: <FaChartLine />,
      permissoes: [
        { id: 'dashboard_visualizar', nome: 'Visualizar Dashboard Principal' },
        { id: 'dashboard_editar', nome: 'Editar Dashboard' },
        { id: 'dashboard_integracoes', nome: 'Ver Dashboard de Integrações' },
        { id: 'dashboard_exportar', nome: 'Exportar Dados' }
      ]
    },
    inbox: {
      nome: 'Inbox',
      icon: <FaInbox />,
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
      icon: <FaBriefcase />,
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
      icon: <FaAddressBook />,
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
      icon: <FaFileAlt />,
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
      icon: <FaUsers />,
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
      icon: <FaCog />,
      permissoes: [
        { id: 'integracoes_visualizar', nome: 'Visualizar Integrações' },
        { id: 'integracoes_conectar', nome: 'Conectar/Desconectar' },
        { id: 'integracoes_configurar', nome: 'Configurar Integrações' },
        { id: 'integracoes_dashboard', nome: 'Ver Dashboard de Integrações' }
      ]
    },
    conexoes: {
      nome: 'Conexões',
      icon: <FaPhone />,
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
      icon: <FaCog />,
      permissoes: [
        { id: 'config_visualizar', nome: 'Visualizar Configurações' },
        { id: 'config_editar', nome: 'Editar Configurações' },
        { id: 'config_acesso_total', nome: 'Acesso Total às Configurações' }
      ]
    }
  };

  // Permissões disponíveis (legado - usado no modal de adicionar)
  const permissoesDisponiveis = [
    'Gerenciar Conversas',
    'Gerenciar Contatos',
    'Gerenciar CRM',
    'Gerenciar Equipe',
    'Visualizar Relatórios',
    'Configurações',
    'Exportar Dados',
    'Deletar Conversas'
  ];

  // Dias da semana para carga horária
  const diasSemana = [
    { id: 'segunda', nome: 'SEG' },
    { id: 'terca', nome: 'TER' },
    { id: 'quarta', nome: 'QUA' },
    { id: 'quinta', nome: 'QUI' },
    { id: 'sexta', nome: 'SEX' },
    { id: 'sabado', nome: 'SAB' },
    { id: 'domingo', nome: 'DOM' }
  ];

  // Inicializar membros mockados
  useEffect(() => {
    setMembersData([
      {
        id: 1,
        nome: 'Maria Santos',
        email: 'maria.santos@plataforma.com',
        telefone: '+55 (11) 98765-4321',
        documento: '123.456.789-00',
        cargo: 'admin',
        departamento: 'Administrativo',
        status: 'ativo',
        dataEntrada: '2024-01-15',
        permissoes: ['Gerenciar Conversas', 'Gerenciar Contatos', 'Gerenciar CRM', 'Gerenciar Equipe', 'Visualizar Relatórios', 'Configurações', 'Exportar Dados', 'Deletar Conversas'],
        permissoesGranulares: [
          'dashboard_visualizar', 'dashboard_editar',
          'inbox_visualizar', 'inbox_responder', 'inbox_deletar', 'inbox_arquivar',
          'crm_visualizar', 'crm_editar', 'crm_criar', 'crm_deletar', 'crm_valores',
          'contatos_visualizar', 'contatos_editar', 'contatos_criar', 'contatos_deletar', 'contatos_exportar',
          'relatorios_visualizar', 'relatorios_exportar',
          'equipe_visualizar', 'equipe_editar', 'equipe_permissoes',
          'config_acesso'
        ],
        cargaHoraria: {
          segunda: [{ inicio: '09:00', fim: '18:00' }],
          terca: [{ inicio: '09:00', fim: '18:00' }],
          quarta: [{ inicio: '09:00', fim: '18:00' }],
          quinta: [{ inicio: '09:00', fim: '18:00' }],
          sexta: [{ inicio: '09:00', fim: '18:00' }],
          sabado: [],
          domingo: [],
          diaSimDiaNao: false,
          semanaSimSemanaNao: false
        },
        estatisticas: {
          atendimentos: 342,
          conversoes: 89,
          ticketMedio: 15800,
          tempoMedioResposta: '5 min',
          satisfacao: 4.8
        }
      },
      {
        id: 2,
        nome: 'Carlos Mendes',
        email: 'carlos.mendes@plataforma.com',
        telefone: '+55 (11) 98765-4322',
        documento: '234.567.890-11',
        cargo: 'supervisor',
        departamento: 'Vendas',
        status: 'ativo',
        dataEntrada: '2024-02-10',
        permissoes: ['Gerenciar Conversas', 'Gerenciar Contatos', 'Gerenciar CRM', 'Visualizar Relatórios'],
        permissoesGranulares: [
          'dashboard_visualizar',
          'inbox_visualizar', 'inbox_responder',
          'crm_visualizar', 'crm_editar', 'crm_criar', 'crm_valores',
          'contatos_visualizar', 'contatos_editar',
          'relatorios_visualizar'
        ],
        cargaHoraria: {
          segunda: [{ inicio: '08:00', fim: '17:00' }],
          segundaAlternada: false,
          terca: [{ inicio: '08:00', fim: '17:00' }],
          tercaAlternada: false,
          quarta: [{ inicio: '08:00', fim: '17:00' }],
          quartaAlternada: false,
          quinta: [{ inicio: '08:00', fim: '17:00' }],
          quintaAlternada: false,
          sexta: [{ inicio: '08:00', fim: '17:00' }],
          sextaAlternada: false,
          sabado: [{ inicio: '09:00', fim: '13:00' }],
          sabadoAlternado: false,
          domingo: [],
          domingoAlternado: false,
          diaSimDiaNao: false,
          semanaSimSemanaNao: false
        },
        estatisticas: {
          atendimentos: 298,
          conversoes: 76,
          ticketMedio: 18200,
          tempoMedioResposta: '7 min',
          satisfacao: 4.6
        }
      },
      {
        id: 3,
        nome: 'Ana Paula',
        email: 'ana.paula@plataforma.com',
        telefone: '+55 (11) 98765-4323',
        documento: '345.678.901-22',
        cargo: 'atendente',
        departamento: 'Atendimento',
        status: 'ativo',
        dataEntrada: '2024-03-05',
        permissoes: ['Gerenciar Conversas', 'Gerenciar Contatos'],
        permissoesGranulares: [
          'inbox_visualizar', 'inbox_responder',
          'contatos_visualizar', 'contatos_editar'
        ],
        cargaHoraria: {
          segunda: [{ inicio: '14:00', fim: '22:00' }],
          segundaAlternada: false,
          terca: [{ inicio: '14:00', fim: '22:00' }],
          tercaAlternada: false,
          quarta: [{ inicio: '14:00', fim: '22:00' }],
          quartaAlternada: false,
          quinta: [{ inicio: '14:00', fim: '22:00' }],
          quintaAlternada: false,
          sexta: [{ inicio: '14:00', fim: '22:00' }],
          sextaAlternada: false,
          sabado: [],
          sabadoAlternado: false,
          domingo: [],
          domingoAlternado: false,
          diaSimDiaNao: false,
          semanaSimSemanaNao: false
        },
        estatisticas: {
          atendimentos: 423,
          conversoes: 67,
          ticketMedio: 12300,
          tempoMedioResposta: '4 min',
          satisfacao: 4.9
        }
      },
      {
        id: 4,
        nome: 'João Costa',
        email: 'joao.costa@plataforma.com',
        telefone: '+55 (11) 98765-4324',
        documento: '456.789.012-33',
        cargo: 'vendedor',
        departamento: 'Vendas',
        status: 'ativo',
        dataEntrada: '2024-01-20',
        permissoes: ['Gerenciar Conversas', 'Gerenciar Contatos', 'Gerenciar CRM'],
        permissoesGranulares: [
          'inbox_visualizar', 'inbox_responder',
          'crm_visualizar', 'crm_editar', 'crm_criar', 'crm_valores',
          'contatos_visualizar', 'contatos_editar', 'contatos_criar'
        ],
        cargaHoraria: {
          segunda: [{ inicio: '09:00', fim: '13:00' }, { inicio: '14:00', fim: '18:00' }],
          segundaAlternada: false,
          terca: [{ inicio: '09:00', fim: '13:00' }, { inicio: '14:00', fim: '18:00' }],
          tercaAlternada: false,
          quarta: [{ inicio: '09:00', fim: '13:00' }, { inicio: '14:00', fim: '18:00' }],
          quartaAlternada: false,
          quinta: [{ inicio: '09:00', fim: '13:00' }, { inicio: '14:00', fim: '18:00' }],
          quintaAlternada: false,
          sexta: [{ inicio: '09:00', fim: '13:00' }, { inicio: '14:00', fim: '18:00' }],
          sextaAlternada: false,
          sabado: [],
          sabadoAlternado: false,
          domingo: [],
          domingoAlternado: false,
          diaSimDiaNao: false,
          semanaSimSemanaNao: false
        },
        estatisticas: {
          atendimentos: 267,
          conversoes: 94,
          ticketMedio: 22500,
          tempoMedioResposta: '10 min',
          satisfacao: 4.7
        }
      },
      {
        id: 5,
        nome: 'Fernanda Lima',
        email: 'fernanda.lima@plataforma.com',
        telefone: '+55 (11) 98765-4325',
        documento: '567.890.123-44',
        cargo: 'suporte',
        departamento: 'Suporte Técnico',
        status: 'ativo',
        dataEntrada: '2024-02-28',
        permissoes: ['Gerenciar Conversas', 'Gerenciar Contatos', 'Visualizar Relatórios'],
        permissoesGranulares: [
          'inbox_visualizar', 'inbox_responder', 'inbox_arquivar',
          'contatos_visualizar', 'contatos_editar',
          'relatorios_visualizar'
        ],
        cargaHoraria: {
          segunda: [{ inicio: '22:00', fim: '06:00' }],
          segundaAlternada: false,
          terca: [{ inicio: '22:00', fim: '06:00' }],
          tercaAlternada: false,
          quarta: [{ inicio: '22:00', fim: '06:00' }],
          quartaAlternada: false,
          quinta: [{ inicio: '22:00', fim: '06:00' }],
          quintaAlternada: false,
          sexta: [{ inicio: '22:00', fim: '06:00' }],
          sextaAlternada: false,
          sabado: [],
          sabadoAlternado: false,
          domingo: [],
          domingoAlternado: false,
          diaSimDiaNao: false,
          semanaSimSemanaNao: false
        },
        estatisticas: {
          atendimentos: 512,
          conversoes: 45,
          ticketMedio: 8900,
          tempoMedioResposta: '3 min',
          satisfacao: 4.95
        }
      },
      {
        id: 6,
        nome: 'Roberto Alves',
        email: 'roberto.alves@plataforma.com',
        telefone: '+55 (11) 98765-4326',
        documento: '678.901.234-55',
        cargo: 'atendente',
        departamento: 'Atendimento',
        status: 'ativo',
        dataEntrada: '2024-03-12',
        permissoes: ['Gerenciar Conversas', 'Gerenciar Contatos'],
        permissoesGranulares: [
          'inbox_visualizar', 'inbox_responder',
          'contatos_visualizar'
        ],
        cargaHoraria: {
          segunda: [{ inicio: '10:00', fim: '19:00' }],
          segundaAlternada: true,
          terca: [],
          tercaAlternada: false,
          quarta: [{ inicio: '10:00', fim: '19:00' }],
          quartaAlternada: false,
          quinta: [],
          quintaAlternada: false,
          sexta: [{ inicio: '10:00', fim: '19:00' }],
          sextaAlternada: false,
          sabado: [],
          sabadoAlternado: false,
          domingo: [{ inicio: '10:00', fim: '19:00' }],
          domingoAlternado: false,
          diaSimDiaNao: true,
          semanaSimSemanaNao: false
        },
        estatisticas: {
          atendimentos: 389,
          conversoes: 58,
          ticketMedio: 11200,
          tempoMedioResposta: '6 min',
          satisfacao: 4.5
        }
      },
      {
        id: 7,
        nome: 'Patricia Souza',
        email: 'patricia.souza@plataforma.com',
        telefone: '+55 (11) 98765-4327',
        documento: '789.012.345-66',
        cargo: 'vendedor',
        departamento: 'Vendas',
        status: 'inativo',
        dataEntrada: '2023-11-08',
        permissoes: ['Gerenciar Conversas', 'Gerenciar CRM'],
        permissoesGranulares: [
          'inbox_visualizar',
          'crm_visualizar', 'crm_editar'
        ],
        cargaHoraria: {
          segunda: [],
          segundaAlternada: false,
          terca: [],
          tercaAlternada: false,
          quarta: [],
          quartaAlternada: false,
          quinta: [],
          quintaAlternada: false,
          sexta: [],
          sextaAlternada: false,
          sabado: [],
          sabadoAlternado: false,
          domingo: [],
          domingoAlternado: false,
          diaSimDiaNao: false,
          semanaSimSemanaNao: false
        },
        estatisticas: {
          atendimentos: 187,
          conversoes: 41,
          ticketMedio: 16700,
          tempoMedioResposta: '12 min',
          satisfacao: 4.3
        }
      },
      {
        id: 8,
        nome: 'Lucas Ferreira',
        email: 'lucas.ferreira@plataforma.com',
        telefone: '+55 (11) 98765-4328',
        documento: '890.123.456-77',
        cargo: 'atendente',
        departamento: 'Atendimento',
        status: 'ativo',
        dataEntrada: '2026-02-15',
        permissoes: ['Gerenciar Conversas', 'Gerenciar Contatos'],
        permissoesGranulares: [
          'inbox_visualizar', 'inbox_responder',
          'contatos_visualizar'
        ],
        cargaHoraria: {
          segunda: [{ inicio: '06:00', fim: '14:00' }],
          terca: [{ inicio: '06:00', fim: '14:00' }],
          quarta: [{ inicio: '06:00', fim: '14:00' }],
          quinta: [{ inicio: '06:00', fim: '14:00' }],
          sexta: [{ inicio: '06:00', fim: '14:00' }],
          sabado: [],
          domingo: [],
          diaSimDiaNao: false,
          semanaSimSemanaNao: false
        },
        estatisticas: {
          atendimentos: 142,
          conversoes: 28,
          ticketMedio: 9800,
          tempoMedioResposta: '8 min',
          satisfacao: 4.4
        }
      }
    ]);
  }, []);

  // Filtrar membros
  const filteredBySearch = membersData.filter(member =>
    member.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.telefone.includes(searchTerm)
  );

  const filteredByRole = filteredBySearch.filter(member => {
    if (filterRole === 'todos') return true;
    return member.cargo === filterRole;
  });

  const filteredByStatus = filteredByRole.filter(member => {
    if (filterStatus === 'todos') return true;
    return member.status === filterStatus;
  });

  const filteredByDepartment = filteredByStatus.filter(member => {
    if (filterDepartment === 'todos') return true;
    return member.departamento === filterDepartment;
  });

  // Ordenar
  const sortedMembers = [...filteredByDepartment].sort((a, b) => {
    if (sortOrder === 'desc') {
      return new Date(b.dataEntrada) - new Date(a.dataEntrada);
    } else {
      return new Date(a.dataEntrada) - new Date(b.dataEntrada);
    }
  });

  // Calcular métricas
  const totalMembros = membersData.length;
  const membrosAtivos = membersData.filter(m => m.status === 'ativo').length;
  const membrosInativos = membersData.filter(m => m.status === 'inativo').length;
  const novosEsteMes = membersData.filter(m => {
    const dataEntrada = new Date(m.dataEntrada);
    const hoje = new Date();
    return dataEntrada.getMonth() === hoje.getMonth() && dataEntrada.getFullYear() === hoje.getFullYear();
  }).length;

  // Funções de manipulação
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const handleSelectMember = (member) => {
    setSelectedMember(member);
    setShowMemberModal(true);
  };

  const handleStartEdit = (member) => {
    setEditingMember({ ...member });
  };

  const handleSaveEdit = () => {
    if (editingMember) {
      setMembersData(membersData.map(member =>
        member.id === editingMember.id ? editingMember : member
      ));
      setSelectedMember(editingMember);
      setEditingMember(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
  };

  const handleTogglePermission = (permissao) => {
    if (editingMember) {
      const permissoes = editingMember.permissoes.includes(permissao)
        ? editingMember.permissoes.filter(p => p !== permissao)
        : [...editingMember.permissoes, permissao];
      setEditingMember({ ...editingMember, permissoes });
    }
  };

  const handleToggleNewMemberPermission = (permissao) => {
    const permissoes = newMember.permissoes.includes(permissao)
      ? newMember.permissoes.filter(p => p !== permissao)
      : [...newMember.permissoes, permissao];
    setNewMember({ ...newMember, permissoes });
  };

  // Funções para permissões granulares
  const handleTogglePermissaoGranular = (permissaoId) => {
    if (editingMember) {
      const permissoesGranulares = editingMember.permissoesGranulares || [];
      const novasPermissoes = permissoesGranulares.includes(permissaoId)
        ? permissoesGranulares.filter(p => p !== permissaoId)
        : [...permissoesGranulares, permissaoId];
      setEditingMember({ ...editingMember, permissoesGranulares: novasPermissoes });
    }
  };

  // Funções para carga horária
  const handleToggleDiaSemana = (dia) => {
    if (editingMember) {
      const cargaHoraria = editingMember.cargaHoraria || {};
      const horariosDia = cargaHoraria[dia] || [];
      const novosHorarios = horariosDia.length > 0 ? [] : [{ inicio: '09:00', fim: '18:00' }];
      setEditingMember({
        ...editingMember,
        cargaHoraria: { ...cargaHoraria, [dia]: novosHorarios }
      });
    }
  };

  const handleAddHorario = (dia) => {
    if (editingMember) {
      const cargaHoraria = editingMember.cargaHoraria || {};
      const horariosDia = cargaHoraria[dia] || [];
      if (horariosDia.length < 3) {
        const novosHorarios = [...horariosDia, { inicio: '09:00', fim: '18:00' }];
        setEditingMember({
          ...editingMember,
          cargaHoraria: { ...cargaHoraria, [dia]: novosHorarios }
        });
      }
    }
  };

  const handleRemoveHorario = (dia, index) => {
    if (editingMember) {
      const cargaHoraria = editingMember.cargaHoraria || {};
      const horariosDia = cargaHoraria[dia] || [];
      const novosHorarios = horariosDia.filter((_, i) => i !== index);
      setEditingMember({
        ...editingMember,
        cargaHoraria: { ...cargaHoraria, [dia]: novosHorarios }
      });
    }
  };

  const handleUpdateHorario = (dia, index, campo, valor) => {
    if (editingMember) {
      const cargaHoraria = editingMember.cargaHoraria || {};
      const horariosDia = [...(cargaHoraria[dia] || [])];
      if (horariosDia[index]) {
        horariosDia[index] = { ...horariosDia[index], [campo]: valor };
        setEditingMember({
          ...editingMember,
          cargaHoraria: { ...cargaHoraria, [dia]: horariosDia }
        });
      }
    }
  };

  const handleToggleDiaSimDiaNao = () => {
    if (editingMember) {
      const cargaHoraria = editingMember.cargaHoraria || {};
      setEditingMember({
        ...editingMember,
        cargaHoraria: { ...cargaHoraria, diaSimDiaNao: !cargaHoraria.diaSimDiaNao }
      });
    }
  };

  const handleToggleSemanaNao = () => {
    if (editingMember) {
      const cargaHoraria = editingMember.cargaHoraria || {};
      setEditingMember({
        ...editingMember,
        cargaHoraria: { ...cargaHoraria, semanaSimSemanaNao: !cargaHoraria.semanaSimSemanaNao }
      });
    }
  };

  const handleToggleDiaAlternado = (dia) => {
    if (editingMember) {
      const cargaHoraria = editingMember.cargaHoraria || {};
      const campoAlternado = `${dia}Alternado` === 'sabadoAlternado' || `${dia}Alternado` === 'domingoAlternado'
        ? `${dia}Alternado`
        : `${dia}Alternada`;
      setEditingMember({
        ...editingMember,
        cargaHoraria: { ...cargaHoraria, [campoAlternado]: !cargaHoraria[campoAlternado] }
      });
    }
  };

  // Funções de departamentos
  const handleAddDepartment = () => {
    if (newDepartmentName.trim()) {
      const departamentoId = newDepartmentName.toLowerCase().replace(/\s+/g, '-');
      const todosDeptIds = [...departamentosPadrao.map(d => d.id), ...customDepartments.map(d => d.id)];
      if (todosDeptIds.includes(departamentoId)) {
        toast.error('Já existe um departamento com este nome');
        return;
      }
      const novoDept = {
        id: departamentoId,
        nome: newDepartmentName.trim(),
        icon: iconMap[newDepartmentIcon] || <FaBuilding />,
        iconName: newDepartmentIcon,
        color: newDepartmentColor,
        deletable: true
      };
      setCustomDepartments([...customDepartments, novoDept]);
      setNewDepartmentName('');
      setNewDepartmentColor('text-gray-600 dark:text-gray-600');
      setNewDepartmentIcon('FaBuilding');
    }
  };

  const handleDeleteDepartment = (deptId, isPadrao = false) => {
    if (confirm(`Tem certeza que deseja excluir este departamento?`)) {
      if (isPadrao) {
        toast.warning('Funcionalidade de exclusão de departamentos padrão requer implementação de estado adicional');
      } else {
        setCustomDepartments(customDepartments.filter(d => d.id !== deptId));
        // Remove permissões do departamento
        const novasPermissoes = { ...permissoesPorDepartamento };
        delete novasPermissoes[deptId];
        setPermissoesPorDepartamento(novasPermissoes);
      }
    }
  };

  // Funções de permissões por departamento
  const handleOpenPermissoesDepartamento = (dept) => {
    setDepartamentoEditandoPermissoes(dept);
    setShowPermissoesDepartamentoModal(true);
  };

  const handleTogglePermissaoDepartamento = (permissaoId) => {
    const deptId = departamentoEditandoPermissoes.id;
    const permissoesAtuais = permissoesPorDepartamento[deptId] || [];

    if (permissoesAtuais.includes(permissaoId)) {
      setPermissoesPorDepartamento({
        ...permissoesPorDepartamento,
        [deptId]: permissoesAtuais.filter(p => p !== permissaoId)
      });
    } else {
      setPermissoesPorDepartamento({
        ...permissoesPorDepartamento,
        [deptId]: [...permissoesAtuais, permissaoId]
      });
    }
  };

  const handleToggleModuloDepartamento = (modulo) => {
    const deptId = departamentoEditandoPermissoes.id;
    const permissoesAtuais = permissoesPorDepartamento[deptId] || [];
    const permissoesModulo = permissoesGranulares[modulo].permissoes.map(p => p.id);

    const todasMarcadas = permissoesModulo.every(p => permissoesAtuais.includes(p));

    if (todasMarcadas) {
      // Desmarcar todas do módulo
      setPermissoesPorDepartamento({
        ...permissoesPorDepartamento,
        [deptId]: permissoesAtuais.filter(p => !permissoesModulo.includes(p))
      });
    } else {
      // Marcar todas do módulo
      const novasPermissoes = [...new Set([...permissoesAtuais, ...permissoesModulo])];
      setPermissoesPorDepartamento({
        ...permissoesPorDepartamento,
        [deptId]: novasPermissoes
      });
    }
  };

  // Funções para criar cargo completo (com permissões)
  const handleCreateCargoComplete = () => {
    if (newCargoComplete.nome.trim()) {
      const cargoId = newCargoComplete.nome.toLowerCase().replace(/\s+/g, '-');
      const todosCargoIds = [...cargosPadrao.map(c => c.id), ...customCargos.map(c => c.id)];
      if (todosCargoIds.includes(cargoId)) {
        toast.error('Já existe um cargo com este nome');
        return;
      }
      const novoCargo = {
        id: cargoId,
        nome: newCargoComplete.nome.trim(),
        icon: iconMap[newCargoComplete.icone] || <FaBriefcase />,
        iconName: newCargoComplete.icone,
        color: newCargoComplete.cor,
        deletable: true
      };
      setCustomCargos([...customCargos, novoCargo]);
      setPermissoesPorCargo({
        ...permissoesPorCargo,
        [cargoId]: newCargoComplete.permissoes
      });
      setShowCreateCargoModal(false);
      setNewCargoComplete({
        nome: '',
        cor: 'text-gray-600 dark:text-gray-600',
        icone: 'FaBriefcase',
        permissoes: []
      });
    }
  };

  const handleTogglePermissaoNewCargo = (permissaoId) => {
    if (newCargoComplete.permissoes.includes(permissaoId)) {
      setNewCargoComplete({
        ...newCargoComplete,
        permissoes: newCargoComplete.permissoes.filter(p => p !== permissaoId)
      });
    } else {
      setNewCargoComplete({
        ...newCargoComplete,
        permissoes: [...newCargoComplete.permissoes, permissaoId]
      });
    }
  };

  const handleToggleModuloNewCargo = (modulo) => {
    const permissoesModulo = permissoesGranulares[modulo].permissoes.map(p => p.id);
    const todasMarcadas = permissoesModulo.every(p => newCargoComplete.permissoes.includes(p));

    if (todasMarcadas) {
      setNewCargoComplete({
        ...newCargoComplete,
        permissoes: newCargoComplete.permissoes.filter(p => !permissoesModulo.includes(p))
      });
    } else {
      const novasPermissoes = [...new Set([...newCargoComplete.permissoes, ...permissoesModulo])];
      setNewCargoComplete({
        ...newCargoComplete,
        permissoes: novasPermissoes
      });
    }
  };

  // Funções para criar setor completo (com permissões)
  const handleCreateDepartmentComplete = () => {
    if (newDeptComplete.nome.trim()) {
      const deptId = newDeptComplete.nome.toLowerCase().replace(/\s+/g, '-');
      const todosDeptIds = [...departamentosPadrao.map(d => d.id), ...customDepartments.map(d => d.id)];
      if (todosDeptIds.includes(deptId)) {
        toast.error('Já existe um setor com este nome');
        return;
      }
      const novoDept = {
        id: deptId,
        nome: newDeptComplete.nome.trim(),
        icon: iconMap[newDeptComplete.icone] || <FaBuilding />,
        iconName: newDeptComplete.icone,
        color: newDeptComplete.cor,
        deletable: true
      };
      setCustomDepartments([...customDepartments, novoDept]);
      setPermissoesPorDepartamento({
        ...permissoesPorDepartamento,
        [deptId]: newDeptComplete.permissoes
      });
      setShowCreateDepartmentModal(false);
      setNewDeptComplete({
        nome: '',
        cor: 'text-gray-600 dark:text-gray-600',
        icone: 'FaBuilding',
        permissoes: []
      });
    }
  };

  const handleTogglePermissaoNewDept = (permissaoId) => {
    if (newDeptComplete.permissoes.includes(permissaoId)) {
      setNewDeptComplete({
        ...newDeptComplete,
        permissoes: newDeptComplete.permissoes.filter(p => p !== permissaoId)
      });
    } else {
      setNewDeptComplete({
        ...newDeptComplete,
        permissoes: [...newDeptComplete.permissoes, permissaoId]
      });
    }
  };

  const handleToggleModuloNewDept = (modulo) => {
    const permissoesModulo = permissoesGranulares[modulo].permissoes.map(p => p.id);
    const todasMarcadas = permissoesModulo.every(p => newDeptComplete.permissoes.includes(p));

    if (todasMarcadas) {
      setNewDeptComplete({
        ...newDeptComplete,
        permissoes: newDeptComplete.permissoes.filter(p => !permissoesModulo.includes(p))
      });
    } else {
      const novasPermissoes = [...new Set([...newDeptComplete.permissoes, ...permissoesModulo])];
      setNewDeptComplete({
        ...newDeptComplete,
        permissoes: novasPermissoes
      });
    }
  };

  // Mapa de ícones disponíveis
  const iconMap = {
    FaCrown: <FaCrown />,
    FaUserCog: <FaUserCog />,
    FaUserTie: <FaUserTie />,
    FaUser: <FaUser />,
    FaBriefcase: <FaBriefcase />,
    FaShieldAlt: <FaShieldAlt />,
    FaStar: <FaStar />,
    FaTrophy: <FaTrophy />,
    FaUsers: <FaUsers />,
    FaChartLine: <FaChartLine />,
    FaCog: <FaCog />,
    FaBuilding: <FaBuilding />,
    FaIdCard: <FaIdCard />,
    FaDollarSign: <FaDollarSign />,
    FaComments: <FaComments />
  };

  // Funções de cargos
  const handleAddCargo = () => {
    if (newCargoNome.trim()) {
      const cargoId = newCargoNome.toLowerCase().replace(/\s+/g, '-');
      const todosCargoIds = [...cargosPadrao.map(c => c.id), ...customCargos.map(c => c.id)];
      if (todosCargoIds.includes(cargoId)) {
        toast.error('Já existe um cargo com este nome');
        return;
      }
      const novoCargo = {
        id: cargoId,
        nome: newCargoNome.trim(),
        icon: iconMap[newCargoIcon] || <FaBriefcase />,
        iconName: newCargoIcon,
        color: newCargoColor,
        deletable: true
      };
      setCustomCargos([...customCargos, novoCargo]);
      setNewCargoNome('');
      setNewCargoColor('text-gray-600 dark:text-gray-600');
      setNewCargoIcon('FaBriefcase');
    }
  };

  const handleDeleteCargo = (cargoId, isPadrao = false) => {
    // Não permite excluir o cargo "Dono"
    if (cargoId === 'dono') {
      toast.error('O cargo "Dono" não pode ser excluído');
      return;
    }

    if (confirm(`Tem certeza que deseja excluir este cargo?`)) {
      if (isPadrao) {
        // Remove do array de cargos padrão (apenas visualmente, precisaria de estado separado)
        toast.warning('Funcionalidade de exclusão de cargos padrão requer implementação de estado adicional');
      } else {
        setCustomCargos(customCargos.filter(c => c.id !== cargoId));
        // Remove permissões do cargo
        const novasPermissoes = { ...permissoesPorCargo };
        delete novasPermissoes[cargoId];
        setPermissoesPorCargo(novasPermissoes);
      }
    }
  };

  // Funções de permissões por cargo
  const handleOpenPermissoesCargo = (cargo) => {
    setCargoEditandoPermissoes(cargo);
    setShowPermissoesCargoModal(true);
  };

  const handleTogglePermissaoCargo = (permissaoId) => {
    const cargoId = cargoEditandoPermissoes.id;
    const permissoesAtuais = permissoesPorCargo[cargoId] || [];

    if (permissoesAtuais.includes(permissaoId)) {
      setPermissoesPorCargo({
        ...permissoesPorCargo,
        [cargoId]: permissoesAtuais.filter(p => p !== permissaoId)
      });
    } else {
      setPermissoesPorCargo({
        ...permissoesPorCargo,
        [cargoId]: [...permissoesAtuais, permissaoId]
      });
    }
  };

  const handleToggleModuloCargo = (modulo) => {
    const cargoId = cargoEditandoPermissoes.id;
    const permissoesAtuais = permissoesPorCargo[cargoId] || [];
    const permissoesModulo = permissoesGranulares[modulo].permissoes.map(p => p.id);

    const todasMarcadas = permissoesModulo.every(p => permissoesAtuais.includes(p));

    if (todasMarcadas) {
      // Desmarcar todas do módulo
      setPermissoesPorCargo({
        ...permissoesPorCargo,
        [cargoId]: permissoesAtuais.filter(p => !permissoesModulo.includes(p))
      });
    } else {
      // Marcar todas do módulo
      const novasPermissoes = [...new Set([...permissoesAtuais, ...permissoesModulo])];
      setPermissoesPorCargo({
        ...permissoesPorCargo,
        [cargoId]: novasPermissoes
      });
    }
  };

  const handleToggleStatus = (memberId) => {
    setMembersData(membersData.map(member =>
      member.id === memberId
        ? { ...member, status: member.status === 'ativo' ? 'inativo' : 'ativo' }
        : member
    ));
    if (selectedMember && selectedMember.id === memberId) {
      setSelectedMember({
        ...selectedMember,
        status: selectedMember.status === 'ativo' ? 'inativo' : 'ativo'
      });
    }
  };

  const handleDeleteMember = (memberId) => {
    if (confirm('Tem certeza que deseja remover este membro da equipe?')) {
      setMembersData(membersData.filter(member => member.id !== memberId));
      setShowMemberModal(false);
      setSelectedMember(null);
    }
  };

  const handleAddNewMember = () => {
    if (newMember.nome && newMember.email) {
      const member = {
        id: Date.now(),
        ...newMember,
        dataEntrada: new Date().toISOString().split('T')[0],
        estatisticas: {
          atendimentos: 0,
          conversoes: 0,
          ticketMedio: 0,
          tempoMedioResposta: '-',
          satisfacao: 0
        }
      };
      setMembersData([...membersData, member]);
      setNewMember({
        nome: '',
        email: '',
        telefone: '',
        documento: '',
        cargo: 'Atendente',
        departamento: 'Atendimento',
        status: 'ativo',
        permissoes: [],
        permissoesGranulares: [],
        cargaHoraria: {
          segunda: [],
          segundaAlternada: false,
          terca: [],
          tercaAlternada: false,
          quarta: [],
          quartaAlternada: false,
          quinta: [],
          quintaAlternada: false,
          sexta: [],
          sextaAlternada: false,
          sabado: [],
          sabadoAlternado: false,
          domingo: [],
          domingoAlternado: false,
          diaSimDiaNao: false,
          semanaSimSemanaNao: false
        }
      });
      setShowAddMemberModal(false);
    }
  };

  const getCargoInfo = (cargoId) => {
    return cargos.find(c => c.id === cargoId) || cargos[2];
  };

  return (
    <div className="bg-[#f0f2f5] dark:bg-gray-950 p-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Equipe
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-600 font-semibold">
                Gerencie membros e permissões da equipe
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Toggle visualização Lista/Grade */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow'
                      : 'text-gray-600 dark:text-gray-600'
                  }`}
                  title="Visualização em grade"
                >
                  <FaUserCog /> Grade
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow'
                      : 'text-gray-600 dark:text-gray-600'
                  }`}
                  title="Visualização em lista"
                >
                  <FaFileAlt /> Lista
                </button>
              </div>

              <button
                onClick={() => setShowCargosModal(true)}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <FaBriefcase /> Gerenciar Cargos
              </button>
              <button
                onClick={() => setShowDepartmentsModal(true)}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <FaBuilding /> Gerenciar Setores
              </button>
              <button
                onClick={() => {
                  const currentCount = teamData.members?.length || 0;
                  if (!canAddTeamMember(currentCount)) {
                    setShowUpgradeBanner(true);
                  } else {
                    setShowAddMemberModal(true);
                  }
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <FaUserPlus /> Adicionar Membro
              </button>
            </div>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <FaUser className="text-white" />
                </div>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-600 uppercase">Total de Membros</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalMembros}</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <FaCheckCircle className="text-white" />
                </div>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-600 uppercase">Ativos</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{membrosAtivos}</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <FaTimesCircle className="text-white" />
                </div>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-600 uppercase">Inativos</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{membrosInativos}</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <FaCalendarAlt className="text-white" />
                </div>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-600 uppercase">Novos Este Mês</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{novosEsteMes}</p>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-800">
            <div className="flex flex-wrap items-center gap-3">
              {/* Busca */}
              <div className="relative flex-1 min-w-[250px]">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Buscar por nome, email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  aria-label="Buscar membro da equipe por nome, email ou telefone"
                />
              </div>

              {/* Filtro Cargo */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(showFilterDropdown === 'role' ? null : 'role')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  <FaBriefcase className="text-xs" />
                  Cargo
                  <FaChevronDown className="text-xs" />
                </button>
                {showFilterDropdown === 'role' && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(null)} />
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
                      <button
                        onClick={() => { setFilterRole('todos'); setShowFilterDropdown(null); }}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${filterRole === 'todos' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      >
                        Todos
                      </button>
                      {cargos.map(cargo => (
                        <button
                          key={cargo.id}
                          onClick={() => { setFilterRole(cargo.id); setShowFilterDropdown(null); }}
                          className={`w-full px-4 py-2 text-left text-sm transition-colors ${filterRole === cargo.id ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                          {cargo.nome}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Filtro Status */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(showFilterDropdown === 'status' ? null : 'status')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  <FaFilter className="text-xs" />
                  Status
                  <FaChevronDown className="text-xs" />
                </button>
                {showFilterDropdown === 'status' && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(null)} />
                    <div className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
                      <button
                        onClick={() => { setFilterStatus('todos'); setShowFilterDropdown(null); }}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${filterStatus === 'todos' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      >
                        Todos
                      </button>
                      <button
                        onClick={() => { setFilterStatus('ativo'); setShowFilterDropdown(null); }}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${filterStatus === 'ativo' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      >
                        Ativos
                      </button>
                      <button
                        onClick={() => { setFilterStatus('inativo'); setShowFilterDropdown(null); }}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${filterStatus === 'inativo' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      >
                        Inativos
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Filtro Departamento */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(showFilterDropdown === 'department' ? null : 'department')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  <FaBuilding className="text-xs" />
                  Departamento
                  <FaChevronDown className="text-xs" />
                </button>
                {showFilterDropdown === 'department' && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(null)} />
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden max-h-64 overflow-y-auto">
                      <button
                        onClick={() => { setFilterDepartment('todos'); setShowFilterDropdown(null); }}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${filterDepartment === 'todos' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      >
                        Todos
                      </button>
                      {departamentos.map(dept => (
                        <button
                          key={dept}
                          onClick={() => { setFilterDepartment(dept); setShowFilterDropdown(null); }}
                          className={`w-full px-4 py-2 text-left text-sm transition-colors ${filterDepartment === dept ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Botão de Ordenação */}
              <button
                onClick={toggleSortOrder}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title={sortOrder === 'desc' ? 'Mais recentes primeiro' : 'Mais antigos primeiro'}
              >
                {sortOrder === 'desc' ? (
                  <FaSortAmountDown className="text-gray-600 dark:text-gray-600" />
                ) : (
                  <FaSortAmountUp className="text-gray-600 dark:text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Membros - Grid ou Lista */}
        <div className={viewMode === 'grid'
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          {sortedMembers.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <FaUser className="text-4xl text-gray-600" />
              </div>
              <p className="text-lg font-semibold text-gray-600 dark:text-gray-600">Nenhum membro encontrado</p>
              <p className="text-sm text-gray-600 dark:text-gray-600 mt-2">Tente ajustar os filtros ou a busca</p>
            </div>
          ) : (
            sortedMembers.map((member) => {
              const cargoInfo = getCargoInfo(member.cargo);

              // Versão Lista
              if (viewMode === 'list') {
                return (
                  <div
                    key={member.id}
                    onClick={() => handleSelectMember(member)}
                    className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-800 p-4 hover:border-purple-400 dark:hover:border-purple-500 transition-all cursor-pointer hover:shadow-lg group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                          {member.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${
                          member.status === 'ativo' ? 'bg-emerald-500' : 'bg-red-500'
                        }`} />
                      </div>

                      {/* Info Principal */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-base font-bold text-gray-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {member.nome}
                          </h3>
                          <div className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${cargoInfo.color}`}>
                            {cargoInfo.icon}
                            {cargoInfo.nome}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-600">
                          <span className="flex items-center gap-1">
                            <FaEnvelope className="text-xs" />
                            {member.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaPhone className="text-xs" />
                            {member.telefone}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaBuilding className="text-xs" />
                            {member.departamento}
                          </span>
                        </div>
                      </div>

                      {/* Estatísticas Compactas */}
                      <div className="flex items-center gap-6 text-center shrink-0">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-600 mb-0.5">Atendimentos</p>
                          <p className="text-base font-bold text-purple-600 dark:text-purple-400">
                            {member.estatisticas.atendimentos}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-600 mb-0.5">Tempo Resposta</p>
                          <p className="text-base font-bold text-amber-600 dark:text-amber-400">
                            {member.estatisticas.tempoMedioResposta}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-600 mb-0.5">Satisfação</p>
                          <div className="flex items-center justify-center gap-1">
                            <FaStar className="text-amber-500 text-sm" />
                            <p className="text-base font-bold text-gray-900 dark:text-white">
                              {member.estatisticas.satisfacao}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="shrink-0">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                          member.status === 'ativo'
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        }`}>
                          {member.status === 'ativo' ? <FaCheckCircle /> : <FaTimesCircle />}
                          {member.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }

              // Versão Grid (original)
              return (
                <div
                  key={member.id}
                  onClick={() => handleSelectMember(member)}
                  className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-6 hover:border-purple-400 dark:hover:border-purple-500 transition-all cursor-pointer hover:shadow-xl group"
                >
                  {/* Avatar e Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                        {member.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-900 ${
                        member.status === 'ativo' ? 'bg-emerald-500' : 'bg-red-500'
                      }`} />
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${cargoInfo.color}`}>
                      {cargoInfo.icon}
                      {cargoInfo.nome}
                    </div>
                  </div>

                  {/* Nome e Email */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {member.nome}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-600 mb-1 truncate flex items-center gap-1">
                    <FaEnvelope className="text-xs" />
                    {member.email}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-600 mb-3 flex items-center gap-1">
                    <FaPhone className="text-xs" />
                    {member.telefone}
                  </p>

                  {/* Departamento */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                    <FaBuilding className="text-xs text-gray-600" />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {member.departamento}
                    </span>
                  </div>

                  {/* Estatísticas */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 dark:text-gray-600 mb-1">Atendimentos</p>
                      <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {member.estatisticas.atendimentos}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 dark:text-gray-600 mb-1">Tempo Resp.</p>
                      <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                        {member.estatisticas.tempoMedioResposta}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 dark:text-gray-600 mb-1">Satisfação</p>
                      <div className="flex items-center justify-center gap-1">
                        <FaStar className="text-amber-500" />
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {member.estatisticas.satisfacao}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                      member.status === 'ativo'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {member.status === 'ativo' ? <FaCheckCircle /> : <FaTimesCircle />}
                      {member.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal de Detalhes do Membro */}
      {showMemberModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Detalhes do Membro
                </h2>
                <div className="flex items-center gap-2">
                  {!editingMember && (
                    <button
                      onClick={() => handleStartEdit(selectedMember)}
                      className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <FaEdit className="text-purple-600 dark:text-purple-400" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteMember(selectedMember.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title="Remover"
                  >
                    <FaTrash className="text-red-600 dark:text-red-400" />
                  </button>
                  <button
                    onClick={() => {
                      setShowMemberModal(false);
                      setActiveTab('info');
                      setEditingMember(null);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-gray-600 dark:text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 -mb-6 pb-0">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`px-4 py-2 font-semibold transition-all border-b-2 ${
                    activeTab === 'info'
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-600 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Informações
                </button>
                <button
                  onClick={() => setActiveTab('permissions')}
                  className={`px-4 py-2 font-semibold transition-all border-b-2 ${
                    activeTab === 'permissions'
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-600 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Permissões
                </button>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`px-4 py-2 font-semibold transition-all border-b-2 ${
                    activeTab === 'schedule'
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-600 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Carga Horária
                </button>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6 space-y-6">
              {/* TAB: INFORMAÇÕES */}
              {activeTab === 'info' && (
                <>
                  {editingMember ? (
                    /* MODO EDIÇÃO */
                    <>
                      <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        value={editingMember.nome}
                        onChange={(e) => setEditingMember({ ...editingMember, nome: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={editingMember.email}
                        onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Telefone
                      </label>
                      <input
                        type="text"
                        value={editingMember.telefone}
                        onChange={(e) => setEditingMember({ ...editingMember, telefone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Documento (CPF)
                      </label>
                      <input
                        type="text"
                        value={editingMember.documento}
                        onChange={(e) => setEditingMember({ ...editingMember, documento: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Cargo
                      </label>
                      <select
                        value={editingMember.cargo}
                        onChange={(e) => setEditingMember({ ...editingMember, cargo: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {cargos.map(cargo => (
                          <option key={cargo.id} value={cargo.id}>{cargo.nome}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Departamento
                      </label>
                      <select
                        value={editingMember.departamento}
                        onChange={(e) => setEditingMember({ ...editingMember, departamento: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {departamentos.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Salvar Alterações
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                    </>
                  ) : (
                    /* MODO VISUALIZAÇÃO */
                    <>
                  {/* Avatar e Informações Básicas */}
                  <div className="flex items-start gap-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                        {selectedMember.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white dark:border-gray-900 ${
                        selectedMember.status === 'ativo' ? 'bg-emerald-500' : 'bg-red-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {selectedMember.nome}
                      </h3>
                      <div className="flex items-center gap-4 mb-3">
                        <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${getCargoInfo(selectedMember.cargo).color}`}>
                          {getCargoInfo(selectedMember.cargo).icon}
                          {getCargoInfo(selectedMember.cargo).nome}
                        </div>
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${
                          selectedMember.status === 'ativo'
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>
                          {selectedMember.status === 'ativo' ? <FaCheckCircle /> : <FaTimesCircle />}
                          {selectedMember.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2 text-gray-600 dark:text-gray-600">
                          <FaEnvelope className="text-purple-600 dark:text-purple-400" />
                          {selectedMember.email}
                        </p>
                        <p className="flex items-center gap-2 text-gray-600 dark:text-gray-600">
                          <FaPhone className="text-purple-600 dark:text-purple-400" />
                          {selectedMember.telefone}
                        </p>
                        <p className="flex items-center gap-2 text-gray-600 dark:text-gray-600">
                          <FaIdCard className="text-purple-600 dark:text-purple-400" />
                          {selectedMember.documento}
                        </p>
                        <p className="flex items-center gap-2 text-gray-600 dark:text-gray-600">
                          <FaBuilding className="text-purple-600 dark:text-purple-400" />
                          {selectedMember.departamento}
                        </p>
                        <p className="flex items-center gap-2 text-gray-600 dark:text-gray-600">
                          <FaCalendarAlt className="text-purple-600 dark:text-purple-400" />
                          Entrou em {new Date(selectedMember.dataEntrada).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Estatísticas Detalhadas */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      Estatísticas de Performance
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
                        <FaComments className="text-2xl text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          {selectedMember.estatisticas.atendimentos}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-600 font-semibold">Atendimentos</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
                        <FaClock className="text-2xl text-amber-600 dark:text-amber-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          {selectedMember.estatisticas.tempoMedioResposta}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-600 font-semibold">Tempo Resposta</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
                        <FaStar className="text-2xl text-amber-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          {selectedMember.estatisticas.satisfacao}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-600 font-semibold">Satisfação</p>
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                    <button
                      onClick={() => handleToggleStatus(selectedMember.id)}
                      className={`w-full px-6 py-3 rounded-xl font-semibold transition-all ${
                        selectedMember.status === 'ativo'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                          : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                      }`}
                    >
                      {selectedMember.status === 'ativo' ? 'Desativar Membro' : 'Ativar Membro'}
                    </button>
                  </div>
                    </>
                  )}
                </>
              )}

              {/* TAB: PERMISSÕES GRANULARES */}
              {activeTab === 'permissions' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <FaShieldAlt className="text-purple-600 dark:text-purple-400" />
                      Permissões Granulares
                    </h3>
                    {!editingMember && (
                      <button
                        onClick={() => handleStartEdit(selectedMember)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all text-sm"
                      >
                        Editar Permissões
                      </button>
                    )}
                  </div>

                  {Object.entries(permissoesGranulares).map(([modulo, config]) => {
                    const memberData = editingMember || selectedMember;
                    const permissoesAtuais = memberData.permissoesGranulares || [];

                    return (
                      <div key={modulo} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg text-purple-600 dark:text-purple-400">{config.icon}</span>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">{config.nome}</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {config.permissoes.map(perm => {
                            const hasPermission = permissoesAtuais.includes(perm.id);
                            return (
                              <label
                                key={perm.id}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                                  editingMember
                                    ? 'hover:bg-purple-100 dark:hover:bg-purple-900/30'
                                    : ''
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={hasPermission}
                                  onChange={() => editingMember && handleTogglePermissaoGranular(perm.id)}
                                  disabled={!editingMember}
                                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer disabled:cursor-default"
                                />
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                  {perm.nome}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {editingMember && (
                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        Salvar Permissões
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: CARGA HORÁRIA */}
              {activeTab === 'schedule' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <FaClock className="text-purple-600 dark:text-purple-400" />
                      Carga Horária
                    </h3>
                    {!editingMember && (
                      <button
                        onClick={() => handleStartEdit(selectedMember)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all text-sm"
                      >
                        Editar Horários
                      </button>
                    )}
                  </div>

                  {/* Dias da semana */}
                  <div className="flex gap-2 justify-center mb-6">
                    {diasSemana.map(dia => {
                      const memberData = editingMember || selectedMember;
                      const cargaHoraria = memberData.cargaHoraria || {};
                      const horariosDia = cargaHoraria[dia.id] || [];
                      const isAtivo = horariosDia.length > 0;

                      return (
                        <button
                          key={dia.id}
                          onClick={() => editingMember && handleToggleDiaSemana(dia.id)}
                          disabled={!editingMember}
                          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                            isAtivo
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-600'
                          } ${editingMember ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                        >
                          {dia.nome}
                        </button>
                      );
                    })}
                  </div>

                  {/* Horários detalhados */}
                  <div className="space-y-4">
                    {diasSemana.map(dia => {
                      const memberData = editingMember || selectedMember;
                      const cargaHoraria = memberData.cargaHoraria || {};
                      const horariosDia = cargaHoraria[dia.id] || [];

                      if (horariosDia.length === 0) return null;

                      return (
                        <div key={dia.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                          <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                            {dia.nome}
                          </h4>
                          <div className="space-y-2">
                            {horariosDia.map((horario, index) => (
                              <div key={index} className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-gray-600 dark:text-gray-600 w-20">
                                  Horário {index + 1}:
                                </span>
                                <input
                                  type="time"
                                  value={horario.inicio}
                                  onChange={(e) => editingMember && handleUpdateHorario(dia.id, index, 'inicio', e.target.value)}
                                  disabled={!editingMember}
                                  className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                                />
                                <span className="text-gray-600 dark:text-gray-600 font-semibold">até</span>
                                <input
                                  type="time"
                                  value={horario.fim}
                                  onChange={(e) => editingMember && handleUpdateHorario(dia.id, index, 'fim', e.target.value)}
                                  disabled={!editingMember}
                                  className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                                />
                                {editingMember && (
                                  <button
                                    onClick={() => handleRemoveHorario(dia.id, index)}
                                    className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                    title="Remover horário"
                                  >
                                    <FaTimes />
                                  </button>
                                )}
                              </div>
                            ))}
                            {editingMember && horariosDia.length < 3 && (
                              <button
                                onClick={() => handleAddHorario(dia.id)}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                              >
                                <FaPlus className="text-xs" />
                                Adicionar horário
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Opções especiais */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3">Regras Especiais</h4>

                    {/* Dia sim dia não - Global */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(editingMember || selectedMember).cargaHoraria?.diaSimDiaNao || false}
                        onChange={handleToggleDiaSimDiaNao}
                        disabled={!editingMember}
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer disabled:cursor-default"
                      />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Dia sim, dia não (global)
                      </span>
                    </label>

                    {/* Semana sim semana não */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(editingMember || selectedMember).cargaHoraria?.semanaSimSemanaNao || false}
                        onChange={handleToggleSemanaNao}
                        disabled={!editingMember}
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer disabled:cursor-default"
                      />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Semana sim, semana não
                      </span>
                    </label>

                    {/* Toggle por dia específico */}
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-bold text-gray-600 dark:text-gray-600 uppercase mb-3">Alternância por Dia</p>
                      <div className="grid grid-cols-2 gap-2">
                        {diasSemana.map(dia => {
                          const memberData = editingMember || selectedMember;
                          const cargaHoraria = memberData.cargaHoraria || {};
                          const campoAlternado = dia.id === 'sabado' || dia.id === 'domingo'
                            ? `${dia.id}Alternado`
                            : `${dia.id}Alternada`;
                          const isAlternado = cargaHoraria[campoAlternado] || false;

                          return (
                            <label key={dia.id} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isAlternado}
                                onChange={() => editingMember && handleToggleDiaAlternado(dia.id)}
                                disabled={!editingMember}
                                className="w-3.5 h-3.5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer disabled:cursor-default"
                              />
                              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                {dia.nome} sim/{dia.nome} não
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {editingMember && (
                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        Salvar Carga Horária
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Gerenciar Departamentos/Setores */}
      {showDepartmentsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FaBuilding className="text-purple-600 dark:text-purple-400" />
                    Gerenciar Setores/Departamentos
                  </h2>
                  <button
                    onClick={() => setShowCreateDepartmentModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2 text-sm"
                  >
                    <FaPlus /> Criar Novo
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowDepartmentsModal(false);
                    setNewDepartmentName('');
                    setNewDepartmentColor('text-gray-600 dark:text-gray-600');
                    setNewDepartmentIcon('FaBuilding');
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-600" />
                </button>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6 space-y-6">
              {/* Lista de Departamentos */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Departamentos Existentes
                </h3>

                {/* Departamentos Padrão */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-600 uppercase mb-2">Departamentos Padrão</p>
                  <div className="space-y-2">
                    {departamentosPadrao.map((dept) => (
                      <div
                        key={dept.id}
                        className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center ${dept.color}`}>
                            {dept.icon}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                              {dept.nome}
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-600">
                              {(permissoesPorDepartamento[dept.id] || []).length} permissões
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenPermissoesDepartamento(dept)}
                            className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors group"
                            title="Configurar permissões"
                          >
                            <FaShieldAlt className="text-purple-600 dark:text-purple-400 text-sm" />
                          </button>
                          <button
                            onClick={() => handleDeleteDepartment(dept.id, true)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
                            title="Excluir departamento"
                          >
                            <FaTrash className="text-red-600 dark:text-red-400 text-sm" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Departamentos Customizados */}
                {customDepartments.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-600 uppercase mb-2">Personalizados</p>
                    <div className="space-y-2">
                      {customDepartments.map((dept) => (
                        <div
                          key={dept.id}
                          className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center ${dept.color?.startsWith('#') ? '' : dept.color}`}
                              style={dept.color?.startsWith('#') ? { color: dept.color } : {}}
                            >
                              {dept.icon}
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                                {dept.nome}
                              </span>
                              <span className="text-xs text-gray-600 dark:text-gray-600">
                                {(permissoesPorDepartamento[dept.id] || []).length} permissões
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenPermissoesDepartamento(dept)}
                              className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors group"
                              title="Configurar permissões"
                            >
                              <FaShieldAlt className="text-purple-600 dark:text-purple-400 text-sm" />
                            </button>
                            <button
                              onClick={() => handleDeleteDepartment(dept.id)}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
                              title="Excluir departamento"
                            >
                              <FaTrash className="text-red-600 dark:text-red-400 text-sm" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {customDepartments.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <FaBuilding className="text-2xl text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-600">
                      Nenhum departamento personalizado ainda
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-600 mt-1">
                      Adicione novos setores conforme necessário
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => {
                    setShowDepartmentsModal(false);
                    setNewDepartmentName('');
                    setNewDepartmentColor('text-gray-600 dark:text-gray-600');
                    setNewDepartmentIcon('FaBuilding');
                  }}
                  className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gerenciar Cargos */}
      {showCargosModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FaBriefcase className="text-purple-600 dark:text-purple-400" />
                    Gerenciar Cargos
                  </h2>
                  <button
                    onClick={() => setShowCreateCargoModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2 text-sm"
                  >
                    <FaPlus /> Criar Novo
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowCargosModal(false);
                    setNewCargoNome('');
                    setNewCargoColor('text-gray-600 dark:text-gray-600');
                    setNewCargoIcon('FaBriefcase');
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-600" />
                </button>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6 space-y-6">
              {/* Lista de Cargos */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Cargos Existentes
                </h3>

                {/* Cargos Padrão */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-600 uppercase mb-2">Cargos Padrão</p>
                  <div className="space-y-2">
                    {cargosPadrao.map((cargo) => (
                      <div
                        key={cargo.id}
                        className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center ${cargo.color}`}>
                            {cargo.icon}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                              {cargo.nome}
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-600">
                              {(permissoesPorCargo[cargo.id] || []).length} permissões
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenPermissoesCargo(cargo)}
                            className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors group"
                            title="Configurar permissões"
                          >
                            <FaShieldAlt className="text-purple-600 dark:text-purple-400 text-sm" />
                          </button>
                          {cargo.id === 'dono' ? (
                            <span className="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 px-2">
                              <FaCrown className="text-xs" /> Protegido
                            </span>
                          ) : (
                            <button
                              onClick={() => handleDeleteCargo(cargo.id, true)}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
                              title="Excluir cargo"
                            >
                              <FaTrash className="text-red-600 dark:text-red-400 text-sm" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cargos Customizados */}
                {customCargos.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-600 uppercase mb-2">Personalizados</p>
                    <div className="space-y-2">
                      {customCargos.map((cargo) => (
                        <div
                          key={cargo.id}
                          className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center ${cargo.color?.startsWith('#') ? '' : cargo.color}`}
                              style={cargo.color?.startsWith('#') ? { color: cargo.color } : {}}
                            >
                              {cargo.icon}
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                                {cargo.nome}
                              </span>
                              <span className="text-xs text-gray-600 dark:text-gray-600">
                                {(permissoesPorCargo[cargo.id] || []).length} permissões
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenPermissoesCargo(cargo)}
                              className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors group"
                              title="Configurar permissões"
                            >
                              <FaShieldAlt className="text-purple-600 dark:text-purple-400 text-sm" />
                            </button>
                            <button
                              onClick={() => handleDeleteCargo(cargo.id)}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
                              title="Excluir cargo"
                            >
                              <FaTrash className="text-red-600 dark:text-red-400 text-sm" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {customCargos.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <FaBriefcase className="text-2xl text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-600">
                      Nenhum cargo personalizado ainda
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-600 mt-1">
                      Adicione novos cargos conforme necessário
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => {
                    setShowCargosModal(false);
                    setNewCargoNome('');
                    setNewCargoColor('text-gray-600 dark:text-gray-600');
                    setNewCargoIcon('FaBriefcase');
                  }}
                  className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drawer de Ícones - Cargo */}
      {showIconDrawerCargo && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaStar className="text-blue-600" />
                  Escolher Ícone
                </h3>
                <button
                  onClick={() => setShowIconDrawerCargo(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-5 gap-3">
                {Object.keys(iconMap).map((iconName) => (
                  <button
                    key={iconName}
                    onClick={() => {
                      setNewCargoComplete({ ...newCargoComplete, icone: iconName });
                      setShowIconDrawerCargo(false);
                    }}
                    className={`p-4 rounded-xl text-2xl transition-all border-2 hover:scale-110 ${
                      newCargoComplete.icone === iconName
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 shadow-lg'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-600 hover:border-blue-300'
                    }`}
                  >
                    {iconMap[iconName]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drawer de Cores - Cargo */}
      {showColorDrawerCargo && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaStar className="text-blue-600" />
                  Escolher Cor
                </h3>
                <button
                  onClick={() => setShowColorDrawerCargo(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Cor Personalizada */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 border-2 border-blue-200 dark:border-gray-700">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FaStar className="text-blue-600" />
                    Cor Personalizada
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Color Picker */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Paleta de Cores
                      </label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          value={customColorCargo}
                          onChange={(e) => {
                            setCustomColorCargo(e.target.value);
                            setCustomHexCargo(e.target.value);
                          }}
                          className="w-20 h-20 rounded-xl border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-gray-600 dark:text-gray-600 mb-1">
                            Cor Selecionada
                          </div>
                          <div
                            className="w-full h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                            style={{ backgroundColor: customColorCargo }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Input Hexadecimal */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Código Hexadecimal
                      </label>
                      <input
                        type="text"
                        value={customHexCargo}
                        onChange={(e) => {
                          const hex = e.target.value;
                          setCustomHexCargo(hex);
                          if (/^#[0-9A-F]{6}$/i.test(hex)) {
                            setCustomColorCargo(hex);
                          }
                        }}
                        placeholder="#000000"
                        maxLength={7}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-lg font-mono text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                      />
                      <button
                        onClick={() => {
                          if (/^#[0-9A-F]{6}$/i.test(customHexCargo)) {
                            setNewCargoComplete({ ...newCargoComplete, cor: customHexCargo });
                            setShowColorDrawerCargo(false);
                          } else {
                            toast.error('Por favor, insira um código hexadecimal válido (ex: #FF5733)');
                          }
                        }}
                        className="w-full mt-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        Aplicar Cor Personalizada
                      </button>
                    </div>
                  </div>
                </div>

                {/* Divisor */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-600">OU ESCOLHA UMA COR PREDEFINIDA</span>
                  <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
                </div>

                {/* Cores Slate/Gray/Zinc */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Neutros</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      { label: 'Slate', value: 'text-slate-600 dark:text-slate-400' },
                      { label: 'Gray', value: 'text-gray-600 dark:text-gray-600' },
                      { label: 'Zinc', value: 'text-zinc-600 dark:text-zinc-400' },
                      { label: 'Neutral', value: 'text-neutral-600 dark:text-neutral-400' },
                      { label: 'Stone', value: 'text-stone-600 dark:text-stone-400' },
                    ].map((color) => (
                      <button
                        key={color.value}
                        onClick={() => {
                          setNewCargoComplete({ ...newCargoComplete, cor: color.value });
                          setShowColorDrawerCargo(false);
                        }}
                        className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all border-2 hover:scale-105 ${
                          newCargoComplete.cor === color.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-700'
                        } ${color.value}`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <FaStar className="text-xl" />
                          <span className="text-xs">{color.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cores Quentes */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Cores Quentes</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      { label: 'Red', value: 'text-red-600 dark:text-red-400' },
                      { label: 'Orange', value: 'text-orange-600 dark:text-orange-400' },
                      { label: 'Amber', value: 'text-amber-600 dark:text-amber-400' },
                      { label: 'Yellow', value: 'text-yellow-600 dark:text-yellow-400' },
                      { label: 'Lime', value: 'text-lime-600 dark:text-lime-400' },
                    ].map((color) => (
                      <button
                        key={color.value}
                        onClick={() => {
                          setNewCargoComplete({ ...newCargoComplete, cor: color.value });
                          setShowColorDrawerCargo(false);
                        }}
                        className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all border-2 hover:scale-105 ${
                          newCargoComplete.cor === color.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-700'
                        } ${color.value}`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <FaStar className="text-xl" />
                          <span className="text-xs">{color.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cores Frias - Verdes */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Verdes</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      { label: 'Green', value: 'text-green-600 dark:text-green-400' },
                      { label: 'Emerald', value: 'text-emerald-600 dark:text-emerald-400' },
                      { label: 'Teal', value: 'text-teal-600 dark:text-teal-400' },
                    ].map((color) => (
                      <button
                        key={color.value}
                        onClick={() => {
                          setNewCargoComplete({ ...newCargoComplete, cor: color.value });
                          setShowColorDrawerCargo(false);
                        }}
                        className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all border-2 hover:scale-105 ${
                          newCargoComplete.cor === color.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-700'
                        } ${color.value}`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <FaStar className="text-xl" />
                          <span className="text-xs">{color.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cores Frias - Azuis */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Azuis</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      { label: 'Cyan', value: 'text-cyan-600 dark:text-cyan-400' },
                      { label: 'Sky', value: 'text-sky-600 dark:text-sky-400' },
                      { label: 'Blue', value: 'text-blue-600 dark:text-blue-400' },
                      { label: 'Indigo', value: 'text-indigo-600 dark:text-indigo-400' },
                    ].map((color) => (
                      <button
                        key={color.value}
                        onClick={() => {
                          setNewCargoComplete({ ...newCargoComplete, cor: color.value });
                          setShowColorDrawerCargo(false);
                        }}
                        className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all border-2 hover:scale-105 ${
                          newCargoComplete.cor === color.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-700'
                        } ${color.value}`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <FaStar className="text-xl" />
                          <span className="text-xs">{color.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cores Roxas e Rosas */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Roxos e Rosas</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      { label: 'Violet', value: 'text-violet-600 dark:text-violet-400' },
                      { label: 'Purple', value: 'text-purple-600 dark:text-purple-400' },
                      { label: 'Fuchsia', value: 'text-fuchsia-600 dark:text-fuchsia-400' },
                      { label: 'Pink', value: 'text-pink-600 dark:text-pink-400' },
                      { label: 'Indigo', value: 'text-indigo-600 dark:text-indigo-400' },
                    ].map((color) => (
                      <button
                        key={color.value}
                        onClick={() => {
                          setNewCargoComplete({ ...newCargoComplete, cor: color.value });
                          setShowColorDrawerCargo(false);
                        }}
                        className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all border-2 hover:scale-105 ${
                          newCargoComplete.cor === color.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-700'
                        } ${color.value}`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <FaStar className="text-xl" />
                          <span className="text-xs">{color.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drawer de Ícones - Setor */}
      {showIconDrawerDept && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaStar className="text-emerald-600" />
                  Escolher Ícone
                </h3>
                <button
                  onClick={() => setShowIconDrawerDept(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-5 gap-3">
                {Object.keys(iconMap).map((iconName) => (
                  <button
                    key={iconName}
                    onClick={() => {
                      setNewDeptComplete({ ...newDeptComplete, icone: iconName });
                      setShowIconDrawerDept(false);
                    }}
                    className={`p-4 rounded-xl text-2xl transition-all border-2 hover:scale-110 ${
                      newDeptComplete.icone === iconName
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 shadow-lg'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-600 hover:border-emerald-300'
                    }`}
                  >
                    {iconMap[iconName]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drawer de Cores - Setor */}
      {showColorDrawerDept && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaStar className="text-emerald-600" />
                  Escolher Cor
                </h3>
                <button
                  onClick={() => setShowColorDrawerDept(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Cor Personalizada */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 border-2 border-emerald-200 dark:border-gray-700">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FaStar className="text-emerald-600" />
                    Cor Personalizada
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Color Picker */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Paleta de Cores
                      </label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          value={customColorDept}
                          onChange={(e) => {
                            setCustomColorDept(e.target.value);
                            setCustomHexDept(e.target.value);
                          }}
                          className="w-20 h-20 rounded-xl border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-gray-600 dark:text-gray-600 mb-1">
                            Cor Selecionada
                          </div>
                          <div
                            className="w-full h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                            style={{ backgroundColor: customColorDept }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Input Hexadecimal */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Código Hexadecimal
                      </label>
                      <input
                        type="text"
                        value={customHexDept}
                        onChange={(e) => {
                          const hex = e.target.value;
                          setCustomHexDept(hex);
                          if (/^#[0-9A-F]{6}$/i.test(hex)) {
                            setCustomColorDept(hex);
                          }
                        }}
                        placeholder="#000000"
                        maxLength={7}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-lg font-mono text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
                      />
                      <button
                        onClick={() => {
                          if (/^#[0-9A-F]{6}$/i.test(customHexDept)) {
                            setNewDeptComplete({ ...newDeptComplete, cor: customHexDept });
                            setShowColorDrawerDept(false);
                          } else {
                            toast.error('Por favor, insira um código hexadecimal válido (ex: #FF5733)');
                          }
                        }}
                        className="w-full mt-3 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        Aplicar Cor Personalizada
                      </button>
                    </div>
                  </div>
                </div>

                {/* Divisor */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-600">OU ESCOLHA UMA COR PREDEFINIDA</span>
                  <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
                </div>

                {/* Cores Slate/Gray/Zinc */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Neutros</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      { label: 'Slate', value: 'text-slate-600 dark:text-slate-400' },
                      { label: 'Gray', value: 'text-gray-600 dark:text-gray-600' },
                      { label: 'Zinc', value: 'text-zinc-600 dark:text-zinc-400' },
                      { label: 'Neutral', value: 'text-neutral-600 dark:text-neutral-400' },
                      { label: 'Stone', value: 'text-stone-600 dark:text-stone-400' },
                    ].map((color) => (
                      <button
                        key={color.value}
                        onClick={() => {
                          setNewDeptComplete({ ...newDeptComplete, cor: color.value });
                          setShowColorDrawerDept(false);
                        }}
                        className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all border-2 hover:scale-105 ${
                          newDeptComplete.cor === color.value
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-700'
                        } ${color.value}`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <FaStar className="text-xl" />
                          <span className="text-xs">{color.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cores Quentes */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Cores Quentes</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      { label: 'Red', value: 'text-red-600 dark:text-red-400' },
                      { label: 'Orange', value: 'text-orange-600 dark:text-orange-400' },
                      { label: 'Amber', value: 'text-amber-600 dark:text-amber-400' },
                      { label: 'Yellow', value: 'text-yellow-600 dark:text-yellow-400' },
                      { label: 'Lime', value: 'text-lime-600 dark:text-lime-400' },
                    ].map((color) => (
                      <button
                        key={color.value}
                        onClick={() => {
                          setNewDeptComplete({ ...newDeptComplete, cor: color.value });
                          setShowColorDrawerDept(false);
                        }}
                        className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all border-2 hover:scale-105 ${
                          newDeptComplete.cor === color.value
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-700'
                        } ${color.value}`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <FaStar className="text-xl" />
                          <span className="text-xs">{color.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cores Frias - Verdes */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Verdes</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      { label: 'Green', value: 'text-green-600 dark:text-green-400' },
                      { label: 'Emerald', value: 'text-emerald-600 dark:text-emerald-400' },
                      { label: 'Teal', value: 'text-teal-600 dark:text-teal-400' },
                    ].map((color) => (
                      <button
                        key={color.value}
                        onClick={() => {
                          setNewDeptComplete({ ...newDeptComplete, cor: color.value });
                          setShowColorDrawerDept(false);
                        }}
                        className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all border-2 hover:scale-105 ${
                          newDeptComplete.cor === color.value
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-700'
                        } ${color.value}`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <FaStar className="text-xl" />
                          <span className="text-xs">{color.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cores Frias - Azuis */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Azuis</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      { label: 'Cyan', value: 'text-cyan-600 dark:text-cyan-400' },
                      { label: 'Sky', value: 'text-sky-600 dark:text-sky-400' },
                      { label: 'Blue', value: 'text-blue-600 dark:text-blue-400' },
                      { label: 'Indigo', value: 'text-indigo-600 dark:text-indigo-400' },
                    ].map((color) => (
                      <button
                        key={color.value}
                        onClick={() => {
                          setNewDeptComplete({ ...newDeptComplete, cor: color.value });
                          setShowColorDrawerDept(false);
                        }}
                        className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all border-2 hover:scale-105 ${
                          newDeptComplete.cor === color.value
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-700'
                        } ${color.value}`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <FaStar className="text-xl" />
                          <span className="text-xs">{color.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cores Roxas e Rosas */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Roxos e Rosas</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      { label: 'Violet', value: 'text-violet-600 dark:text-violet-400' },
                      { label: 'Purple', value: 'text-purple-600 dark:text-purple-400' },
                      { label: 'Fuchsia', value: 'text-fuchsia-600 dark:text-fuchsia-400' },
                      { label: 'Pink', value: 'text-pink-600 dark:text-pink-400' },
                      { label: 'Indigo', value: 'text-indigo-600 dark:text-indigo-400' },
                    ].map((color) => (
                      <button
                        key={color.value}
                        onClick={() => {
                          setNewDeptComplete({ ...newDeptComplete, cor: color.value });
                          setShowColorDrawerDept(false);
                        }}
                        className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all border-2 hover:scale-105 ${
                          newDeptComplete.cor === color.value
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-700'
                        } ${color.value}`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <FaStar className="text-xl" />
                          <span className="text-xs">{color.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Configurar Permissões por Cargo */}
      {showPermissoesCargoModal && cargoEditandoPermissoes && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center ${cargoEditandoPermissoes.color}`}>
                    {cargoEditandoPermissoes.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Permissões: {cargoEditandoPermissoes.nome}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-600">
                      Configure o que este cargo pode visualizar e fazer na plataforma
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowPermissoesCargoModal(false);
                    setCargoEditandoPermissoes(null);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-600" />
                </button>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6">
              <div className="space-y-4">
                {Object.entries(permissoesGranulares).map(([moduloKey, modulo]) => {
                  const permissoesModulo = modulo.permissoes.map(p => p.id);
                  const permissoesAtuais = permissoesPorCargo[cargoEditandoPermissoes.id] || [];
                  const todasMarcadas = permissoesModulo.every(p => permissoesAtuais.includes(p));
                  const algumaMarcada = permissoesModulo.some(p => permissoesAtuais.includes(p));

                  return (
                    <div key={moduloKey} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      {/* Cabeçalho do Módulo */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            todasMarcadas ? 'bg-purple-600 text-white' : algumaMarcada ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-gray-200 dark:bg-gray-700 text-gray-600'
                          }`}>
                            {modulo.icon}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                              {modulo.nome}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-600">
                              {permissoesModulo.filter(p => permissoesAtuais.includes(p)).length} / {permissoesModulo.length} ativas
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggleModuloCargo(moduloKey)}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                            todasMarcadas
                              ? 'bg-purple-600 text-white hover:bg-purple-700'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-500 hover:text-white'
                          }`}
                        >
                          {todasMarcadas ? 'Desmarcar Todas' : 'Marcar Todas'}
                        </button>
                      </div>

                      {/* Permissões do Módulo */}
                      <div className="grid grid-cols-2 gap-2">
                        {modulo.permissoes.map((permissao) => {
                          const isAtiva = permissoesAtuais.includes(permissao.id);
                          return (
                            <button
                              key={permissao.id}
                              onClick={() => handleTogglePermissaoCargo(permissao.id)}
                              className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all ${
                                isAtiva
                                  ? 'bg-purple-600 text-white shadow-md'
                                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {isAtiva ? <FaCheckCircle className="text-xs" /> : <FaTimesCircle className="text-xs opacity-50" />}
                                {permissao.nome}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 flex gap-3">
                <button
                  onClick={() => {
                    setShowPermissoesCargoModal(false);
                    setCargoEditandoPermissoes(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Salvar Configurações
                </button>
                <button
                  onClick={() => {
                    setShowPermissoesCargoModal(false);
                    setCargoEditandoPermissoes(null);
                  }}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Configurar Permissões por Departamento */}
      {showPermissoesDepartamentoModal && departamentoEditandoPermissoes && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center ${departamentoEditandoPermissoes.color}`}>
                    {departamentoEditandoPermissoes.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Permissões: {departamentoEditandoPermissoes.nome}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-600">
                      Configure o que este departamento pode visualizar e fazer na plataforma
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowPermissoesDepartamentoModal(false);
                    setDepartamentoEditandoPermissoes(null);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-600" />
                </button>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6">
              <div className="space-y-4">
                {Object.entries(permissoesGranulares).map(([moduloKey, modulo]) => {
                  const permissoesModulo = modulo.permissoes.map(p => p.id);
                  const permissoesAtuais = permissoesPorDepartamento[departamentoEditandoPermissoes.id] || [];
                  const todasMarcadas = permissoesModulo.every(p => permissoesAtuais.includes(p));
                  const algumaMarcada = permissoesModulo.some(p => permissoesAtuais.includes(p));

                  return (
                    <div key={moduloKey} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      {/* Cabeçalho do Módulo */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            todasMarcadas ? 'bg-purple-600 text-white' : algumaMarcada ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-gray-200 dark:bg-gray-700 text-gray-600'
                          }`}>
                            {modulo.icon}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                              {modulo.nome}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-600">
                              {permissoesModulo.filter(p => permissoesAtuais.includes(p)).length} / {permissoesModulo.length} ativas
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggleModuloDepartamento(moduloKey)}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                            todasMarcadas
                              ? 'bg-purple-600 text-white hover:bg-purple-700'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-500 hover:text-white'
                          }`}
                        >
                          {todasMarcadas ? 'Desmarcar Todas' : 'Marcar Todas'}
                        </button>
                      </div>

                      {/* Permissões do Módulo */}
                      <div className="grid grid-cols-2 gap-2">
                        {modulo.permissoes.map((permissao) => {
                          const isAtiva = permissoesAtuais.includes(permissao.id);
                          return (
                            <button
                              key={permissao.id}
                              onClick={() => handleTogglePermissaoDepartamento(permissao.id)}
                              className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all ${
                                isAtiva
                                  ? 'bg-purple-600 text-white shadow-md'
                                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {isAtiva ? <FaCheckCircle className="text-xs" /> : <FaTimesCircle className="text-xs opacity-50" />}
                                {permissao.nome}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 flex gap-3">
                <button
                  onClick={() => {
                    setShowPermissoesDepartamentoModal(false);
                    setDepartamentoEditandoPermissoes(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Salvar Configurações
                </button>
                <button
                  onClick={() => {
                    setShowPermissoesDepartamentoModal(false);
                    setDepartamentoEditandoPermissoes(null);
                  }}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Criar Novo Cargo Completo */}
      {showCreateCargoModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaBriefcase className="text-blue-600" />
                  Criar Novo Cargo
                </h2>
                <button onClick={() => { setShowCreateCargoModal(false); setNewCargoComplete({ nome: '', cor: 'text-gray-600 dark:text-gray-600', icone: 'FaBriefcase', permissoes: [] }); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <FaTimes className="text-gray-600 dark:text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nome do Cargo *</label>
                    <input type="text" value={newCargoComplete.nome} onChange={(e) => setNewCargoComplete({ ...newCargoComplete, nome: e.target.value })} placeholder="Ex: Gerente de Vendas" className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Ícone</label>
                    <button
                      onClick={() => setShowIconDrawerCargo(true)}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl ${newCargoComplete.cor}`}>
                          {iconMap[newCargoComplete.icone]}
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {newCargoComplete.icone}
                        </span>
                      </div>
                      <FaChevronRight className="text-gray-600 group-hover:text-blue-500 transition-colors" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Cor</label>
                    <button
                      onClick={() => setShowColorDrawerCargo(true)}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${newCargoComplete.cor.startsWith('#') ? '' : newCargoComplete.cor}`}
                          style={newCargoComplete.cor.startsWith('#') ? { color: newCargoComplete.cor } : {}}
                        >
                          <FaStar />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {newCargoComplete.cor.startsWith('#') ? newCargoComplete.cor : 'Cor Selecionada'}
                        </span>
                      </div>
                      <FaChevronRight className="text-gray-600 group-hover:text-blue-500 transition-colors" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Permissões do Cargo</h3>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {Object.entries(permissoesGranulares).map(([moduloKey, modulo]) => {
                      const permissoesModulo = modulo.permissoes.map(p => p.id);
                      const todasMarcadas = permissoesModulo.every(p => newCargoComplete.permissoes.includes(p));
                      return (
                        <div key={moduloKey} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-sm ${todasMarcadas ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600'}`}>{modulo.icon}</div>
                              <span className="text-sm font-bold text-gray-900 dark:text-white">{modulo.nome}</span>
                            </div>
                            <button onClick={() => handleToggleModuloNewCargo(moduloKey)} className={`px-3 py-1 rounded-lg text-xs font-semibold ${todasMarcadas ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                              {todasMarcadas ? 'Desmarcar' : 'Marcar Todas'}
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            {modulo.permissoes.map((permissao) => {
                              const isAtiva = newCargoComplete.permissoes.includes(permissao.id);
                              return (
                                <button key={permissao.id} onClick={() => handleTogglePermissaoNewCargo(permissao.id)} className={`px-2 py-1.5 rounded-lg text-xs font-semibold text-left ${isAtiva ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
                                  {isAtiva ? <FaCheckCircle className="inline text-xs mr-1" /> : <FaTimesCircle className="inline text-xs mr-1 opacity-50" />}
                                  {permissao.nome}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button onClick={handleCreateCargoComplete} disabled={!newCargoComplete.nome.trim()} className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                  <FaPlus className="inline mr-2" /> Criar Cargo
                </button>
                <button onClick={() => { setShowCreateCargoModal(false); setNewCargoComplete({ nome: '', cor: 'text-gray-600 dark:text-gray-600', icone: 'FaBriefcase', permissoes: [] }); }} className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Criar Novo Setor Completo */}
      {showCreateDepartmentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaBuilding className="text-emerald-600" />
                  Criar Novo Setor
                </h2>
                <button onClick={() => { setShowCreateDepartmentModal(false); setNewDeptComplete({ nome: '', cor: 'text-gray-600 dark:text-gray-600', icone: 'FaBuilding', permissoes: [] }); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <FaTimes className="text-gray-600 dark:text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nome do Setor *</label>
                    <input type="text" value={newDeptComplete.nome} onChange={(e) => setNewDeptComplete({ ...newDeptComplete, nome: e.target.value })} placeholder="Ex: Recursos Humanos" className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Ícone</label>
                    <button
                      onClick={() => setShowIconDrawerDept(true)}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-500 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl ${newDeptComplete.cor}`}>
                          {iconMap[newDeptComplete.icone]}
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {newDeptComplete.icone}
                        </span>
                      </div>
                      <FaChevronRight className="text-gray-600 group-hover:text-emerald-500 transition-colors" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Cor</label>
                    <button
                      onClick={() => setShowColorDrawerDept(true)}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-500 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${newDeptComplete.cor.startsWith('#') ? '' : newDeptComplete.cor}`}
                          style={newDeptComplete.cor.startsWith('#') ? { color: newDeptComplete.cor } : {}}
                        >
                          <FaStar />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {newDeptComplete.cor.startsWith('#') ? newDeptComplete.cor : 'Cor Selecionada'}
                        </span>
                      </div>
                      <FaChevronRight className="text-gray-600 group-hover:text-emerald-500 transition-colors" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Permissões do Setor</h3>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {Object.entries(permissoesGranulares).map(([moduloKey, modulo]) => {
                      const permissoesModulo = modulo.permissoes.map(p => p.id);
                      const todasMarcadas = permissoesModulo.every(p => newDeptComplete.permissoes.includes(p));
                      return (
                        <div key={moduloKey} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-sm ${todasMarcadas ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600'}`}>{modulo.icon}</div>
                              <span className="text-sm font-bold text-gray-900 dark:text-white">{modulo.nome}</span>
                            </div>
                            <button onClick={() => handleToggleModuloNewDept(moduloKey)} className={`px-3 py-1 rounded-lg text-xs font-semibold ${todasMarcadas ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                              {todasMarcadas ? 'Desmarcar' : 'Marcar Todas'}
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            {modulo.permissoes.map((permissao) => {
                              const isAtiva = newDeptComplete.permissoes.includes(permissao.id);
                              return (
                                <button key={permissao.id} onClick={() => handleTogglePermissaoNewDept(permissao.id)} className={`px-2 py-1.5 rounded-lg text-xs font-semibold text-left ${isAtiva ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
                                  {isAtiva ? <FaCheckCircle className="inline text-xs mr-1" /> : <FaTimesCircle className="inline text-xs mr-1 opacity-50" />}
                                  {permissao.nome}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button onClick={handleCreateDepartmentComplete} disabled={!newDeptComplete.nome.trim()} className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                  <FaPlus className="inline mr-2" /> Criar Setor
                </button>
                <button onClick={() => { setShowCreateDepartmentModal(false); setNewDeptComplete({ nome: '', cor: 'text-gray-600 dark:text-gray-600', icone: 'FaBuilding', permissoes: [] }); }} className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Adicionar Novo Membro */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaEnvelope className="text-purple-600 dark:text-purple-400" />
                  Convidar Novo Membro
                </h2>
                <button
                  onClick={() => {
                    setShowAddMemberModal(false);
                    setInviteEmail('');
                    setInviteCargo('');
                    setInviteSetor('');
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-600" />
                </button>
              </div>
            </div>

            {/* Formulário */}
            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 border-2 border-purple-200 dark:border-gray-700">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                    <FaEnvelope className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Convite por Email</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-600">
                      O membro receberá um email de convite para criar sua conta. Após criar a conta, os dados pessoais serão preenchidos automaticamente.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Email do Convidado *
                    </label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Cargo *
                      </label>
                      <select
                        value={inviteCargo}
                        onChange={(e) => setInviteCargo(e.target.value)}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Selecione um cargo</option>
                        {cargos.map(cargo => (
                          <option key={cargo.id} value={cargo.id}>{cargo.nome}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Setor *
                      </label>
                      <select
                        value={inviteSetor}
                        onChange={(e) => setInviteSetor(e.target.value)}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Selecione um setor</option>
                        {departamentosNomes.map(deptNome => (
                          <option key={deptNome} value={deptNome}>{deptNome}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    if (inviteEmail && inviteCargo && inviteSetor) {
                      const currentCount = teamData.members?.length || 0;
                      if (!canAddTeamMember(currentCount)) {
                        setShowAddMemberModal(false);
                        setShowUpgradeBanner(true);
                        setInviteEmail('');
                        setInviteCargo('');
                        setInviteSetor('');
                      } else {
                        toast.success(`Convite enviado para ${inviteEmail} - Cargo: ${inviteCargo}, Setor: ${inviteSetor}`);
                        setShowAddMemberModal(false);
                        setInviteEmail('');
                        setInviteCargo('');
                        setInviteSetor('');
                      }
                    }
                  }}
                  disabled={!inviteEmail || !inviteCargo || !inviteSetor}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaEnvelope className="inline mr-2" />
                  Enviar Convite
                </button>
                <button
                  onClick={() => {
                    setShowAddMemberModal(false);
                    setInviteEmail('');
                    setInviteCargo('');
                    setInviteSetor('');
                  }}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Banner */}
      {showUpgradeBanner && (
        <UpgradeBanner
          feature="Equipe Ilimitada"
          requiredPlan="Professional"
          onClose={() => setShowUpgradeBanner(false)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};

export default Team;
