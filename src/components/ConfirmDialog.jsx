import React from 'react';
import { FaExclamationTriangle, FaTimes, FaCheck } from 'react-icons/fa';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', type = 'warning' }) => {
  if (!isOpen) return null;

  const colors = {
    warning: 'from-amber-500 to-amber-600',
    danger: 'from-red-500 to-red-600',
    info: 'from-blue-500 to-blue-600',
    success: 'from-emerald-500 to-emerald-600'
  };

  const icons = {
    warning: <FaExclamationTriangle className="text-5xl text-amber-500" />,
    danger: <FaExclamationTriangle className="text-5xl text-red-500" />,
    info: <FaExclamationTriangle className="text-5xl text-blue-500" />,
    success: <FaCheck className="text-5xl text-emerald-500" />
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full shadow-2xl border-2 border-gray-200 dark:border-gray-800 transform transition-all animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${colors[type]} p-6 rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              {icons[type]}
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Fechar"
            >
              <FaTimes className="text-white" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 px-6 py-3 bg-gradient-to-r ${colors[type]} text-white rounded-xl font-semibold hover:shadow-lg transition-all`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
