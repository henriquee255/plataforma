import React, { useState } from 'react';
import {
  FaBrain,
  FaRobot,
  FaDatabase,
  FaBook,
  FaChartLine,
  FaCog,
  FaFileUpload,
  FaLink,
  FaYoutube,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaComments,
  FaLightbulb,
  FaCloudUploadAlt,
  FaPlay,
  FaPause,
  FaChevronDown,
  FaPlus,
  FaSearch,
  FaFilter,
  FaSave,
  FaEye,
  FaThumbsUp,
  FaThumbsDown,
  FaExclamationTriangle,
  FaCheckCircle,
  FaKey,
  FaShieldAlt,
  FaChartBar,
  FaQuestionCircle,
  FaInfoCircle,
  FaUserPlus,
  FaArrowRight,
  FaMagic,
  FaCheckDouble
} from 'react-icons/fa';
import { useAppContext } from './contexts/AppContext';
import UpgradeBanner from './components/UpgradeBanner';

const IA = ({ onNavigate }) => {
  const { getCurrentPlan } = useAppContext();
  const currentPlan = getCurrentPlan();

  // Verificar se tem acesso à IA
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(!currentPlan.hasIA);
  const [activeTab, setActiveTab] = useState('conhecimento');
  const [aiMode, setAiMode] = useState('semi-automatico'); // manual, semi-automatico, automatico
  const [showAddSourceModal, setShowAddSourceModal] = useState(false);
  const [showViewSourceModal, setShowViewSourceModal] = useState(false);
  const [showEditSourceModal, setShowEditSourceModal] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [sourceType, setSourceType] = useState('pdf');
  const [newSource, setNewSource] = useState({
    title: '',
    url: '',
    content: '',
    file: null
  });
  const [editingSource, setEditingSource] = useState(null);

  // Estados para conversas
  const [conversations, setConversations] = useState([
    {
      id: 1,
      cliente: 'João Silva',
      canal: 'WhatsApp',
      status: 'ativo',
      ultimaMensagem: 'Qual o prazo de entrega?',
      dataHora: '2026-02-23 14:30',
      mensagens: [
        { id: 1, role: 'user', content: 'Olá, gostaria de saber mais sobre seus produtos', timestamp: '14:25' },
        { id: 2, role: 'assistant', content: 'Olá! Temos uma linha completa de produtos. Qual especificamente te interessa?', timestamp: '14:26', isEdited: false },
        { id: 3, role: 'user', content: 'Qual o prazo de entrega?', timestamp: '14:30' }
      ]
    },
    {
      id: 2,
      cliente: 'Maria Santos',
      canal: 'Site',
      status: 'aguardando',
      ultimaMensagem: 'Vocês trabalham com frete grátis?',
      dataHora: '2026-02-23 14:15',
      mensagens: []
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);

  // Estados para fontes de conhecimento
  const [sources, setSources] = useState([
    { id: 1, type: 'pdf', title: 'Catálogo de Produtos 2026', status: 'processado', chunks: 45, createdAt: '2026-02-20' },
    { id: 2, type: 'youtube', title: 'Tutorial de Uso do Produto X', url: 'youtube.com/watch?v=abc123', status: 'processado', chunks: 12, createdAt: '2026-02-21' },
    { id: 3, type: 'url', title: 'Política de Garantia', url: 'empresa.com/garantia', status: 'processando', chunks: 0, createdAt: '2026-02-23' },
    { id: 4, type: 'manual', title: 'FAQ Atendimento', status: 'processado', chunks: 28, createdAt: '2026-02-18' }
  ]);

  // Estados para configurações
  const [aiConfig, setAiConfig] = useState({
    provider: 'openai',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 500,
    systemPrompt: 'Você é um assistente comercial prestativo e profissional.',
    tone: 'profissional',
    // Novas configurações de escalonamento
    enableEscalation: true,
    escalationThreshold: 0.6,
    escalationMessage: 'Vou transferir você para um de nossos especialistas que poderá te ajudar melhor com essa questão!',
    // Configurações de contexto
    maxContextMessages: 10,
    useFullConversationContext: true,
    analyzeClientSentiment: true,
    // Sistema de aprendizado
    enableContinuousLearning: true,
    autoUpdateKnowledge: true,
    preventLoops: true
  });

  // Atendentes por setor
  const [attendantsByDepartment, setAttendantsByDepartment] = useState({
    comercial: [
      { id: 1, nome: 'Carlos Silva', status: 'online', atendimentos: 2, cargo: 'Vendedor' },
      { id: 2, nome: 'Ana Costa', status: 'online', atendimentos: 1, cargo: 'Gerente Comercial' },
      { id: 3, nome: 'Pedro Santos', status: 'offline', atendimentos: 0, cargo: 'Vendedor' }
    ],
    suporte: [
      { id: 4, nome: 'Mariana Lima', status: 'online', atendimentos: 3, cargo: 'Suporte N1' },
      { id: 5, nome: 'João Oliveira', status: 'online', atendimentos: 1, cargo: 'Suporte N2' },
      { id: 6, nome: 'Lucas Pereira', status: 'ausente', atendimentos: 0, cargo: 'Suporte N1' }
    ],
    financeiro: [
      { id: 7, nome: 'Fernanda Rocha', status: 'online', atendimentos: 1, cargo: 'Financeiro' },
      { id: 8, nome: 'Roberto Alves', status: 'offline', atendimentos: 0, cargo: 'Financeiro' }
    ]
  });

  // Base de conhecimento dinâmica (aprende com correções)
  const [learningDatabase, setLearningDatabase] = useState([
    {
      id: 1,
      pergunta: 'prazo de entrega',
      respostaOriginal: '5 dias úteis',
      respostaCorrigida: '5 a 7 dias úteis, podendo variar conforme região',
      vezesCorrida: 1,
      confianca: 0.95,
      setor: 'comercial',
      dataAprendizado: '2026-02-20'
    },
    {
      id: 2,
      pergunta: 'como resetar senha',
      respostaOriginal: 'Clique em esqueci senha',
      respostaCorrigida: 'Clique em "Esqueci minha senha" na tela de login e siga as instruções enviadas por email',
      vezesCorrida: 2,
      confianca: 0.98,
      setor: 'suporte',
      dataAprendizado: '2026-02-21'
    }
  ]);

  // Palavras-chave para detecção de setor
  const departmentKeywords = {
    comercial: ['comprar', 'preço', 'valor', 'orçamento', 'venda', 'produto', 'demonstração', 'contratar', 'plano', 'pagamento'],
    suporte: ['problema', 'erro', 'não funciona', 'bug', 'travou', 'senha', 'acesso', 'login', 'resetar', 'ajuda técnica'],
    financeiro: ['boleto', 'fatura', 'cobrança', 'reembolso', 'cancelamento', 'devolução', 'nota fiscal', 'pagamento']
  };

  // Estatísticas
  const stats = {
    totalAtendimentos: 1247,
    taxaAcerto: 94.5,
    taxaCorrecao: 5.5,
    economiaHoras: 312,
    respostasPendentes: 3,
    fontesAtivas: 4
  };

  // Tabs
  const tabs = [
    { id: 'conhecimento', label: 'Base de Conhecimento', icon: FaBook },
    { id: 'conversas', label: 'Conversas', icon: FaComments },
    { id: 'aprendizado', label: 'Aprendizado', icon: FaLightbulb },
    { id: 'configuracoes', label: 'Configurações', icon: FaCog },
    { id: 'metricas', label: 'Métricas', icon: FaChartLine }
  ];

  // FUNÇÃO: Detectar setor baseado na mensagem
  const detectDepartment = (message) => {
    const messageLower = message.toLowerCase();
    let scores = {
      comercial: 0,
      suporte: 0,
      financeiro: 0
    };

    // Contar palavras-chave por setor
    Object.keys(departmentKeywords).forEach(dept => {
      departmentKeywords[dept].forEach(keyword => {
        if (messageLower.includes(keyword)) {
          scores[dept]++;
        }
      });
    });

    // Retornar setor com maior pontuação
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) return 'comercial'; // padrão

    return Object.keys(scores).find(key => scores[key] === maxScore);
  };

  // FUNÇÃO: Buscar atendente disponível no setor
  const findAvailableAttendant = (department) => {
    const attendants = attendantsByDepartment[department] || [];

    // Filtrar apenas online
    const onlineAttendants = attendants.filter(a => a.status === 'online');

    if (onlineAttendants.length === 0) {
      // Nenhum online, tentar ausente
      const awayAttendants = attendants.filter(a => a.status === 'ausente');
      if (awayAttendants.length > 0) {
        return awayAttendants[0];
      }
      return null;
    }

    // Retornar o com menos atendimentos
    return onlineAttendants.reduce((prev, current) =>
      prev.atendimentos < current.atendimentos ? prev : current
    );
  };

  // FUNÇÃO: Analisar confiança da resposta
  const analyzeConfidence = (question, context) => {
    // Buscar na base de aprendizado
    const learned = learningDatabase.find(item =>
      question.toLowerCase().includes(item.pergunta.toLowerCase())
    );

    if (learned) {
      return learned.confianca;
    }

    // Verificar se tem contexto suficiente
    if (context.length < 3) return 0.5;

    // Simular análise (em produção, seria baseado em embeddings)
    const hasSpecificKeywords = departmentKeywords.comercial.some(k => question.toLowerCase().includes(k)) ||
                                departmentKeywords.suporte.some(k => question.toLowerCase().includes(k));

    return hasSpecificKeywords ? 0.75 : 0.55;
  };

  // FUNÇÃO: Aprender com correção
  const learnFromCorrection = (originalMessage, correctedMessage, conversationContext) => {
    if (!aiConfig.enableContinuousLearning) return;

    // Detectar setor da conversa
    const department = detectDepartment(conversationContext);

    // Criar novo aprendizado
    const newLearning = {
      id: Date.now(),
      pergunta: originalMessage.substring(0, 50), // resumo
      respostaOriginal: originalMessage,
      respostaCorrigida: correctedMessage,
      vezesCorrida: 1,
      confianca: 0.85,
      setor: department,
      dataAprendizado: new Date().toISOString().split('T')[0]
    };

    // Verificar se já existe aprendizado similar
    const existingIndex = learningDatabase.findIndex(item =>
      item.pergunta.toLowerCase() === newLearning.pergunta.toLowerCase()
    );

    if (existingIndex >= 0) {
      // Atualizar existente
      const updated = [...learningDatabase];
      updated[existingIndex] = {
        ...updated[existingIndex],
        respostaCorrigida: correctedMessage,
        vezesCorrida: updated[existingIndex].vezesCorrida + 1,
        confianca: Math.min(0.99, updated[existingIndex].confianca + 0.05)
      };
      setLearningDatabase(updated);
    } else {
      // Adicionar novo
      setLearningDatabase([...learningDatabase, newLearning]);
    }

    console.log('🧠 IA APRENDEU:', newLearning);
  };

  // FUNÇÃO: Escalar conversa para atendente
  const escalateToAttendant = (conversationId, department, reason) => {
    const attendant = findAvailableAttendant(department);

    if (!attendant) {
      console.warn('⚠️ Nenhum atendente disponível em', department);
      return {
        success: false,
        message: 'No momento não temos atendentes disponíveis. Por favor, aguarde alguns instantes.'
      };
    }

    // Atualizar conversa
    setConversations(conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          status: 'atribuido',
          atribuidoPara: attendant.id,
          atribuidoNome: attendant.nome,
          setor: department,
          mensagens: [
            ...conv.mensagens,
            {
              id: Date.now(),
              role: 'system',
              content: `Conversa transferida para ${attendant.nome} (${department.toUpperCase()})`,
              timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              isEscalation: true
            }
          ]
        };
      }
      return conv;
    }));

    // Atualizar contador do atendente
    setAttendantsByDepartment(prev => ({
      ...prev,
      [department]: prev[department].map(a =>
        a.id === attendant.id
          ? { ...a, atendimentos: a.atendimentos + 1 }
          : a
      )
    }));

    console.log('✅ ESCALONADO:', {
      conversa: conversationId,
      setor: department,
      atendente: attendant.nome,
      motivo: reason
    });

    return {
      success: true,
      attendant: attendant,
      message: aiConfig.escalationMessage
    };
  };

  // FUNÇÃO: Processar mensagem com IA
  const processAIResponse = (conversationId, userMessage) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    // Obter contexto
    const context = conversation.mensagens.slice(-aiConfig.maxContextMessages);

    // Detectar setor
    const department = detectDepartment(userMessage);

    // Analisar confiança
    const confidence = analyzeConfidence(userMessage, context);

    console.log('🤖 IA ANALISANDO:', {
      mensagem: userMessage,
      setor: department,
      confianca: confidence,
      threshold: aiConfig.escalationThreshold
    });

    // Verificar se deve escalar
    if (aiConfig.enableEscalation && confidence < aiConfig.escalationThreshold) {
      return escalateToAttendant(conversationId, department, 'Baixa confiança');
    }

    // Gerar resposta (simulado - em produção seria API)
    const aiResponse = `Entendi sua pergunta sobre ${userMessage}. Baseado no nosso conhecimento...`;

    return {
      success: true,
      response: aiResponse,
      confidence: confidence,
      department: department
    };
  };

  const handleAddSource = () => {
    const newSourceObj = {
      id: Date.now(),
      type: sourceType,
      title: newSource.title,
      url: newSource.url,
      content: newSource.content,
      status: 'processando',
      chunks: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSources([...sources, newSourceObj]);
    setShowAddSourceModal(false);
    setNewSource({ title: '', url: '', content: '', file: null });
  };

  const handleViewSource = (source) => {
    setSelectedSource(source);
    setShowViewSourceModal(true);
  };

  const handleEditSource = (source) => {
    setEditingSource({
      ...source,
      content: source.content || ''
    });
    setSourceType(source.type);
    setShowEditSourceModal(true);
  };

  const handleSaveEdit = () => {
    setSources(sources.map(s =>
      s.id === editingSource.id
        ? { ...editingSource }
        : s
    ));
    setShowEditSourceModal(false);
    setEditingSource(null);
  };

  const handleDeleteSource = (sourceId) => {
    if (confirm('Tem certeza que deseja excluir esta fonte? Esta ação não pode ser desfeita.')) {
      setSources(sources.filter(s => s.id !== sourceId));
    }
  };

  const handleEditMessage = (conversationId, messageId, newContent) => {
    setConversations(conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          mensagens: conv.mensagens.map(msg => {
            if (msg.id === messageId) {
              // APRENDIZADO: Salvar correção
              if (msg.role === 'assistant' && msg.content !== newContent) {
                const conversationText = conv.mensagens.map(m => m.content).join(' ');
                learnFromCorrection(msg.content, newContent, conversationText);
              }

              return {
                ...msg,
                content: newContent,
                originalContent: msg.content,
                isEdited: true,
                editedAt: new Date().toISOString()
              };
            }
            return msg;
          })
        };
      }
      return conv;
    }));
    setEditingMessage(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <FaBrain className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Inteligência Artificial
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Sistema autônomo de atendimento e aprendizado
              </p>
            </div>
          </div>

          {/* Modo de Operação */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-300 font-semibold">Modo:</span>
            <div className="flex bg-white dark:bg-gray-800 rounded-xl p-1 border-2 border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setAiMode('manual')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  aiMode === 'manual'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Manual
              </button>
              <button
                onClick={() => setAiMode('semi-automatico')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  aiMode === 'semi-automatico'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Semi-automático
              </button>
              <button
                onClick={() => setAiMode('automatico')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  aiMode === 'automatico'
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Automático
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <FaRobot className="text-purple-500 text-xl" />
              <span className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">Atendimentos</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalAtendimentos}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <FaCheckCircle className="text-emerald-500 text-xl" />
              <span className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">Taxa Acerto</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.taxaAcerto}%</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <FaEdit className="text-amber-500 text-xl" />
              <span className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">Correções</span>
            </div>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.taxaCorrecao}%</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <FaDatabase className="text-cyan-500 text-xl" />
              <span className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">Fontes Ativas</span>
            </div>
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{stats.fontesAtivas}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <FaExclamationTriangle className="text-orange-500 text-xl" />
              <span className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">Pendentes</span>
            </div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.respostasPendentes}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <FaChartLine className="text-blue-500 text-xl" />
              <span className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">Horas Economizadas</span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.economiaHoras}h</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
        <div className="flex border-b-2 border-gray-200 dark:border-gray-700 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-purple-600 dark:text-purple-400 border-b-4 border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6">
        {/* Base de Conhecimento */}
        {activeTab === 'conhecimento' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Base de Conhecimento</h2>
              <button
                onClick={() => setShowAddSourceModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <FaPlus /> Nova Fonte
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {sources.map(source => (
                <div
                  key={source.id}
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        source.type === 'pdf' ? 'bg-red-100 dark:bg-red-900/30' :
                        source.type === 'youtube' ? 'bg-red-100 dark:bg-red-900/30' :
                        source.type === 'url' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        'bg-purple-100 dark:bg-purple-900/30'
                      }`}>
                        {source.type === 'pdf' && <FaFileUpload className="text-red-600 dark:text-red-400" />}
                        {source.type === 'youtube' && <FaYoutube className="text-red-600 dark:text-red-400" />}
                        {source.type === 'url' && <FaLink className="text-blue-600 dark:text-blue-400" />}
                        {source.type === 'manual' && <FaEdit className="text-purple-600 dark:text-purple-400" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{source.title}</h3>
                        {source.url && (
                          <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">{source.url}</p>
                        )}
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            source.status === 'processado'
                              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                          }`}>
                            {source.status === 'processado' ? 'Processado' : 'Processando...'}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            <strong>{source.chunks}</strong> chunks
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-500">
                            {source.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewSource(source)}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Visualizar detalhes"
                      >
                        <FaEye className="text-blue-600 dark:text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleEditSource(source)}
                        className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                        title="Editar fonte"
                      >
                        <FaEdit className="text-purple-600 dark:text-purple-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteSource(source.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Excluir fonte"
                      >
                        <FaTrash className="text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conversas */}
        {activeTab === 'conversas' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conversas em Andamento</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar conversas..."
                    className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:border-purple-400 transition-all">
                  <FaFilter /> Filtros
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Lista de conversas */}
              <div className="space-y-3">
                {conversations.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedConversation?.id === conv.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 dark:text-white">{conv.cliente}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        conv.status === 'ativo'
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                          : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      }`}>
                        {conv.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{conv.canal}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{conv.ultimaMensagem}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{conv.dataHora}</p>
                  </button>
                ))}
              </div>

              {/* Chat */}
              <div className="md:col-span-2 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 flex flex-col h-[600px]">
                {selectedConversation ? (
                  <>
                    {/* Header do chat */}
                    <div className="p-4 border-b-2 border-gray-200 dark:border-gray-700">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{selectedConversation.cliente}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300">{selectedConversation.canal}</p>
                    </div>

                    {/* Mensagens */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                      {selectedConversation.mensagens.map(msg => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`max-w-[70%] ${msg.role === 'user' ? '' : ''}`}>
                            <div className={`p-3 rounded-xl ${
                              msg.role === 'user'
                                ? 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
                                : 'bg-purple-500 text-white'
                            }`}>
                              <p className="text-sm">{msg.content}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-1 px-2">
                              <span className="text-xs text-gray-500 dark:text-gray-500">{msg.timestamp}</span>
                              {msg.role === 'assistant' && (
                                <>
                                  {msg.isEdited && (
                                    <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                                      Editada
                                    </span>
                                  )}
                                  <button
                                    onClick={() => setEditingMessage(msg)}
                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                  >
                                    <FaEdit className="text-xs text-gray-500" />
                                  </button>
                                  <button className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded transition-colors">
                                    <FaThumbsUp className="text-xs text-emerald-600" />
                                  </button>
                                  <button className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors">
                                    <FaThumbsDown className="text-xs text-red-600" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t-2 border-gray-200 dark:border-gray-700">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Digite uma mensagem..."
                          className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                        />
                        <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                          Enviar
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <FaComments className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-300">Selecione uma conversa</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Aprendizado */}
        {activeTab === 'aprendizado' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Sistema de Aprendizado</h2>
            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaLightbulb className="text-3xl text-purple-600 dark:text-purple-400" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Aprendizado Contínuo</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">A IA aprende com cada correção</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">156</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Correções aplicadas</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">89%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Melhoria de acurácia</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">342</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Padrões identificados</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Últimas Correções</h3>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-3">
                      <FaEdit className="text-amber-500 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Pergunta sobre prazo de entrega</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-xs text-red-600 dark:text-red-400 font-semibold">Original:</span>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">"O prazo é de 5 dias úteis"</p>
                          </div>
                          <div>
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Corrigida:</span>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">"O prazo é de 5 a 7 dias úteis, podendo variar conforme a região"</p>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">Hoje, 14:30</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Configurações */}
        {activeTab === 'configuracoes' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Configurações da IA</h2>

            <div className="space-y-6">
              {/* Provedor de IA */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Provedor de IA</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Provedor
                    </label>
                    <select
                      value={aiConfig.provider}
                      onChange={(e) => setAiConfig({...aiConfig, provider: e.target.value})}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="openai">OpenAI</option>
                      <option value="google">Google AI</option>
                      <option value="anthropic">Anthropic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Modelo
                    </label>
                    <select
                      value={aiConfig.model}
                      onChange={(e) => setAiConfig({...aiConfig, model: e.target.value})}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Parâmetros */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Parâmetros</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Temperature: {aiConfig.temperature}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={aiConfig.temperature}
                      onChange={(e) => setAiConfig({...aiConfig, temperature: parseFloat(e.target.value)})}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-1">
                      <span>Preciso</span>
                      <span>Criativo</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Máximo de Tokens
                    </label>
                    <input
                      type="number"
                      value={aiConfig.maxTokens}
                      onChange={(e) => setAiConfig({...aiConfig, maxTokens: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Tom de Voz
                    </label>
                    <select
                      value={aiConfig.tone}
                      onChange={(e) => setAiConfig({...aiConfig, tone: e.target.value})}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="profissional">Profissional</option>
                      <option value="casual">Casual</option>
                      <option value="tecnico">Técnico</option>
                      <option value="amigavel">Amigável</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Prompt do Sistema */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Prompt do Sistema</h3>
                <textarea
                  value={aiConfig.systemPrompt}
                  onChange={(e) => setAiConfig({...aiConfig, systemPrompt: e.target.value})}
                  rows={6}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none"
                  placeholder="Defina a personalidade e comportamento da IA..."
                />
              </div>

              {/* Escalonamento Inteligente */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-700 p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center flex-shrink-0">
                    <FaUserPlus className="text-white text-xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Escalonamento Inteligente
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Quando a IA identifica perguntas complexas ou que requerem conhecimento especializado, ela automaticamente transfere para um atendente humano.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Toggle Escalonamento */}
                  <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex-1">
                      <label className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white cursor-pointer">
                        <FaMagic className="text-purple-500" />
                        Ativar Escalonamento Automático
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-300 mt-1 ml-6">
                        A IA detectará quando não consegue responder adequadamente
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={aiConfig.enableEscalation}
                        onChange={(e) => setAiConfig({...aiConfig, enableEscalation: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  {aiConfig.enableEscalation && (
                    <>
                      {/* Threshold */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <FaInfoCircle className="text-blue-500" />
                            Sensibilidade do Escalonamento
                          </label>
                          <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                            {Math.round((1 - aiConfig.escalationThreshold) * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.3"
                          max="0.9"
                          step="0.1"
                          value={aiConfig.escalationThreshold}
                          onChange={(e) => setAiConfig({...aiConfig, escalationThreshold: parseFloat(e.target.value)})}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-1">
                          <span>🟢 Menos sensível</span>
                          <span>🟡 Moderado</span>
                          <span>🔴 Mais sensível</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-300 mt-2 bg-white dark:bg-gray-800 rounded-lg p-2">
                          💡 <strong>Dica:</strong> Quanto mais sensível, mais a IA vai transferir para humanos. Recomendado: 60-70%
                        </p>
                      </div>

                      {/* Mensagem de Escalonamento */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Mensagem de Transferência
                        </label>
                        <textarea
                          value={aiConfig.escalationMessage}
                          onChange={(e) => setAiConfig({...aiConfig, escalationMessage: e.target.value})}
                          rows={3}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none text-sm"
                          placeholder="Mensagem que a IA enviará ao transferir..."
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                          Esta mensagem será enviada ao cliente antes de transferir para um atendente humano
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Contexto e Compreensão */}
              <div className="bg-gradient-to-br from-cyan-50 to-emerald-50 dark:from-cyan-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-cyan-200 dark:border-cyan-700 p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500 flex items-center justify-center flex-shrink-0">
                    <FaBrain className="text-white text-xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Contexto da Conversa
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Configure como a IA entende e lembra do contexto das conversas para dar respostas mais precisas.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Contexto Completo */}
                  <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex-1">
                      <label className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white cursor-pointer">
                        <FaCheckDouble className="text-cyan-500" />
                        Usar Contexto Completo
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-300 mt-1 ml-6">
                        A IA analisará toda a conversa para entender melhor o cliente
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={aiConfig.useFullConversationContext}
                        onChange={(e) => setAiConfig({...aiConfig, useFullConversationContext: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>

                  {/* Quantidade de Mensagens */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <FaComments className="text-purple-500" />
                      Mensagens Anteriores para Contexto
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="3"
                        max="20"
                        value={aiConfig.maxContextMessages}
                        onChange={(e) => setAiConfig({...aiConfig, maxContextMessages: parseInt(e.target.value)})}
                        className="flex-1"
                      />
                      <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400 min-w-[60px] text-center bg-white dark:bg-gray-800 rounded-lg px-3 py-2">
                        {aiConfig.maxContextMessages}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-300 mt-2 bg-white dark:bg-gray-800 rounded-lg p-2">
                      💡 <strong>Recomendado:</strong> 8-12 mensagens. Mais mensagens = melhor contexto, mas resposta mais lenta
                    </p>
                  </div>

                  {/* Análise de Sentimento */}
                  <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex-1">
                      <label className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white cursor-pointer">
                        <FaLightbulb className="text-yellow-500" />
                        Analisar Sentimento do Cliente
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-300 mt-1 ml-6">
                        Identifica se o cliente está satisfeito, frustrado ou neutro
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={aiConfig.analyzeClientSentiment}
                        onChange={(e) => setAiConfig({...aiConfig, analyzeClientSentiment: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Segurança */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaShieldAlt className="text-emerald-500" />
                  Segurança
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <FaKey className="text-amber-500" />
                      API Key
                    </label>
                    <input
                      type="password"
                      placeholder="sk-..."
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Roteamento de Atendentes */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-700 p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <FaUserPlus className="text-white text-xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Roteamento Inteligente de Atendentes
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      A IA detecta automaticamente o setor (Comercial, Suporte, Financeiro) e atribui para o atendente disponível correto.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Comercial */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <FaRobot className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Comercial</h4>
                    </div>
                    <div className="space-y-2">
                      {attendantsByDepartment.comercial.map(att => (
                        <div key={att.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              att.status === 'online' ? 'bg-emerald-500' :
                              att.status === 'ausente' ? 'bg-amber-500' :
                              'bg-gray-400'
                            }`} />
                            <span className="text-gray-700 dark:text-gray-300">{att.nome}</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {att.atendimentos} conv.
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        <strong>Palavras-chave:</strong> comprar, preço, venda, produto
                      </p>
                    </div>
                  </div>

                  {/* Suporte */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <FaLightbulb className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Suporte</h4>
                    </div>
                    <div className="space-y-2">
                      {attendantsByDepartment.suporte.map(att => (
                        <div key={att.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              att.status === 'online' ? 'bg-emerald-500' :
                              att.status === 'ausente' ? 'bg-amber-500' :
                              'bg-gray-400'
                            }`} />
                            <span className="text-gray-700 dark:text-gray-300">{att.nome}</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {att.atendimentos} conv.
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        <strong>Palavras-chave:</strong> problema, erro, bug, senha, ajuda
                      </p>
                    </div>
                  </div>

                  {/* Financeiro */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <FaKey className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Financeiro</h4>
                    </div>
                    <div className="space-y-2">
                      {attendantsByDepartment.financeiro.map(att => (
                        <div key={att.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              att.status === 'online' ? 'bg-emerald-500' :
                              att.status === 'ausente' ? 'bg-amber-500' :
                              'bg-gray-400'
                            }`} />
                            <span className="text-gray-700 dark:text-gray-300">{att.nome}</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {att.atendimentos} conv.
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        <strong>Palavras-chave:</strong> boleto, fatura, reembolso, pagamento
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <FaInfoCircle className="text-amber-600 dark:text-amber-400 text-xl flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-800 dark:text-amber-200 mb-1">Como Funciona:</h4>
                      <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                        <li>1️⃣ Cliente envia mensagem</li>
                        <li>2️⃣ IA detecta palavras-chave e identifica o setor</li>
                        <li>3️⃣ Se precisar de humano, busca atendente <strong>ONLINE</strong> do setor</li>
                        <li>4️⃣ Atribui para quem tem <strong>MENOS atendimentos</strong></li>
                        <li>5️⃣ Se ninguém online, tenta <strong>AUSENTE</strong></li>
                        <li>6️⃣ Informa ao cliente que foi transferido</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sistema de Aprendizado */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border-2 border-amber-200 dark:border-amber-700 p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                    <FaBrain className="text-white text-xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Aprendizado Contínuo
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      A cada correção que você faz, a IA aprende e melhora suas respostas automaticamente.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Toggle Aprendizado */}
                  <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex-1">
                      <label className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white cursor-pointer">
                        <FaMagic className="text-amber-500" />
                        Aprendizado Automático
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-300 mt-1 ml-6">
                        Quando você editar uma resposta da IA, ela aprende automaticamente
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={aiConfig.enableContinuousLearning}
                        onChange={(e) => setAiConfig({...aiConfig, enableContinuousLearning: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  {/* Estatísticas de Aprendizado */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{learningDatabase.length}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">Padrões Aprendidos</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {Math.round(learningDatabase.reduce((sum, l) => sum + l.confianca, 0) / learningDatabase.length * 100)}%
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">Confiança Média</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {learningDatabase.reduce((sum, l) => sum + l.vezesCorrida, 0)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">Total Correções</p>
                    </div>
                  </div>

                  {/* Últimos Aprendizados */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">Últimos Aprendizados</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {learningDatabase.slice(-5).reverse().map(learn => (
                        <div key={learn.id} className="text-xs bg-gray-50 dark:bg-gray-900 rounded-lg p-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {learn.pergunta}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              learn.setor === 'comercial' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                              learn.setor === 'suporte' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                              'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                            }`}>
                              {learn.setor}
                            </span>
                          </div>
                          <p className="text-gray-500 dark:text-gray-500">
                            Confiança: {Math.round(learn.confianca * 100)}% • Corrigido {learn.vezesCorrida}x
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all">
                  Cancelar
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                  <FaSave /> Salvar Configurações
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Métricas */}
        {activeTab === 'metricas' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard de Métricas</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gráfico de Taxa de Acerto */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaChartBar className="text-emerald-500" />
                  Taxa de Acerto
                </h3>
                <div className="h-48 flex items-end justify-around gap-2">
                  {[92, 93, 91, 94, 95, 94, 94.5].map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg"
                        style={{ height: `${value}%` }}
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Volume de Atendimentos */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaChartLine className="text-purple-500" />
                  Volume de Atendimentos
                </h3>
                <div className="h-48 flex items-end justify-around gap-2">
                  {[120, 145, 132, 178, 165, 198, 210].map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg"
                        style={{ height: `${(value / 250) * 100}%` }}
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Métricas de Qualidade */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Métricas de Qualidade</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Satisfação do Cliente</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">4.7/5.0</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-3 rounded-full" style={{ width: '94%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tempo Médio de Resposta</span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">1.2s</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full" style={{ width: '88%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Resolução Primeira Interação</span>
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-400 h-3 rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ROI e Economia */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Retorno sobre Investimento</h3>
                <div className="space-y-3">
                  <div className="bg-white/20 rounded-lg p-4">
                    <p className="text-sm opacity-90 mb-1">Horas Economizadas (Mês)</p>
                    <p className="text-3xl font-bold">312h</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <p className="text-sm opacity-90 mb-1">Economia Estimada</p>
                    <p className="text-3xl font-bold">R$ 18.720</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <p className="text-sm opacity-90 mb-1">ROI</p>
                    <p className="text-3xl font-bold">385%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Adicionar Fonte */}
      {showAddSourceModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full border-2 border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Nova Fonte de Conhecimento
                </h2>
                <button
                  onClick={() => setShowAddSourceModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Tipo de Fonte
                </label>
                <div className="grid grid-cols-4 gap-3">
                  <button
                    onClick={() => setSourceType('pdf')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      sourceType === 'pdf'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <FaFileUpload className="text-2xl text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">PDF</p>
                  </button>
                  <button
                    onClick={() => setSourceType('url')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      sourceType === 'url'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <FaLink className="text-2xl text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">URL</p>
                  </button>
                  <button
                    onClick={() => setSourceType('youtube')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      sourceType === 'youtube'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <FaYoutube className="text-2xl text-red-600 dark:text-red-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">YouTube</p>
                  </button>
                  <button
                    onClick={() => setSourceType('manual')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      sourceType === 'manual'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <FaEdit className="text-2xl text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Texto</p>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={newSource.title}
                    onChange={(e) => setNewSource({...newSource, title: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                    placeholder="Nome da fonte de conhecimento"
                  />
                </div>

                {(sourceType === 'url' || sourceType === 'youtube') && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      URL
                    </label>
                    <input
                      type="url"
                      value={newSource.url}
                      onChange={(e) => setNewSource({...newSource, url: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                      placeholder={sourceType === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://...'}
                    />
                  </div>
                )}

                {sourceType === 'pdf' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Arquivo PDF
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-purple-400 transition-colors cursor-pointer">
                      <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Clique para selecionar ou arraste o arquivo aqui
                      </p>
                      <input type="file" accept=".pdf" className="hidden" />
                    </div>
                  </div>
                )}

                {sourceType === 'manual' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Conteúdo
                    </label>
                    <textarea
                      value={newSource.content}
                      onChange={(e) => setNewSource({...newSource, content: e.target.value})}
                      rows={8}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none"
                      placeholder="Cole ou digite o conteúdo aqui..."
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
              <button
                onClick={() => setShowAddSourceModal(false)}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddSource}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Adicionar Fonte
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Visualizar Fonte */}
      {showViewSourceModal && selectedSource && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-3xl w-full border-2 border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedSource.type === 'pdf' ? 'bg-red-100 dark:bg-red-900/30' :
                    selectedSource.type === 'youtube' ? 'bg-red-100 dark:bg-red-900/30' :
                    selectedSource.type === 'url' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    'bg-purple-100 dark:bg-purple-900/30'
                  }`}>
                    {selectedSource.type === 'pdf' && <FaFileUpload className="text-red-600 dark:text-red-400 text-xl" />}
                    {selectedSource.type === 'youtube' && <FaYoutube className="text-red-600 dark:text-red-400 text-xl" />}
                    {selectedSource.type === 'url' && <FaLink className="text-blue-600 dark:text-blue-400 text-xl" />}
                    {selectedSource.type === 'manual' && <FaEdit className="text-purple-600 dark:text-purple-400 text-xl" />}
                  </div>
                  Detalhes da Fonte
                </h2>
                <button
                  onClick={() => setShowViewSourceModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Título */}
              <div>
                <label className="block text-sm font-semibold text-gray-500 dark:text-gray-300 mb-2">
                  TÍTULO
                </label>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedSource.title}
                </h3>
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm font-semibold text-gray-500 dark:text-gray-300 mb-2">
                  TIPO
                </label>
                <span className={`inline-block px-4 py-2 rounded-xl text-sm font-semibold ${
                  selectedSource.type === 'pdf' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                  selectedSource.type === 'youtube' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                  selectedSource.type === 'url' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                  'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                }`}>
                  {selectedSource.type === 'pdf' && 'PDF'}
                  {selectedSource.type === 'youtube' && 'YouTube'}
                  {selectedSource.type === 'url' && 'URL'}
                  {selectedSource.type === 'manual' && 'Texto Manual'}
                </span>
              </div>

              {/* URL (se tiver) */}
              {selectedSource.url && (
                <div>
                  <label className="block text-sm font-semibold text-gray-500 dark:text-gray-300 mb-2">
                    URL
                  </label>
                  <a
                    href={selectedSource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-2"
                  >
                    {selectedSource.url}
                    <FaArrowRight className="text-sm" />
                  </a>
                </div>
              )}

              {/* Conteúdo (se tiver) */}
              {selectedSource.content && (
                <div>
                  <label className="block text-sm font-semibold text-gray-500 dark:text-gray-300 mb-2">
                    CONTEÚDO
                  </label>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedSource.content}
                    </p>
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-500 dark:text-gray-300 mb-2">
                    STATUS
                  </label>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedSource.status === 'processado'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                  }`}>
                    {selectedSource.status === 'processado' ? 'Processado' : 'Processando...'}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 dark:text-gray-300 mb-2">
                    CHUNKS
                  </label>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedSource.chunks}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 dark:text-gray-300 mb-2">
                    CRIADO EM
                  </label>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {selectedSource.createdAt}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50">
              <button
                onClick={() => {
                  setShowViewSourceModal(false);
                  handleEditSource(selectedSource);
                }}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
              >
                <FaEdit /> Editar
              </button>
              <button
                onClick={() => setShowViewSourceModal(false)}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Fonte */}
      {showEditSourceModal && editingSource && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full border-2 border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Editar Fonte de Conhecimento
                </h2>
                <button
                  onClick={() => {
                    setShowEditSourceModal(false);
                    setEditingSource(null);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {/* Tipo de Fonte (Read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Fonte
                  </label>
                  <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      {editingSource.type === 'pdf' && <FaFileUpload className="text-red-600 dark:text-red-400" />}
                      {editingSource.type === 'youtube' && <FaYoutube className="text-red-600 dark:text-red-400" />}
                      {editingSource.type === 'url' && <FaLink className="text-blue-600 dark:text-blue-400" />}
                      {editingSource.type === 'manual' && <FaEdit className="text-purple-600 dark:text-purple-400" />}
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {editingSource.type === 'pdf' && 'PDF'}
                        {editingSource.type === 'youtube' && 'YouTube'}
                        {editingSource.type === 'url' && 'URL'}
                        {editingSource.type === 'manual' && 'Texto Manual'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Título */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={editingSource.title}
                    onChange={(e) => setEditingSource({...editingSource, title: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                    placeholder="Nome da fonte de conhecimento"
                  />
                </div>

                {/* URL (se for url ou youtube) */}
                {(editingSource.type === 'url' || editingSource.type === 'youtube') && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      URL
                    </label>
                    <input
                      type="url"
                      value={editingSource.url || ''}
                      onChange={(e) => setEditingSource({...editingSource, url: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                      placeholder={editingSource.type === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://...'}
                    />
                  </div>
                )}

                {/* Conteúdo (se for manual) */}
                {editingSource.type === 'manual' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Conteúdo
                    </label>
                    <textarea
                      value={editingSource.content || ''}
                      onChange={(e) => setEditingSource({...editingSource, content: e.target.value})}
                      rows={10}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none"
                      placeholder="Cole ou digite o conteúdo aqui..."
                    />
                  </div>
                )}

                {/* Status e Chunks */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={editingSource.status}
                      onChange={(e) => setEditingSource({...editingSource, status: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="processando">Processando</option>
                      <option value="processado">Processado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Chunks
                    </label>
                    <input
                      type="number"
                      value={editingSource.chunks}
                      onChange={(e) => setEditingSource({...editingSource, chunks: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditSourceModal(false);
                  setEditingSource(null);
                }}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <FaSave /> Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Banner - Mostrar se não tiver acesso à IA */}
      {showUpgradeBanner && (
        <UpgradeBanner
          feature="IA com Automação Inteligente"
          requiredPlan="Enterprise"
          onClose={() => setShowUpgradeBanner(false)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};

export default IA;
