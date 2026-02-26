import React, { useState } from 'react';
import { FaShieldAlt, FaClock, FaLock, FaKey, FaUserShield } from 'react-icons/fa';

/**
 * Configurações de Segurança
 * 2FA, políticas de senha, sessão, etc.
 */
const SecuritySettings = () => {
  const [security, setSecurity] = useState({
    requireTwoFactor: false,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expirationDays: 90,
    },
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    ipWhitelist: false,
    auditLog: true,
  });

  const handleToggle = (field) => {
    setSettings(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePolicyChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      passwordPolicy: {
        ...prev.passwordPolicy,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    console.log('Salvar configurações de segurança:', security);
    // TODO: Salvar no backend
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Configurações de Segurança
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configure políticas de segurança e autenticação
        </p>
      </div>

      {/* Autenticação de Dois Fatores */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaUserShield className="w-5 h-5 text-purple-500" />
          <h4 className="font-semibold text-gray-900 dark:text-white">
            Autenticação de Dois Fatores (2FA)
          </h4>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              Exigir 2FA para todos os usuários
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Adiciona camada extra de segurança via SMS ou aplicativo
            </p>
          </div>
          <button
            onClick={() => handleToggle('requireTwoFactor')}
            className={`
              relative w-12 h-6 rounded-full transition-colors
              ${security.requireTwoFactor ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}
            `}
          >
            <span
              className={`
                absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform
                ${security.requireTwoFactor ? 'translate-x-6' : 'translate-x-0'}
              `}
            />
          </button>
        </div>
      </div>

      {/* Política de Senhas */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaKey className="w-5 h-5 text-purple-500" />
          <h4 className="font-semibold text-gray-900 dark:text-white">
            Política de Senhas
          </h4>
        </div>

        <div className="space-y-4">
          {/* Comprimento Mínimo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Comprimento Mínimo: {security.passwordPolicy.minLength} caracteres
            </label>
            <input
              type="range"
              min="6"
              max="20"
              value={security.passwordPolicy.minLength}
              onChange={(e) => handlePolicyChange('minLength', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Requisitos */}
          <div className="space-y-3">
            {[
              { key: 'requireUppercase', label: 'Exigir letras maiúsculas' },
              { key: 'requireLowercase', label: 'Exigir letras minúsculas' },
              { key: 'requireNumbers', label: 'Exigir números' },
              { key: 'requireSpecialChars', label: 'Exigir caracteres especiais (!@#$%...)' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                <p className="text-sm text-gray-900 dark:text-white">{label}</p>
                <button
                  onClick={() => handlePolicyChange(key, !security.passwordPolicy[key])}
                  className={`
                    relative w-12 h-6 rounded-full transition-colors
                    ${security.passwordPolicy[key] ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}
                  `}
                >
                  <span
                    className={`
                      absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform
                      ${security.passwordPolicy[key] ? 'translate-x-6' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Expiração */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Expiração de Senha (dias)
            </label>
            <select
              value={security.passwordPolicy.expirationDays}
              onChange={(e) => handlePolicyChange('expirationDays', parseInt(e.target.value))}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="0">Nunca expira</option>
              <option value="30">30 dias</option>
              <option value="60">60 dias</option>
              <option value="90">90 dias</option>
              <option value="180">180 dias</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sessão e Tentativas de Login */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaClock className="w-5 h-5 text-purple-500" />
          <h4 className="font-semibold text-gray-900 dark:text-white">
            Sessão e Bloqueios
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Timeout de Sessão */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Timeout de Sessão (min)
            </label>
            <input
              type="number"
              value={security.sessionTimeout}
              onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Tentativas Máximas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tentativas de Login
            </label>
            <input
              type="number"
              value={security.maxLoginAttempts}
              onChange={(e) => setSettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Duração do Bloqueio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bloqueio (minutos)
            </label>
            <input
              type="number"
              value={security.lockoutDuration}
              onChange={(e) => setSettings(prev => ({ ...prev, lockoutDuration: parseInt(e.target.value) }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Recursos Adicionais */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaLock className="w-5 h-5 text-purple-500" />
          <h4 className="font-semibold text-gray-900 dark:text-white">
            Recursos Adicionais
          </h4>
        </div>

        <div className="space-y-3">
          {/* IP Whitelist */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Whitelist de IPs
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Restringir acesso por endereço IP
              </p>
            </div>
            <button
              onClick={() => handleToggle('ipWhitelist')}
              className={`
                relative w-12 h-6 rounded-full transition-colors
                ${security.ipWhitelist ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}
              `}
            >
              <span
                className={`
                  absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform
                  ${security.ipWhitelist ? 'translate-x-6' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          {/* Audit Log */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Log de Auditoria
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Registrar todas as ações administrativas
              </p>
            </div>
            <button
              onClick={() => handleToggle('auditLog')}
              className={`
                relative w-12 h-6 rounded-full transition-colors
                ${security.auditLog ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}
              `}
            >
              <span
                className={`
                  absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform
                  ${security.auditLog ? 'translate-x-6' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Salvar */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600
                     text-white hover:from-purple-600 hover:to-purple-700
                     transition-all shadow-lg shadow-purple-500/30 font-medium"
        >
          <div className="flex items-center gap-2">
            <FaShieldAlt className="w-4 h-4" />
            <span>Salvar Configurações</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default React.memo(SecuritySettings);
