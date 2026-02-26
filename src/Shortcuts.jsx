import React, { useEffect, useState } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaBolt,
  FaSearch,
  FaTimes,
  FaCheck,
  FaGlobe,
  FaUser,
  FaLayerGroup,
  FaFilter
} from 'react-icons/fa';
import { useAppContext } from './contexts/AppContext';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const emptyForm = {
  shortcut: '',
  title: '',
  content: '',
  scope: 'global',
  user_id: null,
  sector_id: null,
  setor: 'geral', // Campo setor adicionado
};

const SCOPE_TABS = [
  { value: 'all', label: 'Todas', icon: FaLayerGroup, color: 'text-gray-600 dark:text-gray-400' },
  { value: 'global', label: 'Global', icon: FaGlobe, color: 'text-purple-600 dark:text-purple-400' },
  { value: 'sector', label: 'Por Setor', icon: FaLayerGroup, color: 'text-emerald-600 dark:text-emerald-400' },
  { value: 'individual', label: 'Individual', icon: FaUser, color: 'text-orange-600 dark:text-orange-400' },
];

const SCOPE_META = {
  global: { label: 'Global', badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400', icon: FaGlobe },
  sector: { label: 'Setor', badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400', icon: FaLayerGroup },
  individual: { label: 'Individual', badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400', icon: FaUser },
};

const Shortcuts = () => {
  const { userData } = useAppContext();

  // Mock inicial com atalhos distribuídos por setores
  const [replies, setReplies] = useState(() => {
    const saved = localStorage.getItem('shortcutsData');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        shortcut: 'ola',
        title: 'Saudação Inicial',
        content: 'Olá! 👋 Seja bem-vindo(a) à nossa plataforma. Como posso ajudar você hoje?',
        scope: 'global',
        user_id: null,
        sector_id: null,
        setor: 'geral'
      },
      {
        id: '2',
        shortcut: 'horario',
        title: 'Horário de Atendimento',
        content: '⏰ Nosso horário:\n\nSeg-Sex: 9h às 18h\nSábado: 9h às 13h\nDomingo: Fechado',
        scope: 'global',
        user_id: null,
        sector_id: null,
        setor: 'geral'
      },
      // Vendas
      {
        id: '3',
        shortcut: 'proposta',
        title: 'Envio de Proposta',
        content: '📋 Olá! Segue a proposta comercial conforme conversamos.\n\nFico à disposição para esclarecer dúvidas.',
        scope: 'sector',
        user_id: null,
        sector_id: 'vendas',
        setor: 'vendas'
      },
      {
        id: '4',
        shortcut: 'desconto',
        title: 'Consulta Desconto',
        content: '💰 Vou verificar com meu gestor e retorno em breve sobre o desconto solicitado.',
        scope: 'sector',
        user_id: null,
        sector_id: 'vendas',
        setor: 'vendas'
      },
      {
        id: '5',
        shortcut: 'fechamento',
        title: 'Fechamento de Venda',
        content: '🎉 Parabéns pela decisão! Vou gerar seu contrato agora mesmo.',
        scope: 'sector',
        user_id: null,
        sector_id: 'vendas',
        setor: 'vendas'
      },
      // Suporte
      {
        id: '6',
        shortcut: 'ticket',
        title: 'Abertura de Ticket',
        content: '🎫 Ticket criado com sucesso! Número: #{{numero}}\n\nTempo estimado de resposta: 2h úteis',
        scope: 'sector',
        user_id: null,
        sector_id: 'suporte',
        setor: 'suporte'
      },
      {
        id: '7',
        shortcut: 'tutorial',
        title: 'Enviar Tutorial',
        content: '📚 Preparei um tutorial passo a passo para resolver seu problema:\n\n1. Acesse...\n2. Clique em...\n3. Confirme...',
        scope: 'sector',
        user_id: null,
        sector_id: 'suporte',
        setor: 'suporte'
      },
      {
        id: '8',
        shortcut: 'resolvido',
        title: 'Problema Resolvido',
        content: '✅ Seu problema foi resolvido! Caso precise de mais ajuda, estou à disposição.',
        scope: 'sector',
        user_id: null,
        sector_id: 'suporte',
        setor: 'suporte'
      },
      // Financeiro
      {
        id: '9',
        shortcut: 'boleto',
        title: 'Envio de Boleto',
        content: '💳 Segue o boleto para pagamento:\n\nVencimento: {{data}}\nValor: R$ {{valor}}\n\nCódigo de barras: {{codigo}}',
        scope: 'sector',
        user_id: null,
        sector_id: 'financeiro',
        setor: 'financeiro'
      },
      {
        id: '10',
        shortcut: 'cobranca',
        title: 'Lembrete de Cobrança',
        content: '📅 Identificamos uma pendência em aberto:\n\nValor: R$ {{valor}}\nVencimento: {{data}}\n\nPor favor, regularize para manter os serviços ativos.',
        scope: 'sector',
        user_id: null,
        sector_id: 'financeiro',
        setor: 'financeiro'
      },
      {
        id: '11',
        shortcut: 'pagamento',
        title: 'Confirmação de Pagamento',
        content: '✅ Pagamento confirmado!\n\nRecibo enviado para seu email.\nObrigado pela preferência!',
        scope: 'sector',
        user_id: null,
        sector_id: 'financeiro',
        setor: 'financeiro'
      },
      // RH
      {
        id: '12',
        shortcut: 'ferias',
        title: 'Solicitação de Férias',
        content: '🏖️ Sua solicitação de férias foi recebida.\n\nPeríodo: {{periodo}}\nStatus: Em análise\n\nRetorno em até 48h.',
        scope: 'sector',
        user_id: null,
        sector_id: 'rh',
        setor: 'rh'
      },
      {
        id: '13',
        shortcut: 'atestado',
        title: 'Envio de Atestado',
        content: '🏥 Recebemos seu atestado médico.\n\nPrazo: {{dias}} dias\nRegistrado no sistema.',
        scope: 'sector',
        user_id: null,
        sector_id: 'rh',
        setor: 'rh'
      },
      {
        id: '14',
        shortcut: 'onboarding',
        title: 'Boas-vindas Novo Colaborador',
        content: '🎉 Bem-vindo(a) ao time!\n\nSeu acesso foi liberado:\nEmail: {{email}}\nSenha: {{senha}}\n\nMude sua senha no primeiro acesso.',
        scope: 'sector',
        user_id: null,
        sector_id: 'rh',
        setor: 'rh'
      },
      // Individual
      {
        id: '15',
        shortcut: 'meuatalho',
        title: 'Meu Atalho Pessoal',
        content: 'Esta é uma resposta rápida só para mim.',
        scope: 'individual',
        user_id: 'user-1',
        sector_id: null,
        setor: 'geral'
      }
    ];
  });

  const [sectors] = useState([
    { id: 'vendas', name: 'Vendas', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30' },
    { id: 'suporte', name: 'Suporte', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/30' },
    { id: 'financeiro', name: 'Financeiro', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/30' },
    { id: 'rh', name: 'RH', color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-900/30' },
    { id: 'geral', name: 'Geral', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/30' }
  ]);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterSetor, setFilterSetor] = useState('todos'); // Filtro manual de setor

  // Persistir no localStorage sempre que replies mudar
  useEffect(() => {
    localStorage.setItem('shortcutsData', JSON.stringify(replies));
  }, [replies]);

  const filteredReplies = replies.filter(reply => {
    const matchSearch = !search ||
      reply.shortcut.toLowerCase().includes(search.toLowerCase()) ||
      reply.title.toLowerCase().includes(search.toLowerCase()) ||
      reply.content.toLowerCase().includes(search.toLowerCase());

    const matchTab = activeTab === 'all' || reply.scope === activeTab;

    // Filtro por setor baseado no usuário
    let matchSetor = true;

    if (userData.role === 'admin') {
      // Admin vê todos os atalhos (nenhum filtro aplicado automaticamente)
      matchSetor = true;
    } else {
      // Usuário comum: vê apenas atalhos do seu setor + Geral
      const userSetor = userData.setor || 'geral';
      matchSetor = reply.setor === userSetor || reply.setor === 'geral';
    }

    // Filtro manual de dropdown (sobrescreve filtro automático se não for "todos")
    if (filterSetor !== 'todos') {
      matchSetor = reply.setor === filterSetor;
    }

    return matchSearch && matchTab && matchSetor;
  });

  function save() {
    if (!editing || !editing.shortcut || !editing.title || !editing.content) return;
    setSaving(true);

    setTimeout(() => {
      const payload = {
        shortcut: editing.shortcut,
        title: editing.title,
        content: editing.content,
        scope: editing.scope || 'global',
        user_id: editing.scope === 'individual' ? 'user-1' : null,
        sector_id: editing.scope === 'sector' ? editing.sector_id : null,
        setor: editing.setor || 'geral', // Setor adicionado ao payload
      };

      if (editing.id) {
        setReplies(prev => prev.map(r => r.id === editing.id ? { ...r, ...payload } : r));
      } else {
        const newReply = {
          id: Date.now().toString(),
          ...payload,
        };
        setReplies(prev => [...prev, newReply]);
      }
      setEditing(null);
      setSaving(false);
    }, 500);
  }

  function deleteReply(id) {
    if (!window.confirm('Excluir esta resposta rápida?')) return;
    setReplies(prev => prev.filter(r => r.id !== id));
  }

  function openNew() {
    const defaultScope = activeTab === 'all' ? 'global' : activeTab;
    const defaultSetor = userData.role === 'admin' ? 'geral' : (userData.setor || 'geral');
    setEditing({ ...emptyForm, scope: defaultScope, setor: defaultSetor, isNew: true });
  }

  function getSectorName(id) {
    if (!id) return '';
    return sectors.find(s => s.id === id)?.name || id;
  }

  function getSetorBadge(setor) {
    const sectorInfo = sectors.find(s => s.id === setor);
    if (!sectorInfo) return { color: 'text-gray-600', bg: 'bg-gray-50 dark:bg-gray-900/30' };
    return { color: sectorInfo.color, bg: sectorInfo.bg };
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-gray-50/50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Respostas Rápidas</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Use atalhos para enviar mensagens predefinidas no chat</p>
          </div>
          <button
            onClick={openNew}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-purple-100 hover:shadow-xl transition"
          >
            <FaPlus className="w-4 h-4" />
            <span className="whitespace-nowrap">Nova Resposta</span>
          </button>
        </div>

        {/* How-to banner */}
        <div className="bg-purple-50/50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-[2rem] p-5 mb-4 flex gap-3 items-start">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl shrink-0">
            <FaBolt className="w-5 h-5 text-purple-500 dark:text-purple-400" />
          </div>
          <div className="text-sm">
            <p className="font-bold text-gray-800 dark:text-white mb-1">Como usar</p>
            <p className="text-gray-500 dark:text-gray-400">
              No campo de mensagem, digite{' '}
              <code className="bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono text-xs dark:text-gray-300">/atalho</code>{' '}
              para buscar respostas rápidas. Clique para inserir automaticamente.
            </p>
          </div>
        </div>

        {/* Banner de filtro por setor */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 rounded-[2rem] p-5 mb-6 flex gap-3 items-start">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl shrink-0">
            <FaFilter className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="text-sm">
            <p className="font-bold text-gray-800 dark:text-white mb-1">Filtro por Setor</p>
            <p className="text-gray-500 dark:text-gray-400">
              {userData.role === 'admin' ? (
                <>
                  Como <strong>Admin</strong>, você vê todos os atalhos de todos os setores. Use o filtro acima para visualizar atalhos específicos.
                </>
              ) : (
                <>
                  Você está no setor <strong className="text-blue-600 dark:text-blue-400">{getSectorName(userData.setor)}</strong> e vê apenas atalhos do seu setor + <strong>Geral</strong>. Use o filtro para explorar outros setores.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Scope tabs */}
        <div className="flex gap-1 mb-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 rounded-2xl w-fit">
          {SCOPE_TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition',
                  active
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700',
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Scope info strip */}
        {activeTab !== 'all' && (
          <div className={cn(
            'text-xs font-medium px-4 py-2 rounded-xl mb-4 flex items-center gap-2',
            activeTab === 'global' && 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
            activeTab === 'sector' && 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
            activeTab === 'individual' && 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
          )}>
            {activeTab === 'global' && <><FaGlobe className="w-3.5 h-3.5" /> Visível para toda a empresa</>}
            {activeTab === 'sector' && <><FaLayerGroup className="w-3.5 h-3.5" /> Visível apenas para membros do setor selecionado</>}
            {activeTab === 'individual' && <><FaUser className="w-3.5 h-3.5" /> Visível apenas para você</>}
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Buscar respostas..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Dropdown de filtro por setor */}
          <div className="relative">
            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <select
              className="pl-10 pr-10 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium appearance-none cursor-pointer"
              value={filterSetor}
              onChange={e => setFilterSetor(e.target.value)}
            >
              <option value="todos">Todos os Setores</option>
              {sectors.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Info sobre filtro ativo */}
        {userData.role !== 'admin' && filterSetor === 'todos' && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-xl px-4 py-2 mb-4 text-xs text-blue-700 dark:text-blue-400 flex items-center gap-2">
            <FaFilter className="w-3 h-3" />
            <span>Você está vendo atalhos do setor <strong>{getSectorName(userData.setor)}</strong> e <strong>Geral</strong>. Use o filtro acima para ver outros setores.</span>
          </div>
        )}

        {/* Inline edit/create form */}
        {editing && (
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] border-2 border-purple-200 dark:border-purple-800 shadow-md p-6 mb-4">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">{editing.id ? 'Editar Resposta' : 'Nova Resposta'}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">Atalho</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-mono text-sm">/</span>
                    <input
                      className="w-full pl-6 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm font-mono bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      value={editing.shortcut || ''}
                      onChange={e => setEditing({ ...editing, shortcut: e.target.value.replace(/\s/g, '').toLowerCase() })}
                      placeholder="atalho"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">Título</label>
                  <input
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    value={editing.title || ''}
                    onChange={e => setEditing({ ...editing, title: e.target.value })}
                    placeholder="Nome da resposta"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">Conteúdo</label>
                <textarea
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  value={editing.content || ''}
                  onChange={e => setEditing({ ...editing, content: e.target.value })}
                  rows={3}
                  placeholder="Texto da resposta..."
                />
              </div>

              {/* Scope selector */}
              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-2">Visibilidade</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'global', label: 'Global', sub: 'Toda a empresa', icon: FaGlobe, active: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-600', inactive: 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-purple-300 dark:hover:border-purple-600' },
                    { value: 'sector', label: 'Por Setor', sub: 'Membros do setor', icon: FaLayerGroup, active: 'bg-emerald-600 text-white border-emerald-600', inactive: 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-emerald-300 dark:hover:border-emerald-600' },
                    { value: 'individual', label: 'Individual', sub: 'Só para mim', icon: FaUser, active: 'bg-orange-500 text-white border-orange-500', inactive: 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-orange-300 dark:hover:border-orange-600' },
                  ].map(opt => {
                    const Icon = opt.icon;
                    const isActive = editing.scope === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setEditing({ ...editing, scope: opt.value, sector_id: opt.value !== 'sector' ? null : editing.sector_id })}
                        className={cn(
                          'flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-center transition',
                          isActive ? opt.active : opt.inactive,
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs font-bold">{opt.label}</span>
                        <span className={cn('text-[10px]', isActive ? 'text-white/80' : 'text-gray-400')}>{opt.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sector dropdown (only when scope=sector) */}
              {editing.scope === 'sector' && (
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">Setor (Legacy)</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    value={editing.sector_id || ''}
                    onChange={e => setEditing({ ...editing, sector_id: e.target.value || null })}
                  >
                    <option value="">Selecione um setor...</option>
                    {sectors.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Campo de Setor (novo sistema de filtro) */}
              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">Setor do Atalho</label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-medium"
                  value={editing.setor || 'geral'}
                  onChange={e => setEditing({ ...editing, setor: e.target.value })}
                >
                  {sectors.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                  {userData.role === 'admin'
                    ? 'Define qual setor pode visualizar este atalho. "Geral" é visível para todos.'
                    : `Usuários do setor ${getSectorName(editing.setor)} e admins verão este atalho.`
                  }
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-1"
                >
                  <FaTimes className="w-4 h-4" /> Cancelar
                </button>
                <button
                  onClick={save}
                  disabled={saving || !editing.shortcut || !editing.title || !editing.content}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-bold hover:shadow-lg transition disabled:opacity-50 flex items-center gap-1"
                >
                  <FaCheck className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredReplies.length === 0 && !editing ? (
          <div className="text-center py-16">
            <FaBolt className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 dark:text-gray-500 font-medium">Nenhuma resposta rápida</p>
            <button
              onClick={openNew}
              className="mt-3 text-purple-600 dark:text-purple-400 text-sm font-bold hover:underline"
            >
              Criar primeira resposta
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredReplies.map(reply => {
              const scopeMeta = SCOPE_META[reply.scope] || SCOPE_META.global;
              const ScopeIcon = scopeMeta.icon;
              const setorBadge = getSetorBadge(reply.setor);
              return (
                <div
                  key={reply.id}
                  className="bg-white dark:bg-gray-800 rounded-[1.5rem] border border-gray-100 dark:border-gray-700 shadow-sm p-4 flex items-start gap-4 group hover:shadow-md transition-shadow"
                >
                  <div className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800 rounded-xl font-mono text-sm font-bold text-purple-600 dark:text-purple-400 shrink-0">
                    /{reply.shortcut}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p className="font-bold text-gray-800 dark:text-white text-sm">{reply.title}</p>
                      {/* Scope badge */}
                      <span className={cn('inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold', scopeMeta.badge)}>
                        <ScopeIcon className="w-2.5 h-2.5" />
                        {scopeMeta.label}
                        {reply.scope === 'sector' && reply.sector_id && (
                          <span className="opacity-75"> - {getSectorName(reply.sector_id)}</span>
                        )}
                      </span>
                      {/* Badge de Setor */}
                      <span className={cn('inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold border', setorBadge.bg, setorBadge.color)}>
                        <FaLayerGroup className="w-2.5 h-2.5" />
                        {getSectorName(reply.setor)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{reply.content}</p>
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => setEditing(reply)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteReply(reply.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shortcuts;
