import React, { useState } from 'react';
import {
  FaBook,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaSave,
  FaFolder,
  FaTags,
  FaChartBar,
  FaCog,
  FaFileAlt,
  FaGlobe,
  FaLock,
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaList,
  FaTh,
  FaSort,
  FaFilter,
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaLink,
  FaImage,
  FaCode,
  FaQuoteRight
} from 'react-icons/fa';
import { useAppContext } from './contexts/AppContext';
import UpgradeBanner from './components/UpgradeBanner';

const KnowledgeBase = ({ onNavigate }) => {
  const { getCurrentPlan } = useAppContext();
  const currentPlan = getCurrentPlan();
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(!currentPlan.hasHelpCenter);
  // Estados principais
  const [activeView, setActiveView] = useState('artigos'); // 'artigos', 'categorias', 'estatisticas', 'configuracoes'
  const [viewMode, setViewMode] = useState('lista'); // 'lista' ou 'grade'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('todas');
  const [filterStatus, setFilterStatus] = useState('todos'); // 'todos', 'publicado', 'rascunho'
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Estado do site público
  const [sitePublicoAtivo, setSitePublicoAtivo] = useState(true);
  const [urlPersonalizada, setUrlPersonalizada] = useState('ajuda.plataforma.com');

  // Estado de categorias
  const [categories, setCategories] = useState([
    {
      id: 1,
      nome: 'Primeiros Passos',
      slug: 'primeiros-passos',
      descricao: 'Tudo que você precisa para começar',
      icon: '🚀',
      cor: '#9333ea',
      artigos: 5,
      visibilidade: 'publico'
    },
    {
      id: 2,
      nome: 'Integrações',
      slug: 'integracoes',
      descricao: 'Conecte suas ferramentas favoritas',
      icon: '🔌',
      cor: '#3b82f6',
      artigos: 8,
      visibilidade: 'publico'
    },
    {
      id: 3,
      nome: 'Automações',
      slug: 'automacoes',
      descricao: 'Automatize seus processos',
      icon: '⚡',
      cor: '#10b981',
      artigos: 12,
      visibilidade: 'publico'
    },
    {
      id: 4,
      nome: 'Relatórios',
      slug: 'relatorios',
      descricao: 'Análise de dados e métricas',
      icon: '📊',
      cor: '#f59e0b',
      artigos: 6,
      visibilidade: 'publico'
    },
    {
      id: 5,
      nome: 'Configurações',
      slug: 'configuracoes',
      descricao: 'Personalize sua conta',
      icon: '⚙️',
      cor: '#6366f1',
      artigos: 4,
      visibilidade: 'privado'
    }
  ]);

  // Estado de artigos
  const [articles, setArticles] = useState([
    {
      id: 1,
      titulo: 'Como conectar o WhatsApp',
      slug: 'como-conectar-whatsapp',
      categoria: 2,
      conteudo: '<h2>Conectando WhatsApp</h2><p>Siga estes passos para conectar seu WhatsApp...</p>',
      resumo: 'Aprenda a conectar sua conta do WhatsApp em poucos passos',
      tags: ['whatsapp', 'integração', 'tutorial'],
      autor: 'Henrique Oliveira',
      status: 'publicado',
      visibilidade: 'publico',
      visualizacoes: 1247,
      util: 45,
      naoUtil: 3,
      criadoEm: '2026-01-15T10:00:00',
      atualizadoEm: '2026-02-20T14:30:00',
      publicadoEm: '2026-01-15T12:00:00'
    },
    {
      id: 2,
      titulo: 'Configurando automações de boas-vindas',
      slug: 'configurando-automacoes-boas-vindas',
      categoria: 3,
      conteudo: '<h2>Automações de Boas-vindas</h2><p>Configure mensagens automáticas...</p>',
      resumo: 'Configure mensagens automáticas para novos contatos',
      tags: ['automação', 'mensagens', 'boas-vindas'],
      autor: 'Henrique Oliveira',
      status: 'publicado',
      visibilidade: 'publico',
      visualizacoes: 892,
      util: 38,
      naoUtil: 2,
      criadoEm: '2026-01-18T09:00:00',
      atualizadoEm: '2026-02-18T16:00:00',
      publicadoEm: '2026-01-18T10:00:00'
    },
    {
      id: 3,
      titulo: 'Integrando com Kiwify',
      slug: 'integrando-kiwify',
      categoria: 2,
      conteudo: '<h2>Integração Kiwify</h2><p>Conecte sua conta Kiwify...</p>',
      resumo: 'Sincronize suas vendas automaticamente',
      tags: ['kiwify', 'integração', 'vendas'],
      autor: 'Henrique Oliveira',
      status: 'rascunho',
      visibilidade: 'publico',
      visualizacoes: 0,
      util: 0,
      naoUtil: 0,
      criadoEm: '2026-02-20T11:00:00',
      atualizadoEm: '2026-02-23T15:00:00',
      publicadoEm: null
    },
    {
      id: 4,
      titulo: 'Criando relatórios personalizados',
      slug: 'criando-relatorios-personalizados',
      categoria: 4,
      conteudo: '<h2>Relatórios Personalizados</h2><p>Crie relatórios sob medida...</p>',
      resumo: 'Gere relatórios customizados com suas métricas',
      tags: ['relatórios', 'analytics', 'métricas'],
      autor: 'Henrique Oliveira',
      status: 'publicado',
      visibilidade: 'publico',
      visualizacoes: 654,
      util: 29,
      naoUtil: 1,
      criadoEm: '2026-01-22T14:00:00',
      atualizadoEm: '2026-02-15T10:00:00',
      publicadoEm: '2026-01-22T16:00:00'
    },
    {
      id: 5,
      titulo: 'Gerenciamento de equipe',
      slug: 'gerenciamento-equipe',
      categoria: 5,
      conteudo: '<h2>Gerenciar Equipe</h2><p>Adicione membros e defina permissões...</p>',
      resumo: 'Configure sua equipe e defina permissões de acesso',
      tags: ['equipe', 'permissões', 'configurações'],
      autor: 'Henrique Oliveira',
      status: 'publicado',
      visibilidade: 'privado',
      visualizacoes: 234,
      util: 12,
      naoUtil: 0,
      criadoEm: '2026-01-25T13:00:00',
      atualizadoEm: '2026-02-10T11:00:00',
      publicadoEm: '2026-01-25T14:00:00'
    }
  ]);

  // Estado do formulário de artigo
  const [articleForm, setArticleForm] = useState({
    titulo: '',
    categoria: '',
    conteudo: '',
    resumo: '',
    tags: [],
    status: 'rascunho',
    visibilidade: 'publico'
  });

  // Estado do formulário de categoria
  const [categoryForm, setCategoryForm] = useState({
    nome: '',
    descricao: '',
    icon: '📁',
    cor: '#9333ea',
    visibilidade: 'publico'
  });

  // Filtrar artigos
  const filteredArticles = articles.filter(article => {
    const matchSearch = article.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       article.resumo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchCategory = filterCategory === 'todas' || article.categoria === parseInt(filterCategory);
    const matchStatus = filterStatus === 'todos' || article.status === filterStatus;

    return matchSearch && matchCategory && matchStatus;
  });

  // Funções de manipulação
  const handleCreateArticle = () => {
    setEditingArticle(null);
    setArticleForm({
      titulo: '',
      categoria: '',
      conteudo: '',
      resumo: '',
      tags: [],
      status: 'rascunho',
      visibilidade: 'publico'
    });
    setShowModal(true);
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setArticleForm({
      titulo: article.titulo,
      categoria: article.categoria,
      conteudo: article.conteudo,
      resumo: article.resumo,
      tags: article.tags,
      status: article.status,
      visibilidade: article.visibilidade
    });
    setShowModal(true);
  };

  const handleSaveArticle = () => {
    if (editingArticle) {
      // Editar artigo existente
      setArticles(articles.map(a =>
        a.id === editingArticle.id
          ? {
              ...a,
              ...articleForm,
              atualizadoEm: new Date().toISOString(),
              publicadoEm: articleForm.status === 'publicado' && !a.publicadoEm ? new Date().toISOString() : a.publicadoEm
            }
          : a
      ));
    } else {
      // Criar novo artigo
      const newArticle = {
        id: articles.length + 1,
        ...articleForm,
        slug: articleForm.titulo.toLowerCase().replace(/\s+/g, '-'),
        autor: 'Henrique Oliveira',
        visualizacoes: 0,
        util: 0,
        naoUtil: 0,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
        publicadoEm: articleForm.status === 'publicado' ? new Date().toISOString() : null
      };
      setArticles([...articles, newArticle]);
    }
    setShowModal(false);
  };

  const handleDeleteArticle = (id) => {
    if (confirm('Tem certeza que deseja excluir este artigo?')) {
      setArticles(articles.filter(a => a.id !== id));
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      nome: '',
      descricao: '',
      icon: '📁',
      cor: '#9333ea',
      visibilidade: 'publico'
    });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      setCategories(categories.map(c =>
        c.id === editingCategory.id
          ? { ...c, ...categoryForm }
          : c
      ));
    } else {
      const newCategory = {
        id: categories.length + 1,
        ...categoryForm,
        slug: categoryForm.nome.toLowerCase().replace(/\s+/g, '-'),
        artigos: 0
      };
      setCategories([...categories, newCategory]);
    }
    setShowCategoryModal(false);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.nome : 'Sem categoria';
  };

  const getStatusColor = (status) => {
    return status === 'publicado' ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100';
  };

  const getVisibilityIcon = (visibility) => {
    return visibility === 'publico' ? <FaGlobe className="text-blue-500" /> : <FaLock className="text-gray-500" />;
  };

  // Estatísticas gerais
  const stats = {
    totalArtigos: articles.length,
    publicados: articles.filter(a => a.status === 'publicado').length,
    rascunhos: articles.filter(a => a.status === 'rascunho').length,
    visualizacoesTotal: articles.reduce((sum, a) => sum + a.visualizacoes, 0),
    utilTotal: articles.reduce((sum, a) => sum + a.util, 0),
    categorias: categories.length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <FaBook className="text-white text-xl" />
                </div>
                Base de Conhecimento
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Crie, organize e compartilhe artigos de ajuda
              </p>
            </div>
            <button
              onClick={handleCreateArticle}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <FaPlus />
              <span className="font-semibold">Novo Artigo</span>
            </button>
          </div>

          {/* Navegação de Abas */}
          <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveView('artigos')}
              className={`px-4 py-3 font-semibold transition-all ${
                activeView === 'artigos'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-purple-600'
              }`}
            >
              <FaFileAlt className="inline mr-2" />
              Artigos
            </button>
            <button
              onClick={() => setActiveView('categorias')}
              className={`px-4 py-3 font-semibold transition-all ${
                activeView === 'categorias'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-purple-600'
              }`}
            >
              <FaFolder className="inline mr-2" />
              Categorias
            </button>
            <button
              onClick={() => setActiveView('estatisticas')}
              className={`px-4 py-3 font-semibold transition-all ${
                activeView === 'estatisticas'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-purple-600'
              }`}
            >
              <FaChartBar className="inline mr-2" />
              Estatísticas
            </button>
            <button
              onClick={() => setActiveView('configuracoes')}
              className={`px-4 py-3 font-semibold transition-all ${
                activeView === 'configuracoes'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-purple-600'
              }`}
            >
              <FaCog className="inline mr-2" />
              Configurações
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Vista de Artigos */}
        {activeView === 'artigos' && (
          <div>
            {/* Barra de Ferramentas */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Busca */}
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar artigos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Filtros */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="todas">Todas as categorias</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                  ))}
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="todos">Todos os status</option>
                  <option value="publicado">Publicados</option>
                  <option value="rascunho">Rascunhos</option>
                </select>

                {/* Modo de Visualização */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('lista')}
                    className={`p-3 rounded-xl transition-all ${
                      viewMode === 'lista'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <FaList />
                  </button>
                  <button
                    onClick={() => setViewMode('grade')}
                    className={`p-3 rounded-xl transition-all ${
                      viewMode === 'grade'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <FaTh />
                  </button>
                </div>
              </div>
            </div>

            {/* Lista/Grade de Artigos */}
            {viewMode === 'lista' ? (
              <div className="space-y-4">
                {filteredArticles.map(article => (
                  <div
                    key={article.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {article.titulo}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(article.status)}`}>
                            {article.status === 'publicado' ? 'Publicado' : 'Rascunho'}
                          </span>
                          {getVisibilityIcon(article.visibilidade)}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {article.resumo}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <FaFolder className="text-purple-500" />
                            {getCategoryName(article.categoria)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaEye />
                            {article.visualizacoes} visualizações
                          </span>
                          <span className="flex items-center gap-1">
                            <FaCheckCircle className="text-green-500" />
                            {article.util} útil
                          </span>
                          <span className="flex items-center gap-1">
                            <FaClock />
                            {new Date(article.atualizadoEm).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          {article.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditArticle(article)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          title="Excluir"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map(article => (
                  <div
                    key={article.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(article.status)}`}>
                        {article.status === 'publicado' ? 'Publicado' : 'Rascunho'}
                      </span>
                      {getVisibilityIcon(article.visibilidade)}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {article.titulo}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {article.resumo}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-4">
                      <div className="flex items-center gap-2">
                        <FaFolder className="text-purple-500" />
                        {getCategoryName(article.categoria)}
                      </div>
                      <div className="flex items-center gap-2">
                        <FaEye />
                        {article.visualizacoes} visualizações
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => handleEditArticle(article)}
                        className="flex-1 px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all text-sm font-semibold"
                      >
                        <FaEdit className="inline mr-1" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
                        className="flex-1 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all text-sm font-semibold"
                      >
                        <FaTrash className="inline mr-1" />
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <FaFileAlt className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Nenhum artigo encontrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Tente ajustar os filtros ou criar um novo artigo
                </p>
              </div>
            )}
          </div>
        )}

        {/* Vista de Categorias */}
        {activeView === 'categorias' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Categorias
              </h2>
              <button
                onClick={handleCreateCategory}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <FaPlus />
                Nova Categoria
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => (
                <div
                  key={category.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                  style={{ borderLeft: `4px solid ${category.cor}` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{category.icon}</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {category.nome}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {category.artigos} artigos
                        </p>
                      </div>
                    </div>
                    {getVisibilityIcon(category.visibilidade)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {category.descricao}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setCategoryForm(category);
                        setShowCategoryModal(true);
                      }}
                      className="flex-1 px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all text-sm font-semibold"
                    >
                      <FaEdit className="inline mr-1" />
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vista de Estatísticas */}
        {activeView === 'estatisticas' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Estatísticas da Base de Conhecimento
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <FaFileAlt className="text-3xl text-purple-500" />
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.totalArtigos}
                  </span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 font-semibold">
                  Total de Artigos
                </h3>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <FaCheckCircle className="text-3xl text-green-500" />
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.publicados}
                  </span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 font-semibold">
                  Artigos Publicados
                </h3>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <FaExclamationCircle className="text-3xl text-yellow-500" />
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.rascunhos}
                  </span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 font-semibold">
                  Rascunhos
                </h3>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <FaEye className="text-3xl text-blue-500" />
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.visualizacoesTotal.toLocaleString()}
                  </span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 font-semibold">
                  Visualizações Totais
                </h3>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <FaCheckCircle className="text-3xl text-emerald-500" />
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.utilTotal}
                  </span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 font-semibold">
                  Avaliações Positivas
                </h3>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <FaFolder className="text-3xl text-orange-500" />
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.categorias}
                  </span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 font-semibold">
                  Categorias
                </h3>
              </div>
            </div>

            {/* Top Artigos */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Artigos Mais Visualizados
              </h3>
              <div className="space-y-3">
                {articles
                  .sort((a, b) => b.visualizacoes - a.visualizacoes)
                  .slice(0, 5)
                  .map((article, idx) => (
                    <div
                      key={article.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {article.titulo}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {getCategoryName(article.categoria)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {article.visualizacoes}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          visualizações
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Vista de Configurações */}
        {activeView === 'configuracoes' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Configurações da Base de Conhecimento
            </h2>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Configurações Gerais
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Nome da Base de Conhecimento
                    </label>
                    <input
                      type="text"
                      defaultValue="Central de Ajuda"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      URL Personalizada
                    </label>
                    <input
                      type="text"
                      defaultValue="ajuda.plataforma.com"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Permitir avaliação de artigos
                      </span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Mostrar data de atualização
                      </span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Requerer login para visualizar artigos privados
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Site Público */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-2 border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <FaGlobe className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Site Público de Ajuda
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Estilo Crisp Help Center
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sitePublicoAtivo}
                      onChange={(e) => setSitePublicoAtivo(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-purple-600"></div>
                  </label>
                </div>

                {sitePublicoAtivo && (
                  <div className="space-y-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-4 rounded-lg">
                      <p className="text-sm text-purple-900 dark:text-purple-200">
                        ✨ <strong>Site ativo!</strong> Seus artigos publicados estão disponíveis publicamente.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        URL do Site Público
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                            https://
                          </span>
                          <input
                            type="text"
                            value={urlPersonalizada}
                            onChange={(e) => setUrlPersonalizada(e.target.value)}
                            className="w-full pl-20 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                          />
                        </div>
                        <button
                          onClick={() => onNavigate && onNavigate('help-center')}
                          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold whitespace-nowrap"
                        >
                          <FaEye className="inline mr-2" />
                          Visualizar Site
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Esta será a URL pública da sua central de ajuda
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <FaCode className="text-purple-500" />
                        Integração com Widget
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Quando o site público está ativo, um botão "FAQ" aparece automaticamente no widget de chat, redirecionando para a central de ajuda.
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <FaCheckCircle className="text-green-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Widget integrado automaticamente
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                          {articles.filter(a => a.status === 'publicado').length}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Artigos Públicos
                        </p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                          {categories.filter(c => c.visibilidade === 'publico').length}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Categorias Públicas
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!sitePublicoAtivo && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Ative o site público para disponibilizar seus artigos em uma central de ajuda estilo Crisp
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Aparência
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Cor Principal
                    </label>
                    <input
                      type="color"
                      defaultValue="#9333ea"
                      className="w-20 h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Logo
                    </label>
                    <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                      Fazer Upload
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Artigo */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingArticle ? 'Editar Artigo' : 'Novo Artigo'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Título do Artigo *
                </label>
                <input
                  type="text"
                  value={articleForm.titulo}
                  onChange={(e) => setArticleForm({ ...articleForm, titulo: e.target.value })}
                  placeholder="Ex: Como conectar o WhatsApp"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Categoria *
                  </label>
                  <select
                    value={articleForm.categoria}
                    onChange={(e) => setArticleForm({ ...articleForm, categoria: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={articleForm.status}
                    onChange={(e) => setArticleForm({ ...articleForm, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="rascunho">Rascunho</option>
                    <option value="publicado">Publicado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Resumo
                </label>
                <textarea
                  value={articleForm.resumo}
                  onChange={(e) => setArticleForm({ ...articleForm, resumo: e.target.value })}
                  placeholder="Breve descrição do artigo"
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Conteúdo do Artigo *
                </label>
                <div className="border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
                  {/* Barra de Ferramentas do Editor */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-2 border-b border-gray-300 dark:border-gray-600 flex gap-1">
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="Negrito">
                      <FaBold />
                    </button>
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="Itálico">
                      <FaItalic />
                    </button>
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="Sublinhado">
                      <FaUnderline />
                    </button>
                    <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="Lista">
                      <FaListUl />
                    </button>
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="Lista numerada">
                      <FaListOl />
                    </button>
                    <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="Link">
                      <FaLink />
                    </button>
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="Imagem">
                      <FaImage />
                    </button>
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="Código">
                      <FaCode />
                    </button>
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="Citação">
                      <FaQuoteRight />
                    </button>
                  </div>
                  <textarea
                    value={articleForm.conteudo}
                    onChange={(e) => setArticleForm({ ...articleForm, conteudo: e.target.value })}
                    placeholder="Escreva o conteúdo do artigo aqui..."
                    rows={12}
                    className="w-full px-4 py-3 border-0 focus:ring-0 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tags (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={articleForm.tags.join(', ')}
                  onChange={(e) => setArticleForm({
                    ...articleForm,
                    tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                  })}
                  placeholder="Ex: whatsapp, tutorial, integração"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Visibilidade
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="visibilidade"
                      value="publico"
                      checked={articleForm.visibilidade === 'publico'}
                      onChange={(e) => setArticleForm({ ...articleForm, visibilidade: e.target.value })}
                      className="text-purple-600"
                    />
                    <FaGlobe className="text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">Público</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="visibilidade"
                      value="privado"
                      checked={articleForm.visibilidade === 'privado'}
                      onChange={(e) => setArticleForm({ ...articleForm, visibilidade: e.target.value })}
                      className="text-purple-600"
                    />
                    <FaLock className="text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">Privado</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveArticle}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
              >
                <FaSave className="inline mr-2" />
                Salvar Artigo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Categoria */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full">
            <div className="border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  value={categoryForm.nome}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nome: e.target.value })}
                  placeholder="Ex: Primeiros Passos"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  value={categoryForm.descricao}
                  onChange={(e) => setCategoryForm({ ...categoryForm, descricao: e.target.value })}
                  placeholder="Breve descrição da categoria"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Ícone
                  </label>
                  <input
                    type="text"
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                    placeholder="Ex: 🚀"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white text-2xl text-center"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Cor
                  </label>
                  <input
                    type="color"
                    value={categoryForm.cor}
                    onChange={(e) => setCategoryForm({ ...categoryForm, cor: e.target.value })}
                    className="w-full h-12 rounded-xl cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Visibilidade
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="cat-visibilidade"
                      value="publico"
                      checked={categoryForm.visibilidade === 'publico'}
                      onChange={(e) => setCategoryForm({ ...categoryForm, visibilidade: e.target.value })}
                      className="text-purple-600"
                    />
                    <FaGlobe className="text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">Público</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="cat-visibilidade"
                      value="privado"
                      checked={categoryForm.visibilidade === 'privado'}
                      onChange={(e) => setCategoryForm({ ...categoryForm, visibilidade: e.target.value })}
                      className="text-purple-600"
                    />
                    <FaLock className="text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">Privado</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex gap-3">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCategory}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
              >
                <FaSave className="inline mr-2" />
                Salvar Categoria
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Banner */}
      {showUpgradeBanner && (
        <UpgradeBanner
          feature="Help Center Profissional Completo"
          requiredPlan="Enterprise"
          onClose={() => setShowUpgradeBanner(false)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};

export default KnowledgeBase;
