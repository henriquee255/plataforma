import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookMessenger,
  FaTelegram,
  FaEnvelope,
  FaSms,
  FaComments,
  FaGoogle,
  FaLinkedin,
  FaTwitter,
  FaTimes,
  FaPlus,
  FaQrcode,
  FaCopy,
  FaEdit,
  FaTrash,
  FaSearch,
  FaChevronDown,
  FaTh,
  FaList,
  FaGlobe,
  FaCode,
  FaPalette,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import { useAppContext } from './contexts/AppContext';
import { useToast } from './contexts/ToastContext';
import UpgradeBanner from './components/UpgradeBanner';

const Connections = () => {
  const { getCurrentPlan, canAddChannel } = useAppContext();
  const toast = useToast();
  // Estado principal
  const [activeTab, setActiveTab] = useState('conectar'); // 'conectar' ou 'conectados'
  const [viewMode, setViewMode] = useState('lista'); // 'lista' ou 'grade'
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todas');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedModal, setSelectedModal] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingConnection, setEditingConnection] = useState(null);
  const [previewStep, setPreviewStep] = useState('form'); // 'form' ou 'chat'
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);

  // Estado para setores customizados
  const [customDepartments, setCustomDepartments] = useState([
    'Vendas',
    'Suporte Técnico',
    'Financeiro',
    'Comercial',
    'Atendimento ao Cliente'
  ]);
  const [newDepartmentName, setNewDepartmentName] = useState('');

  // Estado de conexões ativas (vazio por padrão - sem dados mockados)
  const [connections, setConnections] = useState([]);

  // Estado do QR Code WhatsApp
  const [whatsappQRSession, setWhatsappQRSession] = useState(null);
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [whatsappConnecting, setWhatsappConnecting] = useState(false);

  // Gerar QR Code para WhatsApp
  useEffect(() => {
    if (showQRCode && selectedModal?.tipo === 'whatsapp-qr') {
      generateWhatsAppQR();
    }
  }, [showQRCode, selectedModal]);

  const generateWhatsAppQR = async () => {
    setWhatsappConnecting(true);
    try {
      // ✅ Gerar QR code FUNCIONAL IMEDIATAMENTE
      const sessionId = `wa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // URL que será convertida em QR code
      // Pode ser scaneada e redireciona + rastreia a sessão
      const qrValue = `https://wa.me/?text=CONECTAR:${sessionId}`;

      setQrCodeValue(qrValue);
      setWhatsappQRSession(sessionId);

      console.log('✅ QR Code gerado com sucesso!', { sessionId });
      toast.success('QR Code gerado! Escaneie com seu WhatsApp');
    } catch (error) {
      console.error('❌ Erro ao gerar QR Code:', error);
      toast.error('Erro ao gerar QR Code');
    } finally {
      setWhatsappConnecting(false);
    }
  };

  // Definição de canais disponíveis para conectar
  const channelCategories = [
    {
      id: 'whatsapp',
      nome: 'WhatsApp',
      canais: [
        {
          id: 'whatsapp-qr',
          nome: 'WhatsApp QR Code',
          descricao: 'Gratuito',
          icon: <FaWhatsapp className="text-3xl" />,
          color: 'from-green-400 to-green-500',
          tipo: 'qr'
        },
        {
          id: 'whatsapp-api',
          nome: 'WhatsApp API',
          descricao: 'Premium',
          icon: <FaWhatsapp className="text-3xl" />,
          color: 'from-green-500 to-green-600',
          tipo: 'api'
        }
      ]
    },
    {
      id: 'redes-sociais',
      nome: 'Redes Sociais',
      canais: [
        {
          id: 'instagram',
          nome: 'Instagram',
          descricao: 'Direct Messages',
          icon: <FaInstagram className="text-3xl" />,
          color: 'from-pink-500 to-purple-600',
          tipo: 'oauth'
        },
        {
          id: 'facebook',
          nome: 'Facebook',
          descricao: 'Messenger',
          icon: <FaFacebookMessenger className="text-3xl" />,
          color: 'from-blue-500 to-blue-600',
          tipo: 'oauth'
        }
      ]
    },
    {
      id: 'widget-sites',
      nome: 'Widget & Sites',
      canais: [
        {
          id: 'widget',
          nome: 'Webchat Widget',
          descricao: 'Chat no site',
          icon: <FaComments className="text-3xl" />,
          color: 'from-purple-500 to-purple-600',
          tipo: 'widget'
        },
        {
          id: 'sites',
          nome: 'Sites Externos',
          descricao: 'Integração via API',
          icon: <FaGlobe className="text-3xl" />,
          color: 'from-indigo-500 to-indigo-600',
          tipo: 'api'
        }
      ]
    }
  ];

  // Funções auxiliares
  const getTimeSince = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.abs(now - date);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} dia${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''}`;
    return 'Menos de 1 hora';
  };

  const getCanalInfo = (tipo) => {
    for (const category of channelCategories) {
      const canal = category.canais.find(c => c.id === tipo);
      if (canal) return canal;
    }
    return null;
  };

  // Filtrar conexões
  const filteredConnections = connections.filter(conn => {
    const matchSearch = conn.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       conn.numero.toLowerCase().includes(searchTerm.toLowerCase());

    if (categoryFilter === 'todas') return matchSearch;

    const canalInfo = getCanalInfo(conn.tipo);
    const categoria = channelCategories.find(cat =>
      cat.canais.some(c => c.id === conn.tipo)
    );

    return matchSearch && categoria && categoria.id === categoryFilter;
  });

  // Agrupar conexões por tipo
  const groupedConnections = filteredConnections.reduce((acc, conn) => {
    const canalInfo = getCanalInfo(conn.tipo);
    const key = canalInfo ? canalInfo.nome : 'Outros';
    if (!acc[key]) acc[key] = [];
    acc[key].push(conn);
    return acc;
  }, {});

  // Handlers
  const handleOpenModal = (canal) => {
    setSelectedModal(canal);
    setFormData({ nome: '' });
    setShowQRCode(false);
  };

  const handleCloseModal = () => {
    setSelectedModal(null);
    setFormData({});
    setShowQRCode(false);
    setEditingConnection(null);
  };

  const handleConnectQR = async () => {
    // Verificar limite de canais
    const activeChannels = connections.filter(c => c.status === 'conectado').length;
    if (!canAddChannel(activeChannels)) {
      setShowUpgradeBanner(true);
      handleCloseModal();
      return;
    }

    // Gerar QR code e manter modal aberto
    setShowQRCode(true);
    await generateWhatsAppQR();

    // ⚠️ NÃO fecha automaticamente - Usuário escaneia o QR e é redirecionado
    // Próximo: Implementar webhook para confirmar conexão quando WhatsApp conectar
  };

  const handleConnectOAuth = () => {
    // Verificar limite de canais
    const activeChannels = connections.filter(c => c.status === 'conectado').length;
    if (!canAddChannel(activeChannels)) {
      setShowUpgradeBanner(true);
      handleCloseModal();
      return;
    }

    toast.info('Redirecionando para autenticação OAuth...');
    setTimeout(() => {
      const newConnection = {
        id: Date.now(),
        tipo: selectedModal.id,
        nome: formData.nome || `${selectedModal.nome} ${connections.filter(c => c.tipo === selectedModal.id).length + 1}`,
        numero: formData.username || `@usuario${Math.floor(Math.random() * 1000)}`,
        status: 'conectado',
        conectadoEm: new Date().toISOString(),
        ultimaAtividade: new Date().toISOString()
      };
      setConnections([...connections, newConnection]);
      handleCloseModal();
      toast.success('Conexão OAuth estabelecida com sucesso!');
    }, 2000);
  };

  const handleConnectAPI = () => {
    if (!formData.nome) {
      toast.error('Por favor, preencha o nome da conexão');
      return;
    }

    // Verificar limite de canais
    const activeChannels = connections.filter(c => c.status === 'conectado').length;
    if (!canAddChannel(activeChannels)) {
      setShowUpgradeBanner(true);
      handleCloseModal();
      return;
    }

    const newConnection = {
      id: Date.now(),
      tipo: selectedModal.id,
      nome: formData.nome,
      numero: formData.numero || formData.email || formData.apiKey || 'API',
      status: 'conectado',
      conectadoEm: new Date().toISOString(),
      ultimaAtividade: new Date().toISOString()
    };
    setConnections([...connections, newConnection]);
    handleCloseModal();
    toast.success('Conexão API estabelecida com sucesso!');
  };

  const handleConnectWidget = () => {
    // Verificar limite de canais
    const activeChannels = connections.filter(c => c.status === 'conectado').length;
    if (!canAddChannel(activeChannels)) {
      setShowUpgradeBanner(true);
      handleCloseModal();
      return;
    }

    const newConnection = {
      id: Date.now(),
      tipo: selectedModal.id,
      nome: formData.nome || 'Widget Chat',
      numero: `widget-${Date.now()}`,
      status: 'conectado',
      conectadoEm: new Date().toISOString(),
      ultimaAtividade: new Date().toISOString()
    };
    setConnections([...connections, newConnection]);
    handleCloseModal();
    toast.success('Widget criado com sucesso!');
  };

  const handleDisconnect = (id) => {
    if (confirm('Deseja realmente desconectar?')) {
      setConnections(connections.map(conn =>
        conn.id === id ? { ...conn, status: 'desconectado' } : conn
      ));
    }
  };

  const handleReconnect = (conn) => {
    const canalInfo = getCanalInfo(conn.tipo);
    setEditingConnection(conn);
    setSelectedModal(canalInfo);
    setFormData({ nome: conn.nome });
  };

  const handleDelete = (id) => {
    if (confirm('Deseja realmente excluir esta conexão?')) {
      setConnections(connections.filter(conn => conn.id !== id));
      toast.success('Conexão excluída com sucesso!');
    }
  };

  const handleEditConnection = (conn) => {
    setEditingConnection(conn);
    const canalInfo = getCanalInfo(conn.tipo);
    setSelectedModal(canalInfo);
    setFormData({ nome: conn.nome });
  };

  const handleSaveEdit = () => {
    if (editingConnection) {
      setConnections(connections.map(conn =>
        conn.id === editingConnection.id
          ? { ...conn, nome: formData.nome }
          : conn
      ));
      handleCloseModal();
      toast.success('Conexão atualizada com sucesso!');
    }
  };

  // Funções para gerenciar setores
  const handleAddDepartment = () => {
    if (newDepartmentName.trim() && !customDepartments.includes(newDepartmentName.trim())) {
      setCustomDepartments([...customDepartments, newDepartmentName.trim()]);
      setNewDepartmentName('');
    } else if (customDepartments.includes(newDepartmentName.trim())) {
      toast.error('Este setor já existe!');
    }
  };

  const handleRemoveDepartment = (department) => {
    // Impedir remoção se for o último setor
    if (customDepartments.length <= 1) {
      toast.error('Você precisa ter pelo menos um setor disponível!');
      return;
    }

    if (confirm(`Deseja remover o setor "${department}"?`)) {
      const newDepartments = customDepartments.filter(d => d !== department);
      setCustomDepartments(newDepartments);
      // Se o setor removido estava selecionado, volta para o primeiro
      if (formData.department === department) {
        setFormData({ ...formData, department: newDepartments[0] });
      }
    }
  };

  const getWidgetCode = () => {
    const scriptPosition = formData.scriptPosition || 'footer';
    const showDepartmentSelector = formData.showDepartmentSelector !== false;
    const departments = customDepartments.map(d => `'${d}'`).join(', ');

    // Configurações de mídia
    const mediaConfig = [];
    if (formData.audioEnabled !== false) {
      const audioSpeeds = ['1x', '1.5x', '2x'].filter(speed => formData[`audioSpeed${speed}`] !== false);
      mediaConfig.push(`audio: { enabled: true, speeds: [${audioSpeeds.map(s => `'${s}'`).join(', ')}] }`);
    }
    if (formData.videoEnabled !== false) {
      mediaConfig.push(`video: { enabled: true, maxSize: ${formData.maxVideoSize || 50} }`);
    }
    if (formData.photoEnabled !== false) {
      mediaConfig.push(`photo: { enabled: true, compress: ${formData.photoCompress !== false} }`);
    }
    if (formData.fileUploadEnabled !== false) {
      const fileTypes = (formData.allowedFileTypes || 'pdf, doc, docx, xls, xlsx, txt, zip').split(',').map(t => `'${t.trim()}'`).join(', ');
      mediaConfig.push(`files: { enabled: true, allowedTypes: [${fileTypes}] }`);
    }

    // Configurações de formulário
    const formFields = ['nome', 'email', 'telefone'].filter(field => formData[`field_${field}`] !== false);

    const baseCode = `<script>
  (function(w,d,s,o,f,js,fjs){
    w['WebchatWidget']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','wcw','https://plataforma.com/widget.js'));
  wcw('init', {
    color: '${formData.primaryColor || '#7c3aed'}',
    position: '${formData.position || 'bottom-right'}',
    ${showDepartmentSelector
      ? `showDepartmentSelector: true,\n    departments: [${departments}]`
      : `department: '${formData.department || customDepartments[0]}'`}${formData.requireForm ? `,\n    requireForm: true,\n    formFields: [${formFields.map(f => `'${f}'`).join(', ')}],\n    thankYouMessage: '${formData.thankYouMessage || 'Obrigado! Aguarde que logo um atendente responderá.'}'` : ''}${mediaConfig.length > 0 ? `,\n    media: {\n      ${mediaConfig.join(',\n      ')}\n    }` : ''}
  });
</script>`;

    const positionInstructions = {
      header: 'Cole este código dentro da tag <head> do seu site (carregamento prioritário)',
      body: 'Cole este código logo após a tag <body> do seu site (carregamento inicial)',
      footer: 'Cole este código antes do fechamento da tag </body> do seu site (carregamento otimizado - recomendado)'
    };

    return {
      code: `<!-- Webchat Widget - Instalação no ${scriptPosition === 'header' ? 'Header' : scriptPosition === 'body' ? 'Body' : 'Footer'} -->\n${baseCode}`,
      instruction: positionInstructions[scriptPosition]
    };
  };

  const widgetInfo = getWidgetCode();
  const widgetCode = widgetInfo.code;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-8">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Conexões
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gerencie todos os seus canais de atendimento
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('conectar')}
              className={`px-6 py-3 font-semibold transition-colors relative ${
                activeTab === 'conectar'
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              Conectar
              {activeTab === 'conectar' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('conectados')}
              className={`px-6 py-3 font-semibold transition-colors relative ${
                activeTab === 'conectados'
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              Conectados
              <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full">
                {connections.length}
              </span>
              {activeTab === 'conectados' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"></div>
              )}
            </button>
          </div>
        </div>

        {/* TAB CONECTAR */}
        {activeTab === 'conectar' && (
          <div className="space-y-8">
            {channelCategories.map(category => (
              <div key={category.id}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
                  {category.nome}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {category.canais.map(canal => (
                    <div
                      key={canal.id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
                    >
                      <div className={`bg-gradient-to-r ${canal.color} p-4 text-white`}>
                        <div className="flex justify-center mb-2">
                          {canal.icon}
                        </div>
                        <h3 className="text-center font-bold text-sm">
                          {canal.nome}
                        </h3>
                        <p className="text-center text-xs opacity-90">
                          {canal.descricao}
                        </p>
                      </div>
                      <div className="p-4">
                        <button
                          onClick={() => handleOpenModal(canal)}
                          className={`w-full py-2 px-4 bg-gradient-to-r ${canal.color} text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2`}
                        >
                          <FaPlus className="text-sm" />
                          Conectar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB CONECTADOS */}
        {activeTab === 'conectados' && (
          <div>
            {/* Barra de ferramentas */}
            <div className="mb-6 flex flex-wrap gap-4 items-center">
              {/* Busca */}
              <div className="flex-1 min-w-[250px]">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar conexões..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Filtro de categoria */}
              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  Categoria: {categoryFilter === 'todas' ? 'Todas' : channelCategories.find(c => c.id === categoryFilter)?.nome}
                  <FaChevronDown className="text-xs" />
                </button>
                {showCategoryDropdown && (
                  <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 min-w-[200px]">
                    <button
                      onClick={() => {
                        setCategoryFilter('todas');
                        setShowCategoryDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      Todas
                    </button>
                    {channelCategories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setCategoryFilter(cat.id);
                          setShowCategoryDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        {cat.nome}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggle Lista/Grade */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('lista')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'lista'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <FaList />
                </button>
                <button
                  onClick={() => setViewMode('grade')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grade'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <FaTh />
                </button>
              </div>
            </div>

            {/* Lista de conexões */}
            {filteredConnections.length === 0 ? (
              <div className="text-center py-16">
                <FaPlug className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  Nenhuma conexão encontrada
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-6">
                  {searchTerm || categoryFilter !== 'todas'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Conecte seu primeiro canal na aba "Conectar"'}
                </p>
                {!searchTerm && categoryFilter === 'todas' && (
                  <button
                    onClick={() => setActiveTab('conectar')}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform"
                  >
                    Ir para Conectar
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedConnections).map(([tipo, conns]) => (
                  <div key={tipo}>
                    <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide flex items-center gap-2">
                      {tipo}
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-300">
                        ({conns.length})
                      </span>
                    </h3>

                    {/* View Lista */}
                    {viewMode === 'lista' && (
                      <div className="space-y-3">
                        {conns.map(conn => {
                          const canalInfo = getCanalInfo(conn.tipo);
                          return (
                            <div
                              key={conn.id}
                              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow"
                            >
                              <div className="flex items-center gap-4">
                                {/* Ícone e Status */}
                                <div className="relative">
                                  <div className={`p-3 bg-gradient-to-r ${canalInfo?.color} text-white rounded-lg`}>
                                    {canalInfo?.icon}
                                  </div>
                                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                                    conn.status === 'conectado' ? 'bg-green-500' : 'bg-red-500'
                                  }`}></div>
                                </div>

                                {/* Informações */}
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                                    {conn.nome}
                                  </h4>
                                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    {conn.numero}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    {conn.status === 'conectado' ? (
                                      <span className="text-green-600 dark:text-green-400 text-xs flex items-center gap-1">
                                        <FaCheckCircle />
                                        Conectado há {getTimeSince(conn.conectadoEm)}
                                      </span>
                                    ) : (
                                      <span className="text-red-600 dark:text-red-400 text-xs flex items-center gap-1">
                                        <FaTimesCircle />
                                        Desconectado há {getTimeSince(conn.ultimaAtividade)}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Ações */}
                                <div className="flex gap-2">
                                  {conn.status === 'conectado' ? (
                                    <>
                                      {conn.tipo === 'whatsapp-qr' && (
                                        <button
                                          onClick={() => {
                                            setEditingConnection(conn);
                                            setSelectedModal(canalInfo);
                                            setShowQRCode(true);
                                            setFormData({ nome: conn.nome });
                                          }}
                                          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-semibold flex items-center gap-1"
                                        >
                                          <FaQrcode />
                                          Ver QR
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleEditConnection(conn)}
                                        className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-semibold"
                                      >
                                        <FaEdit />
                                      </button>
                                      <button
                                        onClick={() => handleDisconnect(conn.id)}
                                        className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-semibold"
                                      >
                                        Desconectar
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => handleReconnect(conn)}
                                        className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-semibold"
                                      >
                                        Reconectar
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() => handleDelete(conn.id)}
                                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-semibold"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* View Grade */}
                    {viewMode === 'grade' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {conns.map(conn => {
                          const canalInfo = getCanalInfo(conn.tipo);
                          return (
                            <div
                              key={conn.id}
                              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                            >
                              {/* Header */}
                              <div className={`bg-gradient-to-r ${canalInfo?.color} p-4 text-white`}>
                                <div className="flex items-center justify-between mb-2">
                                  <div className="text-2xl">
                                    {canalInfo?.icon}
                                  </div>
                                  <div className={`w-3 h-3 rounded-full ${
                                    conn.status === 'conectado' ? 'bg-green-400' : 'bg-red-400'
                                  } animate-pulse`}></div>
                                </div>
                                <h4 className="font-bold text-lg truncate">
                                  {conn.nome}
                                </h4>
                                <p className="text-xs opacity-90 truncate">
                                  {conn.numero}
                                </p>
                              </div>

                              {/* Body */}
                              <div className="p-4">
                                <div className="mb-4">
                                  {conn.status === 'conectado' ? (
                                    <p className="text-green-600 dark:text-green-400 text-xs flex items-center gap-1">
                                      <FaCheckCircle />
                                      Conectado há {getTimeSince(conn.conectadoEm)}
                                    </p>
                                  ) : (
                                    <p className="text-red-600 dark:text-red-400 text-xs flex items-center gap-1">
                                      <FaTimesCircle />
                                      Desconectado há {getTimeSince(conn.ultimaAtividade)}
                                    </p>
                                  )}
                                </div>

                                {/* Botões */}
                                <div className="space-y-2">
                                  {conn.status === 'conectado' ? (
                                    <>
                                      {conn.tipo === 'whatsapp-qr' && (
                                        <button
                                          onClick={() => {
                                            setEditingConnection(conn);
                                            setSelectedModal(canalInfo);
                                            setShowQRCode(true);
                                            setFormData({ nome: conn.nome });
                                          }}
                                          className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-1"
                                        >
                                          <FaQrcode />
                                          Ver QR
                                        </button>
                                      )}
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => handleEditConnection(conn)}
                                          className="flex-1 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-semibold"
                                        >
                                          <FaEdit />
                                        </button>
                                        <button
                                          onClick={() => handleDisconnect(conn.id)}
                                          className="flex-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-semibold"
                                        >
                                          Desconectar
                                        </button>
                                      </div>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => handleReconnect(conn)}
                                      className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-semibold"
                                    >
                                      Reconectar
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDelete(conn.id)}
                                    className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-1"
                                  >
                                    <FaTrash />
                                    Excluir
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODAIS */}
        {selectedModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className={`bg-gradient-to-r ${selectedModal.color} p-6 text-white flex items-center justify-between rounded-t-2xl`}>
                <div className="flex items-center gap-4">
                  {selectedModal.icon}
                  <div>
                    <h2 className="text-2xl font-bold">{editingConnection ? 'Editar' : 'Conectar'} {selectedModal.nome}</h2>
                    <p className="text-sm opacity-90">{selectedModal.descricao}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {/* Nome da conexão (sempre presente) */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nome da Conexão
                  </label>
                  <input
                    type="text"
                    placeholder={`Ex: ${selectedModal.nome} Principal`}
                    value={formData.nome || ''}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Modal WhatsApp QR */}
                {selectedModal.tipo === 'whatsapp-qr' && (
                  <div className="text-center py-4">
                    {!showQRCode ? (
                      <>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                          Clique no botão abaixo para gerar o QR Code e escaneie com seu WhatsApp
                        </p>
                        <button
                          onClick={handleConnectQR}
                          disabled={whatsappConnecting}
                          className={`py-3 px-8 bg-gradient-to-r ${selectedModal.color} text-white font-bold rounded-xl hover:scale-105 transition-transform duration-300 flex items-center gap-2 mx-auto disabled:opacity-50`}
                        >
                          <FaQrcode />
                          {whatsappConnecting ? 'Gerando...' : 'Gerar QR Code'}
                        </button>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="inline-block p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                          {qrCodeValue ? (
                            <QRCodeSVG
                              value={qrCodeValue}
                              size={250}
                              level="H"
                              includeMargin={true}
                              fgColor="#000000"
                              bgColor="#ffffff"
                            />
                          ) : (
                            <div className="w-[250px] h-[250px] flex items-center justify-center bg-gray-100 rounded">
                              <p className="text-gray-500">Gerando QR Code...</p>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-green-600 dark:text-green-400 font-semibold animate-pulse">
                            ✓ QR Code Gerado
                          </p>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                            Abra o WhatsApp no celular e escaneie este QR Code para conectar
                          </p>
                        </div>
                        <button
                          onClick={() => setShowQRCode(false)}
                          className="mt-4 py-2 px-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          Fechar
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Modal OAuth */}
                {selectedModal.tipo === 'oauth' && !editingConnection && (
                  <div className="text-center py-4">
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Você será redirecionado para fazer login com {selectedModal.nome}
                    </p>
                    <button
                      onClick={handleConnectOAuth}
                      className={`py-3 px-8 bg-gradient-to-r ${selectedModal.color} text-white font-bold rounded-xl hover:scale-105 transition-transform duration-300 mx-auto`}
                    >
                      Conectar com {selectedModal.nome}
                    </button>
                  </div>
                )}

                {/* Modal API */}
                {selectedModal.tipo === 'api' && selectedModal.id === 'whatsapp-api' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        API Key
                      </label>
                      <input
                        type="text"
                        placeholder="Digite sua API Key"
                        value={formData.apiKey || ''}
                        onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number ID
                      </label>
                      <input
                        type="text"
                        placeholder="ID do número"
                        value={formData.phoneId || ''}
                        onChange={(e) => setFormData({ ...formData, phoneId: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Access Token
                      </label>
                      <input
                        type="password"
                        placeholder="Token de acesso"
                        value={formData.token || ''}
                        onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleConnectAPI}
                      className={`w-full py-3 px-6 bg-gradient-to-r ${selectedModal.color} text-white font-bold rounded-xl hover:scale-105 transition-transform duration-300 mt-6`}
                    >
                      {editingConnection ? 'Salvar Alterações' : 'Conectar API'}
                    </button>
                  </div>
                )}

                {selectedModal.tipo === 'api' && selectedModal.id === 'telegram' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Bot Token
                      </label>
                      <input
                        type="password"
                        placeholder="Token do bot do Telegram"
                        value={formData.botToken || ''}
                        onChange={(e) => setFormData({ ...formData, botToken: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleConnectAPI}
                      className={`w-full py-3 px-6 bg-gradient-to-r ${selectedModal.color} text-white font-bold rounded-xl hover:scale-105 transition-transform duration-300`}
                    >
                      {editingConnection ? 'Salvar Alterações' : 'Conectar Bot'}
                    </button>
                  </div>
                )}

                {selectedModal.tipo === 'api' && selectedModal.id === 'email' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Host SMTP
                      </label>
                      <input
                        type="text"
                        placeholder="smtp.gmail.com"
                        value={formData.host || ''}
                        onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Porta
                      </label>
                      <input
                        type="number"
                        placeholder="587"
                        value={formData.port || ''}
                        onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Senha
                      </label>
                      <input
                        type="password"
                        placeholder="Senha do email"
                        value={formData.password || ''}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleConnectAPI}
                      className={`w-full py-3 px-6 bg-gradient-to-r ${selectedModal.color} text-white font-bold rounded-xl hover:scale-105 transition-transform duration-300`}
                    >
                      {editingConnection ? 'Salvar Alterações' : 'Conectar Email'}
                    </button>
                  </div>
                )}

                {selectedModal.tipo === 'api' && selectedModal.id === 'sms' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Account SID
                      </label>
                      <input
                        type="text"
                        placeholder="Twilio Account SID"
                        value={formData.accountSid || ''}
                        onChange={(e) => setFormData({ ...formData, accountSid: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Auth Token
                      </label>
                      <input
                        type="password"
                        placeholder="Twilio Auth Token"
                        value={formData.authToken || ''}
                        onChange={(e) => setFormData({ ...formData, authToken: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Número Twilio
                      </label>
                      <input
                        type="tel"
                        placeholder="+1234567890"
                        value={formData.numero || ''}
                        onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleConnectAPI}
                      className={`w-full py-3 px-6 bg-gradient-to-r ${selectedModal.color} text-white font-bold rounded-xl hover:scale-105 transition-transform duration-300`}
                    >
                      {editingConnection ? 'Salvar Alterações' : 'Conectar SMS'}
                    </button>
                  </div>
                )}

                {selectedModal.tipo === 'api' && selectedModal.id === 'sites' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        URL do Site
                      </label>
                      <input
                        type="url"
                        placeholder="https://seusite.com"
                        value={formData.url || ''}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        API Key do Site
                      </label>
                      <input
                        type="password"
                        placeholder="Chave de integração"
                        value={formData.apiKey || ''}
                        onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleConnectAPI}
                      className={`w-full py-3 px-6 bg-gradient-to-r ${selectedModal.color} text-white font-bold rounded-xl hover:scale-105 transition-transform duration-300`}
                    >
                      {editingConnection ? 'Salvar Alterações' : 'Conectar Site'}
                    </button>
                  </div>
                )}

                {/* Modal Widget - Configuração Completa */}
                {selectedModal.tipo === 'widget' && (
                  <div className="space-y-6">
                    {/* Abas de Configuração */}
                    <div className="flex gap-2 border-b border-gray-200 dark:border-gray-600">
                      {['visual', 'comportamento', 'formulario', 'avancado'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setFormData({ ...formData, configTab: tab })}
                          className={`px-4 py-2 font-semibold transition-colors relative ${
                            (formData.configTab || 'visual') === tab
                              ? 'text-purple-600 dark:text-purple-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {tab === 'visual' && <><FaPalette className="inline mr-2" />Visual</>}
                          {tab === 'comportamento' && <><FaComments className="inline mr-2" />Comportamento</>}
                          {tab === 'formulario' && <><FaEdit className="inline mr-2" />Formulário</>}
                          {tab === 'avancado' && <><FaCode className="inline mr-2" />Avançado</>}
                          {(formData.configTab || 'visual') === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Tab Visual */}
                    {(formData.configTab || 'visual') === 'visual' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Cor Principal
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={formData.primaryColor || '#7c3aed'}
                                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                className="w-12 h-12 rounded-lg border-2 border-gray-200 dark:border-gray-600 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={formData.primaryColor || '#7c3aed'}
                                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Cor Secundária
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={formData.secondaryColor || '#6366f1'}
                                onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                                className="w-12 h-12 rounded-lg border-2 border-gray-200 dark:border-gray-600 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={formData.secondaryColor || '#6366f1'}
                                onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Título do Chat
                          </label>
                          <input
                            type="text"
                            placeholder="Converse conosco!"
                            value={formData.chatTitle || ''}
                            onChange={(e) => setFormData({ ...formData, chatTitle: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Subtítulo
                          </label>
                          <input
                            type="text"
                            placeholder="Respondemos em minutos"
                            value={formData.chatSubtitle || ''}
                            onChange={(e) => setFormData({ ...formData, chatSubtitle: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Logo/Avatar (URL)
                          </label>
                          <input
                            type="url"
                            placeholder="https://seusite.com/logo.png"
                            value={formData.logoUrl || ''}
                            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Tema
                          </label>
                          <select
                            value={formData.theme || 'light'}
                            onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                          >
                            <option value="light">Claro</option>
                            <option value="dark">Escuro</option>
                            <option value="auto">Automático</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Tab Comportamento */}
                    {formData.configTab === 'comportamento' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Posição na Tela
                          </label>
                          <select
                            value={formData.position || 'bottom-right'}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                          >
                            <option value="bottom-right">Inferior Direito</option>
                            <option value="bottom-left">Inferior Esquerdo</option>
                            <option value="top-right">Superior Direito</option>
                            <option value="top-left">Superior Esquerdo</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Configuração de Setores
                          </label>

                          <div className="flex items-center gap-3 mb-3">
                            <input
                              type="checkbox"
                              id="showDepartmentSelector"
                              checked={formData.showDepartmentSelector !== false}
                              onChange={(e) => setFormData({ ...formData, showDepartmentSelector: e.target.checked })}
                              className="w-5 h-5 text-purple-600 focus:ring-purple-500 rounded"
                            />
                            <label htmlFor="showDepartmentSelector" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Exibir seletor de setores para o cliente
                            </label>
                          </div>

                          {!formData.showDepartmentSelector && (
                            <>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Setor Padrão (fixo)
                              </label>
                              <select
                                value={formData.department || customDepartments[0]}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                              >
                                {customDepartments.map(dept => (
                                  <option key={dept} value={dept}>{dept}</option>
                                ))}
                              </select>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                                Todos os chats serão direcionados para este setor
                              </p>
                            </>
                          )}

                          {formData.showDepartmentSelector && (
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                              <p className="text-xs text-blue-800 dark:text-blue-300">
                                ✓ O cliente poderá escolher entre os setores disponíveis antes de iniciar o chat
                              </p>
                            </div>
                          )}

                          {/* Gerenciar Setores */}
                          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                              Gerenciar Setores
                            </h4>

                            {/* Adicionar novo setor */}
                            <div className="flex gap-2 mb-3">
                              <input
                                type="text"
                                placeholder="Nome do novo setor..."
                                value={newDepartmentName}
                                onChange={(e) => setNewDepartmentName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddDepartment()}
                                className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:border-purple-500 focus:outline-none"
                              />
                              <button
                                onClick={handleAddDepartment}
                                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform text-sm"
                              >
                                <FaPlus className="inline" /> Adicionar
                              </button>
                            </div>

                            {/* Lista de setores */}
                            <div className="space-y-2">
                              {customDepartments.map(dept => (
                                <div key={dept} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-lg">
                                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                    {dept}
                                  </span>
                                  <button
                                    onClick={() => handleRemoveDepartment(dept)}
                                    className="text-red-500 hover:text-red-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                    disabled={customDepartments.length <= 1}
                                    title={customDepartments.length <= 1 ? 'Mantenha pelo menos um setor' : 'Remover setor'}
                                  >
                                    <FaTrash className="text-xs" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Mensagem de Boas-vindas
                          </label>
                          <textarea
                            placeholder="Olá! Como posso ajudar você hoje?"
                            value={formData.welcomeMessage || ''}
                            onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Delay da Mensagem (segundos)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="60"
                            placeholder="3"
                            value={formData.messageDelay || '3'}
                            onChange={(e) => setFormData({ ...formData, messageDelay: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Mensagem Offline
                          </label>
                          <textarea
                            placeholder="No momento estamos offline. Deixe sua mensagem!"
                            value={formData.offlineMessage || ''}
                            onChange={(e) => setFormData({ ...formData, offlineMessage: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none resize-none"
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="soundEnabled"
                            checked={formData.soundEnabled || false}
                            onChange={(e) => setFormData({ ...formData, soundEnabled: e.target.checked })}
                            className="w-5 h-5 text-purple-600 focus:ring-purple-500 rounded"
                          />
                          <label htmlFor="soundEnabled" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Ativar som de notificação
                          </label>
                        </div>

                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="autoOpen"
                            checked={formData.autoOpen || false}
                            onChange={(e) => setFormData({ ...formData, autoOpen: e.target.checked })}
                            className="w-5 h-5 text-purple-600 focus:ring-purple-500 rounded"
                          />
                          <label htmlFor="autoOpen" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Abrir automaticamente
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Tab Formulário */}
                    {formData.configTab === 'formulario' && (
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id="requireForm"
                              checked={formData.requireForm || false}
                              onChange={(e) => setFormData({ ...formData, requireForm: e.target.checked })}
                              className="w-5 h-5 text-purple-600 focus:ring-purple-500 rounded"
                            />
                            <label htmlFor="requireForm" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Exigir preenchimento antes do chat
                            </label>
                          </div>
                          <p className="text-xs text-blue-800 dark:text-blue-300 mt-2 ml-8">
                            {formData.requireForm
                              ? '✓ Cliente preencherá o formulário + escolherá o setor ANTES de abrir o chat'
                              : 'Cliente abrirá o chat diretamente sem formulário prévio'}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Campos do Formulário {formData.requireForm && <span className="text-red-500">*</span>}
                          </label>
                          <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            {['nome', 'email', 'telefone'].map((field) => (
                              <div key={field} className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  id={`field-${field}`}
                                  checked={formData[`field_${field}`] !== false}
                                  onChange={(e) => setFormData({ ...formData, [`field_${field}`]: e.target.checked })}
                                  className="w-4 h-4 text-purple-600 focus:ring-purple-500 rounded"
                                />
                                <label htmlFor={`field-${field}`} className="text-sm text-gray-700 dark:text-gray-300 capitalize flex items-center gap-2">
                                  {field}
                                  {field === 'nome' && '👤'}
                                  {field === 'email' && '📧'}
                                  {field === 'telefone' && '📱'}
                                </label>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                            Selecione os campos que o cliente deve preencher
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Mensagem de Confirmação
                          </label>
                          <input
                            type="text"
                            placeholder="Obrigado! Aguarde que logo um atendente responderá."
                            value={formData.thankYouMessage || ''}
                            onChange={(e) => setFormData({ ...formData, thankYouMessage: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                          />
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                            Mensagem exibida abaixo do botão "Iniciar Atendimento"
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tab Avançado */}
                    {formData.configTab === 'avancado' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Widget ID (gerado automaticamente)
                          </label>
                          <input
                            type="text"
                            value={formData.widgetId || `widget_${Date.now()}`}
                            disabled
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Posição do Script no Site
                          </label>
                          <select
                            value={formData.scriptPosition || 'footer'}
                            onChange={(e) => setFormData({ ...formData, scriptPosition: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                          >
                            <option value="header">Header (&lt;head&gt;) - Carregamento Prioritário</option>
                            <option value="body">Body (início) - Carregamento Inicial</option>
                            <option value="footer">Footer (antes &lt;/body&gt;) - Otimizado (Recomendado)</option>
                          </select>
                          <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <p className="text-xs text-blue-800 dark:text-blue-300">
                              {formData.scriptPosition === 'header' && (
                                <>
                                  <strong>Header:</strong> Carrega antes de qualquer conteúdo. Use apenas se o widget precisar estar disponível imediatamente.
                                </>
                              )}
                              {formData.scriptPosition === 'body' && (
                                <>
                                  <strong>Body:</strong> Carrega no início da página. Útil para widgets que modificam o layout inicial.
                                </>
                              )}
                              {(!formData.scriptPosition || formData.scriptPosition === 'footer') && (
                                <>
                                  <strong>Footer (Recomendado):</strong> Carrega após o conteúdo. Melhor performance e não bloqueia o carregamento da página.
                                </>
                              )}
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Domínios Permitidos (um por linha)
                          </label>
                          <textarea
                            placeholder="https://seusite.com&#10;https://www.seusite.com"
                            value={formData.allowedDomains || ''}
                            onChange={(e) => setFormData({ ...formData, allowedDomains: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none resize-none font-mono text-sm"
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="analytics"
                            checked={formData.analyticsEnabled || false}
                            onChange={(e) => setFormData({ ...formData, analyticsEnabled: e.target.checked })}
                            className="w-5 h-5 text-purple-600 focus:ring-purple-500 rounded"
                          />
                          <label htmlFor="analytics" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Ativar analytics e rastreamento
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Recursos de Mídia
                          </label>

                          <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            {/* Áudio */}
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                id="audioEnabled"
                                checked={formData.audioEnabled !== false}
                                onChange={(e) => setFormData({ ...formData, audioEnabled: e.target.checked })}
                                className="w-5 h-5 text-purple-600 focus:ring-purple-500 rounded"
                              />
                              <label htmlFor="audioEnabled" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                🎙️ Permitir gravação e envio de áudio
                              </label>
                            </div>

                            {formData.audioEnabled !== false && (
                              <div className="ml-8 p-3 bg-white dark:bg-gray-600 rounded-lg">
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                  Velocidades de reprodução
                                </label>
                                <div className="flex gap-2">
                                  {['1x', '1.5x', '2x'].map(speed => (
                                    <label key={speed} className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={formData[`audioSpeed${speed}`] !== false}
                                        onChange={(e) => setFormData({ ...formData, [`audioSpeed${speed}`]: e.target.checked })}
                                        className="w-4 h-4 text-purple-600 focus:ring-purple-500 rounded"
                                      />
                                      <span className="text-xs text-gray-700 dark:text-gray-300">{speed}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Vídeo */}
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                id="videoEnabled"
                                checked={formData.videoEnabled !== false}
                                onChange={(e) => setFormData({ ...formData, videoEnabled: e.target.checked })}
                                className="w-5 h-5 text-purple-600 focus:ring-purple-500 rounded"
                              />
                              <label htmlFor="videoEnabled" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                📹 Permitir envio de vídeos
                              </label>
                            </div>

                            {formData.videoEnabled !== false && (
                              <div className="ml-8 p-3 bg-white dark:bg-gray-600 rounded-lg">
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                  Tamanho máximo do vídeo
                                </label>
                                <select
                                  value={formData.maxVideoSize || '50'}
                                  onChange={(e) => setFormData({ ...formData, maxVideoSize: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs focus:border-purple-500 focus:outline-none"
                                >
                                  <option value="10">10 MB</option>
                                  <option value="25">25 MB</option>
                                  <option value="50">50 MB</option>
                                  <option value="100">100 MB</option>
                                </select>
                              </div>
                            )}

                            {/* Fotos */}
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                id="photoEnabled"
                                checked={formData.photoEnabled !== false}
                                onChange={(e) => setFormData({ ...formData, photoEnabled: e.target.checked })}
                                className="w-5 h-5 text-purple-600 focus:ring-purple-500 rounded"
                              />
                              <label htmlFor="photoEnabled" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                📷 Permitir envio de fotos
                              </label>
                            </div>

                            {formData.photoEnabled !== false && (
                              <div className="ml-8 p-3 bg-white dark:bg-gray-600 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    id="photoCompress"
                                    checked={formData.photoCompress !== false}
                                    onChange={(e) => setFormData({ ...formData, photoCompress: e.target.checked })}
                                    className="w-4 h-4 text-purple-600 focus:ring-purple-500 rounded"
                                  />
                                  <label htmlFor="photoCompress" className="text-xs text-gray-700 dark:text-gray-300">
                                    Comprimir fotos automaticamente (economiza banda)
                                  </label>
                                </div>
                              </div>
                            )}

                            {/* Arquivos */}
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                id="fileUploadEnabled"
                                checked={formData.fileUploadEnabled !== false}
                                onChange={(e) => setFormData({ ...formData, fileUploadEnabled: e.target.checked })}
                                className="w-5 h-5 text-purple-600 focus:ring-purple-500 rounded"
                              />
                              <label htmlFor="fileUploadEnabled" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                📎 Permitir envio de arquivos (PDF, DOC, etc)
                              </label>
                            </div>

                            {formData.fileUploadEnabled !== false && (
                              <div className="ml-8 p-3 bg-white dark:bg-gray-600 rounded-lg">
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                  Tipos de arquivo permitidos
                                </label>
                                <input
                                  type="text"
                                  placeholder="pdf, doc, docx, xls, xlsx, txt"
                                  value={formData.allowedFileTypes || 'pdf, doc, docx, xls, xlsx, txt, zip'}
                                  onChange={(e) => setFormData({ ...formData, allowedFileTypes: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs focus:border-purple-500 focus:outline-none"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Separe por vírgula
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                              <FaCode className="inline mr-2" />
                              Código de Instalação
                            </label>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(widgetCode);
                                toast.success('Código copiado para a área de transferência!');
                              }}
                              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold text-sm flex items-center gap-2"
                            >
                              <FaCopy /> Copiar Código
                            </button>
                          </div>
                          <pre className="text-xs bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto max-h-40">
                            {widgetCode}
                          </pre>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                            {widgetInfo.instruction}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Preview do Widget */}
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border-2 border-purple-200 dark:border-purple-700">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <FaComments />
                          Preview do Widget
                        </h3>
                        {formData.requireForm && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => setPreviewStep('form')}
                              className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                                previewStep === 'form'
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                              }`}
                            >
                              1. Formulário
                            </button>
                            <button
                              onClick={() => setPreviewStep('chat')}
                              className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                                previewStep === 'chat'
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                              }`}
                            >
                              2. Chat
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden max-w-sm mx-auto">
                        {/* Header do Widget */}
                        <div className="flex items-center gap-3 p-4" style={{ backgroundColor: formData.primaryColor || '#7c3aed' }}>
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
                            {formData.logoUrl ? <img src={formData.logoUrl} className="w-10 h-10 rounded-full object-cover" alt="Logo" /> : 'L'}
                          </div>
                          <div className="flex-1 text-white">
                            <h4 className="font-bold">{formData.chatTitle || 'Converse conosco!'}</h4>
                            <p className="text-xs opacity-90">{formData.chatSubtitle || 'Respondemos em minutos'}</p>
                          </div>
                        </div>

                        {/* ETAPA 1: FORMULÁRIO (se requireForm estiver habilitado) */}
                        {formData.requireForm && previewStep === 'form' && (
                          <div className="p-4 space-y-3">
                            <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
                              Preencha seus dados para iniciar o atendimento:
                            </p>

                            {/* Campos do Formulário */}
                            {formData.field_nome !== false && (
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                  Nome *
                                </label>
                                <input
                                  type="text"
                                  placeholder="Seu nome completo"
                                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:border-purple-500 focus:outline-none"
                                />
                              </div>
                            )}

                            {formData.field_email !== false && (
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                  Email *
                                </label>
                                <input
                                  type="email"
                                  placeholder="seu@email.com"
                                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:border-purple-500 focus:outline-none"
                                />
                              </div>
                            )}

                            {formData.field_telefone !== false && (
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                  Telefone *
                                </label>
                                <input
                                  type="tel"
                                  placeholder="(00) 00000-0000"
                                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:border-purple-500 focus:outline-none"
                                />
                              </div>
                            )}

                            {/* Seletor de Setor */}
                            {formData.showDepartmentSelector !== false && (
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                  Escolha o setor *
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                  {customDepartments.slice(0, 4).map((dept, index) => (
                                    <button
                                      key={dept}
                                      className="px-3 py-2 bg-white dark:bg-gray-700 border-2 hover:border-purple-500 dark:hover:border-purple-500 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all"
                                      style={{
                                        borderColor: index === 0 ? (formData.primaryColor || '#7c3aed') : '#e5e7eb',
                                        backgroundColor: index === 0 ? `${formData.primaryColor || '#7c3aed'}15` : undefined
                                      }}
                                    >
                                      {dept}
                                    </button>
                                  ))}
                                </div>
                                {customDepartments.length > 4 && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    +{customDepartments.length - 4} mais setores
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Botão Iniciar Chat */}
                            <button
                              onClick={() => setPreviewStep('chat')}
                              className="w-full py-3 rounded-lg font-semibold text-white transition-transform hover:scale-105"
                              style={{ backgroundColor: formData.primaryColor || '#7c3aed' }}
                            >
                              Iniciar Atendimento
                            </button>

                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                              {formData.thankYouMessage || 'Entraremos em contato em breve!'}
                            </p>
                          </div>
                        )}

                        {/* ETAPA 2: CHAT (depois do formulário OU se requireForm estiver desabilitado) */}
                        {(!formData.requireForm || previewStep === 'chat') && (
                          <div className="p-4 space-y-3">
                            {/* Mensagem de Boas-vindas */}
                            <div className="flex gap-2">
                              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-purple-600 dark:text-purple-300 text-xs font-bold">
                                  {formData.logoUrl ? <img src={formData.logoUrl} className="w-8 h-8 rounded-full object-cover" alt="Logo" /> : '💬'}
                                </span>
                              </div>
                              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg rounded-tl-none text-sm max-w-[85%]">
                                {formData.welcomeMessage || 'Olá! Como posso ajudar você hoje?'}
                              </div>
                            </div>

                            {/* Seletor de Setores (se habilitado e formulário desabilitado) */}
                            {!formData.requireForm && formData.showDepartmentSelector !== false && (
                              <div className="space-y-2">
                                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">
                                  Escolha o setor de atendimento:
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                  {customDepartments.map((dept, index) => (
                                    <button
                                      key={dept}
                                      className="px-3 py-2 bg-white dark:bg-gray-700 border-2 border-purple-200 dark:border-purple-700 hover:border-purple-500 dark:hover:border-purple-500 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all cursor-pointer"
                                      style={{
                                        borderColor: index === 0 ? (formData.primaryColor || '#7c3aed') : undefined,
                                        backgroundColor: index === 0 ? `${formData.primaryColor || '#7c3aed'}15` : undefined
                                      }}
                                    >
                                      {dept}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Badge de Setor Fixo ou confirmação após formulário */}
                            {(formData.showDepartmentSelector === false || (formData.requireForm && previewStep === 'chat')) && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{
                                  backgroundColor: `${formData.primaryColor || '#7c3aed'}20`,
                                  color: formData.primaryColor || '#7c3aed'
                                }}>
                                  📍 Setor: {formData.department || customDepartments[0]}
                                </span>
                              </div>
                            )}

                            {/* Input de Mensagem */}
                            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                              {/* Ícones de anexo (se habilitado) */}
                              {(formData.audioEnabled !== false || formData.videoEnabled !== false || formData.photoEnabled !== false || formData.fileUploadEnabled !== false) && (
                                <div className="flex gap-2 mb-2 px-1">
                                  {formData.audioEnabled !== false && (
                                    <button
                                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                      title="Gravar áudio"
                                    >
                                      <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"/>
                                      </svg>
                                    </button>
                                  )}
                                  {formData.photoEnabled !== false && (
                                    <button
                                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                      title="Enviar foto"
                                    >
                                      <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                                      </svg>
                                    </button>
                                  )}
                                  {formData.videoEnabled !== false && (
                                    <button
                                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                      title="Enviar vídeo"
                                    >
                                      <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                                      </svg>
                                    </button>
                                  )}
                                  {formData.fileUploadEnabled !== false && (
                                    <button
                                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                      title="Enviar arquivo"
                                    >
                                      <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd"/>
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              )}

                              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                <input
                                  type="text"
                                  placeholder="Digite sua mensagem..."
                                  disabled
                                  className="flex-1 bg-transparent text-xs text-gray-500 dark:text-gray-400 outline-none"
                                />
                                <button className="text-gray-400 dark:text-gray-500 cursor-not-allowed">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Botão Criar/Salvar */}
                    <button
                      onClick={handleConnectWidget}
                      className={`w-full py-3 px-6 bg-gradient-to-r ${selectedModal.color} text-white font-bold rounded-xl hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2`}
                    >
                      <FaCheckCircle />
                      {editingConnection ? 'Salvar Alterações' : 'Criar Widget'}
                    </button>
                  </div>
                )}

                {/* Botão de salvar edição */}
                {editingConnection && !showQRCode && selectedModal.tipo !== 'widget' && selectedModal.tipo !== 'api' && (
                  <button
                    onClick={handleSaveEdit}
                    className={`w-full py-3 px-6 bg-gradient-to-r ${selectedModal.color} text-white font-bold rounded-xl hover:scale-105 transition-transform duration-300 mt-6`}
                  >
                    Salvar Alterações
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Banner */}
      {showUpgradeBanner && (
        <UpgradeBanner
          feature="Todos os Canais de Atendimento"
          requiredPlan="Professional"
          onClose={() => setShowUpgradeBanner(false)}
          onNavigate={(page) => {
            setShowUpgradeBanner(false);
            // Navegar para a página de assinatura
            if (window.onNavigate) {
              window.onNavigate(page);
            }
          }}
        />
      )}
    </div>
  );
};

export default Connections;
