import React from 'react';

/**
 * Componente para anúncios de screen reader (WCAG 2.1 AA)
 * Usa aria-live para anunciar mudanças dinâmicas
 *
 * @param {string} message - Mensagem a ser anunciada
 * @param {string} priority - 'polite' (padrão) ou 'assertive'
 * @param {string} role - 'status' (padrão) ou 'alert'
 */
const ScreenReaderAnnouncer = ({
  message,
  priority = 'polite',
  role = 'status'
}) => {
  if (!message) return null;

  return (
    <div
      role={role}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};

export default ScreenReaderAnnouncer;
