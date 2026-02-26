import React, { useRef, useState } from 'react';
import { FaImage, FaGlobe, FaUpload, FaTimes } from 'react-icons/fa';
import { useAdminContext } from '../../../context/AdminContext';
import { UPLOAD_CONFIG } from '../../../utils/constants';
import { isValidImageFormat, isValidFileSize } from '../../../utils/validators';

/**
 * Configurações de Branding
 * Logo, Nome e Favicon da plataforma
 */
export const BrandingSettings = () => {
  const { platformSettings, updateBranding } = useAdminContext();
  const [platformName, setPlatformName] = useState(platformSettings.branding.name || 'Plataforma');
  const [errors, setErrors] = useState({});

  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);

  /**
   * Upload de Logo
   */
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar formato
    if (!isValidImageFormat(file, UPLOAD_CONFIG.LOGO.acceptedFormats)) {
      setErrors({ logo: 'Formato inválido. Use PNG, JPG ou SVG.' });
      return;
    }

    // Validar tamanho
    if (!isValidFileSize(file, UPLOAD_CONFIG.LOGO.maxSize)) {
      setErrors({ logo: 'Arquivo muito grande. Máximo 2MB.' });
      return;
    }

    // Converter para base64 (ou fazer upload para servidor)
    const reader = new FileReader();
    reader.onload = (event) => {
      updateBranding({ logo: event.target.result });
      setErrors({});
    };
    reader.readAsDataURL(file);
  };

  /**
   * Upload de Favicon
   */
  const handleFaviconUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar formato
    if (!isValidImageFormat(file, UPLOAD_CONFIG.FAVICON.acceptedFormats)) {
      setErrors({ favicon: 'Formato inválido. Use ICO ou PNG.' });
      return;
    }

    // Validar tamanho
    if (!isValidFileSize(file, UPLOAD_CONFIG.FAVICON.maxSize)) {
      setErrors({ favicon: 'Arquivo muito grande. Máximo 500KB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      updateBranding({ favicon: event.target.result });
      setErrors({});
    };
    reader.readAsDataURL(file);
  };

  /**
   * Salvar nome da plataforma
   */
  const handleSaveName = () => {
    if (platformName.trim().length < 3) {
      setErrors({ name: 'Nome deve ter no mínimo 3 caracteres' });
      return;
    }

    updateBranding({ name: platformName });
    setErrors({});
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Identidade Visual
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configure o logo, nome e favicon da plataforma
        </p>
      </div>

      {/* Logo da Plataforma */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
          Logo da Plataforma
        </h4>

        <div className="flex items-start gap-6">
          {/* Preview do Logo */}
          <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-750">
            {platformSettings.branding.logo ? (
              <img
                src={platformSettings.branding.logo}
                alt="Logo"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            ) : (
              <FaImage className="w-12 h-12 text-gray-400" />
            )}
          </div>

          {/* Controles */}
          <div className="flex-1 space-y-4">
            <div>
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
                ref={logoInputRef}
              />
              <button
                onClick={() => logoInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg
                           bg-purple-500 text-white hover:bg-purple-600 transition-colors"
              >
                <FaUpload className="w-4 h-4" />
                <span className="font-medium">Fazer Upload</span>
              </button>
            </div>

            {platformSettings.branding.logo && (
              <button
                onClick={() => updateBranding({ logo: null })}
                className="flex items-center gap-2 px-4 py-2 rounded-lg
                           bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400
                           hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <FaTimes className="w-4 h-4" />
                <span className="font-medium">Remover Logo</span>
              </button>
            )}

            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>• Formatos: PNG, JPG, SVG</p>
              <p>• Tamanho máximo: 2MB</p>
              <p>• Dimensões recomendadas: 200x200px</p>
            </div>

            {errors.logo && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.logo}</p>
            )}
          </div>
        </div>
      </div>

      {/* Nome da Plataforma */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
          Nome da Plataforma
        </h4>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              onBlur={handleSaveName}
              placeholder="Nome da Plataforma"
              maxLength={50}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Este nome aparecerá na barra de título, emails e notificações
            </p>
            {errors.name && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">{errors.name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Favicon */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
          Favicon
        </h4>

        <div className="flex items-start gap-6">
          {/* Preview do Favicon */}
          <div className="w-20 h-20 rounded border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-white dark:bg-gray-750">
            {platformSettings.branding.favicon ? (
              <img
                src={platformSettings.branding.favicon}
                alt="Favicon"
                className="w-10 h-10 object-contain"
              />
            ) : (
              <FaGlobe className="w-8 h-8 text-gray-400" />
            )}
          </div>

          {/* Controles */}
          <div className="flex-1 space-y-4">
            <div>
              <input
                type="file"
                accept=".ico,.png"
                onChange={handleFaviconUpload}
                className="hidden"
                ref={faviconInputRef}
              />
              <button
                onClick={() => faviconInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg
                           bg-purple-500 text-white hover:bg-purple-600 transition-colors"
              >
                <FaUpload className="w-4 h-4" />
                <span className="font-medium">Upload Favicon</span>
              </button>
            </div>

            {platformSettings.branding.favicon && (
              <button
                onClick={() => updateBranding({ favicon: null })}
                className="flex items-center gap-2 px-4 py-2 rounded-lg
                           bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400
                           hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <FaTimes className="w-4 h-4" />
                <span className="font-medium">Remover</span>
              </button>
            )}

            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>• Formatos: ICO, PNG</p>
              <p>• Tamanho máximo: 500KB</p>
              <p>• Dimensões: 16x16, 32x32 ou 64x64px</p>
            </div>

            {errors.favicon && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.favicon}</p>
            )}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-750 rounded-xl border border-purple-200 dark:border-gray-700 p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
          Preview da Marca
        </h4>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center gap-4">
          {platformSettings.branding.logo && (
            <img
              src={platformSettings.branding.logo}
              alt="Logo Preview"
              className="h-12 object-contain"
            />
          )}
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {platformName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BrandingSettings);
