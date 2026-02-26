import React, { useState } from 'react';
import { FaPalette, FaEye } from 'react-icons/fa';
import { useAdminContext } from '../../../context/AdminContext';

/**
 * Customização de Tema
 * Color picker para cores primárias e secundárias
 */
const ThemeCustomization = () => {
  const { platformSettings, updateThemeColors } = useAdminContext();
  const [colors, setColors] = useState({
    primary: platformSettings.theme.primary || '#9333ea',
    secondary: platformSettings.theme.secondary || '#a855f7',
  });

  const presets = [
    { name: 'Purple', primary: '#9333ea', secondary: '#a855f7' },
    { name: 'Blue', primary: '#3b82f6', secondary: '#60a5fa' },
    { name: 'Green', primary: '#10b981', secondary: '#34d399' },
    { name: 'Orange', primary: '#f97316', secondary: '#fb923c' },
    { name: 'Pink', primary: '#ec4899', secondary: '#f472b6' },
    { name: 'Teal', primary: '#14b8a6', secondary: '#2dd4bf' },
  ];

  const handleColorChange = (type, value) => {
    setColors(prev => ({ ...prev, [type]: value }));
  };

  const handleApply = () => {
    updateThemeColors(colors);
    // Aplicar ao CSS
    document.documentElement.style.setProperty('--color-primary', colors.primary);
    document.documentElement.style.setProperty('--color-secondary', colors.secondary);
  };

  const handlePreset = (preset) => {
    setColors({ primary: preset.primary, secondary: preset.secondary });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Personalização de Cores
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Customize as cores principais da plataforma
        </p>
      </div>

      {/* Presets */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
          Temas Predefinidos
        </h4>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePreset(preset)}
              className="group relative"
              title={preset.name}
            >
              <div
                className="w-full aspect-square rounded-xl transition-transform group-hover:scale-110 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${preset.primary} 0%, ${preset.secondary} 100%)`,
                }}
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                {preset.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Color Pickers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cor Primária */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            Cor Primária
          </h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={colors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="w-16 h-16 rounded-lg border-2 border-gray-200 dark:border-gray-700 cursor-pointer"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                             bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                  placeholder="#9333ea"
                />
              </div>
            </div>
            <div
              className="w-full h-12 rounded-lg"
              style={{ backgroundColor: colors.primary }}
            />
          </div>
        </div>

        {/* Cor Secundária */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            Cor Secundária
          </h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={colors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="w-16 h-16 rounded-lg border-2 border-gray-200 dark:border-gray-700 cursor-pointer"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                             bg-white dark:bg-gray-750 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                  placeholder="#a855f7"
                />
              </div>
            </div>
            <div
              className="w-full h-12 rounded-lg"
              style={{ backgroundColor: colors.secondary }}
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-750 rounded-xl border border-purple-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaEye className="w-5 h-5 text-purple-500" />
          <h4 className="font-semibold text-gray-900 dark:text-white">
            Preview do Tema
          </h4>
        </div>
        <div className="space-y-3">
          {/* Botão com gradiente */}
          <button
            className="px-6 py-3 rounded-lg text-white font-medium shadow-lg transition-all hover:scale-105"
            style={{
              background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
            }}
          >
            Botão de Ação
          </button>

          {/* Badge */}
          <div className="inline-block px-4 py-2 rounded-full text-white font-medium text-sm"
            style={{ backgroundColor: colors.primary }}
          >
            Badge Primário
          </div>

          {/* Card com gradiente */}
          <div
            className="p-6 rounded-xl text-white"
            style={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            }}
          >
            <h5 className="font-bold text-lg mb-2">Card de Exemplo</h5>
            <p className="opacity-90">Visualize como as cores ficam em componentes reais</p>
          </div>
        </div>
      </div>

      {/* Aplicar */}
      <div className="flex justify-end">
        <button
          onClick={handleApply}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600
                     text-white hover:from-purple-600 hover:to-purple-700
                     transition-all shadow-lg shadow-purple-500/30 font-medium"
        >
          <div className="flex items-center gap-2">
            <FaPalette className="w-4 h-4" />
            <span>Aplicar Tema</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default React.memo(ThemeCustomization);
