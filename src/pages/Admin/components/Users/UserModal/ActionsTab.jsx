import React from 'react';
import { FaBan, FaCheckCircle, FaKey, FaTrash, FaEnvelope, FaExclamationTriangle } from 'react-icons/fa';

/**
 * Tab de Ações do Usuário
 * Ações administrativas críticas
 */
const ActionsTab = ({ user, isNewUser }) => {
  if (isNewUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          As ações estarão disponíveis após criar o usuário
        </p>
      </div>
    );
  }

  const handleResetPassword = () => {
    if (confirm('Enviar email de redefinição de senha para o usuário?')) {
      console.log('Reset password for:', user.id);
      // TODO: Implementar
    }
  };

  const handleSuspend = () => {
    if (confirm('Tem certeza que deseja suspender este usuário?')) {
      console.log('Suspend user:', user.id);
      // TODO: Implementar
    }
  };

  const handleActivate = () => {
    console.log('Activate user:', user.id);
    // TODO: Implementar
  };

  const handleDelete = () => {
    if (confirm('ATENÇÃO: Esta ação é irreversível. Deseja realmente excluir este usuário?')) {
      console.log('Delete user:', user.id);
      // TODO: Implementar
    }
  };

  const handleSendEmail = () => {
    console.log('Send email to:', user.email);
    // TODO: Implementar
  };

  return (
    <div className="space-y-4">
      {/* Redefinir Senha */}
      <button
        onClick={handleResetPassword}
        className="w-full p-4 rounded-xl border border-blue-200 dark:border-blue-900
                   bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30
                   transition-colors text-left group"
      >
        <div className="flex items-center gap-3">
          <FaKey className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div className="flex-1">
            <p className="font-semibold text-blue-900 dark:text-blue-300">
              Redefinir Senha
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-500">
              Envia email com link de redefinição
            </p>
          </div>
        </div>
      </button>

      {/* Enviar Email */}
      <button
        onClick={handleSendEmail}
        className="w-full p-4 rounded-xl border border-purple-200 dark:border-purple-900
                   bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30
                   transition-colors text-left group"
      >
        <div className="flex items-center gap-3">
          <FaEnvelope className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <div className="flex-1">
            <p className="font-semibold text-purple-900 dark:text-purple-300">
              Enviar Email
            </p>
            <p className="text-sm text-purple-700 dark:text-purple-500">
              Enviar email personalizado para o usuário
            </p>
          </div>
        </div>
      </button>

      {/* Suspender/Ativar */}
      {user?.status === 'Ativo' ? (
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
                Suspender Usuário
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-500">
                Bloqueia acesso temporariamente
              </p>
            </div>
          </div>
        </button>
      ) : (
        <button
          onClick={handleActivate}
          className="w-full p-4 rounded-xl border border-green-200 dark:border-green-900
                     bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30
                     transition-colors text-left group"
        >
          <div className="flex items-center gap-3">
            <FaCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div className="flex-1">
              <p className="font-semibold text-green-900 dark:text-green-300">
                Ativar Usuário
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
              Excluir Usuário
            </p>
            <p className="text-sm text-red-700 dark:text-red-500">
              Ação irreversível! Remove todos os dados
            </p>
          </div>
        </div>
      </button>

      {/* Warning */}
      <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ⚠️ <strong>Importante:</strong> Algumas ações são irreversíveis.
          Certifique-se antes de executar ações críticas.
        </p>
      </div>
    </div>
  );
};

export default React.memo(ActionsTab);
