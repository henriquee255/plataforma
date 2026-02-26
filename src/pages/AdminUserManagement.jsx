import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification.jsx';
import PageHeader from '@/components/custom/PageHeader';
import StatCard from '@/components/custom/StatCard';
import DataTable from '@/components/custom/DataTable';
import SearchBar from '@/components/custom/SearchBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FaUsers,
  FaUserShield,
  FaUserTie,
  FaUser,
  FaChartLine,
  FaCrown,
  FaEdit,
  FaTrash,
  FaSync,
  FaEye,
  FaBan,
  FaCheck,
  FaKey,
  FaExchangeAlt,
  FaDollarSign,
  FaRocket,
  FaBuilding,
  FaStar,
  FaFilter,
} from 'react-icons/fa';

const AdminUserManagement = ({ onNavigate }) => {
  const { user } = useAuth();
  const { notifySuccess, notifyError, notifyUpdated, notifyDeleted } = useNotification();

  // Estado de usuários e filtros
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Modais
  const [viewUserModal, setViewUserModal] = useState(null);
  const [editUserModal, setEditUserModal] = useState(null);
  const [changePlanModal, setChangePlanModal] = useState(null);
  const [resetPasswordModal, setResetPasswordModal] = useState(null);

  // Form states
  const [editForm, setEditForm] = useState({});
  const [newPlan, setNewPlan] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [stats, setStats] = useState({
    total: 0,
    trial: 0,
    starter: 0,
    professional: 0,
    enterprise: 0,
    active: 0,
    inactive: 0,
  });

  // Dados mockados de usuários (simulando API)
    {
      id: 1,
      name: 'Henrique de Oliveira',
      email: 'eu.henriquee2501@gmail.com',
      role: 'admin',
      plan: 'enterprise',
      status: 'active',
      createdAt: '2024-01-15T10:30:00Z',
      lastLogin: '2024-02-24T15:45:00Z',
      avatar: 'https://ui-avatars.com/api/?name=Henrique+Oliveira&background=9333ea&color=fff&size=128',
      phone: '(11) 98765-4321',
      company: 'Synkra Tech',
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria.santos@empresa.com',
      role: 'manager',
      plan: 'professional',
      status: 'active',
      createdAt: '2024-01-20T14:20:00Z',
      lastLogin: '2024-02-24T12:30:00Z',
      avatar: null,
      phone: '(11) 91234-5678',
      company: 'Tech Solutions',
    },
    {
      id: 3,
      name: 'João Silva',
      email: 'joao.silva@email.com',
      role: 'user',
      plan: 'starter',
      status: 'active',
      createdAt: '2024-02-01T09:15:00Z',
      lastLogin: '2024-02-23T18:20:00Z',
      avatar: null,
      phone: '(21) 99876-5432',
      company: 'Startup Inc',
    },
    {
      id: 4,
      name: 'Ana Costa',
      email: 'ana.costa@gmail.com',
      role: 'user',
      plan: 'trial',
      status: 'active',
      createdAt: '2024-02-20T11:00:00Z',
      lastLogin: '2024-02-24T10:15:00Z',
      avatar: null,
      phone: '(11) 95555-1234',
      company: null,
    },
    {
      id: 5,
      name: 'Pedro Oliveira',
      email: 'pedro@example.com',
      role: 'user',
      plan: 'professional',
      status: 'inactive',
      createdAt: '2024-01-10T08:00:00Z',
      lastLogin: '2024-02-10T16:00:00Z',
      avatar: null,
      phone: '(85) 98888-7777',
      company: 'Digital Co',
    },
    {
      id: 6,
      name: 'Carla Mendes',
      email: 'carla.mendes@corp.com',
      role: 'manager',
      plan: 'enterprise',
      status: 'active',
      createdAt: '2024-01-25T13:45:00Z',
      lastLogin: '2024-02-24T14:00:00Z',
      avatar: null,
      phone: '(11) 97777-6666',
      company: 'Enterprise Corp',
    },
    {
      id: 7,
      name: 'Bruno Lima',
      email: 'bruno.lima@test.com',
      role: 'user',
      plan: 'starter',
      status: 'active',
      createdAt: '2024-02-15T10:30:00Z',
      lastLogin: '2024-02-23T09:45:00Z',
      avatar: null,
      phone: '(31) 96666-5555',
      company: 'Small Business',
    },
    {
      id: 8,
      name: 'Juliana Rocha',
      email: 'juliana@company.com',
      role: 'user',
      plan: 'trial',
      status: 'inactive',
      createdAt: '2024-02-10T15:20:00Z',
      lastLogin: '2024-02-12T11:30:00Z',
      avatar: null,
      phone: '(41) 94444-3333',
      company: null,
    },
  ];

  // Carregar usuários
  const loadUsers = async () => {
    try {
      setIsLoading(true);

      // Simulando chamada API
      await new Promise(resolve => setTimeout(resolve, 800));

      setUsers(mockUsers);

      // Calcular estatísticas
      const total = mockUsers.length;
      const trial = mockUsers.filter((u) => u.plan === 'trial').length;
      const starter = mockUsers.filter((u) => u.plan === 'starter').length;
      const professional = mockUsers.filter((u) => u.plan === 'professional').length;
      const enterprise = mockUsers.filter((u) => u.plan === 'enterprise').length;
      const active = mockUsers.filter((u) => u.status === 'active').length;
      const inactive = mockUsers.filter((u) => u.status === 'inactive').length;

      setStats({
        total,
        trial,
        starter,
        professional,
        enterprise,
        active,
        inactive,
      });
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      notifyError('Erro ao carregar lista de usuários');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Deletar usuário
  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Tem certeza que deseja deletar ${userName}?`)) {
      return;
    }

    try {
      // Simulando chamada API
      await new Promise(resolve => setTimeout(resolve, 500));

      setUsers(prev => prev.filter(u => u.id !== userId));
      notifyDeleted(`${userName} removido do sistema`);
      loadUsers(); // Recarregar estatísticas
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      notifyError(error.message || 'Erro ao remover usuário');
    }
  };

  // Abrir modal de visualização
  const handleViewUser = (userToView) => {
    setViewUserModal(userToView);
  };

  // Abrir modal de edição
  const handleEditUser = (userToEdit) => {
    setEditForm({
      name: userToEdit.name,
      email: userToEdit.email,
      phone: userToEdit.phone || '',
      company: userToEdit.company || '',
      role: userToEdit.role,
    });
    setEditUserModal(userToEdit);
  };

  // Salvar edição
  const handleSaveEdit = async () => {
    try {
      // Simulando chamada API
      await new Promise(resolve => setTimeout(resolve, 500));

      setUsers(prev => prev.map(u =>
        u.id === editUserModal.id
          ? { ...u, ...editForm }
          : u
      ));

      notifyUpdated(`Usuário ${editForm.name} atualizado com sucesso`);
      setEditUserModal(null);
      setEditForm({});
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      notifyError('Erro ao atualizar usuário');
    }
  };

  // Alternar status
  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      // Simulando chamada API
      await new Promise(resolve => setTimeout(resolve, 500));

      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      setUsers(prev => prev.map(u =>
        u.id === userId
          ? { ...u, status: newStatus }
          : u
      ));

      notifyUpdated(`Status alterado para ${newStatus === 'active' ? 'Ativo' : 'Inativo'}`);
      loadUsers();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      notifyError('Erro ao alterar status');
    }
  };

  // Abrir modal de troca de plano
  const handleChangePlan = (userToChange) => {
    setNewPlan(userToChange.plan);
    setChangePlanModal(userToChange);
  };

  // Salvar troca de plano
  const handleSavePlan = async () => {
    try {
      // Simulando chamada API
      await new Promise(resolve => setTimeout(resolve, 500));

      setUsers(prev => prev.map(u =>
        u.id === changePlanModal.id
          ? { ...u, plan: newPlan }
          : u
      ));

      notifyUpdated(`Plano alterado para ${getPlanName(newPlan)}`);
      setChangePlanModal(null);
      setNewPlan('');
      loadUsers();
    } catch (error) {
      console.error('Erro ao alterar plano:', error);
      notifyError('Erro ao alterar plano');
    }
  };

  // Abrir modal de reset de senha
  const handleResetPassword = (userToReset) => {
    setNewPassword('');
    setResetPasswordModal(userToReset);
  };

  // Salvar nova senha
  const handleSavePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      notifyError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    try {
      // Simulando chamada API
      await new Promise(resolve => setTimeout(resolve, 500));

      notifySuccess(`Senha resetada para ${resetPasswordModal.name}`);
      setResetPasswordModal(null);
      setNewPassword('');
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      notifyError('Erro ao resetar senha');
    }
  };

  // Funções auxiliares
  const getPlanName = (plan) => {
    const names = {
      trial: 'Trial',
      starter: 'Starter',
      professional: 'Professional',
      enterprise: 'Enterprise',
    };
    return names[plan] || plan;
  };

  const getPlanPrice = (plan) => {
    const prices = {
      trial: 0,
      starter: 97,
      professional: 297,
      enterprise: 997,
    };
    return prices[plan] || 0;
  };

  const calculateMRR = () => {
    return users.reduce((total, currentUser) => {
      if (currentUser.status === 'active') {
        return total + getPlanPrice(currentUser.plan);
      }
      return total;
    }, 0);
  };

  const calculateChurnRate = () => {
    const inactive = users.filter(u => u.status === 'inactive').length;
    const total = users.length;
    return total > 0 ? ((inactive / total) * 100).toFixed(1) : 0;
  };

  // Filtrar usuários
  const filteredUsers = users.filter(currentUser => {
    // Busca por texto
    const matchesSearch = !searchTerm ||
      currentUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currentUser.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (currentUser.company && currentUser.company.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filtro de status
    const matchesStatus = statusFilter === 'all' || currentUser.status === statusFilter;

    // Filtro de plano
    const matchesPlan = planFilter === 'all' || currentUser.plan === planFilter;

    // Filtro de data
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const userDate = new Date(currentUser.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now - userDate) / (1000 * 60 * 60 * 24));

      if (dateFilter === '7days') matchesDate = daysDiff <= 7;
      else if (dateFilter === '30days') matchesDate = daysDiff <= 30;
      else if (dateFilter === '90days') matchesDate = daysDiff <= 90;
    }

    return matchesSearch && matchesStatus && matchesPlan && matchesDate;
  });

  // Badge de role
  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: {
        icon: <FaCrown className="mr-1" />,
        className: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white',
        label: 'Admin',
      },
      manager: {
        icon: <FaUserTie className="mr-1" />,
        className: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
        label: 'Manager',
      },
      user: {
        icon: <FaUser className="mr-1" />,
        className: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
        label: 'Usuário',
      },
    };

    const config = roleConfig[role] || roleConfig.user;

    return (
      <Badge className={config.className}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  // Badge de plano
  const getPlanBadge = (plan) => {
    const planConfig = {
      trial: {
        icon: <FaRocket className="mr-1" />,
        className: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white',
        label: 'Trial',
      },
      starter: {
        icon: <FaStar className="mr-1" />,
        className: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
        label: 'Starter',
      },
      professional: {
        icon: <FaBuilding className="mr-1" />,
        className: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
        label: 'Professional',
      },
      enterprise: {
        icon: <FaCrown className="mr-1" />,
        className: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white',
        label: 'Enterprise',
      },
    };

    const config = planConfig[plan] || planConfig.trial;

    return (
      <Badge className={config.className}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  // Badge de status
  const getStatusBadge = (status) => {
    if (status === 'active') {
      return (
        <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <FaCheck className="mr-1" />
          Ativo
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <FaBan className="mr-1" />
          Inativo
        </Badge>
      );
    }
  };

  // Colunas da tabela
  const columns = [
    {
      key: 'name',
      label: 'Usuário',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          {row.avatar ? (
            <img
              src={row.avatar}
              alt={value}
              className="w-10 h-10 rounded-full border-2 border-purple-500"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {value.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'plan',
      label: 'Plano',
      sortable: true,
      render: (value) => getPlanBadge(value),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => getStatusBadge(value),
    },
    {
      key: 'role',
      label: 'Permissão',
      sortable: true,
      render: (value) => getRoleBadge(value),
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('pt-BR'),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_, row) => (
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewUser(row)}
            title={`Ver detalhes de ${row.name}`}
          >
            <FaEye />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditUser(row)}
            title={`Editar ${row.name}`}
          >
            <FaEdit />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleToggleStatus(row.id, row.status)}
            title={`Alternar status de ${row.name}`}
          >
            {row.status === 'active' ? <FaBan /> : <FaCheck />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleChangePlan(row)}
            title={`Trocar plano de ${row.name}`}
          >
            <FaExchangeAlt />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleResetPassword(row)}
            title={`Resetar senha de ${row.name}`}
          >
            <FaKey />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteUser(row.id, row.name)}
            disabled={row.id === user?.id}
            title={`Deletar ${row.name}`}
          >
            <FaTrash />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <PageHeader
        title="Gerenciamento de Usuários"
        subtitle="Gerencie todos os usuários da plataforma, planos e permissões"
        breadcrumbs={[
          { label: 'Dashboard', href: '#', onClick: () => onNavigate && onNavigate('dashboard') },
          { label: 'Admin' },
        ]}
        actions={
          <Button onClick={loadUsers} className="bg-purple-600 hover:bg-purple-700">
            <FaSync className="mr-2" />
            Atualizar
          </Button>
        }
      />

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Usuários"
          value={stats.total}
          icon={<FaUsers />}
          trend={12}
          trendLabel="vs. mês anterior"
        />

        <StatCard
          title="Usuários Ativos"
          value={stats.active}
          icon={<FaCheck className="text-green-500" />}
          description={`${((stats.active / stats.total) * 100 || 0).toFixed(1)}% do total`}
        />

        <StatCard
          title="MRR"
          value={`R$ ${calculateMRR().toLocaleString('pt-BR')}`}
          icon={<FaDollarSign className="text-green-500" />}
          trend={8}
          trendLabel="vs. mês anterior"
        />

        <StatCard
          title="Churn Rate"
          value={`${calculateChurnRate()}%`}
          icon={<FaChartLine className="text-red-500" />}
          trend={-2}
          trendLabel="vs. mês anterior"
        />
      </div>

      {/* Estatísticas por Plano */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Trial"
          value={stats.trial}
          icon={<FaRocket className="text-gray-500" />}
          description={`${((stats.trial / stats.total) * 100 || 0).toFixed(1)}% do total`}
        />

        <StatCard
          title="Starter"
          value={stats.starter}
          icon={<FaStar className="text-blue-500" />}
          description={`${((stats.starter / stats.total) * 100 || 0).toFixed(1)}% do total`}
        />

        <StatCard
          title="Professional"
          value={stats.professional}
          icon={<FaBuilding className="text-purple-500" />}
          description={`${((stats.professional / stats.total) * 100 || 0).toFixed(1)}% do total`}
        />

        <StatCard
          title="Enterprise"
          value={stats.enterprise}
          icon={<FaCrown className="text-amber-500" />}
          description={`${((stats.enterprise / stats.total) * 100 || 0).toFixed(1)}% do total`}
        />
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaFilter className="text-purple-600" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="space-y-2">
              <Label>Buscar</Label>
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Nome, email ou empresa..."
              />
            </div>

            {/* Filtro de Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro de Plano */}
            <div className="space-y-2">
              <Label>Plano</Label>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro de Data */}
            <div className="space-y-2">
              <Label>Data de Cadastro</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="90days">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Mostrando {filteredUsers.length} de {users.length} usuários
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaUserShield className="text-purple-600" />
            Lista de Usuários
          </CardTitle>
          <CardDescription>
            Visualize e gerencie todos os usuários da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <FaSync className="animate-spin text-4xl text-purple-600" />
            </div>
          ) : (
            <DataTable columns={columns} data={filteredUsers} />
          )}
        </CardContent>
      </Card>

      {/* Modal de Visualização */}
      <Dialog open={!!viewUserModal} onOpenChange={() => setViewUserModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
            <DialogDescription>
              Informações completas do usuário
            </DialogDescription>
          </DialogHeader>

          {viewUserModal && (
            <div className="space-y-6">
              {/* Avatar e Nome */}
              <div className="flex items-center gap-4">
                {viewUserModal.avatar ? (
                  <img
                    src={viewUserModal.avatar}
                    alt={viewUserModal.name}
                    className="w-20 h-20 rounded-full border-4 border-purple-500"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                    {viewUserModal.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {viewUserModal.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{viewUserModal.email}</p>
                </div>
              </div>

              {/* Informações */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">Plano</Label>
                  <div className="mt-1">{getPlanBadge(viewUserModal.plan)}</div>
                </div>
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">Status</Label>
                  <div className="mt-1">{getStatusBadge(viewUserModal.status)}</div>
                </div>
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">Permissão</Label>
                  <div className="mt-1">{getRoleBadge(viewUserModal.role)}</div>
                </div>
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">Telefone</Label>
                  <p className="mt-1 text-gray-900 dark:text-white font-medium">
                    {viewUserModal.phone || 'Não informado'}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">Empresa</Label>
                  <p className="mt-1 text-gray-900 dark:text-white font-medium">
                    {viewUserModal.company || 'Não informada'}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">Data de Cadastro</Label>
                  <p className="mt-1 text-gray-900 dark:text-white font-medium">
                    {new Date(viewUserModal.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">Último Login</Label>
                  <p className="mt-1 text-gray-900 dark:text-white font-medium">
                    {new Date(viewUserModal.lastLogin).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewUserModal(null)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={!!editUserModal} onOpenChange={() => setEditUserModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={editForm.email || ''}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                value={editForm.phone || ''}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label>Empresa</Label>
              <Input
                value={editForm.company || ''}
                onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                placeholder="Nome da empresa"
              />
            </div>

            <div className="space-y-2">
              <Label>Permissão</Label>
              <Select
                value={editForm.role}
                onValueChange={(value) => setEditForm({ ...editForm, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserModal(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} className="bg-purple-600 hover:bg-purple-700">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Troca de Plano */}
      <Dialog open={!!changePlanModal} onOpenChange={() => setChangePlanModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trocar Plano</DialogTitle>
            <DialogDescription>
              Altere o plano do usuário {changePlanModal?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Plano Atual</Label>
              <div>{changePlanModal && getPlanBadge(changePlanModal.plan)}</div>
            </div>

            <div className="space-y-2">
              <Label>Novo Plano</Label>
              <Select value={newPlan} onValueChange={setNewPlan}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trial">Trial - Gratuito</SelectItem>
                  <SelectItem value="starter">Starter - R$ 97/mês</SelectItem>
                  <SelectItem value="professional">Professional - R$ 297/mês</SelectItem>
                  <SelectItem value="enterprise">Enterprise - R$ 997/mês</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm text-purple-900 dark:text-purple-100">
                <strong>Novo valor:</strong> R$ {getPlanPrice(newPlan)}/mês
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setChangePlanModal(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePlan} className="bg-purple-600 hover:bg-purple-700">
              Confirmar Troca
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Reset de Senha */}
      <Dialog open={!!resetPasswordModal} onOpenChange={() => setResetPasswordModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resetar Senha</DialogTitle>
            <DialogDescription>
              Defina uma nova senha para {resetPasswordModal?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nova Senha</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-900 dark:text-yellow-100">
                <strong>Atenção:</strong> O usuário será notificado sobre a troca de senha via email.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setResetPasswordModal(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePassword} className="bg-purple-600 hover:bg-purple-700">
              Resetar Senha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserManagement;
