import React, { useState, useEffect } from 'react';
import {
  FaSearch,
  FaTimes,
  FaCheck,
  FaCreditCard,
  FaBullhorn,
  FaBolt,
  FaCog,
  FaExternalLinkAlt,
  FaSync,
  FaCircle,
  FaChevronDown,
  FaChevronUp,
  FaUsers,
  FaDollarSign,
  FaShoppingCart,
  FaTag,
  FaCalendarAlt,
  FaClock,
  FaExclamationTriangle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaChartLine,
  FaFileExport,
  FaFileExcel,
  FaFileCsv,
  FaSpinner
} from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from './contexts/AppContext';
import { useToast } from './contexts/ToastContext';
import { useSubscription } from './contexts/SubscriptionContext';
import { useConfirm } from './hooks/useConfirm';
import ConfirmDialog from './components/ConfirmDialog';
import UpgradeBanner from './components/UpgradeBanner';
import integrationService from './services/integrationService';

// TODO: Integração real com APIs das plataformas de pagamento
// TODO: Implementar webhooks para receber dados em tempo real
// TODO: Adicionar validação de credenciais de API
// TODO: Implementar sincronização automática de dados
// TODO: Adicionar retry logic para falhas de API
const Integrations = ({ integrations = [], setIntegrations = () => {}, onNavigate = () => {} }) => {
  const { getCurrentPlan, canAddIntegration, updateIntegrations, integrationsData } = useAppContext();
  const { currentCompany } = useSubscription();

  // Filtrar integrações por empresa atual
  const companyId = currentCompany?._id;

  const toast = useToast();
  const { confirmState, confirm, closeConfirm } = useConfirm();
  const currentPlan = getCurrentPlan();
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [selectedDataIntegration, setSelectedDataIntegration] = useState(null);
  const [activeDataTab, setActiveDataTab] = useState('clients'); // clients, products, sales, refunds, charts
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [realIntegrationData, setRealIntegrationData] = useState({}); // Dados reais da API
  const [isSyncing, setIsSyncing] = useState(false);

  // Fechar modais com Esc (WCAG 2.1 AA)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (showModal) {
          setShowModal(false);
          setSelectedIntegration(null);
        } else if (showDataModal) {
          setShowDataModal(false);
          setSelectedDataIntegration(null);
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showModal, showDataModal]);

  // Limpar busca quando mudar de tab
  useEffect(() => {
    setModalSearchTerm('');
  }, [activeDataTab]);

  // Logos/Ícones das plataformas (APENAS Kiwify e Hotmart)
  const getPlatformIcon = (id) => {
    const icons = {
      kiwify: (
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xl">
          🥝
        </div>
      ),
      hotmart: (
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-xl">
          🔥
        </div>
      ),
    };
    return icons[id] || (
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold text-xl">
        {id[0].toUpperCase()}
      </div>
    );
  };

  // Dados mockados de sincronização (em produção viriam da API)
  const integrationData = {
    kiwify: {
      totalClients: 1247,
      totalRevenue: 284650.50,
      totalRefunds: 12890.00,
      refundCount: 15,
      products: [
        { id: 1, name: 'Super Links - Plano Vitalício', category: 'Digital', autoTag: 'Super Links' },
        { id: 2, name: 'Super Presell - Assinatura Mensal', category: 'Digital', autoTag: 'Super Presell' },
        { id: 3, name: 'Pacote Completo - Anual', category: 'Bundle', autoTag: 'Pacote Completo' }
      ],
      recentClients: [
        {
          id: 1,
          nome: 'João Silva',
          email: 'joao.silva@email.com',
          cpf: '123.456.789-00',
          telefone: '+55 11 98765-4321',
          product: 'Super Links - Plano Vitalício',
          type: 'Vitalício',
          value: 497.00,
          date: '2026-02-23',
          time: '14:30',
          status: 'Aprovado'
        },
        {
          id: 2,
          nome: 'Maria Santos',
          email: 'maria.santos@email.com',
          cpf: '234.567.890-11',
          telefone: '+55 11 98765-4322',
          product: 'Super Presell - Assinatura Mensal',
          type: 'Mensal',
          value: 97.00,
          date: '2026-02-23',
          time: '13:15',
          status: 'Aprovado'
        },
        {
          id: 3,
          nome: 'Pedro Costa',
          email: 'pedro.costa@email.com',
          cpf: '345.678.901-22',
          telefone: '+55 11 98765-4323',
          product: 'Pacote Completo - Anual',
          type: 'Anual',
          value: 1497.00,
          date: '2026-02-23',
          time: '12:45',
          status: 'Aprovado'
        },
        {
          id: 4,
          nome: 'Ana Paula',
          email: 'ana.paula@email.com',
          cpf: '456.789.012-33',
          telefone: '+55 11 98765-4324',
          product: 'Super Links - Plano Vitalício',
          type: 'Vitalício',
          value: 497.00,
          date: '2026-02-23',
          time: '11:20',
          status: 'Reembolsado'
        },
        {
          id: 5,
          nome: 'Carlos Eduardo',
          email: 'carlos.eduardo@email.com',
          cpf: '567.890.123-44',
          telefone: '+55 11 98765-4325',
          product: 'Super Presell - Assinatura Mensal',
          type: 'Mensal',
          value: 97.00,
          date: '2026-02-23',
          time: '10:05',
          status: 'Aprovado'
        }
      ]
    },
    stripe: {
      totalClients: 892,
      totalRevenue: 156780.00,
      totalRefunds: 8950.00,
      refundCount: 12,
      products: [
        { id: 1, name: 'Assinatura Premium - Mensal', category: 'Subscription', autoTag: 'Premium' },
        { id: 2, name: 'Assinatura Basic - Mensal', category: 'Subscription', autoTag: 'Basic' }
      ],
      recentClients: [
        {
          id: 1,
          nome: 'Robert Johnson',
          email: 'robert.j@email.com',
          cpf: 'N/A',
          telefone: '+1 555-1234',
          product: 'Assinatura Premium - Mensal',
          type: 'Mensal',
          value: 49.99,
          date: '2026-02-23',
          time: '16:00',
          status: 'Aprovado'
        },
        {
          id: 2,
          nome: 'Sarah Williams',
          email: 'sarah.w@email.com',
          cpf: 'N/A',
          telefone: '+1 555-5678',
          product: 'Assinatura Basic - Mensal',
          type: 'Mensal',
          value: 29.99,
          date: '2026-02-23',
          time: '15:30',
          status: 'Aprovado'
        }
      ]
    },
    hotmart: {
      totalClients: 0,
      totalRevenue: 0,
      totalRefunds: 0,
      refundCount: 0,
      products: [],
      recentClients: []
    }
  };

  const [formData, setFormData] = useState({});

  // Filtrar integrações por empresa atual e outros critérios
  const baseIntegrations = integrationsData?.integrations || integrations || [];
  const filteredIntegrations = baseIntegrations
    .filter(integration => integration.companyId === companyId || !companyId) // Filtrar por empresa
    .filter(integration => {
      const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || integration.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || integration.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });

  // Agrupar por categoria
  const groupedIntegrations = {
    payments: filteredIntegrations.filter(i => i.category === 'payments')
  };

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'payments', label: 'Pagamentos' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'active', label: 'Ativas' },
    { value: 'inactive', label: 'Inativas' }
  ];

  const categoryLabels = {
    payments: 'PAGAMENTOS'
  };

  const handleOpenModal = (integration) => {
    setSelectedIntegration(integration);
    const initialData = {};
    integration.fields.forEach(field => {
      initialData[field.name] = field.value || '';
    });
    setFormData(initialData);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedIntegration(null);
    setFormData({});
  };

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const validateCredentials = async (integration, credentials) => {
    // Simula validação de API (em produção, faria requisição real)
    return new Promise((resolve) => {
      setTimeout(() => {
        // Validações básicas de formato
        if (integration.id === 'kiwify' || integration.id === 'hotmart') {
          // Para Kiwify, o client_secret é a chave principal de autenticação
          const apiKey = credentials['client_secret'] || credentials['api_key'] || credentials['token'];

          // Validar formato da chave (mínimo 20 caracteres)
          if (!apiKey || apiKey.length < 20) {
            resolve({
              valid: false,
              message: 'Client Secret inválido. Deve ter pelo menos 20 caracteres.'
            });
            return;
          }

          // Validar se não é placeholder
          if (apiKey.includes('seu') || apiKey.includes('xxx')) {
            resolve({
              valid: false,
              message: 'Por favor, insira um Client Secret real, não um placeholder.'
            });
            return;
          }

          // Validar campos obrigatórios da Kiwify
          if (integration.id === 'kiwify') {
            if (!credentials['client_id']) {
              resolve({ valid: false, message: 'Client ID é obrigatório.' });
              return;
            }
            if (!credentials['account_id']) {
              resolve({ valid: false, message: 'Account ID é obrigatório.' });
              return;
            }
          }

          // Em produção, faria: await fetch(`${integration.api}/validate`, { headers: { 'X-API-Key': apiKey }})
          resolve({ valid: true, message: 'Credenciais válidas!' });
        } else {
          resolve({ valid: true, message: 'Credenciais válidas!' });
        }
      }, 1500); // Simula latência de rede
    });
  };

  const handleConnect = async () => {
    if (!selectedIntegration) return;

    // Verificar limite de integrações baseado no plano
    const activeIntegrations = integrations.filter(i => i.status === 'active').length;
    if (!canAddIntegration(activeIntegrations)) {
      setShowModal(false);
      setShowUpgradeBanner(true);
      return;
    }

    const requiredFields = selectedIntegration.fields.filter(f => f.required);
    const missingFields = requiredFields.filter(f => !formData[f.name]);

    if (missingFields.length > 0) {
      toast.warning(`Por favor, preencha: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    // Validar credenciais e conectar com backend
    setIsValidating(true);
    toast.info('Conectando com ' + selectedIntegration.name + '...', 2000);

    try {
      // Chamar backend para conectar REALMENTE
      console.log('🔗 Conectando ao backend:', selectedIntegration.platform);
      const result = await integrationService.connectIntegration(selectedIntegration.platform, formData);

      if (!result.success) {
        toast.error(result.message || 'Erro ao conectar');
        setIsValidating(false);
        return;
      }

      console.log('✅ Conectado com sucesso ao backend!');

      // Credenciais válidas, atualizar estado local
      const updatedIntegrations = integrations.map(integration => {
        if (integration.id === selectedIntegration.id) {
          return {
            ...integration,
            status: 'active',
            lastSync: new Date().toLocaleString('pt-BR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }),
            hasData: true,
            credentials: formData // Salvar credenciais (em produção, criptografadas)
          };
        }
        return integration;
      });

      setIntegrations(updatedIntegrations);
      updateIntegrations({ integrations: updatedIntegrations });

      toast.success(`${selectedIntegration.name} conectado com sucesso!`);
      handleCloseModal();
    } catch (error) {
      console.error('❌ Erro completo:', error);
      console.error('❌ Mensagem:', error.message);
      console.error('❌ Stack:', error.stack);
      toast.error('Erro: ' + (error.message || 'Erro ao validar credenciais. Tente novamente.'));
    } finally {
      setIsValidating(false);
    }
  };

  const handleDisconnect = async () => {
    if (!selectedIntegration) return;

    const confirmed = await confirm({
      title: 'Desconectar integração',
      message: `Deseja realmente desconectar ${selectedIntegration.name}?\n\nVocê perderá acesso aos dados sincronizados desta plataforma.`,
      confirmText: 'Desconectar',
      cancelText: 'Cancelar',
      type: 'warning'
    });

    if (!confirmed) return;

    const updatedIntegrations = integrations.map(integration => {
      if (integration.id === selectedIntegration.id) {
        return {
          ...integration,
          status: 'inactive',
          lastSync: undefined,
          hasData: false
        };
      }
      return integration;
    });

    setIntegrations(updatedIntegrations);

    // Salvar no AppContext também
    updateIntegrations({ integrations: updatedIntegrations });

    toast.success(`${selectedIntegration.name} desconectado com sucesso!`);
    handleCloseModal();
  };

  const handleSyncData = async (integration) => {
    if (!integration.hasData) {
      toast.warning('Esta integração ainda não possui dados sincronizados. Conecte-a para começar a receber dados.');
      return;
    }

    // Tentar buscar dados reais da API
    setIsSyncing(true);
    console.log('🔄 Sincronizando dados de:', integration.platform);
    try {
      const response = await integrationService.syncIntegrationWithFallback(integration.platform);

      if (response.success) {
        // Atualizar dados reais
        setRealIntegrationData(prev => ({
          ...prev,
          [integration.id]: response.data
        }));

        // Atualizar integração com dados
        const updatedIntegration = {
          ...integration,
          stats: {
            totalClientes: response.data.totalClients || 0,
            totalVendas: response.data.totalRevenue || 0,
            totalReembolsos: response.data.totalRefunds || 0,
            clientesReembolsados: response.data.refundCount || 0
          },
          customers: response.data.recentClients || [],
          products: response.data.products || []
        };

        setSelectedDataIntegration(updatedIntegration);
        toast.success('Dados sincronizados com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao sincronizar dados:', error);
      toast.error('Erro ao sincronizar. Usando dados locais.');
      // Fallback para dados mockados
      setSelectedDataIntegration(integration);
    } finally {
      setIsSyncing(false);
      setActiveDataTab('charts');
      setShowDataModal(true);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'Vitalício': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
      'Anual': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      'Mensal': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
    };
    return colors[type] || 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-600';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Aprovado': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      'Reembolsado': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      'Pendente': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-600';
  };

  // Funções de Exportação CSV/Excel
  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      toast.error('Não há dados para exportar');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          // Escapar valores que contenham vírgulas ou aspas
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportClients = () => {
    if (!selectedDataIntegration || !selectedDataIntegration.customers) {
      toast.error('Não há dados para exportar');
      return;
    }

    const clients = selectedDataIntegration.customers.map(c => ({
      Nome: c.nome,
      Email: c.email,
      CPF: c.cpf,
      Telefone: c.telefone,
      Produto: c.produto,
      'Tipo Pagamento': c.tipoPagamento === 'vitalicia' ? 'Vitalícia' : c.tipoPagamento === 'mensal' ? 'Mensal' : c.tipoPagamento === 'anual' ? 'Anual' : c.tipoPagamento,
      Valor: `R$ ${c.valor.toFixed(2)}`,
      Data: new Date(c.dataCompra).toLocaleDateString('pt-BR'),
      Hora: c.horaCompra,
      Status: c.status === 'approved' ? 'Aprovado' : c.status === 'refunded' ? 'Reembolsado' : c.status,
      Reembolsado: c.reembolsado ? 'Sim' : 'Não'
    }));

    exportToCSV(clients, `clientes_${selectedDataIntegration.id}_${new Date().toISOString().split('T')[0]}`);
    toast.success(`${clients.length} clientes exportados com sucesso!`);
  };

  const handleExportSales = () => {
    if (!selectedDataIntegration || !selectedDataIntegration.customers) {
      toast.error('Não há dados para exportar');
      return;
    }

    const sales = selectedDataIntegration.customers
      .filter(s => s.status === 'approved')
      .map(s => ({
        Cliente: s.nome,
        Email: s.email,
        Produto: s.produto,
        'Tipo Pagamento': s.tipoPagamento === 'vitalicia' ? 'Vitalícia' : s.tipoPagamento === 'mensal' ? 'Mensal' : s.tipoPagamento === 'anual' ? 'Anual' : s.tipoPagamento,
        Valor: `R$ ${s.valor.toFixed(2)}`,
        Data: new Date(s.dataCompra).toLocaleDateString('pt-BR'),
        Hora: s.horaCompra
      }));

    if (sales.length === 0) {
      toast.error('Não há vendas para exportar');
      return;
    }

    exportToCSV(sales, `vendas_${selectedDataIntegration.id}_${new Date().toISOString().split('T')[0]}`);
    toast.success(`${sales.length} vendas exportadas com sucesso!`);
  };

  const handleExportRefunds = () => {
    if (!selectedDataIntegration || !selectedDataIntegration.customers) {
      toast.error('Não há dados para exportar');
      return;
    }

    const refunds = selectedDataIntegration.customers
      .filter(r => r.reembolsado)
      .map(r => ({
        Cliente: r.nome,
        Email: r.email,
        CPF: r.cpf,
        Telefone: r.telefone,
        Produto: r.produto,
        Valor: `R$ ${r.valor.toFixed(2)}`,
        Data: new Date(r.dataCompra).toLocaleDateString('pt-BR'),
        Hora: r.horaCompra
      }));

    if (refunds.length === 0) {
      toast.error('Não há reembolsos para exportar');
      return;
    }

    exportToCSV(refunds, `reembolsos_${selectedDataIntegration.id}_${new Date().toISOString().split('T')[0]}`);
    toast.success(`${refunds.length} reembolsos exportados com sucesso!`);
  };

  const handleExportProducts = () => {
    if (!selectedDataIntegration || !selectedDataIntegration.products) {
      toast.error('Não há dados para exportar');
      return;
    }

    const products = selectedDataIntegration.products.map(p => ({
      Nome: p.name,
      Preço: `R$ ${p.price.toFixed(2)}`,
      Tipo: p.type === 'vitalicia' ? 'Vitalícia' : p.type === 'mensal' ? 'Mensal' : p.type === 'anual' ? 'Anual' : p.type,
      'Tag Automática': p.name
    }));

    exportToCSV(products, `produtos_${selectedDataIntegration.id}_${new Date().toISOString().split('T')[0]}`);
    toast.success(`${products.length} produtos exportados com sucesso!`);
  };

  // Filtrar dados do modal por termo de busca
  const filterModalData = (clients) => {
    if (!modalSearchTerm) return clients;

    const term = modalSearchTerm.toLowerCase();
    return clients.filter(client =>
      client.nome?.toLowerCase().includes(term) ||
      client.email?.toLowerCase().includes(term) ||
      client.cpf?.includes(term) ||
      client.telefone?.includes(term) ||
      client.product?.toLowerCase().includes(term)
    );
  };

  // Dados para gráficos
  const getChartsData = () => {
    if (!selectedDataIntegration || !selectedDataIntegration.customers) return null;

    // Vendas por tipo
    const salesByType = {
      'Vitalícia': 0,
      'Anual': 0,
      'Mensal': 0
    };

    selectedDataIntegration.customers.forEach(customer => {
      if (customer.status === 'approved') {
        const tipo = customer.tipoPagamento === 'vitalicia' ? 'Vitalícia' :
                     customer.tipoPagamento === 'mensal' ? 'Mensal' :
                     customer.tipoPagamento === 'anual' ? 'Anual' : customer.tipoPagamento;
        if (salesByType[tipo] !== undefined) {
          salesByType[tipo] += customer.valor;
        }
      }
    });

    const pieData = Object.entries(salesByType)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));

    // Vendas por produto
    const productSales = {};
    selectedDataIntegration.customers.forEach(customer => {
      if (customer.status === 'approved') {
        const productName = customer.produto;
        productSales[productName] = (productSales[productName] || 0) + customer.valor;
      }
    });

    const barData = Object.entries(productSales)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return { pieData, barData };
  };

  const COLORS = ['#9333ea', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-8">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">
            Integrações
          </h1>
          <p className="text-gray-600 dark:text-gray-600">
            Conecte suas plataformas de pagamento e sincronize dados automaticamente
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" aria-hidden="true" />
            <input
              type="text"
              placeholder="Buscar integração..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 transition-all"
              aria-label="Buscar integração"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 transition-all"
            aria-label="Filtrar por categoria"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 transition-all"
          >
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>

        {/* Lista de Integrações por Categoria */}
        {Object.entries(groupedIntegrations).map(([category, items]) => {
          if (items.length === 0) return null;

          return (
            <div key={category} className="mb-8">
              <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                <FaCreditCard className="text-purple-600" />
                {categoryLabels[category]}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map(integration => (
                  <div
                    key={integration.id}
                    className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 hover:border-purple-500 dark:hover:border-purple-500 transition-all hover:shadow-lg group"
                  >
                    {/* Ícone e Status */}
                    <div className="flex items-start justify-between mb-4">
                      {getPlatformIcon(integration.id)}
                      <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                        integration.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-600'
                      }`}>
                        <FaCircle className="text-[6px]" />
                        {integration.status === 'active' ? 'Ativo' : 'Inativo'}
                      </div>
                    </div>

                    {/* Nome */}
                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {integration.name}
                    </h3>

                    {/* Descrição */}
                    <p className="text-sm text-gray-600 dark:text-gray-600 mb-4">
                      {integration.description}
                    </p>

                    {/* Última Sincronização */}
                    {integration.lastSync && (
                      <div className="text-xs text-gray-600 dark:text-gray-600 flex items-center gap-1 mb-3">
                        <FaSync className="text-[10px]" />
                        Sync: {integration.lastSync}
                      </div>
                    )}

                    {/* Botões de Ação */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOpenModal(integration)}
                        className="py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg text-sm font-semibold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all flex items-center justify-center gap-1"
                      >
                        <FaCog className="text-xs" />
                        Config
                      </button>
                      {integration.status === 'active' && (
                        <button
                          onClick={() => handleSyncData(integration)}
                          className="py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all flex items-center justify-center gap-1"
                        >
                          <FaChartLine className="text-xs" />
                          Dados
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Nenhum resultado */}
        {filteredIntegrations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-600 text-lg">
              Nenhuma integração encontrada
            </p>
          </div>
        )}
      </div>

      {/* Modal de Configuração */}
      {showModal && selectedIntegration && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header do Modal */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getPlatformIcon(selectedIntegration.id)}
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedIntegration.name}
                  </h2>
                  <p className="text-purple-100 text-sm">
                    {selectedIntegration.description}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
              >
                <FaTimes />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6">
              {/* Status Atual */}
              <div className={`mb-6 p-4 rounded-xl border-2 ${
                selectedIntegration.status === 'active'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Status da Integração
                    </p>
                    <p className={`text-lg font-bold ${
                      selectedIntegration.status === 'active'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-600 dark:text-gray-600'
                    }`}>
                      {selectedIntegration.status === 'active' ? 'Conectado' : 'Desconectado'}
                    </p>
                  </div>
                  {selectedIntegration.lastSync && (
                    <div className="text-right">
                      <p className="text-xs text-gray-600 dark:text-gray-600">Última Sincronização</p>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {selectedIntegration.lastSync}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Instruções */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <FaExternalLinkAlt className="text-sm" />
                  Como obter as credenciais
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  {selectedIntegration.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>

              {/* Formulário */}
              <div className="space-y-4 mb-6">
                {selectedIntegration.fields.map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      type={field.type}
                      value={formData[field.name] || field.value || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      readOnly={field.readonly}
                      className={`w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 transition-all ${
                        field.readonly ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3">
                {selectedIntegration.status === 'inactive' ? (
                  <button
                    onClick={handleConnect}
                    disabled={isValidating}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isValidating ? (
                      <>
                        <FaSpinner className="animate-spin" /> Validando...
                      </>
                    ) : (
                      <>
                        <FaCheck /> Conectar
                      </>
                    )}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleConnect}
                      disabled={isValidating}
                      className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isValidating ? (
                        <>
                          <FaSpinner className="animate-spin" /> Validando...
                        </>
                      ) : (
                        <>
                          <FaCheck /> Salvar Alterações
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleDisconnect}
                      disabled={isValidating}
                      className="px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Desconectar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Dados da Integração */}
      {showDataModal && selectedDataIntegration && (() => {
        // Usa dados reais da API se disponíveis, senão usa dados mock
        const currentData = realIntegrationData[selectedDataIntegration.id] || integrationData[selectedDataIntegration.id];

        if (!currentData) return null;

        return (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDataModal(false);
              setSelectedDataIntegration(null);
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Header do Modal */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getPlatformIcon(selectedDataIntegration.id)}
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Dados de {selectedDataIntegration.name}
                  </h2>
                  <p className="text-purple-100 text-sm">
                    Clientes, produtos e vendas sincronizados
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDataModal(false);
                  setSelectedDataIntegration(null);
                }}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
              >
                <FaTimes />
              </button>
            </div>

            {/* Métricas Rápidas */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaUsers className="text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-600 uppercase">Total Clientes</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {selectedDataIntegration.stats?.totalClientes || 0}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaDollarSign className="text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-600 uppercase">Receita Total</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    R$ {(selectedDataIntegration.stats?.totalVendas || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaShoppingCart className="text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-600 uppercase">Produtos</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {selectedDataIntegration.products?.length || 0}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaExclamationTriangle className="text-red-600 dark:text-red-400" />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-600 uppercase">Reembolsos</span>
                  </div>
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">
                    R$ {(selectedDataIntegration.stats?.totalReembolsos || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-600">
                    {selectedDataIntegration.stats?.clientesReembolsados || 0} reembolsos
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs e Busca */}
            <div className="px-6 pt-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveDataTab('charts')}
                    className={`px-4 py-2 font-semibold transition-all border-b-2 ${
                      activeDataTab === 'charts'
                        ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                        : 'border-transparent text-gray-600 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    📊 Gráficos
                  </button>
                  <button
                    onClick={() => setActiveDataTab('clients')}
                    className={`px-4 py-2 font-semibold transition-all border-b-2 ${
                      activeDataTab === 'clients'
                        ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                        : 'border-transparent text-gray-600 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Clientes
                  </button>
                  <button
                    onClick={() => setActiveDataTab('products')}
                    className={`px-4 py-2 font-semibold transition-all border-b-2 ${
                      activeDataTab === 'products'
                        ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                        : 'border-transparent text-gray-600 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Produtos & Tags
                  </button>
                  <button
                    onClick={() => setActiveDataTab('sales')}
                    className={`px-4 py-2 font-semibold transition-all border-b-2 ${
                      activeDataTab === 'sales'
                        ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                        : 'border-transparent text-gray-600 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Últimas Vendas
                  </button>
                  <button
                    onClick={() => setActiveDataTab('refunds')}
                    className={`px-4 py-2 font-semibold transition-all border-b-2 ${
                      activeDataTab === 'refunds'
                        ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                        : 'border-transparent text-gray-600 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Reembolsos
                  </button>
                </div>

                {/* Campo de Busca */}
                {activeDataTab !== 'charts' && (
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm" aria-hidden="true" />
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={modalSearchTerm}
                      onChange={(e) => setModalSearchTerm(e.target.value)}
                      className="w-64 pl-9 pr-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:border-purple-500 transition-all"
                      aria-label="Buscar no modal"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Conteúdo das Tabs */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Tab: Gráficos */}
              {activeDataTab === 'charts' && (() => {
                const chartsData = getChartsData();
                if (!chartsData) return null;

                return (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      Análise Visual de Vendas
                    </h3>

                    {/* Gráfico de Pizza - Receita por Tipo */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4">Receita por Tipo de Compra</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={chartsData.pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {chartsData.pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Gráfico de Barras - Receita por Produto */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4">Receita por Produto</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartsData.barData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis
                            dataKey="name"
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af' }}
                          />
                          <YAxis
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af' }}
                            tickFormatter={(value) => `R$ ${value}`}
                          />
                          <Tooltip
                            formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                            contentStyle={{
                              backgroundColor: '#1f2937',
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }}
                            labelStyle={{ color: '#fff' }}
                          />
                          <Legend />
                          <Bar dataKey="value" fill="#9333ea" name="Receita" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })()}

              {/* Tab: Clientes */}
              {activeDataTab === 'clients' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Lista de Clientes ({selectedDataIntegration.customers?.length || 0} total)
                    </h3>
                    <button
                      onClick={handleExportClients}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-all"
                    >
                      <FaFileExcel />
                      Exportar CSV
                    </button>
                  </div>
                  {(selectedDataIntegration.customers || [])
                    .filter(client =>
                      !modalSearchTerm ||
                      client.nome.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
                      client.email.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
                      client.cpf.includes(modalSearchTerm) ||
                      client.telefone.includes(modalSearchTerm)
                    )
                    .map(client => (
                    <div key={client.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-600 mb-1">Nome</p>
                          <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <FaUser className="text-xs text-purple-600 dark:text-purple-400" />
                            {client.nome}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-600 mb-1">Email</p>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                            <FaEnvelope className="text-xs text-purple-600 dark:text-purple-400" />
                            {client.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-600 mb-1">Telefone</p>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                            <FaPhone className="text-xs text-purple-600 dark:text-purple-400" />
                            {client.telefone}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-600 mb-1">CPF</p>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                            <FaIdCard className="text-xs text-purple-600 dark:text-purple-400" />
                            {client.cpf}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab: Produtos & Tags */}
              {activeDataTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Produtos Sincronizados (Tags Automáticas)
                    </h3>
                    <button
                      onClick={handleExportProducts}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                    >
                      <FaFileExcel />
                      Exportar CSV
                    </button>
                  </div>
                  {(selectedDataIntegration.products || []).map(product => (
                    <div key={product.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white mb-2">{product.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-600 mb-3">
                            Preço: R$ {product.price.toFixed(2)} | Tipo: {
                              product.type === 'vitalicia' ? 'Vitalícia' :
                              product.type === 'mensal' ? 'Mensal' :
                              product.type === 'anual' ? 'Anual' : product.type
                            }
                          </p>
                          <div className="flex items-center gap-2">
                            <FaTag className="text-purple-600 dark:text-purple-400" />
                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-600">Tag Automática:</span>
                            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold">
                              {product.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
                    <p className="text-sm text-blue-900 dark:text-blue-300">
                      <strong>💡 Tags Automáticas:</strong> Sempre que um cliente compra um produto, a tag correspondente é automaticamente criada e atribuída ao contato.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab: Últimas Vendas */}
              {activeDataTab === 'sales' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Relatório de Últimas Vendas
                    </h3>
                    <button
                      onClick={handleExportSales}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all"
                    >
                      <FaFileExcel />
                      Exportar CSV
                    </button>
                  </div>
                  {(selectedDataIntegration.customers || [])
                    .filter(sale => !modalSearchTerm || sale.nome.toLowerCase().includes(modalSearchTerm.toLowerCase()) || sale.produto.toLowerCase().includes(modalSearchTerm.toLowerCase()))
                    .slice()
                    .sort((a, b) => new Date(b.dataCompra) - new Date(a.dataCompra))
                    .map(sale => (
                    <div key={sale.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white mb-1">{sale.nome}</h4>
                          <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">{sale.produto}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            R$ {sale.valor.toFixed(2)}
                          </p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold mt-1 ${
                            sale.status === 'approved' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                            sale.status === 'refunded' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                            'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
                          }`}>
                            {sale.status === 'approved' ? 'Aprovado' : sale.status === 'refunded' ? 'Reembolsado' : sale.status}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-600 mb-1">Tipo</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                            sale.tipoPagamento === 'vitalicia' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                            sale.tipoPagamento === 'mensal' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                            sale.tipoPagamento === 'anual' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                            'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
                          }`}>
                            {sale.tipoPagamento === 'vitalicia' ? 'Vitalícia' : sale.tipoPagamento === 'mensal' ? 'Mensal' : sale.tipoPagamento === 'anual' ? 'Anual' : sale.tipoPagamento}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-600 mb-1">Data</p>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-1">
                            <FaCalendarAlt className="text-xs" />
                            {new Date(sale.dataCompra).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-600 mb-1">Hora</p>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-1">
                            <FaClock className="text-xs" />
                            {sale.horaCompra}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab: Reembolsos */}
              {activeDataTab === 'refunds' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Reembolsos Processados ({(selectedDataIntegration.customers || []).filter(c => c.reembolsado).length} total)
                    </h3>
                    <button
                      onClick={handleExportRefunds}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
                    >
                      <FaFileExcel />
                      Exportar CSV
                    </button>
                  </div>
                  {(selectedDataIntegration.customers || [])
                    .filter(refund => refund.reembolsado && (!modalSearchTerm || refund.nome.toLowerCase().includes(modalSearchTerm.toLowerCase())))
                    .map(refund => (
                      <div key={refund.id} className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-1">{refund.nome}</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{refund.produto}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                              -R$ {refund.valor.toFixed(2)}
                            </p>
                            <span className="inline-block px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-bold mt-1">
                              Reembolsado
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-red-200 dark:border-red-800">
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-600 mb-1">Data do Reembolso</p>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-1">
                              <FaCalendarAlt className="text-xs" />
                              {new Date(refund.dataCompra).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-600 mb-1">Hora</p>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-1">
                              <FaClock className="text-xs" />
                              {refund.horaCompra}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  {currentData.recentClients.filter(s => s.status === 'Reembolsado').length === 0 && (
                    <div className="text-center py-12">
                      <FaCheck className="text-5xl text-green-500 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-600">Nenhum reembolso registrado</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        );
      })()}

      {/* Upgrade Banner */}
      {showUpgradeBanner && (
        <UpgradeBanner
          feature="Integrações Ilimitadas com Kiwify e Hotmart"
          requiredPlan="Professional"
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

export default Integrations;
