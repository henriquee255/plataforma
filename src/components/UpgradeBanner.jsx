import React from 'react';
import { FaCrown, FaRocket, FaTimes } from 'react-icons/fa';

const UpgradeBanner = ({ feature, requiredPlan = 'Professional', onClose, onNavigate }) => {
  const planInfo = {
    starter: {
      name: 'Starter',
      color: 'from-blue-500 to-cyan-500',
      icon: FaRocket
    },
    professional: {
      name: 'Professional',
      color: 'from-purple-500 to-indigo-600',
      icon: FaCrown
    },
    enterprise: {
      name: 'Enterprise',
      color: 'from-purple-500 to-purple-600',
      icon: FaCrown
    }
  };

  const plan = planInfo[requiredPlan.toLowerCase()] || planInfo.professional;
  const Icon = plan.icon;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative animate-scale-in">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
            aria-label="Fechar"
          >
            <FaTimes className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        )}

        {/* Icon */}
        <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-xl`}>
          <Icon className="text-white text-4xl" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-4">
          Funcionalidade Premium
        </h2>

        {/* Description */}
        <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-2">
          <strong className="text-gray-900 dark:text-white">{feature}</strong> está disponível apenas no plano
        </p>
        <p className="text-center mb-8">
          <span className={`text-2xl font-black bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
            {plan.name}
          </span>
          <span className="text-gray-600 dark:text-gray-400"> ou superior</span>
        </p>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 mb-8">
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">
            ✨ Ao fazer upgrade você também terá acesso a:
          </p>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span>Integrações ilimitadas com Kiwify e Hotmart</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span>Todos os canais de atendimento (WhatsApp, Instagram, Facebook)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span>Relatórios avançados e automações inteligentes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span>Suporte prioritário 24/7</span>
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onNavigate && onNavigate('subscription')}
            className={`flex-1 py-4 rounded-xl font-bold text-white bg-gradient-to-r ${plan.color} shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2`}
          >
            <FaCrown className="w-5 h-5" />
            Ver planos e preços
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-xl font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              Continuar no plano atual
            </button>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          7 dias de garantia • Cancele quando quiser
        </p>
      </div>
    </div>
  );
};

export default UpgradeBanner;
