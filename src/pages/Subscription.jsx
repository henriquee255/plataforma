import React, { useState } from 'react';
import {
  FaCheck,
  FaRocket,
  FaCrown,
  FaBolt,
  FaInfinity,
  FaChartLine,
  FaUsers,
  FaWhatsapp,
  FaBrain,
  FaSync,
  FaShieldAlt,
  FaHeadset,
  FaBook,
  FaPlug,
  FaCreditCard,
  FaStar,
  FaArrowRight,
  FaCheckCircle,
  FaComments,
  FaFire,
  FaLightbulb,
  FaGem,
  FaAward,
  FaHeart
} from 'react-icons/fa';
import { useAppContext } from '../contexts/AppContext';

const Subscription = ({ onNavigate }) => {
  const { updateSubscription } = useAppContext();
  const [billingCycle, setBillingCycle] = useState('annual'); // 'monthly' or 'annual'

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      icon: FaRocket,
      tagline: 'Ideal para começar',
      description: 'Perfeito para empresas iniciantes',
      monthlyPrice: 97,
      annualPrice: 970, // ~2 meses grátis
      badge: null,
      color: 'from-blue-500 to-cyan-500',
      features: [
        { text: 'Contatos ilimitados', included: true },
        { text: 'Dashboard com métricas em tempo real', included: true },
        { text: 'CRM com pipeline visual drag & drop', included: true },
        { text: 'Até 2 integrações de pagamento', included: true },
        { text: '1 canal de atendimento (WhatsApp OU Instagram)', included: true },
        { text: 'Inbox unificado', included: true },
        { text: 'Gestão de equipe (até 3 membros)', included: true },
        { text: 'Relatórios básicos', included: true },
        { text: 'Suporte', included: true },
        { text: 'Respostas rápidas (atalhos)', included: false },
        { text: 'IA integrada', included: false },
        { text: 'WhatsApp Business API', included: false },
        { text: 'Base de conhecimento + FAQ', included: false },
        { text: 'Múltiplas empresas', included: false },
      ],
      cta: 'Começar agora',
      highlight: false
    },
    {
      id: 'professional',
      name: 'Professional',
      icon: FaCrown,
      tagline: 'Mais escolhido',
      description: 'Solução completa para escalar vendas',
      monthlyPrice: 197,
      annualPrice: 1970, // ~2 meses grátis
      badge: 'MAIS POPULAR',
      badgeColor: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      color: 'from-purple-500 to-indigo-600',
      features: [
        { text: 'Tudo do Starter +', included: true, bold: true },
        { text: 'Kiwify, Hotmart e todas as futuras', included: true, highlight: true },
        { text: 'Integração com todos canais disponíveis', included: true, highlight: true },
        { text: 'WhatsApp Business API integrado', included: true, highlight: true },
        { text: 'Respostas rápidas ilimitadas', included: true },
        { text: 'Widget de atendimento para seu site', included: true },
        { text: 'Criar uma empresa', included: true },
        { text: 'Gestão de equipe ilimitada', included: true },
        { text: 'Relatórios básicos avançados', included: true },
        { text: 'Rastreamento de compras em tempo real', included: true },
        { text: 'Suporte prioritário 24/7', included: true },
        { text: 'IA com automação inteligente', included: false },
        { text: 'Base de conhecimento + FAQ público', included: false },
        { text: 'Help Center personalizado', included: false },
        { text: 'Tags automáticas por produto', included: false },
        { text: 'Dashboards customizados', included: false },
      ],
      cta: 'Assinar Professional',
      highlight: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: FaBolt,
      tagline: 'Poder máximo',
      description: 'Para grandes operações e agências',
      monthlyPrice: 397,
      annualPrice: 3970, // ~2 meses grátis
      badge: 'PERSONALIZADO',
      badgeColor: 'bg-gradient-to-r from-emerald-400 to-teal-500',
      color: 'from-purple-500 to-purple-600',
      features: [
        { text: 'Tudo do Professional +', included: true, bold: true },
        { text: 'IA com automação inteligente', included: true, highlight: true },
        { text: 'Tags automáticas por produto', included: true, highlight: true },
        { text: 'Base de conhecimento completa + FAQ público', included: true },
        { text: 'Help Center personalizado', included: true },
        { text: 'Dashboards customizados', included: true },
        { text: 'Múltiplas empresas/projetos ilimitados', included: true, highlight: true },
        { text: 'Acesso a novas funcionalidades', included: true, highlight: true },
        { text: 'Webhooks e API customizados', included: true },
        { text: 'Integrações personalizadas sob demanda', included: true },
        { text: 'SLA de 99.9% uptime garantido', included: true },
        { text: 'Domínio customizado para Help Center', included: true },
        { text: 'Suporte VIP', included: true, highlight: true },
      ],
      cta: 'Falar com especialista',
      highlight: false
    }
  ];

  const benefits = [
    { icon: FaShieldAlt, title: 'Garantia de 7 dias', description: 'Teste sem riscos. Não gostou? Devolvemos 100%' },
    { icon: FaCreditCard, title: 'Kiwify, Hotmart e futuras', description: 'Integrações nativas com plataformas de pagamento' },
    { icon: FaWhatsapp, title: 'Todos os canais', description: 'WhatsApp, Instagram, Facebook e mais' },
    { icon: FaBrain, title: 'IA com automação', description: 'Respostas inteligentes e tags automáticas' },
    { icon: FaBook, title: 'Help Center completo', description: 'FAQ público profissional para seus clientes' },
    { icon: FaChartLine, title: 'CRM visual', description: 'Pipeline drag & drop e relatórios em tempo real' },
    { icon: FaSync, title: 'Sincronização automática', description: 'Vendas e dados atualizados em tempo real' },
    { icon: FaHeadset, title: 'Suporte', description: 'Atendimento humanizado quando precisar' },
  ];

  const faqs = [
    {
      question: 'Quantas integrações de pagamento posso conectar?',
      answer: 'No Starter você pode conectar até 2 integrações. No Professional e Enterprise, integrações ilimitadas incluindo Kiwify, Hotmart e todas as futuras plataformas que adicionarmos.'
    },
    {
      question: 'Como funciona a sincronização com Kiwify e Hotmart?',
      answer: 'Ao conectar, a plataforma puxa automaticamente: dados dos clientes, valor de vendas, tipo de compra (vitalícia/anual/mensal), reembolsos e cria tags automáticas baseadas nos produtos que você vende. Tudo em tempo real via webhook.'
    },
    {
      question: 'Qual a diferença entre os canais de atendimento nos planos?',
      answer: 'Starter: 1 canal (WhatsApp OU Instagram). Professional: integração com TODOS os canais disponíveis (WhatsApp, Instagram, Facebook) + WhatsApp Business API. Enterprise: tudo do Professional + configurações avançadas.'
    },
    {
      question: 'O que é o Help Center e como funciona?',
      answer: 'É um site de FAQ público profissional onde você publica artigos de ajuda. Seus clientes acessam via widget no seu site ou URL dedicada. Reduz até 70% dos atendimentos repetitivos. Disponível no Professional e Enterprise.'
    },
    {
      question: 'Posso criar múltiplas empresas?',
      answer: 'Starter e Professional: 1 empresa. Enterprise: empresas ilimitadas, cada uma com dashboard, equipe e configurações isoladas. Ideal para agências que gerenciam múltiplos clientes.'
    },
    {
      question: 'Como funciona a IA e automação?',
      answer: 'No Professional e Enterprise, a IA cria tags automáticas, sugere respostas, automatiza atendimentos e gera relatórios inteligentes. Economiza horas de trabalho manual e melhora a experiência do cliente.'
    },
    {
      question: 'Posso mudar de plano depois?',
      answer: 'Sim! Você pode fazer upgrade ou downgrade a qualquer momento. Fazemos ajuste proporcional no valor. Sem multas ou burocracia.'
    },
    {
      question: 'Qual a diferença entre mensal e anual?',
      answer: 'No anual você economiza 17% (equivalente a 2 meses grátis). Mensal oferece mais flexibilidade. Ambos têm 7 dias de garantia total com reembolso sem perguntas.'
    }
  ];

  const getPrice = (plan) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : Math.round(plan.annualPrice / 12);
  };

  const getSavings = (plan) => {
    const monthlyTotal = plan.monthlyPrice * 12;
    const savings = monthlyTotal - plan.annualPrice;
    return savings;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/40 to-indigo-50/40 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      {/* Header */}
      <div className="relative overflow-hidden">
        {/* Background decoration - Melhorado */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          {/* Badge com animação */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 rounded-full shadow-xl mb-8 border-2 border-purple-200 dark:border-purple-700 animate-fade-in-up">
            <div className="relative">
              <FaFire className="text-orange-500 w-5 h-5 animate-pulse" />
              <div className="absolute inset-0 bg-orange-500 blur-md opacity-50 animate-pulse"></div>
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              🎉 Oferta de Lançamento • Vagas Limitadas
            </span>
          </div>

          {/* Title com melhor hierarquia */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight animate-fade-in-up delay-100">
            Toda sua operação
            <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent">
                em um único lugar
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 400 12" fill="none">
                <path d="M0 6 Q100 0, 200 6 T400 6" stroke="url(#gradient)" strokeWidth="4" fill="none"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#9333ea" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
            <strong className="text-gray-900 dark:text-white">Kiwify + Hotmart</strong> integrados.
            <strong className="text-gray-900 dark:text-white"> IA automática</strong> que trabalha por você.
            <strong className="text-gray-900 dark:text-white"> Todos os canais</strong> unificados.
            Zero complicação.
          </p>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-8 mb-10 animate-fade-in-up delay-300 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white dark:border-gray-900 flex items-center justify-center text-white font-bold text-sm">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900 dark:text-white">500+ empresas</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">já confiam na plataforma</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <FaStar key={i} className="w-4 h-4" />
                ))}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900 dark:text-white">4.9/5.0</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">avaliação média</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Platform Preview - Melhorado */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
            <FaLightbulb className="text-purple-600 dark:text-purple-400 w-4 h-4" />
            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
              Demonstração da Plataforma
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
            Veja a <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">mágica acontecer</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Interface premium, profissional e extremamente fácil de usar.
            <strong className="text-gray-900 dark:text-white"> Zero curva de aprendizado.</strong>
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Dashboard Preview */}
          <div className="group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <div className="absolute top-4 right-4 z-10">
              <span className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full shadow-lg">
                ⚡ Popular
              </span>
            </div>
            <div className="aspect-video bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop&q=80"
                alt="Dashboard com métricas em tempo real"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-indigo-600/30 group-hover:from-purple-600/20 group-hover:to-indigo-600/20 transition-all duration-500"></div>
              <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FaChartLine className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Dashboard em Tempo Real</h3>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Analytics Avançado</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Métricas completas de vendas, conversão e performance. Gráficos interativos que atualizam em tempo real.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <FaCheckCircle className="text-emerald-500 w-3 h-3" />
                Atualização instantânea
              </div>
            </div>
          </div>

          {/* CRM Preview */}
          <div className="group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <div className="absolute top-4 right-4 z-10">
              <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
                🎯 Essencial
              </span>
            </div>
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop&q=80"
                alt="CRM com pipeline visual drag and drop"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-cyan-600/30 group-hover:from-blue-600/20 group-hover:to-cyan-600/20 transition-all duration-500"></div>
              <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FaUsers className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">CRM Visual</h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Gestão de Vendas</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Pipeline drag & drop intuitivo. Mova negociações entre etapas com um clique e nunca perca uma venda.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <FaCheckCircle className="text-emerald-500 w-3 h-3" />
                Arraste e solte
              </div>
            </div>
          </div>

          {/* Integrations Preview */}
          <div className="group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <div className="absolute top-4 right-4 z-10">
              <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
                🔌 Conectado
              </span>
            </div>
            <div className="aspect-video bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop&q=80"
                alt="Integrações com Kiwify, Hotmart e outras plataformas"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 to-teal-600/30 group-hover:from-emerald-600/20 group-hover:to-teal-600/20 transition-all duration-500"></div>
              <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FaPlug className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Integrações Nativas</h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Kiwify • Hotmart</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Conecte em 2 cliques. Sincronização automática de vendas, clientes e produtos em tempo real.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <FaCheckCircle className="text-emerald-500 w-3 h-3" />
                Setup em 2 minutos
              </div>
            </div>
          </div>

          {/* Inbox Preview */}
          <div className="group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <div className="absolute top-4 right-4 z-10">
              <span className="px-3 py-1 bg-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                💬 Multi-canal
              </span>
            </div>
            <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-100 dark:from-purple-900/30 dark:to-purple-900/30 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&h=450&fit=crop&q=80"
                alt="Inbox unificado com WhatsApp, Instagram e Facebook"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-purple-600/30 group-hover:from-purple-600/20 group-hover:to-purple-600/20 transition-all duration-500"></div>
              <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FaComments className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Inbox Unificado</h3>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">WhatsApp • Instagram • FB</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Todos os atendimentos em uma única caixa. Responda de onde estiver, nunca perca uma mensagem.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <FaCheckCircle className="text-emerald-500 w-3 h-3" />
                Resposta em segundos
              </div>
            </div>
          </div>

          {/* Knowledge Base Preview */}
          <div className="group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <div className="absolute top-4 right-4 z-10">
              <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg">
                📚 Profissional
              </span>
            </div>
            <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=450&fit=crop&q=80"
                alt="Help Center com base de conhecimento e FAQ público"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/30 to-orange-600/30 group-hover:from-amber-600/20 group-hover:to-orange-600/20 transition-all duration-500"></div>
              <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FaBook className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Help Center</h3>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">FAQ Público</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Site de FAQ profissional para seus clientes. Reduz até 70% dos atendimentos repetitivos.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <FaCheckCircle className="text-emerald-500 w-3 h-3" />
                Menos atendimento manual
              </div>
            </div>
          </div>

          {/* IA Preview */}
          <div className="group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <div className="absolute top-4 right-4 z-10">
              <span className="px-3 py-1 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-lg">
                🤖 IA Poderosa
              </span>
            </div>
            <div className="aspect-video bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop&q=80"
                alt="IA integrada com automações e respostas inteligentes"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 to-purple-600/30 group-hover:from-violet-600/20 group-hover:to-purple-600/20 transition-all duration-500"></div>
              <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FaBrain className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">IA Integrada</h3>
                  <p className="text-xs text-violet-600 dark:text-violet-400 font-semibold">Automação Inteligente</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                IA que cria tags, sugere respostas e automatiza tarefas. Trabalha 24/7 enquanto você dorme.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <FaCheckCircle className="text-emerald-500 w-3 h-3" />
                Economia de horas diárias
              </div>
            </div>
          </div>
        </div>

        {/* CTA para ver demo */}
        <div className="text-center">
          <button
            onClick={() => onNavigate && onNavigate('register')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            <FaRocket className="w-5 h-5" />
            Experimentar gratuitamente
          </button>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            7 dias de garantia • Cancele quando quiser
          </p>
        </div>
      </div>

      {/* Plans Grid - Completamente Redesenhado */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
            Escolha o plano ideal para
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"> escalar suas vendas</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Comece com 7 dias de garantia. Cancele quando quiser. Sem burocracia.
          </p>

          {/* Billing Toggle - Junto dos Planos */}
          <div className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-2xl border-2 border-purple-200 dark:border-purple-700 mb-6">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/50 scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              💳 Mensal
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 relative ${
                billingCycle === 'annual'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/50 scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              💎 Anual
              <span className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse flex items-center gap-1">
                <FaGem className="w-3 h-3" />
                -17%
              </span>
            </button>
          </div>

          {/* Benefício do anual destacado */}
          {billingCycle === 'annual' && (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl mb-4 animate-fade-in-up">
              <FaCheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <p className="text-emerald-700 dark:text-emerald-300 font-bold">
                🎉 Economize até R$ 2.364/ano com o plano anual!
              </p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = getPrice(plan);
            const savings = getSavings(plan);

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl transition-all duration-500 group ${
                  plan.highlight
                    ? 'bg-gradient-to-b from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 shadow-2xl ring-4 ring-purple-500 dark:ring-purple-400 lg:scale-110 z-10 hover:scale-110 lg:hover:scale-[1.12]'
                    : 'bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl hover:scale-105'
                }`}
              >
                {/* Glow effect no hover */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/0 to-indigo-500/0 group-hover:from-purple-500/10 group-hover:to-indigo-500/10 transition-all duration-500"></div>

                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                    <span className={`inline-flex items-center gap-2 px-6 py-2.5 ${plan.badgeColor} text-white text-xs font-bold rounded-full shadow-2xl animate-pulse`}>
                      <FaAward className="w-4 h-4" />
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="relative p-8">
                  {/* Icon & Name - Melhorado */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="text-white text-3xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">{plan.name}</h3>
                      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <FaStar className="w-3 h-3 text-yellow-500" />
                        {plan.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Description - Melhorada */}
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Price - Redesenhado */}
                  <div className="mb-6 pb-6 border-b-2 border-gray-100 dark:border-gray-700">
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                        R$ {billingCycle === 'monthly' ? plan.monthlyPrice + 50 : Math.round((plan.annualPrice + 600) / 12)}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-6xl font-black bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        {price}
                      </span>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 text-lg font-semibold">R$</span>
                        <span className="text-gray-500 dark:text-gray-400 text-lg">/mês</span>
                      </div>
                    </div>
                    {billingCycle === 'annual' && savings > 0 && (
                      <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                        <FaCheckCircle className="text-emerald-500 w-5 h-5" />
                        <p className="text-sm text-emerald-700 dark:text-emerald-400 font-bold">
                          Economize R$ {savings}/ano com plano anual!
                        </p>
                      </div>
                    )}
                    {billingCycle === 'annual' && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        💳 Cobrado R$ {plan.annualPrice} anualmente
                      </p>
                    )}
                  </div>

                  {/* CTA Button - Melhorado */}
                  <button
                    onClick={() => {
                      // Salvar plano escolhido no AppContext (que salva no localStorage automaticamente)
                      updateSubscription(plan.id);
                      // Navegar para o dashboard
                      onNavigate && onNavigate('dashboard');
                    }}
                    className={`w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 mb-8 group/btn relative overflow-hidden ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105'
                        : 'bg-gradient-to-r from-gray-800 to-gray-700 dark:from-gray-700 dark:to-gray-600 text-white hover:from-gray-700 hover:to-gray-600 shadow-xl hover:scale-105'
                    }`}
                  >
                    <span className="relative z-10">{plan.cta}</span>
                    <FaArrowRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                    {plan.highlight && (
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
                    )}
                  </button>

                  {/* Features - Completamente Redesenhado */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                      <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                        Recursos Inclusos
                      </p>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                    </div>

                    {plan.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 transition-all duration-200 ${
                          !feature.included ? 'opacity-30' : ''
                        } ${feature.highlight ? 'bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-purple-900/20 -mx-3 px-3 py-2 rounded-xl border-2 border-purple-200 dark:border-purple-700' : ''}`}
                      >
                        {feature.included ? (
                          <div className="relative shrink-0 mt-0.5">
                            <FaCheckCircle className="w-5 h-5 text-emerald-500 relative z-10" />
                            <div className="absolute inset-0 bg-emerald-500 blur-sm opacity-30"></div>
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 shrink-0 mt-0.5 bg-gray-50 dark:bg-gray-800"></div>
                        )}
                        <span className={`text-sm leading-relaxed flex items-center flex-wrap gap-2 ${
                          feature.bold ? 'font-extrabold text-gray-900 dark:text-white text-base' : 'font-medium'
                        } ${
                          feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500 line-through'
                        } ${feature.highlight ? 'font-bold text-purple-900 dark:text-purple-100' : ''}`}>
                          <span>{feature.text}</span>
                          {feature.highlight && (
                            <span className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md font-bold shadow-sm whitespace-nowrap">Destaque</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits - Redesenhado */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="relative bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/30 dark:from-gray-800 dark:via-purple-900/10 dark:to-indigo-900/10 rounded-3xl p-8 md:p-16 shadow-2xl overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6">
                <FaHeart className="text-purple-600 dark:text-purple-400 w-4 h-4" />
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  Por que escolher nossa plataforma?
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                Tudo que você precisa em
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"> um único lugar</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Integre vendas, unifique atendimentos e automatize tudo com IA. <br className="hidden md:block" />
                <strong className="text-gray-900 dark:text-white">Zero complicação. Máxima eficiência.</strong>
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <div key={idx} className="text-center group">
                    <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 mb-5 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                      <Icon className="text-white text-3xl relative z-10" />
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
                    </div>
                    <h3 className="font-extrabold text-lg text-gray-900 dark:text-white mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ - Redesenhado */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-6">
            <FaLightbulb className="text-indigo-600 dark:text-indigo-400 w-4 h-4" />
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              Dúvidas Respondidas
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Ainda tem dúvidas?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Respondemos as perguntas mais comuns sobre a plataforma
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group border-2 border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700">
              <summary className="font-bold text-lg text-gray-900 dark:text-white cursor-pointer list-none flex items-center justify-between gap-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                <span className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0 group-hover:bg-purple-500 transition-colors">
                    <span className="text-purple-600 dark:text-purple-400 group-hover:text-white font-bold text-sm">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  {faq.question}
                </span>
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0 group-hover:bg-purple-500 transition-all">
                  <FaArrowRight className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:text-white transition-transform group-open:rotate-90" />
                </div>
              </summary>
              <div className="mt-6 pt-6 border-t-2 border-gray-100 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>

        {/* Ainda tem dúvidas */}
        <div className="mt-12 text-center p-8 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-700">
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Não encontrou sua resposta?
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Nossa equipe de suporte está pronta para ajudar você
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            <FaHeadset className="w-5 h-5" />
            Falar com suporte
          </button>
        </div>
      </div>

      {/* Final CTA - Completamente Redesenhado */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="relative bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl overflow-hidden">
          {/* Background decoration - Melhorado */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}></div>

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8 border border-white/30">
              <FaRocket className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-bold text-white">
                Junte-se a 500+ empresas de sucesso
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Pronto para transformar
              <br />
              <span className="text-yellow-300">sua operação de vendas?</span>
            </h2>

            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
              Pare de perder tempo com ferramentas separadas.
              <br className="hidden md:block" />
              <strong className="text-white">Centralize tudo e venda mais em menos tempo.</strong>
            </p>

            {/* Stats Grid - Melhorado */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <p className="text-4xl font-black text-yellow-300 mb-2">8+</p>
                <p className="text-sm text-purple-100 font-semibold">Integrações<br />Nativas</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <p className="text-4xl font-black text-yellow-300 mb-2">∞</p>
                <p className="text-sm text-purple-100 font-semibold">Canais<br />Disponíveis</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <p className="text-4xl font-black text-yellow-300 mb-2">24/7</p>
                <p className="text-sm text-purple-100 font-semibold">Sincronização<br />Automática</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <p className="text-4xl font-black text-yellow-300 mb-2">70%</p>
                <p className="text-sm text-purple-100 font-semibold">Menos<br />Atendimentos</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button
                onClick={() => onNavigate && onNavigate('register')}
                className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-purple-600 rounded-2xl font-black text-xl shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all"
              >
                <FaRocket className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Começar agora grátis
                <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="inline-flex items-center gap-2 px-8 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all">
                <FaHeadset className="w-5 h-5" />
                Falar com especialista
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-purple-100 font-semibold">
              <span className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <FaCheckCircle className="text-white w-4 h-4" />
                </div>
                7 dias de garantia total
              </span>
              <span className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <FaCheckCircle className="text-white w-4 h-4" />
                </div>
                Sem fidelidade ou multa
              </span>
              <span className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <FaCheckCircle className="text-white w-4 h-4" />
                </div>
                Cancele quando quiser
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Skip Option - Melhorado */}
      <div className="max-w-4xl mx-auto px-6 pb-20 text-center">
        <div className="inline-block p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Quer apenas dar uma olhada primeiro?
          </p>
          <button
            onClick={() => {
              // Salvar status de trial no AppContext (que salva no localStorage automaticamente)
              updateSubscription('trial');
              onNavigate && onNavigate('dashboard');
            }}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 text-sm font-bold transition-all group"
          >
            <FaRocket className="w-4 h-4" />
            Explorar em modo visualização
            <FaArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 max-w-md">
            Você poderá navegar e visualizar todas as funcionalidades da plataforma em modo somente leitura
          </p>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
