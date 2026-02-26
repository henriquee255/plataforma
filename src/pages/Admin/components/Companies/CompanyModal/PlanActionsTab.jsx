import React, { useState } from 'react';
import { FaCrown, FaRocket, FaBriefcase, FaStar, FaBan, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import PlanBadge from '../../Shared/PlanBadge';
import { PLAN_INFO } from '../../../utils/constants';
import { formatCurrency } from '../../../utils/formatters';

/**
 * Tab de Plano & Ações da Empresa
 * Gerenciar plano e ações administrativas
 */
const PlanActionsTab = ({ company }) => {
  const [selectedPlan, setSelectedPlan] = useState(company?.plano || 'free');

  const planIcons = {
    free: FaStar,
    starter: FaRocket,
    professional: FaBriefcase,
    enterprise: FaCrown,
  };

  const handleChangePlan = () => {
    console.log('Trocar plano para:', selectedPlan);
    // TODO: Implementar troca de plano
  };

  const handleSuspend = () => {
    if (confirm('Tem certeza que deseja suspender esta empresa?')) {
      console.log('Suspender empresa');
      // TODO: Implementar suspensão
    }
  };

  const handleDelete = () => {
    if (confirm('ATENÇÃO: Esta ação é irreversível. Deseja realmente excluir esta empresa e todos os seus dados?')) {
      console.log('Deletar empresa');
      // TODO: Implementar exclusão
    }
  };

  return (
    <div className="space-y-6">
      {/* Plano Atual */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Plano Atual
        </h3>
        <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-750 dark:to-gray-700 rounded-xl border border-purple-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <PlanBadge plan={company?.plano} showIcon />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                MRR: <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(company?.mrr || 0)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trocar Plano */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Trocar Plano
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(PLAN_INFO).map(([key, info]) => {
            const Icon = planIcons[key];
            const isSelected = selectedPlan === key;
            const isCurrent = company?.plano === key;

            return (
              <button
                key={key}
                onClick={() => setSelectedPlan(key)}
                disabled={isCurrent}
                className={`
                  p-4 rounded-xl border-2 transition-all text-left
                  ${isCurrent
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 cursor-not-allowed'
                    : isSelected
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                  }
                `}
              >
                <div className="flex items-start justify-between mb-2">
                  <Icon className={`w-5 h-5 ${info.color}`} />
                  {isCurrent && (
                    <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                      Atual
                    </span>
                  )}
                </div>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">
                  {info.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {info.price === 0 ? 'Grátis' : formatCurrency(info.price)}
                  {info.price > 0 && '/mês'}
                </p>
              </button>
            );
          })}
        </div>

        {selectedPlan !== company?.plano && (
          <button
            onClick={handleChangePlan}
            className="mt-4 w-full px-4 py-2 rounded-lg bg-purple-500 text-white
                       hover:bg-purple-600 transition-colors font-medium"
          >
            Confirmar Troca de Plano
          </button>
        )}
      </div>

      {/* Ações Administrativas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Ações Administrativas
        </h3>
        <div className="space-y-3">
          {/* Suspender/Ativar */}
          {company?.status === 'Ativo' ? (
            <button
              onClick={handleSuspend}
              className="w-full p-4 rounded-xl border border-yellow-200 dark:border-yellow-900
                         bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30
                         transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <FaBan className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <div className="flex-1">
                  <p className="font-semibold text-yellow-900 dark:text-yellow-300">
                    Suspender Empresa
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-500">
                    Bloqueia acesso temporariamente
                  </p>
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={() => console.log('Ativar empresa')}
              className="w-full p-4 rounded-xl border border-green-200 dark:border-green-900
                         bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30
                         transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <FaCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <p className="font-semibold text-green-900 dark:text-green-300">
                    Ativar Empresa
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-500">
                    Restaura acesso completo
                  </p>
                </div>
              </div>
            </button>
          )}

          {/* Deletar */}
          <button
            onClick={handleDelete}
            className="w-full p-4 rounded-xl border border-red-200 dark:border-red-900
                       bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30
                       transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <div className="flex-1">
                <p className="font-semibold text-red-900 dark:text-red-300">
                  Excluir Empresa
                </p>
                <p className="text-sm text-red-700 dark:text-red-500">
                  Ação irreversível! Remove todos os dados
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PlanActionsTab);
