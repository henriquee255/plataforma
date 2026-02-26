import React, { useState } from 'react';
import { FaChartBar, FaCalendarAlt, FaComments, FaClock, FaStar, FaUsers, FaArrowUp, FaArrowDown, FaTrophy, FaWhatsapp, FaEnvelope, FaTelegram, FaComment, FaBuilding, FaUserTie, FaTimes } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker-custom.css';
import { useAppContext } from './contexts/AppContext';
import UpgradeBanner from './components/UpgradeBanner';

/**
 * Página de Relatórios
 *
 * Planos e Recursos:
 * - Relatórios Básicos (overview): Disponível em TODOS os planos
 *   Inclui: KPIs, gráficos de conversas, tempo de resposta, satisfação, top performers, canais
 *
 * - Relatórios Avançados (sectors, agents): Professional+
 *   Inclui: Análise por setor, análise por funcionário, métricas customizadas
 */

const Reports = () => {
  const { getCurrentPlan } = useAppContext();
  const currentPlan = getCurrentPlan();

  const [activeTab, setActiveTab] = useState('overview');
  const [startDate, setStartDate] = useState(new Date('2025-02-22'));
  const [endDate, setEndDate] = useState(new Date('2026-02-23'));

  // Estados para drill-down
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const TABS = [
    { id: 'overview', label: 'Visão Geral', icon: FaChartBar },
    { id: 'sectors', label: 'Por Setor', icon: FaBuilding },
    { id: 'agents', label: 'Por Funcionário', icon: FaUsers },
  ];

  // Dados MOCK
  const conversationsByDay = [
    { day: 'Seg', count: 45, label: '18/02' },
    { day: 'Ter', count: 52, label: '19/02' },
    { day: 'Qua', count: 38, label: '20/02' },
    { day: 'Qui', count: 61, label: '21/02' },
    { day: 'Sex', count: 48, label: '22/02' },
    { day: 'Sáb', count: 22, label: '23/02' },
    { day: 'Dom', count: 15, label: '24/02' },
  ];

  const responseTimeData = [
    { day: 'Seg', minutes: 12 },
    { day: 'Ter', minutes: 8 },
    { day: 'Qua', minutes: 15 },
    { day: 'Qui', minutes: 9 },
    { day: 'Sex', minutes: 11 },
    { day: 'Sáb', minutes: 7 },
    { day: 'Dom', minutes: 6 },
  ];

  const topPerformers = [
    { name: 'Desenvolvedor 1', avatar: 'D1', conversations: 87, satisfaction: 4.9, trend: 'up' },
    { name: 'Designer 1', avatar: 'DS', conversations: 76, satisfaction: 4.8, trend: 'up' },
    { name: 'Analista 1', avatar: 'A1', conversations: 68, satisfaction: 4.7, trend: 'same' },
    { name: 'Programador 1', avatar: 'P1', conversations: 61, satisfaction: 4.6, trend: 'down' },
    { name: 'Desenvolvedor 2', avatar: 'D2', conversations: 54, satisfaction: 4.5, trend: 'up' },
  ];

  const channelDistribution = [
    { name: 'WhatsApp', icon: <FaWhatsapp />, count: 145, percentage: 48, color: 'from-green-500 to-emerald-600' },
    { name: 'Widget', icon: <FaComment />, count: 98, percentage: 32, color: 'from-purple-500 to-purple-600' },
    { name: 'Email', icon: <FaEnvelope />, count: 42, percentage: 14, color: 'from-blue-500 to-blue-600' },
    { name: 'Telegram', icon: <FaTelegram />, count: 18, percentage: 6, color: 'from-sky-500 to-sky-600' },
  ];

  const satisfactionOverTime = [
    { day: 'Seg', score: 4.5 },
    { day: 'Ter', score: 4.6 },
    { day: 'Qua', score: 4.4 },
    { day: 'Qui', score: 4.7 },
    { day: 'Sex', score: 4.8 },
    { day: 'Sáb', score: 4.9 },
    { day: 'Dom', score: 4.8 },
  ];

  const maxConversations = Math.max(...conversationsByDay.map((d) => d.count));
  const maxResponseTime = Math.max(...responseTimeData.map((d) => d.minutes));
  const maxSatisfaction = 5;
  const minSatisfaction = Math.min(...satisfactionOverTime.map((d) => d.score));

  // Dados detalhados por setor
  const sectorsData = {
    vendas: {
      name: 'Vendas',
      conversations: 245,
      satisfaction: 4.8,
      avgTime: 8,
      color: 'from-blue-500 to-blue-600',
      metrics: {
        resolved: 234,
        pending: 11,
        responseTime: '5 min',
        firstResponseTime: '2 min',
        conversionRate: '68%'
      },
      byDay: [
        { day: 'Seg', count: 35 },
        { day: 'Ter', count: 42 },
        { day: 'Qua', count: 38 },
        { day: 'Qui', count: 45 },
        { day: 'Sex', count: 40 },
        { day: 'Sáb', count: 25 },
        { day: 'Dom', count: 20 }
      ]
    },
    suporte: {
      name: 'Suporte',
      conversations: 187,
      satisfaction: 4.6,
      avgTime: 12,
      color: 'from-green-500 to-green-600',
      metrics: {
        resolved: 165,
        pending: 22,
        responseTime: '8 min',
        firstResponseTime: '3 min',
        conversionRate: '88%'
      },
      byDay: [
        { day: 'Seg', count: 28 },
        { day: 'Ter', count: 32 },
        { day: 'Qua', count: 25 },
        { day: 'Qui', count: 30 },
        { day: 'Sex', count: 27 },
        { day: 'Sáb', count: 22 },
        { day: 'Dom', count: 23 }
      ]
    },
    financeiro: {
      name: 'Financeiro',
      conversations: 134,
      satisfaction: 4.9,
      avgTime: 6,
      color: 'from-amber-500 to-amber-600',
      metrics: {
        resolved: 128,
        pending: 6,
        responseTime: '4 min',
        firstResponseTime: '1 min',
        conversionRate: '95%'
      },
      byDay: [
        { day: 'Seg', count: 20 },
        { day: 'Ter', count: 22 },
        { day: 'Qua', count: 18 },
        { day: 'Qui', count: 25 },
        { day: 'Sex', count: 21 },
        { day: 'Sáb', count: 15 },
        { day: 'Dom', count: 13 }
      ]
    }
  };

  // Dados detalhados por funcionário
  const agentsData = {
    'Maria Santos': {
      sector: 'Vendas',
      conversations: 87,
      satisfaction: 4.9,
      avgTime: 7,
      trend: '+12%',
      avatar: 'MS',
      color: 'from-purple-500 to-purple-600',
      metrics: {
        resolved: 82,
        pending: 5,
        responseTime: '4 min',
        firstResponseTime: '1 min',
        totalHours: '42h'
      },
      byDay: [
        { day: 'Seg', count: 12 },
        { day: 'Ter', count: 15 },
        { day: 'Qua', count: 13 },
        { day: 'Qui', count: 16 },
        { day: 'Sex', count: 14 },
        { day: 'Sáb', count: 9 },
        { day: 'Dom', count: 8 }
      ]
    },
    'Carlos Mendes': {
      sector: 'Suporte',
      conversations: 76,
      satisfaction: 4.8,
      avgTime: 9,
      trend: '+8%',
      avatar: 'CM',
      color: 'from-blue-500 to-blue-600',
      metrics: {
        resolved: 70,
        pending: 6,
        responseTime: '6 min',
        firstResponseTime: '2 min',
        totalHours: '40h'
      },
      byDay: [
        { day: 'Seg', count: 10 },
        { day: 'Ter', count: 12 },
        { day: 'Qua', count: 11 },
        { day: 'Qui', count: 13 },
        { day: 'Sex', count: 12 },
        { day: 'Sáb', count: 9 },
        { day: 'Dom', count: 9 }
      ]
    },
    'Ana Paula': {
      sector: 'Financeiro',
      conversations: 68,
      satisfaction: 4.7,
      avgTime: 11,
      trend: '0%',
      avatar: 'AP',
      color: 'from-green-500 to-green-600',
      metrics: {
        resolved: 65,
        pending: 3,
        responseTime: '7 min',
        firstResponseTime: '2 min',
        totalHours: '38h'
      },
      byDay: [
        { day: 'Seg', count: 9 },
        { day: 'Ter', count: 11 },
        { day: 'Qua', count: 10 },
        { day: 'Qui', count: 12 },
        { day: 'Sex', count: 10 },
        { day: 'Sáb', count: 8 },
        { day: 'Dom', count: 8 }
      ]
    },
    'João Costa': {
      sector: 'Vendas',
      conversations: 61,
      satisfaction: 4.6,
      avgTime: 13,
      trend: '-5%',
      avatar: 'JC',
      color: 'from-amber-500 to-amber-600',
      metrics: {
        resolved: 55,
        pending: 6,
        responseTime: '9 min',
        firstResponseTime: '3 min',
        totalHours: '39h'
      },
      byDay: [
        { day: 'Seg', count: 8 },
        { day: 'Ter', count: 9 },
        { day: 'Qua', count: 9 },
        { day: 'Qui', count: 10 },
        { day: 'Sex', count: 9 },
        { day: 'Sáb', count: 8 },
        { day: 'Dom', count: 8 }
      ]
    },
    'Beatriz Lima': {
      sector: 'Suporte',
      conversations: 54,
      satisfaction: 4.5,
      avgTime: 10,
      trend: '+3%',
      avatar: 'BL',
      color: 'from-pink-500 to-pink-600',
      metrics: {
        resolved: 50,
        pending: 4,
        responseTime: '7 min',
        firstResponseTime: '2 min',
        totalHours: '36h'
      },
      byDay: [
        { day: 'Seg', count: 7 },
        { day: 'Ter', count: 8 },
        { day: 'Qua', count: 8 },
        { day: 'Qui', count: 9 },
        { day: 'Sex', count: 8 },
        { day: 'Sáb', count: 7 },
        { day: 'Dom', count: 7 }
      ]
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b-2 border-gray-100 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg">
                <FaChartBar className="text-xl text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
                <p className="text-sm text-gray-500 dark:text-gray-300">Analytics e desempenho da equipe</p>
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <FaCalendarAlt className="text-white text-sm" />
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 hidden sm:block">Período:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="dd/MM/yyyy"
                    className="pl-10 pr-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-2xl text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer w-36"
                  />
                  <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 dark:text-purple-400 pointer-events-none" />
                </div>
                <span className="text-gray-500 dark:text-gray-300 font-semibold">até</span>
                <div className="relative">
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="dd/MM/yyyy"
                    className="pl-10 pr-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-2xl text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer w-36"
                  />
                  <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 dark:text-purple-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="text-base" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Visão Geral Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPIs Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Total de Conversas */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300" style={{ boxShadow: 'var(--shadow-layered)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl">
                      <FaComments className="text-xl text-white" />
                    </div>
                    <span className="flex items-center text-xs font-semibold text-green-600 dark:text-green-400">
                      <FaArrowUp className="mr-1" />
                      12%
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">281</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold">Total de Conversas</p>
                </div>

                {/* Tempo Médio de Resposta */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300" style={{ boxShadow: 'var(--shadow-layered)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl">
                      <FaClock className="text-xl text-white" />
                    </div>
                    <span className="flex items-center text-xs font-semibold text-green-600 dark:text-green-400">
                      <FaArrowDown className="mr-1" />
                      8%
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">9.7 min</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold">Tempo Médio Resposta</p>
                </div>

                {/* Satisfação Média */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300" style={{ boxShadow: 'var(--shadow-layered)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl">
                      <FaStar className="text-xl text-white" />
                    </div>
                    <span className="flex items-center text-xs font-semibold text-green-600 dark:text-green-400">
                      <FaArrowUp className="mr-1" />
                      5%
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">4.7</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold">Satisfação Média</p>
                </div>

                {/* Agentes Ativos */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300" style={{ boxShadow: 'var(--shadow-layered)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl">
                      <FaUsers className="text-xl text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                      —
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">24</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold">Agentes Ativos</p>
                </div>
              </div>

              {/* Grid Principal */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Gráfico de Conversas por Dia */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300" style={{ boxShadow: 'var(--shadow-layered)' }}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Conversas por Dia</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Últimos 7 dias</p>
                    </div>
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-2xl">
                      <FaChartBar className="text-lg text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-2 md:gap-3 h-48">
                    {conversationsByDay.map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full relative group">
                          <div
                            className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-3xl transition-all duration-300 hover:from-purple-600 hover:to-purple-500 cursor-pointer"
                            style={{ height: `${(item.count / maxConversations) * 160}px` }}
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap font-semibold z-10">
                              {item.count} conversas
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-semibold text-gray-900 dark:text-white">{item.day}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-300 hidden sm:block">{item.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gráfico de Tempo de Resposta */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300" style={{ boxShadow: 'var(--shadow-layered)' }}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tempo de Resposta</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Média em minutos</p>
                    </div>
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-2xl">
                      <FaClock className="text-lg text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>

                  <div className="relative h-48">
                    <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line x1="0" y1="0" x2="400" y2="0" stroke="#e5e7eb" strokeWidth="1" className="dark:stroke-gray-700" />
                      <line x1="0" y1="40" x2="400" y2="40" stroke="#e5e7eb" strokeWidth="1" className="dark:stroke-gray-700" />
                      <line x1="0" y1="80" x2="400" y2="80" stroke="#e5e7eb" strokeWidth="1" className="dark:stroke-gray-700" />
                      <line x1="0" y1="120" x2="400" y2="120" stroke="#e5e7eb" strokeWidth="1" className="dark:stroke-gray-700" />
                      <line x1="0" y1="160" x2="400" y2="160" stroke="#e5e7eb" strokeWidth="1" className="dark:stroke-gray-700" />

                      {/* Gradient definition */}
                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#d97706" />
                        </linearGradient>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>

                      {/* Area fill */}
                      <path
                        d={`M 0 ${160 - (responseTimeData[0].minutes / maxResponseTime) * 160} ${responseTimeData
                          .map((item, i) => `L ${(i / (responseTimeData.length - 1)) * 400} ${160 - (item.minutes / maxResponseTime) * 160}`)
                          .join(' ')} L 400 160 L 0 160 Z`}
                        fill="url(#areaGradient)"
                      />

                      {/* Line */}
                      <path
                        d={`M 0 ${160 - (responseTimeData[0].minutes / maxResponseTime) * 160} ${responseTimeData
                          .map((item, i) => `L ${(i / (responseTimeData.length - 1)) * 400} ${160 - (item.minutes / maxResponseTime) * 160}`)
                          .join(' ')}`}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Points */}
                      {responseTimeData.map((item, i) => (
                        <g key={i}>
                          <circle
                            cx={(i / (responseTimeData.length - 1)) * 400}
                            cy={160 - (item.minutes / maxResponseTime) * 160}
                            r="5"
                            fill="white"
                            stroke="url(#lineGradient)"
                            strokeWidth="3"
                            className="hover:r-7 transition-all cursor-pointer dark:fill-gray-900"
                          />
                        </g>
                      ))}
                    </svg>

                    <div className="flex justify-between mt-3">
                      {responseTimeData.map((item, index) => (
                        <div key={index} className="text-center flex-1">
                          <p className="text-xs font-semibold text-gray-900 dark:text-white">{item.day}</p>
                          <p className="text-xs text-amber-600 dark:text-amber-400 font-bold">{item.minutes}m</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top 5 Performers */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300" style={{ boxShadow: 'var(--shadow-layered)' }}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top 5 Performers</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Melhores atendentes do período</p>
                    </div>
                    <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-2xl">
                      <FaTrophy className="text-lg text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {topPerformers.map((performer, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="relative">
                            <div
                              className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                                index === 0
                                  ? 'from-yellow-400 to-orange-500'
                                  : index === 1
                                    ? 'from-gray-300 to-gray-400'
                                    : index === 2
                                      ? 'from-amber-600 to-amber-700'
                                      : 'from-purple-500 to-purple-600'
                              } flex items-center justify-center text-white font-bold text-sm`}
                            >
                              {performer.avatar}
                            </div>
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300 border-2 border-gray-100 dark:border-gray-700">
                              {index + 1}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">{performer.name}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-300">
                              <span className="flex items-center gap-1">
                                <FaComments />
                                {performer.conversations}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaStar className="text-yellow-400" />
                                {performer.satisfaction}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          {performer.trend === 'up' && <FaArrowUp className="text-green-600 dark:text-green-400" />}
                          {performer.trend === 'down' && <FaArrowDown className="text-red-600 dark:text-red-400" />}
                          {performer.trend === 'same' && <div className="w-4 h-0.5 bg-gray-400 rounded" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Distribuição por Canal */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300" style={{ boxShadow: 'var(--shadow-layered)' }}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Distribuição por Canal</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Total de conversas por origem</p>
                    </div>
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl">
                      <FaComment className="text-lg text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {channelDistribution.map((channel, index) => (
                      <div key={index} className="group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 bg-gradient-to-br ${channel.color} rounded-xl text-white text-sm`}>
                              {channel.icon}
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">{channel.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{channel.count}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-300">{channel.percentage}%</p>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${channel.color} transition-all duration-500 group-hover:scale-105 origin-left`}
                            style={{ width: `${channel.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t-2 border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Total Geral</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {channelDistribution.reduce((acc, ch) => acc + ch.count, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Satisfação ao Longo do Tempo - Full Width */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300" style={{ boxShadow: 'var(--shadow-layered)' }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Satisfação ao Longo do Tempo</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Score médio de avaliações</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-2xl">
                      <FaStar className="text-lg text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Média</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">4.7</p>
                    </div>
                  </div>
                </div>

                <div className="relative w-full h-32 md:h-40">
                  <svg className="w-full h-full" viewBox="0 0 600 100" preserveAspectRatio="xMidYMid meet">
                    {/* Grid */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line
                        key={i}
                        x1="0"
                        y1={i * 25}
                        x2="600"
                        y2={i * 25}
                        stroke="#f3f4f6"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        className="dark:stroke-gray-700"
                      />
                    ))}

                    {/* Gradient */}
                    <defs>
                      <linearGradient id="satisfactionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#eab308" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                      <linearGradient id="satisfactionArea" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>

                    {/* Area */}
                    <path
                      d={`M 0 ${100 - ((satisfactionOverTime[0].score - minSatisfaction) / (maxSatisfaction - minSatisfaction)) * 100} ${satisfactionOverTime
                        .map(
                          (item, i) =>
                            `L ${(i / (satisfactionOverTime.length - 1)) * 600} ${100 - ((item.score - minSatisfaction) / (maxSatisfaction - minSatisfaction)) * 100}`,
                        )
                        .join(' ')} L 600 100 L 0 100 Z`}
                      fill="url(#satisfactionArea)"
                    />

                    {/* Line */}
                    <path
                      d={`M 0 ${100 - ((satisfactionOverTime[0].score - minSatisfaction) / (maxSatisfaction - minSatisfaction)) * 100} ${satisfactionOverTime
                        .map(
                          (item, i) =>
                            `L ${(i / (satisfactionOverTime.length - 1)) * 600} ${100 - ((item.score - minSatisfaction) / (maxSatisfaction - minSatisfaction)) * 100}`,
                        )
                        .join(' ')}`}
                      fill="none"
                      stroke="url(#satisfactionGradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Points */}
                    {satisfactionOverTime.map((item, i) => (
                      <circle
                        key={i}
                        cx={(i / (satisfactionOverTime.length - 1)) * 600}
                        cy={100 - ((item.score - minSatisfaction) / (maxSatisfaction - minSatisfaction)) * 100}
                        r="4"
                        fill="white"
                        stroke="url(#satisfactionGradient)"
                        strokeWidth="2"
                        className="hover:r-6 transition-all cursor-pointer dark:fill-gray-900"
                      />
                    ))}
                  </svg>

                  <div className="flex justify-between mt-3 flex-wrap md:flex-nowrap gap-2 md:gap-0">
                    {satisfactionOverTime.map((item, index) => (
                      <div key={index} className="text-center flex-1 min-w-[60px] md:min-w-0">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">{item.day}</p>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <FaStar className="text-xs text-yellow-400" />
                          <p className="text-xs text-yellow-600 dark:text-yellow-400 font-bold">{item.score}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Por Setor Tab */}
          {activeTab === 'sectors' && (
            <div className="space-y-6">
              {/* Métricas por Setor */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Vendas */}
                <button
                  onClick={() => setSelectedSector('vendas')}
                  className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 p-6 text-left transition-all hover:shadow-xl cursor-pointer"
                  style={{ boxShadow: 'var(--shadow-layered)' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Vendas</h3>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <FaBuilding className="text-white text-xl" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Conversas</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">245</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Satisfação</span>
                      <span className="text-lg font-bold text-green-600">4.8 ⭐</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Tempo Médio</span>
                      <span className="text-lg font-bold text-purple-600">8 min</span>
                    </div>
                  </div>
                  <p className="text-xs text-purple-600 font-semibold mt-4">Clique para ver detalhes →</p>
                </button>

                {/* Suporte */}
                <button
                  onClick={() => setSelectedSector('suporte')}
                  className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 p-6 text-left transition-all hover:shadow-xl cursor-pointer"
                  style={{ boxShadow: 'var(--shadow-layered)' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Suporte</h3>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <FaBuilding className="text-white text-xl" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Conversas</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">187</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Satisfação</span>
                      <span className="text-lg font-bold text-green-600">4.6 ⭐</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Tempo Médio</span>
                      <span className="text-lg font-bold text-purple-600">12 min</span>
                    </div>
                  </div>
                  <p className="text-xs text-purple-600 font-semibold mt-4">Clique para ver detalhes →</p>
                </button>

                {/* Financeiro */}
                <button
                  onClick={() => setSelectedSector('financeiro')}
                  className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500 p-6 text-left transition-all hover:shadow-xl cursor-pointer"
                  style={{ boxShadow: 'var(--shadow-layered)' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Financeiro</h3>
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                      <FaBuilding className="text-white text-xl" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Conversas</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">134</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Satisfação</span>
                      <span className="text-lg font-bold text-green-600">4.9 ⭐</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Tempo Médio</span>
                      <span className="text-lg font-bold text-purple-600">6 min</span>
                    </div>
                  </div>
                  <p className="text-xs text-purple-600 font-semibold mt-4">Clique para ver detalhes →</p>
                </button>
              </div>
            </div>
          )}

          {/* Por Funcionário Tab */}
          {activeTab === 'agents' && (
            <div className="space-y-6">
              {/* Lista de Funcionários */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 overflow-hidden" style={{ boxShadow: 'var(--shadow-layered)' }}>
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Funcionário</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Setor</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Conversas</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Satisfação</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Tempo Médio</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr
                      onClick={() => setSelectedAgent('Maria Santos')}
                      className="hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">MS</span>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">Maria Santos</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">Vendas</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-bold">87</td>
                      <td className="px-6 py-4">
                        <span className="text-green-600 font-bold">4.9 ⭐</span>
                      </td>
                      <td className="px-6 py-4 text-purple-600 font-semibold">7 min</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaArrowUp className="text-green-600" />
                          <span className="text-green-600 font-semibold">+12%</span>
                        </div>
                      </td>
                    </tr>
                    <tr
                      onClick={() => setSelectedAgent('Carlos Mendes')}
                      className="hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">CM</span>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">Carlos Mendes</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">Suporte</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-bold">76</td>
                      <td className="px-6 py-4">
                        <span className="text-green-600 font-bold">4.8 ⭐</span>
                      </td>
                      <td className="px-6 py-4 text-purple-600 font-semibold">9 min</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaArrowUp className="text-green-600" />
                          <span className="text-green-600 font-semibold">+8%</span>
                        </div>
                      </td>
                    </tr>
                    <tr onClick={() => setSelectedAgent('Ana Paula')} className="hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">AP</span>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">Ana Paula</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">Financeiro</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-bold">68</td>
                      <td className="px-6 py-4">
                        <span className="text-green-600 font-bold">4.7 ⭐</span>
                      </td>
                      <td className="px-6 py-4 text-purple-600 font-semibold">11 min</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 font-semibold">0%</span>
                        </div>
                      </td>
                    </tr>
                    <tr onClick={() => setSelectedAgent('João Costa')} className="hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">JC</span>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">João Costa</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">Vendas</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-bold">61</td>
                      <td className="px-6 py-4">
                        <span className="text-green-600 font-bold">4.6 ⭐</span>
                      </td>
                      <td className="px-6 py-4 text-purple-600 font-semibold">13 min</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaArrowDown className="text-red-600" />
                          <span className="text-red-600 font-semibold">-5%</span>
                        </div>
                      </td>
                    </tr>
                    <tr onClick={() => setSelectedAgent('Beatriz Lima')} className="hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">BL</span>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">Beatriz Lima</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">Suporte</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-bold">54</td>
                      <td className="px-6 py-4">
                        <span className="text-green-600 font-bold">4.5 ⭐</span>
                      </td>
                      <td className="px-6 py-4 text-purple-600 font-semibold">10 min</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaArrowUp className="text-green-600" />
                          <span className="text-green-600 font-semibold">+3%</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalhes do Setor */}
      {selectedSector && sectorsData[selectedSector] && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedSector(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-800" style={{ boxShadow: 'var(--shadow-layered)' }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className={`p-8 border-b-2 border-gray-100 dark:border-gray-800 bg-gradient-to-br ${sectorsData[selectedSector].color}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <FaBuilding className="text-3xl text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">Setor: {sectorsData[selectedSector].name}</h2>
                    <p className="text-white/80 text-sm">Métricas detalhadas do período selecionado</p>
                  </div>
                </div>
                <button onClick={() => setSelectedSector(null)} className="p-3 hover:bg-white/20 rounded-xl transition-colors">
                  <FaTimes className="text-2xl text-white" />
                </button>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-8 space-y-6">
              {/* Métricas Principais */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Conversas</span>
                    <FaComments className="text-purple-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{sectorsData[selectedSector].conversations}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Satisfação</span>
                    <FaStar className="text-yellow-500" />
                  </div>
                  <p className="text-3xl font-bold text-green-600">{sectorsData[selectedSector].satisfaction} ⭐</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Tempo Médio</span>
                    <FaClock className="text-purple-600" />
                  </div>
                  <p className="text-3xl font-bold text-purple-600">{sectorsData[selectedSector].avgTime} min</p>
                </div>
              </div>

              {/* Métricas Detalhadas */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">Resolvidas</p>
                  <p className="text-xl font-bold text-green-600">{sectorsData[selectedSector].metrics.resolved}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">Pendentes</p>
                  <p className="text-xl font-bold text-amber-600">{sectorsData[selectedSector].metrics.pending}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">Resposta</p>
                  <p className="text-xl font-bold text-blue-600">{sectorsData[selectedSector].metrics.responseTime}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">1ª Resposta</p>
                  <p className="text-xl font-bold text-indigo-600">{sectorsData[selectedSector].metrics.firstResponseTime}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">Conversão</p>
                  <p className="text-xl font-bold text-purple-600">{sectorsData[selectedSector].metrics.conversionRate}</p>
                </div>
              </div>

              {/* Gráfico por dia */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Conversas por Dia</h3>
                <div className="flex items-end justify-between gap-3 h-64">
                  {sectorsData[selectedSector].byDay.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-3">
                      <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-t-xl overflow-hidden flex items-end justify-center" style={{ height: '180px' }}>
                        <div className={`w-full bg-gradient-to-t ${sectorsData[selectedSector].color} rounded-t-xl transition-all relative`} style={{ height: `${(day.count / Math.max(...sectorsData[selectedSector].byDay.map(d => d.count))) * 100}%` }}>
                          <div className="absolute top-2 left-0 right-0 flex justify-center">
                            <span className="px-2 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg text-base font-bold text-gray-900 dark:text-white shadow-lg">
                              {day.count}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{day.day}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Funcionário */}
      {selectedAgent && agentsData[selectedAgent] && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAgent(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-800" style={{ boxShadow: 'var(--shadow-layered)' }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className={`p-8 border-b-2 border-gray-100 dark:border-gray-800 bg-gradient-to-br ${agentsData[selectedAgent].color}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">{agentsData[selectedAgent].avatar}</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">{selectedAgent}</h2>
                    <p className="text-white/80 text-sm">Setor: {agentsData[selectedAgent].sector} • Performance: {agentsData[selectedAgent].trend}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedAgent(null)} className="p-3 hover:bg-white/20 rounded-xl transition-colors">
                  <FaTimes className="text-2xl text-white" />
                </button>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-8 space-y-6">
              {/* Métricas Principais */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Conversas</span>
                    <FaComments className="text-purple-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{agentsData[selectedAgent].conversations}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Satisfação</span>
                    <FaStar className="text-yellow-500" />
                  </div>
                  <p className="text-3xl font-bold text-green-600">{agentsData[selectedAgent].satisfaction} ⭐</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Tempo Médio</span>
                    <FaClock className="text-purple-600" />
                  </div>
                  <p className="text-3xl font-bold text-purple-600">{agentsData[selectedAgent].avgTime} min</p>
                </div>
              </div>

              {/* Métricas Detalhadas */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">Resolvidas</p>
                  <p className="text-xl font-bold text-green-600">{agentsData[selectedAgent].metrics.resolved}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">Pendentes</p>
                  <p className="text-xl font-bold text-amber-600">{agentsData[selectedAgent].metrics.pending}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">Resposta</p>
                  <p className="text-xl font-bold text-blue-600">{agentsData[selectedAgent].metrics.responseTime}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">1ª Resposta</p>
                  <p className="text-xl font-bold text-indigo-600">{agentsData[selectedAgent].metrics.firstResponseTime}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">Horas</p>
                  <p className="text-xl font-bold text-purple-600">{agentsData[selectedAgent].metrics.totalHours}</p>
                </div>
              </div>

              {/* Gráfico por dia */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Conversas por Dia</h3>
                <div className="flex items-end justify-between gap-3 h-64">
                  {agentsData[selectedAgent].byDay.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-3">
                      <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-t-xl overflow-hidden flex items-end justify-center" style={{ height: '180px' }}>
                        <div className={`w-full bg-gradient-to-t ${agentsData[selectedAgent].color} rounded-t-xl transition-all relative`} style={{ height: `${(day.count / Math.max(...agentsData[selectedAgent].byDay.map(d => d.count))) * 100}%` }}>
                          <div className="absolute top-2 left-0 right-0 flex justify-center">
                            <span className="px-2 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg text-base font-bold text-gray-900 dark:text-white shadow-lg">
                              {day.count}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{day.day}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
