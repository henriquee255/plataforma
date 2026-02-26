// TODO: Integrar com WhatsApp Business API
// TODO: Implementar websockets para mensagens em tempo real
// TODO: Adicionar suporte a anexos (imagens, documentos, áudio)
// TODO: Implementar mensagens agendadas
// TODO: Adicionar tradução automática de mensagens
// TODO: Implementar chatbot com respostas automáticas
import React, { useState, useEffect, useRef } from 'react';
import { useSubscription } from './contexts/SubscriptionContext';
import {
  FaSearch,
  FaPaperPlane,
  FaEllipsisV,
  FaPaperclip,
  FaSmile,
  FaPhone,
  FaVideo,
  FaInfoCircle,
  FaCheck,
  FaCheckDouble,
  FaSortAmountDown,
  FaSortAmountUp,
  FaChevronDown,
  FaChevronRight,
  FaMicrophone,
  FaEdit,
  FaTrash,
  FaTimes,
  FaFile,
  FaImage,
  FaFilm,
  FaStop,
  FaBolt,
  FaCopy,
  FaPlay,
  FaPause,
  FaDownload,
  FaFileAlt
} from 'react-icons/fa';

const Inbox = ({ selectedChatId = null }) => {
  const { currentCompany } = useSubscription();

  // Filtrar chats por empresa atual
  const companyId = currentCompany?._id;

  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('ambos');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [showMessageMenu, setShowMessageMenu] = useState(null);
  const [showAttendantDropdown, setShowAttendantDropdown] = useState(false);
  const [showContactPanel, setShowContactPanel] = useState(true);
  const [contactPanelTab, setContactPanelTab] = useState('info'); // 'info' ou 'notes'
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [contactTags, setContactTags] = useState(['VIP', 'Urgente']);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editedContactInfo, setEditedContactInfo] = useState({
    nome: '',
    telefone: '',
    email: '',
    documento: '',
    origem: ''
  });

  // Estados para Enviar para CRM
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [showCRMPipelinesMenu, setShowCRMPipelinesMenu] = useState(false);
  const [showCRMStagesMenu, setShowCRMStagesMenu] = useState(false);
  const [selectedCRMPipeline, setSelectedCRMPipeline] = useState(null);
  const [crmPipelines, setCrmPipelines] = useState([]);

  // Estados para Anexos
  const [playingAudio, setPlayingAudio] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const audioRef = useRef(null);

  // Estado para mensagens mutáveis
  const [messagesData, setMessagesData] = useState({});

  // Estado para informações de contatos (mutável)
  const [contactsInfo, setContactsInfo] = useState({});

  // Estados para Atalhos/Respostas Rápidas
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [shortcutsSearch, setShortcutsSearch] = useState('');
  const [copiedShortcut, setCopiedShortcut] = useState(null);

  // Estado para gerenciar conversas (agora mutável)
  const [conversationsData, setConversationsData] = useState([]);

  // Tags disponíveis para adicionar
  const availableTags = [
    'VIP',
    'Urgente',
    'Importante',
    'Cliente Novo',
    'Recorrente',
    'Promoção',
    'Suporte',
    'Vendas',
    'Cancelamento',
    'Follow-up'
  ];
  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Lista de atendentes disponíveis
  const attendants = [
    { id: 1, nome: 'Maria Santos' },
    { id: 2, nome: 'Carlos Mendes' },
    { id: 3, nome: 'Ana Paula' },
    { id: 4, nome: 'João Costa' }
  ];

  // Emojis comuns
  const commonEmojis = ['😀', '😂', '😊', '😍', '🥰', '😎', '🤔', '😢', '😭', '😡', '👍', '👎', '👏', '🙏', '❤️', '🎉', '🔥', '⭐', '✨', '💯'];

  // Atalhos/Respostas Rápidas
  const shortcuts = [
    { id: '1', shortcut: 'ola', title: 'Saudação Inicial', content: 'Olá! Bem-vindo(a)! Como posso ajudá-lo(a) hoje?' },
    { id: '2', shortcut: 'horario', title: 'Horário de Funcionamento', content: 'Nosso horário de atendimento é de segunda a sexta, das 9h às 18h.' },
    { id: '3', shortcut: 'obrigado', title: 'Agradecimento', content: 'Muito obrigado(a) por entrar em contato! Estamos sempre à disposição.' },
    { id: '4', shortcut: 'aguarde', title: 'Solicitar Espera', content: 'Por favor, aguarde um momento enquanto verifico essas informações para você.' },
    { id: '5', shortcut: 'email', title: 'Solicitar Email', content: 'Para prosseguir, poderia me informar seu e-mail, por favor?' },
    { id: '6', shortcut: 'telefone', title: 'Solicitar Telefone', content: 'Poderia me passar um número de telefone para contato?' },
    { id: '7', shortcut: 'despedida', title: 'Despedida', content: 'Foi um prazer atendê-lo(a)! Tenha um ótimo dia!' },
    { id: '8', shortcut: 'desconto', title: 'Informar sobre Desconto', content: 'Temos uma promoção especial com 15% de desconto para novos clientes!' },
    { id: '9', shortcut: 'pagamento', title: 'Formas de Pagamento', content: 'Aceitamos cartão de crédito, débito, PIX e boleto bancário.' },
    { id: '10', shortcut: 'entrega', title: 'Prazo de Entrega', content: 'O prazo de entrega é de 5 a 10 dias úteis após a confirmação do pagamento.' }
  ];

  // Selecionar chat automaticamente quando vindo do Dashboard
  useEffect(() => {
    if (selectedChatId) {
      setSelectedChat(selectedChatId);
    }
  }, [selectedChatId]);

  // Timer de gravação
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Fechar dropdowns e pickers com Esc (WCAG 2.1 AA)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowCategoryDropdown(false);
        setShowStatusDropdown(false);
        setShowEmojiPicker(false);
        setShowAttachMenu(false);
        setShowMessageMenu(null);
        setShowAttendantDropdown(false);
        setShowTagsDropdown(false);
        setShowShortcutsModal(false);
        setShowHeaderMenu(false);
        setShowCRMPipelinesMenu(false);
        setShowCRMStagesMenu(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Carregar pipelines do CRM do localStorage
  useEffect(() => {
    const savedPipelines = localStorage.getItem('crm_pipelines');
    if (savedPipelines) {
      try {
        const parsed = JSON.parse(savedPipelines);
        setCrmPipelines(parsed);
      } catch (error) {
        console.error('Erro ao carregar pipelines do CRM:', error);
        setCrmPipelines([]);
      }
    }
  }, []);

  // Inicializar mensagens mockadas
  useEffect(() => {
    setMessagesData({
      1: [
        { id: 1, sender: 'user', text: 'Olá, gostaria de saber sobre os preços dos produtos.', time: '10:25', read: true },
        { id: 2, sender: 'me', text: 'Olá João! Claro, posso te ajudar com isso.', time: '10:26', read: true },
        { id: 3, sender: 'me', text: 'Quais produtos você tem interesse?', time: '10:26', read: true },
        { id: 4, sender: 'user', text: 'Estou procurando notebooks para trabalho', time: '10:30', read: false },
        {
          id: 5,
          sender: 'user',
          text: 'Aqui está uma imagem do modelo que gostei',
          time: '10:31',
          read: false,
          attachment: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
            name: 'notebook-exemplo.jpg'
          }
        },
        {
          id: 6,
          sender: 'me',
          text: '',
          time: '10:32',
          read: true,
          attachment: {
            type: 'audio',
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            name: 'resposta-voz.mp3',
            duration: '0:45'
          }
        },
        {
          id: 7,
          sender: 'me',
          text: 'Aqui está o catálogo completo',
          time: '10:33',
          read: true,
          attachment: {
            type: 'document',
            url: '#',
            name: 'catalogo-notebooks.pdf',
            size: '2.5 MB'
          }
        }
      ],
      2: [
        { id: 1, sender: 'user', text: 'Olá, preciso de ajuda', time: '09:30', read: true },
        { id: 2, sender: 'me', text: 'Oi Maria! Como posso te ajudar?', time: '09:31', read: true },
        { id: 3, sender: 'user', text: 'Obrigada pelo atendimento!', time: '09:45', read: true }
      ],
      3: [
        { id: 1, sender: 'user', text: 'Quando vocês abrem?', time: 'Ontem 14:20', read: false }
      ],
      4: [
        { id: 1, sender: 'me', text: 'Oi Ana! Seu pedido foi enviado.', time: 'Ontem 11:00', read: true },
        { id: 2, sender: 'user', text: 'Perfeito! Vou aguardar.', time: 'Ontem 11:05', read: true }
      ],
      5: [
        { id: 1, sender: 'user', text: 'Oi! Tudo bem?', time: '18/02 16:30', read: true },
        { id: 2, sender: 'user', text: 'Vocês entregam em qual região?', time: '18/02 16:31', read: false }
      ],
      6: [
        { id: 1, sender: 'me', text: 'Olá Juliana! Seu pedido chegou?', time: '17/02 10:00', read: true },
        { id: 2, sender: 'user', text: 'Ótimo, obrigada!', time: '17/02 10:15', read: true }
      ]
    });
  }, []);

  // Inicializar dados de conversas
  useEffect(() => {
    setConversationsData([
      {
        id: 1,
        nome: 'João Silva',
        avatar: 'JS',
        ultimaMensagem: 'Olá, gostaria de saber sobre os preços dos produtos.',
        timestamp: '10:30',
        timestampValue: 1030,
        unread: 3,
        online: true,
        typing: false,
        atribuidoParaMim: true,
        atribuidoPara: 'Usuário',
        status: 'aberto'
      },
      {
        id: 2,
        nome: 'Maria Santos',
        avatar: 'MS',
        ultimaMensagem: 'Obrigada pelo atendimento!',
        timestamp: '09:45',
        timestampValue: 945,
        unread: 0,
        online: false,
        typing: false,
        read: true,
        atribuidoParaMim: true,
        atribuidoPara: 'Usuário',
        status: 'concluido'
      },
      {
        id: 3,
        nome: 'Pedro Costa',
        avatar: 'PC',
        ultimaMensagem: 'Quando vocês abrem?',
        timestamp: 'Ontem',
        timestampValue: 100,
        unread: 1,
        online: true,
        typing: false,
        atribuidoParaMim: false,
        atribuidoPara: null,
        status: 'aberto'
      },
      {
        id: 4,
        nome: 'Ana Paula',
        avatar: 'AP',
        ultimaMensagem: 'Perfeito! Vou aguardar.',
        timestamp: 'Ontem',
        timestampValue: 95,
        unread: 0,
        online: false,
        typing: false,
        read: true,
        atribuidoParaMim: true,
        atribuidoPara: 'Usuário',
        status: 'concluido'
      },
      {
        id: 5,
        nome: 'Carlos Eduardo',
        avatar: 'CE',
        ultimaMensagem: 'Vocês entregam em qual região?',
        timestamp: '18/02',
        timestampValue: 50,
        unread: 2,
        online: true,
        typing: false,
        atribuidoParaMim: false,
        atribuidoPara: null,
        status: 'aberto'
      },
      {
        id: 6,
        nome: 'Juliana Souza',
        avatar: 'JS',
        ultimaMensagem: 'Ótimo, obrigada!',
        timestamp: '17/02',
        timestampValue: 40,
        unread: 0,
        online: false,
        typing: false,
        read: true,
        atribuidoParaMim: true,
        atribuidoPara: 'Usuário',
        status: 'aberto'
      }
    ]);
  }, []);

  const conversations = conversationsData;

  // Mensagens do chat selecionado (agora usando estado mutável)
  const messages = selectedChat && messagesData[selectedChat] ? messagesData[selectedChat] : [];

  // Filtrar por categoria
  const filteredByCategory = conversations.filter(conv => {
    if (activeCategory === 'todos') return true;
    if (activeCategory === 'meus') return conv.atribuidoParaMim;
    if (activeCategory === 'nao-atribuidos') return !conv.atribuidoParaMim;
    return true;
  });

  // Filtrar por status
  const filteredByStatus = filteredByCategory.filter(conv => {
    if (statusFilter === 'ambos') return true;
    if (statusFilter === 'abertos') return conv.status === 'aberto';
    if (statusFilter === 'concluidos') return conv.status === 'concluido';
    return true;
  });

  // Filtrar por busca
  const filteredBySearch = filteredByStatus.filter(conv =>
    conv.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordenar
  const sortedConversations = [...filteredBySearch].sort((a, b) => {
    if (sortOrder === 'desc') {
      return b.timestampValue - a.timestampValue;
    } else {
      return a.timestampValue - b.timestampValue;
    }
  });

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedChat) {
      const currentMessages = messagesData[selectedChat] || [];
      const newMessage = {
        id: Date.now(),
        sender: 'me',
        text: messageInput,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        read: false
      };

      setMessagesData({
        ...messagesData,
        [selectedChat]: [...currentMessages, newMessage]
      });

      setMessageInput('');
      console.log('Mensagem enviada:', newMessage.text);
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessageInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setMessageInput('');
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    console.log('Áudio gravado:', recordingTime, 'segundos');
  };

  const handleCancelRecording = () => {
    setIsRecording(false);
  };

  const handleFileSelect = (type) => {
    if (type === 'file') fileInputRef.current?.click();
    if (type === 'photo') photoInputRef.current?.click();
    if (type === 'video') videoInputRef.current?.click();
    setShowAttachMenu(false);
  };

  const handleDeleteMessage = (messageId) => {
    if (!selectedChat) return;

    const currentMessages = messagesData[selectedChat] || [];
    const updatedMessages = currentMessages.filter(msg => msg.id !== messageId);

    setMessagesData({
      ...messagesData,
      [selectedChat]: updatedMessages
    });

    console.log('Mensagem deletada:', messageId);
  };

  const handleEditMessage = (messageId) => {
    if (!selectedChat) return;

    const currentMessages = messagesData[selectedChat] || [];
    const messageToEdit = currentMessages.find(msg => msg.id === messageId);

    if (messageToEdit) {
      const newText = prompt('Editar mensagem:', messageToEdit.text);

      if (newText !== null && newText.trim()) {
        const updatedMessages = currentMessages.map(msg =>
          msg.id === messageId
            ? { ...msg, text: newText.trim() }
            : msg
        );

        setMessagesData({
          ...messagesData,
          [selectedChat]: updatedMessages
        });

        console.log('Mensagem editada:', messageId);
      }
    }
  };

  const handleAssignToMe = () => {
    if (!selectedChat) return;

    setConversationsData(prevConversations =>
      prevConversations.map(conv =>
        conv.id === selectedChat
          ? { ...conv, atribuidoParaMim: true, atribuidoPara: 'Usuário' }
          : conv
      )
    );
    console.log('Conversa atribuída para mim');
  };

  const handleUnassign = () => {
    if (!selectedChat) return;

    setConversationsData(prevConversations =>
      prevConversations.map(conv =>
        conv.id === selectedChat
          ? { ...conv, atribuidoParaMim: false, atribuidoPara: null }
          : conv
      )
    );
    console.log('Conversa desatribuída');
  };

  const handleTransferToAttendant = (attendantId) => {
    if (!selectedChat) return;

    const attendant = attendants.find(a => a.id === attendantId);
    if (attendant) {
      setConversationsData(prevConversations =>
        prevConversations.map(conv =>
          conv.id === selectedChat
            ? { ...conv, atribuidoParaMim: false, atribuidoPara: attendant.nome }
            : conv
        )
      );
      console.log('Conversa transferida para:', attendant.nome);
    }
    setShowAttendantDropdown(false);
  };

  const handlePhoneCall = () => {
    if (!selectedConversation) return;
    console.log('Iniciando chamada de voz para:', selectedConversation.nome);
    alert(`Iniciando chamada de voz para ${selectedConversation.nome}...`);
    // Aqui seria integrado com sistema de telefonia
  };

  const handleVideoCall = () => {
    if (!selectedConversation) return;
    console.log('Iniciando chamada de vídeo para:', selectedConversation.nome);
    alert(`Iniciando chamada de vídeo para ${selectedConversation.nome}...`);
    // Aqui seria integrado com sistema de vídeo conferência
  };

  const handleAddNote = () => {
    if (noteInput.trim()) {
      const newNote = {
        id: Date.now(),
        text: noteInput,
        date: new Date().toLocaleString('pt-BR')
      };
      setNotes([...notes, newNote]);
      setNoteInput('');
    }
  };

  const handleEditNote = (noteId) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setNoteInput(note.text);
      setEditingNote(noteId);
    }
  };

  const handleUpdateNote = () => {
    if (noteInput.trim() && editingNote) {
      setNotes(notes.map(n =>
        n.id === editingNote
          ? { ...n, text: noteInput, date: new Date().toLocaleString('pt-BR') + ' (editado)' }
          : n
      ));
      setNoteInput('');
      setEditingNote(null);
    }
  };

  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter(n => n.id !== noteId));
  };

  const handleCancelEditNote = () => {
    setNoteInput('');
    setEditingNote(null);
  };

  const handleAddTag = (tag) => {
    if (!contactTags.includes(tag)) {
      setContactTags([...contactTags, tag]);
    }
    setShowTagsDropdown(false);
  };

  const handleRemoveTag = (tagToRemove) => {
    setContactTags(contactTags.filter(tag => tag !== tagToRemove));
  };

  const handleStartEditContact = () => {
    setEditedContactInfo({
      nome: contactInfo.nome,
      telefone: contactInfo.telefone,
      email: contactInfo.email,
      documento: contactInfo.documento,
      origem: contactInfo.origem || ''
    });
    setIsEditingContact(true);
  };

  const handleSaveContactEdit = () => {
    if (!selectedChat) return;

    // Salvar informações editadas no estado
    setContactsInfo({
      ...contactsInfo,
      [selectedChat]: {
        ...editedContactInfo
      }
    });

    console.log('Informações do contato salvas:', editedContactInfo);
    setIsEditingContact(false);

    // Idealmente seria salvo no localStorage ou backend aqui
    // localStorage.setItem('contactsInfo', JSON.stringify({ ...contactsInfo, [selectedChat]: editedContactInfo }));
  };

  const handleCancelContactEdit = () => {
    setIsEditingContact(false);
    setEditedContactInfo({
      nome: '',
      telefone: '',
      email: '',
      documento: '',
      origem: ''
    });
  };

  // Handler para copiar atalho
  const handleCopyShortcut = (shortcut) => {
    navigator.clipboard.writeText(shortcut.content).then(() => {
      setCopiedShortcut(shortcut.id);
      setTimeout(() => setCopiedShortcut(null), 2000);
    });
  };

  // Handler para enviar contato para o CRM
  const handleSendToCRM = (pipelineId, stageId) => {
    if (!selectedConversation || !contactInfo) return;

    // Criar novo lead/card com os dados do contato
    const newLead = {
      id: Date.now(),
      nome: contactInfo.nome,
      telefone: contactInfo.telefone || '+55 (11) 98765-4321',
      email: contactInfo.email || 'contato@exemplo.com',
      valor: '',
      empresa: '',
      origem: contactInfo.origem || 'Inbox',
      tags: contactInfo.tags || [],
      atribuidoPara: null,
      dataEntrada: new Date().toISOString(),
      ultimaInteracao: new Date().toISOString(),
      prioridade: 'media',
      observacoes: `Contato enviado do Inbox em ${new Date().toLocaleString('pt-BR')}`
    };

    // Atualizar pipelines no localStorage
    const savedPipelines = localStorage.getItem('crm_pipelines');
    if (savedPipelines) {
      try {
        const pipelines = JSON.parse(savedPipelines);
        const updatedPipelines = pipelines.map(pipeline => {
          if (pipeline.id === pipelineId) {
            return {
              ...pipeline,
              stages: pipeline.stages.map(stage => {
                if (stage.id === stageId) {
                  return {
                    ...stage,
                    leads: [...(stage.leads || []), newLead]
                  };
                }
                return stage;
              })
            };
          }
          return pipeline;
        });

        localStorage.setItem('crm_pipelines', JSON.stringify(updatedPipelines));
        console.log('Contato enviado para o CRM:', newLead);
        alert(`${contactInfo.nome} foi adicionado ao CRM com sucesso!`);

        // Fechar menus
        setShowHeaderMenu(false);
        setShowCRMPipelinesMenu(false);
        setShowCRMStagesMenu(false);
        setSelectedCRMPipeline(null);
      } catch (error) {
        console.error('Erro ao enviar contato para o CRM:', error);
        alert('Erro ao enviar contato para o CRM. Por favor, tente novamente.');
      }
    }
  };

  // Filtrar atalhos pela busca
  const filteredShortcuts = shortcuts.filter(shortcut => {
    if (!shortcutsSearch) return true;
    const search = shortcutsSearch.toLowerCase();
    return (
      shortcut.shortcut.toLowerCase().includes(search) ||
      shortcut.title.toLowerCase().includes(search) ||
      shortcut.content.toLowerCase().includes(search)
    );
  });

  const selectedConversation = conversations.find(c => c.id === selectedChat);

  // Dados de exemplo do contato (usa info salva se existir)
  const contactInfo = selectedConversation ? {
    nome: contactsInfo[selectedChat]?.nome || selectedConversation.nome,
    telefone: contactsInfo[selectedChat]?.telefone || '+55 (11) 98765-4321',
    email: contactsInfo[selectedChat]?.email || 'contato@exemplo.com',
    documento: contactsInfo[selectedChat]?.documento || '123.456.789-00',
    origem: contactsInfo[selectedChat]?.origem || 'Site - Chat ao vivo',
    tags: contactsInfo[selectedChat]?.tags || ['VIP', 'Urgente'],
    atribuidoPara: selectedConversation.atribuidoParaMim ? 'Você' : null
  } : null;

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const getCategoryLabel = () => {
    if (activeCategory === 'todos') return 'Todos';
    if (activeCategory === 'meus') return 'Meus';
    if (activeCategory === 'nao-atribuidos') return 'Não atribuídos';
    return 'Todos';
  };

  const getStatusLabel = () => {
    if (statusFilter === 'ambos') return 'Ambos';
    if (statusFilter === 'abertos') return 'Abertos';
    if (statusFilter === 'concluidos') return 'Concluídos';
    return 'Ambos';
  };

  const formatRecordingTime = () => {
    const mins = Math.floor(recordingTime / 60);
    const secs = recordingTime % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex bg-white dark:bg-gray-950">
      {/* Inputs escondidos para arquivos */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            console.log('Documento anexado:', file.name);
            alert(`Documento "${file.name}" anexado! (Preview em desenvolvimento)`);
          }
        }}
      />
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            console.log('Imagem anexada:', file.name);
            alert(`Imagem "${file.name}" anexada! (Preview em desenvolvimento)`);
          }
        }}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            console.log('Vídeo anexado:', file.name);
            alert(`Vídeo "${file.name}" anexado! (Preview em desenvolvimento)`);
          }
        }}
      />

      {/* Lista de Conversas - Sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Mensagens</h1>

          {/* Search Bar */}
          <div className="relative mb-3">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm" aria-hidden="true" />
            <input
              type="text"
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Buscar conversas"
            />
          </div>

          {/* Categorias + Status + Ordenação */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Dropdown de Categoria */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Filtrar por categoria"
                aria-expanded={showCategoryDropdown}
              >
                {getCategoryLabel()}
                <FaChevronDown className="text-xs" aria-hidden="true" />
              </button>

              {showCategoryDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowCategoryDropdown(false)} aria-hidden="true" />
                  <div className="absolute top-full left-0 mt-1 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 overflow-hidden">
                    <button onClick={() => { setActiveCategory('todos'); setShowCategoryDropdown(false); }} className={`w-full px-3 py-2 text-left text-xs font-medium transition-colors ${activeCategory === 'todos' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>Todos</button>
                    <button onClick={() => { setActiveCategory('meus'); setShowCategoryDropdown(false); }} className={`w-full px-3 py-2 text-left text-xs font-medium transition-colors ${activeCategory === 'meus' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>Meus</button>
                    <button onClick={() => { setActiveCategory('nao-atribuidos'); setShowCategoryDropdown(false); }} className={`w-full px-3 py-2 text-left text-xs font-medium transition-colors ${activeCategory === 'nao-atribuidos' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>Não atribuídos</button>
                  </div>
                </>
              )}
            </div>

            {/* Dropdown de Status */}
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {getStatusLabel()}
                <FaChevronDown className="text-xs" />
              </button>

              {showStatusDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} aria-hidden="true" />
                  <div className="absolute top-full left-0 mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 overflow-hidden">
                    <button onClick={() => { setStatusFilter('ambos'); setShowStatusDropdown(false); }} className={`w-full px-3 py-2 text-left text-xs font-medium transition-colors ${statusFilter === 'ambos' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>Ambos</button>
                    <button onClick={() => { setStatusFilter('abertos'); setShowStatusDropdown(false); }} className={`w-full px-3 py-2 text-left text-xs font-medium transition-colors ${statusFilter === 'abertos' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>Abertos</button>
                    <button onClick={() => { setStatusFilter('concluidos'); setShowStatusDropdown(false); }} className={`w-full px-3 py-2 text-left text-xs font-medium transition-colors ${statusFilter === 'concluidos' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>Concluídos</button>
                  </div>
                </>
              )}
            </div>

            {/* Botão de Ordenação */}
            <button
              onClick={toggleSortOrder}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title={sortOrder === 'desc' ? 'Mais recentes primeiro' : 'Mais antigos primeiro'}
            >
              {sortOrder === 'desc' ? (
                <FaSortAmountDown className="text-gray-600 dark:text-gray-600 text-sm" />
              ) : (
                <FaSortAmountUp className="text-gray-600 dark:text-gray-600 text-sm" />
              )}
            </button>
          </div>
        </div>

        {/* Lista de Conversas */}
        <div className="flex-1 overflow-y-auto">
          {sortedConversations.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-600">Nenhuma conversa encontrada</p>
            </div>
          ) : (
            sortedConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedChat(conv.id)}
                className={`p-3 border-b border-gray-100 dark:border-gray-900 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-900/50 ${
                  selectedChat === conv.id ? 'bg-purple-50 dark:bg-purple-950/20 border-l-4 border-l-purple-500' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {conv.avatar}
                    </div>
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-950"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">{conv.nome}</h3>
                      <span className="text-xs text-gray-600 dark:text-gray-600 flex-shrink-0 ml-2">{conv.timestamp}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${conv.unread > 0 ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-600'}`}>
                        {conv.typing ? (
                          <span className="italic text-purple-600 dark:text-purple-400">digitando...</span>
                        ) : (
                          conv.ultimaMensagem
                        )}
                      </p>
                      {conv.unread > 0 && (
                        <span className="flex-shrink-0 ml-2 px-2 py-0.5 bg-purple-600 text-white text-xs font-bold rounded-full">{conv.unread}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Área de Chat - Meio */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedChat ? (
          <>
            {/* Header do Chat */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {selectedConversation.avatar}
                    </div>
                    {selectedConversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-950"></div>
                    )}
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">{selectedConversation.nome}</h2>
                    <p className="text-xs text-gray-600 dark:text-gray-600">{selectedConversation.online ? 'Online' : 'Offline'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePhoneCall}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                    title="Fazer chamada de voz"
                  >
                    <FaPhone className="text-gray-600 dark:text-gray-600" />
                  </button>
                  <button
                    onClick={handleVideoCall}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                    title="Fazer chamada de vídeo"
                  >
                    <FaVideo className="text-gray-600 dark:text-gray-600" />
                  </button>
                  <button
                    onClick={() => setShowContactPanel(!showContactPanel)}
                    className={`p-2 rounded-lg transition-colors ${
                      showContactPanel
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-600'
                    }`}
                    title={showContactPanel ? 'Fechar informações' : 'Abrir informações'}
                  >
                    <FaInfoCircle />
                  </button>
                  {/* Menu de 3 pontinhos com Enviar para CRM */}
                  <div className="relative">
                    <button
                      onClick={() => setShowHeaderMenu(!showHeaderMenu)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                      title="Mais opções"
                    >
                      <FaEllipsisV className="text-gray-600 dark:text-gray-600" />
                    </button>

                    {showHeaderMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => {
                            setShowHeaderMenu(false);
                            setShowCRMPipelinesMenu(false);
                            setShowCRMStagesMenu(false);
                          }}
                        />
                        <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 min-w-48 overflow-hidden">
                          {/* Opção Enviar para CRM */}
                          <div className="relative">
                            <button
                              onClick={() => {
                                setShowCRMPipelinesMenu(!showCRMPipelinesMenu);
                                setShowCRMStagesMenu(false);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-white hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center justify-between gap-2"
                            >
                              <span>Enviar para CRM</span>
                              <FaChevronRight className="text-xs text-gray-600 dark:text-gray-600" />
                            </button>

                            {/* Submenu de Pipelines */}
                            {showCRMPipelinesMenu && (
                              <div className="absolute left-full top-0 ml-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl min-w-48 max-h-80 overflow-y-auto">
                                {crmPipelines.length === 0 ? (
                                  <div className="px-4 py-3 text-xs text-gray-600 dark:text-gray-600 italic">
                                    Nenhuma pipeline encontrada.
                                    <br />
                                    Crie uma pipeline no CRM primeiro.
                                  </div>
                                ) : (
                                  crmPipelines.map(pipeline => (
                                    <div key={pipeline.id} className="relative">
                                      <button
                                        onClick={() => {
                                          setSelectedCRMPipeline(pipeline);
                                          setShowCRMStagesMenu(true);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-white hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center justify-between gap-2"
                                      >
                                        <span>{pipeline.name}</span>
                                        <FaChevronRight className="text-xs text-gray-600 dark:text-gray-600" />
                                      </button>

                                      {/* Submenu de Stages */}
                                      {showCRMStagesMenu && selectedCRMPipeline?.id === pipeline.id && (
                                        <div className="absolute left-full top-0 ml-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl min-w-48 max-h-80 overflow-y-auto">
                                          {pipeline.stages && pipeline.stages.length > 0 ? (
                                            pipeline.stages.map(stage => (
                                              <button
                                                key={stage.id}
                                                onClick={() => handleSendToCRM(pipeline.id, stage.id)}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-white hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                                              >
                                                {stage.nome}
                                              </button>
                                            ))
                                          ) : (
                                            <div className="px-4 py-3 text-xs text-gray-600 dark:text-gray-600 italic">
                                              Nenhum estágio nesta pipeline
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Mensagens - Estilo WhatsApp */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#e5ddd5] dark:bg-gray-900" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h100v100H0z\' fill=\'%23f0f0f0\' fill-opacity=\'0.05\'/%3E%3C/svg%3E")'
            }}>
              <div className="space-y-2 max-w-4xl mx-auto">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    onMouseEnter={() => msg.sender === 'me' && setHoveredMessage(msg.id)}
                    onMouseLeave={() => setHoveredMessage(null)}
                  >
                    <div className={`relative max-w-md group ${msg.sender === 'me' ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`px-3 py-2 rounded-lg shadow-sm relative ${
                          msg.sender === 'me'
                            ? 'bg-[#dcf8c6] dark:bg-purple-700 text-gray-900 dark:text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                        }`}
                      >
                        {/* Botão de 3 pontinhos - Apenas para mensagens do atendente */}
                        {msg.sender === 'me' && hoveredMessage === msg.id && (
                          <div className="absolute -top-2 -right-2">
                            <button
                              onClick={() => setShowMessageMenu(showMessageMenu === msg.id ? null : msg.id)}
                              className="p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <FaEllipsisV className="text-xs text-gray-600 dark:text-gray-600" />
                            </button>

                            {/* Menu Dropdown */}
                            {showMessageMenu === msg.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setShowMessageMenu(null)}
                                />
                                <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-20 w-32">
                                  <button
                                    onClick={() => {
                                      handleEditMessage(msg.id);
                                      setShowMessageMenu(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                                  >
                                    <FaEdit className="text-sm text-gray-600 dark:text-gray-600" />
                                    <span className="text-sm text-gray-900 dark:text-white">Editar</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleDeleteMessage(msg.id);
                                      setShowMessageMenu(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-left"
                                  >
                                    <FaTrash className="text-sm text-red-600 dark:text-red-400" />
                                    <span className="text-sm text-red-600 dark:text-red-400">Apagar</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        {msg.text && <p className="text-sm break-words pr-2">{msg.text}</p>}

                        {/* Renderizar Anexos */}
                        {msg.attachment && (
                          <div className="mt-2">
                            {/* Anexo de Imagem */}
                            {msg.attachment.type === 'image' && (
                              <div
                                className="cursor-pointer rounded-lg overflow-hidden max-w-xs"
                                onClick={() => {
                                  setSelectedImage(msg.attachment.url);
                                  setShowImageModal(true);
                                }}
                              >
                                <img
                                  src={msg.attachment.url}
                                  alt={msg.attachment.name}
                                  className="w-full h-auto hover:opacity-90 transition-opacity"
                                />
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 px-1">
                                  📷 {msg.attachment.name}
                                </p>
                              </div>
                            )}

                            {/* Anexo de Áudio */}
                            {msg.attachment.type === 'audio' && (
                              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex items-center gap-3 max-w-xs">
                                <button
                                  onClick={() => {
                                    if (playingAudio === msg.id) {
                                      audioRef.current?.pause();
                                      setPlayingAudio(null);
                                    } else {
                                      if (audioRef.current) {
                                        audioRef.current.src = msg.attachment.url;
                                        audioRef.current.play();
                                        setPlayingAudio(msg.id);
                                      }
                                    }
                                  }}
                                  className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition-colors"
                                >
                                  {playingAudio === msg.id ? (
                                    <FaPause className="text-sm" />
                                  ) : (
                                    <FaPlay className="text-sm ml-0.5" />
                                  )}
                                </button>
                                <div className="flex-1">
                                  <p className="text-xs font-medium text-gray-900 dark:text-white">
                                    🎵 Áudio
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {msg.attachment.duration}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Anexo de Documento */}
                            {msg.attachment.type === 'document' && (
                              <a
                                href={msg.attachment.url}
                                download={msg.attachment.name}
                                className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex items-center gap-3 max-w-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                              >
                                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center">
                                  <FaFileAlt className="text-lg" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                                    {msg.attachment.name}
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {msg.attachment.size}
                                  </p>
                                </div>
                                <FaDownload className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
                              </a>
                            )}

                            {/* Anexo de Vídeo */}
                            {msg.attachment.type === 'video' && (
                              <div className="rounded-lg overflow-hidden max-w-xs">
                                <video
                                  controls
                                  className="w-full h-auto"
                                  src={msg.attachment.url}
                                >
                                  Seu navegador não suporta vídeo.
                                </video>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 px-1">
                                  🎬 {msg.attachment.name}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-xs text-gray-600 dark:text-gray-600">{msg.time}</span>
                          {msg.sender === 'me' && (
                            msg.read ? (
                              <FaCheckDouble className="text-xs text-blue-500" />
                            ) : (
                              <FaCheck className="text-xs text-gray-600" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input de Mensagem */}
            <div className="p-3 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-end gap-2 max-w-4xl mx-auto">
                {!isRecording ? (
                  <>
                    {/* Botão de Anexo com Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setShowAttachMenu(!showAttachMenu)}
                        className="p-3 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-600"
                      >
                        <FaPaperclip className="text-xl" />
                      </button>

                      {showAttachMenu && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowAttachMenu(false)} />
                          <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-2 z-20">
                            <button
                              onClick={() => handleFileSelect('file')}
                              className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                            >
                              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                                <FaFile className="text-purple-600 dark:text-purple-400" />
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">Documento</span>
                            </button>
                            <button
                              onClick={() => handleFileSelect('photo')}
                              className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                            >
                              <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                                <FaImage className="text-pink-600 dark:text-pink-400" />
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">Foto</span>
                            </button>
                            <button
                              onClick={() => handleFileSelect('video')}
                              className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                            >
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <FaFilm className="text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">Vídeo</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Botão de Atalhos */}
                    <button
                      onClick={() => setShowShortcutsModal(true)}
                      className="p-3 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-600"
                      title="Atalhos e Respostas Rápidas"
                    >
                      <FaBolt className="text-xl" />
                    </button>

                    {/* Input de Texto */}
                    <div className="flex-1 relative">
                      <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Digite uma mensagem..."
                        rows="1"
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      />
                    </div>

                    {/* Botão de Emoji com Picker */}
                    <div className="relative">
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-3 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-600"
                      >
                        <FaSmile className="text-xl" />
                      </button>

                      {showEmojiPicker && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowEmojiPicker(false)} />
                          <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 z-20 w-64">
                            <div className="grid grid-cols-5 gap-2">
                              {commonEmojis.map((emoji, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleEmojiClick(emoji)}
                                  className="text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Botão de Enviar ou Gravar */}
                    {messageInput.trim() ? (
                      <button
                        onClick={handleSendMessage}
                        className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-all"
                      >
                        <FaPaperPlane className="text-xl" />
                      </button>
                    ) : (
                      <button
                        onClick={handleStartRecording}
                        className="p-3 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-600"
                      >
                        <FaMicrophone className="text-xl" />
                      </button>
                    )}
                  </>
                ) : (
                  /* Interface de Gravação */
                  <div className="flex-1 flex items-center gap-3 bg-white dark:bg-gray-800 rounded-full px-4 py-3 border border-gray-300 dark:border-gray-700">
                    <button
                      onClick={handleCancelRecording}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <FaTimes className="text-red-600 dark:text-red-400" />
                    </button>

                    {/* Ondas de Áudio Animadas */}
                    <div className="flex items-center gap-1 flex-1">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-purple-600 dark:bg-purple-400 rounded-full animate-pulse"
                          style={{
                            height: `${Math.random() * 20 + 10}px`,
                            animationDelay: `${i * 0.05}s`,
                            animationDuration: '0.8s'
                          }}
                        />
                      ))}
                    </div>

                    {/* Timer */}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{formatRecordingTime()}</span>

                    {/* Botão de Enviar Áudio */}
                    <button
                      onClick={handleStopRecording}
                      className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-all"
                    >
                      <FaPaperPlane className="text-xl" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50/20 to-gray-50 dark:from-gray-950 dark:via-purple-950/5 dark:to-gray-950">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 rounded-full flex items-center justify-center">
                <FaPaperPlane className="text-4xl text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Selecione uma conversa</h3>
              <p className="text-sm text-gray-600 dark:text-gray-600">Escolha uma conversa da lista para começar a conversar</p>
            </div>
          </div>
        )}
      </div>

      {/* Painel Direito - Informações do Contato (Sidebar) */}
      {selectedChat && contactInfo && (
        <div
          className={`border-l border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-gray-950 transition-all duration-300 ease-in-out ${
            showContactPanel ? 'w-80' : 'w-0 overflow-hidden'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex flex-col items-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-3">
                {selectedConversation.avatar}
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white text-center">{contactInfo.nome}</h2>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setContactPanelTab('info')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  contactPanelTab === 'info'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Informações
              </button>
              <button
                onClick={() => setContactPanelTab('notes')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  contactPanelTab === 'notes'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Notas
              </button>
            </div>
          </div>

          {/* Conteúdo - Informações ou Notas */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {contactPanelTab === 'info' ? (
              /* TAB: Informações do Contato */
              <>
            {/* Dados Pessoais */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-gray-600 dark:text-gray-600 uppercase">Informações</h3>
                {!isEditingContact ? (
                  <button
                    onClick={handleStartEditContact}
                    className="p-1.5 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                    title="Editar informações"
                  >
                    <FaEdit className="text-sm text-purple-600 dark:text-purple-400" />
                  </button>
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={handleSaveContactEdit}
                      className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-xs font-medium"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={handleCancelContactEdit}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-xs font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {/* Nome */}
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-600 block mb-1">Nome</label>
                  {isEditingContact ? (
                    <input
                      type="text"
                      value={editedContactInfo.nome}
                      onChange={(e) => setEditedContactInfo({ ...editedContactInfo, nome: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{contactInfo.nome}</p>
                  )}
                </div>

                {/* Telefone */}
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-600 block mb-1">Telefone</label>
                  {isEditingContact ? (
                    <input
                      type="text"
                      value={editedContactInfo.telefone}
                      onChange={(e) => setEditedContactInfo({ ...editedContactInfo, telefone: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{contactInfo.telefone}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-600 block mb-1">Email</label>
                  {isEditingContact ? (
                    <input
                      type="email"
                      value={editedContactInfo.email}
                      onChange={(e) => setEditedContactInfo({ ...editedContactInfo, email: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white break-all">{contactInfo.email}</p>
                  )}
                </div>

                {/* Documento */}
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-600 block mb-1">Documento (CPF/CNPJ)</label>
                  {isEditingContact ? (
                    <input
                      type="text"
                      value={editedContactInfo.documento}
                      onChange={(e) => setEditedContactInfo({ ...editedContactInfo, documento: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{contactInfo.documento}</p>
                  )}
                </div>

                {/* Origem */}
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-600 block mb-1">Local de Origem</label>
                  {isEditingContact ? (
                    <input
                      type="text"
                      value={editedContactInfo.origem}
                      onChange={(e) => setEditedContactInfo({ ...editedContactInfo, origem: e.target.value })}
                      placeholder="Ex: Site - Chat ao vivo"
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {contactInfo.origem || <span className="text-gray-600 dark:text-gray-600 italic">Não informado</span>}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-600 mb-2 block">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {contactTags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-purple-900 dark:hover:text-purple-100 transition-colors"
                          title="Remover tag"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </span>
                    ))}

                    {/* Botão + para adicionar tag */}
                    <div className="relative">
                      <button
                        onClick={() => setShowTagsDropdown(!showTagsDropdown)}
                        className="w-7 h-7 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                        title="Adicionar tag"
                      >
                        <span className="text-lg font-bold">+</span>
                      </button>

                      {/* Dropdown de Tags */}
                      {showTagsDropdown && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowTagsDropdown(false)}
                          />
                          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20 min-w-40 max-h-48 overflow-y-auto">
                            {availableTags
                              .filter(tag => !contactTags.includes(tag))
                              .map((tag, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleAddTag(tag)}
                                  className="w-full px-3 py-2 text-left text-sm text-gray-900 dark:text-white hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                                >
                                  {tag}
                                </button>
                              ))}
                            {availableTags.filter(tag => !contactTags.includes(tag)).length === 0 && (
                              <p className="px-3 py-2 text-xs text-gray-600 dark:text-gray-600 italic">
                                Todas as tags já foram adicionadas
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Atribuição */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-xs font-bold text-gray-600 dark:text-gray-600 uppercase mb-3">Atribuição</h3>

              <div className="space-y-2">
                {contactInfo.atribuidoPara ? (
                  <button
                    onClick={handleUnassign}
                    className="w-full px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
                  >
                    Desatribuir
                  </button>
                ) : (
                  <button
                    onClick={handleAssignToMe}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Atribuir a mim
                  </button>
                )}

                {/* Dropdown de Atendentes */}
                <div className="relative">
                  <button
                    onClick={() => setShowAttendantDropdown(!showAttendantDropdown)}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-between"
                  >
                    <span>Transferir para</span>
                    <FaChevronDown className="text-xs" />
                  </button>

                  {showAttendantDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowAttendantDropdown(false)} />
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20 max-h-48 overflow-y-auto">
                        {attendants.map((attendant) => (
                          <button
                            key={attendant.id}
                            onClick={() => handleTransferToAttendant(attendant.id)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            {attendant.nome}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            </>
            ) : (
              /* TAB: Notas/Observações */
              <>
                <div>
                  <h3 className="text-xs font-bold text-gray-600 dark:text-gray-600 uppercase mb-3">Observações dos Atendentes</h3>

                  {/* Input para nova nota ou edição */}
                  <div className="mb-4">
                    <textarea
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Adicionar observação..."
                      rows="4"
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />

                    {editingNote ? (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={handleUpdateNote}
                          className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={handleCancelEditNote}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleAddNote}
                        disabled={!noteInput.trim()}
                        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:dark:bg-gray-700 text-white disabled:text-gray-600 rounded-lg transition-colors text-sm font-medium mt-2 disabled:cursor-not-allowed"
                      >
                        Adicionar Nota
                      </button>
                    )}
                  </div>

                  {/* Lista de Notas */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Histórico ({notes.length})
                    </h4>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {notes.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <FaEdit className="text-2xl text-gray-600" />
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-600">
                            Nenhuma observação ainda
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-600 mt-1">
                            Adicione notas sobre este atendimento
                          </p>
                        </div>
                      ) : (
                        notes.map((note) => (
                          <div key={note.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                            <p className="text-sm text-gray-900 dark:text-white mb-2 whitespace-pre-wrap">{note.text}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600 dark:text-gray-600">{note.date}</span>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleEditNote(note.id)}
                                  className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:underline"
                                >
                                  <FaEdit className="text-xs" />
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDeleteNote(note.id)}
                                  className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 hover:underline"
                                >
                                  <FaTrash className="text-xs" />
                                  Excluir
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal Atalhos/Respostas Rápidas */}
      {showShortcutsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full border-2 border-gray-200 dark:border-gray-800 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaBolt className="text-purple-600 dark:text-purple-400" />
                  Atalhos e Respostas Rápidas
                </h2>
                <button
                  onClick={() => {
                    setShowShortcutsModal(false);
                    setShortcutsSearch('');
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  aria-label="Fechar"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Busca */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar atalhos..."
                  value={shortcutsSearch}
                  onChange={(e) => setShortcutsSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Lista de Atalhos */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredShortcuts.length === 0 ? (
                <div className="text-center py-12">
                  <FaBolt className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-400 dark:text-gray-500 font-medium">Nenhum atalho encontrado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredShortcuts.map((shortcut) => (
                    <div
                      key={shortcut.id}
                      className="group bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:border-purple-300 dark:hover:border-purple-700 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold rounded">
                              /{shortcut.shortcut}
                            </span>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                              {shortcut.title}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {shortcut.content}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopyShortcut(shortcut)}
                          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                            copiedShortcut === shortcut.id
                              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                              : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                          }`}
                        >
                          {copiedShortcut === shortcut.id ? (
                            <>
                              <FaCheck className="w-3 h-3" />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <FaCopy className="w-3 h-3" />
                              Copiar
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-purple-50/50 dark:bg-purple-900/20">
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <FaBolt className="text-purple-600 dark:text-purple-400" />
                <p>
                  <strong className="text-gray-900 dark:text-white">Dica:</strong> Clique em "Copiar" para copiar o texto do atalho para a área de transferência.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Player de Áudio Escondido */}
      <audio
        ref={audioRef}
        onEnded={() => setPlayingAudio(null)}
        className="hidden"
      />

      {/* Modal de Imagem */}
      {showImageModal && selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowImageModal(false);
            setSelectedImage(null);
          }}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <button
              onClick={() => {
                setShowImageModal(false);
                setSelectedImage(null);
              }}
              className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300 transition-colors"
              aria-label="Fechar"
            >
              <FaTimes className="text-2xl" />
            </button>
            <img
              src={selectedImage}
              alt="Imagem ampliada"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;
