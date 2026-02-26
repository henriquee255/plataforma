import React from 'react';
import { FaEye, FaCrown, FaTimes } from 'react-icons/fa';
import { useAppContext } from '../contexts/AppContext';

const TrialBanner = ({ onNavigate }) => {
  const { subscriptionStatus, updateSubscription } = useAppContext();
  const [dismissed, setDismissed] = React.useState(() => {
    return localStorage.getItem('trialBannerDismissed') === 'true';
  });

  if (subscriptionStatus !== 'trial' || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('trialBannerDismissed', 'true');
  };

  return (
    <div className="relative mb-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-6 shadow-lg">
      {/* Close button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400 transition-all"
        aria-label="Fechar"
      >
        <FaTimes className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
          <FaEye className="text-white text-2xl" />
        </div>

        {/* Content */}
        <div className="flex-1 pr-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            Modo Visualização Ativo
            <span className="text-xs px-2 py-1 bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 rounded-full font-semibold">
              TRIAL
            </span>
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            Você está explorando a plataforma no <strong>modo visualização</strong>.
            Navegue livremente e conheça todas as funcionalidades, mas não será possível criar, editar ou integrar.
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-3 mb-4">
            <div className="flex items-start gap-2 text-xs">
              <div className="mt-0.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700 dark:text-gray-300">Visualizar todos os módulos</span>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <div className="mt-0.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700 dark:text-gray-300">Editar seu perfil</span>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <div className="mt-0.5 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <span className="text-gray-700 dark:text-gray-300">Criar ou editar dados</span>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <div className="mt-0.5 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <span className="text-gray-700 dark:text-gray-300">Conectar integrações</span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => onNavigate && onNavigate('subscription')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <FaCrown className="w-4 h-4" />
            Desbloquear acesso completo
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrialBanner;
