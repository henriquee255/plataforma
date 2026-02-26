import React, { useState } from 'react';
import {
  FaBuilding,
  FaPlus,
  FaTimes,
  FaUsers,
  FaCalendarAlt,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaEdit,
  FaTrash,
  FaCrown,
  FaUserTie,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
  FaSignOutAlt
} from 'react-icons/fa';
import { useAppContext } from './contexts/AppContext';
import { useSubscription } from './contexts/SubscriptionContext';
import UpgradeBanner from './components/UpgradeBanner';
import { useToast } from './contexts/ToastContext';
import { useConfirm } from './hooks/useConfirm';
import ConfirmDialog from './components/ConfirmDialog';

const Companies = ({ onNavigate = () => {} }) => {
  const { getCurrentPlan, companiesData } = useAppContext();
  const { currentCompany, switchCompany } = useSubscription();
  const toast = useToast();
  const { confirmState, confirm, closeConfirm } = useConfirm();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [companies, setCompanies] = useState([
    {
      id: 1,
      nome: 'Empresa Principal',
      papel: 'Proprietário',
      membros: 8,
      dataCriacao: '2024-01-15',
      ativa: true,
      logo: 'EP',
      cnpj: '12.345.678/0001-90',
      setor: 'Tecnologia',
      site: 'https://empresaprincipal.com',
      descricao: 'Empresa de desenvolvimento de software'
    },
    {
      id: 1000,
      nome: 'StartupX Tecnologia',
      papel: 'Administrador',
      membros: 5,
      dataCriacao: '2024-02-10',
      ativa: true,
      logo: 'SX',
      cnpj: '23.456.789/0001-01',
      setor: 'Tecnologia',
      site: 'https://startupx.tech',
      descricao: 'Soluções inovadoras para empresas'
    },
    {
      id: 1001,
      nome: 'Marketing Digital Plus',
      papel: 'Membro',
      membros: 12,
      dataCriacao: '2023-11-20',
      ativa: true,
      logo: 'MD',
      cnpj: '34.567.890/0001-12',
      setor: 'Marketing',
      site: 'https://marketingplus.com',
      descricao: 'Agência de marketing digital'
    },
    {
      id: 1002,
      nome: 'Consultoria Premium',
      papel: 'Administrador',
      membros: 3,
      dataCriacao: '2024-03-05',
      ativa: false,
      logo: 'CP',
      cnpj: '45.678.901/0001-23',
      setor: 'Consultoria',
      site: 'https://consultoriapremium.com.br',
      descricao: 'Consultoria empresarial especializada'
    }
  ]);

  const [newCompany, setNewCompany] = useState({
    nome: '',
    descricao: ''
  });

  // Filtrar e ordenar
  const filteredCompanies = companies.filter(company =>
    company.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    const dateA = new Date(a.dataCriacao);
    const dateB = new Date(b.dataCriacao);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const handleAddCompany = () => {
    if (newCompany.nome.trim()) {
      // Verificar plano
      const currentPlan = getCurrentPlan();
      const currentCount = companiesData.companies?.length || 0;

      // Apenas Enterprise permite múltiplas empresas
      if (!currentPlan.hasMultipleCompanies && currentCount >= 1) {
        setShowAddModal(false);
        setShowUpgradeBanner(true);
        return;
      }

      // Gerar ID: próximo ID disponível < 1000 (empresas criadas pelo usuário)
      const ownedCompanies = companies.filter(c => c.papel === 'Proprietário' && c.id < 1000);
      const nextId = ownedCompanies.length > 0
        ? Math.max(...ownedCompanies.map(c => c.id)) + 1
        : 1;

      const company = {
        id: nextId,
        nome: newCompany.nome.trim(),
        papel: 'Proprietário',
        membros: 1,
        dataCriacao: new Date().toISOString().split('T')[0],
        ativa: true,
        logo: newCompany.nome.trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
        cnpj: '',
        setor: '',
        site: '',
        descricao: newCompany.descricao || ''
      };
      setCompanies([company, ...companies]);
      setNewCompany({ nome: '', descricao: '' });
      setShowAddModal(false);
    }
  };

  const [isLoadingCompany, setIsLoadingCompany] = useState(false);
  const [loadingCompanyName, setLoadingCompanyName] = useState('');

  const handleAccessCompany = async (company) => {
    // Verificar se já está conectado
    if (currentCompany && company.id === currentCompany._id) {
      return; // Já está conectado
    }

    // Mostrar loading
    setLoadingCompanyName(company.nome);
    setIsLoadingCompany(true);

    // Simular carregamento de 2 segundos
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Trocar empresa via context
    switchCompany(company.id);
    setIsLoadingCompany(false);

    toast.success(`Conectado à empresa: ${company.nome}`, {
      description: 'Todos os dados foram atualizados para esta empresa.'
    });

    console.log('Acessar empresa:', company);
  };

  const handleEditCompany = (company) => {
    setEditingCompany({
      ...company,
      logoFile: null // Para upload de nova logo
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingCompany || !editingCompany.nome.trim()) {
      toast.error('Nome da empresa é obrigatório');
      return;
    }

    setCompanies(companies.map(c =>
      c.id === editingCompany.id
        ? {
            ...c,
            nome: editingCompany.nome.trim(),
            logo: editingCompany.logoFile ? editingCompany.logo : c.logo,
            setor: editingCompany.setor || '',
            site: editingCompany.site || '',
            descricao: editingCompany.descricao || ''
          }
        : c
    ));

    setShowEditModal(false);
    setEditingCompany(null);
    toast.success('Empresa atualizada com sucesso!');
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Em produção, faria upload para servidor
      // Por enquanto, apenas atualiza as iniciais
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditingCompany({
          ...editingCompany,
          logoFile: file,
          logo: editingCompany.nome.trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLeaveCompany = async (companyId) => {
    const company = companies.find(c => c.id === companyId);
    if (company.papel === 'Proprietário') {
      toast.warning('Proprietários não podem sair da empresa. Use "Deletar" para remover a empresa.');
      return;
    }

    const confirmed = await confirm({
      title: 'Sair da empresa',
      message: `Tem certeza que deseja sair da empresa "${company.nome}"?\n\nVocê perderá acesso a todos os dados desta empresa.`,
      confirmText: 'Sair',
      cancelText: 'Cancelar',
      type: 'warning'
    });

    if (confirmed) {
      // Se estava conectado a esta empresa, volta para a empresa principal
      if (currentCompany && currentCompany._id === companyId) {
        const empresaPrincipal = companies.find(c => c.papel === 'Proprietário' && c.id !== companyId);
        if (empresaPrincipal) {
          switchCompany(empresaPrincipal.id);
        }
      }
      setCompanies(companies.filter(c => c.id !== companyId));
      toast.success('Você saiu da empresa com sucesso.');
    }
  };

  const handleDeleteCompany = async (companyId) => {
    const company = companies.find(c => c.id === companyId);
    if (company.papel !== 'Proprietário') {
      toast.error('Apenas o proprietário pode deletar a empresa');
      return;
    }

    const confirmed = await confirm({
      title: 'Deletar empresa',
      message: `Tem certeza que deseja deletar a empresa "${company.nome}"?\n\nEsta ação não pode ser desfeita!`,
      confirmText: 'Deletar',
      cancelText: 'Cancelar',
      type: 'danger'
    });

    if (confirmed) {
      setCompanies(companies.filter(c => c.id !== companyId));
      toast.success('Empresa deletada com sucesso.');
    }
  };

  const getPapelColor = (papel) => {
    const colors = {
      'Proprietário': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
      'Administrador': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
      'Membro': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
    };
    return colors[papel] || 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-600';
  };

  const getPapelIcon = (papel) => {
    const icons = {
      'Proprietário': <FaCrown />,
      'Administrador': <FaUserTie />,
      'Membro': <FaUsers />
    };
    return icons[papel] || null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 dark:from-gray-950 dark:via-purple-950/20 dark:to-blue-950/20 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header com Glassmorphism */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 dark:from-purple-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent animate-gradient">
                Empresas
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                Gerencie suas empresas e organizações
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 text-white rounded-2xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <FaPlus className="relative z-10 group-hover:rotate-90 transition-transform duration-300" />
              <span className="relative z-10">Nova Empresa</span>
            </button>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">
            {/* Total Empresas */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800/50 shadow-lg">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center shadow-md">
                  <FaBuilding className="text-white text-xl" />
                </div>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total de Empresas</span>
              </div>
              <p className="text-4xl font-black text-gray-900 dark:text-white">{companies.length}</p>
            </div>

            {/* Empresas Ativas */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-emerald-200 dark:border-emerald-800/50 shadow-lg">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center shadow-md">
                  <FaCheckCircle className="text-white text-xl" />
                </div>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Empresas Ativas</span>
              </div>
              <p className="text-4xl font-black text-gray-900 dark:text-white">
                {companies.filter(c => c.ativa).length}
              </p>
            </div>

            {/* Proprietário */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-amber-200 dark:border-amber-800/50 shadow-lg">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center shadow-md">
                  <FaCrown className="text-white text-xl" />
                </div>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Proprietário</span>
              </div>
              <p className="text-4xl font-black text-gray-900 dark:text-white">
                {companies.filter(c => c.papel === 'Proprietário').length}
              </p>
            </div>
          </div>

          {/* Busca e Ordenação */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex items-center gap-4">
              {/* Busca */}
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 dark:text-purple-400" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Buscar empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-5 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
                  aria-label="Buscar empresa"
                />
              </div>

              {/* Ordenação - BOTÃO COM ANIMAÇÃO */}
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="p-3.5 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl transition-all duration-200 hover:scale-105"
                title={sortOrder === 'desc' ? 'Mais recentes primeiro' : 'Mais antigas primeiro'}
              >
                {sortOrder === 'desc' ? (
                  <FaSortAmountDown className="text-purple-600 dark:text-purple-400 text-lg" />
                ) : (
                  <FaSortAmountUp className="text-purple-600 dark:text-purple-400 text-lg" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Grid de Empresas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCompanies.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <FaBuilding className="text-5xl text-purple-500 dark:text-purple-400" />
              </div>
              <p className="text-xl font-bold text-gray-700 dark:text-gray-300">Nenhuma empresa encontrada</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Crie sua primeira empresa para começar</p>
            </div>
          ) : (
            sortedCompanies.map((company) => (
              <div
                key={company.id}
                className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg"
              >
                {/* Logo e Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                      {company.logo}
                    </div>
                    {company.ativa && (
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-3 border-white dark:border-gray-900 bg-emerald-500 flex items-center justify-center">
                        <FaCheckCircle className="text-white text-xs" />
                      </div>
                    )}
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${getPapelColor(company.papel)}`}>
                    {getPapelIcon(company.papel)}
                    {company.papel}
                  </div>
                </div>

                {/* Nome e ID */}
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {company.nome}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
                    ID: {company.id}
                  </p>
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <FaUsers className="text-purple-600 dark:text-purple-400" />
                    <span>{company.membros} {company.membros === 1 ? 'membro' : 'membros'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <FaCalendarAlt className="text-purple-600 dark:text-purple-400" />
                    <span>Criada em {new Date(company.dataCriacao).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                {/* Ações com Botões Animados */}
                <div className="flex gap-2">
                  {currentCompany && company.id === currentCompany._id ? (
                    <button
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold cursor-default flex items-center justify-center gap-2 shadow-md"
                      disabled
                    >
                      <FaCheckCircle />
                      Conectado
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAccessCompany(company)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <FaExternalLinkAlt className="text-sm" />
                      Acessar
                    </button>
                  )}

                  {company.papel === 'Proprietário' ? (
                    <>
                      <button
                        onClick={() => handleEditCompany(company)}
                        className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/40 hover:scale-110 transition-all duration-200"
                        title="Editar empresa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteCompany(company.id)}
                        className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-red-500/40 hover:scale-110 transition-all duration-200"
                        title="Deletar empresa"
                      >
                        <FaTrash />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleLeaveCompany(company.id)}
                      className="px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/40 hover:scale-105 transition-all duration-200 flex items-center gap-2"
                      title="Sair da empresa"
                    >
                      <FaSignOutAlt />
                      Sair
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Loading Modal ao Trocar Empresa */}
      {isLoadingCompany && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-10 text-center border-2 border-purple-200 dark:border-purple-800 shadow-2xl shadow-purple-500/50 animate-slideUp">
            {/* Logo/Ícone Animado */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full blur-2xl opacity-60 animate-pulse"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-spin-slow">
                <FaBuilding className="text-white text-5xl" />
              </div>
            </div>

            {/* Texto */}
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              Conectando...
            </h3>
            <p className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-1">
              {loadingCompanyName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Carregando dados da empresa
            </p>

            {/* Barra de Progresso */}
            <div className="mt-6 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 rounded-full animate-progress"></div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Empresa */}
      {showEditModal && editingCompany && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full border-2 border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FaEdit />
                  Editar Empresa
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCompany(null);
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FaTimes className="text-white" />
                </button>
              </div>
              <p className="text-purple-100 text-sm mt-2">ID: {editingCompany.id}</p>
            </div>

            {/* Formulário */}
            <div className="p-6 space-y-4">
              {/* Logo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Logo da Empresa
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {editingCompany.logo}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-100 dark:file:bg-purple-900/30 file:text-purple-700 dark:file:text-purple-400 hover:file:bg-purple-200 dark:hover:file:bg-purple-900/50"
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-600 mt-1">PNG, JPG até 2MB</p>
                  </div>
                </div>
              </div>

              {/* Nome */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nome da Empresa *
                </label>
                <input
                  type="text"
                  value={editingCompany.nome}
                  onChange={(e) => setEditingCompany({ ...editingCompany, nome: e.target.value })}
                  placeholder="Nome da empresa"
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Setor e Site em Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Setor
                  </label>
                  <input
                    type="text"
                    value={editingCompany.setor || ''}
                    onChange={(e) => setEditingCompany({ ...editingCompany, setor: e.target.value })}
                    placeholder="Ex: Tecnologia"
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Site
                  </label>
                  <input
                    type="url"
                    value={editingCompany.site || ''}
                    onChange={(e) => setEditingCompany({ ...editingCompany, site: e.target.value })}
                    placeholder="https://exemplo.com"
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  value={editingCompany.descricao || ''}
                  onChange={(e) => setEditingCompany({ ...editingCompany, descricao: e.target.value })}
                  placeholder="Breve descrição da empresa"
                  rows="3"
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={!editingCompany.nome.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FaCheckCircle /> Salvar Alterações
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCompany(null);
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

      {/* Modal Adicionar Empresa */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full border-2 border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaBuilding className="text-purple-600 dark:text-purple-400" />
                  Nova Empresa
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewCompany({ nome: '', descricao: '' });
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-600" />
                </button>
              </div>
            </div>

            {/* Formulário */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nome da Empresa *
                </label>
                <input
                  type="text"
                  value={newCompany.nome}
                  onChange={(e) => setNewCompany({ ...newCompany, nome: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCompany()}
                  placeholder="Digite o nome da empresa"
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Descrição (opcional)
                </label>
                <textarea
                  value={newCompany.descricao}
                  onChange={(e) => setNewCompany({ ...newCompany, descricao: e.target.value })}
                  placeholder="Breve descrição da empresa"
                  rows="3"
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddCompany}
                  disabled={!newCompany.nome.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FaPlus /> Criar Empresa
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewCompany({ nome: '', descricao: '' });
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
          feature="Múltiplas Empresas"
          requiredPlan="Enterprise"
          onClose={() => setShowUpgradeBanner(false)}
          onNavigate={onNavigate}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        type={confirmState.type}
      />
    </div>
  );
};

export default Companies;
