import React, { useState } from 'react';
import { FaPlus, FaBell, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAdminContext } from '../../../context/AdminContext';
import { BANNER_TYPES, BANNER_COLORS } from '../../../utils/constants';
import { validateBannerData } from '../../../utils/validators';

/**
 * Gerenciamento de Banners
 * CRUD completo de banners e avisos
 */
export const BannersManagement = () => {
  const { platformSettings, addBanner, updateBanner, deleteBanner } = useAdminContext();
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const handleAdd = () => {
    setEditingBanner(null);
    setShowModal(true);
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setShowModal(true);
  };

  const handleToggleActive = (banner) => {
    updateBanner(banner.id, { active: !banner.active });
  };

  const handleDelete = (bannerId) => {
    if (confirm('Tem certeza que deseja deletar este banner?')) {
      deleteBanner(bannerId);
    }
  };

  const bannerIcons = {
    info: FaBell,
    warning: FaExclamationTriangle,
    success: FaCheckCircle,
    error: FaTimesCircle
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Banners e Avisos
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gerencie banners exibidos na plataforma
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-gradient-to-r from-purple-500 to-purple-600 text-white
                     hover:from-purple-600 hover:to-purple-700
                     shadow-lg shadow-purple-500/30 transition-all"
        >
          <FaPlus className="w-4 h-4" />
          <span className="font-medium">Adicionar Banner</span>
        </button>
      </div>

      {/* Lista de Banners */}
      <div className="space-y-4">
        {platformSettings.banners.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <FaBell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum banner criado ainda
            </p>
            <button
              onClick={handleAdd}
              className="mt-4 text-purple-600 dark:text-purple-400 hover:underline"
            >
              Criar primeiro banner
            </button>
          </div>
        ) : (
          platformSettings.banners.map((banner) => {
            const Icon = bannerIcons[banner.type];
            const colors = BANNER_COLORS[banner.type];

            return (
              <div
                key={banner.id}
                className={`bg-white dark:bg-gray-800 rounded-xl border-l-4 ${colors.border}
                           border-r border-t border-b border-gray-200 dark:border-gray-700 p-6
                           ${!banner.active ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start gap-4">
                  {/* Ícone */}
                  <div className={`p-3 rounded-lg ${colors.bg}`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1">
                    {banner.title && (
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {banner.title}
                      </h4>
                    )}
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {banner.message}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Tipo:</span>
                        {banner.type}
                      </span>
                      {banner.display?.position && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Posição:</span>
                          {banner.display.position === 'top' ? 'Topo' : 'Rodapé'}
                        </span>
                      )}
                      {banner.display?.dismissible && (
                        <span className="text-green-600 dark:text-green-400">
                          Dismissível
                        </span>
                      )}
                      {banner.display?.autoHide && (
                        <span>
                          Auto-hide: {banner.display.autoHideDelay / 1000}s
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title={banner.active ? 'Desativar' : 'Ativar'}
                    >
                      {banner.active ? (
                        <FaEye className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <FaEyeSlash className="w-4 h-4 text-gray-400" />
                      )}
                    </button>

                    <button
                      onClick={() => handleEdit(banner)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title="Editar"
                    >
                      <FaEdit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>

                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Deletar"
                    >
                      <FaTrash className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <BannerModal
          banner={editingBanner}
          onClose={() => setShowModal(false)}
          onSave={(bannerData) => {
            if (editingBanner) {
              updateBanner(editingBanner.id, bannerData);
            } else {
              addBanner(bannerData);
            }
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

/**
 * Modal de Criar/Editar Banner
 */
const BannerModal = ({ banner, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    banner || {
      type: 'info',
      title: '',
      message: '',
      icon: 'FaBell',
      action: {
        enabled: false,
        text: '',
        link: ''
      },
      display: {
        pages: ['all'],
        position: 'top',
        dismissible: true,
        autoHide: false,
        autoHideDelay: 5000
      },
      active: true,
      startDate: null,
      endDate: null
    }
  );

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateBannerData(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {banner ? 'Editar Banner' : 'Adicionar Banner'}
          </h3>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="info">Informação (Azul)</option>
              <option value="warning">Aviso (Amarelo)</option>
              <option value="success">Sucesso (Verde)</option>
              <option value="error">Erro (Vermelho)</option>
            </select>
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título (opcional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Título do banner"
            />
          </div>

          {/* Mensagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mensagem *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Mensagem do banner"
            />
            {errors.message && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.message}</p>
            )}
          </div>

          {/* Botão de Ação */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={formData.action.enabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    action: { ...formData.action, enabled: e.target.checked }
                  })
                }
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Adicionar Botão de Ação
              </span>
            </label>

            {formData.action.enabled && (
              <div className="space-y-3 ml-6 mt-3">
                <input
                  type="text"
                  value={formData.action.text}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      action: { ...formData.action, text: e.target.value }
                    })
                  }
                  placeholder="Texto do botão"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                             bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={formData.action.link}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      action: { ...formData.action, link: e.target.value }
                    })
                  }
                  placeholder="Link (URL ou rota)"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                             bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Configurações de Exibição */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Configurações de Exibição
            </h4>

            {/* Posição */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Posição
              </label>
              <select
                value={formData.display.position}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    display: { ...formData.display, position: e.target.value }
                  })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                           bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="top">Topo da página</option>
                <option value="bottom">Rodapé da página</option>
              </select>
            </div>

            {/* Dismissível */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.display.dismissible}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    display: { ...formData.display, dismissible: e.target.checked }
                  })
                }
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Permitir fechar banner
              </span>
            </label>

            {/* Auto-hide */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.display.autoHide}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    display: { ...formData.display, autoHide: e.target.checked }
                  })
                }
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Ocultar automaticamente
              </span>
            </label>

            {formData.display.autoHide && (
              <div className="ml-6">
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Delay (segundos)
                </label>
                <input
                  type="number"
                  value={formData.display.autoHideDelay / 1000}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display: {
                        ...formData.display,
                        autoHideDelay: parseInt(e.target.value) * 1000
                      }
                    })
                  }
                  min={1}
                  max={30}
                  className="w-32 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                             bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg
                         bg-gradient-to-r from-purple-500 to-purple-600 text-white
                         hover:from-purple-600 hover:to-purple-700
                         font-medium transition-all"
            >
              {banner ? 'Salvar Alterações' : 'Criar Banner'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg
                         bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                         hover:bg-gray-200 dark:hover:bg-gray-600
                         font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(BannersManagement);
