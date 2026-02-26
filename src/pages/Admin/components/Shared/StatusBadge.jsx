import React from 'react';
import { getStatusColor } from '../../utils/adminHelpers';

/**
 * Badge de Status
 * Componente reutilizável para exibir status com cores
 *
 * @param {Object} props
 * @param {string} props.status - Status (Ativo, Suspenso, Inativo, etc)
 * @param {string} props.className - Classes adicionais
 * @returns {JSX.Element}
 */
export const StatusBadge = ({ status, className = '' }) => {
  if (!status) return null;

  const colorClasses = getStatusColor(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses} ${className}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
