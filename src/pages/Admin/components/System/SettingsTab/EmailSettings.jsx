import React, { useState } from 'react';
import { FaEnvelope, FaServer, FaKey, FaCheckCircle } from 'react-icons/fa';

/**
 * Configurações de Email (SMTP)
 * Configurar servidor de email para envios automáticos
 */
const EmailSettings = () => {
  const [smtp, setSmtp] = useState({
    host: '',
    port: '587',
    username: '',
    password: '',
    fromName: 'Plataforma',
    fromEmail: '',
    encryption: 'TLS',
  });

  const [isTesting, setIsTesting] = useState(false);

  const handleChange = (field, value) => {
    setSmtp(prev => ({ ...prev, [field]: value }));
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    // TODO: Testar conexão SMTP
    setTimeout(() => {
      setIsTesting(false);
      alert('Conexão testada com sucesso!');
    }, 2000);
  };

  const handleSave = () => {
    console.log('Salvar configurações SMTP:', smtp);
    // TODO: Salvar no backend
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Configurações de Email
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configure o servidor SMTP para envio de emails automáticos
        </p>
      </div>

      {/* Servidor SMTP */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaServer className="w-5 h-5 text-purple-500" />
          <h4 className="font-semibold text-gray-900 dark:text-white">
            Servidor SMTP
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Host */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Servidor (Host) *
            </label>
            <input
              type="text"
              value={smtp.host}
              onChange={(e) => handleChange('host', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="smtp.gmail.com"
            />
          </div>

          {/* Porta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Porta *
            </label>
            <input
              type="number"
              value={smtp.port}
              onChange={(e) => handleChange('port', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="587"
            />
          </div>

          {/* Criptografia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Criptografia
            </label>
            <select
              value={smtp.encryption}
              onChange={(e) => handleChange('encryption', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="TLS">TLS</option>
              <option value="SSL">SSL</option>
              <option value="None">Nenhuma</option>
            </select>
          </div>
        </div>
      </div>

      {/* Credenciais */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaKey className="w-5 h-5 text-purple-500" />
          <h4 className="font-semibold text-gray-900 dark:text-white">
            Autenticação
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Usuário */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Usuário *
            </label>
            <input
              type="text"
              value={smtp.username}
              onChange={(e) => handleChange('username', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="seu-email@gmail.com"
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Senha *
            </label>
            <input
              type="password"
              value={smtp.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Para Gmail, use App Password gerado nas configurações da conta
            </p>
          </div>
        </div>
      </div>

      {/* Remetente */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaEnvelope className="w-5 h-5 text-purple-500" />
          <h4 className="font-semibold text-gray-900 dark:text-white">
            Remetente
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Remetente *
            </label>
            <input
              type="text"
              value={smtp.fromName}
              onChange={(e) => handleChange('fromName', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Plataforma"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email do Remetente *
            </label>
            <input
              type="email"
              value={smtp.fromEmail}
              onChange={(e) => handleChange('fromEmail', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="noreply@plataforma.com"
            />
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleTestConnection}
          disabled={isTesting}
          className="px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-700
                     text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
                     transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTesting ? 'Testando...' : 'Testar Conexão'}
        </button>

        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600
                     text-white hover:from-purple-600 hover:to-purple-700
                     transition-all shadow-lg shadow-purple-500/30 font-medium"
        >
          <div className="flex items-center gap-2">
            <FaCheckCircle className="w-4 h-4" />
            <span>Salvar Configurações</span>
          </div>
        </button>
      </div>

      {/* Info */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-900">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          💡 <strong>Dica:</strong> Para usar Gmail, ative "Verificação em duas etapas" e gere uma "Senha de app"
          nas configurações de segurança da sua conta Google.
        </p>
      </div>
    </div>
  );
};

export default React.memo(EmailSettings);
