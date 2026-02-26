import { useState, useCallback } from 'react';

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'warning',
    onConfirm: () => {},
  });

  const confirm = useCallback(({
    title = 'Confirmar ação',
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'warning',
  }) => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        type,
        onConfirm: () => {
          resolve(true);
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
        },
      });
    });
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    confirmState,
    confirm,
    closeConfirm,
  };
};
