import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaCalendarAlt, FaIdCard } from 'react-icons/fa';
import PlanBadge from '../../Shared/PlanBadge';
import StatusBadge from '../../Shared/StatusBadge';
import { formatDate } from '../../../utils/formatters';

/**
 * Tab de Informações do Usuário
 */
const InfoTab = ({ user, isNewUser }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    cpf: user?.cpf || '',
    role: user?.role || 'comum',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Status e Plano (apenas visualização) */}
      {!isNewUser && (
        <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-750 dark:to-gray-700 rounded-xl">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
            <StatusBadge status={user?.status} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Plano</p>
            <PlanBadge plan={user?.plano} showIcon />
          </div>
          {user?.empresa && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Empresa</p>
              <div className="flex items-center gap-2">
                <FaBuilding className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {user.empresa}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Formulário */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <FaUser className="w-4 h-4" />
              <span>Nome Completo *</span>
            </div>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                       bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="João Silva"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <FaEnvelope className="w-4 h-4" />
              <span>Email *</span>
            </div>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                       bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="joao@exemplo.com"
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <FaPhone className="w-4 h-4" />
              <span>Telefone</span>
            </div>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                       bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="(00) 00000-0000"
          />
        </div>

        {/* CPF */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <FaIdCard className="w-4 h-4" />
              <span>CPF</span>
            </div>
          </label>
          <input
            type="text"
            value={formData.cpf}
            onChange={(e) => handleChange('cpf', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                       bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="000.000.000-00"
          />
        </div>

        {/* Tipo de Usuário */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de Usuário *
          </label>
          <select
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                       bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="comum">Comum</option>
            <option value="admin">Superadmin</option>
          </select>
        </div>
      </div>

      {/* Data de Cadastro (apenas visualização) */}
      {!isNewUser && user?.createdAt && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <FaCalendarAlt className="w-4 h-4" />
            <span>Cadastrado em {formatDate(user.createdAt, true)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(InfoTab);
