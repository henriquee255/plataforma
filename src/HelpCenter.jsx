import React, { useState } from 'react';
import {
  FaSearch,
  FaBook,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaHome,
  FaChevronRight,
  FaEnvelope,
  FaComments,
  FaLightbulb
} from 'react-icons/fa';

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [helpful, setHelpful] = useState(null);

  // Dados simulados (em produção viriam da Base de Conhecimento)
  const categories = [
    {
      id: 1,
      nome: 'Primeiros Passos',
      slug: 'primeiros-passos',
      descricao: 'Tudo que você precisa para começar',
      icon: '🚀',
      cor: '#9333ea',
      artigos: 5
    },
    {
      id: 2,
      nome: 'Integrações',
      slug: 'integracoes',
      descricao: 'Conecte suas ferramentas favoritas',
      icon: '🔌',
      cor: '#3b82f6',
      artigos: 8
    },
    {
      id: 3,
      nome: 'Automações',
      slug: 'automacoes',
      descricao: 'Automatize seus processos',
      icon: '⚡',
      cor: '#10b981',
      artigos: 12
    },
    {
      id: 4,
      nome: 'Relatórios',
      slug: 'relatorios',
      descricao: 'Análise de dados e métricas',
      icon: '📊',
      cor: '#f59e0b',
      artigos: 6
    },
    {
      id: 5,
      nome: 'Configurações',
      slug: 'configuracoes',
      descricao: 'Personalize sua conta',
      icon: '⚙️',
      cor: '#6366f1',
      artigos: 4
    },
    {
      id: 6,
      nome: 'Segurança',
      slug: 'seguranca',
      descricao: 'Proteja seus dados',
      icon: '🔒',
      cor: '#ef4444',
      artigos: 3
    }
  ];

  const articles = [
    {
      id: 1,
      titulo: 'Como conectar o WhatsApp',
      slug: 'como-conectar-whatsapp',
      categoria: 2,
      resumo: 'Aprenda a conectar sua conta do WhatsApp em poucos passos',
      conteudo: `
        <h2>Conectando WhatsApp</h2>
        <p>Siga estes passos para conectar seu WhatsApp à plataforma:</p>

        <h3>Passo 1: Acesse Conexões</h3>
        <p>No menu lateral, clique em "Conexões".</p>

        <h3>Passo 2: Selecione WhatsApp</h3>
        <p>Escolha entre WhatsApp QR Code (gratuito) ou WhatsApp API (premium).</p>

        <h3>Passo 3: Escaneie o QR Code</h3>
        <p>Use seu celular para escanear o código QR que aparecerá na tela.</p>

        <h3>Passo 4: Pronto!</h3>
        <p>Seu WhatsApp está conectado e pronto para uso.</p>
      `,
      visualizacoes: 1247,
      atualizadoEm: '2026-02-20T14:30:00'
    },
    {
      id: 2,
      titulo: 'Configurando automações de boas-vindas',
      slug: 'configurando-automacoes-boas-vindas',
      categoria: 3,
      resumo: 'Configure mensagens automáticas para novos contatos',
      conteudo: `
        <h2>Automações de Boas-vindas</h2>
        <p>Configure mensagens automáticas para dar boas-vindas aos seus novos contatos.</p>

        <h3>O que você precisa</h3>
        <ul>
          <li>WhatsApp conectado</li>
          <li>Mensagem de boas-vindas pronta</li>
        </ul>

        <h3>Como configurar</h3>
        <ol>
          <li>Acesse a seção de Automações</li>
          <li>Clique em "Nova Automação"</li>
          <li>Selecione o gatilho "Novo Contato"</li>
          <li>Configure sua mensagem</li>
          <li>Ative a automação</li>
        </ol>
      `,
      visualizacoes: 892,
      atualizadoEm: '2026-02-18T16:00:00'
    },
    {
      id: 3,
      titulo: 'Integrando com Kiwify',
      slug: 'integrando-kiwify',
      categoria: 2,
      resumo: 'Sincronize suas vendas automaticamente',
      conteudo: `
        <h2>Integração Kiwify</h2>
        <p>Conecte sua conta Kiwify para sincronizar vendas automaticamente.</p>

        <h3>Requisitos</h3>
        <ul>
          <li>Conta ativa na Kiwify</li>
          <li>API Key da Kiwify</li>
        </ul>

        <h3>Configuração</h3>
        <ol>
          <li>Acesse Integrações no menu</li>
          <li>Selecione Kiwify</li>
          <li>Cole sua API Key</li>
          <li>Configure os webhooks</li>
        </ol>
      `,
      visualizacoes: 654,
      atualizadoEm: '2026-02-15T10:00:00'
    }
  ];

  const filteredArticles = selectedCategory
    ? articles.filter(a => a.categoria === selectedCategory.id)
    : searchTerm
    ? articles.filter(a =>
        a.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.resumo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.nome : '';
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setHelpful(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (selectedArticle) {
      setSelectedArticle(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  const handleHomeClick = () => {
    setSelectedCategory(null);
    setSelectedArticle(null);
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Estilo Crisp */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleHomeClick}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <FaBook className="text-white text-lg" />
              </div>
              <div className="text-left">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Central de Ajuda
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Plataforma
                </p>
              </div>
            </button>

            {/* Breadcrumb Melhorado */}
            {(selectedCategory || selectedArticle) && (
              <div className="hidden md:flex items-center gap-2 text-sm">
                <button
                  onClick={handleHomeClick}
                  className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                >
                  <FaHome className="text-base" />
                </button>
                {selectedCategory && (
                  <>
                    <FaChevronRight className="text-xs text-gray-300 dark:text-gray-600" />
                    <button
                      onClick={() => setSelectedArticle(null)}
                      className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors font-medium"
                    >
                      {selectedCategory.nome}
                    </button>
                  </>
                )}
                {selectedArticle && (
                  <>
                    <FaChevronRight className="text-xs text-gray-300 dark:text-gray-600" />
                    <span className="text-purple-600 dark:text-purple-400 font-semibold truncate max-w-[200px]">
                      {selectedArticle.titulo}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6">
        {/* Hero Section Estilo Crisp - Apenas na home */}
        {!selectedCategory && !selectedArticle && (
          <div className="text-center py-16">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Como podemos <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400">ajudar</span> você?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              Busque por respostas ou navegue pelos tópicos abaixo
            </p>

            {/* Barra de Busca Estilo Crisp */}
            <div className="max-w-2xl mx-auto relative mb-16">
              <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
              <input
                type="text"
                placeholder="Digite sua dúvida..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-5 text-lg border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white shadow-sm transition-all"
              />
            </div>

            {/* Grid de Categorias Estilo Crisp */}
            {!searchTerm && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-left">
                  Navegue por tópicos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category)}
                      className="group bg-white dark:bg-gray-800 rounded-2xl p-8 text-left transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1"
                    >
                      <div className="mb-4">
                        <span className="text-5xl">{category.icon}</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {category.nome}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {category.descricao}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-500">
                          {category.artigos} artigos
                        </span>
                        <FaArrowRight className="text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Resultados da Busca */}
            {searchTerm && filteredArticles.length > 0 && (
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Resultados para "{searchTerm}"
                </h3>
                <div className="space-y-4">
                  {filteredArticles.map(article => (
                    <button
                      key={article.id}
                      onClick={() => handleArticleClick(article)}
                      className="w-full group bg-white dark:bg-gray-800 rounded-xl p-6 text-left transition-all border border-gray-100 dark:border-gray-800 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full">
                              {getCategoryName(article.categoria)}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-2">
                            {article.titulo}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                            {article.resumo}
                          </p>
                        </div>
                        <FaArrowRight className="text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchTerm && filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <FaSearch className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Tente pesquisar com outras palavras-chave
                </p>
              </div>
            )}
          </div>
        )}

        {/* Lista de Artigos da Categoria */}
        {selectedCategory && !selectedArticle && (
          <div className="py-12">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:gap-3 transition-all mb-8 font-semibold"
            >
              ← Voltar
            </button>

            <div className="mb-12 pb-8 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-6 mb-4">
                <span className="text-7xl">{selectedCategory.icon}</span>
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedCategory.nome}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {selectedCategory.descricao}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredArticles.map(article => (
                <button
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className="w-full group bg-white dark:bg-gray-800 rounded-xl p-6 text-left transition-all border border-gray-100 dark:border-gray-800 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-2">
                        {article.titulo}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {article.resumo}
                      </p>
                    </div>
                    <FaArrowRight className="text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Visualização do Artigo */}
        {selectedArticle && (
          <div className="py-12">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:gap-3 transition-all mb-8 font-semibold"
            >
              ← Voltar
            </button>

            <article className="bg-white dark:bg-gray-800 rounded-2xl p-10 md:p-16 border border-gray-100 dark:border-gray-800">
              <header className="mb-10 pb-8 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-full uppercase tracking-wider">
                    {getCategoryName(selectedArticle.categoria)}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  {selectedArticle.titulo}
                </h1>
                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-2">
                    <FaClock />
                    Atualizado em {new Date(selectedArticle.atualizadoEm).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </header>

              <div
                className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-code:text-purple-600 dark:prose-code:text-purple-400"
                dangerouslySetInnerHTML={{ __html: selectedArticle.conteudo }}
              />

              {/* Feedback Section */}
              <div className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-800">
                <div className="text-center bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-10">
                  <p className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Este artigo foi útil?
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setHelpful(true)}
                      className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all ${
                        helpful === true
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-green-500 hover:text-green-600 dark:hover:text-green-400'
                      }`}
                    >
                      <FaCheckCircle className="text-xl" />
                      Sim, ajudou!
                    </button>
                    <button
                      onClick={() => setHelpful(false)}
                      className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all ${
                        helpful === false
                          ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400'
                      }`}
                    >
                      <FaLightbulb className="text-xl" />
                      Não ajudou
                    </button>
                  </div>
                  {helpful !== null && (
                    <div className="mt-6">
                      <p className="text-base text-gray-600 dark:text-gray-400">
                        {helpful ? '✨ Obrigado pelo feedback!' : '🙏 Vamos melhorar este artigo!'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </article>
          </div>
        )}
      </div>

      {/* Footer Estilo Crisp */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-20">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ainda precisa de ajuda?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Nossa equipe está sempre pronta para ajudar você
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-xl hover:shadow-purple-500/30 transition-all font-semibold text-lg">
                <FaComments className="text-xl group-hover:scale-110 transition-transform" />
                Iniciar Chat
              </button>
              <button className="group flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 transition-all font-semibold text-lg">
                <FaEnvelope className="text-xl group-hover:scale-110 transition-transform" />
                Enviar Email
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2026 Plataforma. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HelpCenter;
