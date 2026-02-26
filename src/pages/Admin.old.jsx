import React, { useState } from 'react';
import {
  FaUserShield,
  FaChartLine,
  FaUsers,
  FaPlug,
  FaCog,
  FaFileAlt,
  FaChartBar,
  FaBolt,
  FaServer,
  FaDatabase,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaSearch,
  FaFilter,
  FaDownload,
  FaSync,
  FaShieldAlt,
  FaKey,
  FaBell,
  FaPalette,
  FaGlobe,
  FaCode,
  FaLock,
  FaTrash,
  FaEdit,
  FaEye,
  FaBan,
  FaUserPlus,
  FaEnvelope,
  FaPhone,
  FaCreditCard,
  FaDollarSign,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaCircle,
  FaTimes
} from 'react-icons/fa';

const Admin = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Dados mockados - Dashboard
  const dashboardStats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalRevenue: 284650.50,
    activeIntegrations: 15,
    systemUptime: '99.8%',
    avgResponseTime: '125ms',
    totalSessions: 5678,
    errorRate: '0.2%'
  };

  // Dados mockados - Usuários
  const users = [
    {
      id: 1,
      nome: 'João Silva',
      email: 'joao.silva@email.com',
      telefone: '+55 11 98765-4321',
      plano: 'Professional',
      status: 'Ativo',
      dataCadastro: '2025-01-15',
      ultimoAcesso: '2026-02-24 14:30',
      faturamento: 2980.00,
      role: 'Admin'
    },
    {
      id: 2,
      nome: 'Maria Santos',
      email: 'maria.santos@email.com',
      telefone: '+55 11 98765-4322',
      plano: 'Starter',
      status: 'Ativo',
      dataCadastro: '2025-02-10',
      ultimoAcesso: '2026-02-24 12:15',
      faturamento: 497.00,
      role: 'User'
    },
    {
      id: 3,
      nome: 'Pedro Costa',
      email: 'pedro.costa@email.com',
      telefone: '+55 11 98765-4323',
      plano: 'Enterprise',
      status: 'Ativo',
      dataCadastro: '2024-11-20',
      ultimoAcesso: '2026-02-24 09:45',
      faturamento: 7490.00,
      role: 'Admin'
    },
    {
      id: 4,
      nome: 'Ana Paula',
      email: 'ana.paula@email.com',
      telefone: '+55 11 98765-4324',
      plano: 'Professional',
      status: 'Suspenso',
      dataCadastro: '2025-03-05',
      ultimoAcesso: '2026-02-20 16:00',
      faturamento: 1490.00,
      role: 'User'
    },
    {
      id: 5,
      nome: 'Carlos Eduardo',
      email: 'carlos.eduardo@email.com',
      telefone: '+55 11 98765-4325',
      plano: 'Trial',
      status: 'Trial',
      dataCadastro: '2026-02-20',
      ultimoAcesso: '2026-02-24 11:20',
      faturamento: 0.00,
      role: 'User'
    }
  ];

  // Dados mockados - Integrações do Sistema
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

  // Dados mockados - Analytics
  const analyticsData = {
    newUsersThisMonth: 89,
    revenueGrowth: '+23%',
    activeSessionsNow: 156,
    avgSessionDuration: '18m 32s',
    topPlans: [
      { plan: 'Professional', count: 542, revenue: 161644.00 },
      { plan: 'Starter', count: 389, revenue: 38462.00 },
      { plan: 'Enterprise', count: 127, revenue: 84650.00 },
      { plan: 'Trial', count: 189, revenue: 0.00 }
    ]
  };

  // Filtrar usuários
  const filteredUsers = users.filter(user =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.plano.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obter cor do status
  const getStatusColor = (status) => {
    const colors = {
      'Ativo': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      'Suspenso': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      'Trial': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      'Inativo': 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
  };

  // Obter cor do plano
  const getPlanColor = (plan) => {
    const colors = {
      'Enterprise': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
      'Professional': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      'Starter': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
      'Trial': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
    };
    return colors[plan] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
  };

  // Obter cor do log level
  const getLogLevelColor = (level) => {
    const colors = {
      'INFO': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      'WARNING': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      'ERROR': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      'SUCCESS': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
    };
    return colors[level] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
  };

  // Handlers
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleSuspendUser = (userId) => {
    if (window.confirm('Tem certeza que deseja suspender este usuário?')) {
      alert(`Usuário ${userId} suspenso com sucesso`);
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('ATENÇÃO: Esta ação é irreversível. Deseja realmente excluir este usuário?')) {
      alert(`Usuário ${userId} excluído com sucesso`);
    }
  };

  const handleExportData = () => {
    alert('Exportando dados para CSV...');
  };

  const handleSyncIntegrations = () => {
    alert('Sincronizando todas as integrações...');
  };

  // Tabs
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaChartLine /> },
    { id: 'users', label: 'Usuários', icon: <FaUsers /> },
    { id: 'integrations', label: 'Integrações', icon: <FaPlug /> },
    { id: 'settings', label: 'Configurações', icon: <FaCog /> },
    { id: 'logs', label: 'Logs', icon: <FaFileAlt /> },
    { id: 'analytics', label: 'Analytics', icon: <FaChartBar /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-800 dark:to-purple-950 px-8 py-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <FaUserShield className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
                <p className="text-purple-200 text-sm">Gerenciamento completo da plataforma</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl font-semibold transition-all flex items-center gap-2"
              >
                <FaDownload /> Exportar
              </button>
              <button
                onClick={handleSyncIntegrations}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl font-semibold transition-all flex items-center gap-2"
              >
                <FaSync /> Sincronizar
              </button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-8">
        {/* TAB: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Usuários */}
              <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <FaUsers className="text-white text-xl" />
                  </div>
                  <FaArrowUp className="text-green-500" />
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">Total de Usuários</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{dashboardStats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">+12% este mês</p>
              </div>

              {/* Usuários Ativos */}
              <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <FaCheckCircle className="text-white text-xl" />
                  </div>
                  <FaArrowUp className="text-green-500" />
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">Usuários Ativos</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{dashboardStats.activeUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">+8% este mês</p>
              </div>

              {/* Receita Total */}
              <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <FaDollarSign className="text-white text-xl" />
                  </div>
                  <FaArrowUp className="text-green-500" />
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">Receita Total</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  R$ {dashboardStats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">+23% este mês</p>
              </div>

              {/* Integrações Ativas */}
              <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <FaPlug className="text-white text-xl" />
                  </div>
                  <FaCheckCircle className="text-green-500" />
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">Integrações Ativas</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{dashboardStats.activeIntegrations}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Todas operacionais</p>
              </div>
            </div>

            {/* Métricas do Sistema */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FaServer className="text-purple-600 dark:text-purple-400" />
                Métricas do Sistema
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Uptime</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{dashboardStats.systemUptime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tempo de Resposta Médio</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{dashboardStats.avgResponseTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Sessões Totais</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{dashboardStats.totalSessions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Taxa de Erro</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{dashboardStats.errorRate}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Usuários */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Barra de Pesquisa */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar usuário por nome, email ou plano..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
              <button className="px-5 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all flex items-center gap-2">
                <FaUserPlus /> Novo Usuário
              </button>
            </div>

            {/* Tabela de Usuários */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 border-b-2 border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Usuário</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Contato</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Plano</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Status</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Faturamento</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Último Acesso</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold">
                              {user.nome.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{user.nome}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{user.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <FaEnvelope className="text-xs text-purple-600 dark:text-purple-400" />
                              {user.email}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <FaPhone className="text-xs text-purple-600 dark:text-purple-400" />
                              {user.telefone}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPlanColor(user.plano)}`}>
                            {user.plano}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-emerald-600 dark:text-emerald-400">
                            R$ {user.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700 dark:text-gray-300">{user.ultimoAcesso}</p>
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
                              onClick={() => alert('Editar usuário ' + user.id)}
                              className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all"
                              title="Editar"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleSuspendUser(user.id)}
                              className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-all"
                              title="Suspender"
                            >
                              <FaBan />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
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

        {/* TAB: Integrações */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FaPlug className="text-purple-600 dark:text-purple-400" />
                Integrações do Sistema
              </h2>
              <div className="space-y-4">
                {systemIntegrations.map(integration => (
                  <div key={integration.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {integration.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{integration.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{integration.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Usuários</p>
                        <p className="font-bold text-gray-900 dark:text-white">{integration.users}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Última Sync</p>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{integration.lastSync}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                        integration.status === 'Ativo'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
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

        {/* TAB: Configurações */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Seções de Configuração */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Segurança */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaShieldAlt className="text-purple-600 dark:text-purple-400" />
                  Segurança
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Autenticação 2FA</span>
                    <button className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg font-semibold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all">
                      Configurar
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Chaves API</span>
                    <button className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg font-semibold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all">
                      <FaKey className="inline mr-2" />
                      Gerenciar
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Logs de Auditoria</span>
                    <button className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg font-semibold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all">
                      Visualizar
                    </button>
                  </div>
                </div>
              </div>

              {/* Notificações */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaBell className="text-purple-600 dark:text-purple-400" />
                  Notificações
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Novos Usuários</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Erros do Sistema</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Relatórios Semanais</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Aparência */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaPalette className="text-purple-600 dark:text-purple-400" />
                  Aparência
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Tema Escuro</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Cor Principal</span>
                    <input type="color" defaultValue="#9333ea" className="w-12 h-8 rounded cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Sistema */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaDatabase className="text-purple-600 dark:text-purple-400" />
                  Sistema
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Backup Automático</span>
                    <button className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg font-semibold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all">
                      Ativo
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Cache</span>
                    <button className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-all">
                      Limpar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Logs */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaFileAlt className="text-purple-600 dark:text-purple-400" />
                  Logs do Sistema
                </h2>
                <div className="flex items-center gap-2">
                  <select className="px-4 py-2 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-purple-500">
                    <option>Todos os Níveis</option>
                    <option>INFO</option>
                    <option>WARNING</option>
                    <option>ERROR</option>
                  </select>
                  <button className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl font-semibold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all">
                    <FaFilter />
                  </button>
                </div>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {systemLogs.map(log => (
                  <div key={log.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getLogLevelColor(log.level)}`}>
                          {log.level}
                        </span>
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{log.module}</span>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <FaClock className="text-[10px]" />
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{log.message}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">IP: {log.ip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Cards de Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Novos Usuários (Mês)</h3>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{analyticsData.newUsersThisMonth}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Crescimento de Receita</h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{analyticsData.revenueGrowth}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Sessões Ativas</h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{analyticsData.activeSessionsNow}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Duração Média Sessão</h3>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{analyticsData.avgSessionDuration}</p>
              </div>
            </div>

            {/* Planos Mais Populares */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FaChartBar className="text-purple-600 dark:text-purple-400" />
                Distribuição por Planos
              </h2>
              <div className="space-y-4">
                {analyticsData.topPlans.map((plan, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getPlanColor(plan.plan)}`}>
                        {plan.plan}
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {plan.count} usuários
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-3 mr-4">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all"
                          style={{ width: `${(plan.count / users.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        R$ {plan.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalhes do Usuário */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header do Modal */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl">
                  {selectedUser.nome.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedUser.nome}</h2>
                  <p className="text-purple-100">{selectedUser.role}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setSelectedUser(null);
                }}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
              >
                <FaTimes />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 space-y-6">
              {/* Informações Básicas */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Informações Básicas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Email</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Telefone</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedUser.telefone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Data de Cadastro</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedUser.dataCadastro}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Último Acesso</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedUser.ultimoAcesso}</p>
                  </div>
                </div>
              </div>

              {/* Plano e Faturamento */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Plano e Faturamento</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Plano Atual</p>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${getPlanColor(selectedUser.plano)}`}>
                      {selectedUser.plano}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Status</p>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Faturamento Total</p>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      R$ {selectedUser.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2">
                  <FaEdit /> Editar
                </button>
                <button className="px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all">
                  Suspender
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
