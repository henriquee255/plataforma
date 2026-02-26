import React, { useState } from 'react';
import { FaCog, FaBell, FaLock, FaPalette } from 'react-icons/fa';

/**
 * Tab de Configurações da Empresa
 * Preferências e configurações específicas
 */
const SettingsTab = ({ company }) => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false,
    },
    security: {
      twoFactor: false,
      ipWhitelist: false,
      sessionTimeout: '30',
    },
    preferences: {
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      dateFormat: 'DD/MM/YYYY',
    },
  });

  const handleToggle = (category, key) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key],
      },
    }));
  };

  const handleSelectChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Notificações */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FaBell className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notificações
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 rounded-xl">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Notificações por Email
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receber atualizações por email
              </p>
            </div>
            <button
              onClick={() => handleToggle('notifications', 'email')}
              className={`
                relative w-12 h-6 rounded-full transition-colors
                ${settings.notifications.email ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}
              `}
            >
              <span
                className={`
                  absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform
                  ${settings.notifications.email ? 'translate-x-6' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 rounded-xl">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Notificações Push
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receber notificações no navegador
              </p>
            </div>
            <button
              onClick={() => handleToggle('notifications', 'push')}
              className={`
                relative w-12 h-6 rounded-full transition-colors
                ${settings.notifications.push ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}
              `}
            >
              <span
                className={`
                  absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform
                  ${settings.notifications.push ? 'translate-x-6' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 rounded-xl">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Notificações por SMS
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receber SMS em situações críticas
              </p>
            </div>
            <button
              onClick={() => handleToggle('notifications', 'sms')}
              className={`
                relative w-12 h-6 rounded-full transition-colors
                ${settings.notifications.sms ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}
              `}
            >
              <span
                className={`
                  absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform
                  ${settings.notifications.sms ? 'translate-x-6' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Segurança */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FaLock className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Segurança
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 rounded-xl">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Autenticação de Dois Fatores
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Exigir 2FA para todos os membros
              </p>
            </div>
            <button
              onClick={() => handleToggle('security', 'twoFactor')}
              className={`
                relative w-12 h-6 rounded-full transition-colors
                ${settings.security.twoFactor ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}
              `}
            >
              <span
                className={`
                  absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform
                  ${settings.security.twoFactor ? 'translate-x-6' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 rounded-xl">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Whitelist de IPs
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Restringir acesso por endereço IP
              </p>
            </div>
            <button
              onClick={() => handleToggle('security', 'ipWhitelist')}
              className={`
                relative w-12 h-6 rounded-full transition-colors
                ${settings.security.ipWhitelist ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}
              `}
            >
              <span
                className={`
                  absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform
                  ${settings.security.ipWhitelist ? 'translate-x-6' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-xl">
            <label className="block font-medium text-gray-900 dark:text-white mb-2">
              Timeout de Sessão (minutos)
            </label>
            <select
              value={settings.security.sessionTimeout}
              onChange={(e) => handleSelectChange('security', 'sessionTimeout', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
              <option value="60">1 hora</option>
              <option value="120">2 horas</option>
              <option value="0">Nunca expirar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preferências */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FaPalette className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Preferências
          </h3>
        </div>
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-xl">
            <label className="block font-medium text-gray-900 dark:text-white mb-2">
              Idioma
            </label>
            <select
              value={settings.preferences.language}
              onChange={(e) => handleSelectChange('preferences', 'language', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
            </select>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-xl">
            <label className="block font-medium text-gray-900 dark:text-white mb-2">
              Fuso Horário
            </label>
            <select
              value={settings.preferences.timezone}
              onChange={(e) => handleSelectChange('preferences', 'timezone', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
              <option value="America/New_York">New York (GMT-5)</option>
              <option value="Europe/London">London (GMT+0)</option>
            </select>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-xl">
            <label className="block font-medium text-gray-900 dark:text-white mb-2">
              Formato de Data
            </label>
            <select
              value={settings.preferences.dateFormat}
              onChange={(e) => handleSelectChange('preferences', 'dateFormat', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SettingsTab);
