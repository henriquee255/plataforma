import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification.jsx';
import PageHeader from '@/components/custom/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FaCog,
  FaPalette,
  FaEnvelope,
  FaBell,
  FaKey,
  FaShieldAlt,
  FaDatabase,
  FaWrench,
  FaSave,
  FaUndo,
  FaCrown,
  FaRocket,
  FaDollarSign,
  FaCheckCircle,
  FaServer,
  FaLock,
  FaClock,
  FaCalendarCheck,
  FaUpload,
  FaImage,
} from 'react-icons/fa';

const GlobalSettings = ({ onNavigate }) => {
  const { user } = useAuth();
  const { notifySuccess, notifyError, notifySaved } = useNotification();

  // Estados para Configurações de Plataforma
  const [platformName, setPlatformName] = useState('Synkra CRM');
  const [platformLogo, setPlatformLogo] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#8b5cf6');
  const [secondaryColor, setSecondaryColor] = useState('#ec4899');
  const [logoPreview, setLogoPreview] = useState(null);

  // Estados para Planos
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: 'Básico',
      price: 'R$ 49,90',
      priceValue: 49.90,
      interval: 'mensal',
      features: ['5 usuários', '1.000 contatos', '10 GB armazenamento'],
      maxUsers: 5,
      maxContacts: 1000,
      storage: 10,
      active: true,
    },
    {
      id: 2,
      name: 'Profissional',
      price: 'R$ 149,90',
      priceValue: 149.90,
      interval: 'mensal',
      features: ['20 usuários', '10.000 contatos', '50 GB armazenamento', 'Relatórios avançados'],
      maxUsers: 20,
      maxContacts: 10000,
      storage: 50,
      active: true,
    },
    {
      id: 3,
      name: 'Enterprise',
      price: 'R$ 499,90',
      priceValue: 499.90,
      interval: 'mensal',
      features: ['Usuários ilimitados', 'Contatos ilimitados', '500 GB armazenamento', 'Suporte prioritário', 'API personalizada'],
      maxUsers: -1,
      maxContacts: -1,
      storage: 500,
      active: true,
    },
  ]);

  // Estados para Email (SMTP)
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpSecure, setSmtpSecure] = useState(true);
  const [emailFrom, setEmailFrom] = useState('noreply@synkra.com');

  // Estados para Notificações
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [notifyNewUser, setNotifyNewUser] = useState(true);
  const [notifyNewSale, setNotifyNewSale] = useState(true);

  // Estados para Integrações Globais
  const [stripeApiKey, setStripeApiKey] = useState('');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [facebookPixelId, setFacebookPixelId] = useState('');
  const [awsAccessKey, setAwsAccessKey] = useState('');
  const [awsSecretKey, setAwsSecretKey] = useState('');
  const [twilioAccountSid, setTwilioAccountSid] = useState('');
  const [twilioAuthToken, setTwilioAuthToken] = useState('');

  // Estados para Segurança
  const [require2FA, setRequire2FA] = useState(false);
  const [minPasswordLength, setMinPasswordLength] = useState(8);
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireSpecialChars, setRequireSpecialChars] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);
  const [passwordExpiry, setPasswordExpiry] = useState(90);

  // Estados para Backups
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [backupRetention, setBackupRetention] = useState(30);
  const [backupLocation, setBackupLocation] = useState('aws-s3');
  const [lastBackup, setLastBackup] = useState('24/02/2026 às 03:00');

  // Estados para Manutenção
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [scheduledMaintenance, setScheduledMaintenance] = useState(false);
  const [maintenanceDate, setMaintenanceDate] = useState('');
  const [maintenanceTime, setMaintenanceTime] = useState('');
  const [maintenanceMessage, setMaintenanceMessage] = useState('Estamos realizando manutenção. Voltaremos em breve.');

  // Salvar Configurações de Plataforma
  const handleSavePlatform = () => {
    try {
      // Simulação de salvamento
      console.log('Salvando configurações da plataforma:', {
        platformName,
        platformLogo,
        primaryColor,
        secondaryColor,
      });
      notifySaved('Configurações de plataforma atualizadas');
    } catch (error) {
      notifyError('Erro ao salvar configurações');
    }
  };

  // Upload de Logo
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        notifyError('Logo deve ter menos de 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setPlatformLogo(reader.result);
        notifySuccess('Logo carregada com sucesso');
      };
      reader.readAsDataURL(file);
    }
  };

  // Salvar Email
  const handleSaveEmail = () => {
    try {
      if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
        notifyError('Preencha todos os campos SMTP');
        return;
      }
      console.log('Salvando configurações de email:', {
        smtpHost,
        smtpPort,
        smtpUser,
        smtpSecure,
        emailFrom,
      });
      notifySaved('Configurações de email atualizadas');
    } catch (error) {
      notifyError('Erro ao salvar configurações de email');
    }
  };

  // Testar Email
  const handleTestEmail = () => {
    try {
      console.log('Testando conexão SMTP...');
      notifySuccess('Email de teste enviado para ' + smtpUser);
    } catch (error) {
      notifyError('Falha ao enviar email de teste');
    }
  };

  // Salvar Notificações
  const handleSaveNotifications = () => {
    try {
      console.log('Salvando configurações de notificações');
      notifySaved('Preferências de notificação atualizadas');
    } catch (error) {
      notifyError('Erro ao salvar notificações');
    }
  };

  // Salvar Integrações
  const handleSaveIntegrations = () => {
    try {
      console.log('Salvando chaves de API');
      notifySaved('Integrações globais configuradas');
    } catch (error) {
      notifyError('Erro ao salvar integrações');
    }
  };

  // Salvar Segurança
  const handleSaveSecurity = () => {
    try {
      if (minPasswordLength < 6) {
        notifyError('Senha deve ter no mínimo 6 caracteres');
        return;
      }
      console.log('Salvando políticas de segurança');
      notifySaved('Políticas de segurança atualizadas');
    } catch (error) {
      notifyError('Erro ao salvar configurações de segurança');
    }
  };

  // Salvar Backups
  const handleSaveBackups = () => {
    try {
      console.log('Salvando configurações de backup');
      notifySaved('Configurações de backup atualizadas');
    } catch (error) {
      notifyError('Erro ao salvar backups');
    }
  };

  // Executar Backup Manual
  const handleManualBackup = () => {
    try {
      console.log('Iniciando backup manual...');
      notifySuccess('Backup iniciado. Você será notificado quando concluir.');
      setTimeout(() => {
        setLastBackup(new Date().toLocaleString('pt-BR'));
        notifySuccess('Backup concluído com sucesso!');
      }, 3000);
    } catch (error) {
      notifyError('Erro ao iniciar backup');
    }
  };

  // Salvar Manutenção
  const handleSaveMaintenance = () => {
    try {
      if (scheduledMaintenance && (!maintenanceDate || !maintenanceTime)) {
        notifyError('Defina data e horário da manutenção');
        return;
      }
      console.log('Salvando configurações de manutenção');
      notifySaved('Configurações de manutenção atualizadas');
    } catch (error) {
      notifyError('Erro ao salvar manutenção');
    }
  };

  // Ativar modo manutenção imediatamente
  const handleToggleMaintenanceMode = (enabled) => {
    setMaintenanceMode(enabled);
    if (enabled) {
      notifySuccess('Modo de manutenção ATIVADO');
    } else {
      notifySuccess('Modo de manutenção DESATIVADO');
    }
  };

  // Editar Plano
  const handleEditPlan = (planId) => {
    const plan = plans.find(p => p.id === planId);
    console.log('Editando plano:', plan);
    notifySuccess(`Editando plano ${plan.name}`);
  };

  // Toggle Plano
  const handleTogglePlan = (planId) => {
    setPlans(plans.map(p =>
      p.id === planId ? { ...p, active: !p.active } : p
    ));
    const plan = plans.find(p => p.id === planId);
    if (plan.active) {
      notifySuccess(`Plano ${plan.name} desativado`);
    } else {
      notifySuccess(`Plano ${plan.name} ativado`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <PageHeader
        title="Configurações Globais"
        subtitle="Gerencie todas as configurações da plataforma"
        breadcrumbs={[
          { label: 'Dashboard', href: '#', onClick: () => onNavigate('dashboard') },
          { label: 'Admin', href: '#', onClick: () => onNavigate('admin') },
          { label: 'Configurações Globais' },
        ]}
      />

      {/* 1. CONFIGURAÇÕES DE PLATAFORMA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaPalette className="text-purple-600" />
            Configurações de Plataforma
          </CardTitle>
          <CardDescription>
            Personalize nome, logo e cores da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="platform-name">Nome da Plataforma</Label>
            <Input
              id="platform-name"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              placeholder="Nome da sua plataforma"
            />
          </div>

          {/* Logo */}
          <div className="space-y-2">
            <Label htmlFor="platform-logo">Logo da Plataforma</Label>
            <div className="flex items-center gap-4">
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="w-24 h-24 object-contain border-2 border-purple-500 rounded-lg"
                />
              )}
              <div className="flex-1">
                <Input
                  id="platform-logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">PNG, JPG ou SVG. Máximo 2MB.</p>
              </div>
            </div>
          </div>

          {/* Cores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Cor Primária</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#8b5cf6"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary-color">Cor Secundária</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  placeholder="#ec4899"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <Button onClick={handleSavePlatform} className="bg-purple-600 hover:bg-purple-700">
              <FaSave className="mr-2" />
              Salvar Configurações
            </Button>
            <Button variant="outline" onClick={() => {
              setPlatformName('Synkra CRM');
              setPrimaryColor('#8b5cf6');
              setSecondaryColor('#ec4899');
              setLogoPreview(null);
            }}>
              <FaUndo className="mr-2" />
              Restaurar Padrão
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2. GERENCIAMENTO DE PLANOS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaCrown className="text-amber-500" />
            Gerenciamento de Planos
          </CardTitle>
          <CardDescription>
            Configure preços, features e limites de cada plano
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`p-4 border-2 rounded-lg ${
                plan.active
                  ? 'border-purple-300 bg-purple-50 dark:bg-purple-900/10'
                  : 'border-gray-300 bg-gray-50 dark:bg-gray-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <span className="text-2xl font-bold text-purple-600">
                      {plan.price}
                      <span className="text-sm text-gray-500 ml-1">/{plan.interval}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <FaCheckCircle className="text-green-500" />
                      <span>
                        {plan.maxUsers === -1 ? 'Usuários ilimitados' : `${plan.maxUsers} usuários`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <FaCheckCircle className="text-green-500" />
                      <span>
                        {plan.maxContacts === -1 ? 'Contatos ilimitados' : `${plan.maxContacts.toLocaleString()} contatos`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <FaCheckCircle className="text-green-500" />
                      <span>{plan.storage} GB armazenamento</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {plan.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditPlan(plan.id)}
                  >
                    Editar
                  </Button>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={plan.active}
                      onCheckedChange={() => handleTogglePlan(plan.id)}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {plan.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 3. CONFIGURAÇÕES DE EMAIL (SMTP) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaEnvelope className="text-blue-600" />
            Configurações de Email (SMTP)
          </CardTitle>
          <CardDescription>
            Configure o servidor SMTP para envio de emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">Host SMTP</Label>
              <Input
                id="smtp-host"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                placeholder="smtp.gmail.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtp-port">Porta</Label>
              <Input
                id="smtp-port"
                value={smtpPort}
                onChange={(e) => setSmtpPort(e.target.value)}
                placeholder="587"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtp-user">Usuário</Label>
              <Input
                id="smtp-user"
                type="email"
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
                placeholder="seu-email@gmail.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtp-password">Senha</Label>
              <Input
                id="smtp-password"
                type="password"
                value={smtpPassword}
                onChange={(e) => setSmtpPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-from">Email Remetente</Label>
              <Input
                id="email-from"
                type="email"
                value={emailFrom}
                onChange={(e) => setEmailFrom(e.target.value)}
                placeholder="noreply@synkra.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Conexão Segura (TLS/SSL)</Label>
              <div className="flex items-center gap-2 h-10">
                <Switch
                  checked={smtpSecure}
                  onCheckedChange={setSmtpSecure}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {smtpSecure ? 'Ativado' : 'Desativado'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t">
            <Button onClick={handleSaveEmail} className="bg-blue-600 hover:bg-blue-700">
              <FaSave className="mr-2" />
              Salvar Email
            </Button>
            <Button variant="outline" onClick={handleTestEmail}>
              <FaEnvelope className="mr-2" />
              Enviar Teste
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 4. CONFIGURAÇÕES DE NOTIFICAÇÕES */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaBell className="text-yellow-600" />
            Configurações de Notificações
          </CardTitle>
          <CardDescription>
            Defina como e quando os usuários recebem notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Canais de Notificação */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Canais de Notificação</h3>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Email</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Enviar notificações por email</p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Push</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Notificações push no navegador</p>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">SMS</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Enviar SMS (requer integração Twilio)</p>
              </div>
              <Switch
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
              />
            </div>
          </div>

          {/* Tipos de Notificação */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="font-semibold text-gray-900 dark:text-white">Eventos Notificáveis</h3>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Novo Usuário</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Notificar quando novo usuário se cadastrar</p>
              </div>
              <Switch
                checked={notifyNewUser}
                onCheckedChange={setNotifyNewUser}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Nova Venda</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Notificar quando houver uma nova venda</p>
              </div>
              <Switch
                checked={notifyNewSale}
                onCheckedChange={setNotifyNewSale}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Relatórios Semanais</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Enviar resumo semanal por email</p>
              </div>
              <Switch
                checked={weeklyReports}
                onCheckedChange={setWeeklyReports}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t">
            <Button onClick={handleSaveNotifications} className="bg-yellow-600 hover:bg-yellow-700">
              <FaSave className="mr-2" />
              Salvar Notificações
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 5. INTEGRAÇÕES GLOBAIS (API KEYS) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaKey className="text-orange-600" />
            Integrações Globais (API Keys)
          </CardTitle>
          <CardDescription>
            Configure chaves de API para integrações de terceiros
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Stripe */}
            <div className="space-y-2">
              <Label htmlFor="stripe-key">Stripe API Key</Label>
              <Input
                id="stripe-key"
                type="password"
                value={stripeApiKey}
                onChange={(e) => setStripeApiKey(e.target.value)}
                placeholder="sk_live_..."
              />
            </div>

            {/* Google Analytics */}
            <div className="space-y-2">
              <Label htmlFor="ga-id">Google Analytics ID</Label>
              <Input
                id="ga-id"
                value={googleAnalyticsId}
                onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                placeholder="G-XXXXXXXXXX"
              />
            </div>

            {/* Facebook Pixel */}
            <div className="space-y-2">
              <Label htmlFor="fb-pixel">Facebook Pixel ID</Label>
              <Input
                id="fb-pixel"
                value={facebookPixelId}
                onChange={(e) => setFacebookPixelId(e.target.value)}
                placeholder="1234567890"
              />
            </div>

            {/* AWS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aws-access">AWS Access Key</Label>
                <Input
                  id="aws-access"
                  type="password"
                  value={awsAccessKey}
                  onChange={(e) => setAwsAccessKey(e.target.value)}
                  placeholder="AKIA..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aws-secret">AWS Secret Key</Label>
                <Input
                  id="aws-secret"
                  type="password"
                  value={awsSecretKey}
                  onChange={(e) => setAwsSecretKey(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Twilio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="twilio-sid">Twilio Account SID</Label>
                <Input
                  id="twilio-sid"
                  type="password"
                  value={twilioAccountSid}
                  onChange={(e) => setTwilioAccountSid(e.target.value)}
                  placeholder="AC..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twilio-token">Twilio Auth Token</Label>
                <Input
                  id="twilio-token"
                  type="password"
                  value={twilioAuthToken}
                  onChange={(e) => setTwilioAuthToken(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t">
            <Button onClick={handleSaveIntegrations} className="bg-orange-600 hover:bg-orange-700">
              <FaSave className="mr-2" />
              Salvar Integrações
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 6. CONFIGURAÇÕES DE SEGURANÇA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaShieldAlt className="text-red-600" />
            Configurações de Segurança
          </CardTitle>
          <CardDescription>
            Defina políticas de senha, 2FA e controles de acesso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 2FA Obrigatório */}
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-800 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">2FA Obrigatório</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Exigir autenticação de dois fatores para todos os usuários
              </p>
            </div>
            <Switch
              checked={require2FA}
              onCheckedChange={setRequire2FA}
            />
          </div>

          {/* Políticas de Senha */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Políticas de Senha</h3>

            <div className="space-y-2">
              <Label htmlFor="min-password">Comprimento Mínimo</Label>
              <Input
                id="min-password"
                type="number"
                min="6"
                max="32"
                value={minPasswordLength}
                onChange={(e) => setMinPasswordLength(parseInt(e.target.value))}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-900 dark:text-white">Exigir letra maiúscula</p>
              <Switch
                checked={requireUppercase}
                onCheckedChange={setRequireUppercase}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-900 dark:text-white">Exigir números</p>
              <Switch
                checked={requireNumbers}
                onCheckedChange={setRequireNumbers}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-900 dark:text-white">Exigir caracteres especiais</p>
              <Switch
                checked={requireSpecialChars}
                onCheckedChange={setRequireSpecialChars}
              />
            </div>
          </div>

          {/* Controles de Sessão */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-gray-900 dark:text-white">Controles de Sessão</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Timeout de Sessão (minutos)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  min="5"
                  max="1440"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-attempts">Máximo de Tentativas de Login</Label>
                <Input
                  id="max-attempts"
                  type="number"
                  min="3"
                  max="10"
                  value={maxLoginAttempts}
                  onChange={(e) => setMaxLoginAttempts(parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-expiry">Expiração de Senha (dias)</Label>
                <Input
                  id="password-expiry"
                  type="number"
                  min="0"
                  max="365"
                  value={passwordExpiry}
                  onChange={(e) => setPasswordExpiry(parseInt(e.target.value))}
                  placeholder="0 = nunca expira"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t">
            <Button onClick={handleSaveSecurity} className="bg-red-600 hover:bg-red-700">
              <FaSave className="mr-2" />
              Salvar Segurança
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 7. BACKUPS AUTOMÁTICOS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaDatabase className="text-green-600" />
            Backups Automáticos
          </CardTitle>
          <CardDescription>
            Configure backups periódicos do banco de dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ativar Backup Automático */}
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/10 border-2 border-green-200 dark:border-green-800 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Backup Automático</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ativar backups automáticos do banco de dados
              </p>
            </div>
            <Switch
              checked={autoBackup}
              onCheckedChange={setAutoBackup}
            />
          </div>

          {/* Configurações de Backup */}
          {autoBackup && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Frequência</Label>
                  <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                    <SelectTrigger id="backup-frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">A cada hora</SelectItem>
                      <SelectItem value="daily">Diariamente</SelectItem>
                      <SelectItem value="weekly">Semanalmente</SelectItem>
                      <SelectItem value="monthly">Mensalmente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backup-retention">Retenção (dias)</Label>
                  <Input
                    id="backup-retention"
                    type="number"
                    min="7"
                    max="365"
                    value={backupRetention}
                    onChange={(e) => setBackupRetention(parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backup-location">Local de Armazenamento</Label>
                  <Select value={backupLocation} onValueChange={setBackupLocation}>
                    <SelectTrigger id="backup-location">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Servidor Local</SelectItem>
                      <SelectItem value="aws-s3">AWS S3</SelectItem>
                      <SelectItem value="google-cloud">Google Cloud</SelectItem>
                      <SelectItem value="azure">Azure Storage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Último Backup */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Último Backup</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{lastBackup}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleManualBackup}>
                    <FaDatabase className="mr-2" />
                    Backup Manual
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-4 border-t">
            <Button onClick={handleSaveBackups} className="bg-green-600 hover:bg-green-700">
              <FaSave className="mr-2" />
              Salvar Backups
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 8. MANUTENÇÃO PROGRAMADA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaWrench className="text-indigo-600" />
            Manutenção Programada
          </CardTitle>
          <CardDescription>
            Programe janelas de manutenção ou ative modo de manutenção
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Modo Manutenção Imediato */}
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-800 rounded-lg">
            <div>
              <p className="font-semibold text-red-900 dark:text-red-100">Modo de Manutenção</p>
              <p className="text-sm text-red-600 dark:text-red-400">
                ATENÇÃO: Bloqueia acesso de todos os usuários imediatamente
              </p>
            </div>
            <Switch
              checked={maintenanceMode}
              onCheckedChange={handleToggleMaintenanceMode}
            />
          </div>

          {/* Manutenção Programada */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Programar Manutenção</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Agendar janela de manutenção futura
                </p>
              </div>
              <Switch
                checked={scheduledMaintenance}
                onCheckedChange={setScheduledMaintenance}
              />
            </div>

            {scheduledMaintenance && (
              <div className="space-y-4 pl-4 border-l-4 border-indigo-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maintenance-date">Data</Label>
                    <Input
                      id="maintenance-date"
                      type="date"
                      value={maintenanceDate}
                      onChange={(e) => setMaintenanceDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maintenance-time">Horário</Label>
                    <Input
                      id="maintenance-time"
                      type="time"
                      value={maintenanceTime}
                      onChange={(e) => setMaintenanceTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maintenance-message">Mensagem para Usuários</Label>
                  <Input
                    id="maintenance-message"
                    value={maintenanceMessage}
                    onChange={(e) => setMaintenanceMessage(e.target.value)}
                    placeholder="Estamos realizando manutenção..."
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t">
            <Button onClick={handleSaveMaintenance} className="bg-indigo-600 hover:bg-indigo-700">
              <FaSave className="mr-2" />
              Salvar Manutenção
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalSettings;
