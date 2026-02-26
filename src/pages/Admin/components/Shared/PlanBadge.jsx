import React from 'react';
import { FaStar, FaRocket, FaBriefcase, FaCrown } from 'react-icons/fa';
import { getPlanColor, getPlanInfo } from '../../utils/adminHelpers';

/**
 * Badge de Plano
 * Exibe plano com ícone e cor correspondente
 *
 * @param {Object} props
 * @param {string} props.plan - Plano (free, starter, professional, enterprise)
 * @param {boolean} props.showIcon - Mostrar ícone (padrão: true)
 * @param {string} props.className - Classes adicionais
 * @returns {JSX.Element}
 */
export const PlanBadge = ({ plan, showIcon = true, className = '' }) => {
  if (!plan) return null;

  const planInfo = getPlanInfo(plan);
  const colorClasses = getPlanColor(plan);

  const icons = {
    free: FaStar,
    starter: FaRocket,
    professional: FaBriefcase,
    enterprise: FaCrown
  };

  const Icon = icons[plan.toLowerCase()] || FaStar;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses} ${className}`}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      {planInfo.name}
    </span>
  );
};

export default PlanBadge;
