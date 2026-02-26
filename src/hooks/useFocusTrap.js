import { useEffect, useRef } from 'react';

/**
 * Hook customizado para implementar focus trap em modais (WCAG 2.1 AA)
 *
 * @param {boolean} isActive - Se o focus trap está ativo
 * @returns {object} - Ref para o container do modal
 */
export const useFocusTrap = (isActive) => {
  const containerRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    // Salvar elemento com foco antes do modal abrir
    previousActiveElement.current = document.activeElement;

    const container = containerRef.current;
    if (!container) return;

    // Focar primeiro elemento focável do modal
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Handler para tab trap
    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      const focusableContent = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstFocusable = focusableContent[0];
      const lastFocusable = focusableContent[focusableContent.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    // Cleanup: restaurar foco ao elemento anterior
    return () => {
      container.removeEventListener('keydown', handleTabKey);
      if (previousActiveElement.current && previousActiveElement.current.focus) {
        previousActiveElement.current.focus();
      }
    };
  }, [isActive]);

  return containerRef;
};
