import React, { useState } from 'react';
import {
  FaCrown,
  FaRocket,
  FaBriefcase,
  FaStar,
  FaShieldAlt,
  FaKey,
  FaEnvelope,
  FaRandom,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { PLAN_INFO } from '../../../utils/constants';
import { formatCurrency } from '../../../utils/formatters';

/**
 * Tab de Configurações do Usuário
 * Gerenciar plano, permissões e senha
 */
const ConfigTab = ({ user, isNewUser }) => {
  const [selectedPlan, setSelectedPlan] = useState(user?.plano || 'free');
  const [permissions, setPermissions] = useState({
    accessDashboard: true,
    manageContacts: true,
    manageCRM: true,
    viewReports: user?.role === 'admin',
    manageIntegrations: user?.role === 'admin',
    manageTeam: user?.role === 'admin',
  });

  // Gerenciamento de Senha
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const planIcons = {
    free: FaStar,
    starter: FaRocket,
    professional: FaBriefcase,
    enterprise: FaCrown,
  };

  const handleTogglePermission = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Gerador de senha forte
  const generateStrongPassword = () => {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setNewPassword(password);
    setConfirmPassword(password);
    setPasswordError('');
  };

  // Validar força da senha
  const validatePasswordStrength = (password) => {
    if (password.length < 8) return 'Senha deve ter no mínimo 8 caracteres';
    if (!/[A-Z]/.test(password)) return 'Senha deve ter pelo menos uma letra maiúscula';
    if (!/[a-z]/.test(password)) return 'Senha deve ter pelo menos uma letra minúscula';
    if (!/[0-9]/.test(password)) return 'Senha deve ter pelo menos um número';
    if (!/[!@#$%^&*]/.test(password)) return 'Senha deve ter pelo menos um caractere especial';
    return '';
  };

  const handleChangePassword = () => {
    // Validar senhas
    const strengthError = validatePasswordStrength(newPassword);
    if (strengthError) {
      setPasswordError(strengthError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }

    // TODO: Integrar com API para alterar senha
    console.log('Alterando senha para usuário:', user?.id);

    // Sincronização de plano
    if (user?.isOwner) {
      console.log('Usuário é proprietário - atualizando plano da empresa também');
      // TODO: Atualizar plano da empresa
    } else {
      console.log('Usuário é apenas membro - não altera plano da empresa');
    }

    setShowPasswordModal(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };

  const handleSendPasswordReset = () => {
    // TODO: Integrar com API para enviar email de redefinição
    console.log('Enviando email de redefinição para:', user?.email);
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const handlePlanChange = (newPlan) => {
    setSelectedPlan(newPlan);

    // Sincronização de plano
    if (user?.isOwner) {
      console.log('Usuário é proprietário - alterando plano da empresa também');
      // TODO: Atualizar plano da empresa
    } else {
      console.log('Usuário é apenas membro - não altera plano da empresa');
    }
  };

  return (
    <div className="space-y-6">
      {/* Gerenciamento de Senha */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-750 dark:to-gray-700 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-2 mb-4">
          <FaKey className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Gerenciamento de Senha
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <FaShieldAlt className="w-4 h-4" />
            <p>A senha do usuário está protegida e não pode ser visualizada</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors font-medium"
            >
              <FaKey className="w-4 h-4" />
              Alterar Senha
            </button>

            <button
              onClick={handleSendPasswordReset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors font-medium"
            >
              <FaEnvelope className="w-4 h-4" />
              Enviar Redefinição por Email
            </button>

            <button
              onClick={generateStrongPassword}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors font-medium"
            >
              <FaRandom className="w-4 h-4" />
              Gerar Senha Forte
            </button>
          </div>

          {emailSent && (
            <div className="flex items-center gap-2 p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
              <FaCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                Email de redefinição enviado com sucesso!
              </p>
            </div>
          )}

          {/* Informações de Segurança */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mt-3">
            <div className="flex items-start gap-2">
              <FaExclamationTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-yellow-700 dark:text-yellow-300">
                <p className="font-medium mb-1">Requisitos de Senha Forte:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Mínimo de 8 caracteres</li>
                  <li>Pelo menos uma letra maiúscula</li>
                  <li>Pelo menos uma letra minúscula</li>
                  <li>Pelo menos um número</li>
                  <li>Pelo menos um caractere especial (!@#$%^&*)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sincronização de Plano */}
      {user?.isOwner && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <FaCrown className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-300 mb-1">
                Proprietário de Empresa
              </p>
              <p className="text-blue-700 dark:text-blue-400">
                Alterações de plano deste usuário serão sincronizadas com a empresa vinculada.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plano */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Plano de Assinatura
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(PLAN_INFO).map(([key, info]) => {
            const Icon = planIcons[key];
            const isSelected = selectedPlan === key;

            return (
              <button
                key={key}
                onClick={() => handlePlanChange(key)}
                className={`
                  p-4 rounded-xl border-2 transition-all text-left
                  ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${info.color} mb-2`} />
                <p className="font-semibold text-gray-900 dark:text-white mb-1">{info.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {info.price === 0 ? 'Grátis' : formatCurrency(info.price)}
                  {info.price > 0 && '/mês'}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Permissões */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FaShieldAlt className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Permissões de Acesso
          </h3>
        </div>
        <div className="space-y-3">
          {Object.entries(permissions).map(([key, value]) => {
            const labels = {
              accessDashboard: 'Acessar Dashboard',
              manageContacts: 'Gerenciar Contatos',
              manageCRM: 'Gerenciar CRM',
              viewReports: 'Visualizar Relatórios',
              manageIntegrations: 'Gerenciar Integrações',
              manageTeam: 'Gerenciar Equipe',
            };

            return (
              <div
                key={key}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 rounded-xl"
              >
                <p className="font-medium text-gray-900 dark:text-white">{labels[key]}</p>
                <button
                  onClick={() => handleTogglePermission(key)}
                  className={`
                    relative w-12 h-6 rounded-full transition-colors
                    ${value ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}
                  `}
                >
                  <span
                    className={`
                      absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform
                      ${value ? 'translate-x-6' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Alteração de Senha */}
      {showPasswordModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm z-50"
            onClick={() => setShowPasswordModal(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <FaKey className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Alterar Senha
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user?.name || 'Usuário'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Nova Senha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nova Senha *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setPasswordError('');
                      }}
                      className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-750 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Digite a nova senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? (
                        <FaEyeSlash className="w-4 h-4" />
                      ) : (
                        <FaEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirmar Senha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirmar Senha *
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError('');
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-750 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Confirme a nova senha"
                  />
                </div>

                {/* Erro */}
                {passwordError && (
                  <div className="flex items-center gap-2 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                    <FaExclamationTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-300">{passwordError}</p>
                  </div>
                )}

                {/* Botões */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleChangePassword}
                    disabled={!newPassword || !confirmPassword}
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/30 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Alterar Senha
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(ConfigTab);
