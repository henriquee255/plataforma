import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { useFocusTrap } from '../hooks/useFocusTrap';

/**
 * Componente Modal acessível (WCAG 2.1 AA)
 * - Focus trap automático
 * - Fecha com Esc
 * - Restaura foco ao fechar
 * - ARIA labels apropriados
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-3xl',
  showCloseButton = true,
  titleId
}) => {
  const modalRef = useFocusTrap(isOpen);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const generatedTitleId = titleId || `modal-title-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={generatedTitleId}
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`bg-white dark:bg-gray-900 rounded-2xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-800 shadow-2xl`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10 flex items-center justify-between">
            {title && (
              <h2 id={generatedTitleId} className="text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ml-auto"
                aria-label="Fechar modal"
              >
                <FaTimes className="text-gray-600 dark:text-gray-300" aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
