// TODO: Implementar backend para persistência de dados
// TODO: Adicionar automações de vendas (follow-ups automáticos)
// TODO: Integrar com calendário para agendamentos
// TODO: Implementar relatórios de conversão por funil
// TODO: Adicionar scoring de leads
// TODO: Implementar rotação automática de leads
import React, { useState, useEffect } from 'react';
import { useFocusTrap } from './hooks/useFocusTrap';
import { useToast } from './contexts/ToastContext';
import { useConfirm } from './hooks/useConfirm';
import { useSubscription } from './contexts/SubscriptionContext';
import ConfirmDialog from './components/ConfirmDialog';
import {
  FaSearch,
  FaPlus,
  FaTimes,
  FaEdit,
  FaTrash,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaBuilding,
  FaDollarSign,
  FaCalendarAlt,
  FaTag,
  FaChevronDown,
  FaChevronRight,
  FaFilter,
  FaStickyNote,
  FaHistory,
  FaUserTie,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaArrowRight,
  FaGripVertical,
  FaExclamationTriangle,
  FaComments,
  FaMapMarkerAlt,
  FaEllipsisV
} from 'react-icons/fa';

const CRM = () => {
  const toast = useToast();
  const { confirmState, confirm, closeConfirm } = useConfirm();
  const { currentCompany } = useSubscription();

  // Filtrar pipelines/leads por empresa atual
  const companyId = currentCompany?._id;

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterAssignee, setFilterAssignee] = useState('todos');
  const [filterOrigin, setFilterOrigin] = useState('todos');
  const [filterTag, setFilterTag] = useState('todos');
  const [showFilterDropdown, setShowFilterDropdown] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [draggedLead, setDraggedLead] = useState(null);
  const [editingLead, setEditingLead] = useState(null);
  const [noteInput, setNoteInput] = useState('');
  const [leadNotes, setLeadNotes] = useState({});

  // Novos estados para múltiplas pipelines
  const [pipelines, setPipelines] = useState([]);
  const [activePipelineId, setActivePipelineId] = useState(null);
  const [showPipelineModal, setShowPipelineModal] = useState(false);
  const [showPipelineDropdown, setShowPipelineDropdown] = useState(false);
  const [newPipelineName, setNewPipelineName] = useState('');
  const [cardMenuOpen, setCardMenuOpen] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);
  const [stageMenuOpen, setStageMenuOpen] = useState(null);
  const [showAddStageModal, setShowAddStageModal] = useState(false);
  const [showEditStageModal, setShowEditStageModal] = useState(false);
  const [showEditPipelineModal, setShowEditPipelineModal] = useState(false);
  const [editingStage, setEditingStage] = useState(null);
  const [editingPipeline, setEditingPipeline] = useState(null);
  const [newStageName, setNewStageName] = useState('');
  const [newStageColor, setNewStageColor] = useState('bg-blue-500');
  const [pipelineMenuOpen, setPipelineMenuOpen] = useState(null);

  // Estados para qualificação e follow-up
  const [showQualificationModal, setShowQualificationModal] = useState(false);
  const [showLostReasonModal, setShowLostReasonModal] = useState(false);
  const [showClosedModal, setShowClosedModal] = useState(false);
  const [leadBeingQualified, setLeadBeingQualified] = useState(null);
  const [qualificationData, setQualificationData] = useState({
    necessidade: '',
    prazo: '',
    orcamento: '',
    decisor: false
  });
  const [lostReason, setLostReason] = useState('');
  const [closedData, setClosedData] = useState({
    valorFinal: '',
    formaPagamento: ''
  });

  // Estados para vincular contatos
  const [contactsDropdownOpen, setContactsDropdownOpen] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState([]);

  // Estados para converter contato em lead
  const [showSelectContactModal, setShowSelectContactModal] = useState(false);
  const [targetStageForContact, setTargetStageForContact] = useState(null);
  const [selectedContactsToConvert, setSelectedContactsToConvert] = useState([]);
  const [searchContactTerm, setSearchContactTerm] = useState('');

  // Estados para tamanho dos cards
  const [cardSizes, setCardSizes] = useState({});
  const [expandedStages, setExpandedStages] = useState({});

  // Focus trap para modais (WCAG 2.1 AA)
  const leadModalRef = useFocusTrap(showLeadModal);
  const addLeadModalRef = useFocusTrap(showAddLeadModal);

  // Lista de contatos disponíveis (mockada)
  const contatosDisponiveis = [
  ];

  // Dados mutáveis de leads (obsoleto - agora dentro de pipelines)
  const [leads, setLeads] = useState([]);

  // Formulário novo lead
  const [newLead, setNewLead] = useState({
    nome: '',
    telefone: '',
    email: '',
    valor: '',
    origem: 'Site',
    tags: []
  });

  // Estágios do funil (agora como estado)
  const [stages, setStages] = useState([
    {
      id: 'leads',
      nome: 'LEADS (Entrada)',
      color: 'bg-blue-500',
      description: 'Primeiro contato - responder em 5-15min',
      autoActions: true
    },
    {
      id: 'contato-iniciado',
      nome: 'CONTATO INICIADO',
      color: 'bg-purple-500',
      description: 'Conversa em andamento - entender necessidade',
      requiresFollowup: true
    },
    {
      id: 'qualificado',
      nome: 'QUALIFICADO',
      color: 'bg-cyan-500',
      description: 'Lead validado - preparar proposta',
      requiresQualification: true
    },
    {
      id: 'follow-up',
      nome: 'FOLLOW-UP',
      color: 'bg-amber-500',
      description: 'Proposta enviada - aguardando resposta',
      autoTask: true
    },
    {
      id: 'perdido',
      nome: 'PERDIDO',
      color: 'bg-red-500',
      description: 'Não convertido',
      isClosed: true
    },
    {
      id: 'fechado',
      nome: 'FECHADO',
      color: 'bg-emerald-500',
      description: 'Venda concluída',
      isClosed: true,
      autoActions: true
    }
  ]);

  // Atendentes disponíveis
  const atendentes = [
    { id: 1, nome: 'Maria Santos' },
    { id: 2, nome: 'Carlos Mendes' },
    { id: 3, nome: 'Ana Paula' },
    { id: 4, nome: 'João Costa' }
  ];

  // Origens
  const origens = ['Site', 'WhatsApp', 'Instagram', 'Facebook', 'Indicação', 'LinkedIn', 'Email'];

  // Tags disponíveis
  const availableTags = [
    'VIP',
    'Urgente',
    'Importante',
    'Hot Lead',
    'Cold Lead',
    'Follow-up',
    'Promoção',
    'Recorrente',
    'Alto Valor',
    'Novo'
  ];

  // Fechar menu do card e modais ao pressionar ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        // Fechar modais primeiro (prioridade)
        if (showLeadModal) {
          setShowLeadModal(false);
          return;
        }
        if (showAddLeadModal) {
          setShowAddLeadModal(false);
          return;
        }
        if (showEditModal) {
          setShowEditModal(false);
          return;
        }
        if (showPipelineModal) {
          setShowPipelineModal(false);
          return;
        }
        if (showAddStageModal) {
          setShowAddStageModal(false);
          return;
        }
        if (showEditStageModal) {
          setShowEditStageModal(false);
          return;
        }
        if (showEditPipelineModal) {
          setShowEditPipelineModal(false);
          return;
        }
        if (showQualificationModal) {
          setShowQualificationModal(false);
          return;
        }
        if (showLostReasonModal) {
          setShowLostReasonModal(false);
          return;
        }
        if (showClosedModal) {
          setShowClosedModal(false);
          return;
        }
        if (showSelectContactModal) {
          setShowSelectContactModal(false);
          return;
        }
        // Depois fechar dropdowns/menus
        setCardMenuOpen(null);
        setShowPipelineDropdown(false);
        setContactsDropdownOpen(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showLeadModal, showAddLeadModal, showEditModal, showPipelineModal, showAddStageModal, showEditStageModal, showEditPipelineModal, showQualificationModal, showLostReasonModal, showClosedModal, showSelectContactModal]);

  // Fechar dropdown de contatos ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contactsDropdownOpen && !e.target.closest('.contacts-dropdown-container')) {
        setContactsDropdownOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [contactsDropdownOpen]);

  // Inicializar pipelines VAZIOS (sem localStorage, sem dados mockados)
  useEffect(() => {
    setPipelines([]);
    setActivePipelineId(null);
    setLeads([]);
    setLeadNotes({});
  }, []);

  // Obter pipeline ativa
  const activePipeline = pipelines.find(p => p.id === activePipelineId);
  const currentLeads = activePipeline ? activePipeline.leads : [];

  // Filtrar leads
  const filteredLeads = currentLeads.filter(lead => {
    const matchSearch = lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       lead.telefone.includes(searchTerm) ||
                       lead.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = filterStatus === 'todos' || lead.estagio === filterStatus;
    const matchAssignee = filterAssignee === 'todos' ||
                          (filterAssignee === 'nao-atribuidos' && !lead.atribuidoPara) ||
                          (filterAssignee !== 'nao-atribuidos' && lead.atribuidoPara === parseInt(filterAssignee));
    const matchOrigin = filterOrigin === 'todos' || lead.origem === filterOrigin;
    const matchTag = filterTag === 'todos' || lead.tags.includes(filterTag);

    return matchSearch && matchStatus && matchAssignee && matchOrigin && matchTag;
  });

  // Calcular métricas
  const totalLeads = currentLeads.length;
  const totalValor = currentLeads.reduce((sum, lead) => sum + lead.valor, 0);
  const taxaConversao = totalLeads > 0 ? ((currentLeads.filter(l => l.estagio === 'fechamento').length / totalLeads) * 100).toFixed(1) : 0;
  const valorMedio = totalLeads > 0 ? (totalValor / totalLeads).toFixed(0) : 0;
  const naoAtribuidos = currentLeads.filter(l => !l.atribuidoPara).length;

  // Drag and Drop
  const handleDragStart = (e, lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    if (draggedLead && draggedLead.estagio !== targetStage) {
      const stage = stages.find(s => s.id === targetStage);

      // Se movendo para QUALIFICADO, pedir dados de qualificação
      if (targetStage === 'qualificado') {
        setLeadBeingQualified(draggedLead);
        setShowQualificationModal(true);
        setDraggedLead(null);
        return;
      }

      // Se movendo para PERDIDO, pedir motivo
      if (targetStage === 'perdido') {
        setLeadBeingQualified(draggedLead);
        setShowLostReasonModal(true);
        setDraggedLead(null);
        return;
      }

      // Se movendo para FECHADO, pedir dados de fechamento
      if (targetStage === 'fechado') {
        setLeadBeingQualified(draggedLead);
        setShowClosedModal(true);
        setDraggedLead(null);
        return;
      }

      // Para outros estágios, mover normalmente
      updateLeadInPipeline(draggedLead.id, {
        estagio: targetStage,
        ultimaAtualizacao: new Date().toISOString().split('T')[0]
      });

      // Criar alerta/notificação se necessário
      if (targetStage === 'leads') {
        // Criar alerta para responder em 5-15 min
        console.log(`⚠️ ALERTA: Novo lead "${draggedLead.nome}" - Responder em até 15 minutos!`);
      }

      if (targetStage === 'follow-up') {
        // Criar tarefa automática de follow-up
        console.log(`📋 TAREFA CRIADA: Follow-up com "${draggedLead.nome}" agendado`);
      }
    }
    setDraggedLead(null);
  };

  // Função auxiliar para atualizar lead na pipeline ativa
  const updateLeadInPipeline = (leadId, updates) => {
    setPipelines(pipelines.map(pipeline => {
      if (pipeline.id === activePipelineId) {
        return {
          ...pipeline,
          leads: pipeline.leads.map(lead =>
            lead.id === leadId ? { ...lead, ...updates } : lead
          )
        };
      }
      return pipeline;
    }));
  };

  // Função auxiliar para deletar lead da pipeline ativa
  const deleteLeadFromPipeline = (leadId) => {
    setPipelines(pipelines.map(pipeline => {
      if (pipeline.id === activePipelineId) {
        return {
          ...pipeline,
          leads: pipeline.leads.filter(lead => lead.id !== leadId)
        };
      }
      return pipeline;
    }));
  };

  // Função auxiliar para adicionar lead na pipeline ativa
  const addLeadToPipeline = (newLead) => {
    setPipelines(pipelines.map(pipeline => {
      if (pipeline.id === activePipelineId) {
        return {
          ...pipeline,
          leads: [...pipeline.leads, newLead]
        };
      }
      return pipeline;
    }));
  };

  // Abrir modal de detalhes
  const handleOpenLead = (lead) => {
    setSelectedLead(lead);
    setShowLeadModal(true);
  };

  // Mover lead para outro estágio
  const handleMoveStage = (leadId, newStage) => {
    const updates = { estagio: newStage, ultimaAtualizacao: new Date().toISOString().split('T')[0] };
    updateLeadInPipeline(leadId, updates);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, ...updates });
    }
  };

  // Atribuir lead
  const handleAssignLead = (leadId, attendantId) => {
    const updates = { atribuidoPara: attendantId, ultimaAtualizacao: new Date().toISOString().split('T')[0] };
    updateLeadInPipeline(leadId, updates);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, ...updates });
    }
  };

  // Desatribuir lead
  const handleUnassignLead = (leadId) => {
    const updates = { atribuidoPara: null, ultimaAtualizacao: new Date().toISOString().split('T')[0] };
    updateLeadInPipeline(leadId, updates);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, ...updates });
    }
  };

  // Deletar lead
  const handleDeleteLead = async (leadId) => {
    const confirmed = await confirm({
      title: 'Deletar lead',
      message: 'Tem certeza que deseja deletar este lead?',
      confirmText: 'Deletar',
      cancelText: 'Cancelar',
      type: 'danger'
    });

    if (confirmed) {
      deleteLeadFromPipeline(leadId);
      setShowLeadModal(false);
      setSelectedLead(null);
      setCardMenuOpen(null);
      toast.success('Lead deletado com sucesso!');
    }
  };

  // Adicionar nota
  const handleAddNote = (leadId) => {
    if (noteInput.trim()) {
      const newNote = {
        id: Date.now(),
        text: noteInput,
        date: new Date().toLocaleString('pt-BR'),
        author: 'Usuário'
      };
      setLeadNotes({
        ...leadNotes,
        [leadId]: [...(leadNotes[leadId] || []), newNote]
      });
      setNoteInput('');
    }
  };

  // Deletar nota
  const handleDeleteNote = (leadId, noteId) => {
    setLeadNotes({
      ...leadNotes,
      [leadId]: leadNotes[leadId].filter(note => note.id !== noteId)
    });
  };

  // Iniciar edição
  const handleStartEdit = (lead) => {
    setEditingLead({ ...lead });
  };

  // Salvar edição
  const handleSaveEdit = () => {
    if (editingLead) {
      const updates = { ...editingLead, ultimaAtualizacao: new Date().toISOString().split('T')[0] };
      updateLeadInPipeline(editingLead.id, updates);
      setSelectedLead(updates);
      setEditingLead(null);
      setShowEditModal(false);
      setLeadToEdit(null);
    }
  };

  // Cancelar edição
  const handleCancelEdit = () => {
    setEditingLead(null);
  };

  // Adicionar/remover tag
  const handleToggleTag = (tag) => {
    if (editingLead) {
      const tags = editingLead.tags.includes(tag)
        ? editingLead.tags.filter(t => t !== tag)
        : [...editingLead.tags, tag];
      setEditingLead({ ...editingLead, tags });
    }
  };

  // Adicionar novo lead
  const handleAddNewLead = () => {
    if (newLead.nome && newLead.email) {
      const lead = {
        id: Date.now(),
        ...newLead,
        valor: parseFloat(newLead.valor) || 0,
        estagio: 'prospeccao',
        atribuidoPara: null,
        dataCriacao: new Date().toISOString().split('T')[0],
        ultimaAtualizacao: new Date().toISOString().split('T')[0]
      };
      addLeadToPipeline(lead);
      setNewLead({
        nome: '',
            telefone: '',
        email: '',
        valor: '',
        origem: 'Site',
        tags: []
      });
      setShowAddLeadModal(false);
    }
  };

  // Adicionar/remover tag no novo lead
  const handleToggleNewLeadTag = (tag) => {
    const tags = newLead.tags.includes(tag)
      ? newLead.tags.filter(t => t !== tag)
      : [...newLead.tags, tag];
    setNewLead({ ...newLead, tags });
  };

  // Criar nova pipeline
  const handleCreatePipeline = () => {
    if (newPipelineName.trim()) {
      const newPipeline = {
        id: Date.now(),
        nome: newPipelineName.trim(),
        leads: []
      };
      setPipelines([...pipelines, newPipeline]);
      setNewPipelineName('');
      setShowPipelineModal(false);
    }
  };

  // Trocar pipeline ativa
  const handleChangePipeline = (pipelineId) => {
    setActivePipelineId(pipelineId);
    setShowPipelineDropdown(false);
  };

  // Adicionar novo estágio
  const handleAddStage = () => {
    if (newStageName.trim()) {
      const newStage = {
        id: newStageName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        nome: newStageName.trim(),
        color: newStageColor
      };
      setStages([...stages, newStage]);
      setNewStageName('');
      setNewStageColor('bg-blue-500');
      setShowAddStageModal(false);
    }
  };

  // Editar estágio
  const handleEditStage = () => {
    if (editingStage && newStageName.trim()) {
      setStages(stages.map(s =>
        s.id === editingStage.id
          ? { ...s, nome: newStageName.trim(), color: newStageColor }
          : s
      ));
      setShowEditStageModal(false);
      setEditingStage(null);
      setNewStageName('');
      setNewStageColor('bg-blue-500');
      setStageMenuOpen(null);
    }
  };

  // Excluir estágio
  const handleDeleteStage = async (stageId) => {
    const confirmed = await confirm({
      title: 'Excluir estágio',
      message: 'Tem certeza que deseja excluir este estágio? Todos os leads serão movidos para Prospecção.',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'warning'
    });

    if (confirmed) {
      // Mover leads do estágio excluído para Prospecção
      setPipelines(pipelines.map(pipeline => ({
        ...pipeline,
        leads: pipeline.leads.map(lead =>
          lead.estagio === stageId ? { ...lead, estagio: 'prospeccao' } : lead
        )
      })));
      // Remover estágio
      setStages(stages.filter(s => s.id !== stageId));
      setStageMenuOpen(null);
      toast.success('Estágio excluído com sucesso!');
    }
  };

  // Editar pipeline
  const handleEditPipeline = () => {
    if (editingPipeline && newPipelineName.trim()) {
      setPipelines(pipelines.map(p =>
        p.id === editingPipeline.id
          ? { ...p, nome: newPipelineName.trim() }
          : p
      ));
      setShowEditPipelineModal(false);
      setEditingPipeline(null);
      setNewPipelineName('');
      setPipelineMenuOpen(null);
    }
  };

  // Excluir pipeline
  const handleDeletePipeline = async (pipelineId) => {
    if (pipelines.length === 1) {
      toast.warning('Não é possível excluir a última pipeline');
      return;
    }

    const confirmed = await confirm({
      title: 'Excluir pipeline',
      message: 'Tem certeza que deseja excluir esta pipeline? Todos os leads serão perdidos.',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger'
    });

    if (confirmed) {
      setPipelines(pipelines.filter(p => p.id !== pipelineId));
      if (activePipelineId === pipelineId) {
        setActivePipelineId(pipelines.find(p => p.id !== pipelineId).id);
      }
      setPipelineMenuOpen(null);
      toast.success('Pipeline excluída com sucesso!');
    }
  };

  // Qualificar lead
  const handleQualifyLead = async () => {
    if (!qualificationData.necessidade || !qualificationData.prazo || !qualificationData.orcamento) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (!qualificationData.decisor) {
      const confirmed = await confirm({
        title: 'Qualificar lead',
        message: 'O contato não é o decisor. Deseja qualificar mesmo assim?',
        confirmText: 'Qualificar',
        cancelText: 'Cancelar',
        type: 'warning'
      });

      if (!confirmed) {
        return;
      }
    }

    updateLeadInPipeline(leadBeingQualified.id, {
      estagio: 'qualificado',
      qualificacao: {
        ...qualificationData,
        dataQualificacao: new Date().toISOString()
      },
      ultimaAtualizacao: new Date().toISOString().split('T')[0]
    });

    setShowQualificationModal(false);
    setLeadBeingQualified(null);
    setQualificationData({
      necessidade: '',
      prazo: '',
      orcamento: '',
      decisor: false
    });

    toast.success(`Lead "${leadBeingQualified.nome}" qualificado com sucesso!`);
  };

  // Marcar lead como perdido
  const handleMarkAsLost = () => {
    if (!lostReason.trim()) {
      toast.error('Por favor, informe o motivo da perda');
      return;
    }

    updateLeadInPipeline(leadBeingQualified.id, {
      estagio: 'perdido',
      motivoPerda: lostReason,
      dataPerdido: new Date().toISOString(),
      ultimaAtualizacao: new Date().toISOString().split('T')[0]
    });

    setShowLostReasonModal(false);
    setLeadBeingQualified(null);
    setLostReason('');

    toast.warning(`Lead "${leadBeingQualified.nome}" marcado como perdido`);
  };

  // Fechar venda
  const handleCloseSale = () => {
    if (!closedData.valorFinal || !closedData.formaPagamento) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    updateLeadInPipeline(leadBeingQualified.id, {
      estagio: 'fechado',
      fechamento: {
        valorFinal: parseFloat(closedData.valorFinal),
        formaPagamento: closedData.formaPagamento,
        dataFechamento: new Date().toISOString()
      },
      ultimaAtualizacao: new Date().toISOString().split('T')[0]
    });

    setShowClosedModal(false);
    setLeadBeingQualified(null);
    setClosedData({
      valorFinal: '',
      formaPagamento: ''
    });

    console.log(`🎉 VENDA FECHADA: ${leadBeingQualified.nome} - R$ ${closedData.valorFinal}`);
    console.log(`📤 Enviando para financeiro...`);
    console.log(`🚀 Iniciando onboarding...`);
  };

  // Toggle dropdown de contatos
  const handleToggleContactsDropdown = (leadId, lead, e) => {
    e.stopPropagation();
    if (contactsDropdownOpen === leadId) {
      setContactsDropdownOpen(null);
    } else {
      setContactsDropdownOpen(leadId);
      setSelectedContacts(lead.contatosVinculados || []);
    }
  };

  // Toggle contato selecionado no dropdown
  const handleToggleContact = (leadId, contatoId, e) => {
    e.stopPropagation();
    const lead = activePipeline.stages.flatMap(s => s.leads).find(l => l.id === leadId);
    let newContacts = [...(lead.contatosVinculados || [])];

    if (newContacts.includes(contatoId)) {
      newContacts = newContacts.filter(id => id !== contatoId);
    } else {
      newContacts.push(contatoId);
    }

    updateLeadInPipeline(leadId, {
      contatosVinculados: newContacts
    });
  };

  // Abrir modal para selecionar contato e converter em lead
  const handleOpenSelectContactModal = (stageId) => {
    setTargetStageForContact(stageId);
    setSelectedContactsToConvert([]);
    setSearchContactTerm('');
    setShowSelectContactModal(true);
  };

  // Toggle seleção de contato para converter
  const handleToggleContactToConvert = (contatoId) => {
    if (selectedContactsToConvert.includes(contatoId)) {
      setSelectedContactsToConvert(selectedContactsToConvert.filter(id => id !== contatoId));
    } else {
      setSelectedContactsToConvert([...selectedContactsToConvert, contatoId]);
    }
  };

  // Converter contatos selecionados em leads
  const handleConvertSelectedContacts = () => {
    // Criar todos os leads de uma vez
    const newLeads = selectedContactsToConvert.map((contatoId, index) => {
      const contato = contatosDisponiveis.find(c => c.id === contatoId);
      if (contato) {
        return {
          id: Date.now() + index * 100,
          nome: contato.nome,
          telefone: contato.telefone,
          email: contato.email,
          valor: 0,
          estagio: targetStageForContact,
          atribuidoPara: null,
          origem: 'Contatos',
          tags: [],
          dataCriacao: new Date().toISOString().split('T')[0],
          ultimaAtualizacao: new Date().toISOString().split('T')[0],
          contatosVinculados: [contato.id]
        };
      }
      return null;
    }).filter(lead => lead !== null);

    // Adicionar todos os leads de uma vez
    setPipelines(pipelines.map(pipeline => {
      if (pipeline.id === activePipelineId) {
        return {
          ...pipeline,
          leads: [...pipeline.leads, ...newLeads]
        };
      }
      return pipeline;
    }));

    setShowSelectContactModal(false);
    setTargetStageForContact(null);
    setSelectedContactsToConvert([]);
    setSearchContactTerm('');
  };

  // Toggle expansão do estágio
  const toggleStageExpansion = (stageId) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  // Abrir modal de edição do card
  const handleEditCard = (lead, e) => {
    e.stopPropagation();
    setLeadToEdit({ ...lead });
    setShowEditModal(true);
    setCardMenuOpen(null);
  };

  // Deletar card
  const handleDeleteCard = async (leadId, e) => {
    e.stopPropagation();

    const confirmed = await confirm({
      title: 'Deletar lead',
      message: 'Tem certeza que deseja deletar este lead?',
      confirmText: 'Deletar',
      cancelText: 'Cancelar',
      type: 'danger'
    });

    if (confirmed) {
      deleteLeadFromPipeline(leadId);
      setCardMenuOpen(null);
      toast.success('Lead deletado com sucesso!');
    }
  };

  // Salvar edição do card
  const handleSaveCardEdit = () => {
    if (leadToEdit && leadToEdit.nome && leadToEdit.email) {
      const updates = {
        ...leadToEdit,
        valor: parseFloat(leadToEdit.valor) || 0,
        ultimaAtualizacao: new Date().toISOString().split('T')[0]
      };
      updateLeadInPipeline(leadToEdit.id, updates);
      setShowEditModal(false);
      setLeadToEdit(null);
    }
  };

  // Toggle tag no card sendo editado
  const handleToggleCardTag = (tag) => {
    if (leadToEdit) {
      const tags = leadToEdit.tags.includes(tag)
        ? leadToEdit.tags.filter(t => t !== tag)
        : [...leadToEdit.tags, tag];
      setLeadToEdit({ ...leadToEdit, tags });
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                CRM - Funil de Vendas
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-600 font-semibold">
                Gerencie seus leads e oportunidades
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Dropdown de Pipelines */}
              <div className="relative">
                <button
                  onClick={() => setShowPipelineDropdown(!showPipelineDropdown)}
                  className="px-6 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  {activePipeline ? activePipeline.nome : 'Selecione Pipeline'}
                  <FaChevronDown className="text-sm" />
                </button>
                {showPipelineDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowPipelineDropdown(false)} />
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
                      {pipelines.map(pipeline => (
                        <div
                          key={pipeline.id}
                          className={`w-full px-4 py-3 transition-colors flex items-center justify-between group ${
                            activePipelineId === pipeline.id
                              ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <button
                            onClick={() => handleChangePipeline(pipeline.id)}
                            className="flex-1 text-left"
                          >
                            {pipeline.nome}
                          </button>
                          <div className="flex items-center gap-1">
                            {activePipelineId === pipeline.id && <FaCheckCircle className="text-sm" />}
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPipelineMenuOpen(pipelineMenuOpen === pipeline.id ? null : pipeline.id);
                                }}
                                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <FaEllipsisV className="text-xs" />
                              </button>
                              {pipelineMenuOpen === pipeline.id && (
                                <>
                                  <div className="fixed inset-0 z-30" onClick={() => setPipelineMenuOpen(null)} />
                                  <div className="absolute top-full right-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden z-40">
                                    <button
                                      onClick={() => {
                                        setEditingPipeline(pipeline);
                                        setNewPipelineName(pipeline.nome);
                                        setShowEditPipelineModal(true);
                                        setPipelineMenuOpen(null);
                                        setShowPipelineDropdown(false);
                                      }}
                                      className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center gap-2"
                                    >
                                      <FaEdit className="text-purple-600 dark:text-purple-400" aria-hidden="true" />
                                      Editar
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleDeletePipeline(pipeline.id);
                                        setShowPipelineDropdown(false);
                                      }}
                                      className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                                    >
                                      <FaTrash aria-hidden="true" />
                                      Excluir
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Botão Nova Pipeline */}
              <button
                onClick={() => setShowPipelineModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <FaPlus /> Nova Pipeline
              </button>

              {/* Botão Novo Estágio */}
              <button
                onClick={() => setShowAddStageModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <FaPlus /> Novo Estágio
              </button>

              {/* Botão Novo Lead */}
              <button
                onClick={() => setShowAddLeadModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                aria-label="Adicionar novo lead"
              >
                <FaPlus aria-hidden="true" /> Novo Lead
              </button>
            </div>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <FaUser className="text-white" />
                </div>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-600 uppercase">Total Leads</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalLeads}</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <FaDollarSign className="text-white" />
                </div>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-600 uppercase">Valor Total</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                R$ {totalValor.toLocaleString('pt-BR')}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <FaCheckCircle className="text-white" />
                </div>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-600 uppercase">Taxa Conversão</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{taxaConversao}%</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <FaDollarSign className="text-white" />
                </div>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-600 uppercase">Ticket Médio</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                R$ {parseFloat(valorMedio).toLocaleString('pt-BR')}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <FaExclamationTriangle className="text-white" />
                </div>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-600 uppercase">Não Atribuídos</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{naoAtribuidos}</p>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-800">
            <div className="flex flex-wrap items-center gap-3">
              {/* Busca */}
              <div className="relative flex-1 min-w-[250px]">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Buscar por nome, telefone, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  aria-label="Buscar leads por nome, telefone ou email"
                />
              </div>

              {/* Filtro Estágio */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(showFilterDropdown === 'status' ? null : 'status')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  aria-label="Filtrar por estágio"
                  aria-expanded={showFilterDropdown === 'status'}
                >
                  <FaFilter className="text-xs" aria-hidden="true" />
                  Estágio
                  <FaChevronDown className="text-xs" aria-hidden="true" />
                </button>
                {showFilterDropdown === 'status' && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(null)} aria-hidden="true" />
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
                      <button
                        onClick={() => { setFilterStatus('todos'); setShowFilterDropdown(null); }}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${filterStatus === 'todos' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      >
                        Todos
                      </button>
                      {stages.map(stage => (
                        <button
                          key={stage.id}
                          onClick={() => { setFilterStatus(stage.id); setShowFilterDropdown(null); }}
                          className={`w-full px-4 py-2 text-left text-sm transition-colors ${filterStatus === stage.id ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                          {stage.nome}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Filtro Atribuído a */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(showFilterDropdown === 'assignee' ? null : 'assignee')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  <FaUserTie className="text-xs" />
                  Atribuído
                  <FaChevronDown className="text-xs" />
                </button>
                {showFilterDropdown === 'assignee' && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(null)} aria-hidden="true" />
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
                      <button
                        onClick={() => { setFilterAssignee('todos'); setShowFilterDropdown(null); }}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${filterAssignee === 'todos' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      >
                        Todos
                      </button>
                      <button
                        onClick={() => { setFilterAssignee('nao-atribuidos'); setShowFilterDropdown(null); }}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${filterAssignee === 'nao-atribuidos' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      >
                        Não Atribuídos
                      </button>
                      {atendentes.map(att => (
                        <button
                          key={att.id}
                          onClick={() => { setFilterAssignee(att.id.toString()); setShowFilterDropdown(null); }}
                          className={`w-full px-4 py-2 text-left text-sm transition-colors ${filterAssignee === att.id.toString() ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                          {att.nome}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Filtro Origem */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(showFilterDropdown === 'origin' ? null : 'origin')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  <FaBuilding className="text-xs" />
                  Origem
                  <FaChevronDown className="text-xs" />
                </button>
                {showFilterDropdown === 'origin' && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(null)} aria-hidden="true" />
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
                      <button
                        onClick={() => { setFilterOrigin('todos'); setShowFilterDropdown(null); }}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${filterOrigin === 'todos' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      >
                        Todas
                      </button>
                      {origens.map(origem => (
                        <button
                          key={origem}
                          onClick={() => { setFilterOrigin(origem); setShowFilterDropdown(null); }}
                          className={`w-full px-4 py-2 text-left text-sm transition-colors ${filterOrigin === origem ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                          {origem}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Filtro Tags */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(showFilterDropdown === 'tag' ? null : 'tag')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  <FaTag className="text-xs" />
                  Tags
                  <FaChevronDown className="text-xs" />
                </button>
                {showFilterDropdown === 'tag' && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(null)} aria-hidden="true" />
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden max-h-64 overflow-y-auto">
                      <button
                        onClick={() => { setFilterTag('todos'); setShowFilterDropdown(null); }}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${filterTag === 'todos' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      >
                        Todas
                      </button>
                      {availableTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => { setFilterTag(tag); setShowFilterDropdown(null); }}
                          className={`w-full px-4 py-2 text-left text-sm transition-colors ${filterTag === tag ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Funil de Vendas */}
        <div className="flex gap-4 overflow-x-auto pb-8 mb-6 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-200 dark:scrollbar-track-gray-800">
          {stages.map(stage => {
            const stageLeads = filteredLeads.filter(lead => lead.estagio === stage.id);
            const stageValue = stageLeads.reduce((sum, lead) => sum + lead.valor, 0);
            const isExpanded = expandedStages[stage.id];

            return (
              <div
                key={stage.id}
                className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden flex-shrink-0 transition-all duration-300"
                style={{
                  width: isExpanded ? '450px' : '320px',
                  minWidth: isExpanded ? '450px' : '320px'
                }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                {/* Header do Estágio */}
                <div className={`${stage.color} p-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-bold text-sm uppercase">{stage.nome}</h3>
                    <div className="flex items-center gap-2">
                      <span className="bg-white/30 text-white px-2 py-1 rounded-lg text-xs font-bold">
                        {stageLeads.length}
                      </span>
                      {/* Botão Expandir/Encolher */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStageExpansion(stage.id);
                        }}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                        title={expandedStages[stage.id] ? 'Encolher' : 'Expandir'}
                      >
                        {expandedStages[stage.id] ? (
                          <FaChevronDown className="text-white text-xs" />
                        ) : (
                          <FaChevronRight className="text-white text-xs" />
                        )}
                      </button>
                      {/* Menu 3 Pontinhos do Estágio */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setStageMenuOpen(stageMenuOpen === stage.id ? null : stage.id);
                          }}
                          className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          <FaEllipsisV className="text-white text-xs" />
                        </button>
                        {stageMenuOpen === stage.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setStageMenuOpen(null)} />
                            <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden z-20">
                              <button
                                onClick={() => {
                                  handleOpenSelectContactModal(stage.id);
                                  setStageMenuOpen(null);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center gap-2"
                              >
                                <FaPlus className="text-purple-600 dark:text-purple-400" />
                                Adicionar Lead
                              </button>
                              <button
                                onClick={() => {
                                  setEditingStage(stage);
                                  setNewStageName(stage.nome);
                                  setNewStageColor(stage.color);
                                  setShowEditStageModal(true);
                                  setStageMenuOpen(null);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center gap-2"
                              >
                                <FaEdit className="text-purple-600 dark:text-purple-400" aria-hidden="true" />
                                Editar Estágio
                              </button>
                              <button
                                onClick={() => handleDeleteStage(stage.id)}
                                className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                              >
                                <FaTrash className="text-red-600 dark:text-red-400" />
                                Excluir Estágio
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-white/90 text-xs font-semibold">
                    R$ {stageValue.toLocaleString('pt-BR')}
                  </p>
                </div>

                {/* Cards de Leads */}
                <div
                  className="p-3 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-200 dark:scrollbar-track-gray-800"
                  style={{
                    maxHeight: expandedStages[stage.id] ? '1200px' : '600px',
                    minHeight: '400px',
                    transition: 'max-height 0.3s ease'
                  }}
                >
                  {stageLeads.length === 0 ? (
                    <div className="text-center py-12">
                      <FaUser className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 dark:text-gray-600">Nenhum lead neste estágio</p>
                      <p className="text-xs text-gray-600 dark:text-gray-600 mt-1">Use o menu ⋮ para adicionar</p>
                    </div>
                  ) : (
                    stageLeads.map(lead => {
                      const atendente = atendentes.find(a => a.id === lead.atribuidoPara);
                      return (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, lead)}
                          onClick={() => handleOpenLead(lead)}
                          className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all cursor-move hover:shadow-lg relative"
                          role="button"
                          tabIndex={0}
                          aria-label={`Lead: ${lead.nome}, Valor: R$ ${lead.valor.toLocaleString('pt-BR')}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleOpenLead(lead);
                            }
                          }}
                        >
                          {/* Menu 3 Pontinhos */}
                          <div className="absolute top-2 right-2 z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCardMenuOpen(cardMenuOpen === lead.id ? null : lead.id);
                              }}
                              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              aria-label="Menu de opções"
                              aria-expanded={cardMenuOpen === lead.id}
                            >
                              <FaEllipsisV className="text-gray-600 dark:text-gray-600 text-xs" aria-hidden="true" />
                            </button>
                            {cardMenuOpen === lead.id && (
                              <>
                                <div className="fixed inset-0" onClick={(e) => { e.stopPropagation(); setCardMenuOpen(null); }} />
                                <div className="absolute top-full right-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden">
                                  <button
                                    onClick={(e) => handleEditCard(lead, e)}
                                    className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center gap-2"
                                  >
                                    <FaEdit className="text-purple-600 dark:text-purple-400" aria-hidden="true" />
                                    Editar
                                  </button>
                                  <button
                                    onClick={(e) => handleDeleteCard(lead.id, e)}
                                    className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                                  >
                                    <FaTrash aria-hidden="true" />
                                    Apagar
                                  </button>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Nome e Valor */}
                          <div className="flex items-start justify-between mb-2 pr-6">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <FaGripVertical className="text-gray-600 text-xs flex-shrink-0" aria-hidden="true" />
                              <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                                {lead.nome}
                              </h4>
                            </div>
                          </div>


                          {/* Valor */}
                          <div className="flex items-center gap-2 mb-3">
                            <FaDollarSign className="text-emerald-500 text-xs" aria-hidden="true" />
                            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                              R$ {lead.valor.toLocaleString('pt-BR')}
                            </p>
                          </div>

                          {/* Tags */}
                          {lead.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {lead.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Atendente */}
                          <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <FaUserTie className="text-gray-600 text-xs" aria-hidden="true" />
                            {atendente ? (
                              <p className="text-xs text-gray-600 dark:text-gray-600">
                                {atendente.nome}
                              </p>
                            ) : (
                              <p className="text-xs text-red-500 dark:text-red-400 font-semibold">
                                Sem atribuição
                              </p>
                            )}
                          </div>

                          {/* Botão Vincular Contatos */}
                          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 relative contacts-dropdown-container">
                            <button
                              onClick={(e) => handleToggleContactsDropdown(lead.id, lead, e)}
                              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg transition-colors text-xs font-semibold"
                            >
                              <FaPlus className="text-xs" />
                              {lead.contatosVinculados && lead.contatosVinculados.length > 0
                                ? `${lead.contatosVinculados.length} Contato${lead.contatosVinculados.length > 1 ? 's' : ''}`
                                : 'Adicionar Contato'}
                            </button>

                            {/* Dropdown de Contatos */}
                            {contactsDropdownOpen === lead.id && (
                              <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 border-2 border-purple-300 dark:border-purple-700 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
                                <div className="p-2">
                                  <div className="mb-2 px-2 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <p className="text-xs text-purple-800 dark:text-purple-200 font-semibold">
                                      Selecione os contatos
                                    </p>
                                  </div>
                                  {contatosDisponiveis.map(contato => {
                                    const isSelected = lead.contatosVinculados?.includes(contato.id);
                                    return (
                                      <button
                                        key={contato.id}
                                        onClick={(e) => handleToggleContact(lead.id, contato.id, e)}
                                        className={`w-full p-2 rounded-lg mb-1 text-left transition-all ${
                                          isSelected
                                            ? 'bg-purple-100 dark:bg-purple-900/40 border-2 border-purple-400'
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-transparent'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2">
                                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                            isSelected
                                              ? 'bg-purple-600 border-purple-600'
                                              : 'border-gray-300 dark:border-gray-600'
                                          }`}>
                                            {isSelected && (
                                              <FaCheckCircle className="text-white text-xs" />
                                            )}
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                                              {contato.nome}
                                            </p>
                                          </div>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Detalhes do Lead */}
      {showLeadModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="lead-modal-title">
          <div ref={leadModalRef} className="bg-white dark:bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
              <div className="flex items-center justify-between">
                <h2 id="lead-modal-title" className="text-2xl font-bold text-gray-900 dark:text-white">
                  Detalhes do Lead
                </h2>
                <div className="flex items-center gap-2">
                  {!editingLead && (
                    <button
                      onClick={() => handleStartEdit(selectedLead)}
                      className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                      aria-label="Editar lead"
                    >
                      <FaEdit className="text-purple-600 dark:text-purple-400" aria-hidden="true" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteLead(selectedLead.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    aria-label="Deletar lead"
                  >
                    <FaTrash className="text-red-600 dark:text-red-400" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => setShowLeadModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label="Fechar modal"
                  >
                    <FaTimes className="text-gray-600 dark:text-gray-600" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6 space-y-6">
              {editingLead ? (
                /* MODO EDIÇÃO */
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Nome *
                      </label>
                      <input
                        type="text"
                        value={editingLead.nome}
                        onChange={(e) => setEditingLead({ ...editingLead, nome: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Telefone
                      </label>
                      <input
                        type="text"
                        value={editingLead.telefone}
                        onChange={(e) => setEditingLead({ ...editingLead, telefone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={editingLead.email}
                        onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Valor (R$)
                      </label>
                      <input
                        type="number"
                        value={editingLead.valor}
                        onChange={(e) => setEditingLead({ ...editingLead, valor: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Origem
                      </label>
                      <select
                        value={editingLead.origem}
                        onChange={(e) => setEditingLead({ ...editingLead, origem: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {origens.map(origem => (
                          <option key={origem} value={origem}>{origem}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleToggleTag(tag)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                            editingLead.tags.includes(tag)
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Salvar Alterações
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                /* MODO VISUALIZAÇÃO */
                <>
                  {/* Informações Básicas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 dark:text-gray-600 uppercase mb-1">
                        Nome
                      </label>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {selectedLead.nome}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 dark:text-gray-600 uppercase mb-1">
                      </label>
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-purple-600 dark:text-purple-400 text-xs" />
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {selectedLead.telefone}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 dark:text-gray-600 uppercase mb-1">
                        Email
                      </label>
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-purple-600 dark:text-purple-400 text-xs" />
                        <p className="text-sm font-semibold text-gray-900 dark:text-white break-all">
                          {selectedLead.email}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 dark:text-gray-600 uppercase mb-1">
                        Valor
                      </label>
                      <div className="flex items-center gap-2">
                        <FaDollarSign className="text-emerald-600 dark:text-emerald-400 text-xs" />
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          R$ {selectedLead.valor.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 dark:text-gray-600 uppercase mb-1">
                        Origem
                      </label>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {selectedLead.origem}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 dark:text-gray-600 uppercase mb-1">
                        Criado em
                      </label>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-600 text-xs" />
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {new Date(selectedLead.dataCriacao).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 dark:text-gray-600 uppercase mb-1">
                        Última Atualização
                      </label>
                      <div className="flex items-center gap-2">
                        <FaClock className="text-gray-600 text-xs" />
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {new Date(selectedLead.ultimaAtualizacao).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {selectedLead.tags.length > 0 && (
                    <div>
                      <label className="block text-xs font-bold text-gray-600 dark:text-gray-600 uppercase mb-2">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedLead.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mover Estágio */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-600 uppercase mb-3">
                      Mover para Estágio
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {stages.map(stage => (
                        <button
                          key={stage.id}
                          onClick={() => handleMoveStage(selectedLead.id, stage.id)}
                          disabled={selectedLead.estagio === stage.id}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                            selectedLead.estagio === stage.id
                              ? `${stage.color} text-white cursor-default`
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {selectedLead.estagio === stage.id && <FaCheckCircle />}
                          {stage.nome}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Atribuição */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-600 uppercase mb-3">
                      Atribuir para
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedLead.atribuidoPara && (
                        <button
                          onClick={() => handleUnassignLead(selectedLead.id)}
                          className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-semibold text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                        >
                          <FaTimesCircle className="inline mr-2" />
                          Desatribuir
                        </button>
                      )}
                      {atendentes.map(att => (
                        <button
                          key={att.id}
                          onClick={() => handleAssignLead(selectedLead.id, att.id)}
                          className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                            selectedLead.atribuidoPara === att.id
                              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {selectedLead.atribuidoPara === att.id && <FaCheckCircle className="inline mr-2" />}
                          {att.nome}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notas */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-600 uppercase mb-3">
                      <FaStickyNote className="inline mr-2" />
                      Notas e Observações
                    </label>

                    {/* Input Nova Nota */}
                    <div className="mb-4">
                      <textarea
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Adicionar nova nota..."
                        rows="3"
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      />
                      <button
                        onClick={() => handleAddNote(selectedLead.id)}
                        disabled={!noteInput.trim()}
                        className="mt-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Adicionar Nota
                      </button>
                    </div>

                    {/* Lista de Notas */}
                    <div className="space-y-3">
                      {(!leadNotes[selectedLead.id] || leadNotes[selectedLead.id].length === 0) ? (
                        <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <FaHistory className="text-3xl text-gray-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-600">
                            Nenhuma nota ainda
                          </p>
                        </div>
                      ) : (
                        leadNotes[selectedLead.id].map(note => (
                          <div
                            key={note.id}
                            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                          >
                            <p className="text-sm text-gray-900 dark:text-white mb-2 whitespace-pre-wrap">
                              {note.text}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-600">
                                <span className="flex items-center gap-1">
                                  <FaUser className="text-xs" />
                                  {note.author}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FaClock className="text-xs" />
                                  {note.date}
                                </span>
                              </div>
                              <button
                                onClick={() => handleDeleteNote(selectedLead.id, note.id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                              >
                                <FaTrash className="text-xs" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Criar Nova Pipeline */}
      {showPipelineModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full border-2 border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Nova Pipeline
                </h2>
                <button
                  onClick={() => setShowPipelineModal(false)}
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
                  Nome da Pipeline *
                </label>
                <input
                  type="text"
                  value={newPipelineName}
                  onChange={(e) => setNewPipelineName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Pipeline Q2 2026"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCreatePipeline}
                  disabled={!newPipelineName.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Criar Pipeline
                </button>
                <button
                  onClick={() => setShowPipelineModal(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Adicionar Novo Estágio */}
      {showAddStageModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full border-2 border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Novo Estágio
                </h2>
                <button
                  onClick={() => {
                    setShowAddStageModal(false);
                    setNewStageName('');
                    setNewStageColor('bg-blue-500');
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nome do Estágio *
                </label>
                <input
                  type="text"
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: Apresentação"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Cor do Estágio
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {['bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-orange-500', 'bg-emerald-500', 'bg-red-500', 'bg-pink-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-teal-500'].map(color => (
                    <button
                      key={color}
                      onClick={() => setNewStageColor(color)}
                      className={`h-10 rounded-lg ${color} ${newStageColor === color ? 'ring-4 ring-gray-400 dark:ring-gray-600' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddStage}
                  disabled={!newStageName.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Adicionar Estágio
                </button>
                <button
                  onClick={() => {
                    setShowAddStageModal(false);
                    setNewStageName('');
                    setNewStageColor('bg-blue-500');
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

      {/* Modal Editar Estágio */}
      {showEditStageModal && editingStage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full border-2 border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Editar Estágio
                </h2>
                <button
                  onClick={() => {
                    setShowEditStageModal(false);
                    setEditingStage(null);
                    setNewStageName('');
                    setNewStageColor('bg-blue-500');
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nome do Estágio *
                </label>
                <input
                  type="text"
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Cor do Estágio
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {['bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-orange-500', 'bg-emerald-500', 'bg-red-500', 'bg-pink-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-teal-500'].map(color => (
                    <button
                      key={color}
                      onClick={() => setNewStageColor(color)}
                      className={`h-10 rounded-lg ${color} ${newStageColor === color ? 'ring-4 ring-gray-400 dark:ring-gray-600' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleEditStage}
                  disabled={!newStageName.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Salvar Alterações
                </button>
                <button
                  onClick={() => {
                    setShowEditStageModal(false);
                    setEditingStage(null);
                    setNewStageName('');
                    setNewStageColor('bg-blue-500');
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

      {/* Modal Editar Pipeline */}
      {showEditPipelineModal && editingPipeline && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full border-2 border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Editar Pipeline
                </h2>
                <button
                  onClick={() => {
                    setShowEditPipelineModal(false);
                    setEditingPipeline(null);
                    setNewPipelineName('');
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nome da Pipeline *
                </label>
                <input
                  type="text"
                  value={newPipelineName}
                  onChange={(e) => setNewPipelineName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleEditPipeline}
                  disabled={!newPipelineName.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Salvar Alterações
                </button>
                <button
                  onClick={() => {
                    setShowEditPipelineModal(false);
                    setEditingPipeline(null);
                    setNewPipelineName('');
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

      {/* Modal Qualificação */}
      {showQualificationModal && leadBeingQualified && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full border-2 border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Qualificar Lead
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-600 mt-1">
                    {leadBeingQualified.nome}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowQualificationModal(false);
                    setLeadBeingQualified(null);
                    setQualificationData({
                      necessidade: '',
                      prazo: '',
                      orcamento: '',
                      decisor: false
                    });
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-cyan-50 dark:bg-cyan-900/20 border-2 border-cyan-200 dark:border-cyan-800 rounded-xl p-4">
                <h3 className="font-bold text-cyan-900 dark:text-cyan-100 mb-2">Critérios de Qualificação</h3>
                <p className="text-sm text-cyan-800 dark:text-cyan-200 mb-3">
                  Preencha as informações abaixo para qualificar o lead:
                </p>
                <ul className="text-sm text-cyan-700 dark:text-cyan-300 space-y-1">
                  <li>✔ Tem necessidade real</li>
                  <li>✔ Tem orçamento</li>
                  <li>✔ É decisor</li>
                  <li>✔ Tem prazo definido</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  O que você procura? *
                </label>
                <textarea
                  value={qualificationData.necessidade}
                  onChange={(e) => setQualificationData({ ...qualificationData, necessidade: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  rows="3"
                  placeholder="Descreva a necessidade do cliente..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Para quando precisa? *
                  </label>
                  <input
                    type="date"
                    value={qualificationData.prazo}
                    onChange={(e) => setQualificationData({ ...qualificationData, prazo: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Qual orçamento? *
                  </label>
                  <input
                    type="number"
                    value={qualificationData.orcamento}
                    onChange={(e) => setQualificationData({ ...qualificationData, orcamento: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={qualificationData.decisor}
                    onChange={(e) => setQualificationData({ ...qualificationData, decisor: e.target.checked })}
                    className="w-5 h-5 text-cyan-600 focus:ring-cyan-500 rounded"
                  />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    É o decisor da compra
                  </span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleQualifyLead}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Qualificar Lead
                </button>
                <button
                  onClick={() => {
                    setShowQualificationModal(false);
                    setLeadBeingQualified(null);
                    setQualificationData({
                      necessidade: '',
                      prazo: '',
                      orcamento: '',
                      decisor: false
                    });
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

      {/* Modal Motivo de Perda */}
      {showLostReasonModal && leadBeingQualified && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full border-2 border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Lead Perdido
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-600 mt-1">
                    {leadBeingQualified.nome}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowLostReasonModal(false);
                    setLeadBeingQualified(null);
                    setLostReason('');
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Motivo da Perda *
                </label>
                <select
                  value={lostReason}
                  onChange={(e) => setLostReason(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Selecione o motivo</option>
                  <option value="Fechou com concorrente">Fechou com concorrente</option>
                  <option value="Desistiu">Desistiu</option>
                  <option value="Não respondeu">Não respondeu</option>
                  <option value="Sem orçamento">Sem orçamento</option>
                  <option value="Fora do perfil">Fora do perfil</option>
                  <option value="Prazo não atende">Prazo não atende</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleMarkAsLost}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Marcar como Perdido
                </button>
                <button
                  onClick={() => {
                    setShowLostReasonModal(false);
                    setLeadBeingQualified(null);
                    setLostReason('');
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

      {/* Modal Fechamento */}
      {showClosedModal && leadBeingQualified && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full border-2 border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    🎉 Fechar Venda
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-600 mt-1">
                    {leadBeingQualified.nome}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowClosedModal(false);
                    setLeadBeingQualified(null);
                    setClosedData({
                      valorFinal: '',
                      formaPagamento: ''
                    });
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
                <h3 className="font-bold text-emerald-900 dark:text-emerald-100 mb-1">Venda Concluída!</h3>
                <p className="text-sm text-emerald-800 dark:text-emerald-200">
                  Após confirmar, o lead será enviado para financeiro e o onboarding será iniciado automaticamente.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Valor Final da Venda *
                </label>
                <input
                  type="number"
                  value={closedData.valorFinal}
                  onChange={(e) => setClosedData({ ...closedData, valorFinal: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Forma de Pagamento *
                </label>
                <select
                  value={closedData.formaPagamento}
                  onChange={(e) => setClosedData({ ...closedData, formaPagamento: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Selecione</option>
                  <option value="PIX">PIX</option>
                  <option value="Boleto">Boleto</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Transferência">Transferência</option>
                  <option value="Dinheiro">Dinheiro</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCloseSale}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Confirmar Venda
                </button>
                <button
                  onClick={() => {
                    setShowClosedModal(false);
                    setLeadBeingQualified(null);
                    setClosedData({
                      valorFinal: '',
                      formaPagamento: ''
                    });
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

      {/* Modal Selecionar Contato para Converter em Lead */}
      {showSelectContactModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 border-gray-200 dark:border-gray-800 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Selecionar Contatos
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-600 mt-1">
                    Escolha um ou mais contatos para converter em leads
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowSelectContactModal(false);
                    setTargetStageForContact(null);
                    setSelectedContactsToConvert([]);
                    setSearchContactTerm('');
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-600" />
                </button>
              </div>
            </div>

            {/* Campo de Pesquisa */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  placeholder="Pesquisar por nome, email ou telefone..."
                  value={searchContactTerm}
                  onChange={(e) => setSearchContactTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 dark:focus:border-purple-500 transition-colors"
                />
              </div>
              {selectedContactsToConvert.length > 0 && (
                <div className="mt-3 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm text-purple-700 dark:text-purple-300 font-semibold">
                    {selectedContactsToConvert.length} contato{selectedContactsToConvert.length > 1 ? 's' : ''} selecionado{selectedContactsToConvert.length > 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>

            {/* Lista de Contatos */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contatosDisponiveis
                  .filter(contato => {
                    const searchLower = searchContactTerm.toLowerCase();
                    return (
                      contato.nome.toLowerCase().includes(searchLower) ||
                      
                      contato.email.toLowerCase().includes(searchLower) ||
                      contato.telefone.toLowerCase().includes(searchLower)
                    );
                  })
                  .map(contato => {
                    const isSelected = selectedContactsToConvert.includes(contato.id);
                    return (
                      <button
                        key={contato.id}
                        onClick={() => handleToggleContactToConvert(contato.id)}
                        className={`p-5 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Checkbox */}
                          <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                            isSelected
                              ? 'bg-purple-600 border-purple-600'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {isSelected && (
                              <FaCheckCircle className="text-white text-sm" />
                            )}
                          </div>

                          {/* Informações do Contato */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <FaUser className="text-purple-500 text-sm flex-shrink-0" />
                              <h3 className="font-bold text-base text-gray-900 dark:text-white truncate">
                                {contato.nome}
                              </h3>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <FaPhone className="text-gray-600 text-xs flex-shrink-0" />
                                <p className="text-sm text-gray-600 dark:text-gray-600">
                                  {contato.telefone}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaEnvelope className="text-gray-600 text-xs flex-shrink-0" />
                                <p className="text-sm text-gray-600 dark:text-gray-600 truncate">
                                  {contato.email}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>

              {contatosDisponiveis.filter(contato => {
                const searchLower = searchContactTerm.toLowerCase();
                return (
                  contato.nome.toLowerCase().includes(searchLower) ||
                  
                  contato.email.toLowerCase().includes(searchLower) ||
                  contato.telefone.toLowerCase().includes(searchLower)
                );
              }).length === 0 && (
                <div className="text-center py-12">
                  <FaSearch className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-600">
                    Nenhum contato encontrado
                  </p>
                </div>
              )}
            </div>

            {/* Footer com Botões */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSelectContactModal(false);
                    setTargetStageForContact(null);
                    setSelectedContactsToConvert([]);
                    setSearchContactTerm('');
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConvertSelectedContacts}
                  disabled={selectedContactsToConvert.length === 0}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                    selectedContactsToConvert.length > 0
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-600 cursor-not-allowed'
                  }`}
                >
                  Adicionar {selectedContactsToConvert.length > 0 ? `(${selectedContactsToConvert.length})` : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Card */}
      {showEditModal && leadToEdit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Editar Lead
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setLeadToEdit(null);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-600" />
                </button>
              </div>
            </div>

            {/* Formulário */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={leadToEdit.nome}
                    onChange={(e) => setLeadToEdit({ ...leadToEdit, nome: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={leadToEdit.telefone}
                    onChange={(e) => setLeadToEdit({ ...leadToEdit, telefone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={leadToEdit.email}
                    onChange={(e) => setLeadToEdit({ ...leadToEdit, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    value={leadToEdit.valor}
                    onChange={(e) => setLeadToEdit({ ...leadToEdit, valor: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Origem
                  </label>
                  <select
                    value={leadToEdit.origem}
                    onChange={(e) => setLeadToEdit({ ...leadToEdit, origem: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {origens.map(origem => (
                      <option key={origem} value={origem}>{origem}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleToggleCardTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        leadToEdit.tags.includes(tag)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveCardEdit}
                  disabled={!leadToEdit.nome || !leadToEdit.email}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Salvar Alterações
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setLeadToEdit(null);
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

      {/* Modal Adicionar Novo Lead */}
      {showAddLeadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Adicionar Novo Lead
                </h2>
                <button
                  onClick={() => setShowAddLeadModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 dark:text-gray-600" />
                </button>
              </div>
            </div>

            {/* Formulário */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={newLead.nome}
                    onChange={(e) => setNewLead({ ...newLead, nome: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Nome do lead"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={newLead.telefone}
                    onChange={(e) => setNewLead({ ...newLead, telefone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="+55 (11) 99999-9999"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    value={newLead.valor}
                    onChange={(e) => setNewLead({ ...newLead, valor: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Origem
                  </label>
                  <select
                    value={newLead.origem}
                    onChange={(e) => setNewLead({ ...newLead, origem: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {origens.map(origem => (
                      <option key={origem} value={origem}>{origem}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleToggleNewLeadTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        newLead.tags.includes(tag)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddNewLead}
                  disabled={!newLead.nome || !newLead.email}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Adicionar Lead
                </button>
                <button
                  onClick={() => setShowAddLeadModal(false)}
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
    </div>
  );
};

export default CRM;
