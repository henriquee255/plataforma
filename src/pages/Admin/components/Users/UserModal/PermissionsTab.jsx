import React, { useState } from 'react';
import {
  FaCheck,
  FaTimes,
  FaLock,
  FaUnlock,
  FaShieldAlt,
  FaCrown,
  FaUserShield,
  FaUser,
} from 'react-icons/fa';

/**
 * Tab de Permissões do Usuário
 * Gerenciar permissões granulares
 */
const PermissionsTab = ({ user, isNewUser }) => {
  const [role, setRole] = useState(user?.role || 'member');
  const [department, setDepartment] = useState(user?.department || '');

  // Permissões disponíveis organizadas por módulo
  const permissionModules = [
    {
      name: 'Dashboard',
      permissions: [
        { id: 'dashboard.view', label: 'Visualizar Dashboard', enabled: true },
        { id: 'dashboard.edit', label: 'Editar Dashboard', enabled: role !== 'member' },
      ],
    },
    {
      name: 'CRM',
      permissions: [
        { id: 'crm.view', label: 'Visualizar CRM', enabled: true },
        { id: 'crm.create', label: 'Criar Leads', enabled: true },
        { id: 'crm.edit', label: 'Editar Leads', enabled: true },
        { id: 'crm.delete', label: 'Deletar Leads', enabled: role === 'owner' || role === 'admin' },
        { id: 'crm.export', label: 'Exportar Dados', enabled: role !== 'member' },
      ],
    },
    {
      name: 'Contatos',
      permissions: [
        { id: 'contacts.view', label: 'Visualizar Contatos', enabled: true },
        { id: 'contacts.create', label: 'Criar Contatos', enabled: true },
        { id: 'contacts.edit', label: 'Editar Contatos', enabled: true },
        { id: 'contacts.delete', label: 'Deletar Contatos', enabled: role !== 'member' },
        { id: 'contacts.import', label: 'Importar Contatos', enabled: role !== 'member' },
        { id: 'contacts.export', label: 'Exportar Contatos', enabled: role !== 'member' },
      ],
    },
    {
      name: 'Inbox',
      permissions: [
        { id: 'inbox.view', label: 'Visualizar Inbox', enabled: true },
        { id: 'inbox.send', label: 'Enviar Mensagens', enabled: true },
        { id: 'inbox.delete', label: 'Deletar Mensagens', enabled: role !== 'member' },
        { id: 'inbox.assign', label: 'Atribuir Conversas', enabled: role !== 'member' },
      ],
    },
    {
      name: 'Equipe',
      permissions: [
        { id: 'team.view', label: 'Visualizar Equipe', enabled: true },
        { id: 'team.invite', label: 'Convidar Membros', enabled: role !== 'member' },
        { id: 'team.edit', label: 'Editar Membros', enabled: role !== 'member' },
        { id: 'team.remove', label: 'Remover Membros', enabled: role === 'owner' || role === 'admin' },
        { id: 'team.manage_roles', label: 'Gerenciar Roles', enabled: role === 'owner' },
      ],
    },
    {
      name: 'Integrações',
      permissions: [
        { id: 'integrations.view', label: 'Visualizar Integrações', enabled: role !== 'member' },
        { id: 'integrations.create', label: 'Criar Integrações', enabled: role !== 'member' },
        { id: 'integrations.edit', label: 'Editar Integrações', enabled: role !== 'member' },
        { id: 'integrations.delete', label: 'Deletar Integrações', enabled: role === 'owner' || role === 'admin' },
      ],
    },
    {
      name: 'Relatórios',
      permissions: [
        { id: 'reports.view', label: 'Visualizar Relatórios', enabled: true },
        { id: 'reports.create', label: 'Criar Relatórios', enabled: role !== 'member' },
        { id: 'reports.export', label: 'Exportar Relatórios', enabled: role !== 'member' },
      ],
    },
    {
      name: 'Configurações',
      permissions: [
        { id: 'settings.view', label: 'Visualizar Configurações', enabled: true },
        { id: 'settings.general', label: 'Configurações Gerais', enabled: role !== 'member' },
        { id: 'settings.billing', label: 'Billing', enabled: role === 'owner' },
        { id: 'settings.security', label: 'Segurança', enabled: role !== 'member' },
        { id: 'settings.api', label: 'API', enabled: role === 'owner' || role === 'admin' },
      ],
    },
    {
      name: 'Empresa',
      permissions: [
        { id: 'company.view', label: 'Visualizar Empresa', enabled: true },
        { id: 'company.edit', label: 'Editar Empresa', enabled: role !== 'member' },
        { id: 'company.delete', label: 'Deletar Empresa', enabled: role === 'owner' },
      ],
    },
  ];

  const getRoleIcon = (roleType) => {
    switch (roleType) {
      case 'owner':
        return <FaCrown className="text-yellow-500" />;
      case 'admin':
        return <FaUserShield className="text-purple-500" />;
      case 'member':
        return <FaUser className="text-blue-500" />;
      default:
        return <FaUser className="text-gray-400" />;
    }
  };

  const getRoleColor = (roleType) => {
    switch (roleType) {
      case 'owner':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700';
      case 'admin':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-700';
      case 'member':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Selection */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Role do Usuário
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['owner', 'admin', 'member'].map((roleType) => (
            <button
              key={roleType}
              onClick={() => setRole(roleType)}
              className={`p-4 rounded-xl border-2 transition-all ${
                role === roleType
                  ? getRoleColor(roleType) + ' shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-750 flex items-center justify-center">
                  {getRoleIcon(roleType)}
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 dark:text-white capitalize">
                    {roleType === 'owner' ? 'Owner' : roleType === 'admin' ? 'Admin' : 'Membro'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {roleType === 'owner' && 'Controle total'}
                    {roleType === 'admin' && 'Gerenciamento'}
                    {roleType === 'member' && 'Acesso limitado'}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Department Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Departamento
        </label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Nenhum</option>
          <option value="vendas">Vendas</option>
          <option value="suporte">Suporte</option>
          <option value="marketing">Marketing</option>
          <option value="financeiro">Financeiro</option>
          <option value="ti">TI</option>
        </select>
      </div>

      {/* Permissions List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Permissões Detalhadas
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <FaShieldAlt className="w-4 h-4" />
            <span>Baseado no role: {role}</span>
          </div>
        </div>

        <div className="space-y-4">
          {permissionModules.map((module) => (
            <div
              key={module.name}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Module Header */}
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                <h4 className="font-bold text-gray-900 dark:text-white">
                  {module.name}
                </h4>
              </div>

              {/* Permissions */}
              <div className="p-4 space-y-2">
                {module.permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {permission.label}
                    </span>

                    <div className="flex items-center gap-2">
                      {permission.enabled ? (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                          <FaCheck className="w-3 h-3" />
                          <span className="text-xs font-medium">Permitido</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                          <FaTimes className="w-3 h-3" />
                          <span className="text-xs font-medium">Negado</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <FaLock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-yellow-900 dark:text-yellow-300 mb-1">
              Atenção
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Apenas o Owner pode alterar permissões de outros Owners. Admins podem gerenciar Members.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PermissionsTab);
