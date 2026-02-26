import React, { useState } from 'react';
import { FaTimes, FaBuilding, FaSpinner } from 'react-icons/fa';
import { useSubscription } from '../../contexts/SubscriptionContext';

/**
 * Modal para Criar Nova Empresa
 */
const CreateCompanyModal = ({ onClose }) => {
  const { createCompany, canCreateCompany, plan } = useSubscription();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Nome da empresa é obrigatório');
      return;
    }

    if (!canCreateCompany) {
      setError('Você atingiu o limite de empresas do seu plano. Faça upgrade!');
      return;
    }

    setLoading(true);

    try {
      const result = await createCompany(formData);

      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Erro ao criar empresa');
      }
    } catch (err) {
      setError(err.message || 'Erro ao criar empresa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <FaBuilding className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Nova Empresa
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome da Empresa *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Tech Corp"
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                disabled={loading}
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descrição (opcional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva sua empresa..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                disabled={loading}
              />
            </div>

            {/* Limite Info */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
              <div className="text-sm text-purple-900 dark:text-purple-300">
                <strong>Plano {plan}:</strong>
                {plan === 'free' && ' Você precisa assinar para criar empresas'}
                {plan === 'starter' && ' Você pode criar até 1 empresa'}
                {plan === 'professional' && ' Você pode criar até 3 empresas'}
                {plan === 'enterprise' && ' Você pode criar até 5 empresas'}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <div className="text-sm text-red-900 dark:text-red-300">{error}</div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                disabled={loading}
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading || !canCreateCompany}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/30 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && <FaSpinner className="w-4 h-4 animate-spin" />}
                {loading ? 'Criando...' : 'Criar Empresa'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateCompanyModal;
