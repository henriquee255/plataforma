// TODO: Implementar importação de CSV/Excel
// TODO: Adicionar exportação em múltiplos formatos
// TODO: Implementar deduplicação automática de contatos
// TODO: Adicionar validação de dados (CPF, email, telefone)
// TODO: Implementar segmentação avançada
// TODO: Adicionar histórico de interações
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from './contexts/ToastContext';
import { useConfirm } from './hooks/useConfirm';
import { useSubscription } from './contexts/SubscriptionContext';
import ConfirmDialog from './components/ConfirmDialog';
import {
  FaSearch,
  FaChevronDown,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSortAmountDown,
  FaSortAmountUp,
  FaUserPlus,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaIdCard,
  FaTag,
  FaComments,
  FaFilter,
  FaFileExport,
  FaFileImport,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaEllipsisV,
  FaGlobe,
  FaLayerGroup,
  FaCopy,
  FaCheck
} from 'react-icons/fa';

const Contacts = ({ onNavigate = () => {} }) => {
  const toast = useToast();
  const { confirmState, confirm, closeConfirm } = useConfirm();
  const { currentCompany } = useSubscription();
  const fileInputRef = useRef(null);

  // Filtrar contatos por empresa atual
  const companyId = currentCompany?._id;

  // Estados principais
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showSidebar, setShowSidebar] = useState(false);

  // Estados de filtros
  const [filterTag, setFilterTag] = useState('todas');
  const [filterOrigin, setFilterOrigin] = useState('todas');
  const [filterAssigned, setFilterAssigned] = useState('todos');
  const [showFilterDropdown, setShowFilterDropdown] = useState(null);

  // Estados de edição
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editedContactInfo, setEditedContactInfo] = useState({
    nome: '',
    telefone: '',
    email: '',
    documento: '',
    origem: ''
  });

  // Estados de tags
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [contactTags, setContactTags] = useState([]);

  // Estados de notas
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState('');
  const [editingNote, setEditingNote] = useState(null);

  // Estados de contatos (mutável)
  const [contactsData, setContactsData] = useState([]);

  // Estados para enviar para CRM
  const [showSendToCRMModal, setShowSendToCRMModal] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState('pipeline-principal');
  const [selectedStage, setSelectedStage] = useState('prospeccao');

  // Estados para criar novo contato
  const [showCreateContactModal, setShowCreateContactModal] = useState(false);
  const [newContactData, setNewContactData] = useState({
    nome: '',
    telefone: '',
    email: '',
    documento: '',
    origem: 'Site - Chat ao vivo',
    tags: [],
    atribuidoPara: null
  });

  // Fechar modais e dropdowns com Esc (WCAG 2.1 AA)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (showSendToCRMModal) {
          setShowSendToCRMModal(false);
        }
        if (showCreateContactModal) {
          setShowCreateContactModal(false);
        }
        setShowFilterDropdown(null);
        setShowTagsDropdown(false);
        setShowSidebar(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showSendToCRMModal, showCreateContactModal]);

  // Tags disponíveis
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

  // Origens disponíveis
  const availableOrigins = [
    'Site - Chat ao vivo',
    'WhatsApp',
    'Instagram',
    'Facebook',
    'Telefone',
    'Email',
    'Indicação',
    'Outros'
  ];

  // Atendentes disponíveis
  const attendants = [
    { id: 1, nome: 'Maria Santos' },
    { id: 2, nome: 'Carlos Mendes' },
    { id: 3, nome: 'Ana Paula' },
    { id: 4, nome: 'João Costa' }
  ];

  // Pipelines disponíveis (simulado - em produção viria do CRM)
  const pipelines = [
    { id: 'pipeline-principal', nome: 'Pipeline Principal' },
    { id: 'pipeline-vendas', nome: 'Pipeline de Vendas' },
    { id: 'pipeline-suporte', nome: 'Pipeline de Suporte' }
  ];

  // Estágios do funil
  const stages = [
    { id: 'prospeccao', nome: 'Prospecção' },
    { id: 'qualificacao', nome: 'Qualificação' },
    { id: 'proposta', nome: 'Proposta' },
    { id: 'negociacao', nome: 'Negociação' },
    { id: 'fechamento', nome: 'Fechamento' }
  ];

  // Inicializar dados de contatos
  useEffect(() => {
    setContactsData([
      {
        id: 1,
        nome: 'João Silva',
        avatar: 'JS',
        telefone: '+55 (11) 98765-4321',
        email: 'joao.silva@email.com',
        documento: '123.456.789-00',
        origem: 'Site - Chat ao vivo',
        tags: ['VIP', 'Urgente'],
        atribuidoPara: 'Você',
        status: 'ativo',
        ultimaInteracao: '2024-02-23 10:30',
        timestampValue: 1030
      },
      {
        id: 2,
        nome: 'Maria Santos',
        avatar: 'MS',
        telefone: '+55 (11) 98765-4322',
        email: 'maria.santos@email.com',
        documento: '234.567.890-11',
        origem: 'WhatsApp',
        tags: ['Cliente Novo'],
        atribuidoPara: 'Você',
        status: 'ativo',
        ultimaInteracao: '2024-02-22 15:45',
        timestampValue: 945
      },
      {
        id: 3,
        nome: 'Pedro Costa',
        avatar: 'PC',
        telefone: '+55 (11) 98765-4323',
        email: 'pedro.costa@email.com',
        documento: '345.678.901-22',
        origem: 'Instagram',
        tags: ['Follow-up', 'Vendas'],
        atribuidoPara: null,
        status: 'inativo',
        ultimaInteracao: '2024-02-21 09:15',
        timestampValue: 100
      },
      {
        id: 4,
        nome: 'Ana Paula',
        avatar: 'AP',
        telefone: '+55 (11) 98765-4324',
        email: 'ana.paula@email.com',
        documento: '456.789.012-33',
        origem: 'Facebook',
        tags: ['Recorrente', 'VIP'],
        atribuidoPara: 'Maria Santos',
        status: 'ativo',
        ultimaInteracao: '2024-02-20 14:20',
        timestampValue: 95
      },
      {
        id: 5,
        nome: 'Carlos Eduardo',
        avatar: 'CE',
        telefone: '+55 (11) 98765-4325',
        email: 'carlos.eduardo@email.com',
        documento: '567.890.123-44',
        origem: 'Telefone',
        tags: ['Suporte'],
        atribuidoPara: null,
        status: 'ativo',
        ultimaInteracao: '2024-02-18 11:30',
        timestampValue: 50
      },
      {
        id: 6,
        nome: 'Juliana Souza',
        avatar: 'JS',
        telefone: '+55 (11) 98765-4326',
        email: 'juliana.souza@email.com',
        documento: '678.901.234-55',
        origem: 'Email',
        tags: ['Importante'],
        atribuidoPara: 'Você',
        status: 'ativo',
        ultimaInteracao: '2024-02-17 16:00',
        timestampValue: 40
      },
      {
        id: 7,
        nome: 'Roberto Alves',
        avatar: 'RA',
        telefone: '+55 (11) 98765-4327',
        email: 'roberto.alves@email.com',
        documento: '789.012.345-66',
        origem: 'Indicação',
        tags: ['Cliente Novo', 'Vendas'],
        atribuidoPara: 'Carlos Mendes',
        status: 'inativo',
        ultimaInteracao: '2024-02-16 13:45',
        timestampValue: 30
      },
      {
        id: 8,
        nome: 'Fernanda Lima',
        avatar: 'FL',
        telefone: '+55 (11) 98765-4328',
        email: 'fernanda.lima@email.com',
        documento: '890.123.456-77',
        origem: 'Site - Chat ao vivo',
        tags: ['VIP', 'Recorrente'],
        atribuidoPara: 'Você',
        status: 'ativo',
        ultimaInteracao: '2024-02-15 10:10',
        timestampValue: 20
      }
    ]);
  }, []);

  // Filtrar por busca
  const filteredBySearch = contactsData.filter(contact =>
    contact.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.telefone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar por tag
  const filteredByTag = filteredBySearch.filter(contact => {
    if (filterTag === 'todas') return true;
    return contact.tags.includes(filterTag);
  });

  // Filtrar por origem
  const filteredByOrigin = filteredByTag.filter(contact => {
    if (filterOrigin === 'todas') return true;
    return contact.origem === filterOrigin;
  });

  // Filtrar por atribuição
  const filteredByAssigned = filteredByOrigin.filter(contact => {
    if (filterAssigned === 'todos') return true;
    if (filterAssigned === 'meus') return contact.atribuidoPara === 'Você';
    if (filterAssigned === 'nao-atribuidos') return contact.atribuidoPara === null;
    return true;
  });

  // Ordenar
  const sortedContacts = [...filteredByAssigned].sort((a, b) => {
    if (sortOrder === 'desc') {
      return b.timestampValue - a.timestampValue;
    } else {
      return a.timestampValue - b.timestampValue;
    }
  });

  // Funções de manipulação
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setContactTags(contact.tags || []);
    setNotes([]);
    setIsEditingContact(false);
    setShowSidebar(true);
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
    setSelectedContact(null);
    setIsEditingContact(false);
  };

  const handleStartEditContact = () => {
    if (!selectedContact) return;

    setEditedContactInfo({
      nome: selectedContact.nome,
      telefone: selectedContact.telefone,
      email: selectedContact.email,
      documento: selectedContact.documento,
      origem: selectedContact.origem || ''
    });
    setIsEditingContact(true);
  };

  const handleSaveContactEdit = () => {
    if (!selectedContact) return;

    setContactsData(prevContacts =>
      prevContacts.map(contact =>
        contact.id === selectedContact.id
          ? {
              ...contact,
              nome: editedContactInfo.nome,
              telefone: editedContactInfo.telefone,
              email: editedContactInfo.email,
              documento: editedContactInfo.documento,
              origem: editedContactInfo.origem,
              tags: contactTags
            }
          : contact
      )
    );

    // Atualizar contato selecionado
    setSelectedContact({
      ...selectedContact,
      nome: editedContactInfo.nome,
      telefone: editedContactInfo.telefone,
      email: editedContactInfo.email,
      documento: editedContactInfo.documento,
      origem: editedContactInfo.origem,
      tags: contactTags
    });

    setIsEditingContact(false);
    console.log('Informações do contato salvas:', editedContactInfo);
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

  // Funções de tags
  const handleAddTag = (tag) => {
    if (!contactTags.includes(tag)) {
      setContactTags([...contactTags, tag]);
    }
    setShowTagsDropdown(false);
  };

  const handleRemoveTag = (tagToRemove) => {
    setContactTags(contactTags.filter(tag => tag !== tagToRemove));
  };

  // Funções de notas
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

  // Função para iniciar conversa
  const handleStartConversation = () => {
    if (!selectedContact) return;

    console.log('Iniciando conversa com:', selectedContact.nome);
    // Navegar para Inbox com o contato selecionado
    onNavigate('inbox', { chatId: selectedContact.id });
  };

  // Função para atribuir contato
  const handleAssignToMe = () => {
    if (!selectedContact) return;

    setContactsData(prevContacts =>
      prevContacts.map(contact =>
        contact.id === selectedContact.id
          ? { ...contact, atribuidoPara: 'Você' }
          : contact
      )
    );

    setSelectedContact({ ...selectedContact, atribuidoPara: 'Você' });
    console.log('Contato atribuído para mim');
  };

  const handleUnassign = () => {
    if (!selectedContact) return;

    setContactsData(prevContacts =>
      prevContacts.map(contact =>
        contact.id === selectedContact.id
          ? { ...contact, atribuidoPara: null }
          : contact
      )
    );

    setSelectedContact({ ...selectedContact, atribuidoPara: null });
    console.log('Contato desatribuído');
  };

  const handleTransferToAttendant = (attendantId) => {
    if (!selectedContact) return;

    const attendant = attendants.find(a => a.id === attendantId);
    if (attendant) {
      setContactsData(prevContacts =>
        prevContacts.map(contact =>
          contact.id === selectedContact.id
            ? { ...contact, atribuidoPara: attendant.nome }
            : contact
        )
      );

      setSelectedContact({ ...selectedContact, atribuidoPara: attendant.nome });
      console.log('Contato transferido para:', attendant.nome);
    }
    setShowFilterDropdown(null);
  };

  // Função para criar novo contato
  const handleCreateContact = () => {
    setNewContactData({
      nome: '',
      telefone: '',
      email: '',
      documento: '',
      origem: 'Site - Chat ao vivo',
      tags: [],
      atribuidoPara: null
    });
    setShowCreateContactModal(true);
  };

  // Função para salvar novo contato
  const handleSaveNewContact = () => {
    // Validações
    if (!newContactData.nome.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }
    if (!newContactData.telefone.trim()) {
      toast.error('Telefone é obrigatório');
      return;
    }

    // Criar avatar com iniciais
    const palavras = newContactData.nome.trim().split(' ');
    const avatar = palavras.length >= 2
      ? `${palavras[0][0]}${palavras[1][0]}`.toUpperCase()
      : `${palavras[0][0]}${palavras[0][1] || ''}`.toUpperCase();

    // Criar novo contato
    const novoContato = {
      id: Math.max(...contactsData.map(c => c.id), 0) + 1,
      nome: newContactData.nome.trim(),
      avatar,
      telefone: newContactData.telefone.trim(),
      email: newContactData.email.trim() || '',
      documento: newContactData.documento.trim() || '',
      origem: newContactData.origem,
      tags: newContactData.tags,
      atribuidoPara: newContactData.atribuidoPara,
      status: 'ativo',
      ultimaInteracao: new Date().toISOString(),
      timestampValue: Date.now()
    };

    // Adicionar ao array
    setContactsData([novoContato, ...contactsData]);

    // Fechar modal e mostrar toast
    setShowCreateContactModal(false);
    toast.success(`Contato ${novoContato.nome} criado com sucesso!`);
  };

  // Função para exportar contatos
  const handleExportContacts = () => {
    try {
      if (contactsData.length === 0) {
        toast.warning('Nenhum contato para exportar');
        return;
      }

      // Preparar dados para CSV
      const headers = ['Nome', 'Telefone', 'Email', 'Documento', 'Origem', 'Tags', 'Observações'];
      const csvData = contactsData.map(contact => [
        contact.nome || '',
        contact.telefone || '',
        contact.email || '',
        contact.documento || '',
        contact.origem || '',
        (contact.tags || []).join('; '),
        (contact.observacoes || '').replace(/\n/g, ' ')
      ]);

      // Criar conteúdo CSV
      const csvContent = [
        headers.join(','),
        ...csvData.map(row =>
          row.map(cell => {
            // Escapar células com vírgulas ou aspas
            const cellStr = String(cell);
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          }).join(',')
        )
      ].join('\n');

      // Download do arquivo
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      const fileName = `contatos_${new Date().toISOString().split('T')[0]}.csv`;

      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`${contactsData.length} contatos exportados com sucesso!`);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast.error('Erro ao exportar contatos');
    }
  };

  // Função para importar contatos
  const handleImportContacts = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Por favor, selecione um arquivo CSV');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        const lines = text.split('\n').filter(line => line.trim());

        if (lines.length < 2) {
          toast.error('Arquivo CSV vazio ou inválido');
          return;
        }

        // Ignorar cabeçalho
        const dataLines = lines.slice(1);
        const imported = [];

        dataLines.forEach((line, index) => {
          const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));

          if (values.length >= 3 && values[0]) { // Precisa pelo menos nome, telefone, email
            imported.push({
              id: Date.now() + index,
              nome: values[0] || '',
              telefone: values[1] || '',
              email: values[2] || '',
              documento: values[3] || '',
              origem: values[4] || 'Importado',
              tags: values[5] ? values[5].split(';').map(t => t.trim()).filter(t => t) : [],
              observacoes: values[6] || '',
              ultimoContato: new Date().toISOString().split('T')[0],
              atribuidoPara: null
            });
          }
        });

        if (imported.length === 0) {
          toast.warning('Nenhum contato válido encontrado no CSV');
          return;
        }

        setContactsData(prev => [...imported, ...prev]);
        toast.success(`${imported.length} contatos importados com sucesso!`);

        // Limpar input
        event.target.value = '';
      } catch (error) {
        console.error('Erro ao importar:', error);
        toast.error('Erro ao processar arquivo CSV');
      }
    };

    reader.onerror = () => {
      toast.error('Erro ao ler arquivo');
    };

    reader.readAsText(file, 'UTF-8');
  };

  // Função para excluir contato
  const handleDeleteContact = async () => {
    if (!selectedContact) return;

    const confirmed = await confirm({
      title: 'Excluir contato',
      message: `Tem certeza que deseja excluir o contato "${selectedContact.nome}"?`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger'
    });

    if (confirmed) {
      setContactsData(prevContacts =>
        prevContacts.filter(contact => contact.id !== selectedContact.id)
      );
      setSelectedContact(null);
      setShowSidebar(false);
      toast.success('Contato excluído com sucesso!');
    }
  };

  // Função para enviar contato para CRM
  const handleSendToCRM = () => {
    if (!selectedContact) return;

    const pipelineName = pipelines.find(p => p.id === selectedPipeline)?.nome || selectedPipeline;
    const stageName = stages.find(s => s.id === selectedStage)?.nome || selectedStage;

    console.log('Enviando contato para CRM:', {
      contato: selectedContact,
      pipeline: pipelineName,
      estagio: stageName
    });

    toast.success(`Contato "${selectedContact.nome}" enviado para ${pipelineName} - ${stageName}!`);

    setShowSendToCRMModal(false);
    setSelectedPipeline('pipeline-principal');
    setSelectedStage('prospeccao');
  };

  // Badge de tag
  const getTagColor = (tag) => {
    const colors = {
      'VIP': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      'Urgente': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      'Importante': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
      'Cliente Novo': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      'Recorrente': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      'Promoção': 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
      'Suporte': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      'Vendas': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
      'Cancelamento': 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
      'Follow-up': 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
    };
    return colors[tag] || 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
  };

  return (
    <>
    {/* Hidden file input for CSV import */}
    <input
      ref={fileInputRef}
      type="file"
      accept=".csv"
      onChange={handleFileUpload}
      style={{ display: 'none' }}
    />

    <div className="flex flex-col bg-white dark:bg-gray-950 p-8">
      {/* Header com Título e Ações */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contatos</h1>

          <div className="flex items-center gap-2">
            <button
              onClick={handleImportContacts}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium"
              title="Importar contatos"
            >
              <FaFileImport />
              Importar
            </button>
            <button
              onClick={handleExportContacts}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium"
              title="Exportar contatos"
            >
              <FaFileExport />
              Exportar
            </button>
            <button
              onClick={handleCreateContact}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
              title="Novo contato"
            >
              <FaUserPlus />
              Novo Contato
            </button>
          </div>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm" aria-hidden="true" />
            <input
              type="text"
              placeholder="Buscar por nome, telefone, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Buscar contatos por nome, telefone ou email"
            />
          </div>

          {/* Filtro por Tag */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(showFilterDropdown === 'tag' ? null : 'tag')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <FaTag className="text-xs" />
              {filterTag === 'todas' ? 'Tags' : filterTag}
              <FaChevronDown className="text-xs" />
            </button>

            {showFilterDropdown === 'tag' && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(null)} />
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden max-h-80 overflow-y-auto">
                  <button
                    onClick={() => { setFilterTag('todas'); setShowFilterDropdown(null); }}
                    className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${filterTag === 'todas' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    Todas Tags
                  </button>
                  {availableTags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => { setFilterTag(tag); setShowFilterDropdown(null); }}
                      className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${filterTag === tag ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Filtro por Origem */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(showFilterDropdown === 'origin' ? null : 'origin')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <FaMapMarkerAlt className="text-xs" />
              {filterOrigin === 'todas' ? 'Origem' : filterOrigin.split(' - ')[0]}
              <FaChevronDown className="text-xs" />
            </button>

            {showFilterDropdown === 'origin' && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(null)} />
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden max-h-80 overflow-y-auto">
                  <button
                    onClick={() => { setFilterOrigin('todas'); setShowFilterDropdown(null); }}
                    className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${filterOrigin === 'todas' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    Todas Origens
                  </button>
                  {availableOrigins.map((origin, index) => (
                    <button
                      key={index}
                      onClick={() => { setFilterOrigin(origin); setShowFilterDropdown(null); }}
                      className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${filterOrigin === origin ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                      {origin}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Filtro por Atribuição */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(showFilterDropdown === 'assigned' ? null : 'assigned')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <FaUser className="text-xs" />
              {filterAssigned === 'todos' ? 'Atribuição' : filterAssigned === 'meus' ? 'Meus' : 'Não atribuídos'}
              <FaChevronDown className="text-xs" />
            </button>

            {showFilterDropdown === 'assigned' && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(null)} />
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden">
                  <button
                    onClick={() => { setFilterAssigned('todos'); setShowFilterDropdown(null); }}
                    className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${filterAssigned === 'todos' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => { setFilterAssigned('meus'); setShowFilterDropdown(null); }}
                    className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${filterAssigned === 'meus' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    Meus
                  </button>
                  <button
                    onClick={() => { setFilterAssigned('nao-atribuidos'); setShowFilterDropdown(null); }}
                    className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${filterAssigned === 'nao-atribuidos' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    Não atribuídos
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Botão de Ordenação */}
          <button
            onClick={toggleSortOrder}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title={sortOrder === 'desc' ? 'Mais recentes primeiro' : 'Mais antigos primeiro'}
          >
            {sortOrder === 'desc' ? (
              <FaSortAmountDown className="text-gray-600 dark:text-gray-600" />
            ) : (
              <FaSortAmountUp className="text-gray-600 dark:text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Área Principal - Tabela de Contatos */}
      <div className={`flex-1 overflow-hidden ${showSidebar ? 'flex' : ''}`}>
        {/* Tabela de Contatos */}
        <div className={`${showSidebar ? 'flex-1' : 'w-full'} flex flex-col overflow-hidden`}>
          <div className="flex-1 overflow-y-auto">
            {sortedContacts.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <FaUser className="text-3xl text-gray-600" />
                </div>
                <p className="text-base text-gray-600 dark:text-gray-600 font-medium">Nenhum contato encontrado</p>
                <p className="text-sm text-gray-600 dark:text-gray-600 mt-2">Tente ajustar os filtros ou a busca</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-600 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-600 uppercase tracking-wider">
                      Telefone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-600 uppercase tracking-wider">
                      Email/Documento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-600 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-600 uppercase tracking-wider">
                      Atribuído
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-600 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-800">
                  {sortedContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      onClick={() => handleSelectContact(contact)}
                      className={`cursor-pointer transition-all hover:bg-purple-50/50 dark:hover:bg-purple-950/20 ${
                        selectedContact?.id === contact.id ? 'bg-purple-50 dark:bg-purple-950/30' : ''
                      }`}
                    >
                      {/* Contato (Avatar + Nome) */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                            {contact.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {contact.nome}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-600 truncate">
                              {contact.origem}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Telefone */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                          <FaPhone className="text-xs text-gray-600" />
                          {contact.telefone}
                        </div>
                      </td>

                      {/* Email/Documento */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 max-w-xs">
                          <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                            <FaEnvelope className="text-xs text-gray-600 flex-shrink-0" />
                            <span className="truncate">{contact.email}</span>
                          </div>
                          {contact.documento && (
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-600">
                              <FaIdCard className="text-xs flex-shrink-0" />
                              <span>{contact.documento}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Tags */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className={`inline-block px-2 py-1 text-xs font-semibold rounded-md ${getTagColor(tag)}`}
                            >
                              {tag}
                            </span>
                          ))}
                          {contact.tags.length > 2 && (
                            <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-600 text-xs font-semibold rounded-md">
                              +{contact.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {contact.status === 'ativo' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                            <FaCheckCircle className="text-xs" />
                            Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-600 text-xs font-semibold rounded-full">
                            <FaTimesCircle className="text-xs" />
                            Inativo
                          </span>
                        )}
                      </td>

                      {/* Atribuído */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {contact.atribuidoPara ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold rounded-full">
                            <FaUser className="text-xs" />
                            {contact.atribuidoPara}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-600 dark:text-gray-600 italic">
                            Não atribuído
                          </span>
                        )}
                      </td>

                      {/* Ações */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectContact(contact);
                          }}
                          className="inline-flex items-center justify-center p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <FaEllipsisV className="text-sm" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Sidebar Direita - Detalhes do Contato */}
        {showSidebar && selectedContact && (
          <div className="w-96 border-l border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-gray-950">
            {/* Header do Sidebar */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Detalhes do Contato</h2>
                <button
                  onClick={handleCloseSidebar}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                  title="Fechar"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-600" />
                </button>
              </div>

              {/* Avatar e Nome */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {selectedContact.avatar}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {selectedContact.nome}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-600">
                    Última interação: {selectedContact.ultimaInteracao}
                  </p>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={handleStartConversation}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  <FaComments />
                  Conversar
                </button>
                <button
                  onClick={() => setShowSendToCRMModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
                  title="Enviar para CRM"
                >
                  <FaUser />
                  Enviar CRM
                </button>
              </div>
              <div className="flex gap-2">
                {!isEditingContact ? (
                  <button
                    onClick={handleStartEditContact}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <FaEdit className="text-purple-600 dark:text-purple-400" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSaveContactEdit}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium text-sm"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={handleCancelContactEdit}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium text-sm"
                    >
                      Cancelar
                    </button>
                  </>
                )}
                <button
                  onClick={handleDeleteContact}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <FaTrash className="text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>

            {/* Conteúdo do Sidebar - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Informações Pessoais */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Informações Pessoais</h4>
                <div className="space-y-3">
                  {/* Nome */}
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-600 block mb-1 font-medium">Nome Completo</label>
                    {isEditingContact ? (
                      <input
                        type="text"
                        value={editedContactInfo.nome}
                        onChange={(e) => setEditedContactInfo({ ...editedContactInfo, nome: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedContact.nome}</p>
                    )}
                  </div>

                  {/* Telefone */}
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-600 block mb-1 font-medium">
                      <FaPhone className="inline mr-1" />
                      Telefone
                    </label>
                    {isEditingContact ? (
                      <input
                        type="text"
                        value={editedContactInfo.telefone}
                        onChange={(e) => setEditedContactInfo({ ...editedContactInfo, telefone: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedContact.telefone}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-600 block mb-1 font-medium">
                      <FaEnvelope className="inline mr-1" />
                      Email
                    </label>
                    {isEditingContact ? (
                      <input
                        type="email"
                        value={editedContactInfo.email}
                        onChange={(e) => setEditedContactInfo({ ...editedContactInfo, email: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900 dark:text-white break-all">{selectedContact.email}</p>
                    )}
                  </div>

                  {/* Documento */}
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-600 block mb-1 font-medium">
                      <FaIdCard className="inline mr-1" />
                      Documento (CPF/CNPJ)
                    </label>
                    {isEditingContact ? (
                      <input
                        type="text"
                        value={editedContactInfo.documento}
                        onChange={(e) => setEditedContactInfo({ ...editedContactInfo, documento: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedContact.documento}</p>
                    )}
                  </div>

                  {/* Origem */}
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-600 block mb-1 font-medium">
                      <FaMapMarkerAlt className="inline mr-1" />
                      Origem do Contato
                    </label>
                    {isEditingContact ? (
                      <select
                        value={editedContactInfo.origem}
                        onChange={(e) => setEditedContactInfo({ ...editedContactInfo, origem: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Selecione a origem</option>
                        {availableOrigins.map((origin, index) => (
                          <option key={index} value={origin}>{origin}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedContact.origem || <span className="text-gray-600 dark:text-gray-600 italic">Não informado</span>}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {contactTags.map((tag, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg ${getTagColor(tag)}`}
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:opacity-70 transition-opacity"
                        title="Remover tag"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </span>
                  ))}

                  {/* Botão para adicionar tag */}
                  <div className="relative">
                    <button
                      onClick={() => setShowTagsDropdown(!showTagsDropdown)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-xs font-semibold"
                      title="Adicionar tag"
                    >
                      <span className="text-sm font-bold">+</span>
                      Tag
                    </button>

                    {/* Dropdown de Tags */}
                    {showTagsDropdown && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowTagsDropdown(false)}
                        />
                        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20 min-w-48 max-h-64 overflow-y-auto">
                          {availableTags
                            .filter(tag => !contactTags.includes(tag))
                            .map((tag, index) => (
                              <button
                                key={index}
                                onClick={() => handleAddTag(tag)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-white hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                              >
                                {tag}
                              </button>
                            ))}
                          {availableTags.filter(tag => !contactTags.includes(tag)).length === 0 && (
                            <p className="px-4 py-2 text-xs text-gray-600 dark:text-gray-600 italic">
                              Todas as tags já foram adicionadas
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Atribuição */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Atribuição</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-600">
                    Atribuído para:
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedContact.atribuidoPara || <span className="text-gray-600 dark:text-gray-600 italic">Não atribuído</span>}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {selectedContact.atribuidoPara ? (
                      <button
                        onClick={handleUnassign}
                        className="flex-1 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
                      >
                        Desatribuir
                      </button>
                    ) : (
                      <button
                        onClick={handleAssignToMe}
                        className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        Atribuir a mim
                      </button>
                    )}

                    {/* Dropdown de Atendentes */}
                    <div className="relative">
                      <button
                        onClick={() => setShowFilterDropdown(showFilterDropdown === 'attendant' ? null : 'attendant')}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        Transferir
                        <FaChevronDown className="text-xs" />
                      </button>

                      {showFilterDropdown === 'attendant' && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(null)} />
                          <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20 min-w-48 max-h-64 overflow-y-auto">
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
              </div>

              {/* Notas */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Observações dos Atendentes</h4>

                {/* Input para nova nota ou edição */}
                <div className="mb-4">
                  <textarea
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Adicionar observação sobre este contato..."
                    rows="3"
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
                  {notes.length === 0 ? (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <FaEdit className="text-xl text-gray-600" />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-600">
                        Nenhuma observação ainda
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
                              className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium"
                            >
                              <FaEdit className="text-xs" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 hover:underline font-medium"
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
          </div>
        )}
      </div>
    </div>

    {/* Modal Enviar para CRM */}
    {showSendToCRMModal && selectedContact && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full border-2 border-gray-200 dark:border-gray-800">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FaUser className="text-blue-600 dark:text-blue-400" />
                Enviar para CRM
              </h2>
              <button
                onClick={() => {
                  setShowSendToCRMModal(false);
                  setSelectedPipeline('pipeline-principal');
                  setSelectedStage('prospeccao');
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-600 dark:text-gray-600" />
              </button>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-6 space-y-4">
            {/* Informações do Contato */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {selectedContact.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {selectedContact.nome}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-600">
                    {selectedContact.telefone}
                  </p>
                </div>
              </div>
            </div>

            {/* Selecionar Pipeline */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Selecione a Pipeline
              </label>
              <select
                value={selectedPipeline}
                onChange={(e) => setSelectedPipeline(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {pipelines.map((pipeline) => (
                  <option key={pipeline.id} value={pipeline.id}>
                    {pipeline.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Selecionar Estágio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Selecione o Estágio do Funil
              </label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSendToCRM}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Enviar para CRM
              </button>
              <button
                onClick={() => {
                  setShowSendToCRMModal(false);
                  setSelectedPipeline('pipeline-principal');
                  setSelectedStage('prospeccao');
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

    {/* Modal de Criar Novo Contato */}
    {showCreateContactModal && (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <FaUserPlus className="text-purple-500" />
                Criar Novo Contato
              </h2>
              <button
                onClick={() => setShowCreateContactModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Fechar modal"
              >
                <FaTimes className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Formulário */}
            <div className="space-y-4">
              {/* Nome (obrigatório) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newContactData.nome}
                  onChange={(e) => setNewContactData({ ...newContactData, nome: e.target.value })}
                  placeholder="Ex: João Silva"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                  autoFocus
                />
              </div>

              {/* Telefone (obrigatório) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Telefone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newContactData.telefone}
                  onChange={(e) => setNewContactData({ ...newContactData, telefone: e.target.value })}
                  placeholder="Ex: +55 (11) 98765-4321"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newContactData.email}
                  onChange={(e) => setNewContactData({ ...newContactData, email: e.target.value })}
                  placeholder="Ex: joao@example.com"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                />
              </div>

              {/* Documento (CPF) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CPF/Documento
                </label>
                <input
                  type="text"
                  value={newContactData.documento}
                  onChange={(e) => setNewContactData({ ...newContactData, documento: e.target.value })}
                  placeholder="Ex: 123.456.789-00"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                />
              </div>

              {/* Origem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Origem
                </label>
                <select
                  value={newContactData.origem}
                  onChange={(e) => setNewContactData({ ...newContactData, origem: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                >
                  {availableOrigins.map(origin => (
                    <option key={origin} value={origin}>{origin}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setNewContactData({
                          ...newContactData,
                          tags: newContactData.tags.includes(tag)
                            ? newContactData.tags.filter(t => t !== tag)
                            : [...newContactData.tags, tag]
                        });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        newContactData.tags.includes(tag)
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Atribuir para */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Atribuir para
                </label>
                <select
                  value={newContactData.atribuidoPara || ''}
                  onChange={(e) => setNewContactData({ ...newContactData, atribuidoPara: e.target.value || null })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                >
                  <option value="">Nenhum (aguardando atribuição)</option>
                  <option value="Você">Você</option>
                  {attendants.map(att => (
                    <option key={att.id} value={att.nome}>{att.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
              <button
                onClick={handleSaveNewContact}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <FaCheck className="inline mr-2" />
                Criar Contato
              </button>
              <button
                onClick={() => setShowCreateContactModal(false)}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
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

    </>
  );
};

export default Contacts;
