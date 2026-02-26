import React, { useState, useMemo } from 'react';
import { FaUsers, FaEnvelopeOpenText, FaCheckCircle, FaUserSlash, FaComments, FaCalendarAlt, FaClock, FaChartLine, FaShoppingCart, FaDollarSign, FaCreditCard, FaBarcode, FaQrcode, FaUndo } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import TrialBanner from './components/TrialBanner';

/**
 * Componente principal do Dashboard
 * Exibe métricas de atendimento ou vendas dependendo da plataforma selecionada
 * @param {Object} props
 * @param {Array} props.integrations - Lista de integrações ativas
 * @param {Function} props.onNavigate - Função de navegação entre páginas
 * @returns {JSX.Element}
 */
const Dashboard = ({ integrations = [], onNavigate }) => {
  // Período sempre com data atual (últimos 30 dias até hoje)
  const dataAtual = new Date();
  const dataInicioDefault = new Date(dataAtual.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 dias atrás

  const [dataInicio, setDataInicio] = useState(dataInicioDefault.toISOString().split('T')[0]);
  const [dataFim, setDataFim] = useState(dataAtual.toISOString().split('T')[0]);
  const [dashboardSelecionado, setDashboardSelecionado] = useState('principal');

  // Filtrar apenas plataformas ativas ou conectadas
  const plataformasAtivas = integrations.filter(int =>
    int.status === 'active' || int.status === 'connected'
  );

  // Obter nome da plataforma selecionada
  const getNomePlataforma = () => {
    if (dashboardSelecionado === 'principal') return '';
    const plataforma = plataformasAtivas.find(p => p.id === dashboardSelecionado);
    return plataforma ? plataforma.name : '';
  };

  // Clientes esperando há mais de 30 minutos (vazio por padrão)
  const clientesEsperando = useMemo(() => {
    return []; // Sem dados mockados
  }, []);

  // Função para calcular tempo de espera
  const calcularTempoEspera = (dataInicial) => {
    const diffMs = Date.now() - dataInicial.getTime();
    const diffMinutos = Math.floor(diffMs / 60000);

    if (diffMinutos < 60) {
      return `${diffMinutos} min`;
    } else {
      const horas = Math.floor(diffMinutos / 60);
      const minutos = diffMinutos % 60;
      return `${horas}h ${minutos}min`;
    }
  };

  // Função para formatar hora da última mensagem
  const formatarHora = (data) => {
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // Função para verificar se uma data está no período selecionado
  const isDateInRange = (dateString) => {
    if (!dataInicio || !dataFim) return true;

    // Converter "17/02" para Date do ano atual
    const [dia, mes] = dateString.split('/');
    const anoAtual = new Date().getFullYear();
    const dataVenda = new Date(anoAtual, parseInt(mes) - 1, parseInt(dia));

    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    return dataVenda >= inicio && dataVenda <= fim;
  };

  // Filtrar vendas por período (preparado para dados reais)
  const filtrarVendasPorPeriodo = (vendas) => {
    if (!vendas) return [];
    // NOTA: Atualmente dados são mockados. Quando conectar com backend,
    // esta função filtrará vendas reais baseadas em dataInicio e dataFim
    return vendas.filter(venda => isDateInRange(venda.dia));
  };

  // Dados do gráfico de pico de clientes por hora
  const picoClientesPorHora = [
    { hora: '00', clientes: 12 },
    { hora: '01', clientes: 8 },
    { hora: '02', clientes: 5 },
    { hora: '03', clientes: 3 },
    { hora: '04', clientes: 4 },
    { hora: '05', clientes: 7 },
    { hora: '06', clientes: 15 },
    { hora: '07', clientes: 28 },
    { hora: '08', clientes: 45 },
    { hora: '09', clientes: 62 },
    { hora: '10', clientes: 78 },
    { hora: '11', clientes: 85 },
    { hora: '12', clientes: 72 },
    { hora: '13', clientes: 68 },
    { hora: '14', clientes: 82 },
    { hora: '15', clientes: 95 },
    { hora: '16', clientes: 88 },
    { hora: '17', clientes: 76 },
    { hora: '18', clientes: 58 },
    { hora: '19', clientes: 42 },
    { hora: '20', clientes: 35 },
    { hora: '21', clientes: 28 },
    { hora: '22', clientes: 22 },
    { hora: '23', clientes: 18 }
  ];

  // Contar clientes atribuídos que ainda não foram atendidos (otimizado)
  const clientesAtribuidosEsperando = useMemo(() => {
    return clientesEsperando.filter(cliente => cliente.atribuidoPara && !cliente.foiAtendido).length;
  }, [clientesEsperando]);

  // Dados das plataformas de vendas
  const platformData = {
    kiwify: {
      totalVendas: 248,
      valorTotal: 89450.00,
      metodoPagamento: { cartao: 145, pix: 87, boleto: 16 },
      tipoCompra: { vitalicio: 98, anual: 102, mensal: 48 },
      vendasPorDia: [
        { dia: '17/02', vendas: 12, valor: 4200 },
        { dia: '18/02', vendas: 18, valor: 6300 },
        { dia: '19/02', vendas: 15, valor: 5100 },
        { dia: '20/02', vendas: 25, valor: 8900 },
        { dia: '21/02', vendas: 32, valor: 11800 },
        { dia: '22/02', vendas: 28, valor: 9850 },
        { dia: '23/02', vendas: 35, valor: 12450 }
      ],
      ultimasVendas: [
        { id: 1, cliente: 'João Silva', produto: 'Curso Completo de Python', valor: 497.00, metodo: 'Cartão de Crédito', data: '23/02/2026 14:35' },
        { id: 2, cliente: 'Maria Santos', produto: 'Mentoria Premium', valor: 1997.00, metodo: 'PIX', data: '23/02/2026 13:22' },
        { id: 3, cliente: 'Pedro Costa', produto: 'E-book Avançado', valor: 97.00, metodo: 'Cartão de Crédito', data: '23/02/2026 12:18' },
        { id: 4, cliente: 'Ana Oliveira', produto: 'Curso Completo de Python', valor: 497.00, metodo: 'PIX', data: '23/02/2026 11:45' }
      ],
      totalReembolsos: 8,
      valorReembolsos: 2485.00
    },
    stripe: {
      totalVendas: 186,
      valorTotal: 78920.00,
      metodoPagamento: { cartao: 172, pix: 14, boleto: 0 },
      tipoCompra: { vitalicio: 45, anual: 98, mensal: 43 },
      vendasPorDia: [
        { dia: '17/02', vendas: 10, valor: 3800 },
        { dia: '18/02', vendas: 14, valor: 5200 },
        { dia: '19/02', vendas: 18, valor: 6900 },
        { dia: '20/02', vendas: 22, valor: 8500 },
        { dia: '21/02', vendas: 28, valor: 10800 },
        { dia: '22/02', vendas: 25, valor: 9420 },
        { dia: '23/02', vendas: 30, valor: 11650 }
      ],
      ultimasVendas: [
        { id: 1, cliente: 'Thomas Anderson', produto: 'SaaS Premium Plan', valor: 997.00, metodo: 'Cartão de Crédito', data: '23/02/2026 15:45' },
        { id: 2, cliente: 'Sarah Connor', produto: 'Enterprise License', valor: 2497.00, metodo: 'Cartão de Crédito', data: '23/02/2026 14:30' },
        { id: 3, cliente: 'John Wick', produto: 'Professional Plan', valor: 497.00, metodo: 'Cartão de Crédito', data: '23/02/2026 13:15' }
      ],
      totalReembolsos: 5,
      valorReembolsos: 1890.00
    }
  };

  // Função para obter ícone do método de pagamento
  const getPaymentIcon = (metodo) => {
    if (metodo.includes('Cartão')) return <FaCreditCard className="text-blue-500" aria-hidden="true" />;
    if (metodo.includes('PIX')) return <FaQrcode className="text-teal-500" aria-hidden="true" />;
    if (metodo.includes('Boleto')) return <FaBarcode className="text-orange-500" aria-hidden="true" />;
    return null;
  };

  const cards = [
    {
      title: 'Total de Contatos',
      value: '1,234',
      icon: <FaUsers aria-hidden="true" />,
      bgColor: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600'
    },
    {
      title: 'Em Aberto',
      value: '45',
      icon: <FaEnvelopeOpenText aria-hidden="true" />,
      bgColor: 'from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Resolvidas',
      value: '892',
      icon: <FaCheckCircle aria-hidden="true" />,
      bgColor: 'from-green-500 to-green-600',
      textColor: 'text-green-600'
    },
    {
      title: 'Sem Responsável',
      value: '12',
      icon: <FaUserSlash aria-hidden="true" />,
      bgColor: 'from-red-500 to-red-600',
      textColor: 'text-red-600'
    },
    {
      title: 'Mensagens',
      value: '5,678',
      icon: <FaComments aria-hidden="true" />,
      bgColor: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600'
    },
    {
      title: 'Clientes Esperando',
      value: clientesAtribuidosEsperando.toString(),
      icon: <FaClock aria-hidden="true" />,
      bgColor: 'from-orange-500 to-orange-600',
      textColor: 'text-orange-600'
    }
  ];

  // Se selecionou uma plataforma, mostrar dashboard de vendas
  if (dashboardSelecionado !== 'principal' && platformData[dashboardSelecionado]) {
    const currentData = platformData[dashboardSelecionado];

    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Cabeçalho */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 mb-6">
              {/* Seletor de Dashboard */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg px-4 sm:px-6 py-3 sm:py-4 border-2 border-purple-200 dark:border-purple-900/50 hover:border-purple-400 dark:hover:border-purple-700 transition-all duration-300 w-full lg:w-auto">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <FaChartLine className="text-purple-600 dark:text-purple-400 text-base sm:text-lg" aria-hidden="true" />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Dashboard</span>
                </div>
                <select
                  value={dashboardSelecionado}
                  onChange={(e) => setDashboardSelecionado(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-purple-200 dark:border-purple-900/50 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 bg-purple-50 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 cursor-pointer"
                >
                  <option value="principal">Dashboard Principal</option>
                  {plataformasAtivas.map((plataforma) => (
                    <option key={plataforma.id} value={plataforma.id}>
                      {plataforma.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Título - Centro */}
              <div className="text-center lg:flex-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg animate-gradient">
                  Dashboard {getNomePlataforma()}
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 font-semibold">
                  Dashboard de Vendas
                </p>
              </div>

              {/* Período */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg px-4 sm:px-6 py-3 sm:py-4 border-2 border-purple-200 dark:border-purple-900/50 hover:border-purple-400 dark:hover:border-purple-700 transition-all duration-300 w-full lg:w-auto">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <FaCalendarAlt className="text-purple-600 dark:text-purple-400 text-base sm:text-lg" />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Período</span>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  <div className="relative flex-1">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 text-sm pointer-events-none z-10" aria-hidden="true" />
                    <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 sm:py-2.5 border-2 border-purple-200 dark:border-purple-900/50 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 bg-purple-50 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 cursor-pointer"
                    style={{ colorScheme: 'light' }}
                    aria-label="Data de início do período"
                  />
                  </div>
                  <span className="hidden sm:block text-purple-600 dark:text-purple-400 font-bold text-sm">→</span>
                  <div className="relative flex-1">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 text-sm pointer-events-none z-10" aria-hidden="true" />
                    <input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 sm:py-2.5 border-2 border-purple-200 dark:border-purple-900/50 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 bg-purple-50 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 cursor-pointer"
                    style={{ colorScheme: 'light' }}
                    aria-label="Data de fim do período"
                  />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cards de Métricas de Vendas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5 mb-6 sm:mb-8" role="region" aria-label="Métricas de vendas">
            {/* Total Vendas */}
            <div className="group bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl sm:hover:scale-105 border-2 border-gray-200 dark:border-gray-700">
              <div className="p-4 sm:p-6 relative overflow-hidden min-h-[150px] sm:min-h-[180px] transition-all duration-700 bg-gradient-to-br from-purple-500 to-purple-600">
                <div className="absolute inset-0 bg-white dark:bg-gray-800 group-hover:bg-transparent transition-all duration-700"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg transition-all duration-700 bg-purple-600/90 text-white group-hover:scale-125 group-hover:rotate-12">
                    <FaShoppingCart className="text-xl sm:text-2xl" aria-hidden="true" />
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-gray-800 dark:text-gray-200 group-hover:text-white text-xs font-bold mb-1 sm:mb-2 uppercase tracking-wider transition-colors duration-700">Total de Vendas</h3>
                    <p className="text-gray-900 dark:text-gray-100 group-hover:text-white text-2xl sm:text-3xl font-bold tracking-tight transition-colors duration-700">{currentData.totalVendas}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Valor Total */}
            <div className="group bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl sm:hover:scale-105 border-2 border-gray-200 dark:border-gray-700">
              <div className="p-4 sm:p-6 relative overflow-hidden min-h-[150px] sm:min-h-[180px] transition-all duration-700 bg-gradient-to-br from-emerald-500 to-emerald-600">
                <div className="absolute inset-0 bg-white dark:bg-gray-800 group-hover:bg-transparent transition-all duration-700"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg transition-all duration-700 bg-emerald-600/90 text-white group-hover:scale-125 group-hover:rotate-12">
                    <FaDollarSign className="text-xl sm:text-2xl" aria-hidden="true" />
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-gray-800 dark:text-gray-200 group-hover:text-white text-xs font-bold mb-1 sm:mb-2 uppercase tracking-wider transition-colors duration-700">Valor Total</h3>
                    <p className="text-gray-900 dark:text-gray-100 group-hover:text-white text-lg sm:text-2xl font-bold tracking-tight transition-colors duration-700">R$ {currentData.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cartão */}
            <div className="group bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl sm:hover:scale-105 border-2 border-gray-200 dark:border-gray-700">
              <div className="p-4 sm:p-6 relative overflow-hidden min-h-[150px] sm:min-h-[180px] transition-all duration-700 bg-gradient-to-br from-blue-500 to-blue-600">
                <div className="absolute inset-0 bg-white dark:bg-gray-800 group-hover:bg-transparent transition-all duration-700"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg transition-all duration-700 bg-blue-600/90 text-white group-hover:scale-125 group-hover:rotate-12">
                    <FaCreditCard className="text-xl sm:text-2xl" aria-hidden="true" />
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-gray-800 dark:text-gray-200 group-hover:text-white text-xs font-bold mb-1 sm:mb-2 uppercase tracking-wider transition-colors duration-700">Cartão</h3>
                    <p className="text-gray-900 dark:text-gray-100 group-hover:text-white text-2xl sm:text-3xl font-bold tracking-tight transition-colors duration-700">{currentData.metodoPagamento.cartao}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* PIX */}
            <div className="group bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl sm:hover:scale-105 border-2 border-gray-200 dark:border-gray-700">
              <div className="p-4 sm:p-6 relative overflow-hidden min-h-[150px] sm:min-h-[180px] transition-all duration-700 bg-gradient-to-br from-teal-500 to-teal-600">
                <div className="absolute inset-0 bg-white dark:bg-gray-800 group-hover:bg-transparent transition-all duration-700"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg transition-all duration-700 bg-teal-600/90 text-white group-hover:scale-125 group-hover:rotate-12">
                    <FaQrcode className="text-xl sm:text-2xl" aria-hidden="true" />
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-gray-800 dark:text-gray-200 group-hover:text-white text-xs font-bold mb-1 sm:mb-2 uppercase tracking-wider transition-colors duration-700">PIX</h3>
                    <p className="text-gray-900 dark:text-gray-100 group-hover:text-white text-2xl sm:text-3xl font-bold tracking-tight transition-colors duration-700">{currentData.metodoPagamento.pix}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Boleto */}
            <div className="group bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl sm:hover:scale-105 border-2 border-gray-200 dark:border-gray-700">
              <div className="p-4 sm:p-6 relative overflow-hidden min-h-[150px] sm:min-h-[180px] transition-all duration-700 bg-gradient-to-br from-orange-500 to-orange-600">
                <div className="absolute inset-0 bg-white dark:bg-gray-800 group-hover:bg-transparent transition-all duration-700"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg transition-all duration-700 bg-orange-600/90 text-white group-hover:scale-125 group-hover:rotate-12">
                    <FaBarcode className="text-xl sm:text-2xl" aria-hidden="true" />
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-gray-800 dark:text-gray-200 group-hover:text-white text-xs font-bold mb-1 sm:mb-2 uppercase tracking-wider transition-colors duration-700">Boleto</h3>
                    <p className="text-gray-900 dark:text-gray-100 group-hover:text-white text-2xl sm:text-3xl font-bold tracking-tight transition-colors duration-700">{currentData.metodoPagamento.boleto}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reembolsos */}
            <div className="group bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl sm:hover:scale-105 border-2 border-gray-200 dark:border-gray-700">
              <div className="p-4 sm:p-6 relative overflow-hidden min-h-[150px] sm:min-h-[180px] transition-all duration-700 bg-gradient-to-br from-red-500 to-red-600">
                <div className="absolute inset-0 bg-white dark:bg-gray-800 group-hover:bg-transparent transition-all duration-700"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg transition-all duration-700 bg-red-600/90 text-white group-hover:scale-125 group-hover:rotate-12">
                    <FaUndo className="text-xl sm:text-2xl" aria-hidden="true" />
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-gray-800 dark:text-gray-200 group-hover:text-white text-xs font-bold mb-1 sm:mb-2 uppercase tracking-wider transition-colors duration-700">Reembolsos</h3>
                    <p className="text-gray-900 dark:text-gray-100 group-hover:text-white text-2xl sm:text-3xl font-bold tracking-tight transition-colors duration-700">{currentData.totalReembolsos}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8" role="region" aria-label="Gráficos de vendas">
            {/* Gráfico de Vendas */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl border-2 border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-lg">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Vendas por Dia</h2>
              <ResponsiveContainer width="100%" height={250} role="img" aria-label="Gráfico de linha mostrando vendas por dia">
                <LineChart data={currentData.vendasPorDia} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="dia" stroke="#6b7280" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '11px' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="vendas" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de Faturamento */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl border-2 border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-lg">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Faturamento por Dia</h2>
              <ResponsiveContainer width="100%" height={250} role="img" aria-label="Gráfico de barras mostrando faturamento por dia">
                <BarChart data={currentData.vendasPorDia} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="dia" stroke="#6b7280" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '11px' }} />
                  <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
                  <Bar dataKey="valor" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Últimas Vendas */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl border-2 border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-lg" role="region" aria-label="Últimas vendas">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Últimas Vendas</h2>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full" role="table" aria-label="Tabela de últimas vendas">
                  <thead>
                    <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase whitespace-nowrap">Cliente</th>
                      <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase whitespace-nowrap hidden md:table-cell">Produto</th>
                      <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase whitespace-nowrap">Valor</th>
                      <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase whitespace-nowrap hidden lg:table-cell">Método</th>
                      <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase whitespace-nowrap hidden sm:table-cell">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.ultimasVendas.map((venda) => (
                      <tr key={venda.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-3 sm:py-4 px-3 sm:px-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {venda.cliente.charAt(0)}
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-gray-100 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">{venda.cliente}</span>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hidden md:table-cell">
                          <span className="line-clamp-2">{venda.produto}</span>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">R$ {venda.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 sm:py-4 px-3 sm:px-4 hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            {getPaymentIcon(venda.metodo)}
                            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{venda.metodo}</span>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap hidden sm:table-cell">{venda.data}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Principal (Atendimento)
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Trial Banner */}
        <TrialBanner onNavigate={onNavigate} />

        {/* Cabeçalho */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between mb-6 gap-4">
            {/* Seletor de Dashboard - Esquerda */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg px-4 sm:px-6 py-3 sm:py-4 border-2 border-purple-200 dark:border-purple-900/50 hover:border-purple-400 dark:hover:border-purple-700 transition-all duration-300 w-full lg:w-auto">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <FaChartLine className="text-purple-600 dark:text-purple-400 text-base sm:text-lg" aria-hidden="true" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Dashboard</span>
              </div>
              <select
                value={dashboardSelecionado}
                onChange={(e) => setDashboardSelecionado(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-purple-200 dark:border-purple-900/50 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 bg-purple-50 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 cursor-pointer"
                aria-label="Selecionar dashboard"
              >
                <option value="principal">Dashboard Principal</option>
                {plataformasAtivas.map((plataforma) => (
                  <option key={plataforma.id} value={plataforma.id}>
                    {plataforma.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Título e Subtítulo - Centro */}
            <div className="text-center flex-1 w-full lg:w-auto">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg animate-gradient">
                Dashboard
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 font-semibold">
                Visão dashboard principal
              </p>
            </div>

            {/* Seletor de Período - Direita */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg px-4 sm:px-6 py-3 sm:py-4 border-2 border-purple-200 dark:border-purple-900/50 hover:border-purple-400 dark:hover:border-purple-700 transition-all duration-300 w-full lg:w-auto">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <FaCalendarAlt className="text-purple-600 dark:text-purple-400 text-base sm:text-lg" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Período</span>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <div className="relative flex-1">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 text-sm pointer-events-none z-10" aria-hidden="true" />
                  <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 sm:py-2.5 border-2 border-purple-200 dark:border-purple-900/50 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 bg-purple-50 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 cursor-pointer"
                    style={{
                      colorScheme: 'light'
                    }}
                    aria-label="Data de início do período"
                  />
                </div>
                <span className="hidden sm:block text-purple-600 dark:text-purple-400 font-bold text-sm">→</span>
                <div className="relative flex-1">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 text-sm pointer-events-none z-10" aria-hidden="true" />
                  <input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 sm:py-2.5 border-2 border-purple-200 dark:border-purple-900/50 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 bg-purple-50 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 cursor-pointer"
                    style={{
                      colorScheme: 'light'
                    }}
                    aria-label="Data de fim do período"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6" role="region" aria-label="Métricas de atendimento">
          {cards.map((card, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border-2 border-black dark:border-gray-700 relative"
              role="article"
              aria-label={`${card.title}: ${card.value}`}
            >
              {/* Overlay de cor no hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

              <div className="relative z-10 p-4 sm:p-6">
                {/* Ícone */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto transition-all duration-500 bg-gray-100 dark:bg-gray-700 group-hover:bg-white/20">
                  <div className={`${card.textColor} dark:text-gray-200 group-hover:text-white transition-colors duration-500 text-3xl sm:text-4xl`}>
                    {card.icon}
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-gray-800 dark:text-gray-100 group-hover:text-white text-center font-semibold text-xs sm:text-sm mb-1 sm:mb-2 transition-colors duration-500">
                  {card.title}
                </h3>

                {/* Valor */}
                <p className="text-gray-900 dark:text-white group-hover:text-white text-center text-2xl sm:text-3xl font-bold transition-colors duration-500">
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Seção de atividades recentes */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6" role="region" aria-label="Atividades recentes">
          {/* Gráfico de Pico de Clientes */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-xl shadow-lg p-4 sm:p-6 border-2 border-gray-200 dark:border-gray-700">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6">Pico de Clientes por Hora</h2>
            <ResponsiveContainer width="100%" height={250} role="img" aria-label="Gráfico de linha mostrando pico de clientes por hora do dia">
              <LineChart data={picoClientesPorHora} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                <XAxis
                  dataKey="hora"
                  stroke="#6b7280"
                  style={{ fontSize: '10px', fontWeight: '600' }}
                  label={{ value: 'Hora do Dia', position: 'insideBottom', offset: -5, style: { fontSize: '12px', fontWeight: 'bold', fill: '#6b7280' } }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: '10px', fontWeight: '600' }}
                  label={{ value: 'Clientes', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fontWeight: 'bold', fill: '#6b7280' } }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '2px solid #8b5cf6',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.3)',
                    padding: '8px 12px'
                  }}
                  labelStyle={{ fontWeight: 'bold', color: '#1f2937', fontSize: '12px' }}
                  itemStyle={{ color: '#8b5cf6', fontWeight: '600', fontSize: '12px' }}
                  formatter={(value) => [`${value} clientes`, 'Total']}
                  labelFormatter={(label) => `${label}:00h`}
                />
                <Line
                  type="monotone"
                  dataKey="clientes"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 3 }}
                  activeDot={{ r: 5, fill: '#7c3aed' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Clientes esperando há mais de 30 min */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-xl shadow-lg p-4 sm:p-6 border-2 border-gray-200 dark:border-gray-700" role="region" aria-label="Clientes esperando atendimento" aria-live="polite">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
              <h2 className="text-base sm:text-lg lg:text-2xl font-bold text-gray-800 dark:text-gray-100">
                Clientes esperando há mais de 30 min
              </h2>
              <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-base sm:text-lg font-bold">
                {clientesEsperando.length}
              </span>
            </div>

            <div className="space-y-2 sm:space-y-3 max-h-[350px] sm:max-h-[400px] overflow-y-auto">
              {clientesEsperando.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-300">Nenhum cliente esperando</p>
                </div>
              ) : (
                clientesEsperando.map((cliente) => (
                  <div
                    key={cliente.id}
                    onClick={() => onNavigate && onNavigate('inbox', { chatId: cliente.id })}
                    className="p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors border-l-4 border-red-500 cursor-pointer hover:shadow-lg"
                    role="button"
                    tabIndex={0}
                    aria-label={`Atender ${cliente.nome} - esperando há ${calcularTempoEspera(cliente.primeiramensagem)}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onNavigate && onNavigate('inbox', { chatId: cliente.id });
                      }
                    }}
                  >
                    {/* Cabeçalho: Nome e Tempo de Espera */}
                    <div className="flex items-start sm:items-center justify-between mb-2 gap-2">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                          {cliente.nome.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm sm:text-base text-gray-800 dark:text-gray-100 truncate">
                            {cliente.nome}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Esperando há {calcularTempoEspera(cliente.primeiramensagem)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-600 dark:text-gray-300">Última msg</p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {formatarHora(cliente.ultimaMensagemHora)}
                        </p>
                      </div>
                    </div>

                    {/* Última Mensagem */}
                    <div className="bg-gray-100 dark:bg-gray-900/50 rounded-lg p-2 sm:p-3 mb-2">
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 italic line-clamp-2">
                        "{cliente.ultimaMensagem}"
                      </p>
                    </div>

                    {/* Atribuído Para */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Atribuído para:
                      </p>
                      {cliente.atribuidoPara ? (
                        <span className="px-2 sm:px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-semibold">
                          {cliente.atribuidoPara}
                        </span>
                      ) : (
                        <span className="px-2 sm:px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-semibold">
                          Não atribuído
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
