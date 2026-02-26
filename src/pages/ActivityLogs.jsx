import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification.jsx';
import PageHeader from '@/components/custom/PageHeader';
import DataTable from '@/components/custom/DataTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FaHistory,
  FaFilter,
  FaDownload,
  FaSearch,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaSync,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaKey,
  FaCreditCard,
  FaDatabase,
} from 'react-icons/fa';

const ActivityLogs = ({ onNavigate }) => {
  const { user } = useAuth();
  const { notifySuccess, notifyError } = useNotification();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtros
  const [filterAction, setFilterAction] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');

  // Verificar se é admin
  useEffect(() => {
    if (user?.role !== 'admin') {
      onNavigate && onNavigate('unauthorized');
    }
  }, [user, onNavigate]);

  // Mock data realista de logs
  const generateMockLogs = () => {
    const users = [
      { id: 1, name: 'João Silva', email: 'joao@example.com' },
      { id: 2, name: 'Maria Santos', email: 'maria@example.com' },
      { id: 3, name: 'Pedro Oliveira', email: 'pedro@example.com' },
      { id: 4, name: 'Ana Costa', email: 'ana@example.com' },
      { id: 5, name: 'Carlos Mendes', email: 'carlos@example.com' },
    ];

    const actions = [
      { type: 'login', label: 'Login', icon: 'FaSignInAlt', severity: 'info' },
      { type: 'logout', label: 'Logout', icon: 'FaSignOutAlt', severity: 'info' },
      { type: 'user_created', label: 'Criação de Conta', icon: 'FaUserPlus', severity: 'success' },
      { type: 'profile_updated', label: 'Edição de Perfil', icon: 'FaEdit', severity: 'info' },
      { type: 'user_deleted', label: 'Exclusão de Conta', icon: 'FaTrash', severity: 'warning' },
      { type: 'plan_changed', label: 'Troca de Plano', icon: 'FaCreditCard', severity: 'success' },
      { type: 'password_changed', label: 'Troca de Senha', icon: 'FaKey', severity: 'warning' },
      { type: 'api_call', label: 'Chamada de API', icon: 'FaDatabase', severity: 'info' },
      { type: 'failed_login', label: 'Tentativa de Login Falha', icon: 'FaExclamationTriangle', severity: 'error' },
      { type: 'suspicious_activity', label: 'Atividade Suspeita', icon: 'FaExclamationTriangle', severity: 'error' },
    ];

    const ips = [
      '192.168.1.100',
      '192.168.1.101',
      '201.45.78.90',
      '177.89.102.34',
      '186.203.45.12',
      '200.150.30.45',
    ];

    const devices = [
      'Chrome 121 - Windows 10',
      'Safari 17 - macOS Sonoma',
      'Firefox 122 - Ubuntu 22.04',
      'Edge 121 - Windows 11',
      'Chrome 121 - Android 14',
      'Safari 17 - iOS 17',
    ];

    const mockLogs = [];
    const now = new Date();

    for (let i = 0; i < 150; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const hoursAgo = Math.floor(Math.random() * 720); // Últimas 30 dias
      const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);

      mockLogs.push({
        id: i + 1,
        timestamp: timestamp.toISOString(),
        user: user.name,
        userId: user.id,
        userEmail: user.email,
        action: action.type,
        actionLabel: action.label,
        actionIcon: action.icon,
        severity: action.severity,
        ip: ips[Math.floor(Math.random() * ips.length)],
        device: devices[Math.floor(Math.random() * devices.length)],
        details: getActionDetails(action.type, user.name),
      });
    }

    return mockLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const getActionDetails = (actionType, userName) => {
    const details = {
      login: `${userName} realizou login com sucesso`,
      logout: `${userName} saiu do sistema`,
      user_created: `Nova conta criada para ${userName}`,
      profile_updated: `${userName} atualizou informações do perfil`,
      user_deleted: `Conta de ${userName} foi deletada`,
      plan_changed: `${userName} alterou plano de Basic para Premium`,
      password_changed: `${userName} alterou a senha`,
      api_call: `${userName} executou chamada à API /api/users`,
      failed_login: `Tentativa de login falhou para ${userName}`,
      suspicious_activity: `Múltiplas tentativas de login de IPs diferentes para ${userName}`,
    };

    return details[actionType] || `${userName} executou ação no sistema`;
  };

  // Carregar logs
  useEffect(() => {
    const mockLogs = generateMockLogs();
    setLogs(mockLogs);
    setFilteredLogs(mockLogs);
    setIsLoading(false);
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...logs];

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.actionLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.ip.includes(searchTerm) ||
          log.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de ação
    if (filterAction !== 'all') {
      filtered = filtered.filter((log) => log.action === filterAction);
    }

    // Filtro de severidade
    if (filterSeverity !== 'all') {
      filtered = filtered.filter((log) => log.severity === filterSeverity);
    }

    // Filtro de data início
    if (filterDateStart) {
      const startDate = new Date(filterDateStart);
      filtered = filtered.filter((log) => new Date(log.timestamp) >= startDate);
    }

    // Filtro de data fim
    if (filterDateEnd) {
      const endDate = new Date(filterDateEnd);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((log) => new Date(log.timestamp) <= endDate);
    }

    setFilteredLogs(filtered);
  }, [searchTerm, filterAction, filterSeverity, filterDateStart, filterDateEnd, logs]);

  // Limpar filtros
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterAction('all');
    setFilterSeverity('all');
    setFilterDateStart('');
    setFilterDateEnd('');
  };

  // Exportar logs
  const handleExportCSV = () => {
    const csvContent = [
      ['Timestamp', 'Usuário', 'Email', 'Ação', 'Severidade', 'IP', 'Dispositivo', 'Detalhes'],
      ...filteredLogs.map((log) => [
        new Date(log.timestamp).toLocaleString('pt-BR'),
        log.user,
        log.userEmail,
        log.actionLabel,
        log.severity,
        log.ip,
        log.device,
        log.details,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `activity_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notifySuccess('Logs exportados com sucesso!');
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `activity_logs_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notifySuccess('Logs exportados com sucesso!');
  };

  // Badge de severidade
  const getSeverityBadge = (severity) => {
    const config = {
      success: {
        icon: <FaCheckCircle className="mr-1" />,
        className: 'bg-green-500 text-white',
        label: 'Sucesso',
      },
      info: {
        icon: <FaInfoCircle className="mr-1" />,
        className: 'bg-blue-500 text-white',
        label: 'Info',
      },
      warning: {
        icon: <FaExclamationTriangle className="mr-1" />,
        className: 'bg-yellow-500 text-white',
        label: 'Aviso',
      },
      error: {
        icon: <FaTimesCircle className="mr-1" />,
        className: 'bg-red-500 text-white',
        label: 'Erro',
      },
    };

    const severityConfig = config[severity] || config.info;

    return (
      <Badge className={severityConfig.className}>
        {severityConfig.icon}
        {severityConfig.label}
      </Badge>
    );
  };

  // Ícone da ação
  const getActionIcon = (iconName) => {
    const icons = {
      FaSignInAlt: <FaSignInAlt className="text-blue-500" />,
      FaSignOutAlt: <FaSignOutAlt className="text-gray-500" />,
      FaUserPlus: <FaUserPlus className="text-green-500" />,
      FaEdit: <FaEdit className="text-purple-500" />,
      FaTrash: <FaTrash className="text-red-500" />,
      FaCreditCard: <FaCreditCard className="text-emerald-500" />,
      FaKey: <FaKey className="text-yellow-500" />,
      FaDatabase: <FaDatabase className="text-indigo-500" />,
      FaExclamationTriangle: <FaExclamationTriangle className="text-red-600" />,
    };

    return icons[iconName] || <FaInfoCircle className="text-gray-500" />;
  };

  // Alertas de atividades suspeitas
  const suspiciousLogs = filteredLogs.filter((log) => log.severity === 'error');

  // Colunas da tabela
  const columns = [
    {
      key: 'timestamp',
      label: 'Data/Hora',
      sortable: true,
      render: (value) => (
        <div className="text-sm">
          <div className="font-semibold text-gray-900 dark:text-white">
            {new Date(value).toLocaleDateString('pt-BR')}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            {new Date(value).toLocaleTimeString('pt-BR')}
          </div>
        </div>
      ),
    },
    {
      key: 'user',
      label: 'Usuário',
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{row.userEmail}</p>
        </div>
      ),
    },
    {
      key: 'actionLabel',
      label: 'Ação',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          {getActionIcon(row.actionIcon)}
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'severity',
      label: 'Severidade',
      render: (value) => getSeverityBadge(value),
    },
    {
      key: 'ip',
      label: 'IP',
      render: (value) => <span className="font-mono text-sm">{value}</span>,
    },
    {
      key: 'device',
      label: 'Dispositivo',
      render: (value) => <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>,
    },
    {
      key: 'details',
      label: 'Detalhes',
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate block">
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <PageHeader
        title="Logs de Atividade"
        subtitle="Timeline completa de todas as ações realizadas na plataforma"
        breadcrumbs={[
          { label: 'Dashboard', href: '#', onClick: () => onNavigate('dashboard') },
          { label: 'Admin', href: '#', onClick: () => onNavigate('admin') },
          { label: 'Logs' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              <FaDownload className="mr-2" />
              Exportar CSV
            </Button>
            <Button
              onClick={handleExportJSON}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <FaDownload className="mr-2" />
              Exportar JSON
            </Button>
          </div>
        }
      />

      {/* Alertas de Atividades Suspeitas */}
      {suspiciousLogs.length > 0 && (
        <Card className="border-red-500 bg-red-50 dark:bg-red-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <FaExclamationTriangle />
              Alertas de Segurança
            </CardTitle>
            <CardDescription className="text-red-600 dark:text-red-400">
              {suspiciousLogs.length} atividade(s) suspeita(s) detectada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suspiciousLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <FaExclamationTriangle className="text-red-600 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {log.actionLabel}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{log.details}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {new Date(log.timestamp).toLocaleString('pt-BR')} - IP: {log.ip}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaFilter className="text-purple-600" />
            Filtros Avançados
          </CardTitle>
          <CardDescription>
            Refine sua busca usando múltiplos critérios de filtro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Busca */}
            <div className="lg:col-span-2">
              <label className="text-sm font-medium mb-2 block">Buscar</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Usuário, email, IP, ação..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tipo de Ação */}
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Ação</label>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                  <SelectItem value="user_created">Criação de Conta</SelectItem>
                  <SelectItem value="profile_updated">Edição de Perfil</SelectItem>
                  <SelectItem value="user_deleted">Exclusão</SelectItem>
                  <SelectItem value="plan_changed">Troca de Plano</SelectItem>
                  <SelectItem value="password_changed">Troca de Senha</SelectItem>
                  <SelectItem value="api_call">API Call</SelectItem>
                  <SelectItem value="failed_login">Login Falho</SelectItem>
                  <SelectItem value="suspicious_activity">Atividade Suspeita</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Severidade */}
            <div>
              <label className="text-sm font-medium mb-2 block">Severidade</label>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="success">Sucesso</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Aviso</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data Início */}
            <div>
              <label className="text-sm font-medium mb-2 block">Data Início</label>
              <Input
                type="date"
                value={filterDateStart}
                onChange={(e) => setFilterDateStart(e.target.value)}
              />
            </div>

            {/* Data Fim */}
            <div>
              <label className="text-sm font-medium mb-2 block">Data Fim</label>
              <Input
                type="date"
                value={filterDateEnd}
                onChange={(e) => setFilterDateEnd(e.target.value)}
              />
            </div>
          </div>

          {/* Botão Limpar Filtros */}
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={handleClearFilters}>
              <FaSync className="mr-2" />
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaHistory className="text-purple-600" />
            Timeline de Atividades
          </CardTitle>
          <CardDescription>
            {filteredLogs.length} {filteredLogs.length === 1 ? 'registro encontrado' : 'registros encontrados'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <FaSync className="animate-spin text-4xl text-purple-600" />
            </div>
          ) : (
            <DataTable columns={columns} data={filteredLogs} itemsPerPage={20} />
          )}
        </CardContent>
      </Card>

      {/* Estatísticas Resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">Sucessos</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {filteredLogs.filter((log) => log.severity === 'success').length}
                </p>
              </div>
              <FaCheckCircle className="text-4xl text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Informações</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {filteredLogs.filter((log) => log.severity === 'info').length}
                </p>
              </div>
              <FaInfoCircle className="text-4xl text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">Avisos</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  {filteredLogs.filter((log) => log.severity === 'warning').length}
                </p>
              </div>
              <FaExclamationTriangle className="text-4xl text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">Erros</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {filteredLogs.filter((log) => log.severity === 'error').length}
                </p>
              </div>
              <FaTimesCircle className="text-4xl text-red-600 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivityLogs;
