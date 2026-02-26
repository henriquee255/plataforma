import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification.jsx';
import PageHeader from '@/components/custom/PageHeader';
import StatCard from '@/components/custom/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  FaChartLine,
  FaDollarSign,
  FaUsers,
  FaRocket,
  FaPercent,
  FaFire,
  FaSync,
  FaCalendarAlt,
  FaTrophy,
  FaCrown,
  FaUserPlus,
  FaMoneyBillWave,
} from 'react-icons/fa';

const AdminAnalytics = ({ onNavigate }) => {
  const { user } = useAuth();
  const { notifyError } = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // dias
  const [analytics, setAnalytics] = useState({
    revenue: {
      mrr: 0,
      arr: 0,
      growth: 0,
    },
    users: {
      total: 0,
      new: 0,
      active: 0,
      trial: 0,
      paid: 0,
    },
    conversion: {
      rate: 0,
      trialToPaid: 0,
    },
    engagement: {
      avgSessionTime: 0,
      featuresUsed: 0,
      activeRate: 0,
    },
  });

  // Verificar se é admin
  useEffect(() => {
    if (user?.role !== 'admin') {
      onNavigate && onNavigate('unauthorized');
    }
  }, [user, onNavigate]);

  // Dados mock para gráficos
  const [growthData, setGrowthData] = useState([
    { date: '01/02', users: 120, revenue: 2400 },
    { date: '05/02', users: 145, revenue: 2890 },
    { date: '10/02', users: 178, revenue: 3560 },
    { date: '15/02', users: 198, revenue: 3960 },
    { date: '20/02', users: 234, revenue: 4680 },
    { date: '24/02', users: 267, revenue: 5340 },
  ]);

  const [planDistribution, setPlanDistribution] = useState([
    { name: 'Free', value: 450, color: '#94a3b8' },
    { name: 'Basic', value: 180, color: '#60a5fa' },
    { name: 'Pro', value: 95, color: '#a855f7' },
    { name: 'Enterprise', value: 42, color: '#f59e0b' },
  ]);

  const [integrationStats, setIntegrationStats] = useState([
    { name: 'Kiwify', users: 145, color: '#10b981' },
    { name: 'Hotmart', users: 132, color: '#f59e0b' },
    { name: 'Stripe', users: 98, color: '#6366f1' },
    { name: 'PayPal', users: 76, color: '#0ea5e9' },
    { name: 'Mercado Pago', users: 54, color: '#14b8a6' },
  ]);

  const [channelStats, setChannelStats] = useState([
    { name: 'WhatsApp', users: 234, engagement: 92 },
    { name: 'Instagram', users: 198, engagement: 87 },
    { name: 'Email', users: 176, engagement: 78 },
    { name: 'Telegram', users: 143, engagement: 85 },
    { name: 'Facebook', users: 87, engagement: 65 },
  ]);

  const [featureUsage, setFeatureUsage] = useState([
    { feature: 'CRM', free: 45, basic: 78, pro: 95, enterprise: 100 },
    { feature: 'Automações', free: 0, basic: 65, pro: 89, enterprise: 98 },
    { feature: 'Integrações', free: 23, basic: 67, pro: 92, enterprise: 100 },
    { feature: 'Relatórios', free: 12, basic: 56, pro: 87, enterprise: 97 },
    { feature: 'IA Assistant', free: 0, basic: 0, pro: 78, enterprise: 95 },
  ]);

  const [conversionFunnel, setConversionFunnel] = useState([
    { stage: 'Visitantes', users: 1000, rate: 100 },
    { stage: 'Cadastros', users: 450, rate: 45 },
    { stage: 'Trial', users: 280, rate: 28 },
    { stage: 'Pagantes', users: 98, rate: 9.8 },
  ]);

  // Carregar analytics
  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem('plataforma_access_token');

      // Simular carregamento de dados
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dados mock
      setAnalytics({
        revenue: {
          mrr: 5340,
          arr: 64080,
          growth: 18.5,
        },
        users: {
          total: 767,
          new: 45,
          active: 589,
          trial: 178,
          paid: 267,
        },
        conversion: {
          rate: 34.8,
          trialToPaid: 35.0,
        },
        engagement: {
          avgSessionTime: 24.5,
          featuresUsed: 5.3,
          activeRate: 76.8,
        },
      });
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
      notifyError('Erro ao carregar analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  // Cores para gráficos
  const COLORS = {
    primary: '#a855f7',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
    success: '#10b981',
    danger: '#ef4444',
    info: '#0ea5e9',
  };

  // Custom tooltip para gráficos
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSync className="animate-spin text-6xl text-purple-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <PageHeader
        title="Analytics & Insights"
        subtitle="Visualize métricas detalhadas de receita, usuários e engajamento"
        breadcrumbs={[
          { label: 'Dashboard', href: '#', onClick: () => onNavigate('dashboard') },
          { label: 'Admin', href: '#', onClick: () => onNavigate('admin') },
          { label: 'Analytics' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <FaCalendarAlt className="mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
                <SelectItem value="365">Último ano</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={loadAnalytics} className="bg-purple-600 hover:bg-purple-700">
              <FaSync className="mr-2" />
              Atualizar
            </Button>
          </div>
        }
      />

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="MRR"
          value={`R$ ${analytics.revenue.mrr.toLocaleString('pt-BR')}`}
          icon={<FaDollarSign />}
          trend={analytics.revenue.growth}
          trendLabel="vs. mês anterior"
          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
        />

        <StatCard
          title="ARR"
          value={`R$ ${analytics.revenue.arr.toLocaleString('pt-BR')}`}
          icon={<FaMoneyBillWave />}
          description="Annual Recurring Revenue"
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
        />

        <StatCard
          title="Usuários Ativos"
          value={analytics.users.active}
          icon={<FaUsers />}
          trend={12.3}
          trendLabel={`${analytics.users.new} novos`}
          className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
        />

        <StatCard
          title="Taxa de Conversão"
          value={`${analytics.conversion.trialToPaid}%`}
          icon={<FaPercent />}
          description="Trial → Pagante"
          className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20"
        />
      </div>

      {/* Crescimento de Usuários e Receita */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaChartLine className="text-purple-600" />
              Crescimento de Usuários
            </CardTitle>
            <CardDescription>Evolução de usuários nos últimos {timeRange} dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke={COLORS.primary}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  name="Usuários"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaDollarSign className="text-green-600" />
              Crescimento de Receita
            </CardTitle>
            <CardDescription>MRR nos últimos {timeRange} dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={COLORS.success}
                  strokeWidth={3}
                  name="Receita (R$)"
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição de Planos e Integrações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaCrown className="text-amber-600" />
              Distribuição de Planos
            </CardTitle>
            <CardDescription>Usuários por plano de assinatura</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {planDistribution.map((plan) => (
                <div key={plan.name} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: plan.color }} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {plan.name}: {plan.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaRocket className="text-blue-600" />
              Integrações Mais Usadas
            </CardTitle>
            <CardDescription>Plataformas de pagamento conectadas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={integrationStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="users" name="Usuários" radius={[0, 8, 8, 0]}>
                  {integrationStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Canais de Comunicação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaFire className="text-orange-600" />
            Canais Mais Populares
          </CardTitle>
          <CardDescription>Uso e engajamento por canal de comunicação</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={channelStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke={COLORS.primary} />
              <YAxis yAxisId="right" orientation="right" stroke={COLORS.success} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId="left" dataKey="users" fill={COLORS.primary} name="Usuários" radius={[8, 8, 0, 0]} />
              <Bar
                yAxisId="right"
                dataKey="engagement"
                fill={COLORS.success}
                name="Engajamento (%)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Uso de Features por Plano */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaTrophy className="text-yellow-600" />
            Uso de Features por Plano
          </CardTitle>
          <CardDescription>Percentual de usuários utilizando cada feature</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={featureUsage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="feature" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="free" stackId="a" fill="#94a3b8" name="Free" />
              <Bar dataKey="basic" stackId="a" fill="#60a5fa" name="Basic" />
              <Bar dataKey="pro" stackId="a" fill="#a855f7" name="Pro" />
              <Bar dataKey="enterprise" stackId="a" fill="#f59e0b" name="Enterprise" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Funil de Conversão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaUserPlus className="text-indigo-600" />
            Funil de Conversão
          </CardTitle>
          <CardDescription>Jornada do usuário desde a primeira visita até pagamento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversionFunnel.map((stage, index) => {
              const width = stage.rate;
              const isLast = index === conversionFunnel.length - 1;
              return (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{stage.stage}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{stage.users} usuários</span>
                      <Badge
                        className={`${
                          isLast
                            ? 'bg-gradient-to-r from-green-500 to-green-600'
                            : 'bg-gradient-to-r from-purple-500 to-purple-600'
                        } text-white`}
                      >
                        {stage.rate}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8">
                    <div
                      className={`h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                        isLast
                          ? 'bg-gradient-to-r from-green-500 to-green-600'
                          : 'bg-gradient-to-r from-purple-500 to-purple-600'
                      }`}
                      style={{ width: `${width}%`, minWidth: '60px' }}
                    >
                      {stage.users}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Métricas de Engajamento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-purple-900 dark:text-purple-100">Tempo Médio de Sessão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-600">{analytics.engagement.avgSessionTime} min</div>
            <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">
              Usuários passam em média {analytics.engagement.avgSessionTime} minutos por sessão
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">Features Utilizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">{analytics.engagement.featuresUsed}</div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
              Média de features diferentes usadas por usuário
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-900 dark:text-green-100">Taxa de Atividade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">{analytics.engagement.activeRate}%</div>
            <p className="text-sm text-green-700 dark:text-green-300 mt-2">
              Usuários ativos nos últimos {timeRange} dias
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
